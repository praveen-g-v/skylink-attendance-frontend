// leave.model.ts
import { Employee } from './employee.model';

export interface Leave {
  id: number;
  zohoLeaveId?: string;
  employee: Employee; // full object from backend
  leaveType: string;
  fromDate: string | Date;
  toDate: string | Date;
  numberOfDays: number;
  status: string;
  reason?: string;
  source: 'ZOHO' | 'MANUAL' | string;
}
