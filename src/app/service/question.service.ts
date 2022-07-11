

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  public url = 'assets/questions.json';
  constructor(private http: HttpClient) { }

  getQuestionJson() {
    return this.http.get<any>(this.url);
  }
}
