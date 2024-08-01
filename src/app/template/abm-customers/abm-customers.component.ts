import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../core/services/customer.service';
import { ModalService } from '../../components/modals/modal.service';
import DataTable from 'datatables.net-dt';
import { ICustomer } from '../../interfaces/customer.interface';

@Component({
  selector: 'app-abm-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abm-customers.component.html',
  styleUrls: ['./abm-customers.component.css'],
})
export class AbmCustomersComponent implements OnInit {
  customers: ICustomer[] = [];
  selectedCustomer?: ICustomer;
  table: any;

  constructor(
    private customerService: CustomerService,
    private modalService: ModalService
  ) {}

  async ngOnInit(): Promise<void> {
    this.modalService.loading('Cargando clientes');
    try {
      this.customers = await this.customerService.getCustomers();
      this.initializeDataTable();
    } catch (error) {
      console.error(error);
    }
    this.modalService.loadingClose();
  }

  initializeDataTable(): void {
    const tableElement = document.getElementById(
      'customersTable'
    ) as HTMLTableElement;
    if (tableElement) {
      if (this.table) {
        this.table.destroy();
      }

      this.table = new DataTable(tableElement, {
        searching: true,
        ordering: true,
        paging: true,
        info: true,
        data: this.customers.map((customer, index) => [
          index + 1,
          customer.document,
          customer.name,
          customer.lastname,
          customer.phone,
          `
          <div class="action-buttons d-flex justify-content-between">
            <button class="btn btn-outline-primary btn-sm rounded reservation-customer" type="button" data-customer='${JSON.stringify(
              customer
            )}'>
              <i class="bi bi-ticket-detailed"></i>
            </button>
            <button class="btn btn-outline-success btn-sm rounded edit-customer" data-customer='${JSON.stringify(
              customer
            )}' aria-label="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm rounded delete-customer" type="button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-customer='${JSON.stringify(
              customer
            )}' aria-label="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          `,
        ]),
        columns: [
          { title: '#' },
          { title: 'Documento' },
          { title: 'Nombre' },
          { title: 'Apellido' },
          { title: 'Telefono' },
          { title: 'Acción' },
        ],
      });

      // Agregar eventos de click para los botones de editar y eliminar
      $(document).on('click', '.edit-customer', (event) => {
        const customer = JSON.parse(
          (event.currentTarget as HTMLElement).getAttribute('data-customer')!
        );
        this.editCustomer(customer);
      });

      $(document).on('click', '.delete-customer', (event) => {
        const customer = JSON.parse(
          (event.currentTarget as HTMLElement).getAttribute('data-customer')!
        );
        this.selectedCustomer = customer;
      });

      $(document).on('click', '.reservation-customer', (event) => {
        const customer = JSON.parse(
          (event.currentTarget as HTMLElement).getAttribute('data-customer')!
        );
        this.reservationCustomer(customer);
      });
    }
  }

  reservationCustomer(customer: ICustomer) {
    // Implementa la lógica para reservar un turno
  }

  editCustomer(customer: ICustomer) {
    // Implementa la lógica para editar un cliente
    this.selectedCustomer = customer;
    this.modalService.formCustomer(customer); // Asumiendo que tienes un modal para editar
  }

  createCustomer() {
    // Implementa la lógica para crear un cliente
    this.modalService.formCustomer(null);
  }

  async deleteCustomer() {
    try {
      if (this.selectedCustomer) {
        const index = this.customers.findIndex(
          (customer) => customer.document === this.selectedCustomer?.document
        );
        if (index !== -1) {
          this.customers.splice(index, 1);
          if (this.table) {
            this.table.row(index).remove().draw();
          }
          await this.customerService.deleteCustomer(
            this.selectedCustomer.document.toString()
          );
          this.selectedCustomer = undefined;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
