# backend/apps/patients/segmentation_model.py

import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models

class ConvBlock(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, 3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels, out_channels, 3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
        )
    def forward(self, x):
        return self.conv(x)

class UpBlock(nn.Module):
    def __init__(self, in_channels, skip_channels, out_channels):
        super().__init__()
        self.up = nn.ConvTranspose2d(in_channels, out_channels, 2, stride=2)
        self.conv = ConvBlock(out_channels + skip_channels, out_channels)
    def forward(self, x, skip):
        x = self.up(x)
        if x.shape[2:] != skip.shape[2:]:
            x = F.interpolate(x, size=skip.shape[2:], mode='bilinear', align_corners=False)
        x = torch.cat([x, skip], dim=1)
        return self.conv(x)

class ResUNet50(nn.Module):
    def __init__(self, n_classes=1):
        super().__init__()
        base = models.resnet50(pretrained=False)
        base.conv1 = nn.Conv2d(1, 64, 7, stride=2, padding=3, bias=False)
        self.inconv   = nn.Sequential(base.conv1, base.bn1, base.relu, base.maxpool)
        self.encoder1 = base.layer1
        self.encoder2 = base.layer2
        self.encoder3 = base.layer3
        self.encoder4 = base.layer4
        self.center   = ConvBlock(2048, 1024)
        self.up4      = UpBlock(1024, 1024, 512)
        self.up3      = UpBlock(512, 512,   256)
        self.up2      = UpBlock(256, 256,   128)
        self.up1      = UpBlock(128, 64,    64)
        self.final    = nn.Conv2d(64, n_classes, 1)

    def forward(self, x):
        x0 = self.inconv(x)
        x1 = self.encoder1(x0)
        x2 = self.encoder2(x1)
        x3 = self.encoder3(x2)
        x4 = self.encoder4(x3)
        c  = self.center(x4)
        d4 = self.up4(c,  x3)
        d3 = self.up3(d4, x2)
        d2 = self.up2(d3, x1)
        d1 = self.up1(d2, x0)
        out = self.final(d1)
        return F.interpolate(out, size=(512,512), mode='bilinear', align_corners=False)

def build_model(n_classes: int = 1) -> ResUNet50:
    return ResUNet50(n_classes=n_classes)
