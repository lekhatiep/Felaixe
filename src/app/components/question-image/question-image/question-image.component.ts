import { Component, Input } from '@angular/core';
import { URL_CLOUDINARY_IMG_QUESTION } from '../../../constants/app.constants';

@Component({
  selector: 'app-question-image',
  standalone: true,
  imports: [],
  templateUrl: './question-image.component.html',
  styleUrl: './question-image.component.scss'
})
export class QuestionImageComponent {
  @Input() questionId!: number;

  baseUrl: string = URL_CLOUDINARY_IMG_QUESTION;

  currentSrc!: string;
  isVisible: boolean = true;

  ngOnInit() {
    this.setImage();
  }

  ngOnChanges() {
    this.setImage();
  }

  setImage() {
    if (this.questionId) {
      this.currentSrc = `${this.baseUrl}/q${this.questionId}.jpg`;
      this.isVisible = true; 
    }
  }

  onError() {
    this.isVisible = false;
  }
}
