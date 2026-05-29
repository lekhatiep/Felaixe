import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of, tap } from 'rxjs';
import { PracticeComponent } from '../../components/practice/practice.component';
import { PracticeTestComponent } from '../../components/practice-test/practice-test.component';
import { PracticeTestProgressComponent } from '../../components/practice-test-progress/practice-test-progress.component';
import { PracticeTestResultComponent } from '../../components/practice-test-result/practice-test-result.component';
import { PracticeHistoryComponent } from '../../components/practice-history/practice-history.component';
import { ExamService } from '../../services/exam.service';
import { QuestionContainerComponent } from '../../components/question-container/question-container.component';
import { HasUnsavedChanges } from '../../guards/confirm-leave.guard';
import { DialogConfirmComponent } from '../../components/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [
    PracticeComponent,
    PracticeTestComponent,
    PracticeTestProgressComponent,
    PracticeTestResultComponent,
    PracticeHistoryComponent,
    QuestionContainerComponent,
    RouterOutlet
],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss',
})
export class ExamComponent implements OnInit, HasUnsavedChanges {
  private examService = inject(ExamService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);

  showPractice: boolean = false;
  showProgress: boolean = false;
  showResult: boolean = false;
  step: number = 0;
  step_1: number = 1; /*Chon hang thi*/
  step_2: number = 2; /*Chon de thi*/
  step_3: number = 3; /*Chon lam bai*/
  step_4: number = 4; /*Show ket qua*/

  message = '';

  ngOnInit(): void {
    console.log('step' + this.step);

    //this.step = 1;
    this.examService.setCurrentPart(4);

    this.examService.currentPart$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((part) => {
        if (part > 0) {
          console.log(part);

          this.step = part;
        }
      });

    // this.examService.currentStep$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((step)=>{
    //   if(step > 0){
    //     console.log(step);

    //     this.step = step;
    //   }
    // })
  }

  nextStep(step: number) {
    this.step = step;
  }

  handleBackStep(input: boolean) {
    if (input) {
      this.step = this.step_1;
    }
  }

  receiveMessage(msg: string) {
    console.log('back');
    this.message = msg;
  }

  canLeave(): Observable<boolean> {
    
    if (this.step !== this.step_3) {
      return of(true);
    }

    (document.activeElement as HTMLElement)?.blur();

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      autoFocus: true,
      width: '350px',
      data: {
        title: 'Thông báo',
        content: 'Chưa hoàn thành bài thi. Bạn có muốn rời đi.',
        confirmBtnText: 'Rời đi',
        cancelBtnText: 'Tiếp tục bài làm',
      },
    });
    
    return dialogRef.afterClosed().pipe(
      tap((result) => {
        this.examService.setEndCurrentExam(result);
      }),
    );
  }
}
