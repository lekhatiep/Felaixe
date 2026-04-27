import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Question, QuestionResponseModel } from "../components/question-card/model/question.model";
import { BehaviorSubject, catchError, map, Observable } from "rxjs";

@Injectable({ providedIn: 'root'})
export class ApiService {
    private apiUrl = 'https://localhost:7093/api'; // Replace with your actual API URL
    private httpClient = inject(HttpClient);
    questionResponse = signal<QuestionResponseModel | null>(null);
    question$ = new BehaviorSubject<QuestionResponseModel | null>(null);

    getQuestions(){

          return this.httpClient.get<Question[]>(`${this.apiUrl}/Questions/GetQuestionsByCategoryId?CategoryId=1`).pipe(
            map((response) => {
                this.questionResponse.set(response);
                this.question$.next(response);
                return response;
            }),
            catchError((error) => {
                console.error('Error fetching questions:', error);
                throw error;
             })
        );
       
    }

    fetchQuestionsByCategoryId(categoryId: number) {
        return this.httpClient.get<QuestionResponseModel>(`${this.apiUrl}/Questions/GetQuestionsByCategoryId?CategoryId=${categoryId}`).pipe(
            map((response) => {
                console.log('Received question response from API:', response);
                return response;
            }),
            catchError((error) => {
                console.error('Error fetching questions:', error);
                throw error;
             })
        );
    }

    
}