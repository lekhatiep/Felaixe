import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import {
  Question,
  QuestionResponseModel,
} from '../components/question-card/model/question.model';
import { AppConstants } from '../constants/app.constants';
import { SubmissionExam } from '../models/submissionExam.model';
import { ResultExam } from '../models/resultExam.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = AppConstants.API_ENDPOINT_2; // Replace with your actual API URL
  private httpClient = inject(HttpClient);
  questionResponse = signal<QuestionResponseModel | null>(null);
  question$ = new BehaviorSubject<QuestionResponseModel | null>(null);

  getQuestions() {
    return this.httpClient
      .get<
        Question[]
      >(`${this.apiUrl}/api/Questions/GetQuestionsByCategoryId?CategoryId=1`)
      .pipe(
        map((response) => {
          this.questionResponse.set(response);
          this.question$.next(response);
          return response;
        }),
        catchError((error) => {
          console.error('Error fetching questions:', error);
          throw error;
        }),
      );
  }

  fetchQuestionsByCategoryId(categoryId: number) {
    return this.httpClient
      .get<QuestionResponseModel>(
        `${this.apiUrl}/api/Questions/GetQuestionsByCategoryId?CategoryId=${categoryId}`,
      )
      .pipe(
        map((response) => {
          console.log('Received question response from API:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error fetching questions:', error);
          throw error;
        }),
      );
  }

  getExamQuestions(typeExamB : number) {
    return this.httpClient
      .get<Question[]>(`${this.apiUrl}/api/Questions/GetRandomExampleQuestionB?multiplier=${typeExamB}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching questions:', error);
          return throwError(() => error);
        }),
      );
  }

  postExam(data: SubmissionExam) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient
      .post<ResultExam>(`${this.apiUrl}/api/Questions/SubmitExam`, data, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching questions:', error);
          return throwError(() => error);
        }),
      );
      // .subscribe({
      //   next: (response) => {
      //     console.log('Success:', response)
      //   },
      //   error: (err) => console.error('Error:', err),
      //   complete: () => console.log('Request finished'),
      // });
  }
}
