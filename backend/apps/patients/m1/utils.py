# backend/apps/patients/m1/utils.py
# backend/apps/patients/m1/utils.py
from pathlib import Path
import torch
import numpy as np
import cv2
from PIL import Image
from django.conf import settings
from pydicom.pixel_data_handlers.util import apply_modality_lut, apply_voi_lut
from .segmentation_model import build_model
from .preprocessing import preprocess_dicom
import pydicom, os
# ─── 1) 전역 모델 캐시 ────────────────────────
_model = None

def load_model(device: str = 'cpu'):
    """
    .pth state_dict를 불러와 모델 생성 → eval 모드로 캐싱
    """
    global _model
    if _model is None:
        model = build_model(n_classes=1).to(device)
        ckpt = torch.load(settings.MODEL_PATH, map_location=device)
        model.load_state_dict(ckpt, strict=False)
        model.eval()
        _model = model
    return _model


def run_segmentation(dicom_path: str) -> str:
    """
    1) 전처리 → 모델 inference → Brain ROI 적용
    2) 낮은 확률 값 영역 추출 → Morphology 정제 → PNG 저장
    """
    # 1) 전처리 및 모델 추론
    img_np = preprocess_dicom(dicom_path) 
    tensor = torch.from_numpy(img_np).unsqueeze(0).unsqueeze(0)
    model = load_model(device='cpu')
    with torch.no_grad():
        prob = torch.sigmoid(model(tensor)).squeeze().cpu().numpy()

    # 2) Brain ROI (뼈·공기 제거)
    brain_roi = (img_np > 0.1) & (img_np < 0.8) 
    prob_roi = prob.copy()
    prob_roi[~brain_roi] = 0

    # 낮은 확률 값을 흰색으로 변환
    threshold = 0.1 # Threshold 값 조정 필요
    mask = np.zeros_like(prob_roi, dtype=np.uint8)
    mask[prob_roi <= threshold] = 1

    # Morphology (선택 사항)
    kernel = np.ones((5, 5), np.uint8)  # Kernel 크기 증가
    opened = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    mask_final = (opened * 255).astype(np.uint8)
    print(f"▶ final unique values: {np.unique(mask_final)}")

    # 6) PNG 저장
    out_dir = Path(settings.MEDIA_ROOT) / 'segmented'
    out_dir.mkdir(exist_ok=True, parents=True)
    base = Path(dicom_path).stem
    out_path = out_dir / f"{base}_mask.png"
    Image.fromarray(mask_final, mode='L').save(out_path)

    return str(out_path)

# PNG로 변경 
def make_preview(dicom_path: str) -> str:
    """
    DICOM → Modality/VOI LUT 적용 → 정규화 → PNG 저장 → URL 반환
    """

    ds = pydicom.dcmread(dicom_path)
    arr = apply_modality_lut(ds.pixel_array, ds)

    try:
        arr = apply_voi_lut(arr, ds)
    except Exception:
        # 수동 윈도우 레벨링
        if hasattr(ds, 'WindowCenter') and hasattr(ds, 'WindowWidth'):
            center = float(ds.WindowCenter[0] if isinstance(ds.WindowCenter, (list,tuple)) else ds.WindowCenter)
            width  = float(ds.WindowWidth[0]  if isinstance(ds.WindowWidth,  (list,tuple)) else ds.WindowWidth)
            arr = np.clip(arr, center - width/2, center + width/2)
        else:
            arr = np.clip(arr, 35-80/2, 35+80/2)

    arr = (arr - arr.min()) / (arr.max() - arr.min()) * 255.0
    img_uint8 = arr.astype(np.uint8)
    pil = Image.fromarray(img_uint8)

    out_dir = Path(settings.MEDIA_ROOT) / 'previews'
    out_dir.mkdir(exist_ok=True, parents=True)
    base  = os.path.splitext(os.path.basename(dicom_path))[0]
    fname = f"{base}_preview.png"
    pil.save(out_dir / fname)

    return f"{settings.MEDIA_URL}previews/{fname}"
