import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Appointment } from '../types';
import { generateGoogleCalendarLink, encodeAppointmentData } from '../services/calendarService';
import { Download, Share2, Copy, Send, Check, ArrowLeft, Calendar, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface QRViewProps {
  appointment: Appointment;
  onBack: () => void;
  appUrl: string;
}

export default function QRView({ appointment, onBack, appUrl }: QRViewProps) {
  // Modes: 'patient_card' (custom URL parser) or 'direct_google' (direct calendar template url)
  const [qrMode, setQrMode] = React.useState<'patient_card' | 'direct_google'>('patient_card');
  const [copied, setCopied] = React.useState(false);

  // Compute values
  const directGoogleUrl = generateGoogleCalendarLink(appointment);
  const encodedParam = encodeAppointmentData(appointment);
  
  // Clean clean appUrl and format it
  const cleanAppUrl = appUrl || window.location.origin;
  const patientCardUrl = `${cleanAppUrl}?p=${encodedParam}`;

  const currentUrl = qrMode === 'patient_card' ? patientCardUrl : directGoogleUrl;

  const handleDownloadQR = () => {
    const canvas = document.getElementById('rt-qr-code') as HTMLCanvasElement;
    if (!canvas) return;
    
    // Create a high-quality download with background
    const link = document.createElement('a');
    link.download = `Retorno-${appointment.patientName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const text = `Presado(a) ${appointment.patientName}, confirmamos seu retorno agendado para o dia *${formatLocaleDate(appointment.date)}* às *${appointment.time}*. Adicione ao seu calendário pelo link: ${patientCardUrl}`;
    const encText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encText}`, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Retorno Inteligente - ${appointment.patientName}`,
          text: `Sua consulta de retorno está agendada para dia ${formatLocaleDate(appointment.date)} às ${appointment.time}. Saiba mais no link.`,
          url: patientCardUrl,
        });
      } catch (err) {
        console.warn('Share error or dismissed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const formatLocaleDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#044C8C] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao Formulário
      </button>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 md:p-8 shadow-md text-center max-w-lg mx-auto relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Visual green banner for success */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-500" />

        <div className="mb-4">
          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold px-2.5 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sucesso: Retorno Gerado
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Código Disponível!
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
          Peça para o paciente escanear com a câmera do celular para adicionar o compromisso instantaneamente.
        </p>

        {/* QR Code Selector Mode Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-xl mt-5 mb-6 max-w-sm mx-auto">
          <button
            onClick={() => setQrMode('patient_card')}
            className={`py-1.5 text-[10px] md:text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              qrMode === 'patient_card'
                ? 'bg-white dark:bg-slate-900 shadow-sm text-[#044C8C] dark:text-[#1D92D1]'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            📱 Cartão Inteligente
          </button>
          
          <button
            onClick={() => setQrMode('direct_google')}
            className={`py-1.5 text-[10px] md:text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              qrMode === 'direct_google'
                ? 'bg-white dark:bg-slate-900 shadow-sm text-[#044C8C] dark:text-[#1D92D1]'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            📅 Google Agenda Direto
          </button>
        </div>

        {/* QR Code Container Display Frame */}
        <div className="bg-slate-50 dark:bg-slate-950 p-6 md:p-8 rounded-2xl inline-block border border-slate-100 dark:border-slate-800 shadow-inner mb-6">
          <QRCodeCanvas
            id="rt-qr-code"
            value={currentUrl}
            size={190}
            level="M"
            includeMargin={true}
            style={{ width: '190px', height: '190px' }}
            bgColor="#ffffff"
            fgColor="#0f172a"
          />
        </div>

        {/* Short details view of what was generated - readable table */}
        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 text-left border border-slate-100 dark:border-slate-800 max-w-sm mx-auto text-xs space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium font-mono uppercase text-[9px]">Paciente:</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{appointment.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium font-mono uppercase text-[9px]">Retorno:</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{appointment.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium font-mono uppercase text-[9px]">Data & Hora:</span>
            <span className="text-[#044C8C] dark:text-[#1D92D1] font-semibold">
              {formatLocaleDate(appointment.date)} às {appointment.time}
            </span>
          </div>
          {appointment.location && (
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium font-mono uppercase text-[9px]">Local:</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[200px]">{appointment.location}</span>
            </div>
          )}
        </div>

        {/* Diagnostic alert for scanner */}
        <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-6 flex items-center justify-center gap-1">
          <AlertCircle className="h-3 w-3 text-[#044C8C] shrink-0" />
          <span>
            {qrMode === 'patient_card' 
              ? 'Compatível com Android, iPhone e Calendários Nativos' 
              : 'Requer apenas app Google Calendar no celular'}
          </span>
        </div>

        {/* Primary Action Panel Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-md mx-auto">
          {/* Download */}
          <button
            onClick={handleDownloadQR}
            className="flex flex-col items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition-all text-slate-700 dark:text-slate-300 text-[11px] font-semibold"
            title="Salvar imagem do QR para impressão ou envio"
          >
            <Download className="h-4.5 w-4.5 text-slate-500" />
            <span>Baixar QR</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition-all text-slate-700 dark:text-slate-300 text-[11px] font-semibold relative"
          >
            {copied ? (
              <>
                <Check className="h-4.5 w-4.5 text-emerald-500 animate-ping-once" />
                <span className="text-emerald-600 dark:text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-4.5 w-4.5 text-slate-500" />
                <span>Copiar Link</span>
              </>
            )}
          </button>

          {/* Send Whatsapp */}
          <button
            onClick={handleSendWhatsApp}
            className="flex flex-col items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition-all text-slate-700 dark:text-slate-300 text-[11px] font-semibold"
          >
            <Send className="h-4.5 w-4.5 text-emerald-500" />
            <span>Zap Paciente</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-1.5 py-2 px-3 bg-[#044C8C]/5 dark:bg-slate-900 text-[#044C8C] dark:text-[#1D92D1] rounded-xl hover:bg-[#044C8C]/10 transition-all text-[11px] font-semibold"
          >
            <Share2 className="h-4.5 w-4.5" />
            <span>Compartilhar</span>
          </button>
        </div>

      </div>
    </div>
  );
}
