import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, Subject } from 'rxjs';
import { AppConstants } from '../constants/app.constants';
import {
  Answer,
  Question,
  QuizState,
} from '../components/question-card/model/question.model';
import { ApiService } from './api.service';
import { SubmissionExam } from '../models/submissionExam.model';
import { ResultExam } from '../models/resultExam.model';

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
  submissionExam: SubmissionExam | undefined;

  timerSubject = new Subject<number>(); //không emit giá trị mặc định chỉ emit khi .next()
  timer$ = this.timerSubject.asObservable();

  typeExamB: 'B_new' | 'B_old' = 'B_old';
  currentStepSubject = new BehaviorSubject<number>(0);
  currentStep$ = this.currentStepSubject.asObservable();

  currentTypeExamBSubject = new BehaviorSubject<'B_new' | 'B_old'>('B_old');
  currentTypeExamB$ = this.currentTypeExamBSubject.asObservable();

  endCurrentExamSubject = new BehaviorSubject<boolean>(false);
  endCurrentExam$ = this.endCurrentExamSubject.asObservable();

  setCurrentPart(part: number) {
    this.currentPartSubject.next(part);
  }

  setExerciseMode(mode: 'study' | 'exam') {
    this.exercise_mode = mode;
  }

  getExerciseMode() {
    return this.exercise_mode;
  }

  loadExamQuestions(): Observable<Question[]> {
    //this.refreshTempListAnswered();
    const storedQuestions = localStorage.getItem('list-exam-question');
    if (storedQuestions) {
      let questions: Question[] = JSON.parse(storedQuestions);

      return of(questions);
    }
    return this.apiService.getExamQuestions().pipe(
      map((data) => {
        localStorage.setItem('list-exam-question', JSON.stringify(data));
        return data;
      }),
    );
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
    localStorage.setItem(
      'list-exam-quiz-state',
      JSON.stringify(this.listQuizState),
    );
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

  refreshTempListAnswered() {
    localStorage.removeItem('list-exam-quiz-state');
  }

  submitExam(startTime : Date) {
    //alert('Submited');

    const storedQuestions = localStorage.getItem('list-exam-question');
    let submissionExam: SubmissionExam;
    let answers: Record<number, number> = {};

    if (storedQuestions) {
      let questions: Question[] = JSON.parse(storedQuestions);
      const questionIDs: number[] = questions.map((q) => q.questionNumber);

      submissionExam = {
        questionIds: questionIDs,
        answers: answers,
        startTime: new Date(startTime),
        endTime: new Date()
      };

      const listQuizAnswerString = localStorage.getItem('list-exam-quiz-state');

      if (listQuizAnswerString) {
        let listAnswer: QuizState[] = JSON.parse(listQuizAnswerString);

        listAnswer.map((a) => {
          answers[a.questionNumber] = a.answerId;
        });

        //console.log(questionIDs, answers);

        submissionExam.answers = answers;
      } else {
        questions.map((q) => (answers[q.questionNumber] = 0));
      }

      //return;
      this.apiService.postExam(submissionExam).subscribe({
        next: (response) => {
          //console.log('Success:', response);
          alert(response.isPassed ? 'Pass roi' : 'Rot thi lai bai moi');
          console.log('response', response);

          this.saveHistoryExam(response);
          this.resetExamAnswers();
        },
        error: (err) => {
          console.error('Error:', err);
          alert("SERVER ERROR !!!")
          this.resetExamAnswers();
          //window.location.reload();
        },
        complete: () => console.log('Request finished'),
      });
    }
  }

  saveHistoryExam(data: ResultExam) {
    const storedHistoryExam = localStorage.getItem('history-exam');
    if (storedHistoryExam) {
      var listHis: ResultExam[] = JSON.parse(storedHistoryExam);
      listHis.push(data);
      localStorage.setItem('history-exam', JSON.stringify(listHis));
      return;
    }
    const listResult: ResultExam[] = [];
    listResult.push(data);
    localStorage.setItem('history-exam', JSON.stringify(listResult));
  }

  loadHistoryExam() {
    const storedHistoryExam = localStorage.getItem('history-exam');
    if (storedHistoryExam) {
      return JSON.parse(storedHistoryExam);
    }
  }

  resetExamAnswers() {
    localStorage.removeItem('list-exam-quiz-state');
    //window.location.reload();
  }

  setTimer(seconds: number) {
    this.timerSubject.next(seconds);
  }

  setCurrentTypeB(typeExamB: 'B_new' | 'B_old') {
    this.currentTypeExamBSubject.next(typeExamB);
  }

  setCurrentStep(step: number) {
    this.currentStepSubject.next(step);
  }

  setEndCurrentExam(isEnd: boolean) {
    this.endCurrentExamSubject.next(isEnd);
  }
}
