import { Component, inject, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { ResultExam } from '../../models/resultExam.model';

@Component({
  selector: 'app-practice-test-result',
  standalone: true,
  imports: [],
  templateUrl: './practice-test-result.component.html',
  styleUrl: './practice-test-result.component.scss',
})
export class PracticeTestResultComponent implements OnInit {
  private examService = inject(ExamService);

  listResult: ResultExam[] = [];
  newestResult!: ResultExam;
  dateTimeSpentStr: string = '';

  ngOnInit(): void {
    this.listResult = this.examService.loadHistoryExam();
    if (this.listResult) {
      this.listResult = [...this.listResult].reverse();
      this.newestResult = this.listResult[0];
      this.dateTimeSpentStr = this.formatDuration(this.newestResult.durationSeconds);
    }
  }

  formatDuration(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
