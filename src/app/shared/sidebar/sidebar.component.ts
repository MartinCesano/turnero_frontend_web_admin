import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  activeLink: string;

  constructor(private router: Router) {
    this.activeLink = this.router.url; // Inicialmente establecemos el enlace activo a la ruta actual
  }


  activarSidebar() {
    console.log("Activar sidebar");
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('translate-x-full');
      sidebar.classList.toggle('md:translate-x-0');
      sidebar.classList.toggle('sm:-translate-x-80');
      sidebar.classList.toggle('sm:translate-x-0');
      sidebar.classList.toggle('-translate-x-80');
    } else {
      console.error("Elemento con ID 'sidebar' no encontrado.");
    }
  }

  setActiveLink(link: string) {
    this.activeLink = link;
  }

  signOut() {
    localStorage.removeItem('token');
  }
}
