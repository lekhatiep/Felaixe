import { Component } from '@angular/core';
import { QuestionContainerComponent } from "./components/question-container/question-container.component";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuestionContainerComponent, MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FeLaixe';
}
