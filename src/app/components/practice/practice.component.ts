import { Component } from '@angular/core';
import { ExamCardComponent } from "../exam-card/exam-card.component";

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [ExamCardComponent],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss'
})
export class PracticeComponent {

}
