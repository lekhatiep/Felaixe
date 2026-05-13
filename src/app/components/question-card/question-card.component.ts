import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { Answer, Question, QuizState } from './model/question.model';
import { QuestionService } from '../../services/question.service';
import { AppConstants } from '../../constants/app.constants';
import { QuestionImageComponent } from "../question-image/question-image/question-image.component";
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, QuestionImageComponent],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
})
export class QuestionCardComponent implements OnInit {
  questionForm!: FormGroup;

  private apiService = inject(ApiService);
  private questionService = inject(QuestionService);
  private examService = inject(ExamService);
  private destroyRef = inject(DestroyRef);
  
  isCorrect: boolean | null = null;
  listQuestion: Question[] = [];
  index: number =  this.questionService.getCurrentIndex();
  chapterId: number | null = 0;
  answered: boolean = false;
  listBookmark: Question[] = [];
  currentQuestion: Question | undefined = undefined;
  isLearningMode: boolean = true;
  selectedAnswerId: number = 0;
  quizState: QuizState | undefined = undefined;
  url_image_question = AppConstants.URL_CLOUDINARY_IMG_QUESTION;
  hasImage: boolean = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.questionForm = this.fb.group({
      selectedAnswer: [''],
      answer: [null, Validators.required],
    });

    const chapterSub = this.questionService.chapterSelected$.subscribe({
      next: (chapterId) => {
        this.chapterId = chapterId;
        this.loadQuestion();
        this.loadQuizState();
      },
    });

    this.questionService.currentQuestionSelected$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (question) => {
          if (question) {
            this.currentQuestion = question;
            this.index = this.questionService.getCurrentIndex();
            if (question.isAnswered) {
              const answer = question.answers?.find(
                (a) => a.id == question.quizState?.answerId,
              );
              this.selectedAnswerId = answer?.id ?? 0;
              this.isCorrect = answer?.isCorrect ?? false;
              this.answered = true;
            } else {
              this.resetDefault();
            }
          }
        },
      });

    this.destroyRef.onDestroy(() => {
      chapterSub.unsubscribe();
    });

    console.log("render card");
    
  }

  bookmarkQuestion() {
    console.log('Bookmarking question:');
  }

  getAnswerClass(_t7: any) {
    if (this.isCorrect === null) return '';

    const selected = this.questionForm.value.answer;

    if (this.isCorrect) return 'correct-answer';

    if (this.isCorrect == false) return 'wrong-answer';

    return '';
  }
  selectAnswer(_t7: any) {
    throw new Error('Method not implemented.');
  }

  next() {
    this.index++;
    this.currentQuestion = this.listQuestion[this.index];
    this.isCorrect = null;
    //this.questionService.setSelectedQuestionNumber(this.currentQuestion.questionNumber);
    this.questionService.setCurrentQuestion(this.currentQuestion);
  }

  previous() {
    if (this.index > 0) {
      this.index--;
    }
    this.currentQuestion = this.listQuestion[this.index];
    this.isCorrect = null;
    //this.questionService.setSelectedQuestionNumber(this.currentQuestion.questionNumber);
    this.questionService.setCurrentQuestion(this.currentQuestion);
  }

  loadQuestion() {
    this.resetDefault();
    this.listQuestion = this.questionService.loadQuestions(
      this.chapterId ?? -1,
    );
   
  }

  checkAnswer(answer: Answer) {
    this.selectedAnswerId = answer.id;
    this.isCorrect = answer.isCorrect;
    this.answered = true;

    this.questionService.setCurrentAnswer(answer);
    this.questionService.setQuizStateAnswer({
      questionNumber: this.currentQuestion?.questionNumber ?? 0,
      answerId: answer.id,
      isCorrect: answer.isCorrect,
    });

    if (this.currentQuestion) {
      this.currentQuestion.state = answer.isCorrect ? 'correct' : 'incorrect';
    }
  }

  bookmark() {
    const listBookmarkString = localStorage.getItem('list-bookmark');
    if (listBookmarkString) {
      this.listBookmark = JSON.parse(listBookmarkString);
    }

    var isAlreadyBookmarked = this.listBookmark.some(
      (q) => q.questionNumber === this.currentQuestion?.questionNumber,
    );
    if (isAlreadyBookmarked) {
      return;
    }
    this.listBookmark.push(this.currentQuestion!);

    localStorage.setItem('list-bookmark', JSON.stringify(this.listBookmark));
  }

  resetDefault() {
    //this.index = 0;
    this.isCorrect = null;
  }

  submitExam() {
    //TODO: Implement submit exam logic here
  }

  loadQuizState() {
    if (this.currentQuestion) {
      this.quizState = this.questionService.getQuizState(
        this.currentQuestion?.questionNumber,
      );
      if (this.quizState) {
        this.selectedAnswerId = this.quizState?.answerId;
        this.isCorrect = this.quizState.isCorrect ?? false;
        this.answered = true;
      }
    }
  }

  onErrorLoadImage(img: HTMLImageElement){
    this.hasImage = false;
    console.log("no image")
  }
}
