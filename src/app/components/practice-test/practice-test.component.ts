import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PracticeTestCardComponent } from "../practice-test-card/practice-test-card.component";
import { ExamCardComponent } from "../exam-card/exam-card.component";

@Component({
  selector: 'app-practice-test',
  standalone: true,
  imports: [PracticeTestCardComponent, ExamCardComponent],
  templateUrl: './practice-test.component.html',
  styleUrl: './practice-test.component.scss'
})
export class PracticeTestComponent {
  @Output() backStep_1 = new EventEmitter<boolean>();
  @Output() messageEvent = new EventEmitter<string>();

  onBack(){
    this.backStep_1.emit(true)
  }

  sendMessage() {
    console.log("emit");
    
    // 2. Emit the event with data
    this.messageEvent.emit('Hello from Child!');
  }
}
