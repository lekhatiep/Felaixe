import { Component, inject, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-practice-test-result',
  standalone: true,
  imports: [],
  templateUrl: './practice-test-result.component.html',
  styleUrl: './practice-test-result.component.scss',
})
export class PracticeTestResultComponent implements OnInit {
  private examService = inject(ExamService);

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
