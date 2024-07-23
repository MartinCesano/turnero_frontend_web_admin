import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor() {}



  activarSidebar() {
    const sidebar = document.getElementById('sidebar'); //no deberia estar esta importacion, esto es del sidebar html
    if (sidebar) {
      sidebar.classList.toggle('translate-x-full');
      sidebar.classList.toggle('md:translate-x-0');
      sidebar.classList.toggle('sm:-translate-x-80');
      sidebar.classList.toggle('sm:translate-x-0');   
      sidebar.classList.toggle('-translate-x-80');   

      
    }
  }

}
