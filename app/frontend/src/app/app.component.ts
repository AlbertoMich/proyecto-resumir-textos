import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BackendService, MensajeResponse } from './services/prueba.service';
import { LoginComponent } from "./login/login.component";

import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, RouterOutlet],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {


  constructor() {}

  mostrarBienvenida = true;

  ocultarBienvenida() {
    this.mostrarBienvenida = false;
  }

}
