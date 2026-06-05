import { Component } from '@angular/core';
import { PracticeTestResultComponent } from "../../components/practice-test-result/practice-test-result.component";
import { QuestionContainerComponent } from "../../components/question-container/question-container.component";

@Component({
  selector: 'app-exam-review',
  standalone: true,
  imports: [PracticeTestResultComponent, QuestionContainerComponent],
  templateUrl: './exam-review.component.html',
  styleUrl: './exam-review.component.scss'
})
export class ExamReviewComponent {

}
