from .ml.preprocessing import preprocess_dicom
import torch
import numpy as np
from torch.utils.data import Dataset
from PIL import Image

class CTDicomDataset(Dataset):
    def __init__(self, image_paths, mask_paths=None):
        self.image_paths = image_paths
        self.mask_paths  = mask_paths  # 학습 시에만 제공

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        # 1) 전처리된 numpy (0~1, 512×512)
        img_np = preprocess_dicom(self.image_paths[idx])
        
        x = torch.from_numpy(img_np).unsqueeze(0)  # (1, H, W)

        if self.mask_paths:
            # 2) 마스크 로딩 & 동일한 크기(512,512) 보장
            mask = Image.open(self.mask_paths[idx]).convert("L")
            mask = mask.resize((512,512), resample=Image.NEAREST)
            mask_np = np.array(mask, dtype=np.float32) / 255.0
            y = torch.from_numpy(mask_np).unsqueeze(0)  # (1, H, W)
            return x, y

        return x  # 추론용: 마스크 없음
