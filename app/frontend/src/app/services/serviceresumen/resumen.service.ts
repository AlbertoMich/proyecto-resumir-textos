import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Summary {
  id: number;
  texto_original: string;
  resumen: string;
  created_at: string;
}

export interface UserSummary {
  id: number;
  username: string;
  role: string;
  summaries: Summary[];
}

@Injectable({
  providedIn: 'root'
})
export class ResumenService {

  private apiUrl = 'http://10.5.20.50:9005/summaries';
  private adminUrl = 'http://10.5.20.50:9005/admin';

  constructor(private http: HttpClient) { }

  // Obtener JWT guardado
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Headers con Authorization
  private authHeaders() {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // Crear un nuevo resumen
  createSummary(text: string): Observable<Summary> {
    return this.http.post<Summary>(this.apiUrl, { text }, this.authHeaders());
  }

  // Obtener historial de resúmenes del usuario
  getSummaries(): Observable<Summary[]> {
    return this.http.get<Summary[]>(this.apiUrl, this.authHeaders());
  }

  // ADMIN: obtener todos los usuarios y sus resúmenes
  getUsersSummaries(): Observable<UserSummary[]> {
    return this.http.get<UserSummary[]>(`${this.adminUrl}/users-summaries`, this.authHeaders());
  }

  // ADMIN: eliminar resumen
  deleteSummary(summaryId: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}/summary/${summaryId}`, this.authHeaders());
  }

  // ADMIN: eliminar usuario
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}/user/${userId}`, this.authHeaders());
  }

}
