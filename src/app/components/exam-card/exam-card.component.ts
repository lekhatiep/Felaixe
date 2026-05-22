import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam-card',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './exam-card.component.html',
  styleUrl: './exam-card.component.scss'
})
export class ExamCardComponent implements OnInit{
  private examService = inject(ExamService);

  @Input({required: true}) numberQuestion: number = 0;
  @Input({required: true}) minutes: number = 0;
  @Input({required: true}) score: number = 0;
  @Input() typeExamB : 'B_new' | 'B_old' = 'B_new';
  

  ngOnInit(): void {
     console.log(this.numberQuestion);
     
  }  

}
