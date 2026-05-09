export interface EnrollmentRequest {
  name: string;
  email: string;
  phone: string;
  selected_course: string;
  message?: string;
}

export interface DemoRequest {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export interface CorporateRequest {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  requirement: string;
}

export interface BookRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}
