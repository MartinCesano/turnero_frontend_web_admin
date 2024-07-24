import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  title = 'front';

  ngOnInit() {//cada vez que se inicia la aplicación, se inicializa el token de refresco
    this.authService.initializeTokenRefresh();
  }
}
