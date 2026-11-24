import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { BackendService } from '../services/prueba.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-traductor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traductor.component.html',
  styleUrl: './traductor.component.css'
})
export class TraductorComponent implements OnInit {
  videoUrl: string = '';
  isAdmin = false;
  role = '';
   username = '';
  constructor(private backend: BackendService) {}

  ngOnInit() {
    // 🔄 Se suscribe al stream de video
   //this.backend.videoUrl$.subscribe(url => {
     //this.videoUrl = url;
//  });

  this.role = localStorage.getItem('role') || '';
    this.username = localStorage.getItem('username') || '';
    this.isAdmin = this.role.toLowerCase() === 'admin';
    console.log('Usuario en Traductor:', this.username, 'Rol:', this.role);
  }

  administrar() {
    alert('Accediendo al panel de administración');
  }

  logout() {
  // Limpiar localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('username');

  // Redirigir al login
  window.location.href = '/';
}

}