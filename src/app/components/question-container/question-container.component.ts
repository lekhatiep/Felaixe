import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SideBarQuestionComponent } from '../side-bar-question/side-bar-question.component';
import { QuestionCardComponent } from '../question-card/question-card.component';
import { Chapter } from './model/chapter.model';
import { QuestionContentExamComponent } from '../question-content-exam/question-content-exam.component';
import { SideBarExamComponent } from '../side-bar-exam/side-bar-exam.component';
import { SideBarWrapComponent } from "../side-bar-wrap/side-bar-wrap.component";

@Component({
  selector: 'app-question-container',
  standalone: true,
  imports: [
    SideBarQuestionComponent,
    QuestionCardComponent,
    QuestionContentExamComponent,
    SideBarExamComponent,
    SideBarWrapComponent
],
  templateUrl: './question-container.component.html',
  styleUrl: './question-container.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class QuestionContainerComponent {
  @Input() mode: 'study' | 'exam' = 'study';

  
}
