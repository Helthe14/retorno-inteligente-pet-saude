import React from 'react';
import { ClinicSettings } from '../types';
import { Shield, Building, User, MapPin, FileText, Clock, Sparkles, Moon, Sun, Check, RefreshCw } from 'lucide-react';

interface SettingsProps {
  settings: ClinicSettings;
  onSaveSettings: (settings: ClinicSettings) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const defaultSettings: ClinicSettings = {
  clinicName: 'Secretaria Municipal de Saúde',
  professionalName: 'Dr. Carlos Medeiros',
  defaultLocation: 'UBS Dr. Silvio Botelho (Paraviana) - Boa Vista, RR',
  defaultNotes: 'Por favor, chegue com 10 minutos de antecedência. Traga todos os exames recentes e sua lista de medicamentos em uso contínuo.',
  defaultDurationMinutes: 30,
};

export default function Settings({ settings, onSaveSettings, darkMode, onToggleDarkMode }: SettingsProps) {
  const [localSettings, setLocalSettings] = React.useState<ClinicSettings>(settings);
  const [justSaved, setJustSaved] = React.useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Deseja restaurar as configurações padrão?')) {
      setLocalSettings(defaultSettings);
      onSaveSettings(defaultSettings);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Ajustes e Personalização
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Configure as informações padrão para gerar QR Codes e links instantaneamente.
          </p>
        </div>
        
        {/* Quick Dark Mode toggle in high craft */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="flex items-center gap-2 self-start md:self-center px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? (
            <>
              <Sun className="h-4 w-4 text-amber-500 animate-spin-slow" />
              <span className="text-slate-700 dark:text-slate-300">Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-[#044C8C]" />
              <span className="text-slate-700 dark:text-slate-300">Modo Escuro</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Clinic & Professional Profile Info card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <Building className="h-4 w-4 text-[#044C8C]" />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Dados do Estabelecimento e Profissional</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Nome do Estabelecimento / Clínica
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  value={localSettings.clinicName}
                  onChange={(e) => setLocalSettings({ ...localSettings, clinicName: e.target.value })}
                  placeholder="Ex: UBS Central"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] focus:border-[#044C8C] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Profissional de Saúde Responsável
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  value={localSettings.professionalName}
                  onChange={(e) => setLocalSettings({ ...localSettings, professionalName: e.target.value })}
                  placeholder="Ex: Dr. Carlos Medeiros"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] focus:border-[#044C8C] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Appointment defaults card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <Clock className="h-4 w-4 text-teal-500" />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Padrões de Consulta</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Localização / Sala Padrão
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  value={localSettings.defaultLocation}
                  onChange={(e) => setLocalSettings({ ...localSettings, defaultLocation: e.target.value })}
                  placeholder="Ex: Consultório 12, Bloco B"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] focus:border-[#044C8C] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Duração (min)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={localSettings.defaultDurationMinutes || 30}
                  onChange={(e) => setLocalSettings({ ...localSettings, defaultDurationMinutes: parseInt(e.target.value) || 30 })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] focus:border-[#044C8C] transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Observações / Instruções Recomendadas (Preparo)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
              <textarea
                rows={3}
                value={localSettings.defaultNotes}
                onChange={(e) => setLocalSettings({ ...localSettings, defaultNotes: e.target.value })}
                placeholder="Ex: Trazer receitas anteriores..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#044C8C] focus:border-[#044C8C] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Restaurar Padrões
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white bg-[#044C8C] hover:bg-[#033c70] dark:bg-[#1D92D1] dark:hover:bg-[#1579af] transition-all shadow-md shadow-[#044C8C]/10 flex items-center gap-2"
          >
            {justSaved ? (
              <>
                <Check className="h-4.5 w-4.5 text-emerald-400 animate-bounce" />
                <span>Salvo com sucesso!</span>
              </>
            ) : (
              <span>Salvar Configurações</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
