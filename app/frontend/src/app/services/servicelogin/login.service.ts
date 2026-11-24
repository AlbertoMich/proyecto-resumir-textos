import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
interface RegisterResponse {
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {

 //public apiUrl = 'http://localhost:8000/auth'; // URL del backend FastAPI
 private apiUrl = 'http://10.5.20.50:9005/auth'; // URL del backend FastAPI
  constructor(private http: HttpClient) { }

  // Registrar usuario (user o admin)
  register(username: string, password: string, role: string = 'user'): Observable<RegisterResponse> {
    // Post con x-www-form-urlencoded
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    body.set('role', role); // si tu backend permite role dinámico

    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, body.toString(), { headers });
  }

  // Login usuario
  login(username: string, password: string): Observable<any> {
  const body = new URLSearchParams();
  body.set('username', username);
  body.set('password', password);

  const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

  // Suscribirse internamente para guardar el token
  return new Observable(observer => {
    this.http.post<any>(`${this.apiUrl}/login`, body.toString(), { headers }).subscribe({
      next: (res) => {
        // Guardar solo el token
        localStorage.setItem('access_token', res.access_token);

        // Emitir la respuesta al componente que llamó
        observer.next(res);
        observer.complete();
      },
      error: (err) => observer.error(err)
    });
  });
}

   getMe(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }
}
