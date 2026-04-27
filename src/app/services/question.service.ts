import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Answer,
  Question,
  QuizState,
} from '../components/question-card/model/question.model';
import { ApiService } from './api.service';

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

     if (chapterId !== null && chapterId!== 0) {
      if (chapterId === 7) {
        const listQuestionCritical = this.listQuestion.filter(
          (q) => q.isCritical === true,
        );
        this.listQuestion = listQuestionCritical;
        return  this.listQuestion;
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
}
