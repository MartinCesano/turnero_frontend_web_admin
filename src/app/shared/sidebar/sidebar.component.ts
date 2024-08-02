import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = true; // Cambiado para que esté abierto por defecto
  activeLink: string;

  constructor(private router: Router) {
    this.activeLink = this.router.url; // Inicialmente establecemos el enlace activo a la ruta actual
  }

  setActiveLink(link: string) {
    this.activeLink = link;
  }

  signOut() {
    localStorage.removeItem('token');
  }
}
