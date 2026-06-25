import React from 'react';
import { Appointment } from '../types';
import { Search, Calendar, CheckSquare, Trash2, ChevronRight, User, MapPin, Clock, AlertCircle, FileText, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface HistoryListProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  onUpdateStatus: (id: string, confirmed: boolean) => void;
}

export default function HistoryList({ appointments, onSelectAppointment, onDeleteAppointment, onUpdateStatus }: HistoryListProps) {
  const [search, setSearch] = React.useState('');
  
  // Computed filter
  const filtered = appointments.filter(app => {
    const q = search.toLowerCase();
    return (
      app.patientName.toLowerCase().includes(q) ||
      (app.title || '').toLowerCase().includes(q) ||
      (app.location || '').toLowerCase().includes(q)
    );
  });

  // Analytics helper metrics
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter(a => a.confirmed === true).length;
  const pendingCount = appointments.filter(a => a.confirmed === undefined || a.confirmed === false).length;
  
  const returnRate = totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0;

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Search and Headers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Painel de Retornos Gerados
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Histórico local das consultas agendadas e controle de absenteísmo.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por paciente, local..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Analytics stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Total Agendados</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono mt-1 block">{totalCount}</span>
          </div>
          <div className="p-2.5 bg-[#044C8C]/5 dark:bg-slate-900 text-[#044C8C] dark:text-[#1D92D1] rounded-xl">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Retornos Confirmados</span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-450 font-mono mt-1 block">{confirmedCount}</span>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 rounded-xl">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Índice de Adesão (Tratamento)</span>
            <span className="text-2xl font-bold text-teal-600 dark:text-teal-400 font-mono mt-1 block">{returnRate}%</span>
          </div>
          <div className="p-2.5 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-xl">
            <CheckSquare className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto" />
            <h4 className="font-semibold text-sm">Nenhum retorno encontrado</h4>
            <p className="text-xs text-slate-400 dark:text-slate-550 max-w-sm mx-auto">
              {search ? 'Tente buscar com termos diferentes ou limpe a busca.' : 'Os agendamentos que você criar aparecerão listados aqui automaticamente.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filtered.map((app) => {
              const isConfirmed = app.confirmed === true;
              return (
                <div
                  key={app.id}
                  className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors"
                >
                  {/* Left block Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                        {app.patientName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium font-mono text-center">
                        {app.title}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-[#044C8C]" />
                        {formatDateLabel(app.date)} às {app.time}
                      </span>
                      {app.location && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                          <span className="truncate">{app.location}</span>
                        </span>
                      )}
                    </div>

                    {app.notes && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 italic">
                        &quot;{app.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Right block Status togglers + QR trigger */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Status Toggle */}
                    <button
                      onClick={() => onUpdateStatus(app.id, !isConfirmed)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition-colors ${
                        isConfirmed
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400'
                          : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-955/30 dark:border-amber-900 dark:text-amber-400'
                      }`}
                      title={isConfirmed ? 'Presença confirmada. Clique para desmarcar.' : 'Presença pendente. Clique para marcar como comparecido.'}
                    >
                      {isConfirmed ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Compareceu</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                          <span>Pendente</span>
                        </>
                      )}
                    </button>

                    {/* QR Code Trigger icon */}
                    <button
                      onClick={() => onSelectAppointment(app)}
                      className="p-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#044C8C] dark:hover:text-[#1D92D1] bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      title="Ver QR Code do paciente"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Delete entry */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja remover ${app.patientName} do histórico?`)) {
                          onDeleteAppointment(app.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Excluir agendamento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
