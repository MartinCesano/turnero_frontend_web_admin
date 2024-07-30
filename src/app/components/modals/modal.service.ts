import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoadingComponent } from './loading/loading.component';
import { MessageTypesComponent } from './message-types/message-types.component';
import { FormCustomerComponent } from './form-customer/form-customer.component';
import { FormScheduleComponent } from './form-schedule/form-schedule.component';
import { FormWorkdayComponent } from './form-workday/form-workday.component';
import { FormReservationComponent } from './form-reservation/form-reservation.component';
import { ApplyScheduleComponent } from './apply-schedule/apply-schedule.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private scheduleSubject = new Subject<any>(); // Añadir un Subject para schedule
  private loadingDialogRef: MatDialogRef<LoadingComponent> | null = null; // Referencia al modal de carga

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
    this.loadingDialogRef = this.dialog.open(LoadingComponent, {
      width: '700px',
      disableClose: true,
      data: text
    });

    this.loadingDialogRef.afterClosed().subscribe(result => {
      document.body.classList.remove('no-scroll'); // Habilitar el scroll nuevamente
      // Acciones después de cerrar el modal
    });
  }

  loadingClose(): void {
    document.body.classList.remove('no-scroll'); // Habilitar el scroll nuevamente
    // Lógica para cerrar solo el modal de carga
    if (this.loadingDialogRef) {
      this.loadingDialogRef.close();
      this.loadingDialogRef = null;
    }
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





//region formReservation

formReservation(schedule: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(FormReservationComponent, {
        width: '700px',
        disableClose: false,
        data: schedule
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
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


  //region ApplyScheduleComponent
  applySchedule(schedule: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(ApplyScheduleComponent, {
        width: '700px',
        disableClose: false,
        data: schedule
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
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