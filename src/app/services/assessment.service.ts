import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Assessment } from '../models/Assessment';
import { Responses } from '../models/Responses';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  httpClient = inject(HttpClient);

  private API_URL = environment.API_URL;

  constructor() { }

  newAssessment(assessment: Assessment) {
    return this.httpClient.post<Assessment | Responses>(`${this.API_URL}/listing/assessment`, assessment);
  }

  fetchAll(status: string | null){
    return this.httpClient.get<Assessment[] | Responses>
  }
}
