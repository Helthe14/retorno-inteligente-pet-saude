import React from 'react';
import { Appointment, ClinicSettings } from '../types';
import { Calendar, User, Clock, MapPin, FileText, ChevronRight, Sparkles, Tag } from 'lucide-react';

interface FormProps {
  settings: ClinicSettings;
  onSubmit: (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => void;
}

const BOA_VISTA_UBS = [
  "UBS Dr. Silvio Botelho (Paraviana) - Boa Vista, RR",
  "UBS Olenka Macellaro (Caimbé) - Boa Vista, RR",
  "UBS 31 de Março (31 de Março) - Boa Vista, RR",
  "UBS Mecejana (Mecejana) - Boa Vista, RR",
  "UBS Asa Branca (Asa Branca) - Boa Vista, RR",
  "UBS Dr. Dimitry Grandal (Alvorada) - Boa Vista, RR",
  "UBS Aygara Motta (Jardim Primavera) - Boa Vista, RR",
  "UBS Jardim Floresta (Jardim Floresta) - Boa Vista, RR",
  "UBS Lupércio Lima (Pintolândia) - Boa Vista, RR",
  "UBS Maria Suely Pinheiro (Bairro Érica) - Boa Vista, RR",
  "UBS Dr. Francisco Figueira (Pinto Martins) - Boa Vista, RR",
  "UBS Pintolândia (Pintolândia) - Boa Vista, RR",
  "UBS Dalmo Feitosa (Cauamé) - Boa Vista, RR",
  "UBS Dr. Romel Lemos (Centenário) - Boa Vista, RR",
  "UBS Hélio Macedo (Jardim Caranã) - Boa Vista, RR",
  "UBS Dr. Rubeldimar Maia (Mecejana) - Boa Vista, RR",
];

const CONSTANT_PRESETS = [
  { label: 'Retorno Clínico Geral', title: 'Retorno Clínico' },
  { label: 'Pós-Exame', title: 'Análise de Exames' },
  { label: 'Retorno Cirúrgico', title: 'Retorno Pós-Operatório' },
  { label: 'Acomp. Pré-Natal', title: 'Consulta de Pré-Natal' },
  { label: 'Pediatria / Puericultura', title: 'Retorno Pediátrico' },
  { label: 'Ajuste de Medicação', title: 'Avaliação Farmacológica' },
];

export default function Form({ settings, onSubmit }: FormProps) {
  // Let's set some smart defaults for the date: 14 days from now feels like a very common medical return schedule!
  const getFutureDateString = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [patientName, setPatientName] = React.useState('');
  const [title, setTitle] = React.useState('Retorno de Rotina');
  const [date, setDate] = React.useState(getFutureDateString(14));
  const [time, setTime] = React.useState('09:00');
  
  // Structured UBS selection state
  const [selectedUbs, setSelectedUbs] = React.useState(BOA_VISTA_UBS[0]);
  const [customLocation, setCustomLocation] = React.useState('');
  const [notes, setNotes] = React.useState(settings.defaultNotes);

  // Sync with default settings changes
  React.useEffect(() => {
    const isStandard = BOA_VISTA_UBS.includes(settings.defaultLocation);
    if (isStandard) {
      setSelectedUbs(settings.defaultLocation);
      setCustomLocation('');
    } else {
      setSelectedUbs('Outro');
      setCustomLocation(settings.defaultLocation);
    }
    setNotes(settings.defaultNotes);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocation = selectedUbs === 'Outro' ? customLocation : selectedUbs;
    onSubmit({
      patientName: patientName.trim(),
      title: title.trim(),
      date,
      time,
      location: finalLocation.trim() || 'UBS Central - Boa Vista, RR',
      notes: notes.trim()
    });
  };

  const handleSelectPreset = (presetTitle: string) => {
    setTitle(presetTitle);
  };

  const setRelativeDate = (days: number) => {
    setDate(getFutureDateString(days));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          Agendar Novo Retorno
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
          Preencha os campos abaixo para gerar um convite inteligente e o QR Code.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        
        {/* Helper Banner */}
        <div className="bg-[#1D92D1]/5 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#044C8C]" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              Personalizado para: {settings.professionalName || 'Médico'}
            </span>
          </div>
          <span className="text-[10px] bg-[#F26F22]/10 px-2 py-0.5 rounded-full font-bold text-[#F26F22]">
            {settings.clinicName || 'UBS'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
          {/* Patient name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Nome Completo do Paciente *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                required
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Ex: Maria de Souza Silva"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] focus:border-[#044C8C] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Quick presets for Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Título ou Motivo da Consulta *
              </label>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Tag className="h-3 w-3" /> Presets rápidos
              </span>
            </div>
            
            <div className="relative">
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Retorno Clínico Pós-Fezes"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] focus:border-[#044C8C] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            {/* Presets Horizontal Scrolling list */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {CONSTANT_PRESETS.map((p) => {
                const isSelected = title === p.title;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleSelectPreset(p.title)}
                    className={`flex-shrink-0 text-[10px] md:text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[#044C8C] border-[#044C8C] text-white font-medium shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Data do Retorno *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] focus:border-[#044C8C] transition-all"
                />
              </div>
              
              {/* Quick relative date selections */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setRelativeDate(7)}
                  className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-md hover:bg-[#044C8C]/5 dark:hover:bg-[#044C8C]/10 hover:text-[#044C8C] transition-colors"
                >
                  +7 dias
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(14)}
                  className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-md hover:bg-[#044C8C]/5 dark:hover:bg-[#044C8C]/10 hover:text-[#044C8C] transition-colors"
                >
                  +14 dias (2 sem)
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(30)}
                  className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-md hover:bg-[#044C8C]/5 dark:hover:bg-[#044C8C]/10 hover:text-[#044C8C] transition-colors"
                >
                  +30 dias (1 mês)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Horário *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <input
                  required
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] focus:border-[#044C8C] transition-all"
                />
              </div>

              {/* Quick slots help */}
              <div className="flex gap-1 overflow-x-auto pb-0.5">
                {['08:00', '10:30', '13:00', '14:30', '16:00'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-md border transition-all ${
                      time === slot
                        ? 'bg-teal-600 border-teal-600 text-white font-medium'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location / Exam venue - Structured with Boa Vista, RR UBS */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Unidade Básica de Saúde (UBS) de Referência *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
              <select
                value={selectedUbs}
                onChange={(e) => setSelectedUbs(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] focus:border-[#044C8C] transition-all cursor-pointer"
              >
                {BOA_VISTA_UBS.map((ubs) => (
                  <option key={ubs} value={ubs}>
                    {ubs}
                  </option>
                ))}
                <option value="Outro">Outro local / Consultório específico</option>
              </select>
            </div>

            {selectedUbs === 'Outro' && (
              <div className="relative animate-in slide-in-from-top-2 duration-200">
                  <input
                    required
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Digite o nome da UBS, consultório ou endereço completo"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] focus:border-[#044C8C] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
              </div>
            )}
          </div>

          {/* Recommendations / notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Recomendações Especiais / Preparo do Paciente
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instruções de preparo ou orientações, ex: Jejum de 8h, trazer receita azul..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] focus:border-[#044C8C] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 bg-[#044C8C] hover:bg-[#033c70] dark:bg-[#1D92D1] dark:hover:bg-[#1579af] text-white font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-[#044C8C]/10 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Gerar QR Code de Retorno</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>

        </form>
      </div>
    </div>
  );
}
