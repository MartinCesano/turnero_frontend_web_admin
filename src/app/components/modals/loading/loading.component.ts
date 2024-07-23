import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para usar directivas comunes
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  text = "Se están cargando los datos, aguarde unos segundos.";

  constructor(@Inject(MAT_DIALOG_DATA) public data: string | null) { 
    if (data){
      this.text = data
    }
  }
}
