import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from './loading/loading.component';
import { MessageTypesComponent } from './message-types/message-types.component'; 
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog,
    private router: Router,

  ) { }


  //region Modal de Mensajes
  openMenssageTypes(data: any): void {
    const dialogRef = this.dialog.open(MessageTypesComponent, {
      width: '700px',
      disableClose: false,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (data.url){
        this.router.navigateByUrl(data.url)
      }
      // Acciones después de cerrar el modal
    });
  }
  //endregion


  


  //region Modal Cargando
  loading(text: string | null): void {
    document.body.classList.add('no-scroll'); // Deshabilitar el scroll

    // Lógica para abrir el modal de carga
    const dialogRef = this.dialog.open(LoadingComponent, {
      width: '700px',
      disableClose: true,
      data: text
    });

    dialogRef.afterClosed().subscribe(result => {
      document.body.classList.remove('no-scroll'); // Habilitar el scroll nuevamente
      // Acciones después de cerrar el modal
    });
  }
  loadingClose(): void {
    document.body.classList.remove('no-scroll'); // Habilitar el scroll nuevamente
    // Lógica para cerrar el modal de carga
    this.dialog.closeAll();
  }
  //endregion



}