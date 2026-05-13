import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Answer,
  Question,
  QuizState,
} from '../components/question-card/model/question.model';
import { ApiService } from './api.service';
import { Chapter } from '../components/question-container/model/chapter.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiService = inject(ApiService);
  selectedChapterId: number | null = null;

  chapterSelectedSubject = new BehaviorSubject<number | null>(0);
  chapterSelected$ = this.chapterSelectedSubject.asObservable();

  listQuestion: Question[] = [];

  currentQuestion: Question | undefined;
  currentQuestionSelectedSubject = new BehaviorSubject<Question | undefined>(
    undefined,
  );
  currentQuestionSelected$ = this.currentQuestionSelectedSubject.asObservable();
  questionNumberSelected: number = 1;
  currentAnswerSelectedSubject = new BehaviorSubject<Answer | undefined>(
    undefined,
  );
  currentAnswerSelected$ = this.currentAnswerSelectedSubject.asObservable();

  quizState: QuizState | undefined;
  listQuizState: QuizState[] = [];
  changedQuizStateSubject = new BehaviorSubject<boolean>(false);
  changedQuizState$ = this.changedQuizStateSubject.asObservable();

  nextQuestionSubject = new BehaviorSubject<Question | undefined>(undefined);
  nextQuestion$ = this.nextQuestionSubject.asObservable();

  selectedQuestionNumberSubject = new BehaviorSubject<number | null>(null);
  selectedQuestionNumber$ = this.selectedQuestionNumberSubject.asObservable();

  currentIndex : number = 0;

  listChapter: Chapter[] = [
    {
      id: 0,
      name: '--All--',
      description: 'Tất cả các câu hỏi',
      iconName: 'functions',
      className: 'all-chapter',
    },
    {
      id: 1,
      name: 'Chapter 1',
      description: 'Quy định chung và quy tắc giao thông đường bộ',
      iconName: 'gavel',
      className: 'chapter-1',
    },
    {
      id: 2,
      name: 'Chapter 2',
      description: 'Văn hóa giao thông và đạo đức người lái xe',
      iconName: 'volunteer_activism',
      className: 'chapter-2',
    },
    {
      id: 3,
      name: 'Chapter 3',
      description: 'Kỹ thuật lái xe',
      iconName: 'settings_input_component',
      className: 'chapter-3',
    },
    {
      id: 4,
      name: 'Chapter 4',
      description: 'Cấu tạo và sửa chữa',
      iconName: 'build',
      className: 'chapter-4',
    },
    {
      id: 5,
      name: 'Chapter 5',
      description: 'Báo hiệu đường bộ',
      iconName: 'traffic',
      className: 'chapter-5',
    },
    {
      id: 6,
      name: 'Chapter 6',
      description: 'Giải sa hình và xử lý tình huống giao thông',
      iconName: 'alt_route',
      className: 'chapter-6',
    },
    {
      id: 7,
      name: 'Câu hỏi quan trọng',
      description: 'Các câu hỏi quan trọng cần chú ý (điểm liệt)',
      iconName: 'emergency',
      className: 'chapter-7',
    },
  ];

  setSelectedChapterId(chapterId: number) {
    this.selectedChapterId = chapterId;
    this.chapterSelectedSubject.next(chapterId);
  }

  loadQuestions(chapterId?: number): Question[] {
    const storedQuestions = localStorage.getItem('list-question');
    if (storedQuestions) {
      this.listQuestion = JSON.parse(storedQuestions);
    } else {
      this.apiService.getQuestions().subscribe((data) => {
        this.listQuestion = data;
        localStorage.setItem('list-question', JSON.stringify(data));
      });
    }

    if (chapterId !== null && chapterId !== 0) {
      if (chapterId === 7) {
        const listQuestionCritical = this.listQuestion.filter(
          (q) => q.isCritical === true,
        );
        this.listQuestion = listQuestionCritical;
        return this.listQuestion;
      }

      const listQuestionUpdated = this.listQuestion.filter(
        (q) => q.chapterId === chapterId,
      );

      this.listQuestion = listQuestionUpdated;
    }
    return this.listQuestion;
  }

  getCurrentQuestion(questionNumber: number): Question | undefined {
    if (this.listQuestion.length === 0) {
      this.loadQuestions();
    }
    if (questionNumber < 1 || questionNumber > this.listQuestion.length) {
      return undefined;
    }
    return (this.currentQuestion =
      this.listQuestion.find((q) => q.questionNumber === questionNumber) ||
      undefined);
  }

  setCurrentQuestion(question: Question) {
    if (this.currentQuestionSelectedSubject.value == question) {
      return;
    }

    this.currentQuestionSelectedSubject.next(question);
  }

  setCurrentAnswer(answer: Answer) {
    this.currentAnswerSelectedSubject.next(answer);
  }

  loadQuizStateAns(): QuizState[] {
    const storedQuizState = localStorage.getItem('list-quiz-state');
    if (storedQuizState) {
      this.listQuizState = JSON.parse(storedQuizState);
    }
    return this.listQuizState;
  }

  setQuizStateAnswer(quizState: QuizState) {
    const listQuizStateString = localStorage.getItem('list-quiz-state');
    if (listQuizStateString) {
      this.listQuizState = JSON.parse(listQuizStateString);
    }

    var isAlreadyAdded = this.listQuizState.some(
      (q) => q.questionNumber === quizState.questionNumber,
    );
    if (isAlreadyAdded) {
      const quizStateExist = this.listQuizState.find(
        (q) => q.questionNumber == quizState.questionNumber,
      );
      if (quizStateExist) {
        quizStateExist.answerId = quizState.answerId;
        quizStateExist.isCorrect = quizState.isCorrect;
      }
      localStorage.setItem(
        'list-quiz-state',
        JSON.stringify(this.listQuizState),
      );
      this.changedQuizStateSubject.next(true);
      return;
    }
    this.listQuizState.push(quizState);
    localStorage.setItem('list-quiz-state', JSON.stringify(this.listQuizState));
    this.changedQuizStateSubject.next(true);
  }

  getQuizState(questionNumber: number): QuizState | undefined {
    return this.loadQuizStateAns().find(
      (q) => q.questionNumber == questionNumber,
    );
  }

  nextQuestion(question: Question) {
    this.nextQuestionSubject.next(question);
  }
  setSelectedQuestionNumber(questionNumber: number) {
    this.selectedQuestionNumberSubject.next(questionNumber);
  }

  setCurrentIndex(index: number){
    this.currentIndex = index;
  }

  getCurrentIndex(){
    return this.currentIndex;
  }

  getListChapter(){
    return this.listChapter;
  }
}
