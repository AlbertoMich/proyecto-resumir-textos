import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface HealthResponse {
  status: string;
}

export interface MensajeResponse {
  mensaje: string;
}

export interface RootResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private apiUrl = 'http://10.5.20.50:9005';
  //private apiUrl = 'http://127.0.0.1:9005';
 // private videoUrlSubject = new BehaviorSubject<string>(this.getFreshVideoUrl());
  //videoUrl$ = this.videoUrlSubject.asObservable();

  constructor(private http: HttpClient) {
    //🔁 Refresca la imagen cada 100 ms
   setInterval(() => {
     // this.videoUrlSubject.next(this.getFreshVideoUrl());
    }, 100);
  }

  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.apiUrl}/health`);
  }

  getMensaje(): Observable<MensajeResponse> {
    return this.http.get<MensajeResponse>(`${this.apiUrl}/mensaje`);
  }

  getRoot(): Observable<RootResponse> {
    return this.http.get<RootResponse>(`${this.apiUrl}/`);
  }


//private getFreshVideoUrl(): string {
  //  return `${this.apiUrl}/video?t=${new Date().getTime()}`;
  //}
}
