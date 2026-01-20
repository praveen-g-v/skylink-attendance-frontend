import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Employee } from '../pages/employees/employee.model';

import { PaginatedResponse, ApiResponse } from './response.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiBaseUrl = 'http://localhost:8080/api/public';
  private employeesUrl = `${this.apiBaseUrl}/employees`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // ============ EMPLOYEE CRUD OPERATIONS ============

  // Get all employees with optional pagination and filters
  // getEmployees(
  //   page: number = 1,
  //   limit: number = 10,
  //   filters?: any,
  // ): Observable<PaginatedResponse<Employee>> {
  //   let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

  //   if (filters) {
  //     Object.keys(filters).forEach((key) => {
  //       if (filters[key] !== undefined && filters[key] !== null) {
  //         params = params.set(key, filters[key]);
  //       }
  //     });
  //   }

  //   return this.http
  //     .get<PaginatedResponse<Employee>>(this.employeesUrl, { params, ...this.httpOptions })
  //     .pipe(catchError(this.handleError<PaginatedResponse<Employee>>('getEmployees')));
  // }

  getEmployees(): Observable<ApiResponse<Employee[]>> {
    return this.http
      .get<ApiResponse<Employee[]>>(this.employeesUrl, this.httpOptions)
      .pipe(catchError(this.handleError<ApiResponse<Employee[]>>('getEmployees')));
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<Employee> {
    const url = `${this.employeesUrl}/${id}`;
    return this.http.get<ApiResponse<Employee>>(url, this.httpOptions).pipe(
      map((response) => response.data),
      catchError(this.handleError<Employee>('getEmployeeById')),
    );
  }

  // Create new employee
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http
      .post<ApiResponse<Employee>>(this.employeesUrl, employee, this.httpOptions)
      .pipe(
        map((response) => response.data),
        tap((newEmployee) => console.log(`Created employee: ${newEmployee.id}`)),
        catchError(this.handleError<Employee>('createEmployee')),
      );
  }

  // Update existing employee
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    const url = `${this.employeesUrl}/${id}`;
    return this.http.put<ApiResponse<Employee>>(url, employee, this.httpOptions).pipe(
      map((response) => response.data),
      tap(() => console.log(`Updated employee: ${id}`)),
      catchError(this.handleError<Employee>('updateEmployee')),
    );
  }

  // Delete employee
  deleteEmployee(id: number): Observable<boolean> {
    const url = `${this.employeesUrl}/${id}`;
    return this.http.delete<ApiResponse<boolean>>(url, this.httpOptions).pipe(
      map((response) => response.data),
      tap(() => console.log(`Deleted employee: ${id}`)),
      catchError(this.handleError<boolean>('deleteEmployee')),
    );
  }

  // Bulk import employees from CSV/Excel
  importEmployees(file: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders(); // Don't set Content-Type for FormData
    return this.http
      .post<ApiResponse<any>>(`${this.employeesUrl}/import`, formData, { headers })
      .pipe(catchError(this.handleError<ApiResponse<any>>('importEmployees')));
  }

  // Export employees as CSV
  exportEmployees(filters?: any): Observable<Blob> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http
      .get(`${this.employeesUrl}/export`, {
        params,
        responseType: 'blob',
        headers: new HttpHeaders().set('Accept', 'text/csv'),
      })
      .pipe(catchError(this.handleError<Blob>('exportEmployees')));
  }

  // Search employees
  searchEmployees(query: string): Observable<Employee[]> {
    const url = `${this.employeesUrl}/search`;
    const params = new HttpParams().set('q', query);

    return this.http.get<ApiResponse<Employee[]>>(url, { params, ...this.httpOptions }).pipe(
      map((response) => response.data),
      catchError(this.handleError<Employee[]>('searchEmployees', [])),
    );
  }

  // Get employees by reporting manager
  getEmployeesByManager(managerId: number): Observable<Employee[]> {
    const url = `${this.employeesUrl}/manager/${managerId}`;
    return this.http.get<ApiResponse<Employee[]>>(url, this.httpOptions).pipe(
      map((response) => response.data),
      catchError(this.handleError<Employee[]>('getEmployeesByManager', [])),
    );
  }

  // ============ UTILITY METHODS ============

  generateNextEmployeeId(): Observable<string> {
    const url = `${this.employeesUrl}/next-id`;
    return this.http.get<ApiResponse<string>>(url, this.httpOptions).pipe(
      map((response) => response.data),
      catchError(this.handleError<string>('generateNextEmployeeId')),
    );
  }

  getEmployeeStats(): Observable<any> {
    const url = `${this.employeesUrl}/stats`;
    return this.http.get<ApiResponse<any>>(url, this.httpOptions).pipe(
      map((response) => response.data),
      catchError(this.handleError<any>('getEmployeeStats')),
    );
  }

  validateEmployee(employee: Employee): Observable<{ valid: boolean; errors: string[] }> {
    const url = `${this.employeesUrl}/validate`;
    return this.http
      .post<ApiResponse<{ valid: boolean; errors: string[] }>>(url, employee, this.httpOptions)
      .pipe(
        map((response) => response.data),
        catchError(this.handleError<{ valid: boolean; errors: string[] }>('validateEmployee')),
      );
  }

  // ============ ERROR HANDLING ============

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);

      this.logError(operation, error);

      let errorMessage = 'An error occurred. Please try again.';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action.';
            break;
          case 401:
            errorMessage = 'Please login to continue.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Server Error: ${error.status} - ${error.statusText}`;
            break;
        }
      }

      return throwError(() => new Error(errorMessage));
    };
  }

  private logError(operation: string, error: any) {
    console.error('Error Log:', {
      operation,
      timestamp: new Date().toISOString(),
      error: error.message || error,
      url: error.url,
      status: error.status,
    });
  }
}
