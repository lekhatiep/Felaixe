import { Routes } from '@angular/router';
import { QuestionContainerComponent } from './components/question-container/question-container.component';
import { ExamComponent } from './pages/exam/exam.component';
import { PracticeTestComponent } from './components/practice-test/practice-test.component';
import { confirmLeaveGuard } from './guards/confirm-leave.guard';

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
    canDeactivate: [confirmLeaveGuard]
  },
  {
    path: 'practice-test',
    component: PracticeTestComponent
  },
  //NOTE: path ** always in end position
  {
    path: '**',
    redirectTo: 'page-not-found',
  },
];
