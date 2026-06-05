import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, ClipboardList, Settings, PlusCircle, Clock, Menu, X, 
  Search, Filter, MoreVertical, Bell, Save, Phone, Mail, Check, 
  Trash2, Edit, AlertCircle, FileText, ArrowRight, UserPlus, Info, CheckCircle2,
  Lock, Eye, EyeOff, ShieldCheck, Stethoscope, ChevronRight, RefreshCw, KeyRound, Sparkles
} from 'lucide-react';

const App = () => {
  // Autenticação & Loading States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' | 'forgot-password'
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Autenticando...');
  const [showPassword, setShowPassword] = useState(false);

  // Form Inputs de Autenticação
  const [emailInput, setEmailInput] = useState('admin@odontofaraoni.com.br');
  const [passwordInput, setPasswordInput] = useState('admin');
  const [resetEmailInput, setResetEmailInput] = useState('');

  // Perfil do Profissional (Dentista)
  const [dentistProfile, setDentistProfile] = useState({
    name: 'Dr. Orlando Faraoni',
    cro: 'CRO-PR 12345',
    specialty: 'Implantodontia e Estética Dental',
    email: 'admin@odontofaraoni.com.br',
    password: 'admin'
  });

  // Perfil da Clínica
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Odontologia Faraoni',
    cnpj: '12.345.678/0001-90',
    address: 'Marialva - PR',
    phone: '+55 (44) 99744-3696',
    email: 'contato@odontofaraoni.com.br',
    reminders: true
  });

  // Lógica de navegação
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState(null);
  
  // Custom Toast notification system (Vercel-like design)
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Log de Auditoria / Atividades Recentes
  const [auditLog, setAuditLog] = useState([
    { id: 1, time: '16:15', text: 'Dr. Orlando Faraoni iniciou a sessão clínica' },
    { id: 2, time: '15:30', text: 'Profilaxia de Maria Oliveira marcada como Concluída' },
    { id: 3, time: '11:00', text: 'Novo paciente Carlos Mendes cadastrado no prontuário' }
  ]);

  const addAuditLog = (text) => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setAuditLog(prev => [{ id: Date.now(), time, text }, ...prev.slice(0, 6)]);
  };

  // State para os agendamentos dinâmicos
  const [appointments, setAppointments] = useState([
    { id: 1, patientId: 1, patient: 'Maria Oliveira', procedure: 'Profilaxia e Terapia Periodontal', time: '09:00', date: '2026-05-22', status: 'Confirmado' },
    { id: 2, patientId: 2, patient: 'João Silva', procedure: 'Instalação de Implante Osseointegrado', time: '10:30', date: '2026-05-22', status: 'Pendente' }
  ]);
  
  // Novo agendamento form state
  const [formData, setFormData] = useState({ patientId: '', procedure: '', time: '', date: '2026-06-05' });

  // Lista de Pacientes com Prontuário Realista
  const [patientsList, setPatientsList] = useState([
    { 
      id: 1, 
      name: 'Maria Oliveira', 
      phone: '(44) 99123-4567', 
      email: 'maria.oliveira@outlook.com', 
      lastVisit: '15/05/2026', 
      nextVisit: '22/05/2026', 
      status: 'Ativo',
      allergies: 'Sem alergias sistêmicas relatadas',
      medicalNotes: 'Paciente compareceu para consulta periódica. Relata leve sensibilidade térmica no quadrante inferior esquerdo. Ao exame físico, detectou-se integridade em todas as restaurações. Realizada raspagem supra e subgengival acompanhada de profilaxia e aplicação tópica de flúor.',
      treatments: ['Profilaxia Clínica', 'Raspagem Periodontal']
    },
    { 
      id: 2, 
      name: 'João Silva', 
      phone: '(44) 99876-5432', 
      email: 'joao.silva@gmail.com', 
      lastVisit: '10/04/2026', 
      nextVisit: '22/05/2026', 
      status: 'Em Tratamento',
      allergies: 'Reação anafilática documentada com Penicilina G Potássica',
      medicalNotes: 'Realizado procedimento cirúrgico para instalação de implante de titânio (cone morse) no elemento 14. Torque de inserção obtido: 45 N.cm. Prescrito protocolo analgésico e anti-inflamatório (Amoxicilina contraindicada, optado por Clindamicina em caso de infecção secundária). Suturas posicionadas perfeitamente.',
      treatments: ['Implante Dentário', 'Enxerto Ósseo Autógeno']
    },
    { 
      id: 3, 
      name: 'Ana Souza', 
      phone: '(44) 99765-4321', 
      email: 'ana.souza@yahoo.com.br', 
      lastVisit: '05/01/2026', 
      nextVisit: 'Agendar', 
      status: 'Inativo',
      allergies: 'Sem alergias clínicas relatadas',
      medicalNotes: 'Apresenta indicação para tratamento endodôntico no elemento 24 devido a quadro de pulpite irreversível. Paciente informou necessidade de adiar a intervenção por motivos de viagem profissional. Prescrito controle analgésico de urgência.',
      treatments: ['Tratamento de Canal (Elemento 24)']
    },
    { 
      id: 4, 
      name: 'Carlos Mendes', 
      phone: '(44) 99111-2222', 
      email: 'carlos.mendes@empresa.com', 
      lastVisit: '20/05/2026', 
      nextVisit: '15/06/2026', 
      status: 'Ativo',
      allergies: 'Hipersensibilidade por contato com látex natural',
      medicalNotes: 'Finalizada cimentação adesiva de faceta estética cerâmica no elemento 11. Utilizado isolamento absoluto com lençol de borracha sintético (isento de látex). Ajuste oclusal fino e polimento de margens executados. Paciente aprovou integralmente o resultado estético.',
      treatments: ['Lente de Contato Dental']
    }
  ]);

  // Temp form para paciente
  const [patientFormData, setPatientFormData] = useState({ 
    id: null, 
    name: '', 
    phone: '', 
    email: '', 
    status: 'Ativo',
    allergies: 'Sem alergias sistêmicas relatadas',
    medicalNotes: '',
    treatments: []
  });

  // Configuração temporária
  const [settingsForm, setSettingsForm] = useState({ ...clinicInfo });
  const [dentistForm, setDentistForm] = useState({ ...dentistProfile });
  const [secPassword, setSecPassword] = useState({ current: '', next: '', confirm: '' });

  // Busca e Filtros
  const [patientSearch, setPatientSearch] = useState('');
  const [patientStatusFilter, setPatientStatusFilter] = useState('Todos');
  const [agendaSearch, setAgendaSearch] = useState('');
  const [agendaStatusFilter, setAgendaStatusFilter] = useState('Todos');

  // Lógica de Login com barra de carregamento limpa (sem neon)
  const handleLogin = (e) => {
    e.preventDefault();
    const normalizedEmailInput = emailInput.toLowerCase().trim();
    const isCorrectEmail = normalizedEmailInput === dentistProfile.email.toLowerCase() || 
                           normalizedEmailInput === 'orlando.faraoni@odontofaraoni.com.br';
    
    if (isCorrectEmail && passwordInput === dentistProfile.password) {
      setIsLoggingIn(true);
      setLoadingProgress(0);
      setLoadingText('Autenticando credenciais...');
      
      const intervals = [
        { time: 300, text: 'Verificando banco de dados clínico...', prog: 35 },
        { time: 700, text: 'Sincronizando agenda e prontuários...', prog: 70 },
        { time: 1200, text: 'Estruturando painel de controle...', prog: 100 }
      ];

      intervals.forEach((step) => {
        setTimeout(() => {
          setLoadingText(step.text);
          setLoadingProgress(step.prog);
        }, step.time);
      });

      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoggingIn(false);
        addToast(`Bem-vindo de volta, ${dentistProfile.name}`);
        addAuditLog(`${dentistProfile.name} iniciou sessão administrativa.`);
      }, 1500);
    } else {
      addToast('Credenciais de acesso incorretas.', 'error');
    }
  };

  // Recuperação de senha simulada
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!resetEmailInput) {
      addToast('Informe o seu e-mail de acesso.', 'error');
      return;
    }
    setIsLoggingIn(true);
    setLoadingProgress(0);
    setLoadingText('Pesquisando conta...');
    
    setTimeout(() => {
      setLoadingProgress(60);
      setLoadingText('Gerando token de segurança...');
    }, 500);

    setTimeout(() => {
      setLoadingProgress(100);
      setIsLoggingIn(false);
      addToast(`Instruções de redefinição enviadas para ${resetEmailInput}`, 'success');
      setResetEmailInput('');
      setAuthView('login');
    }, 1200);
  };

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmailInput('');
    setPasswordInput('');
    addToast('Sessão administrativa finalizada.', 'info');
  };

  // Novo Agendamento
  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.procedure || !formData.time) {
      addToast('Todos os campos do agendamento são requeridos.', 'error');
      return;
    }
    
    const selectedPatient = patientsList.find(p => p.id === parseInt(formData.patientId));
    if (!selectedPatient) return;

    const newAppt = {
      id: Date.now(),
      patientId: selectedPatient.id,
      patient: selectedPatient.name,
      procedure: formData.procedure,
      time: formData.time,
      date: formData.date || '2026-06-05',
      status: 'Pendente'
    };
    
    setAppointments(prev => [...prev, newAppt]);
    
    // Atualizar próxima consulta do paciente
    setPatientsList(prev => prev.map(p => {
      if (p.id === selectedPatient.id) {
        return { ...p, nextVisit: formData.date.split('-').reverse().join('/') };
      }
      return p;
    }));

    addAuditLog(`Consulta de ${selectedPatient.name} marcada para as ${formData.time}`);
    setFormData({ patientId: '', procedure: '', time: '', date: '2026-06-05' });
    setIsModalOpen(false);
    addToast('Agendamento cadastrado com sucesso.');
  };

  // Alterar Status Consulta
  const handleToggleStatus = (apptId) => {
    setAppointments(prev => prev.map(appt => {
      if (appt.id === apptId) {
        const nextStatus = appt.status === 'Confirmado' ? 'Pendente' : appt.status === 'Pendente' ? 'Concluído' : 'Confirmado';
        addAuditLog(`Status da consulta de ${appt.patient} atualizado para ${nextStatus}`);
        addToast(`Consulta de ${appt.patient}: ${nextStatus}`, 'info');
        return { ...appt, status: nextStatus };
      }
      return appt;
    }));
  };

  // Cancelar Consulta
  const handleDeleteAppointment = (apptId) => {
    const appt = appointments.find(a => a.id === apptId);
    setAppointments(prev => prev.filter(a => a.id !== apptId));
    addAuditLog(`Agendamento de ${appt?.patient || 'Paciente'} removido.`);
    addToast('Agendamento excluído.', 'info');
  };

  // Novo Paciente / Editar Paciente
  const handleSavePatient = (e) => {
    e.preventDefault();
    if (!patientFormData.name || !patientFormData.phone) {
      addToast('Nome completo e telefone celular são obrigatórios.', 'error');
      return;
    }

    if (patientFormData.id) {
      // Editar
      setPatientsList(prev => prev.map(p => p.id === patientFormData.id ? { ...p, ...patientFormData } : p));
      setAppointments(prev => prev.map(a => a.patientId === patientFormData.id ? { ...a, patient: patientFormData.name } : a));
      addAuditLog(`Prontuário cadastral de ${patientFormData.name} atualizado.`);
      addToast('Registro do paciente atualizado.');
    } else {
      // Cadastrar
      const newPatient = {
        ...patientFormData,
        id: Date.now(),
        lastVisit: 'Hoje',
        nextVisit: 'Agendar',
        treatments: patientFormData.treatments.length > 0 ? patientFormData.treatments : ['Avaliação Clínica Inicial']
      };
      setPatientsList(prev => [...prev, newPatient]);
      addAuditLog(`Cadastro do paciente ${patientFormData.name} inicializado.`);
      addToast('Paciente cadastrado com sucesso.');
    }

    setPatientFormData({ 
      id: null, name: '', phone: '', email: '', status: 'Ativo', 
      allergies: 'Sem alergias sistêmicas relatadas', medicalNotes: '', treatments: [] 
    });
    setIsPatientModalOpen(false);
  };

  const handleEditPatient = (patient) => {
    setPatientFormData(patient);
    setIsPatientModalOpen(true);
  };

  const handleDeletePatient = (patientId) => {
    const p = patientsList.find(p => p.id === patientId);
    if (window.confirm(`Confirmar remoção dos registros de ${p?.name}? Os agendamentos associados serão preservados.`)) {
      setPatientsList(prev => prev.filter(p => p.id !== patientId));
      addAuditLog(`Paciente ${p?.name} removido da base clínica.`);
      addToast('Paciente excluído.', 'info');
      if (selectedPatientForHistory?.id === patientId) {
        setSelectedPatientForHistory(null);
      }
    }
  };

  // Atualizar Ficha Médica
  const handleUpdateMedicalFile = (e) => {
    e.preventDefault();
    if (!selectedPatientForHistory) return;

    setPatientsList(prev => prev.map(p => {
      if (p.id === selectedPatientForHistory.id) {
        return {
          ...p,
          allergies: selectedPatientForHistory.allergies,
          medicalNotes: selectedPatientForHistory.medicalNotes
        };
      }
      return p;
    }));

    addAuditLog(`Evolução clínica de ${selectedPatientForHistory.name} editada.`);
    addToast('Evolução do prontuário gravada.');
    setSelectedPatientForHistory(null);
  };

  // Salvar Perfil da Clínica
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setClinicInfo({ ...settingsForm });
    addAuditLog('Configurações cadastrais da clínica alteradas.');
    addToast('Informações da clínica salvas.');
  };

  // Salvar Perfil do Profissional
  const handleSaveDentistProfile = (e) => {
    e.preventDefault();
    setDentistProfile({ ...dentistForm });
    addAuditLog('Perfil profissional de dentista atualizado.');
    addToast('Perfil profissional atualizado.');
  };

  // Alterar Senha
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (secPassword.current !== dentistProfile.password) {
      addToast('Senha atual informada está incorreta.', 'error');
      return;
    }
    if (secPassword.next !== secPassword.confirm) {
      addToast('A nova senha e a confirmação devem ser iguais.', 'error');
      return;
    }
    if (!secPassword.next) {
      addToast('A senha não pode ser em branco.', 'error');
      return;
    }

    setDentistProfile(prev => ({ ...prev, password: secPassword.next }));
    setSecPassword({ current: '', next: '', confirm: '' });
    addAuditLog('Senha mestra administrativa redefinida.');
    addToast('Senha mestra alterada.');
  };

  // Estatísticas do Dashboard
  const stats = [
    { 
      label: 'Consultas Hoje', 
      value: appointments.filter(a => a.status !== 'Concluído').length.toString(), 
      icon: <Clock className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50/50',
      border: 'border-indigo-100/50'
    },
    { 
      label: 'Pacientes Ativos', 
      value: patientsList.filter(p => p.status === 'Ativo').length.toString(), 
      icon: <Users className="w-5 h-5 text-teal-600" />,
      bg: 'bg-teal-50/50',
      border: 'border-teal-100/50'
    },
    { 
      label: 'Concluídos Hoje', 
      value: appointments.filter(a => a.status === 'Concluído').length.toString(), 
      icon: <Check className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-100/50'
    },
  ];

  const completedRate = appointments.length > 0 
    ? Math.round((appointments.filter(a => a.status === 'Concluído').length / appointments.length) * 100) 
    : 0;

  // Filtros aplicados
  const filteredPatients = patientsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(patientSearch.toLowerCase()) || 
                          p.phone.includes(patientSearch) ||
                          p.email.toLowerCase().includes(patientSearch.toLowerCase());
    const matchesFilter = patientStatusFilter === 'Todos' || p.status === patientStatusFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.patient.toLowerCase().includes(agendaSearch.toLowerCase()) ||
                          a.procedure.toLowerCase().includes(agendaSearch.toLowerCase());
    const matchesFilter = agendaStatusFilter === 'Todos' || a.status === agendaStatusFilter;
    return matchesSearch && matchesFilter;
  });

  // Time slots para a agenda
  const allTimeSlots = [
    { time: '08:00', appt: null },
    { time: '09:00', appt: null },
    { time: '10:00', appt: null },
    { time: '10:30', appt: null },
    { time: '11:30', appt: null },
    { time: '13:00', appt: null },
    { time: '14:00', appt: null },
    { time: '15:00', appt: null },
    { time: '16:00', appt: null }
  ];

  allTimeSlots.forEach(slot => {
    const found = appointments.find(a => a.time === slot.time);
    if (found) {
      slot.appt = found;
    }
  });

  // Componente de navegação da sidebar
  const NavContent = () => (
    <nav className="space-y-1.5">
      <button 
        onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-xs uppercase tracking-wider ${
          activeTab === 'dashboard' 
            ? 'bg-indigo-650 text-white shadow-md shadow-indigo-950/40' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <ClipboardList className="w-4.5 h-4.5" /> Dashboard
      </button>
      <button 
        onClick={() => {setActiveTab('agenda'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-xs uppercase tracking-wider ${
          activeTab === 'agenda' 
            ? 'bg-indigo-650 text-white shadow-md shadow-indigo-950/40' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Calendar className="w-4.5 h-4.5" /> Agenda
      </button>
      <button 
        onClick={() => {setActiveTab('pacientes'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-xs uppercase tracking-wider ${
          activeTab === 'pacientes' 
            ? 'bg-indigo-650 text-white shadow-md shadow-indigo-950/40' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Users className="w-4.5 h-4.5" /> Pacientes
      </button>
      <button 
        onClick={() => {setActiveTab('definicoes'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-xs uppercase tracking-wider ${
          activeTab === 'definicoes' 
            ? 'bg-indigo-650 text-white shadow-md shadow-indigo-950/40' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Settings className="w-4.5 h-4.5" /> Definições
      </button>
    </nav>
  );

  // TELA DE LOADING TRANSITÓRIA E MINIMALISTA
  if (isLoggingIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-xs text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white mx-auto shadow-md">
            <Stethoscope className="w-6 h-6 animate-pulse" />
          </div>
          
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-slate-850 tracking-tight">OdontoGestão</h2>
            <p className="text-xs text-slate-500 font-semibold">{loadingText}</p>
          </div>

          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-slate-800 transition-all duration-300 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // TELA DE AUTENTICAÇÃO: SPLIT-SCREEN LAYOUT (PADRÃO STRIPE / LINEAR)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-slate-800 animate-fade-in">
        
        {/* Left Side: Brand Panel */}
        <div className="hidden md:flex md:w-1/2 bg-slate-950 text-slate-200 p-12 lg:p-20 flex-col justify-between relative overflow-hidden">
          
          {/* Subtle geometric overlay, very clean and matte */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Logo brand */}
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white">
              <Stethoscope className="w-5.5 h-5.5 text-indigo-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">OdontoGestão</span>
          </div>

          {/* Core statement */}
          <div className="space-y-6 max-w-md my-auto z-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              A gestão clínica que eleva o nível do seu atendimento.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Simplifique sua rotina diária de consultas, gerencie fichas médicas de evolução clínica e mantenha o prontuário de seus pacientes organizado em uma interface de alta performance.
            </p>
          </div>

          {/* Doctor Signature / Quote */}
          <div className="border-t border-slate-900 pt-6 z-10 max-w-sm">
            <p className="text-xs text-slate-450 italic leading-relaxed">
              "A organização e o rigor técnico que a Odontologia Faraoni precisava para estruturar sua expansão clínica."
            </p>
            <p className="text-[11px] font-bold text-slate-300 mt-2.5">
              {dentistProfile.name} <span className="text-slate-500 font-normal">| {dentistProfile.cro}</span>
            </p>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 bg-slate-50/40">
          <div className="mx-auto w-full max-w-sm space-y-8">
            
            {/* Mobile Brand indicator */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-white">
                <Stethoscope className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-base font-bold text-slate-900">OdontoGestão</span>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {authView === 'login' ? 'Acesse sua conta clínica' : 'Recuperar senha de acesso'}
              </h2>
              <p className="mt-2 text-xs text-slate-500 font-medium">
                {authView === 'login' 
                  ? 'Informe suas credenciais administrativas de acesso.' 
                  : 'Digite seu e-mail cadastrado para redefinir as credenciais.'}
              </p>
            </div>

            {/* FORM: LOGIN */}
            {authView === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Endereço de E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" />
                    <input 
                      type="email" 
                      required
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder="nome@clinica.com"
                      className="w-full bg-white border border-slate-250/70 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Senha de Segurança</label>
                    <button 
                      type="button" 
                      onClick={() => setAuthView('forgot-password')} 
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-455" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-250/70 rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold hover:bg-slate-850 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm border border-slate-950"
                  >
                    Entrar no Sistema <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Minimalist Info Callout */}
                <div className="bg-slate-100/80 border border-slate-200/50 p-3.5 rounded-xl flex gap-2.5">
                  <Info className="w-4.5 h-4.5 text-slate-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-600 leading-normal">
                    <span className="font-bold text-slate-800">Ambiente de Demonstração</span>
                    <p className="mt-0.5">Usuário: <code className="text-slate-900 font-semibold">admin@odontofaraoni.com.br</code></p>
                    <p>Senha: <code className="text-slate-900 font-semibold">admin</code></p>
                  </div>
                </div>
              </form>
            )}

            {/* FORM: FORGOT PASSWORD */}
            {authView === 'forgot-password' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">E-mail Administrativo</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" />
                    <input 
                      type="email" 
                      required
                      value={resetEmailInput}
                      onChange={e => setResetEmailInput(e.target.value)}
                      placeholder="digite@seuemail.com"
                      className="w-full bg-white border border-slate-250/70 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    type="submit" 
                    className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold hover:bg-slate-850 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Enviar Link de Redefinição
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAuthView('login')}
                    className="w-full border border-slate-250 text-slate-600 py-2.5 rounded-xl font-semibold hover:bg-slate-50 hover:text-slate-800 transition-all text-xs"
                  >
                    Voltar para o Login
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    );
  }

  // TELA DO PAINEL PRINCIPAL (AUTENTICADO)
  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans antialiased text-slate-850">
      
      {/* Vercel-like Minimalist Toast Notifications */}
      <div className="fixed top-5 right-5 z-[100] space-y-3 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className="p-3.5 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto transform translate-y-0 transition-all duration-200 animate-slide-in"
          >
            {t.type === 'error' ? <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" /> :
             t.type === 'info' ? <Info className="w-4.5 h-4.5 text-indigo-400 shrink-0" /> :
             <Check className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
            }
            <div className="text-xs font-semibold tracking-wide">{t.message}</div>
          </div>
        ))}
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-100 p-6 border-r border-slate-800 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-white border border-slate-800">
            <Stethoscope className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-white">OdontoGestão</h2>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">PRONTUÁRIO E AGENDA</p>
          </div>
        </div>
        
        <div className="flex-1">
          <NavContent />
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 bg-slate-850/50 p-3 rounded-xl border border-slate-850">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-extrabold text-xs">
              {dentistProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate w-32">{dentistProfile.name}</p>
              <p className="text-[10px] text-slate-500 font-semibold truncate">{dentistProfile.cro}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-slate-800 hover:bg-slate-850 text-slate-400 hover:text-rose-400 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all border border-slate-800"
          >
            Sair do Painel
          </button>
        </div>
      </div>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="w-72 max-w-[85vw] h-full bg-slate-900 text-white p-6 flex flex-col transition-all duration-300 relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-white border border-slate-800">
                  <Stethoscope className="w-4 h-4 text-indigo-400" />
                </div>
                <h2 className="text-base font-bold text-white">OdontoGestão</h2>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-850"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="flex-1">
              <NavContent />
            </div>
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-350 font-bold text-xs">
                  {dentistProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-white truncate w-36">{dentistProfile.name}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">{dentistProfile.cro}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full bg-slate-800 text-slate-300 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Sair do Painel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 z-20 shadow-sm shadow-slate-100/10">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-4.5 h-4.5" />
            </button>
            <div>
              <h1 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                {activeTab === 'dashboard' && 'Visão Geral Clínica'}
                {activeTab === 'agenda' && 'Grade de Agendamentos'}
                {activeTab === 'pacientes' && 'Base de Prontuários'}
                {activeTab === 'definicoes' && 'Configurações Administrativas'}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium mt-0.5">
                {activeTab === 'dashboard' && `Sessão ativa: ${dentistProfile.name} | Gestão operacional de prontuários e retornos.`}
                {activeTab === 'agenda' && 'Gestão de horários clínicos e controle de faltas/conclusões.'}
                {activeTab === 'pacientes' && 'Acesso direto a prontuários e evolução clínica individual.'}
                {activeTab === 'definicoes' && 'Atualize o perfil profissional do dentista e dados da clínica.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setPatientFormData({ 
                  id: null, name: '', phone: '', email: '', status: 'Ativo', 
                  allergies: 'Sem alergias sistêmicas relatadas', medicalNotes: '', treatments: [] 
                });
                setIsPatientModalOpen(true);
              }} 
              className="bg-white text-slate-700 border border-slate-200 p-2 md:px-3.5 md:py-2 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-all text-xs font-bold shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-600" /> 
              <span className="hidden lg:inline">Novo Paciente</span>
            </button>

            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-slate-900 text-white p-2 md:px-3.5 md:py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all text-xs font-bold shadow-sm border border-slate-950"
            >
              <PlusCircle className="w-3.5 h-3.5" /> 
              <span>Novo Agendamento</span>
            </button>
          </div>
        </header>

        {/* Dynamic content scrollable area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Stats Cards (Matte & Clean styling) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{s.label}</p>
                      <p className="text-xl font-bold text-slate-900">{s.value}</p>
                    </div>
                    <div className={`p-3 ${s.bg} rounded-xl border ${s.border}`}>
                      {s.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Agenda Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Próximos Atendimentos</h3>
                        <p className="text-[11px] text-slate-450 mt-0.5">Lista de consultas agendadas ordenadas cronologicamente.</p>
                      </div>
                      <button onClick={() => setActiveTab('agenda')} className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
                        Agenda Completa <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
                      <table className="w-full text-left min-w-[500px]">
                        <thead>
                          <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 pb-3">
                            <th className="pb-3 font-semibold">Paciente</th>
                            <th className="pb-3 font-semibold">Procedimento Clínico</th>
                            <th className="pb-3 font-semibold">Horário</th>
                            <th className="pb-3 font-semibold">Status</th>
                            <th className="pb-3 font-semibold text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.slice(0, 4).map((appt) => (
                            <tr key={appt.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/20 transition-colors">
                              <td className="py-3.5 font-bold text-slate-800 text-xs">{appt.patient}</td>
                              <td className="py-3.5 text-xs text-slate-500 font-semibold">{appt.procedure}</td>
                              <td className="py-3.5 text-xs text-slate-500 font-bold">{appt.time}</td>
                              <td className="py-3.5">
                                <button 
                                  onClick={() => handleToggleStatus(appt.id)}
                                  className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition-all border ${
                                    appt.status === 'Confirmado' ? 'text-indigo-700 bg-indigo-50 border-indigo-100/60' :
                                    appt.status === 'Concluído' ? 'text-slate-500 bg-slate-100 border-slate-200' :
                                    'text-amber-700 bg-amber-50 border-amber-100'
                                  }`}
                                >
                                  {appt.status}
                                </button>
                              </td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button 
                                    onClick={() => handleToggleStatus(appt.id)} 
                                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
                                    title="Alternar Status"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteAppointment(appt.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                    title="Remover Agendamento"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {appointments.length === 0 && (
                            <tr>
                              <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">
                                <Info className="w-5 h-5 text-slate-300 mx-auto mb-2" />
                                Não há atendimentos programados para hoje.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Performance progress & System Logs */}
                <div className="space-y-6">
                  
                  {/* Occupancy Progress */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6">
                    <h3 className="font-bold text-slate-900 text-xs mb-4">Progresso do Período</h3>
                    
                    <div className="flex items-center gap-5">
                      <div className="relative flex items-center justify-center shrink-0">
                        {/* Circular ring graph - Minimalist Indigo */}
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                          <circle cx="32" cy="32" r="28" stroke="#4f46e5" strokeWidth="6" fill="transparent"
                            strokeDasharray={2 * Math.PI * 28}
                            strokeDashoffset={2 * Math.PI * 28 * (1 - completedRate / 100)}
                          />
                        </svg>
                        <span className="absolute text-xs font-bold text-slate-900">{completedRate}%</span>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-650">Taxa de Conclusão Diária</p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                          {appointments.filter(a => a.status === 'Concluído').length} de {appointments.length} consultas foram concluídas pelo profissional.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logs de Auditoria */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6">
                    <h3 className="font-bold text-slate-900 text-xs mb-3">Atividades Recentes</h3>
                    
                    <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                      {auditLog.map((log) => (
                        <div key={log.id} className="flex gap-2 text-[10px] leading-relaxed">
                          <span className="font-bold text-slate-400 shrink-0">{log.time}</span>
                          <span className="text-slate-600 font-semibold">{log.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: AGENDA */}
          {activeTab === 'agenda' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-6 animate-fade-in">
              
              {/* Header and Controls */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Agenda de Atendimentos</h3>
                  <p className="text-[11px] text-slate-400">Rotina diária e controle de horários clínicos.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative shrink-0">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Pesquisar..." 
                      value={agendaSearch}
                      onChange={e => setAgendaSearch(e.target.value)}
                      className="pl-9 pr-4 py-1.5 w-44 md:w-56 text-xs border border-slate-250/80 rounded-xl focus:outline-none focus:border-indigo-600 shadow-sm" 
                    />
                  </div>

                  <select 
                    value={agendaStatusFilter} 
                    onChange={e => setAgendaStatusFilter(e.target.value)}
                    className="py-1.5 px-3 border border-slate-250/80 text-xs rounded-xl outline-none focus:border-indigo-600 text-slate-600 font-semibold shadow-sm"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Confirmado">Confirmados</option>
                    <option value="Pendente">Pendentes</option>
                    <option value="Concluído">Concluídos</option>
                  </select>
                </div>
              </div>

              {/* Time Slots Layout */}
              <div className="space-y-3.5 max-w-4xl">
                {allTimeSlots
                  .filter(slot => {
                    if (!slot.appt) {
                      return agendaSearch === '' && agendaStatusFilter === 'Todos';
                    }
                    const matchesSearch = slot.appt.patient.toLowerCase().includes(agendaSearch.toLowerCase()) || 
                                          slot.appt.procedure.toLowerCase().includes(agendaSearch.toLowerCase());
                    const matchesFilter = agendaStatusFilter === 'Todos' || slot.appt.status === agendaStatusFilter;
                    return matchesSearch && matchesFilter;
                  })
                  .map((slot, index) => {
                    const appt = slot.appt;
                    if (!appt) {
                      return (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-xl border-slate-100 bg-slate-50/40 hover:bg-slate-50/80 transition-colors">
                          <div className="w-16 font-bold text-slate-400 text-xs flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {slot.time}
                          </div>
                          <div className="flex-1 text-slate-400 text-[11px] font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            Livre
                          </div>
                          <button 
                            onClick={() => {
                              setFormData({ ...formData, time: slot.time });
                              setIsModalOpen(true);
                            }}
                            className="text-[10px] text-slate-700 hover:text-slate-900 font-bold bg-white border border-slate-250 px-3 py-1.5 rounded-xl hover:shadow-sm transition-all"
                          >
                            Reservar
                          </button>
                        </div>
                      );
                    }

                    const isConfirmado = appt.status === 'Confirmado';
                    const isConcluido = appt.status === 'Concluído';

                    return (
                      <div 
                        key={appt.id} 
                        className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-xl relative overflow-hidden transition-all hover:shadow-sm ${
                          isConcluido ? 'border-slate-200 bg-slate-50/40 opacity-80' :
                          isConfirmado ? 'border-indigo-100 bg-indigo-50/10' : 
                          'border-amber-100 bg-amber-50/10'
                        }`}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          isConcluido ? 'bg-slate-400' :
                          isConfirmado ? 'bg-indigo-500' : 
                          'bg-amber-500'
                        }`}></div>

                        <div className="w-16 font-bold text-slate-800 text-xs flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {appt.time}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-850 text-xs sm:text-sm">{appt.patient}</p>
                          <p className={`text-[11px] font-semibold mt-0.5 ${isConfirmado ? 'text-indigo-700' : isConcluido ? 'text-slate-500' : 'text-amber-700'}`}>
                            {appt.procedure}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wide border ${
                            isConfirmado ? 'text-indigo-700 bg-indigo-50 border-indigo-100/60' :
                            isConcluido ? 'text-slate-550 bg-slate-100 border-slate-200' :
                            'text-amber-700 bg-amber-50 border-amber-100'
                          }`}>
                            {appt.status}
                          </span>

                          <div className="flex items-center gap-1 border-l border-slate-200/80 pl-3">
                            <button 
                              onClick={() => handleToggleStatus(appt.id)}
                              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
                              title="Marcar Status"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAppointment(appt.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              title="Cancelar Consulta"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

            </div>
          )}

          {/* TAB 3: PACIENTES */}
          {activeTab === 'pacientes' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-6 animate-fade-in">
              
              {/* Header and Controls */}
              <div className="flex flex-col md:flex-row justify-between items-slate-800 md:items-center gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar prontuário..." 
                    value={patientSearch}
                    onChange={e => setPatientSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-250/80 rounded-xl focus:outline-none focus:border-indigo-600 text-xs shadow-sm" 
                  />
                </div>

                <div className="flex gap-3">
                  <select 
                    value={patientStatusFilter} 
                    onChange={e => setPatientStatusFilter(e.target.value)}
                    className="py-2 px-3 border border-slate-250/80 text-xs rounded-xl outline-none focus:border-indigo-600 text-slate-650 font-semibold shadow-sm"
                  >
                    <option value="Todos">Todos os Status</option>
                    <option value="Ativo">Ativos</option>
                    <option value="Em Tratamento">Em Tratamento</option>
                    <option value="Inativo">Inativos</option>
                  </select>
                </div>
              </div>

              {/* Patients Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left min-w-[750px]">
                  <thead>
                    <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                      <th className="p-4">Ficha / Paciente</th>
                      <th className="p-4">Telefone</th>
                      <th className="p-4">Último Retorno</th>
                      <th className="p-4">Próximo Retorno</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Ações Clínicas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/20 transition-all">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8.5 h-8.5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-[11px]">
                              {patient.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-850 text-xs">{patient.name}</p>
                              <p className="text-[10px] text-slate-450 font-medium">{patient.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-650 text-xs font-semibold">{patient.phone}</td>
                        <td className="p-4 text-slate-500 text-xs font-medium">{patient.lastVisit}</td>
                        <td className="p-4">
                          {patient.nextVisit === 'Agendar' ? (
                            <button 
                              onClick={() => {
                                setFormData({ ...formData, patientId: patient.id.toString() });
                                setIsModalOpen(true);
                              }}
                              className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold border border-indigo-100 bg-indigo-50/40 px-2 py-0.5 rounded-lg"
                            >
                              Agendar
                            </button>
                          ) : (
                            <span className="text-slate-600 text-xs font-semibold">{patient.nextVisit}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border 
                            ${patient.status === 'Ativo' ? 'text-emerald-700 bg-emerald-50 border-emerald-100/60' : 
                              patient.status === 'Em Tratamento' ? 'text-indigo-700 bg-indigo-50 border-indigo-100/60' : 
                              'text-slate-600 bg-slate-100 border-slate-200'}`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => setSelectedPatientForHistory(patient)}
                              className="px-2.5 py-1 bg-slate-150 text-slate-700 hover:bg-indigo-50 hover:text-indigo-750 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 border border-slate-200 hover:border-indigo-100"
                            >
                              <FileText className="w-3 h-3 text-slate-600" /> Prontuário
                            </button>
                            
                            <button 
                              onClick={() => handleEditPatient(patient)}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                              title="Editar Paciente"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeletePatient(patient.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                              title="Excluir Paciente"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPatients.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-400 text-xs">
                          <Info className="w-5 h-5 text-slate-300 mx-auto mb-2" />
                          Nenhum prontuário correspondente aos critérios.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CONFIGURAÇÕES / DEFINIÇÕES */}
          {activeTab === 'definicoes' && (
            <div className="space-y-6 animate-fade-in font-sans">
              
              {/* Profile Config grid */}
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Configuration Tabs navigation */}
                <div className="col-span-1 space-y-2">
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase font-extrabold tracking-widest mb-3.5 px-2">Painel de Configuração</p>
                    <button className="w-full text-left p-3 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-2 text-xs shadow-sm border border-slate-950">
                      <Stethoscope className="w-4 h-4 text-indigo-400" /> Registro Clínico
                    </button>
                    <button 
                      onClick={() => addToast('Configurações de alerta ativas.', 'info')} 
                      className="w-full text-left p-3 rounded-xl text-slate-650 hover:bg-slate-50 hover:text-slate-800 font-semibold transition-colors flex items-center gap-2 text-xs"
                    >
                      <Bell className="w-4 h-4" /> Lembretes SMS & Whats
                    </button>
                    <button 
                      onClick={() => addToast('Módulo financeiro desativado nesta versão.', 'info')} 
                      className="w-full text-left p-3 rounded-xl text-slate-650 hover:bg-slate-50 hover:text-slate-800 font-semibold transition-colors flex items-center gap-2 text-xs"
                    >
                      <Sparkles className="w-4 h-4" /> Cobrança & Faturamento
                    </button>
                  </div>
                </div>

                {/* Main Config Forms */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                  
                  {/* Perfil Profissional (Dentista) */}
                  <form onSubmit={handleSaveDentistProfile} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2"><Lock className="w-4 h-4 text-indigo-600" /> Identificação do Profissional</h3>
                      <p className="text-[11px] text-slate-450">Edite os dados que assinam eletronicamente as receitas e prontuários.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome Completo</label>
                        <input 
                          type="text" 
                          value={dentistForm.name} 
                          onChange={e => setDentistForm({ ...dentistForm, name: e.target.value })}
                          className="w-full border border-slate-250/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Número de Registro (CRO)</label>
                        <input 
                          type="text" 
                          value={dentistForm.cro} 
                          onChange={e => setDentistForm({ ...dentistForm, cro: e.target.value })}
                          className="w-full border border-slate-250/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">E-mail Profissional</label>
                        <input 
                          type="email" 
                          value={dentistForm.email} 
                          onChange={e => setDentistForm({ ...dentistForm, email: e.target.value })}
                          className="w-full border border-slate-250/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Especialidade Dentária</label>
                        <input 
                          type="text" 
                          value={dentistForm.specialty} 
                          onChange={e => setDentistForm({ ...dentistForm, specialty: e.target.value })}
                          className="w-full border border-slate-250/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit" 
                        className="bg-slate-900 border border-slate-950 text-white px-5 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all text-xs"
                      >
                        Gravar Perfil
                      </button>
                    </div>
                  </form>

                  {/* Perfil da Clínica */}
                  <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-teal-600" /> Cadastro da Clínica</h3>
                      <p className="text-[11px] text-slate-450">Edite as informações jurídicas e contatos comerciais.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Razão Social / Nome Comercial</label>
                        <input 
                          type="text" 
                          value={settingsForm.name} 
                          onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })}
                          className="w-full border border-slate-250/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">CNPJ / Cadastro de Pessoa Jurídica</label>
                        <input 
                          type="text" 
                          value={settingsForm.cnpj} 
                          onChange={e => setSettingsForm({ ...settingsForm, cnpj: e.target.value })}
                          className="w-full border border-slate-250/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Endereço da Clínica</label>
                      <input 
                        type="text" 
                        value={settingsForm.address} 
                        onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full border border-slate-250/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">WhatsApp Principal</label>
                        <input 
                          type="text" 
                          value={settingsForm.phone} 
                          onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                          className="w-full border border-slate-250/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">E-mail Comercial</label>
                        <input 
                          type="email" 
                          value={settingsForm.email} 
                          onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full border border-slate-250/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-xl text-slate-650"><Bell className="w-4 h-4" /></div>
                        <div>
                          <p className="font-bold text-xs text-slate-800">Confirmação de Agenda por WhatsApp</p>
                          <p className="text-[10px] text-slate-450">Enviar lembretes contendo link de confirmação automática.</p>
                        </div>
                      </div>
                      <div 
                        onClick={() => {
                          const nextVal = !settingsForm.reminders;
                          setSettingsForm({ ...settingsForm, reminders: nextVal });
                          addToast(nextVal ? 'Lembretes automáticos ativos.' : 'Lembretes automáticos desligados.', 'info');
                        }}
                        className={`w-12 h-6.5 rounded-full relative cursor-pointer transition-all duration-300 p-0.5 ${settingsForm.reminders ? 'bg-slate-900' : 'bg-slate-250'}`}
                      >
                        <div className={`w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition-all duration-300 ${settingsForm.reminders ? 'translate-x-5.5' : 'translate-x-0'}`}></div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit" 
                        className="bg-slate-900 border border-slate-950 text-white px-5 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all text-xs"
                      >
                        Salvar Configurações
                      </button>
                    </div>
                  </form>

                  {/* Alterar Senha de Acesso */}
                  <form onSubmit={handleChangePassword} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2"><KeyRound className="w-4 h-4 text-amber-600" /> Segurança Administrativa</h3>
                      <p className="text-[11px] text-slate-450">Altere a senha mestra de acesso ao painel OdontoGestão.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Senha Atual</label>
                        <input 
                          type="password" 
                          required
                          value={secPassword.current}
                          onChange={e => setSecPassword({ ...secPassword, current: e.target.value })}
                          className="w-full border border-slate-250/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Nova Senha</label>
                        <input 
                          type="password" 
                          required
                          value={secPassword.next}
                          onChange={e => setSecPassword({ ...secPassword, next: e.target.value })}
                          className="w-full border border-slate-250/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Confirmar Nova</label>
                        <input 
                          type="password" 
                          required
                          value={secPassword.confirm}
                          onChange={e => setSecPassword({ ...secPassword, confirm: e.target.value })}
                          className="w-full border border-slate-250/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit" 
                        className="bg-amber-600 border border-amber-700 text-white px-5 py-2 rounded-xl font-bold hover:bg-amber-700 transition-all text-xs"
                      >
                        Redefinir Senha
                      </button>
                    </div>
                  </form>

                </div>

              </div>

            </div>
          )}

        </main>
      </div>

      {/* MODAL 1: NOVO AGENDAMENTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-zoom-in border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Novo Agendamento</h3>
                <p className="text-[11px] text-slate-450">Agende a consulta do paciente e vincule o procedimento.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Paciente</label>
                <select 
                  required
                  value={formData.patientId}
                  onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full border border-slate-250/70 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="">Selecione o paciente...</option>
                  {patientsList.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Procedimento Clínico</label>
                <input 
                  type="text" 
                  required 
                  value={formData.procedure} 
                  onChange={(e) => setFormData({...formData, procedure: e.target.value})} 
                  className="w-full border border-slate-250/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium bg-white" 
                  placeholder="Ex: Profilaxia e Raspagem Periodontal" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Horário da Consulta</label>
                  <select
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full border border-slate-250/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-semibold text-slate-700 bg-white"
                  >
                    <option value="">Selecione...</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="10:30">10:30</option>
                    <option value="11:30">11:30</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Data</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.date} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                    className="w-full border border-slate-250/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-semibold text-slate-700 bg-white" 
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-250 transition-colors text-xs">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 px-4 bg-slate-900 border border-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 shadow-sm transition-colors text-xs">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CADASTRO/EDIÇÃO DE PACIENTE */}
      {isPatientModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-zoom-in border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {patientFormData.id ? 'Atualizar Paciente' : 'Cadastro de Paciente'}
                </h3>
                <p className="text-[11px] text-slate-450">Insira as informações de contato do prontuário.</p>
              </div>
              <button onClick={() => setIsPatientModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSavePatient} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  required 
                  value={patientFormData.name} 
                  onChange={(e) => setPatientFormData({...patientFormData, name: e.target.value})} 
                  className="w-full border border-slate-250/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium bg-white" 
                  placeholder="Ex: Carlos Mendes" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Celular / WhatsApp</label>
                <input 
                  type="text" 
                  required 
                  value={patientFormData.phone} 
                  onChange={(e) => setPatientFormData({...patientFormData, phone: e.target.value})} 
                  className="w-full border border-slate-250/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-semibold bg-white" 
                  placeholder="Ex: (44) 99111-2222" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Endereço de E-mail</label>
                <input 
                  type="email" 
                  value={patientFormData.email} 
                  onChange={(e) => setPatientFormData({...patientFormData, email: e.target.value})} 
                  className="w-full border border-slate-250/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium bg-white" 
                  placeholder="Ex: carlos@email.com" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status Cadastral</label>
                <select 
                  value={patientFormData.status}
                  onChange={(e) => setPatientFormData({...patientFormData, status: e.target.value})}
                  className="w-full border border-slate-250/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-semibold text-slate-700 bg-white"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Em Tratamento">Em Tratamento</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsPatientModalOpen(false)} className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-xs">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 px-4 bg-slate-900 border border-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 shadow-sm transition-colors text-xs">
                  {patientFormData.id ? 'Salvar' : 'Cadastrar Paciente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER: EVOLUÇÃO E PRONTUÁRIO CLÍNICO (DESIGN PREMIUM) */}
      {selectedPatientForHistory && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-lg p-6 md:p-8 relative shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in border-l border-slate-150">
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs border border-slate-950 shadow-sm">
                    {selectedPatientForHistory.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{selectedPatientForHistory.name}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">{selectedPatientForHistory.phone} | {selectedPatientForHistory.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPatientForHistory(null)}
                  className="text-slate-400 hover:text-slate-650 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Patient details edit form */}
              <form onSubmit={handleUpdateMedicalFile} className="space-y-5">
                
                {/* Allergies section */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Alergias e Restrições Clínicas</label>
                  <input 
                    type="text"
                    value={selectedPatientForHistory.allergies}
                    onChange={e => setSelectedPatientForHistory({ ...selectedPatientForHistory, allergies: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650 shadow-sm"
                    placeholder="Ex: Paciente alérgico a látex."
                  />
                  <p className="text-[9px] text-slate-400 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Informação vital exibida no ato do planejamento cirúrgico e prescrições.</p>
                </div>

                {/* Medical notes/Anamnesis */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Evolução Clínica & Histórico de Prontuário</label>
                  <textarea 
                    rows="8"
                    value={selectedPatientForHistory.medicalNotes}
                    onChange={e => setSelectedPatientForHistory({ ...selectedPatientForHistory, medicalNotes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650 leading-relaxed shadow-sm"
                    placeholder="Inserir notas clínicas detalhadas sobre o andamento e evolução clínica..."
                  />
                </div>

                {/* Treatments list */}
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Procedimentos Vinculados</label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatientForHistory.treatments?.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-200/50 px-2.5 py-1 rounded-xl text-[10px] font-bold">
                        {t}
                      </span>
                    )) || <span className="text-slate-400 text-xs italic">Nenhum tratamento registrado.</span>}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="border-t border-slate-100 pt-6 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setSelectedPatientForHistory(null)} 
                    className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-xs"
                  >
                    Fechar Prontuário
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2.5 px-4 bg-slate-900 border border-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 shadow-sm transition-colors text-xs flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Gravar Alterações
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default App;
