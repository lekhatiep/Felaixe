import { Component, DestroyRef, inject } from '@angular/core';
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
import { delay } from 'rxjs';

@Component({
  selector: 'app-question-content-exam',
  standalone: true,
  imports: [QuestionImageComponent, MatIconModule, ReactiveFormsModule],
  templateUrl: './question-content-exam.component.html',
  styleUrl: './question-content-exam.component.scss',
})
export class QuestionContentExamComponent {
  questionForm!: FormGroup;

  private apiService = inject(ApiService);
  private examService = inject(ExamService);
  private destroyRef = inject(DestroyRef);

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
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.loadQuestion();

    this.examService.currentQuestionSelected$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // delay(0)
      )
      .subscribe({
        next: (question) => {
          if (question) {
            setTimeout(() => {
              this.currentQuestion = question;
              this.index = this.examService.getCurrentIndex();
              if (question.isAnswered) {
                const answer = question.answers?.find(
                  (a) => a.id == question.quizState?.answerId,
                );
                this.selectedAnswerId = answer?.id ?? 0;
                this.answered = true;
              } else {
                this.resetDefault();
              }

             
            });

             this.loadQuizState();
          }
        },
      });

    console.log('render card exam');
  }

  next() {
    this.index++;
    this.currentQuestion = this.listQuestion[this.index];
    this.isCorrect = null;
    //this.examService.setSelectedQuestionNumber(this.currentQuestion.questionNumber);
    this.examService.setCurrentQuestion(this.currentQuestion);
  }

  previous() {
    if (this.index > 0) {
      this.index--;
    }
    this.currentQuestion = this.listQuestion[this.index];
    this.isCorrect = null;
    //this.examService.setSelectedQuestionNumber(this.currentQuestion.questionNumber);
    this.examService.setCurrentQuestion(this.currentQuestion);
  }

  loadQuestion() {
    this.resetDefault();

    this.examService.loadExamQuestions().subscribe((data) => {
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

  submitExam() {
    //TODO: Implement submit exam logic here
  }

  loadQuizState() {
    console.log('load quiz state');
    console.log(this.currentQuestion);

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
}
