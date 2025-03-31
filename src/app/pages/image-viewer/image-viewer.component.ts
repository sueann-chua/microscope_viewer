import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageDataService } from '../../services/image-data.service';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
  @ViewChild('fullImage') fullImageElement!: ElementRef;
  
  currentImage: string | null = null;
  imageId: string = '';
  
  // Viewport properties
  viewportX: number = 0;
  viewportY: number = 0;
  viewportWidth: number = 150;
  viewportHeight: number = 150;
  
  // Zoom properties
  zoomLevel: number = 2;
  moveStep: number = 10;
  
  constructor(private imageDataService: ImageDataService) {}
  
  ngOnInit(): void {}
  
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.imageId = this.generateImageId();
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentImage = e.target?.result as string;
        
        // Reset viewport to center of image
        setTimeout(() => {
          if (this.fullImageElement) {
            const img = this.fullImageElement.nativeElement;
            this.viewportX = (img.offsetWidth / 2) - (this.viewportWidth / 2);
            this.viewportY = (img.offsetHeight / 2) - (this.viewportHeight / 2);
          }
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  }
  
  moveViewport(direction: 'up' | 'down' | 'left' | 'right'): void {
    switch (direction) {
      case 'up':
        this.viewportY = Math.max(0, this.viewportY - this.moveStep);
        break;
      case 'down':
        if (this.fullImageElement) {
          const img = this.fullImageElement.nativeElement;
          this.viewportY = Math.min(img.offsetHeight - this.viewportHeight, this.viewportY + this.moveStep);
        }
        break;
      case 'left':
        this.viewportX = Math.max(0, this.viewportX - this.moveStep);
        break;
      case 'right':
        if (this.fullImageElement) {
          const img = this.fullImageElement.nativeElement;
          this.viewportX = Math.min(img.offsetWidth - this.viewportWidth, this.viewportX + this.moveStep);
        }
        break;
    }
  }
  
  adjustZoom(change: number): void {
    const newZoom = this.zoomLevel + change;
    if (newZoom >= 1 && newZoom <= 5) {
      this.zoomLevel = newZoom;
    }
  }
  
  saveScreenshot(): void {
    if (!this.currentImage) return;
    
    // Create a canvas to capture the viewport area
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas dimensions to viewport size
    canvas.width = this.viewportWidth;
    canvas.height = this.viewportHeight;
    
    // Create an image element from the current image
    const img = new Image();
    img.src = this.currentImage;
    
    // Draw only the viewport portion to the canvas
    img.onload = () => {
      if (this.fullImageElement) {
        const fullImg = this.fullImageElement.nativeElement;
        const imgWidth = fullImg.offsetWidth;
        const imgHeight = fullImg.offsetHeight;
        
        // Calculate the scaling factor between the original image and displayed image
        const scaleX = img.width / imgWidth;
        const scaleY = img.height / imgHeight;
        
        // Draw the viewport portion to the canvas
        ctx.drawImage(
          img,
          this.viewportX * scaleX, this.viewportY * scaleY,
          this.viewportWidth * scaleX, this.viewportHeight * scaleY,
          0, 0, this.viewportWidth, this.viewportHeight
        );
        
        // Convert canvas to data URL
        const screenshotDataUrl = canvas.toDataURL('image/png');
        
        // Save screenshot data with coordinates and image ID
        this.imageDataService.saveScreenshot({
          id: this.generateScreenshotId(),
          imageId: this.imageId,
          dataUrl: screenshotDataUrl,
          coordinates: {
            x: this.viewportX,
            y: this.viewportY,
            width: this.viewportWidth,
            height: this.viewportHeight
          },
          timestamp: new Date().toISOString()
        });
        
        alert('Screenshot saved successfully!');
      }
    };
  }
  
  private generateImageId(): string {
    return 'img_' + new Date().getTime();
  }
  
  private generateScreenshotId(): string {
    return 'ss_' + new Date().getTime();
  }
}
