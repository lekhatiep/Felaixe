import { Component, DestroyRef, inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ApiService } from '../../services/api.service';
import { ExamService } from '../../services/exam.service';
import { AppConstants } from '../../constants/app.constants';
import {
  Answer,
  Question,
  QuizState,
} from '../question-card/model/question.model';
import { QuestionImageComponent } from '../question-image/question-image/question-image.component';
import { delay, distinctUntilChanged, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { HasUnsavedChanges } from '../../guards/confirm-leave.guard';
import { ResultExam } from '../../models/resultExam.model';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-question-content-exam',
  standalone: true,
  imports: [QuestionImageComponent, MatIconModule, ReactiveFormsModule],
  templateUrl: './question-content-exam.component.html',
  styleUrl: './question-content-exam.component.scss',
})
export class QuestionContentExamComponent {
  @Input() mode: 'study' | 'exam' | 'review' = 'study';
  @Input() id!: string; // Router parameter url

  private questionService = inject(QuestionService);
  private examService = inject(ExamService);
  private destroyRef = inject(DestroyRef);
  private activatedRouter = inject(ActivatedRoute);

  isCorrect: boolean | null = null;
  listQuestion: Question[] = [];
  index: number = this.examService.getCurrentIndex();
  chapterId: number | null = 0;
  answered: boolean = false;
  listBookmark: Question[] = [];
  currentQuestion: Question | undefined = undefined;
  isLearningMode: boolean = true;
  selectedAnswerId: number = 0;
  url_image_question = AppConstants.URL_CLOUDINARY_IMG_QUESTION;
  hasImage: boolean = true;
  quizState: QuizState | undefined = undefined;
  isLeave: boolean = false;
  isEndExam: boolean = false;
  hideNextBtn: boolean = false;
  hidePrevBtn: boolean = true;
  resultExamItem: ResultExam | undefined = undefined;
  historyItemId!: string | null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.mode === 'review') {
      this.isEndExam = true;
      console.log(this.isEndExam);
      
      console.log('mode review');

      this.activatedRouter.paramMap.subscribe((params) => {
        this.historyItemId = params.get('id');
      });
      console.log(this.historyItemId);

      this.resultExamItem = this.examService.getHistoryItemByID(
        Number(this.historyItemId),
      );

      console.log(this.resultExamItem);
      if (this.resultExamItem) {
       // this.fillAnswered(this.resultExamItem);
      }
    }

    this.examService.currentQuestionSelected$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // delay(0)
      )
      .subscribe({
        next: (question) => {
          if (question) {
            setTimeout(() => {
              //console.log('selected side bar question');

              this.currentQuestion = question;
              this.index = this.examService.getCurrentIndex();
              this.hideNextBtn = this.index === this.listQuestion.length - 1;
              this.hidePrevBtn = this.index === 0;

              if (question.isAnswered) {
                const answer = question.answers?.find(
                  (a) => a.id == question.quizState?.answerId,
                );
                this.selectedAnswerId = answer?.id ?? 0;

                if(this.mode == 'review'){
                  const reviewAnswerId = question.answersRecord?.[question.questionNumber];
                  const reviewAnswer = question.answers?.find(
                    (a) => a.id == reviewAnswerId,
                  );
                  this.selectedAnswerId = reviewAnswer?.id ?? this.selectedAnswerId;
                }

                this.answered = true;
              } else {
                this.resetDefault();
              }
            });

            this.loadQuizState();
          }
        },
      });

    this.examService.setEndCurrentExam(false);
    this.examService.endCurrentExam$
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe((rs) => {
        this.isEndExam = rs;
      });

    this.examService.multiplierExam$
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe((multiplier) => {
        this.loadQuestion(multiplier);
      });
  }

  next() {
    this.index++;
    this.currentQuestion = this.listQuestion[this.index];
    this.isCorrect = null;
    //this.examService.setSelectedQuestionNumber(this.currentQuestion.questionNumber);
    this.examService.setCurrentQuestion(this.currentQuestion);
    this.hideNextBtn = this.index === this.listQuestion.length - 1;
    this.hidePrevBtn = this.index === 0;
  }

  previous() {
    if (this.index > 0) {
      this.index--;
    }
    this.currentQuestion = this.listQuestion[this.index];
    this.isCorrect = null;
    //this.examService.setSelectedQuestionNumber(this.currentQuestion.questionNumber);
    this.examService.setCurrentQuestion(this.currentQuestion);
    this.hideNextBtn = this.index === this.listQuestion.length - 1;
    this.hidePrevBtn = this.index === 0;
  }

  loadQuestion(multiplier: number) {
    this.resetDefault();

    this.examService.loadExamQuestions(multiplier).subscribe((data) => {
      this.listQuestion = data;
    });

    //remove temp answered
  }

  submitAnswer(answer: Answer) {
    this.selectedAnswerId = answer.id;
    this.isCorrect = answer.isCorrect;
    this.answered = true;
    
    this.examService.setCurrentAnswer(answer);
    this.examService.setQuizStateAnswer({
      questionNumber: this.currentQuestion?.questionNumber ?? 0,
      answerId: answer.id,
    });

    if (this.currentQuestion) {
      this.currentQuestion.state = 'answered';
    }
  }

  resetDefault() {
    //this.index = 0;
    //this.isCorrect = null;
  }

  loadQuizState() {
    // console.log('load quiz state');
    // console.log(this.currentQuestion);

    if (this.currentQuestion) {
      this.quizState = this.examService.getQuizState(
        this.currentQuestion?.questionNumber,
      );
      if (this.quizState) {
        this.selectedAnswerId = this.quizState?.answerId;
        this.answered = true;
        console.log('answered');
      }
    }
  }

  onErrorLoadImage(img: HTMLImageElement) {
    this.hasImage = false;
    console.log('no image');
  }

  ngOnDestroy() {
    //console.log('Leaving Route A');
  }

  fillAnswered(resultExamItem: ResultExam) {
    const recordAns = resultExamItem.answers;
    const storedQuestions = localStorage.getItem('list-question');

    if (storedQuestions) {
      const listQuestionLocal: Question[] = JSON.parse(storedQuestions);
      const listQuestionExam = listQuestionLocal.filter(question => resultExamItem.questionIds.includes(question.questionNumber))

      listQuestionExam.map((q) => {
      const qz = recordAns[q.questionNumber];
    
      if (qz) {
         console.log(qz);
        q.state = 'answered';
      } else {
        q.state = 'default';
      }
    });
    }

    
  }
}
