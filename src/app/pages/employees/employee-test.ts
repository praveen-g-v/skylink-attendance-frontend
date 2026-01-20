import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { EmployeeService } from '../../services/EmployeeService';
import { Employee } from './employee.model';

@Component({
  template: `
    <div class="card">
      <p-table
        #dt2
        [value]="employees"
        dataKey="id"
        [rows]="10"
        [rowsPerPageOptions]="[10, 25, 50]"
        [loading]="loading"
        [paginator]="true"
        [globalFilterFields]="['employeeId', 'fullName', 'department', 'destination', 'emailId']"
        [tableStyle]="{ 'min-width': '75rem' }"
      >
        <ng-template #caption>
          <div class="flex">
            <p-iconfield iconPosition="left" class="ml-auto">
              <p-inputicon>
                <i class="pi pi-search"></i>
              </p-inputicon>
              <input
                pInputText
                type="text"
                (input)="dt2.filterGlobal($event.target.value, 'contains')"
                placeholder="Search keyword"
              />
            </p-iconfield>
          </div>
        </ng-template>
        <ng-template #header>
          <tr>
            <th style="width:15%">Employee ID</th>
            <th style="width:20%">Full Name</th>
            <th style="width:15%">Department</th>
            <th style="width:15%">Destination</th>
            <th style="width:20%">Email</th>
            <th style="width:15%">Status</th>
          </tr>
          <tr>
            <th>
              <p-columnFilter
                type="text"
                field="employeeId"
                placeholder="Search ID"
                ariaLabel="Filter Employee ID"
                filterOn="input"
              ></p-columnFilter>
            </th>
            <th>
              <p-columnFilter
                type="text"
                field="fullName"
                placeholder="Search Name"
                ariaLabel="Filter Name"
                filterOn="input"
              ></p-columnFilter>
            </th>
            <th>
              <p-columnFilter field="department" matchMode="in" [showMenu]="false">
                <ng-template #filter let-value let-filter="filterCallback">
                  <p-multiselect
                    [(ngModel)]="value"
                    [options]="departments"
                    placeholder="Any"
                    (onChange)="filter($event.value)"
                    optionLabel="name"
                    style="min-width: 14rem"
                    [panelStyle]="{ minWidth: '16rem' }"
                  >
                    <ng-template let-option #item>
                      <div class="flex items-center gap-2">
                        <span>{{ option.name }}</span>
                      </div>
                    </ng-template>
                  </p-multiselect>
                </ng-template>
              </p-columnFilter>
            </th>
            <th>
              <p-columnFilter
                type="text"
                field="destination"
                placeholder="Search Destination"
                ariaLabel="Filter Destination"
              ></p-columnFilter>
            </th>
            <th>
              <p-columnFilter
                type="text"
                field="emailId"
                placeholder="Search Email"
                ariaLabel="Filter Email"
              ></p-columnFilter>
            </th>
            <th>
              <p-columnFilter field="resigned" matchMode="equals" [showMenu]="false">
                <ng-template #filter let-value let-filter="filterCallback">
                  <p-select
                    [(ngModel)]="value"
                    [options]="employmentStatuses"
                    (onChange)="filter($event.value)"
                    placeholder="Select Status"
                    [showClear]="true"
                    style="min-width: 12rem"
                  >
                    <ng-template let-option #item>
                      <p-tag [value]="option.label" [severity]="option.severity" />
                    </ng-template>
                  </p-select>
                </ng-template>
              </p-columnFilter>
            </th>
          </tr>
        </ng-template>
        <ng-template #body let-employee>
          <tr>
            <td>
              {{ employee.employeeId }}
            </td>
            <td>
              <div class="flex items-center gap-2">
                <img
                  [alt]="employee.fullName"
                  src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{
                    getRandomAvatar()
                  }}"
                  width="32"
                  style="vertical-align: middle"
                />
                <span>{{ employee.fullName }}</span>
              </div>
            </td>
            <td>
              <p-tag
                [value]="employee.department"
                [severity]="getDepartmentSeverity(employee.department)"
              />
            </td>
            <td>
              {{ employee.destination || '-' }}
            </td>
            <td>
              {{ employee.emailId || '-' }}
            </td>
            <td>
              <div class="flex items-center gap-2">
                <p-tag
                  [value]="employee.resigned ? 'Resigned' : 'Active'"
                  [severity]="employee.resigned ? 'danger' : 'success'"
                />
                <i
                  class="pi"
                  [ngClass]="{
                    'text-green-500 pi-check-circle': employee.zohoIdAvailable,
                    'text-red-500 pi-times-circle': !employee.zohoIdAvailable,
                  }"
                  [title]="employee.zohoIdAvailable ? 'Zoho ID Available' : 'No Zoho ID'"
                ></i>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template #emptymessage>
          <tr>
            <td colspan="6">No employees found.</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  standalone: true,
  imports: [
    SelectModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    TableModule,
    TagModule,
    InputTextModule,
    FormsModule,
  ],
  providers: [EmployeeService],
})
export class TableFilterbasicDemo implements OnInit {
  private employeeService = inject(EmployeeService);
  employees!: Employee[];
  departments: { name: string; value: string }[] = [];
  employmentStatuses = [
    { label: 'Active', value: false, severity: 'success' },
    { label: 'Resigned', value: true, severity: 'danger' },
  ];
  loading: boolean = true;
  avatarOptions = [
    'amyelsner.png',
    'annafali.png',
    'asiyajavayant.png',
    'bernardodominic.png',
    'elwinsharvill.png',
    'ionibowcher.png',
    'ivanmagalhaes.png',
    'onyamalimba.png',
    'stephenshaw.png',
    'xuxuefeng.png',
  ];

  ngOnInit() {
    this.loadEmployees();
    this.initializeDepartments();
  }

  loadEmployees() {
    // Assuming you have a method to get employees from the service
    // This is a placeholder - you'll need to update your service method
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res.data;
        // this.cdr.detectChanges();
      },
      error: (err) => {
        // this.showError(err.message);
      },
    });
  }

  initializeDepartments() {
    // This would typically come from your service or API
    this.departments = [
      { name: 'Engineering', value: 'Engineering' },
      { name: 'Marketing', value: 'Marketing' },
      { name: 'Sales', value: 'Sales' },
      { name: 'HR', value: 'HR' },
      { name: 'Finance', value: 'Finance' },
      { name: 'Operations', value: 'Operations' },
    ];
  }

  clear(table: Table) {
    table.clear();
  }

  getDepartmentSeverity(department: string): string {
    const severityMap: { [key: string]: string } = {
      Engineering: 'info',
      Marketing: 'success',
      Sales: 'warn',
      HR: 'help',
      Finance: 'danger',
      Operations: 'contrast',
    };
    return severityMap[department] || 'secondary';
  }

  getRandomAvatar(): string {
    const randomIndex = Math.floor(Math.random() * this.avatarOptions.length);
    return this.avatarOptions[randomIndex];
  }
}
