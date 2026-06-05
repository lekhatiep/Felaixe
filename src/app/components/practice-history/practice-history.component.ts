import { Component, inject, OnInit } from '@angular/core';
import { PracticeHistoryItemComponent } from './practice-history-item/practice-history-item.component';
import { ExamService } from '../../services/exam.service';
import { ResultExam } from '../../models/resultExam.model';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-practice-history',
  standalone: true,
  imports: [PracticeHistoryItemComponent, MatIcon],
  templateUrl: './practice-history.component.html',
  styleUrl: './practice-history.component.scss',
})
export class PracticeHistoryComponent implements OnInit {
  private examService = inject(ExamService);
  private dialog = inject(MatDialog);

  listResult: ResultExam[] = [];

  ngOnInit(): void {
    this.listResult = this.examService.loadHistoryExam();
    if (this.listResult) {
      this.listResult = [...this.listResult].reverse();
    }
  }

  deleteHistoryExam() {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '300px',

      data: {
        title: 'Thông báo',
        content: 'Xóa toàn bộ lịch sử làm bài',
        confirmBtnText: 'Xác nhận',
        cancelBtnText: 'Bỏ qua',
      },
    });

    dialogRef.afterClosed().subscribe((rs) => {
      if (rs === true) {
        localStorage.removeItem('history-exam');
      }
    });
  }
}
