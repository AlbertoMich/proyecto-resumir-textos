import { Component, OnInit } from '@angular/core';
import { ResumenService, Summary } from '../services/serviceresumen/resumen.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {

  texto: string = '';
  resumenGenerado: string = '';
  historial: Summary[] = [];
  cargando: boolean = false;

  // Usuario
  username: string = '';
  role: string = '';
  isAdmin: boolean = false;

  // Admin
  adminData: any[] = [];

  constructor(private resumenService: ResumenService) { }

  ngOnInit(): void {
    // Leer usuario y rol desde localStorage
    this.username = localStorage.getItem('username') || '';
    this.role = localStorage.getItem('role') || '';
    this.isAdmin = this.role.toLowerCase() === 'admin';
    console.log('Usuario actual:', this.username, 'Rol:', this.role);

    // Cargar historial del usuario
    this.loadHistorial();
  }

  // Generar resumen
  generarResumen() {
    if (!this.texto.trim()) {
      alert('Ingresa un texto antes de generar un resumen.');
      return;
    }

    this.cargando = true;
    this.resumenService.createSummary(this.texto).subscribe({
      next: (res) => {
        this.resumenGenerado = res.resumen;
        this.texto = '';
        this.loadHistorial();  // Actualizar historial
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        alert('Error al generar el resumen.');
        this.cargando = false;
      }
    });
  }

  // Cargar historial del usuario
  loadHistorial() {
    this.resumenService.getSummaries().subscribe({
      next: (res) => this.historial = res,
      error: (err) => console.error(err)
    });
  }

  // Copiar texto al portapapeles
  copiarPortapapeles(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Resumen copiado al portapapeles!');
    });
  }

  // Logout
  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('access_token');
    window.location.href = '/';
  }

  // Funcionalidad de admin: obtener todos los usuarios y sus resúmenes
  administrar() {
    if (!this.isAdmin) return;

    this.resumenService.getUsersSummaries().subscribe({
      next: (res) => {
        this.adminData = res;
        console.log('Usuarios y resúmenes:', res);
      },
      error: (err) => {
        console.error(err);
        alert('No autorizado o error al obtener datos');
      }
    });
  }

verPDF(textoOriginal: string, resumen: string) {
  const doc = new jsPDF();

  const pageHeight = doc.internal.pageSize.height; 
  let y = 10; 

  const addTextWithPagination = (text: string[], startY: number) => {
    let yPosition = startY;

    text.forEach(line => {
      if (yPosition > pageHeight - 20) { 
        doc.addPage();
        yPosition = 10; 
      }
      doc.text(line, 10, yPosition);
      yPosition += 7; 
    });

    return yPosition;
  };


  doc.setFontSize(16);
  doc.text('Resumen generado', 10, y);
  y += 10;

  
  doc.setFontSize(12);
  doc.text('Texto Original:', 10, y);
  y += 10;

  const originalLines = doc.splitTextToSize(textoOriginal, 180);
  y = addTextWithPagination(originalLines, y);

  y += 10;
  if (y > pageHeight - 20) { 
    doc.addPage();
    y = 10;
  }

  doc.text('Resumen:', 10, y);
  y += 10;

  const resumenLines = doc.splitTextToSize(resumen, 180);
  addTextWithPagination(resumenLines, y);


  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  window.open(url);
}


  

  // Eliminar un resumen
  eliminarResumen(userIndex: number, summaryIndex: number) {
    const user = this.adminData[userIndex];
    const summary = user.summaries[summaryIndex];
    if (!summary || !summary.id) return;

    if (!confirm('¿Eliminar este resumen?')) return;

    this.resumenService.deleteSummary(summary.id).subscribe({
      next: () => {
        alert('Resumen eliminado');
        this.administrar();
      },
      error: (err) => console.error(err)
    });
  }

  // Eliminar un usuario y todos sus resúmenes
  eliminarUsuario(userIndex: number) {
    const user = this.adminData[userIndex];
    if (!user || !user.id) return;

    if (!confirm('¿Eliminar este usuario y todos sus resúmenes?')) return;

    this.resumenService.deleteUser(user.id).subscribe({
      next: () => {
        alert('Usuario eliminado');
        this.administrar();
      },
      error: (err) => console.error(err)
    });
  }
  eliminarResumenUsuario(index: number) { const resumen = this.historial[index]; if (!resumen?.id) return; if (!confirm('¿Eliminar este resumen?')) return; this.resumenService.deleteSummary(resumen.id).subscribe({ next: () => { this.historial.splice(index, 1); alert('Resumen eliminado'); }, error: (err) => console.error(err) }); }

}
