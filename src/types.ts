export interface Appointment {
  id: string;
  patientName: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  notes: string;
  createdAt: number;
  confirmed?: boolean;
}

export interface ClinicSettings {
  clinicName: string;
  professionalName: string;
  defaultLocation: string;
  defaultNotes: string;
  defaultDurationMinutes: number;
}
