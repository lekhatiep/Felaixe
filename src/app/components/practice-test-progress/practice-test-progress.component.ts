import { Component, inject, Input, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-practice-test-progress',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './practice-test-progress.component.html',
  styleUrl: './practice-test-progress.component.scss',
})
export class PracticeTestProgressComponent implements OnInit {
  @Input() isStarted: boolean = false;
  private examService = inject(ExamService);
  displayTimer: string = '';
  widthProgress: number = 100;
  isDanger : boolean = false;

  ngOnInit(): void {
    if (this.isStarted == true) {
    }
    this.timer(20); // 30p * 60
  }

  timer(totalSeconds: number) {
    let initSeconds = totalSeconds;
    let minute: number = Math.floor(totalSeconds / 60);
    let textSec: any = '0';
    let seconds = totalSeconds % 60;
    const prefix = minute < 10 ? '0' : '';

    const countDownTimer = setInterval(() => {
      
      if(seconds != 0){
        seconds --;
      }else{
        seconds = 59
      }
      totalSeconds--;
      this.widthProgress = (totalSeconds) * 100 / initSeconds;
      
      if(this.widthProgress < 30){
        console.log('warning');
        
        this.isDanger = true;
      }

      if (seconds < 10) {
        textSec = '0' + seconds;
      } else {
        textSec = seconds;
      }

      this.displayTimer = `${prefix}${Math.floor(totalSeconds / 60)} : ${textSec}`;

      if (totalSeconds === 0 && Math.floor(totalSeconds / 60) == 0) {
        //console.log('FINISHED');
        this.examService.setTimer(totalSeconds);
        clearInterval(countDownTimer);
      }
    }, 1000);
  }
}
