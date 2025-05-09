import numpy as np
import pydicom
from PIL import Image
import cv2

def auto_clip_hu(hu_image, percentile_low=2, percentile_high=98):
    lower_bound = np.percentile(hu_image, percentile_low)
    upper_bound = np.percentile(hu_image, percentile_high)
    return lower_bound, upper_bound

def preprocess_dicom(
    dicom_path: str,
    window_center: float = 40,
    window_width: float = 80,
    target_size: tuple[int,int] = (512,512),
    clip_limit: float = 3.0,
    tile_grid_size: tuple[int,int] = (8, 8)
) -> np.ndarray:
    """
    DICOM → HU 변환 → 윈도우 레벨링 → 자동 클리핑 → 정규화 → CLAHE → PIL 리사이즈 → numpy 반환 (0~1)
    """
    # DICOM 읽기
    ds = pydicom.dcmread(dicom_path)
    img = ds.pixel_array.astype(np.float32)

    # HU 값 변환
    intercept = ds.RescaleIntercept if "RescaleIntercept" in ds else 0
    slope = ds.RescaleSlope if "RescaleSlope" in ds else 1
    hu_image = img * slope + intercept

    # 윈도우 레벨링 (클리핑 전에 적용)
    # HU 값이 지정 범위를 벗어나면 모두 경계값으로 “클리핑(포화)”
    # 전체 HU(–1000 ~ +3000 HU) 중 관심 영역만 보여줌으로써 그 안의 미세한 차이를 뚜렷하게 볼 수 있음
    lower_bound = window_center - (window_width / 2)
    upper_bound = window_center + (window_width / 2)
    hu_windowed = np.clip(hu_image, lower_bound, upper_bound)

    # 자동 HU 클리핑
    hu_min, hu_max = auto_clip_hu(hu_windowed) # 윈도우 레벨링 된 이미지에 적용
    hu_clipped = np.clip(hu_windowed, hu_min, hu_max)

    # 0~255 정규화
    img_normalized = ((hu_clipped - lower_bound) / (upper_bound - lower_bound)) * 255
    img_normalized = img_normalized.astype(np.uint8)

    # CLAHE 적용
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)
    clahe_img = clahe.apply(img_normalized)

    # PIL로 변환 후 리사이즈
    pil = Image.fromarray(clahe_img).convert("L") # CLAHE는 흑백 이미지
    pil = pil.resize(target_size, resample=Image.BILINEAR)
    arr = np.array(pil, dtype=np.float32) / 255.0
    return arr
