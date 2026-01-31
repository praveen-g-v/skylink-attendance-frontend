// employee.model.ts

export interface Employee {
  id: number;
  employeeId: string;
  trackwickId: string;
  fullName: string;
  contactNo: number;
  department: string;
  destination: string;
  reportingToId: number;
  emailId: string;
  zohoIdAvailable: boolean;
  resigned: boolean;
  resignedDate: Date | string | null;
}
