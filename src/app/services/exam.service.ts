import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConstants } from '../constants/app.constants';
import {
  Answer,
  Question,
  QuizState,
} from '../components/question-card/model/question.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiService = inject(ApiService);
  exercise_mode = AppConstants.STUDY;

  currentPartSubject = new BehaviorSubject<number>(0);
  currentPart$ = this.currentPartSubject.asObservable();

  listExamQuestion: Question[] = [];

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
  listQuizState: QuizState[] = [];
  changedQuizStateSubject = new BehaviorSubject<boolean>(false);
  changedQuizState$ = this.changedQuizStateSubject.asObservable();

  nextQuestionSubject = new BehaviorSubject<Question | undefined>(undefined);
  nextQuestion$ = this.nextQuestionSubject.asObservable();

  selectedQuestionNumberSubject = new BehaviorSubject<number | null>(null);
  selectedQuestionNumber$ = this.selectedQuestionNumberSubject.asObservable();
  quizState: QuizState | undefined;

  currentIndex: number = 0;

  setCurrentPart(part: number) {
    this.currentPartSubject.next(part);
  }

  setExerciseMode(mode: 'study' | 'exam') {
    this.exercise_mode = mode;
  }

  getExerciseMode() {
    return this.exercise_mode;
  }

  loadExamQuestions() {
    this.refreshTempListAnswered();
    return this.apiService.getExamQuestions();
  }

  getCurrentQuestion(questionNumber: number): Question | undefined {
    if (this.listExamQuestion.length === 0) {
      this.loadExamQuestions();
    }
    if (questionNumber < 1 || questionNumber > this.listExamQuestion.length) {
      return undefined;
    }
    return (this.currentQuestion =
      this.listExamQuestion.find((q) => q.questionNumber === questionNumber) ||
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
    const storedQuizState = localStorage.getItem('list-exam-quiz-state');
    if (storedQuizState) {
      this.listQuizState = JSON.parse(storedQuizState);
    }
    return this.listQuizState;
  }

  setQuizStateAnswer(quizState: QuizState) {
    const listQuizStateString = localStorage.getItem('list-exam-quiz-state');
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
        'list-exam-quiz-state',
        JSON.stringify(this.listQuizState),
      );
      this.changedQuizStateSubject.next(true);
      return;
    }
    this.listQuizState.push(quizState);
    localStorage.setItem('list-exam-quiz-state', JSON.stringify(this.listQuizState));
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

  setCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  refreshTempListAnswered(){
    localStorage.removeItem('list-exam-quiz-state');
  }
}
