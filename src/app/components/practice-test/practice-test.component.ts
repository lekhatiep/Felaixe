import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PracticeTestCardComponent } from '../practice-test-card/practice-test-card.component';
import { MatIcon } from '@angular/material/icon';
import { ExamService } from '../../services/exam.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-practice-test',
  standalone: true,
  imports: [PracticeTestCardComponent, MatIcon],
  templateUrl: './practice-test.component.html',
  styleUrl: './practice-test.component.scss',
})
export class PracticeTestComponent implements OnInit {
  @Input() totalQuestion: number = 0;
  @Input() timeExam: number = 0;

  @Output() backStep_1 = new EventEmitter<boolean>();
  @Output() messageEvent = new EventEmitter<string>();

  private examService = inject(ExamService);
  private destroyRef = inject(DestroyRef);
  typeExamB: 'B_new' | 'B_old' = 'B_old';

  onBack() {
    this.backStep_1.emit(true);
  }

  sendMessage() {
    console.log('emit');

    // 2. Emit the event with data
    this.messageEvent.emit('Hello from Child!');
  }

  ngOnInit(): void {
    this.examService.currentTypeExamB$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type) => {
        this.typeExamB = type;
        if (this.typeExamB == 'B_old') {
          this.totalQuestion = 30;
          this.timeExam = 30;
        }

        if (this.typeExamB == 'B_new') {
          this.totalQuestion = 60;
          this.timeExam = 30;
        }
      });
  }
}
