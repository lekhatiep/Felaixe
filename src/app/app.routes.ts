import { Routes } from '@angular/router';
import { QuestionContainerComponent } from './components/question-container/question-container.component';
import { ExamComponent } from './pages/exam/exam.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Home page',
    component: QuestionContainerComponent,
  },
  {
    path: 'exam',
    title: 'Thi thu',
    component: ExamComponent,
  },
  //NOTE: path ** always in end position
  {
    path: '**',
    redirectTo: 'page-not-found',
  },
];
