import {
  Component,
  DestroyRef,
  HostListener,
  inject,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Chapter } from '../question-container/model/chapter.model';
import { MatIconModule } from '@angular/material/icon';
import { QuestionService } from '../../services/question.service';
import {
  Answer,
  Question,
  QuizState,
} from '../question-card/model/question.model';
import { ApiService } from '../../services/api.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-side-bar-question',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './side-bar-question.component.html',
  styleUrl: './side-bar-question.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SideBarQuestionComponent {
  private questionService = inject(QuestionService);
  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  selected = 'option2';
  @Input({ required: true }) listChapter: Chapter[] = [];

  selectedChapter = this.listChapter[0];
  selectChapterId: number = 0;
  selectForm!: FormGroup;
  isOpen = false;
  classIconName = '';
  listQuestion: Question[] = [];
  isAnswered: boolean | undefined = false;
  isCorrectAns: boolean | undefined = false;
  selectedQuestionNumberId: number = 0;
  currentIndex: number = 0;
  answer: Answer | undefined;
  listQuizState: QuizState[] = [];

  selectChapter(chapter: Chapter) {
    console.log('Selected chapter:', chapter.name);
    this.selectChapterId = chapter.id;
    this.questionService.setSelectedChapterId(chapter.id);
    this.isOpen = false;
    this.loadQuestion();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: any) {
    if (!event.target.closest('.dropdown')) {
      this.isOpen = false;
    }
  }

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.selectForm = this.fb.group({
      chapter: [null],
    });
    this.loadQuestion();

    this.questionService.currentAnswerSelected$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log(data?.isCorrect);
          this.isCorrectAns = data?.isCorrect;
          this.isAnswered = true;
        },
      });

    this.questionService.changedQuizState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.listQuizState = this.questionService.loadQuizStateAns();
        },
      });

    // this.questionService.selectedQuestionNumber$
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

    this.questionService.currentQuestionSelected$
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe({
        next: (question) => {
          if (question) {
            const currentIndex = this.listQuestion.findIndex(
              (q) => q.questionNumber == question.questionNumber,
            );
            const currentQuestionNumber = this.listQuestion[currentIndex];
            this.selectQuestion(currentQuestionNumber);
          }
        },
      });

      this.currentIndex = this.questionService.getCurrentIndex();
  }

  onChange() {
    const selectedChapter = this.selectForm.get('chapter')?.value;
    console.log('Selected chapter:', selectedChapter);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  getSelectedChapterName(): string {
    const selectedChapter = this.listChapter.find(
      (chapter) => chapter.id === this.selectChapterId,
    );
    return selectedChapter ? selectedChapter.name : 'Select Chapter';
  }

  getSelected() {
    const selectedChapter = this.listChapter.find(
      (chapter) => chapter.id === this.selectChapterId,
    );
    return selectedChapter ? selectedChapter : null;
  }

  onChangeChapter(chapter: Chapter) {}

  loadQuestion() {
    this.listQuestion = this.questionService.loadQuestions(
      this.selectChapterId,
    );
    this.listQuestion.map((q) => ({
      ...q,
      state: 'default',
    }));

    this.listQuizState = this.questionService.loadQuizStateAns();

    this.listQuestion.map((q) => {
      const qs = this.listQuizState.find(
        (qs) => qs.questionNumber == q.questionNumber,
      );
      if (qs) {
        q.state = qs.isCorrect ? 'correct' : 'incorrect';
      }
    });
    this.selectQuestion(this.listQuestion[0]);
  }

  selectQuestion(selectQuestion: Question) {
    //Get history quizState

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
        q.state = qz.isCorrect ? 'correct' : 'incorrect';
       
      } else {
        q.state = 'default';
      }
    });

    selectQuestion.state = 'active';

    this.questionService.setCurrentQuestion(selectQuestion);

    this.currentIndex = this.listQuestion.indexOf(selectQuestion);
    this.questionService.setCurrentIndex(this.currentIndex);
  }

  removeQuizState() {
    localStorage.removeItem('list-quiz-state');
  }
}
