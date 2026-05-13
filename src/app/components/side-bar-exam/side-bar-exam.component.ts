import { Component, DestroyRef, HostListener, inject, ViewEncapsulation } from '@angular/core';
import { Answer, Question, QuizState } from '../question-card/model/question.model';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-side-bar-exam',
  standalone: true,
  imports: [MatIcon, CommonModule],
  templateUrl: './side-bar-exam.component.html',
  styleUrl: './side-bar-exam.component.scss'
})
export class SideBarExamComponent {
  private examService = inject(ExamService);
   private destroyRef = inject(DestroyRef);
 
   selected = 'option2';
   selectChapterId: number = 0;
   isOpen = false;
   classIconName = '';
   listQuestion: Question[] = [];
   isAnswered: boolean | undefined = false;
   isCorrectAns: boolean | undefined = false;
   selectedQuestionNumberId: number = 0;
   currentIndex: number = 0;
   answer: Answer | undefined;
   listQuizState: QuizState[] = [];
 
 
   @HostListener('document:click', ['$event'])
   onClickOutside(event: any) {
     if (!event.target.closest('.dropdown')) {
       this.isOpen = false;
     }
   }
 
   ngOnInit() {
    //this.listQuestion = this.examService.loadExamQuestions();
    
     this.loadExamQuestion();
 
    //  this.examService.currentAnswerSelected$
    //    .pipe(takeUntilDestroyed(this.destroyRef))
    //    .subscribe({
    //      next: (data) => {
    //        console.log(data?.isCorrect);
    //        this.isCorrectAns = data?.isCorrect;
    //        this.isAnswered = true;
    //      },
    //    });
 
    //  this.examService.changedQuizState$
    //    .pipe(takeUntilDestroyed(this.destroyRef))
    //    .subscribe({
    //      next: (data) => {
    //        this.listQuizState = this.examService.loadQuizStateAns();
    //      },
    //    });
 
 
    //  this.examService.currentQuestionSelected$
    //    .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
    //    .subscribe({
    //      next: (question) => {
    //        if (question) {
    //          const currentIndex = this.listQuestion.findIndex(
    //            (q) => q.questionNumber == question.questionNumber,
    //          );
    //          const currentQuestionNumber = this.listQuestion[currentIndex];
    //          this.selectQuestion(currentQuestionNumber);
    //        }
    //      },
    //    });
 
       this.currentIndex = this.examService.getCurrentIndex();
   }
 

 
   toggleDropdown() {
     this.isOpen = !this.isOpen;
   }

 
   loadExamQuestion() {
     this.examService.loadExamQuestions().subscribe((data)=>{
      this.listQuestion =  data;
     });
     this.listQuestion.map((q) => ({
       ...q,
       state: 'default',
     }));
 
     this.listQuizState = this.examService.loadQuizStateAns();
 
     this.listQuestion.map((q) => {
       const qs = this.listQuizState.find(
         (qs) => qs.questionNumber == q.questionNumber,
       );
       if (qs) {
         q.state = 'answered';
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
         q.state = 'answered'
        
       } else {
         q.state = 'default';
       }
     });
 
     selectQuestion.state = 'active';
 
     this.examService.setCurrentQuestion(selectQuestion);
 
     this.currentIndex = this.listQuestion.indexOf(selectQuestion);
     this.examService.setCurrentIndex(this.currentIndex);
   }
 
   removeQuizState() {
     localStorage.removeItem('list-exam-quiz-state');
   }
}
