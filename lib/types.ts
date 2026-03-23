export type Role = "director" | "teacher" | "parent";
export type AuthMode = "login" | "register-director" | "register-teacher" | "parent-login";

export type ProfileRow = {
  user_id: string;
  center_id: string;
  full_name: string;
  phone: string | null;
  role: "director" | "teacher" | "admin";
  status: string;
  created_at?: string;
};

export type StudentRow = {
  id: string;
  center_id: string;
  branch_id: string | null;
  teacher_user_id: string | null;
  name: string;
  student_code: string;
  pin_code: string;
  parent_name: string | null;
  parent_phone: string | null;
  monthly_fee: number;
  debt_amount: number;
  status: string;
  created_at?: string;
};

export type PaymentRow = {
  id: string;
  center_id: string;
  student_id: string | null;
  amount: number;
  method: string | null;
  note: string | null;
  created_by: string | null;
  created_at?: string;
};

export type AttendanceRow = {
  id: string;
  center_id: string;
  student_id: string | null;
  lesson_date: string;
  status: string;
  note: string | null;
  created_by: string | null;
  created_at?: string;
};

export type BranchRow = {
  id: string;
  center_id: string;
  name: string;
  city: string | null;
  address: string | null;
  status: string;
  created_at?: string;
};

export type ParentStudent = {
  id: string;
  name: string;
  student_code: string;
  pin_code: string;
  monthly_fee: number;
  debt_amount: number;
  branch_id: string | null;
  parent_name?: string | null;
  parent_phone?: string | null;
  status?: string;
};

export type ParentPayment = {
  id: string;
  student_id: string;
  amount: number;
  method?: string | null;
  note?: string | null;
  created_at?: string;
};

export type ParentAttendance = {
  id: string;
  student_id: string;
  lesson_date?: string;
  status: string;
  note?: string | null;
  created_at?: string;
};