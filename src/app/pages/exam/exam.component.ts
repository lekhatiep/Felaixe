import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PracticeComponent } from '../../components/practice/practice.component';
import { PracticeTestComponent } from '../../components/practice-test/practice-test.component';
import { PracticeTestProgressComponent } from '../../components/practice-test-progress/practice-test-progress.component';
import { PracticeTestResultComponent } from '../../components/practice-test-result/practice-test-result.component';
import { PracticeHistoryComponent } from '../../components/practice-history/practice-history.component';
import { ExamService } from '../../services/exam.service';
import { QuestionContainerComponent } from "../../components/question-container/question-container.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [
    PracticeComponent,
    PracticeTestComponent,
    PracticeTestProgressComponent,
    PracticeTestResultComponent,
    PracticeHistoryComponent,
    QuestionContainerComponent
],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss',
})
export class ExamComponent implements OnInit {
  private examService = inject(ExamService);
  private destroyRef = inject(DestroyRef);
  showPractice: boolean = false;
  showProgress: boolean = false;
  showResult: boolean = false;
  step: number = 0;
  step_1: number = 1; /*Chon hang thi*/
  step_2: number = 2; /*Chon de thi*/
  step_3: number = 3; /*Chon lam bai*/
  step_4: number = 4; /*Show ket qua*/

  message = '';

  ngOnInit(): void {
    this.step = this.step_3;

    this.examService.currentPart$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((part)=>{
      if(part > 0){
        console.log(part);
        
        this.step = part;
      }
    })
  }

  nextStep(step: number) {
    this.step = step;
  }

  handleBackStep(input: boolean) {
    if (input) {
      this.step = this.step_1;
    }
  }

  receiveMessage(msg: string) {
    console.log('back');
    this.message = msg;
  }
}
