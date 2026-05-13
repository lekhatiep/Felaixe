import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppConstants } from '../../constants/app.constants';
import { ExamService } from '../../services/exam.service';
import { SideBarExamComponent } from '../side-bar-exam/side-bar-exam.component';
import { SideBarQuestionComponent } from '../side-bar-question/side-bar-question.component';

@Component({
  selector: 'app-side-bar-wrap',
  standalone: true,
  imports: [SideBarExamComponent, SideBarQuestionComponent],
  templateUrl: './side-bar-wrap.component.html',
  styleUrl: './side-bar-wrap.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SideBarWrapComponent implements OnInit {
  @Input({required: true}) mode : string = 'study';
  private examService = inject(ExamService);

  ngOnInit(): void {
   
  
     console.log(this.mode);
  }
}
