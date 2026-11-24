import { Component } from '@angular/core';
import { LoginService } from '../services/servicelogin/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 username = '';
  password = '';
  message = '';
  showPassword = false;

  constructor(private loginService: LoginService, private router: Router) {}

login() {
    if (!this.username || !this.password) {
      this.message = 'Todos los campos son obligatorios';
      return;
    }

    this.loginService.login(this.username, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);

        // Obtener info del usuario
        this.loginService.getMe(res.access_token).subscribe({
          next: (user) => {
            localStorage.setItem('role', user.role);
            localStorage.setItem('username', user.username);
            console.log('Usuario:', user.username, 'Rol:', user.role);
            this.router.navigate(['/resumen']);
          },
          error: (err) => {
            console.error('Error obteniendo usuario', err);
            this.message = 'No se pudo obtener información del usuario';
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.message = 'Credenciales incorrectas';
      }
    });
  }

  register() {
    if (!this.username || !this.password) {
      this.message = 'Todos los campos son obligatorios';
      return;
    }

    this.loginService.register(this.username, this.password).subscribe({
      next: () => this.message = 'Usuario registrado exitosamente',
      error: (err) => {
        this.message = 'Error al registrar usuario';
        console.error(err);
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
