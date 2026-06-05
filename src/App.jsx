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
    cro: 'PR-12345',
    specialty: 'Implantodontia e Estética',
    email: 'orlando.faraoni@odontofaraoni.com.br',
    password: 'admin'
  });

  // Perfil da Clínica
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Odontologia Faraoni',
    cnpj: '00.000.000/0001-00',
    address: 'Marialva - PR',
    phone: '+55 (44) 99744-3696',
    email: 'contacto@odontofaraoni.com.br',
    reminders: true
  });

  // Lógica de formulários locais
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState(null);
  
  // Custom Toast notification system
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Log de Auditoria / Atividades Recentes
  const [auditLog, setAuditLog] = useState([
    { id: 1, time: '16:15', text: 'Dr. Orlando realizou login no sistema' },
    { id: 2, time: '15:30', text: 'Consulta de Maria Oliveira confirmada' },
    { id: 3, time: '11:00', text: 'Novo paciente Carlos Mendes cadastrado' }
  ]);

  const addAuditLog = (text) => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setAuditLog(prev => [{ id: Date.now(), time, text }, ...prev.slice(0, 7)]);
  };

  // State para os agendamentos dinâmicos
  const [appointments, setAppointments] = useState([
    { id: 1, patientId: 1, patient: 'Maria Oliveira', procedure: 'Limpeza e Profilaxia', time: '09:00', date: '2026-05-22', status: 'Confirmado' },
    { id: 2, patientId: 2, patient: 'João Silva', procedure: 'Avaliação Implante', time: '10:30', date: '2026-05-22', status: 'Pendente' }
  ]);
  
  // Novo agendamento form state
  const [formData, setFormData] = useState({ patientId: '', procedure: '', time: '', date: '2026-06-05' });

  // Lista de Pacientes com Anamnese/Ficha Clínica Completa
  const [patientsList, setPatientsList] = useState([
    { 
      id: 1, 
      name: 'Maria Oliveira', 
      phone: '(44) 99123-4567', 
      email: 'maria.oliveira@email.com', 
      lastVisit: '15/05/2026', 
      nextVisit: '22/05/2026', 
      status: 'Ativo',
      allergies: 'Sem alergias conhecidas',
      medicalNotes: 'Paciente relata leve sensibilidade na região do molar 36. Aplicado selante e orientada profilaxia.',
      treatments: ['Limpeza Periódica', 'Aplicação de Flúor']
    },
    { 
      id: 2, 
      name: 'João Silva', 
      phone: '(44) 99876-5432', 
      email: 'joao.silva@email.com', 
      lastVisit: '10/04/2026', 
      nextVisit: '22/05/2026', 
      status: 'Em Tratamento',
      allergies: 'Alérgico a Penicilina',
      medicalNotes: 'Fase de cicatrização do pino do implante na posição 14. Retorno agendado para avaliar prótese definitiva.',
      treatments: ['Implante Dentário', 'Enxerto Ósseo']
    },
    { 
      id: 3, 
      name: 'Ana Souza', 
      phone: '(44) 99765-4321', 
      email: 'ana.souza@email.com', 
      lastVisit: '05/01/2026', 
      nextVisit: 'Agendar', 
      status: 'Inativo',
      allergies: 'Sem alergias conhecidas',
      medicalNotes: 'Necessita canal no pré-molar 24. Paciente optou por adiar tratamento devido a viagem.',
      treatments: ['Tratamento de Canal']
    },
    { 
      id: 4, 
      name: 'Carlos Mendes', 
      phone: '(44) 99111-2222', 
      email: 'carlos.mendes@email.com', 
      lastVisit: '20/05/2026', 
      nextVisit: '15/06/2026', 
      status: 'Ativo',
      allergies: 'Alérgico a Látex',
      medicalNotes: 'Finalizada faceta estética no dente 11. Paciente muito satisfeito com o resultado estético.',
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
    allergies: 'Sem alergias conhecidas',
    medicalNotes: '',
    treatments: []
  });

  // Configuração temp
  const [settingsForm, setSettingsForm] = useState({ ...clinicInfo });
  const [dentistForm, setDentistForm] = useState({ ...dentistProfile });
  const [secPassword, setSecPassword] = useState({ current: '', next: '', confirm: '' });

  // Busca e Filtros
  const [patientSearch, setPatientSearch] = useState('');
  const [patientStatusFilter, setPatientStatusFilter] = useState('Todos');
  const [agendaSearch, setAgendaSearch] = useState('');
  const [agendaStatusFilter, setAgendaStatusFilter] = useState('Todos');

  // Lógica de Login Simulada com Barra de Progresso
  const handleLogin = (e) => {
    e.preventDefault();
    if (emailInput.toLowerCase() === dentistProfile.email.toLowerCase() && passwordInput === dentistProfile.password) {
      setIsLoggingIn(true);
      setLoadingProgress(0);
      setLoadingText('Autenticando credenciais...');
      
      const intervals = [
        { time: 400, text: 'Carregando painel de controle...', prog: 30 },
        { time: 800, text: 'Sincronizando agenda clínica...', prog: 60 },
        { time: 1300, text: 'Recuperando dados de pacientes...', prog: 90 },
        { time: 1700, text: 'Finalizando conexão segura...', prog: 100 }
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
        addToast(`Bem-vindo de volta, ${dentistProfile.name}!`);
        addAuditLog(`${dentistProfile.name} realizou login no sistema.`);
      }, 1900);
    } else {
      addToast('Credenciais inválidas! Tente admin@odontofaraoni.com.br / admin', 'error');
    }
  };

  // Recuperação de senha simulada
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!resetEmailInput) {
      addToast('Digite o seu e-mail cadastrado!', 'error');
      return;
    }
    setIsLoggingIn(true);
    setLoadingProgress(0);
    setLoadingText('Verificando conta...');
    
    setTimeout(() => {
      setLoadingProgress(50);
      setLoadingText('Gerando código de verificação...');
    }, 600);

    setTimeout(() => {
      setLoadingProgress(100);
      setIsLoggingIn(false);
      addToast(`Instruções de redefinição enviadas para ${resetEmailInput}!`, 'success');
      setResetEmailInput('');
      setAuthView('login');
    }, 1500);
  };

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmailInput('');
    setPasswordInput('');
    addToast('Sessão encerrada com sucesso.', 'info');
  };

  // Novo Agendamento
  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.procedure || !formData.time) {
      addToast('Por favor, preencha todos os campos do agendamento!', 'error');
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

    addAuditLog(`Consulta marcada para ${selectedPatient.name} às ${formData.time}`);
    setFormData({ patientId: '', procedure: '', time: '', date: '2026-06-05' });
    setIsModalOpen(false);
    addToast('Agendamento salvo com sucesso!');
  };

  // Alterar Status Consulta
  const handleToggleStatus = (apptId) => {
    setAppointments(prev => prev.map(appt => {
      if (appt.id === apptId) {
        const nextStatus = appt.status === 'Confirmado' ? 'Pendente' : appt.status === 'Pendente' ? 'Concluído' : 'Confirmado';
        addAuditLog(`Consulta de ${appt.patient} alterada para ${nextStatus}`);
        addToast(`Consulta de ${appt.patient} marcada como: ${nextStatus}`, 'info');
        return { ...appt, status: nextStatus };
      }
      return appt;
    }));
  };

  // Cancelar Consulta
  const handleDeleteAppointment = (apptId) => {
    const appt = appointments.find(a => a.id === apptId);
    setAppointments(prev => prev.filter(a => a.id !== apptId));
    addAuditLog(`Consulta cancelada para ${appt?.patient || 'Paciente'}`);
    addToast('Agendamento cancelado com sucesso.', 'info');
  };

  // Novo Paciente / Editar Paciente
  const handleSavePatient = (e) => {
    e.preventDefault();
    if (!patientFormData.name || !patientFormData.phone) {
      addToast('Nome completo e telefone são obrigatórios!', 'error');
      return;
    }

    if (patientFormData.id) {
      // Editar
      setPatientsList(prev => prev.map(p => p.id === patientFormData.id ? { ...p, ...patientFormData } : p));
      setAppointments(prev => prev.map(a => a.patientId === patientFormData.id ? { ...a, patient: patientFormData.name } : a));
      addAuditLog(`Ficha cadastral de ${patientFormData.name} editada.`);
      addToast('Cadastro de paciente atualizado!');
    } else {
      // Cadastrar
      const newPatient = {
        ...patientFormData,
        id: Date.now(),
        lastVisit: 'Hoje',
        nextVisit: 'Agendar',
        treatments: patientFormData.treatments.length > 0 ? patientFormData.treatments : ['Avaliação Geral']
      };
      setPatientsList(prev => [...prev, newPatient]);
      addAuditLog(`Novo paciente cadastrado: ${patientFormData.name}`);
      addToast('Novo paciente cadastrado com sucesso!');
    }

    setPatientFormData({ 
      id: null, name: '', phone: '', email: '', status: 'Ativo', 
      allergies: 'Sem alergias conhecidas', medicalNotes: '', treatments: [] 
    });
    setIsPatientModalOpen(false);
  };

  const handleEditPatient = (patient) => {
    setPatientFormData(patient);
    setIsPatientModalOpen(true);
  };

  const handleDeletePatient = (patientId) => {
    const p = patientsList.find(p => p.id === patientId);
    if (window.confirm(`Deseja realmente excluir ${p?.name}? Isso removerá a ficha clínica.`)) {
      setPatientsList(prev => prev.filter(p => p.id !== patientId));
      addAuditLog(`Paciente ${p?.name} removido do sistema.`);
      addToast('Paciente excluído do sistema.', 'info');
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

    addAuditLog(`Ficha médica de ${selectedPatientForHistory.name} foi atualizada.`);
    addToast('Ficha clínica salva com sucesso!');
    setSelectedPatientForHistory(null);
  };

  // Salvar Perfil da Clínica
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setClinicInfo({ ...settingsForm });
    addAuditLog('Alteração realizada nas configurações da clínica.');
    addToast('Configurações da clínica atualizadas!');
  };

  // Salvar Configuração do Profissional
  const handleSaveDentistProfile = (e) => {
    e.preventDefault();
    setDentistProfile({ ...dentistForm });
    addAuditLog('Perfil do profissional atualizado.');
    addToast('Perfil profissional atualizado com sucesso!');
  };

  // Alterar Senha
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (secPassword.current !== dentistProfile.password) {
      addToast('Senha atual incorreta!', 'error');
      return;
    }
    if (secPassword.next !== secPassword.confirm) {
      addToast('A nova senha e a confirmação não conferem!', 'error');
      return;
    }
    if (!secPassword.next) {
      addToast('A nova senha não pode ser em branco!', 'error');
      return;
    }

    setDentistProfile(prev => ({ ...prev, password: secPassword.next }));
    setSecPassword({ current: '', next: '', confirm: '' });
    addAuditLog('Senha do administrador alterada com sucesso.');
    addToast('Senha alterada com sucesso!');
  };

  // Estatísticas Dinâmicas
  const stats = [
    { 
      label: 'Consultas Hoje', 
      value: appointments.filter(a => a.status !== 'Concluído').length.toString(), 
      icon: <Clock className="w-5.5 h-5.5 text-sky-600" />,
      bg: 'bg-sky-50',
      border: 'border-sky-100/60'
    },
    { 
      label: 'Pacientes Cadastrados', 
      value: patientsList.length.toString(), 
      icon: <Users className="w-5.5 h-5.5 text-teal-600" />,
      bg: 'bg-teal-50',
      border: 'border-teal-100/60'
    },
    { 
      label: 'Consultas Concluídas', 
      value: appointments.filter(a => a.status === 'Concluído').length.toString(), 
      icon: <Check className="w-5.5 h-5.5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100/60'
    },
  ];

  // Cálculo da taxa de conclusão do dia
  const completedRate = appointments.length > 0 
    ? Math.round((appointments.filter(a => a.status === 'Concluído').length / appointments.length) * 100) 
    : 0;

  // Filtragens
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

  // Time slots para Agenda
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
    <nav className="space-y-2">
      <button 
        onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 font-semibold text-sm ${activeTab === 'dashboard' ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-300 hover:bg-slate-850 hover:text-white'}`}
      >
        <ClipboardList className="w-5 h-5 text-sky-400" /> Dashboard
      </button>
      <button 
        onClick={() => {setActiveTab('agenda'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 font-semibold text-sm ${activeTab === 'agenda' ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-300 hover:bg-slate-850 hover:text-white'}`}
      >
        <Calendar className="w-5 h-5 text-teal-400" /> Agenda
      </button>
      <button 
        onClick={() => {setActiveTab('pacientes'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 font-semibold text-sm ${activeTab === 'pacientes' ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-300 hover:bg-slate-850 hover:text-white'}`}
      >
        <Users className="w-5 h-5 text-indigo-400" /> Pacientes
      </button>
      <button 
        onClick={() => {setActiveTab('definicoes'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 font-semibold text-sm ${activeTab === 'definicoes' ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-300 hover:bg-slate-850 hover:text-white'}`}
      >
        <Settings className="w-5 h-5 text-amber-400" /> Definições
      </button>
    </nav>
  );

  // TELA DE LOADING GLOBAL (LOGIN/TRAMITES)
  if (isLoggingIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white animate-fade-in">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-2xl animate-pulse-ring">
              <Stethoscope className="w-10 h-10" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-teal-300 bg-clip-text text-transparent">OdontoGestão</h2>
            <p className="text-sm text-slate-400 font-medium">{loadingText}</p>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{loadingProgress}% Concluído</span>
        </div>
      </div>
    );
  }

  // TELA DE AUTENTICAÇÃO (LOGIN & ESQUECI A SENHA)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
        
        {/* Decorative background blurs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-sky-500/20">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">OdontoGestão</h2>
            <p className="mt-1 text-sm text-slate-400 font-medium">Painel Administrativo da **{clinicInfo.name}**</p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 p-1">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 space-y-6">
            
            {/* VIEW: LOGIN */}
            {authView === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">E-mail de Acesso</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="email" 
                      required
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder="seu.email@clinica.com"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Senha</label>
                    <button 
                      type="button" 
                      onClick={() => setAuthView('forgot-password')} 
                      className="text-xs font-bold text-sky-400 hover:text-sky-300"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-sky-600 to-teal-600 text-white py-3 rounded-xl font-bold hover:from-sky-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/10 border border-sky-550/40"
                  >
                    <ShieldCheck className="w-4.5 h-4.5" /> Acessar Sistema
                  </button>
                </div>

                {/* Helper Tooltip to login easily */}
                <div className="bg-slate-950/50 border border-slate-800/80 p-3 rounded-2xl flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-300">Credenciais de Teste / Demo:</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">E-mail: <code className="text-slate-350">admin@odontofaraoni.com.br</code></p>
                    <p className="text-[10px] text-slate-500">Senha: <code className="text-slate-350">admin</code></p>
                  </div>
                </div>
              </form>
            )}

            {/* VIEW: FORGOT PASSWORD */}
            {authView === 'forgot-password' && (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2"><KeyRound className="w-5 h-5 text-sky-400" /> Recuperar Senha</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Insira seu e-mail cadastrado e enviaremos um link de recuperação contendo as instruções para criar uma nova senha.</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">E-mail Cadastrado</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="email" 
                      required
                      value={resetEmailInput}
                      onChange={e => setResetEmailInput(e.target.value)}
                      placeholder="digite@seuemail.com"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    type="submit" 
                    className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-500 transition-all flex items-center justify-center gap-2"
                  >
                    Enviar Link de Redefinição
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAuthView('login')}
                    className="w-full border border-slate-800 text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-850 hover:text-white transition-all text-xs"
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

  // TELA DO SISTEMA AUTENTICADO
  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans antialiased text-slate-850">
      
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[100] space-y-3 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 pointer-events-auto transform translate-y-0 transition-all duration-300 animate-slide-in ${
              t.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' :
              t.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-800' :
              'bg-emerald-50 border-emerald-100 text-emerald-800'
            }`}
          >
            {t.type === 'error' ? <AlertCircle className="w-5.5 h-5.5 shrink-0 text-rose-500" /> :
             t.type === 'info' ? <Info className="w-5.5 h-5.5 shrink-0 text-blue-500" /> :
             <CheckCircle2 className="w-5.5 h-5.5 shrink-0 text-emerald-500" />
            }
            <div className="text-sm font-medium">{t.message}</div>
          </div>
        ))}
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-100 p-6 border-r border-slate-800 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-sky-500 p-2 rounded-xl text-white shadow-lg shadow-sky-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-sky-400 to-teal-300 bg-clip-text text-transparent">OdontoGestão</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Painel Administrador</p>
          </div>
        </div>
        
        <div className="flex-1">
          <NavContent />
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-450 to-teal-450 flex items-center justify-center text-slate-900 font-bold text-xs">
              {dentistProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-100 truncate w-32">{dentistProfile.name}</p>
              <p className="text-[10px] text-sky-400 font-medium truncate">{dentistProfile.cro}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-slate-800 hover:bg-rose-950/20 text-slate-300 hover:text-rose-400 py-2 rounded-xl text-xs font-bold transition-all border border-slate-800 hover:border-rose-900/30"
          >
            Sair do Painel
          </button>
        </div>
      </div>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="w-72 max-w-[85vw] h-full bg-slate-900 text-white p-6 flex flex-col transition-all duration-300 relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-2">
                <div className="bg-sky-500 p-1.5 rounded-lg text-white">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-sky-400">OdontoGestão</h2>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <NavContent />
            </div>
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-slate-900 font-bold text-sm">
                  {dentistProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-white truncate w-36">{dentistProfile.name}</p>
                  <p className="text-[10px] text-sky-400">{dentistProfile.cro}</p>
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
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 z-30 shadow-sm shadow-slate-100/20">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-800">
                {activeTab === 'dashboard' && 'Visão Geral'}
                {activeTab === 'agenda' && 'Sua Agenda'}
                {activeTab === 'pacientes' && 'Gestão de Pacientes'}
                {activeTab === 'definicoes' && 'Configurações do Sistema'}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                {activeTab === 'dashboard' && `Bem-vindo, ${dentistProfile.name} | Gestão inteligente das atividades clínicas.`}
                {activeTab === 'agenda' && 'Gerencie e organize sua rotina odontológica diária.'}
                {activeTab === 'pacientes' && 'Cadastre, gerencie prontuários e faça o histórico de anamnese.'}
                {activeTab === 'definicoes' && 'Atualize dados do seu consultório e edite seu perfil profissional.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setPatientFormData({ 
                  id: null, name: '', phone: '', email: '', status: 'Ativo', 
                  allergies: 'Sem alergias conhecidas', medicalNotes: '', treatments: [] 
                });
                setIsPatientModalOpen(true);
              }} 
              className="bg-white text-slate-700 border border-slate-200 p-2 md:px-4 md:py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-all text-xs font-bold shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-sky-600" /> 
              <span className="hidden lg:inline">Novo Paciente</span>
            </button>

            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-sky-600 text-white p-2 md:px-4 md:py-2.5 rounded-xl flex items-center gap-2 hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/10 transition-all text-xs font-bold shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> 
              <span>Novo Agendamento</span>
            </button>
          </div>
        </header>

        {/* Dynamic content scrollable area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                    </div>
                    <div className={`p-3.5 ${s.bg} rounded-2xl shadow-inner`}>
                      {s.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Agenda Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">Próximos Atendimentos do Dia</h3>
                        <p className="text-xs text-slate-400">Total de agendamentos agendados para hoje.</p>
                      </div>
                      <button onClick={() => setActiveTab('agenda')} className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1">
                        Ver Agenda Completa <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
                      <table className="w-full text-left min-w-[500px]">
                        <thead>
                          <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 pb-3">
                            <th className="pb-3">Paciente</th>
                            <th className="pb-3">Procedimento</th>
                            <th className="pb-3">Horário</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.slice(0, 4).map((appt) => (
                            <tr key={appt.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/40 transition-colors">
                              <td className="py-4 font-semibold text-slate-800 text-sm">{appt.patient}</td>
                              <td className="py-4 text-sm text-slate-600 font-medium">{appt.procedure}</td>
                              <td className="py-4 text-sm text-slate-500 font-semibold">{appt.time}</td>
                              <td className="py-4">
                                <button 
                                  onClick={() => handleToggleStatus(appt.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition-all hover:scale-105 active:scale-95 ${
                                    appt.status === 'Confirmado' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' :
                                    appt.status === 'Concluído' ? 'text-slate-650 bg-slate-100 border border-slate-200' :
                                    'text-amber-700 bg-amber-50 border border-amber-100'
                                  }`}
                                >
                                  {appt.status}
                                </button>
                              </td>
                              <td className="py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button 
                                    onClick={() => handleToggleStatus(appt.id)} 
                                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                    title="Marcar como Concluído"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteAppointment(appt.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                    title="Cancelar Consulta"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {appointments.length === 0 && (
                            <tr>
                              <td colSpan="5" className="py-8 text-center text-slate-400 text-sm">
                                <Info className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                                Nenhum atendimento agendado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Progress Wheel & Logs */}
                <div className="space-y-6">
                  
                  {/* Occupancy Progress */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6">
                    <h3 className="font-bold text-slate-800 text-sm mb-4">Progresso Geral do Dia</h3>
                    
                    <div className="flex items-center gap-5">
                      <div className="relative flex items-center justify-center shrink-0">
                        {/* Simulated ring graph */}
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle cx="40" cy="40" r="34" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                          <circle cx="40" cy="40" r="34" stroke="#0284c7" strokeWidth="8" fill="transparent"
                            strokeDasharray={2 * Math.PI * 34}
                            strokeDashoffset={2 * Math.PI * 34 * (1 - completedRate / 100)}
                          />
                        </svg>
                        <span className="absolute text-sm font-extrabold text-slate-800">{completedRate}%</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-650">Consultas Finalizadas</p>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {appointments.filter(a => a.status === 'Concluído').length} de {appointments.length} consultas marcadas para hoje concluídas.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logs de Auditoria */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6">
                    <h3 className="font-bold text-slate-800 text-sm mb-4">Atividades Recentes</h3>
                    
                    <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                      {auditLog.map((log) => (
                        <div key={log.id} className="flex gap-3 text-xs leading-normal">
                          <span className="font-bold text-slate-400">{log.time}</span>
                          <span className="text-slate-600 font-medium">{log.text}</span>
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 space-y-6 animate-fade-in">
              
              {/* Header and Controls */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-slate-50 pb-5">
                <div>
                  <h3 className="font-bold text-slate-850 text-base">Agenda Diária</h3>
                  <p className="text-xs text-slate-400">Exibindo horários de hoje (22 de Maio de 2026)</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative shrink-0">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar consulta..." 
                      value={agendaSearch}
                      onChange={e => setAgendaSearch(e.target.value)}
                      className="pl-9 pr-4 py-1.5 w-44 md:w-56 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" 
                    />
                  </div>

                  <select 
                    value={agendaStatusFilter} 
                    onChange={e => setAgendaStatusFilter(e.target.value)}
                    className="py-1.5 px-3 border border-slate-200 text-sm rounded-xl outline-none focus:border-sky-500 text-slate-600 font-medium"
                  >
                    <option value="Todos">Todos os Status</option>
                    <option value="Confirmado">Confirmados</option>
                    <option value="Pendente">Pendentes</option>
                    <option value="Concluído">Concluídos</option>
                  </select>
                </div>
              </div>

              {/* Time Slots Layout */}
              <div className="space-y-3 max-w-4xl">
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
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-xl border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                          <div className="w-16 font-bold text-slate-400 text-sm flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {slot.time}
                          </div>
                          <div className="flex-1 text-slate-400 text-xs italic font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            Horário Vago
                          </div>
                          <button 
                            onClick={() => {
                              setFormData({ ...formData, time: slot.time });
                              setIsModalOpen(true);
                            }}
                            className="text-xs text-sky-600 hover:text-sky-700 font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:shadow-sm transition-all"
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
                          isConcluido ? 'border-slate-200 bg-slate-50/50 opacity-80' :
                          isConfirmado ? 'border-sky-100 bg-sky-50/20' : 
                          'border-amber-100 bg-amber-50/20'
                        }`}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          isConcluido ? 'bg-slate-450' :
                          isConfirmado ? 'bg-sky-500' : 
                          'bg-amber-500'
                        }`}></div>

                        <div className="w-16 font-bold text-slate-800 text-sm flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {appt.time}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm sm:text-base">{appt.patient}</p>
                          <p className={`text-xs font-semibold ${isConfirmado ? 'text-sky-700' : isConcluido ? 'text-slate-500' : 'text-amber-700'}`}>
                            {appt.procedure}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                            isConfirmado ? 'text-sky-700 bg-sky-50 border-sky-100' :
                            isConcluido ? 'text-slate-650 bg-slate-100 border-slate-250' :
                            'text-amber-700 bg-amber-50 border-amber-100'
                          }`}>
                            {appt.status}
                          </span>

                          <div className="flex items-center gap-1 border-l border-slate-200/80 pl-3">
                            <button 
                              onClick={() => handleToggleStatus(appt.id)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                              title="Marcar Status"
                            >
                              <Check className="w-4.5 h-4.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAppointment(appt.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              title="Cancelar Consulta"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 space-y-6 animate-fade-in">
              
              {/* Header and Controls */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar paciente por nome, celular ou e-mail..." 
                    value={patientSearch}
                    onChange={e => setPatientSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm shadow-sm" 
                  />
                </div>

                <div className="flex gap-3">
                  <select 
                    value={patientStatusFilter} 
                    onChange={e => setPatientStatusFilter(e.target.value)}
                    className="py-2 px-4 border border-slate-200 text-sm rounded-xl outline-none focus:border-sky-500 text-slate-600 font-semibold shadow-sm"
                  >
                    <option value="Todos">Todos os Status</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Em Tratamento">Em Tratamento</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              {/* Patients Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left min-w-[750px]">
                  <thead>
                    <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100 bg-slate-50/60">
                      <th className="p-4">Paciente</th>
                      <th className="p-4">Contato</th>
                      <th className="p-4">Última Visita</th>
                      <th className="p-4">Próxima Visita</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Ficha Clínica / Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-all">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                              {patient.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{patient.name}</p>
                              <p className="text-xs text-slate-400 font-medium">{patient.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-650 text-sm font-semibold">{patient.phone}</td>
                        <td className="p-4 text-slate-500 text-sm font-medium">{patient.lastVisit}</td>
                        <td className="p-4">
                          {patient.nextVisit === 'Agendar' ? (
                            <button 
                              onClick={() => {
                                setFormData({ ...formData, patientId: patient.id.toString() });
                                setIsModalOpen(true);
                              }}
                              className="text-[10px] text-sky-600 hover:text-sky-700 font-bold border border-sky-100 bg-sky-50/40 px-2.5 py-1 rounded-lg"
                            >
                              Agendar
                            </button>
                          ) : (
                            <span className="text-slate-600 text-sm font-semibold">{patient.nextVisit}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border 
                            ${patient.status === 'Ativo' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 
                              patient.status === 'Em Tratamento' ? 'text-sky-700 bg-sky-50 border-sky-100' : 
                              'text-slate-650 bg-slate-100 border-slate-200'}`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => setSelectedPatientForHistory(patient)}
                              className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 hover:border-sky-100"
                              title="Visualizar Ficha Médica"
                            >
                              <FileText className="w-3.5 h-3.5" /> Ficha
                            </button>
                            
                            <button 
                              onClick={() => handleEditPatient(patient)}
                              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors border border-transparent hover:border-sky-100"
                              title="Editar Paciente"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeletePatient(patient.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                              title="Excluir Paciente"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPatients.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                          <Info className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                          Nenhum paciente cadastrado correspondente aos filtros.
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
            <div className="space-y-6 animate-fade-in">
              
              {/* Profile Config grid */}
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Configuration Tabs navigation */}
                <div className="col-span-1 space-y-2">
                  <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2 px-2">Opções de Sistema</p>
                    <button className="w-full text-left p-3 rounded-xl bg-sky-50 text-sky-700 font-bold border border-sky-100/60 shadow-sm flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" /> Perfil Clínico & Geral
                    </button>
                    <button 
                      onClick={() => addToast('Notificações automatizadas configuradas no perfil!', 'info')} 
                      className="w-full text-left p-3 rounded-xl text-slate-650 hover:bg-slate-50 hover:text-slate-800 font-semibold transition-colors flex items-center gap-2"
                    >
                      <Bell className="w-4 h-4" /> Lembretes SMS/Whats
                    </button>
                    <button 
                      onClick={() => addToast('Integração de pagamento em andamento.', 'info')} 
                      className="w-full text-left p-3 rounded-xl text-slate-650 hover:bg-slate-50 hover:text-slate-800 font-semibold transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> Cobrança & Assinatura
                    </button>
                  </div>
                </div>

                {/* Main Config Forms */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                  
                  {/* Perfil Profissional (Dentista) */}
                  <form onSubmit={handleSaveDentistProfile} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><Lock className="w-4.5 h-4.5 text-sky-600" /> Perfil Profissional</h3>
                      <p className="text-xs text-slate-400">Edite as informações profissionais que aparecerão nas fichas dos pacientes.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">Nome Completo</label>
                        <input 
                          type="text" 
                          value={dentistForm.name} 
                          onChange={e => setDentistForm({ ...dentistForm, name: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">CRO / Inscrição</label>
                        <input 
                          type="text" 
                          value={dentistForm.cro} 
                          onChange={e => setDentistForm({ ...dentistForm, cro: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">E-mail Profissional</label>
                        <input 
                          type="email" 
                          value={dentistForm.email} 
                          onChange={e => setDentistForm({ ...dentistForm, email: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">Especialidade Principal</label>
                        <input 
                          type="text" 
                          value={dentistForm.specialty} 
                          onChange={e => setDentistForm({ ...dentistForm, specialty: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit" 
                        className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-sky-700 transition-all text-xs flex items-center gap-1.5 shadow-sm shadow-sky-600/15"
                      >
                        <Save className="w-4 h-4" /> Salvar Perfil Profissional
                      </button>
                    </div>
                  </form>

                  {/* Perfil da Clínica */}
                  <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-teal-600" /> Informações Clínicas</h3>
                      <p className="text-xs text-slate-400">Edite as informações cadastrais e detalhes de faturamento da clínica.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">Nome Comercial</label>
                        <input 
                          type="text" 
                          value={settingsForm.name} 
                          onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">CNPJ / Cadastro Nacional</label>
                        <input 
                          type="text" 
                          value={settingsForm.cnpj} 
                          onChange={e => setSettingsForm({ ...settingsForm, cnpj: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">Endereço Completo</label>
                      <input 
                        type="text" 
                        value={settingsForm.address} 
                        onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">Contato WhatsApp Principal</label>
                        <input 
                          type="text" 
                          value={settingsForm.phone} 
                          onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">E-mail de Notificações</label>
                        <input 
                          type="email" 
                          value={settingsForm.email} 
                          onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-sky-100/60 p-2 rounded-xl text-sky-600"><Bell className="w-5 h-5" /></div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">Mensagens Automáticas</p>
                          <p className="text-xs text-slate-400">Enviar lembrete de consulta 24 horas antes</p>
                        </div>
                      </div>
                      <div 
                        onClick={() => {
                          const nextVal = !settingsForm.reminders;
                          setSettingsForm({ ...settingsForm, reminders: nextVal });
                          addToast(nextVal ? 'Lembretes automáticos ativados!' : 'Lembretes automáticos desativados.', 'info');
                        }}
                        className={`w-12 h-6.5 rounded-full relative cursor-pointer transition-all duration-300 p-0.5 ${settingsForm.reminders ? 'bg-sky-600' : 'bg-slate-300'}`}
                      >
                        <div className={`w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition-all duration-300 ${settingsForm.reminders ? 'translate-x-5.5' : 'translate-x-0'}`}></div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit" 
                        className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-sky-700 transition-all text-xs flex items-center gap-1.5 shadow-sm shadow-sky-600/15"
                      >
                        <Save className="w-4 h-4" /> Salvar Informações Clínicas
                      </button>
                    </div>
                  </form>

                  {/* Alterar Senha de Acesso */}
                  <form onSubmit={handleChangePassword} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><KeyRound className="w-4.5 h-4.5 text-amber-600" /> Segurança da Conta</h3>
                      <p className="text-xs text-slate-400">Altere a senha mestra de acesso administrativo do seu OdontoGestão.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">Senha Atual</label>
                        <input 
                          type="password" 
                          required
                          value={secPassword.current}
                          onChange={e => setSecPassword({ ...secPassword, current: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">Nova Senha</label>
                        <input 
                          type="password" 
                          required
                          value={secPassword.next}
                          onChange={e => setSecPassword({ ...secPassword, next: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">Confirmar Nova</label>
                        <input 
                          type="password" 
                          required
                          value={secPassword.confirm}
                          onChange={e => setSecPassword({ ...secPassword, confirm: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit" 
                        className="bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-amber-700 transition-all text-xs flex items-center gap-1.5 shadow-sm shadow-amber-600/15"
                      >
                        <RefreshCw className="w-4 h-4" /> Alterar Senha Mestra
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-zoom-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-850">Novo Agendamento</h3>
                <p className="text-xs text-slate-400">Selecione o paciente e defina o horário e data da consulta.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Paciente</label>
                <select 
                  required
                  value={formData.patientId}
                  onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all text-sm font-semibold text-slate-700"
                >
                  <option value="">Selecione o paciente...</option>
                  {patientsList.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Procedimento / Tratamento</label>
                <input 
                  type="text" 
                  required 
                  value={formData.procedure} 
                  onChange={(e) => setFormData({...formData, procedure: e.target.value})} 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all font-medium" 
                  placeholder="Ex: Limpeza e Profilaxia" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Horário</label>
                  <select
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all font-semibold text-slate-700"
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
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Data da Consulta</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.date} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all font-semibold text-slate-700" 
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors text-sm">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-3 px-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 shadow-md shadow-sky-600/10 transition-colors text-sm">
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CADASTRO/EDIÇÃO DE PACIENTE */}
      {isPatientModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-zoom-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-850">
                  {patientFormData.id ? 'Editar Cadastro de Paciente' : 'Novo Cadastro de Paciente'}
                </h3>
                <p className="text-xs text-slate-400">Insira as informações de contato do novo paciente.</p>
              </div>
              <button onClick={() => setIsPatientModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSavePatient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  required 
                  value={patientFormData.name} 
                  onChange={(e) => setPatientFormData({...patientFormData, name: e.target.value})} 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all font-medium" 
                  placeholder="Ex: Carlos Mendes" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Telefone Comercial / WhatsApp</label>
                <input 
                  type="text" 
                  required 
                  value={patientFormData.phone} 
                  onChange={(e) => setPatientFormData({...patientFormData, phone: e.target.value})} 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all font-semibold" 
                  placeholder="Ex: (44) 99111-2222" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">E-mail Principal</label>
                <input 
                  type="email" 
                  value={patientFormData.email} 
                  onChange={(e) => setPatientFormData({...patientFormData, email: e.target.value})} 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all font-medium" 
                  placeholder="Ex: carlos@email.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Status Cadastral</label>
                <select 
                  value={patientFormData.status}
                  onChange={(e) => setPatientFormData({...patientFormData, status: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all font-semibold text-slate-700"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Em Tratamento">Em Tratamento</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsPatientModalOpen(false)} className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors text-sm">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-3 px-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 shadow-md shadow-sky-600/10 transition-colors text-sm">
                  {patientFormData.id ? 'Salvar Alterações' : 'Cadastrar Paciente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER / MODAL: FICHA MÉDICA DETALHADA E ANAMNESE */}
      {selectedPatientForHistory && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-lg p-6 md:p-8 relative shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in">
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                    {selectedPatientForHistory.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedPatientForHistory.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold">{selectedPatientForHistory.phone} | {selectedPatientForHistory.email}</p>
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
              <form onSubmit={handleUpdateMedicalFile} className="space-y-6">
                
                {/* Allergies section */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Alergias e Restrições Clínicas</label>
                  <input 
                    type="text"
                    value={selectedPatientForHistory.allergies}
                    onChange={e => setSelectedPatientForHistory({ ...selectedPatientForHistory, allergies: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                    placeholder="Ex: Alergia a Penicilina, Látex..."
                  />
                  <p className="text-[10px] text-slate-400 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Informações críticas para prescrição medicamentosa e procedimentos.</p>
                </div>

                {/* Medical notes/Anamnesis */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Anotações Clínicas & Histórico de Prontuário</label>
                  <textarea 
                    rows="6"
                    value={selectedPatientForHistory.medicalNotes}
                    onChange={e => setSelectedPatientForHistory({ ...selectedPatientForHistory, medicalNotes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-3 text-sm font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-sky-500 leading-relaxed"
                    placeholder="Ex: Histórico do dente tratado, canal, facetas, observações de retornos..."
                  />
                </div>

                {/* Simulated Treatments list */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Tratamentos Vinculados</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatientForHistory.treatments?.map((t, idx) => (
                      <span key={idx} className="bg-sky-50 text-sky-700 border border-sky-100/60 px-3 py-1 rounded-xl text-xs font-bold">
                        {t}
                      </span>
                    )) || <span className="text-slate-400 text-xs italic">Nenhum tratamento associado.</span>}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="border-t border-slate-100 pt-6 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setSelectedPatientForHistory(null)} 
                    className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors text-sm"
                  >
                    Fechar Ficha
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 px-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 shadow-md shadow-sky-600/10 transition-colors text-sm flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4.5 h-4.5" /> Salvar Prontuário
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
