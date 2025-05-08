# backend/apps/patients/m1/preprocessing.py

import numpy as np
import pydicom
from PIL import Image

def preprocess_dicom(
    dicom_path: str,
    window_center: float = 40,
    window_width: float = 80,
    target_size: tuple[int,int] = (512,512)
) -> np.ndarray:
    """
    DICOM → 윈도우 레벨링 → 정규화 → PIL 리사이즈 → numpy 반환
    """
    # DICOM 읽기
    ds = pydicom.dcmread(dicom_path)
    img = ds.pixel_array.astype(np.float32)

    # 윈도우 레벨링
    min_val = window_center - window_width / 2
    max_val = window_center + window_width / 2
    img = np.clip(img, min_val, max_val)

    # 0~1 정규화
    img = (img - min_val) / (max_val - min_val)

    # PIL로 변환 (0~255 uint8) 후 리사이즈
    pil = Image.fromarray((img * 255).astype('uint8'))
    pil = pil.resize(target_size, resample=Image.BILINEAR)

    # 다시 numpy 0~1 float32
    arr = np.array(pil).astype(np.float32) / 255.0
    return arr
