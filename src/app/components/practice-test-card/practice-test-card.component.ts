import { Component, inject, Input } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-practice-test-card',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './practice-test-card.component.html',
  styleUrl: './practice-test-card.component.scss'
})
export class PracticeTestCardComponent {
  private examService = inject(ExamService);

  @Input({required: true}) totalQuestion: number = 0;
  @Input({required: true}) minutes: number = 0;

  
  nextStep(){
    this.examService.setCurrentPart(3)
  }
}
