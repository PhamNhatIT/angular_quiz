import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  public name: string = '';
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer = 0;
  inCorrectAnswer = 0;
  interval$: any;
  public progress: string = '0';
  public isQuizCompleted: boolean = false;
  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startCounter();
  }
  getAllQuestions() {
    this.questionService.getQuestionJson().subscribe((res) => {
      this.questionList = res.questions;
    });
  }
  nextQuestion() {
    console.log('currentQuestion++: ' + this.currentQuestion);
    this.currentQuestion++;
    if (this.currentQuestion > 8) {
      this.currentQuestion = 0;
    }
  }
  previousQuestion() {
    console.log('currentQuestion--: ' + this.currentQuestion);
    this.currentQuestion--;
    if (this.currentQuestion < 0) {
      this.currentQuestion = 8;
    }
  }
  answer(currentQNo: number, option: any) {
    if(currentQNo === this.questionList.length){
      this.isQuizCompleted =true;
      this.endCountter();
    }
    if (option.correct) {
      this.points += 10;
      this.correctAnswer++;
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
    } else {
      setTimeout(() => {
        this.inCorrectAnswer--;
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
      this.points -= 10;
    }
  }
  startCounter() {
    this.interval$ = interval(1000).subscribe((val) => {
      this.counter--;
      if (this.counter === 0) {
        this.currentQuestion++;
        this.points -= 10;
        this.counter = 60;
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }
  endCountter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }
  resetCounter() {
    this.endCountter();
    this.counter = 60;
    this.startCounter();
  }
  resetQuiz() {
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = '0';
  }
  getProgressPercent() {
    this.progress = (
      (this.currentQuestion / this.questionList.length ) *
      100
    ).toString();
    console.log('progress = '+this.progress);
    return this.progress;
  }
}
