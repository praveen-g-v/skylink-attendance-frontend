import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog, DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Employee, Department } from './employee.model';
import { EmployeeService } from '../../services/EmployeeService';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    SelectModule,
    FileUploadModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    RadioButtonModule,
    RatingModule,
    TableModule,
    TagModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    FormsModule,
  ],
  providers: [EmployeeService, MessageService, ConfirmationService],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  @ViewChild('dt') dt!: Table;

  employees: Employee[] = [];
  selectedEmployees: Employee[] = [];

  employeeDialog = false;
  employee!: Employee;
  submitted = false;

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
  ) {}

  // ================= INIT =================

  ngOnInit(): void {
    this.loadEmployees();
  }

  // ================= LOAD =================

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showError(err.message);
      },
    });
  }

  // ================= DIALOG =================

  openNew(): void {
    this.employee = {
      id: 0,
      employeeId: '',
      fullName: '',
      contactNo: 0,
      department: '',
      destination: '',
      reportingToId: undefined,
      emailId: '',
      zohoIdAvailable: false,
      resigned: false,
      resignedDate: undefined,
    };
    this.submitted = false;
    this.employeeDialog = true;
  }

  editEmployee(employee: Employee): void {
    this.employee = { ...employee };
    this.employeeDialog = true;
  }

  hideDialog(): void {
    this.employeeDialog = false;
    this.submitted = false;
  }

  // ================= SAVE =================

  saveEmployee(): void {
    this.submitted = true;

    if (!this.employee.fullName || !this.employee.employeeId) {
      return;
    }

    if (this.employee.id && this.employee.id !== 0) {
      // Update
      this.employeeService.updateEmployee(this.employee.id, this.employee).subscribe({
        next: () => {
          this.showSuccess('Employee Updated');
          this.loadEmployees();
          this.employeeDialog = false;
        },
        error: (err) => this.showError(err.message),
      });
    } else {
      // Create
      this.employeeService.createEmployee(this.employee).subscribe({
        next: () => {
          this.showSuccess('Employee Created');
          this.loadEmployees();
          this.employeeDialog = false;
        },
        error: (err) => this.showError(err.message),
      });
    }
  }

  // ================= DELETE =================

  deleteEmployee(employee: Employee): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${employee.fullName}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.employeeService.deleteEmployee(employee.id).subscribe({
          next: () => {
            this.showSuccess('Employee Deleted');
            this.loadEmployees();
          },
          error: (err) => this.showError(err.message),
        });
      },
    });
  }

  deleteSelectedEmployees(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected employees?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletes = this.selectedEmployees.map((emp) =>
          this.employeeService.deleteEmployee(emp.id),
        );

        deletes.forEach((obs) => obs.subscribe());

        this.selectedEmployees = [];
        this.showSuccess('Employees Deleted');
        this.loadEmployees();
      },
    });
  }

  // ================= EXPORT =================

  exportCSV(): void {
    this.dt.exportCSV();
  }

  // ================= TOAST HELPERS =================

  private showSuccess(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail,
    });
  }

  private showError(detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail,
    });
  }
}
