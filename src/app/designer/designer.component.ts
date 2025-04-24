import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageGeneratorService } from '../services/image-generator.service';


@Component({
  selector: 'app-designer',
  standalone: true,
  templateUrl: './designer.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./designer.component.scss'],
})
export class DesignerComponent {
  prompt = '';
  response = '';

  imageUrl: string | null = null;

  constructor(private imageService: ImageGeneratorService) {}

  generate() {
    console.log('Sending prompt:', this.prompt);
    this.imageService.generateContent(this.prompt).subscribe(
      res => {
        const text = res?.candidates?.[0]?.content?.parts?.[0]?.text;
        this.response = text || 'No response.';
      },
      err => {
        console.error('Gemini Error:', err);
        this.response = 'Error generating response.';
      }
    );
  }
}



