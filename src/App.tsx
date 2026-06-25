import React from 'react';
import { Appointment, ClinicSettings } from './types';
import { decodeAppointmentData } from './services/calendarService';
import Form from './components/Form';
import QRView from './components/QRView';
import HistoryList from './components/HistoryList';
import Settings, { defaultSettings } from './components/Settings';
import PatientView from './components/PatientView';
import { MiniBrandLogo } from './components/BrandLogo';
import { Calendar, History, Settings as SettingsIcon, Sparkles, Heart, HelpCircle, Plus } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = React.useState<'novo' | 'historico' | 'ajustes'>('novo');
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [settings, setSettings] = React.useState<ClinicSettings>(defaultSettings);
  const [darkMode, setDarkMode] = React.useState(false);
  
  // State for active QR Code viewer
  const [activeAppointment, setActiveAppointment] = React.useState<Appointment | null>(null);

  // State parsed from patient URL parameter
  const [patientAppointment, setPatientAppointment] = React.useState<Appointment | null>(null);
  
  // App address injected for patient invitations
  const [appUrl, setAppUrl] = React.useState('');

  // 1. Initial Load Configs/Theme/Parameter Parsing
  React.useEffect(() => {
    // Check patient view redirect param
    const params = new URLSearchParams(window.location.search);
    const paramData = params.get('p');
    if (paramData) {
      const decoded = decodeAppointmentData(paramData);
      if (decoded) {
        setPatientAppointment(decoded);
      }
    }

    // Load Clinic settings from localStorage safely
    try {
      const savedSettings = localStorage.getItem('ri_clinic_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.warn('Failed to read clinic settings from localStorage:', e);
    }

    // Load Appointment list from localStorage safely
    try {
      const savedApps = localStorage.getItem('ri_appointments');
      if (savedApps) {
        setAppointments(JSON.parse(savedApps));
      }
    } catch (e) {
      console.warn('Failed to read appointments list from localStorage:', e);
    }

    // Load theme configuration safely
    let isDark = false;
    try {
      const savedTheme = localStorage.getItem('ri_dark_mode');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDark = savedTheme ? savedTheme === 'true' : systemPrefersDark;
    } catch (e) {
      console.warn('Failed to read dark mode preference from localStorage:', e);
    }
    setDarkMode(isDark);

    // Capture base app URL (using location.origin for reliability, or injecting env)
    setAppUrl(window.location.origin);
  }, []);

  // 2. Control HTML class for dark mode reactivity
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('ri_dark_mode', String(darkMode));
    } catch (e) {
      console.warn('Failed to save dark mode preference to localStorage:', e);
    }
  }, [darkMode]);

  // Save appointments to localStorage whenever modified safely
  const handleSaveAppointments = (updated: Appointment[]) => {
    setAppointments(updated);
    try {
      localStorage.setItem('ri_appointments', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save appointments list to localStorage:', e);
    }
  };

  const handleCreateAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newApp: Appointment = {
      ...appointmentData,
      id: `app_${Date.now()}`,
      createdAt: Date.now(),
      confirmed: false, // Default pending status
    };

    const updatedList = [newApp, ...appointments];
    handleSaveAppointments(updatedList);
    setActiveAppointment(newApp);
  };

  const handleDeleteAppointment = (id: string) => {
    const updated = appointments.filter(a => a.id !== id);
    handleSaveAppointments(updated);
    if (activeAppointment?.id === id) {
      setActiveAppointment(null);
    }
  };

  const handleUpdateStatus = (id: string, confirmed: boolean) => {
    const updated = appointments.map(a => {
      if (a.id === id) {
        return { ...a, confirmed };
      }
      return a;
    });
    handleSaveAppointments(updated);
  };

  const handleSaveSettings = (updatedSettings: ClinicSettings) => {
    setSettings(updatedSettings);
    try {
      localStorage.setItem('ri_clinic_settings', JSON.stringify(updatedSettings));
    } catch (e) {
      console.warn('Failed to save clinic settings to localStorage:', e);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // If we are currently rendering the patient landing card:
  if (patientAppointment) {
    return (
      <PatientView
        appointment={patientAppointment}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-[#f8fafc] font-sans flex flex-col justify-between transition-colors duration-300 selection:bg-orange-100 dark:selection:bg-slate-800 pb-20 md:pb-6">
      
      {/* Decorative top brand gradients */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#1D92D1]/5 via-[#F26F22]/2 to-transparent pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 pt-5 md:pt-10 space-y-6 flex-1 z-10">
        
        {/* Clinician Hub Header */}
        <header className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
          
          {/* Logo Brand Brand details */}
          <div className="flex items-center gap-3">
            <MiniBrandLogo className="h-10 w-10 border-[#1D92D1]/30 shadow-none" />
            <div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base md:text-lg tracking-tight text-[#044C8C] dark:text-white leading-tight">
                  PET-Saúde Digital
                </span>
                <span className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide mt-0.5">
                  UFRR • Retorno Inteligente UBS
                </span>
              </div>
            </div>
          </div>
          
          {/* Info Badge or small status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F26F22] animate-pulse" />
            <span className="font-bold text-[9px] text-[#044C8C] dark:text-slate-305 uppercase tracking-wider">PET UFRR ATIVO</span>
          </div>
        </header>

        {/* Dynamic Inner views based on tab and QR state */}
        <main className="md:grid md:grid-cols-4 md:gap-8 items-start">
          
          {/* Side Nav rail for Desktops, hidden on Mobile */}
          <aside className="hidden md:block col-span-1 space-y-2 sticky top-6">
            <button
              onClick={() => {
                setActiveAppointment(null);
                setCurrentTab('novo');
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all outline-none ${
                currentTab === 'novo' && !activeAppointment
                  ? 'bg-[#044C8C] text-white shadow-sm shadow-[#044C8C]/10 border-l-4 border-[#F26F22]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
              }`}
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Novo Retorno</span>
            </button>

            <button
              onClick={() => {
                setActiveAppointment(null);
                setCurrentTab('historico');
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all outline-none ${
                currentTab === 'historico' && !activeAppointment
                  ? 'bg-[#044C8C] text-white shadow-sm shadow-[#044C8C]/10 border-l-4 border-[#F26F22]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
              }`}
            >
              <History className="h-4.5 w-4.5" />
              <span>Painel / Histórico</span>
            </button>

            <button
              onClick={() => {
                setActiveAppointment(null);
                setCurrentTab('ajustes');
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all outline-none ${
                currentTab === 'ajustes' && !activeAppointment
                  ? 'bg-[#044C8C] text-white shadow-sm shadow-[#044C8C]/10 border-l-4 border-[#F26F22]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
              }`}
            >
              <SettingsIcon className="h-4.5 w-4.5" />
              <span>Configurações</span>
            </button>

            {/* Micro branding guide */}
            <div className="pt-6 px-4 space-y-2.5 border-t border-slate-200 dark:border-slate-850 mt-4 text-left">
              <span className="text-[10px] font-bold text-[#044C8C] dark:text-[#1D92D1] uppercase tracking-wider block">Como Funciona?</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                1. Preencha os dados da consulta de retorno.<br />
                2. Gere o QR Code e o Cartão Digital.<br />
                3. O paciente lê o código para confirmar presença ou salvar na agenda nativa do celular.
              </p>
            </div>
          </aside>

          {/* Core dynamic Workspace window */}
          <section className="col-span-3 space-y-6">
            
            {activeAppointment ? (
              <QRView
                appointment={activeAppointment}
                onBack={() => {
                  setActiveAppointment(null);
                  setCurrentTab('novo');
                }}
                appUrl={appUrl}
              />
            ) : (
              <>
                {currentTab === 'novo' && (
                  <Form settings={settings} onSubmit={handleCreateAppointment} />
                )}

                {currentTab === 'historico' && (
                  <HistoryList
                    appointments={appointments}
                    onSelectAppointment={(app) => setActiveAppointment(app)}
                    onDeleteAppointment={handleDeleteAppointment}
                    onUpdateStatus={handleUpdateStatus}
                  />
                )}

                {currentTab === 'ajustes' && (
                  <Settings
                    settings={settings}
                    onSaveSettings={handleSaveSettings}
                    darkMode={darkMode}
                    onToggleDarkMode={toggleDarkMode}
                  />
                )}
              </>
            )}

          </section>

        </main>
      </div>

      {/* Persistent Bottom Tab navigation for mobile screens */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-850 z-40 flex items-center justify-around py-3 px-4 shadow-lg">
        <button
          onClick={() => {
            setActiveAppointment(null);
            setCurrentTab('novo');
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer outline-none ${
            currentTab === 'novo' && !activeAppointment ? 'text-[#044C8C] dark:text-[#1D92D1] font-bold' : 'text-slate-400 font-medium'
          }`}
        >
          <Plus className="h-5 w-5" />
          <span className="text-[10px]">Novo Retorno</span>
        </button>

        <button
          onClick={() => {
            setActiveAppointment(null);
            setCurrentTab('historico');
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer outline-none ${
            currentTab === 'historico' && !activeAppointment ? 'text-[#044C8C] dark:text-[#1D92D1] font-bold' : 'text-slate-400 font-medium'
          }`}
        >
          <History className="h-5 w-5" />
          <span className="text-[10px]">Histórico</span>
        </button>

        <button
          onClick={() => {
            setActiveAppointment(null);
            setCurrentTab('ajustes');
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer outline-none ${
            currentTab === 'ajustes' && !activeAppointment ? 'text-[#044C8C] dark:text-[#1D92D1] font-bold' : 'text-slate-400 font-medium'
          }`}
        >
          <SettingsIcon className="h-5 w-5" />
          <span className="text-[10px]">Ajustes</span>
        </button>
      </nav>

      {/* Tiny clean professional footer on Desktop screens */}
      <footer className="hidden md:block border-t border-slate-200 dark:border-slate-900 mt-12 py-6 text-center text-xs text-slate-400">
        <p>© 2026 PET-Saúde Digital UFRR. Informação e saúde preventiva integrada no ecossistema do Sistema Único de Saúde.</p>
        <p className="text-[10px] mt-1 text-slate-400/85">Boa Vista, Roraima • Brasil</p>
      </footer>

    </div>
  );
}

