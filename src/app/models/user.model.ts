export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // optional (usually not returned by backend)
  createdOn: string | Date;
  mobileNo: number;
  role: string[]; // e.g. ["ADMIN", "USER"]
}
