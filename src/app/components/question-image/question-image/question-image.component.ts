import { Component, Input } from '@angular/core';
import { AppConstants } from '../../../constants/app.constants';

@Component({
  selector: 'app-question-image',
  standalone: true,
  imports: [],
  templateUrl: './question-image.component.html',
  styleUrl: './question-image.component.scss'
})
export class QuestionImageComponent {
  @Input() questionId!: number;

  baseUrl: string = AppConstants.URL_CLOUDINARY_IMG_QUESTION;

  currentSrc!: string;
  isVisible: boolean = false;

  ngOnInit() {
    this.setImage();
  }

  ngOnChanges() {
   
    if (!this.questionId) {
      this.isVisible = false;
      return; 
    }
    
    this.currentSrc = `${this.baseUrl}/q${this.questionId}.jpg`;

    this.checkImage();
  }

  checkImage(){


    const img = new Image();
    img.onload = () =>{
      this.isVisible = true;
    };

    img.onerror = () => {
      this.isVisible = false;
    }

    img.src = this.currentSrc;
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
