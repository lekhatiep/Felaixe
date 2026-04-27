import { Component } from '@angular/core';
import { QuestionContainerComponent } from "./components/question-container/question-container.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuestionContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FeLaixe';
}
