export interface Employee {
  id: number;
  employeeId: string;
  fullName: string;
  contactNo: number;
  department: string;
  destination?: string;
  reportingToId?: number;
  emailId?: string;
  zohoIdAvailable?: boolean;
  resigned?: boolean;
  resignedDate?: Date;
}

export interface Department {
  name: string;
  value: string;
}
