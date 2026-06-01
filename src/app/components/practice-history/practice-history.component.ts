import { Component, inject, OnInit } from '@angular/core';
import { PracticeHistoryItemComponent } from './practice-history-item/practice-history-item.component';
import { ExamService } from '../../services/exam.service';
import { ResultExam } from '../../models/resultExam.model';

@Component({
  selector: 'app-practice-history',
  standalone: true,
  imports: [PracticeHistoryItemComponent],
  templateUrl: './practice-history.component.html',
  styleUrl: './practice-history.component.scss'
})
export class PracticeHistoryComponent  implements OnInit{
  private examService = inject(ExamService);
  
  listResult : ResultExam[] = [];

  ngOnInit(): void {
    this.listResult = this.examService.loadHistoryExam();

    this.listResult = [...this.listResult].reverse();
  }
  
}
