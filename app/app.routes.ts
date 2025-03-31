import { Routes } from '@angular/router';
import { ImageViewerComponent } from './pages/image-viewer/image-viewer.component';
import { GalleryComponent } from './pages/gallery/gallery.component';

export const routes: Routes = [
  { path: '', redirectTo: 'image-viewer', pathMatch: 'full' },
  { path: 'image-viewer', component: ImageViewerComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: '**', redirectTo: 'image-viewer' }
];
