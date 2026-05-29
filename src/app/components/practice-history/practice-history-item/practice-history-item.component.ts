import { Component, inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ResultExam } from '../../../models/resultExam.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-practice-history-item',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './practice-history-item.component.html',
  styleUrl: './practice-history-item.component.scss',
})
export class PracticeHistoryItemComponent implements OnInit {
  @Input() resultItem!: ResultExam;

  private locale = inject(LOCALE_ID);

  id: number = 0;
  score: number = 0;
  totalQuestion: number = 0;
  timeSpent: number = 0;
  totalCorrectQuestion: number = 0;
  totalWrongNumberQuestion: number = 0;
  dateExam!: Date;
  dateExamString: string = '';
  dateTimeSpentStr: string = '';

  ngOnInit(): void {

    this.score = this.resultItem.score;
    this.totalQuestion = this.resultItem.questionIds.length;
    // this.timeSpent = this.resultItem.examDate.getDay()
    this.totalCorrectQuestion = this.resultItem.correctQuestionIds.length;
    this.totalWrongNumberQuestion = this.resultItem.wrongQuestionIds.length;
    this.dateExam = this.resultItem.examDate;
    this.dateExamString = formatDate(this.resultItem.examDate, 'hh:mm:ss dd/MM/YYY', this.locale);
    this.dateTimeSpentStr = this.formatDuration(this.resultItem.durationSeconds);
    
  }

  viewExamDetail(id: number){

  }

  formatDuration(totalSeconds: number): string {

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
}
