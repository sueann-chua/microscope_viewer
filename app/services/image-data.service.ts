import { Injectable } from '@angular/core';

export interface ScreenshotData {
  id: string;
  imageId: string;
  dataUrl: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {
  private readonly STORAGE_KEY = 'microscope_screenshots';
  
  constructor() { }
  
  saveScreenshot(screenshot: ScreenshotData): void {
    const screenshots = this.getAllScreenshots();
    screenshots.push(screenshot);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(screenshots));
  }
  
  getAllScreenshots(): ScreenshotData[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  
  deleteScreenshot(id: string): void {
    const screenshots = this.getAllScreenshots();
    const updatedScreenshots = screenshots.filter(ss => ss.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedScreenshots));
  }
  
  clearAllScreenshots(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
