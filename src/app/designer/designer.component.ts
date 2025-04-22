import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as fabric from 'fabric';

@Component({
  selector: 'app-designer',
  standalone: true,
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss'],
})
export class DesignerComponent implements AfterViewInit {
  
  canvas!: fabric.Canvas;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas('canvas', {
      width: 500,
      height: 500,
    });
  }

  async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const dataUrl = e.target.result;

      const img = await fabric.Image.fromURL(dataUrl);
      img.scaleToWidth(500);

      this.removeWhiteBackground(img);
    };
    reader.readAsDataURL(file);
  }

  removeWhiteBackground(img: fabric.Image): void {
    const canvasEl = document.createElement('canvas');
    const width = img.width ?? 500;
    const height = img.height ?? 500;

    canvasEl.width = width;
    canvasEl.height = height;

    const ctx = canvasEl.getContext('2d')!;
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';
    tempImg.src = img.getSrc();

    tempImg.onload = () => {
      ctx.drawImage(tempImg, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Detect near-white background
        if (r > 240 && g > 240 && b > 240) {
          data[i + 3] = 0; // Set alpha to transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);

      fabric.Image.fromURL(canvasEl.toDataURL()).then((processedImg: fabric.Image) => {
        processedImg.scaleToWidth(500);
        this.canvas.clear();
        this.canvas.add(processedImg);
      });
    };
  }
}
