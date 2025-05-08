# backend/apps/patients/m1/utils.py

import os
import torch
import numpy as np
import pydicom
from PIL import Image
from django.conf import settings
from pydicom.pixel_data_handlers.util import apply_modality_lut, apply_voi_lut
# segmentation_model.py 에 build_model 함수가 정의되어 있어야 합니다.
from .segmentation_model import build_model  
# 원하는 전처리 함수가 있으면 여기서 import
# from .preprocessing import preprocess_dicom  

# ─── 1) 전역 모델 캐시 ────────────────────────
_model = None

def load_model(device: str = 'cpu'):
    """
    .pth state_dict를 불러와 build_model()을 통해 모델을 생성하고
    state_dict를 씌운 뒤 eval 모드로 전환하여 _model에 캐시합니다.
    """
    global _model
    if _model is None:
        # 1) 모델 스켈레톤 생성
        model = build_model(n_classes=1).to(device)

        # 2) state_dict 로드
        state_dict = torch.load(settings.MODEL_PATH, map_location=device)

        # 3) state_dict를 모델에 씌우기
        model.load_state_dict(state_dict)

        # 4) 평가 모드 전환
        model.eval()

        # 5) 캐시에 저장
        _model = model

    return _model

# ─── 2) 실제 세그멘테이션 함수 ────────────────
def run_segmentation(dicom_path: str) -> str:
    """
    1) DICOM 파일 로드 → numpy array
    2) 전처리(필요 시 preprocess_dicom()으로 교체)
    3) Torch Tensor 변환 → 모델 inference
    4) 후처리(임계치→바이너리 마스크)
    5) MEDIA_ROOT/segmented 폴더에 PNG 저장
    6) 저장된 전체 경로 반환
    """
    # 1) DICOM 읽기
    ds = pydicom.dcmread(dicom_path)
    img_np = ds.pixel_array.astype(np.float32)

    # 2) 전처리: (원하시면 preprocess_dicom()으로 대체)
    #    img_np = preprocess_dicom(dicom_path)
    img_norm = (img_np - img_np.min()) / (img_np.max() - img_np.min())

    # 3) Tensor 변환: (H,W) → (1,1,H,W)
    tensor = torch.from_numpy(img_norm).unsqueeze(0).unsqueeze(0)

    # 4) 모델 inference
    model = load_model(device='cpu')
    with torch.no_grad():
        pred = model(tensor)                   # shape: (1,1,H,W) 또는 (1,H,W)
    mask_np = pred.squeeze().cpu().numpy()     # shape: (H,W)

    # 5) 임계치로 바이너리 마스크 생성
    mask_bin = (mask_np > 0.5).astype(np.uint8) * 255

    # 6) PIL로 변환 후 저장
    mask_img = Image.fromarray(mask_bin)
    out_dir = settings.MEDIA_ROOT / 'segmented'
    out_dir.mkdir(exist_ok=True, parents=True)
    base = os.path.splitext(os.path.basename(dicom_path))[0]
    out_path = out_dir / f"{base}_mask.png"
    mask_img.save(out_path)

    return str(out_path)

def make_preview(dicom_path: str) -> str:
    """
    1) DICOM → numpy via pydicom
    2) Modality LUT, VOI LUT (윈도우 레벨) 적용
    3) 값을 [0,255] uint8로 변환 → PNG 저장
    4) MEDIA_URL/previews/… 경로 반환
    """
    ds = pydicom.dcmread(dicom_path)

    # 1) Modality LUT (HU 단위 변환) 적용 (없어도 OK)
    arr = apply_modality_lut(ds.pixel_array, ds)

    # 2) VOI LUT (Window Center/Width) 적용
    #    DICOM에 설정된 WL/WW를 기반으로 자동 적용
    try:
        arr = apply_voi_lut(arr, ds)
    except Exception:
        # 만약 VOI LUT 태그가 없으면 수동으로 윈도우 적용
        if hasattr(ds, 'WindowCenter') and hasattr(ds, 'WindowWidth'):
            center = float(ds.WindowCenter[0] if isinstance(ds.WindowCenter, (list,tuple)) else ds.WindowCenter)
            width  = float(ds.WindowWidth[0]  if isinstance(ds.WindowWidth,  (list,tuple)) else ds.WindowWidth)
            low  = center - width/2
            high = center + width/2
            arr = np.clip(arr, low, high)
        else:
            # 기본 Brain window: WL=35, WW=80
            low, high = 35-80/2, 35+80/2
            arr = np.clip(arr, low, high)

    # 3) 정규화 → uint8
    arr = arr.astype(np.float32)
    arr = (arr - arr.min()) / (arr.max() - arr.min()) * 255.0
    img_uint8 = arr.astype(np.uint8)
    pil = Image.fromarray(img_uint8)

    # 4) 파일로 저장
    out_dir = settings.MEDIA_ROOT / 'previews'
    out_dir.mkdir(exist_ok=True, parents=True)
    base = os.path.splitext(os.path.basename(dicom_path))[0]
    fname = f"{base}_preview.png"
    out_path = out_dir / fname
    pil.save(out_path)

    # MEDIA_URL (/media/) 아래 상대 경로 반환
    return f"{settings.MEDIA_URL}previews/{fname}"