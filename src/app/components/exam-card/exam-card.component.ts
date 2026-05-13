import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exam-card',
  standalone: true,
  imports: [],
  templateUrl: './exam-card.component.html',
  styleUrl: './exam-card.component.scss'
})
export class ExamCardComponent {  
  @Input({required: true}) numberQuestion: number = 0;
  @Input({required: true}) minutes: number = 0;
  @Input({required: true}) score: number = 0;



}
