import { Component, inject } from '@angular/core';
import { ExamCardComponent } from "../exam-card/exam-card.component";
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [ExamCardComponent],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss'
})
export class PracticeComponent {
  private examService = inject(ExamService);

  nextStep(typeExamB : 'B_new' | 'B_old' ){
    this.examService.setCurrentPart(2);
    this.examService.setCurrentTypeB(typeExamB)
  }
}
