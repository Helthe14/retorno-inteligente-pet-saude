import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Appointment } from '../types';
import { generateGoogleCalendarLink, generateICSEventContent, encodeAppointmentData } from '../services/calendarService';
import { BrandLogo } from './BrandLogo';
import { Calendar, MapPin, FileText, CheckCircle2, CloudDownload, Map, Share2, Heart, ExternalLink, Printer, Sun, Moon } from 'lucide-react';

interface PatientViewProps {
  appointment: Appointment;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function PatientView({ appointment, darkMode, onToggleDarkMode }: PatientViewProps) {
  const [confirmedByUser, setConfirmedByUser] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);

  // Calendar paths
  const googleLink = generateGoogleCalendarLink(appointment);

  const encodedParam = encodeAppointmentData(appointment);
  const cleanAppUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const patientCardUrl = `${cleanAppUrl}?p=${encodedParam}`;

  const handleDownloadICS = () => {
    try {
      const icsSnippet = generateICSEventContent(appointment);
      const blob = new Blob([icsSnippet], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Retorno_${appointment.patientName.replace(/\s+/g, '_')}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download system ICS', e);
    }
  };

  const handleCopyDetails = () => {
    const textMsg = `Olá! Meu retorno de ${appointment.title} está agendado para o dia ${formatLocaleDate(appointment.date).formatted} às ${appointment.time}. Local: ${appointment.location}.`;
    navigator.clipboard.writeText(textMsg);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatLocaleDate = (dateStr: string): { formatted: string; dayName: string } => {
    if (!dateStr || !dateStr.includes('-')) {
      return { formatted: '--/--/----', dayName: 'Data inválida' };
    }
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'long' });
      const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      
      return {
        formatted: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
        dayName: capitalizedDayName
      };
    } catch {
      return { formatted: '--/--/----', dayName: 'Data inválida' };
    }
  };

  const dateData = formatLocaleDate(appointment.date);

  return (
    <>
      {/* Screen View layout (Hidden during window printing) */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-6 flex flex-col justify-between font-sans selection:bg-[#F26F22]/10 transition-colors duration-300 relative print:hidden">
        
        {/* Decorative background gradient */}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#1D92D1]/10 to-transparent pointer-events-none" />

        {/* Floating Theme controller for Patient */}
        {onToggleDarkMode && (
          <div className="absolute top-4 right-4 z-40">
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-full border border-slate-200/60 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-700 dark:text-slate-300 shadow-sm hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer"
              title={darkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {darkMode ? (
                <Sun className="h-4.5 w-4.5 text-orange-500" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-[#044C8C]" />
              )}
            </button>
          </div>
        )}

        {/* Main Patient viewport centered content */}
        <div className="max-w-md w-full mx-auto space-y-6 pt-4 md:pt-8 flex-1">
          
          {/* Brand identity header */}
          <div className="text-center space-y-3">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-slate-800">
              <BrandLogo className="h-32 w-auto mx-auto" />
            </div>
            
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 mt-2">
              Olá, {appointment.patientName}!
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
              Seu retorno foi gerado pela equipe do **PET-Saúde Digital UFRR**. Veja os detalhes abaixo.
            </p>
          </div>

          {/* Digital Ticket Appointment Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md relative overflow-hidden">
            
            {/* Header Ticket separator */}
            <div className="bg-gradient-to-r from-[#044C8C] via-[#095bad] to-[#1D92D1] p-5 md:p-6 text-white space-y-1 text-center relative">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-[#F26F22] px-2.5 py-0.5 rounded-full inline-block mb-1 shadow-sm">CONVENIENTEMENTE AGENDADO</span>
              <h2 className="text-lg md:text-xl font-extrabold">{appointment.title}</h2>
              <p className="text-xs opacity-90 font-semibold">UFRR • Cuidado Contínuo e Saúde Preventiva</p>
            </div>

            <div className="p-5 md:p-6 space-y-5">
              {/* Appointment Main Info Grid */}
              <div className="grid grid-cols-3 gap-3 border-b border-slate-100 dark:border-slate-800/50 pb-5">
                <div className="text-center">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Dia</span>
                  <span className="text-sm md:text-base font-extrabold text-[#044C8C] dark:text-[#1D92D1] block mt-1">{dateData.formatted}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate mt-0.5">{dateData.dayName.split(',')[0]}</span>
                </div>
                <div className="text-center border-x border-slate-100 dark:border-slate-800/50 px-2">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Horário</span>
                  <span className="text-sm md:text-base font-extrabold text-[#044C8C] dark:text-[#1D92D1] block mt-1">{appointment.time}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mt-0.5">Duração: 30m</span>
                </div>
                <div className="text-center flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Status</span>
                  <span className="text-[10px] md:text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full inline-block mt-1 self-center">
                    Agendado
                  </span>
                </div>
              </div>

              {/* Location & Maps Action */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">📍 Local de Atendimento</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                  {appointment.location || 'UBS de Referência / Boa Vista, RR'}
                </p>
                
                {appointment.location && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.location)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#044C8C] dark:text-[#1D92D1] hover:underline font-bold"
                  >
                    <Map className="h-3.5 w-3.5" />
                    <span>Ver rota no mapa / GPS</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* Recommendations Notes */}
              {appointment.notes && (
                <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800/55 space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-widest">
                    <FileText className="h-3.5 w-3.5 text-[#F26F22]" />
                    <span>Orientações & Preparo</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    &quot;{appointment.notes}&quot;
                  </p>
                </div>
              )}

              {/* Confirm button simulation widget */}
              <div className="pt-2">
                {confirmedByUser ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-450 text-xs">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-bold">Presença confirmada!</p>
                      <p className="text-[10px] opacity-90 mt-0.5">Obrigado por sinalizar seu comparecimento. A equipe médica foi informada.</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmedByUser(true)}
                    className="w-full py-3.5 border border-[#044C8C]/20 bg-[#044C8C]/5 hover:bg-[#044C8C]/10 text-[#044C8C] dark:text-slate-200 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer outline-none"
                  >
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#F26F22]" />
                    Sinalizar que irei comparecer à consulta
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Calendar Synchronize Actions Card */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest text-center">
              Adicione ao seu calendário pessoal
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Google Calendar */}
              <a
                href={googleLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#044C8C] transition-all text-slate-700 dark:text-slate-300 font-bold text-xs shadow-sm"
              >
                <Calendar className="h-4.5 w-4.5 text-[#044C8C]" />
                <span>Google Agenda</span>
              </a>

              {/* Standard Apple Calendar File */}
              <button
                onClick={handleDownloadICS}
                className="flex items-center justify-center gap-2.5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#1D92D1] transition-all text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer shadow-sm"
              >
                <CloudDownload className="h-4.5 w-4.5 text-[#1D92D1]" />
                <span>iPhone / iCal</span>
              </button>
            </div>

            {/* Offline print summary button backup */}
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#044C8C] hover:bg-[#033c70] text-white rounded-2xl transition-all font-bold text-xs cursor-pointer shadow-md"
              id="btn-imprimir-resumo"
            >
              <Printer className="h-4.5 w-4.5 text-[#F26F22]" />
              <span>Imprimir Comprovante / PDF</span>
            </button>
          </div>

          {/* Share buttons */}
          <div className="flex justify-center gap-4 text-xs font-semibold pb-8">
            <button
              onClick={handleCopyDetails}
              className="flex items-center gap-1.5 text-slate-500 hover:text-[#044C8C] transition-colors cursor-pointer outline-none font-bold"
            >
              <Share2 className="h-4 w-4" />
              <span>{copiedLink ? 'Copiado para Área de Transferência!' : 'Copiar dados da consulta'}</span>
            </button>
          </div>

        </div>

        {/* Footer copyright informational */}
        <footer className="py-4 text-center text-[10px] text-slate-400 print:hidden border-t border-slate-200/50 mt-4 max-w-xs mx-auto">
          <p>PET-Saúde Digital UFRR - Promoção da prevenção médica continuada.</p>
          <p className="mt-1 text-[#044C8C]/80 font-semibold uppercase tracking-wider">SUS • Ministério da Saúde • UFRR</p>
        </footer>

      </div>

      {/* Printable Sheet (Perfect High-Contrast Layout exclusively parsed when window.print() is active) */}
      <div className="hidden print:block bg-white text-black p-8 font-sans h-full max-w-xl mx-auto border-4 border-double border-[#044C8C] rounded-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b-2 border-slate-300 pb-4">
          <div className="text-left space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight text-[#044C8C]">PET-Saúde Digital UFRR</h1>
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#1D92D1]">
              Comprovante de Agendamento Médico de Retorno
            </p>
          </div>
          {/* Small simple SVG box for high contrast print representation */}
          <div className="h-14 w-12 border border-[#044C8C] p-0.5 rounded flex items-center justify-center">
            <span className="text-[8px] font-bold text-center text-[#044C8C]">UFRR<br/>PET</span>
          </div>
        </div>

        <div className="space-y-4 text-left text-sm">
          <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2">
            <div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">ID de Controle</span>
              <span className="text-xs font-mono text-slate-850 block font-bold">{appointment.id}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Unidade de Saúde</span>
              <span className="text-xs font-semibold text-slate-850 block">{appointment.location || 'UBS UFRR'}</span>
            </div>
          </div>

          <div className="border-b border-slate-100 pb-2">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Nome do Paciente</span>
            <span className="text-base font-extrabold text-slate-900">{appointment.patientName}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
            <div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Motivo do Retorno</span>
              <span className="text-sm font-extrabold text-slate-900">{appointment.title}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Data e Horário</span>
              <span className="text-sm font-extrabold text-[#044C8C]">{dateData.formatted} às {appointment.time}</span>
            </div>
          </div>

          {appointment.notes && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">Preparo & Recomendações Importantes</span>
              <p className="text-xs text-slate-700 italic">"{appointment.notes}"</p>
            </div>
          )}
        </div>

        {/* QR Code integration back to active state */}
        <div className="flex flex-col items-center justify-center pt-4 border-t border-slate-250 text-center space-y-2">
          <div className="p-2.5 bg-white border border-slate-300 rounded-xl inline-block">
            <QRCodeCanvas
              value={patientCardUrl}
              size={120}
              level="M"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-900">Acesse seu Cartão de Saúde Digital</p>
            <p className="text-[9px] text-slate-505 max-w-sm leading-relaxed mx-auto font-medium">
              Escaneie este QR Code com seu celular para salvar o compromisso no seu calendário Android/iPhone, confirmar presença com a recepção e evitar atrasos e filas.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-dashed border-slate-200 text-center text-[9px] text-slate-400 font-semibold">
          PET-Saúde Digital UFRR • Universidade Federal de Roraima • Documento emitido eletronicamente em 2026
        </div>
      </div>
    </>
  );
}
