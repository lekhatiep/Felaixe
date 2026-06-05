import {
  Component,
  DestroyRef,
  HostListener,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  Answer,
  Question,
  QuizState,
} from '../question-card/model/question.model';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExamService } from '../../services/exam.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-side-bar-exam',
  standalone: true,
  imports: [MatIcon, CommonModule],
  templateUrl: './side-bar-exam.component.html',
  styleUrl: './side-bar-exam.component.scss',
})
export class SideBarExamComponent {
  private examService = inject(ExamService);
  private destroyRef = inject(DestroyRef);
  readonly dialog = inject(MatDialog);

  selected = 'option2';
  selectChapterId: number = 0;
  isOpen = false;
  classIconName = '';
  listQuestion: Question[] = [];
  isAnswered: boolean | undefined = false;
  isCorrectAns: boolean | undefined = false;
  selectedQuestionNumberId: number = 0;
  currentIndex: number = 0;
  answer: Answer | undefined;
  listQuizState: QuizState[] = [];
  currentTime: number = 0;
  isEndExam: boolean = false;
  startTime!: Date;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: any) {
    if (!event.target.closest('.dropdown')) {
      this.isOpen = false;
    }
  }

  ngOnInit() {
    this.startTime = new Date();

    //  this.examService.currentAnswerSelected$
    //    .pipe(takeUntilDestroyed(this.destroyRef))
    //    .subscribe({
    //      next: (data) => {
    //        console.log(data?.isCorrect);
    //        this.isCorrectAns = data?.isCorrect;
    //        this.isAnswered = true;
    //      },
    //    });

    this.examService.changedQuizState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.listQuizState = this.examService.loadQuizStateAns();
        },
      });

    this.examService.currentQuestionSelected$
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe({
        next: (question) => {
          if (question) {
            const currentIndex = this.listQuestion.findIndex(
              (q) => q.questionNumber == question.questionNumber,
            );
            const currentQuestionNumber = this.listQuestion[currentIndex];
            console.log('1');

            this.selectQuestion(currentQuestionNumber);
          }
        },
      });

    // this.examService.selectedQuestionNumber$
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: (questionNumber) => {
    //       const currentIndex = this.listQuestion.findIndex(
    //         (q) => q.questionNumber == questionNumber,
    //       );
    //       const nextQuestion = this.listQuestion[currentIndex + 1];
    //       this.selectQuestion(nextQuestion);
    //     },
    //   });

    this.examService.timer$
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe((seconds) => {
        if (seconds == 0) {
          this.isEndExam = true;
          this.examService.setEndCurrentExam(true);
          this.openDialogTimeOut();
          this.examService.submitExam(this.startTime);
        }
      });

    this.examService.multiplierExam$
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe((multiplier) => {
        this.loadExamQuestion(multiplier);
      });

    this.currentIndex = this.examService.getCurrentIndex();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectQuestion(selectQuestion: Question) {
    //Get history quizState
    console.log('selectQuestion');

    const ansQuizState = this.listQuizState.find(
      (q) => q.questionNumber == selectQuestion.questionNumber,
    );
    if (ansQuizState) {
      selectQuestion.isAnswered = true;
      selectQuestion.quizState = ansQuizState;
    }

    this.listQuestion.map((q) => {
      const qz = this.listQuizState.find(
        (qs) => qs.questionNumber == q.questionNumber,
      );
      if (qz) {
        q.state = 'answered';
      } else {
        q.state = 'default';
      }
    });

    selectQuestion.state = 'active';

    this.examService.setCurrentQuestion(selectQuestion);

    this.currentIndex = this.listQuestion.indexOf(selectQuestion);
    this.examService.setCurrentIndex(this.currentIndex);
  }

  removeQuizState() {
    localStorage.removeItem('list-exam-quiz-state');
  }

  openDialog(event: MouseEvent) {
    (event.target as HTMLElement).blur();

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '350px',
      data: {
        title: 'Xác nhận nộp bài',
        content: 'Sau khi nộp bạn sẽ không thể thay đổi đáp án.',
        confirmBtnText: 'Có, nộp bài',
        cancelBtnText: 'Chưa, làm tiếp',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //alert('Nộp bài thành công');
        this.examService.submitExam(this.startTime);
      }
    });
  }

  openDialogTimeOut() {
    (document.activeElement as HTMLElement)?.blur();

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      autoFocus: true,
      // disableClose: true,
      width: '350px',
      data: {
        title: 'Thông báo',
        content: 'Đã hết giờ làm bài.',
        confirmBtnText: 'OK',
        cancelBtnText: 'Cancel',
        isConfirmDialog: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
   
    });
  }

  loadExamQuestion(multiplier: number) {
    this.examService.loadExamQuestions(multiplier).subscribe((data) => {
      
      this.listQuestion = data;
      this.listQuestion.map((q) => ({
        ...q,
        state: 'default',
      }));

      this.listQuizState = this.examService.loadQuizStateAns();

      this.listQuestion.map((q) => {
        const qs = this.listQuizState.find(
          (qs) => qs.questionNumber == q.questionNumber,
        );
        if (qs) {
          q.state = 'answered';
        }
      });
      this.selectQuestion(this.listQuestion[0]);
    });
  }
}
