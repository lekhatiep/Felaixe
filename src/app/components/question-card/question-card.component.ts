import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Answer, Question, QuizState } from './model/question.model';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QuestionService } from '../../services/question.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
})
export class QuestionCardComponent implements OnInit {
  questionForm!: FormGroup;

  private apiService = inject(ApiService);
  private questionService = inject(QuestionService);
  private destroyRef = inject(DestroyRef);
  questionList: Question[] = [
    {
      id: 1,
      questionNumber: 1,
      isCritical: false,
      question: 'What is the capital of France?',
      index: 0,
      content: 'Choose the correct answer from the options below.',
      chapterId: 1,
      isAnswered: false,
      answers: [
        {
          id: 1,
          questionID: 1,
          content: 'Paris',
          isCorrect: true,
          label: 'A',
          text: 'Paris',
        },
        {
          id: 2,
          questionID: 1,
          content: 'London',
          isCorrect: false,
          label: 'B',
          text: 'London',
        },
        {
          id: 3,
          questionID: 1,
          content: 'Rome',
          isCorrect: false,
          label: 'C',
          text: 'Rome',
        },
        {
          id: 4,
          questionID: 1,
          content: 'Berlin',
          isCorrect: false,
          label: 'D',
          text: 'Berlin',
        },
      ],
    },
  ];
  isCorrect: boolean | null = null;
  listQuestion: Question[] = [];
  index: number = 0;
  chapterId: number | null = 0;
  answered: boolean = false;
  listBookmark: Question[] = [];
  currentQuestion: Question | undefined = undefined;
  listQuestionService = this.questionService.listQuestion;
  isLearningMode: boolean = true;
  selectedAnswerId: number = 0;
  quizState: QuizState | undefined = undefined;

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
            if (question.isAnswered) {
              const answer = question.answers?.find(
                (a) => a.id == question.quizState?.answerId,
              );
              this.selectedAnswerId = answer?.id ?? 0;
              this.isCorrect = answer?.isCorrect ?? false;
              this.answered = true;
            }
           
          }
        },
      });

    this.destroyRef.onDestroy(() => {
      chapterSub.unsubscribe();
    });
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
  
  }

  previous() {
    if (this.index > 0) {
      this.index--;
    }
    this.currentQuestion = this.listQuestion[this.index];
    this.isCorrect = null;
  }

  loadQuestion() {
    this.resetDefault();
    var storedQuestion = localStorage.getItem('list-question');
    if (storedQuestion) {
      this.listQuestion = JSON.parse(storedQuestion);
    } else {
      const subQuest = this.apiService.getQuestions().subscribe((data) => {
        this.listQuestion = data;
        localStorage.setItem('list-question', JSON.stringify(data));
        this.currentQuestion = this.listQuestion[this.index];
      });

      this.destroyRef.onDestroy(() => {
        subQuest.unsubscribe();
      });
    }

    if (this.chapterId !== null && this.chapterId !== 0) {
      if (this.chapterId === 7) {
        const listQuestionCritical = this.listQuestion.filter(
          (q) => q.isCritical === true,
        );
        this.listQuestion = listQuestionCritical;
        this.currentQuestion = this.listQuestion[this.index];
        return;
      }

      const listQuestionUpdated = this.listQuestion.filter(
        (q) => q.chapterId === this.chapterId,
      );

      this.listQuestion = listQuestionUpdated;
      this.currentQuestion = this.listQuestion[this.index];
    } else if (this.chapterId === 0) {
      this.currentQuestion = this.listQuestion[this.index];
    }
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
    this.index = 0;
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
        this.isCorrect = this.quizState.isCorrect;
        this.answered = true;
      }
    }
  }
}
