import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageDataService, ScreenshotData } from '../../services/image-data.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  screenshots: ScreenshotData[] = [];
  selectedScreenshot: ScreenshotData | null = null;
  
  constructor(private imageDataService: ImageDataService) {}
  
  ngOnInit(): void {
    this.loadScreenshots();
  }
  
  loadScreenshots(): void {
    this.screenshots = this.imageDataService.getAllScreenshots();
    
    // Select the first screenshot by default if available
    if (this.screenshots.length > 0 && !this.selectedScreenshot) {
      this.selectScreenshot(this.screenshots[0]);
    } else if (this.screenshots.length === 0) {
      this.selectedScreenshot = null;
    }
  }
  
  selectScreenshot(screenshot: ScreenshotData): void {
    this.selectedScreenshot = screenshot;
  }
  
  deleteScreenshot(id: string): void {
    if (confirm('Are you sure you want to delete this screenshot?')) {
      this.imageDataService.deleteScreenshot(id);
      this.loadScreenshots();
    }
  }
}
