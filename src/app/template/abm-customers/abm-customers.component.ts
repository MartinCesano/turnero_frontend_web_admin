import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../core/services/customer.service';
import { ModalService } from '../../components/modals/modal.service';
import DataTable from 'datatables.net-dt';

@Component({
  selector: 'app-abm-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abm-customers.component.html',
  styleUrls: ['./abm-customers.component.css']
})
export class AbmCustomersComponent implements OnInit {

  customers: any[] = [];
  selectedCustomer: any;
  table: any;

  constructor(private customerService: CustomerService, private modalService: ModalService) { }

  async ngOnInit(): Promise<void> {
    this.modalService.loading("cargando clientes");
    try {
      this.customers = await this.customerService.getCustomers();
      this.initializeDataTable();
    } catch (error) {
      console.error(error);
    }
    this.modalService.loadingClose();
  }

  initializeDataTable(): void {
    const tableElement = document.getElementById('customersTable') as HTMLTableElement;
    if (tableElement) {
      if (this.table) {
        this.table.destroy();
      }

      this.table = new DataTable(tableElement, {
        searching: true,
        ordering: true,
        paging: true,
        data: this.customers.map((customer, index) => [
          index + 1,
          customer.document,
          customer.name,
          customer.lastname,
          customer.phone,
          `
          <button class="btn btn-outline-success btn-sm rounded me-2 edit-customer" data-customer='${JSON.stringify(customer)}' aria-label="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm rounded delete-customer" type="button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-customer='${JSON.stringify(customer)}' aria-label="Delete">
            <i class="bi bi-trash"></i>
          </button>
          `
        ]),
        columns: [
          { title: "#" },
          { title: "Documento" },
          { title: "Nombre" },
          { title: "Apellido" },
          { title: "Telefono" },
          { title: "Accion" }
        ],
      });

      // Agregar eventos de click para los botones de editar y eliminar
      $(document).on('click', '.edit-customer', (event) => {
        const customer = JSON.parse((event.currentTarget as HTMLElement).getAttribute('data-customer')!);
        this.editCustomer(customer);
      });

      $(document).on('click', '.delete-customer', (event) => {
        const customer = JSON.parse((event.currentTarget as HTMLElement).getAttribute('data-customer')!);
        this.selectedCustomer = customer;
      });
    }
  }

  editCustomer(customer: any) {
    // Implementa la lógica para editar un cliente
    this.selectedCustomer = customer;
    this.modalService.formCustomer(customer); // Asumiendo que tienes un modal para editar
  }

  createCustomer() {
    // Implementa la lógica para crear un cliente
    this.modalService.formCustomer(null);
  }

  async deleteCustomer() {
    // Implementa la lógica para eliminar un cliente
    try {
      await this.customerService.deleteCustomer(this.selectedCustomer.document);
      // Borra la fila de la tabla
      const index = this.customers.findIndex(c => c.document === this.selectedCustomer.document);
      if (index > -1) {
        this.customers.splice(index, 1);
        this.table.row(index).remove().draw();
      }
      this.selectedCustomer = null; // Resetea el cliente seleccionado
    } catch (error) {
      console.error(error);
    }
  }
}
