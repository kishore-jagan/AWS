import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AwsData, EcfsData } from '../models/ecfs_model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private ecfsapiUrl = 'http://localhost:3000/api/ecfsData';
  private awsapiUrl = 'http://localhost:3000/api/awsData';

  constructor(private http: HttpClient) {}

  getEcfsData(): Observable<EcfsData[]> {
    return this.http.get<EcfsData[]>(this.ecfsapiUrl);
  }

  getAwsData(): Observable<AwsData[]> {
    return this.http.get<AwsData[]>(this.awsapiUrl);
  }
}
