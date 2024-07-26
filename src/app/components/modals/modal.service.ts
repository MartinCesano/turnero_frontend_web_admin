import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoadingComponent } from './loading/loading.component';
import { MessageTypesComponent } from './message-types/message-types.component';
import { FormCustomerComponent } from './form-customer/form-customer.component';
import { FormScheduleComponent } from './form-schedule/form-schedule.component';
import { FormWorkdayComponent } from './form-workday/form-workday.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private scheduleSubject = new Subject<any>(); // Añadir un Subject para schedule

  constructor(private dialog: MatDialog, private router: Router) { }

  //region Modal de Mensajes
  openMenssageTypes(data: any): void {
    const dialogRef = this.dialog.open(MessageTypesComponent, {
      width: '700px',
      disableClose: false,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (data.url) {
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



  //region form customer
  formCustomer(data: any): void {
    const dialogRef = this.dialog.open(FormCustomerComponent, {
      width: '700px',
      disableClose: false,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (data.url) {
        this.router.navigateByUrl(data.url)
      }
      // Acciones después de cerrar el modal
    });
  }
  //endregion


  //region form schedule
  formSchedule(schedule: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(FormScheduleComponent, {
        width: '700px',
        disableClose: false,
        data: schedule
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
          this.scheduleSubject.next(result); // Emitir los datos a través del Subject
          resolve(result); // Resolver la promesa con el resultado
        } else {
          resolve(null); // Resolver la promesa con null si no hay resultado
        }
        // Acciones después de cerrar el modal
      }, error => {
        reject(error); // Rechazar la promesa en caso de error
      });
    });
  }
  //endregion


  //region form workday
  formWorkday(schedule: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(FormWorkdayComponent, {
        width: '700px',
        disableClose: false,
        data: schedule
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
          this.scheduleSubject.next(result); // Emitir los datos a través del Subject
          resolve(result); // Resolver la promesa con el resultado
        } else {
          resolve(null); // Resolver la promesa con null si no hay resultado
        }
        // Acciones después de cerrar el modal
      }, error => {
        reject(error); // Rechazar la promesa en caso de error
      });
    });
  }
  //endregion



}
