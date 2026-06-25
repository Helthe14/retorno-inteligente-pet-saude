import { Appointment } from '../types';

/**
 * Formats a given YYYY-MM-DD and HH:MM string to local JavaScript Date
 */
export function getAppointmentDates(appointment: Appointment, durationMinutes: number = 30) {
  const [year, month, day] = appointment.date.split('-').map(Number);
  const [hours, minutes] = appointment.time.split(':').map(Number);
  
  const start = new Date(year, month - 1, day, hours, minutes);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  
  return { start, end };
}

/**
 * Helper to get ISO 8601 string in basic format (YYYYMMDDTHHmmssZ) in UTC
 */
function toUTCBasicISO(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generates an event template URL for Google Calendar
 */
export function generateGoogleCalendarLink(appointment: Appointment, durationMinutes: number = 30): string {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const { start, end } = getAppointmentDates(appointment, durationMinutes);
  
  const datesStr = `${toUTCBasicISO(start)}/${toUTCBasicISO(end)}`;
  const title = `Retorno: ${appointment.title} - ${appointment.patientName}`;
  const details = `${appointment.notes}\n\n📍 Local: ${appointment.location}\n\nGerado automaticamente pelo Retorno Inteligente.`;
  
  const params = new URLSearchParams({
    text: title,
    dates: datesStr,
    details: details,
    location: appointment.location || '',
    sf: 'true',
    output: 'xml',
  });
  
  return `${baseUrl}&${params.toString()}`;
}

/**
 * Generates standard text content for a universal iCalendar (.ics) file
 */
export function generateICSEventContent(appointment: Appointment, durationMinutes: number = 30): string {
  const { start, end } = getAppointmentDates(appointment, durationMinutes);
  
  const uniqueId = `uid-${appointment.id || Date.now()}@retornointeligente.com`;
  const stamp = toUTCBasicISO(new Date());
  const startStr = toUTCBasicISO(start);
  const endStr = toUTCBasicISO(end);
  
  const summary = `Retorno: ${appointment.title} - ${appointment.patientName}`;
  // Escape commas, semicolor, newlines for ICS safety
  const cleanNotes = (appointment.notes || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
  const location = (appointment.location || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Retorno Inteligente//NONSGML v1.0//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uniqueId}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${cleanNotes}\\n\\nGerado por Retorno Inteligente.`,
    `LOCATION:${location}`,
    'SEQUENCE:0',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Encodes appointment object into a compressed URL parameter string
 */
export function encodeAppointmentData(appointment: Appointment): string {
  try {
    const minObject = {
      i: appointment.id,
      n: appointment.patientName,
      t: appointment.title,
      d: appointment.date,
      h: appointment.time,
      l: appointment.location,
      o: appointment.notes
    };
    const jsonStr = JSON.stringify(minObject);
    // Use btoa with encodeURIComponent to safely handle UTF-8 characters like "João"
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''); // URL Safe Base64
  } catch (e) {
    console.error('Error encoding appointment', e);
    return '';
  }
}

/**
 * Decodes compressed url parameters into Appointment object
 */
export function decodeAppointmentData(encoded: string): Appointment | null {
  try {
    // Add padding if removed
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);
    
    return {
      id: parsed.i || String(Date.now()),
      patientName: parsed.n || '',
      title: parsed.t || '',
      date: parsed.d || '',
      time: parsed.h || '',
      location: parsed.l || '',
      notes: parsed.o || '',
      createdAt: Date.now()
    };
  } catch (e) {
    console.error('Error decoding appointment data', e);
    return null;
  }
}
