import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, ClipboardList, Settings, PlusCircle, Clock, Menu, X, 
  Search, Filter, MoreVertical, Bell, Save, Phone, Mail, Check, 
  Trash2, Edit, AlertCircle, FileText, ArrowRight, UserPlus, Info, CheckCircle2,
  Lock, Eye, EyeOff, ShieldCheck, Stethoscope, ChevronRight, RefreshCw, KeyRound, Sparkles,
  UserCheck, UserMinus, ShieldAlert, Wifi, WifiOff, QrCode, CreditCard, Download, ExternalLink
} from 'lucide-react';

const App = () => {
  // Autenticação & Role-Based States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // { id, name, email, role, cro, specialty, description }
  const [authView, setAuthView] = useState('login'); // 'login' | 'forgot-password'
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Autenticando...');
  const [showPassword, setShowPassword] = useState(false);

  // Form Inputs de Autenticação
  const [emailInput, setEmailInput] = useState('admin@odontofaraoni.com.br');
  const [passwordInput, setPasswordInput] = useState('admin');
  const [resetEmailInput, setResetEmailInput] = useState('');

  // Perfil da Clínica
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Odontologia Faraoni',
    cnpj: '12.345.678/0001-90',
    address: 'Marialva - PR',
    phone: '+55 (44) 99744-3696',
    email: 'contato@odontofaraoni.com.br',
    reminders: true
  });

  // Lista dinâmica de Dentistas (Profissionais da Clínica)
  const [dentistsList, setDentistsList] = useState([
    { 
      id: 1, 
      name: 'Dr. Orlando Faraoni', 
      cro: 'CRO-PR 12345', 
      specialty: 'Implantodontia e Estética Dental', 
      email: 'orlando.faraoni@odontofaraoni.com.br', 
      password: 'admin', 
      phone: '(44) 99744-3696', 
      description: 'Especialista em reabilitações orais complexas, cirurgias guiadas e implantes cone morse.' 
    },
    { 
      id: 2, 
      name: 'Dra. Beatriz Mendes', 
      cro: 'CRO-PR 67890', 
      specialty: 'Ortodontia Estética e Pediátrica', 
      email: 'beatriz.mendes@odontofaraoni.com.br', 
      password: 'admin', 
      phone: '(44) 99111-2222', 
      description: 'Especialista em alinhadores invisíveis Invisalign e ortopedia funcional dos maxilares.' 
    }
  ]);

  // Master Admin login fixo
  const masterAdmin = {
    id: 'master',
    name: 'Administrador Master',
    email: 'admin@odontofaraoni.com.br',
    password: 'admin',
    role: 'admin_master'
  };

  // Lógica de navegação
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isDentistModalOpen, setIsDentistModalOpen] = useState(false);
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState(null);
  
  // Sub-abas de Definições
  const [settingsSubTab, setSettingsSubTab] = useState('clinic'); // 'clinic' | 'notifications' | 'billing'
  
  // Filtro de profissional na visão geral
  const [selectedDentistFilter, setSelectedDentistFilter] = useState('Todos');

  // Custom Toast notification system
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
    { id: 1, patientId: 1, patient: 'Maria Oliveira', dentistId: 1, dentistName: 'Dr. Orlando Faraoni', procedure: 'Profilaxia e Terapia Periodontal', time: '09:00', date: '2026-05-22', status: 'Confirmado' },
    { id: 2, patientId: 2, patient: 'João Silva', dentistId: 2, dentistName: 'Dra. Beatriz Mendes', procedure: 'Instalação de Implante Osseointegrado', time: '10:30', date: '2026-05-22', status: 'Pendente' }
  ]);
  
  // Novo agendamento form state
  const [formData, setFormData] = useState({ patientId: '', dentistId: '', procedure: '', time: '', date: '2026-06-05' });

  // Lista de Pacientes
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

  // CONFIGURAÇÕES AVANÇADAS: LEMBRETES E WHATSAPP (ESTADO REAL)
  const [whatsSettings, setWhatsSettings] = useState({
    status: 'connected', // 'connected' | 'disconnected' | 'connecting'
    instanceName: 'evolution_faraoni_instance',
    webhookUrl: 'https://api.odontofaraoni.com.br/webhooks/whatsapp',
    whatsappTemplate: 'Olá, [PACIENTE]! Confirmamos sua consulta odontológica na [CLINICA] em [DATA] às [HORA] com o [DENTISTA]. Caso precise reagendar, responda esta mensagem.',
    smsTemplate: 'Lembrete: Consulta amanha as [HORA] na [CLINICA] com [DENTISTA].',
    send24h: true,
    sendInstant: true,
    sendPostVisit: true,
    testPhone: ''
  });

  // CONFIGURAÇÕES AVANÇADAS: COBRANÇA E FATURAMENTO (ESTADO REAL)
  const [billingSettings, setBillingSettings] = useState({
    gateway: 'stripe', // 'stripe' | 'asaas' | 'mercadopago'
    publicKey: 'pk_test_mock_key_faraoni_1092',
    secretKey: 'sk_test_mock_secret_998273612',
    pixEnabled: true,
    cardEnabled: true,
    boletoEnabled: false,
    planName: 'OdontoGestão Professional Group',
    planPrice: '199,00',
    nextRenewal: '15/06/2026',
    invoices: [
      { id: 'FT-2026-901', date: '15/05/2026', amount: 'R$ 199,00', status: 'Pago', method: 'Cartão de Crédito' },
      { id: 'FT-2026-804', date: '15/04/2026', amount: 'R$ 199,00', status: 'Pago', method: 'Cartão de Crédito' },
      { id: 'FT-2026-702', date: '15/03/2026', amount: 'R$ 199,00', status: 'Pago', method: 'Boleto Bancário' }
    ]
  });

  // Temp form para paciente
  const [patientFormData, setPatientFormData] = useState({ 
    id: null, name: '', phone: '', email: '', status: 'Ativo', 
    allergies: 'Sem alergias sistêmicas relatadas', medicalNotes: '', treatments: [] 
  });

  // Temp form para dentista
  const [dentistFormData, setDentistFormData] = useState({
    id: null, name: '', cro: '', specialty: '', email: '', password: '', phone: '', description: ''
  });

  // Configuração temporária de perfil
  const [settingsForm, setSettingsForm] = useState({ ...clinicInfo });
  const [dentistForm, setDentistForm] = useState({ name: '', cro: '', specialty: '', email: '', password: '', phone: '', description: '' });
  const [secPassword, setSecPassword] = useState({ current: '', next: '', confirm: '' });

  // Busca e Filtros
  const [patientSearch, setPatientSearch] = useState('');
  const [patientStatusFilter, setPatientStatusFilter] = useState('Todos');
  const [agendaSearch, setAgendaSearch] = useState('');
  const [agendaStatusFilter, setAgendaStatusFilter] = useState('Todos');

  // Lógica de Login Multi-usuário
  const handleLogin = (e) => {
    e.preventDefault();
    const normalizedEmail = emailInput.toLowerCase().trim();
    
    // 1. Checa se é Master Admin
    if (normalizedEmail === masterAdmin.email.toLowerCase() && passwordInput === masterAdmin.password) {
      triggerLoginAnimation(masterAdmin);
      return;
    }

    // 2. Checa se é um Dentista cadastrado
    const dentist = dentistsList.find(d => d.email.toLowerCase() === normalizedEmail && d.password === passwordInput);
    if (dentist) {
      triggerLoginAnimation({ ...dentist, role: 'dentist' });
      return;
    }

    addToast('Credenciais de acesso incorretas.', 'error');
  };

  const triggerLoginAnimation = (user) => {
    setIsLoggingIn(true);
    setLoadingProgress(0);
    setLoadingText('Autenticando credenciais...');
    
    const intervals = [
      { time: 350, text: 'Carregando privilégios e permissões...', prog: 40 },
      { time: 750, text: 'Sincronizando agenda e prontuários clínicos...', prog: 75 },
      { time: 1100, text: 'Estruturando painel...', prog: 100 }
    ];

    intervals.forEach((step) => {
      setTimeout(() => {
        setLoadingText(step.text);
        setLoadingProgress(step.prog);
      }, step.time);
    });

    setTimeout(() => {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsLoggingIn(false);
      setDentistForm({ ...user });
      addToast(`Bem-vindo, ${user.name}`);
      addAuditLog(`${user.name} iniciou sessão administrativa.`);
    }, 1400);
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
    setCurrentUser(null);
    setEmailInput('');
    setPasswordInput('');
    setSelectedDentistFilter('Todos');
    setSettingsSubTab('clinic');
    addToast('Sessão encerrada com sucesso.', 'info');
  };

  // Novo Agendamento
  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.procedure || !formData.time || !formData.dentistId) {
      addToast('Preencha todos os campos do agendamento.', 'error');
      return;
    }
    
    const selectedPatient = patientsList.find(p => p.id === parseInt(formData.patientId));
    const selectedDentist = dentistsList.find(d => d.id === parseInt(formData.dentistId));
    if (!selectedPatient || !selectedDentist) return;

    const newAppt = {
      id: Date.now(),
      patientId: selectedPatient.id,
      patient: selectedPatient.name,
      dentistId: selectedDentist.id,
      dentistName: selectedDentist.name,
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

    addAuditLog(`Consulta marcada para ${selectedPatient.name} com ${selectedDentist.name}`);
    setFormData({ patientId: '', dentistId: '', procedure: '', time: '', date: '2026-06-05' });
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
      addToast('Nome completo e telefone são obrigatórios.', 'error');
      return;
    }

    if (patientFormData.id) {
      setPatientsList(prev => prev.map(p => p.id === patientFormData.id ? { ...p, ...patientFormData } : p));
      setAppointments(prev => prev.map(a => a.patientId === patientFormData.id ? { ...a, patient: patientFormData.name } : a));
      addAuditLog(`Cadastro de ${patientFormData.name} atualizado.`);
      addToast('Registro do paciente atualizado.');
    } else {
      const newPatient = {
        ...patientFormData,
        id: Date.now(),
        lastVisit: 'Hoje',
        nextVisit: 'Agendar',
        treatments: patientFormData.treatments.length > 0 ? patientFormData.treatments : ['Avaliação Clínica Inicial']
      };
      setPatientsList(prev => [...prev, newPatient]);
      addAuditLog(`Novo paciente cadastrado: ${patientFormData.name}`);
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
    if (window.confirm(`Remover registros de ${p?.name}?`)) {
      setPatientsList(prev => prev.filter(p => p.id !== patientId));
      addAuditLog(`Paciente ${p?.name} excluído.`);
      addToast('Paciente excluído.', 'info');
      if (selectedPatientForHistory?.id === patientId) {
        setSelectedPatientForHistory(null);
      }
    }
  };

  // CRUD DENTISTAS (Exclusivo do Admin Master)
  const handleSaveDentist = (e) => {
    e.preventDefault();
    if (!dentistFormData.name || !dentistFormData.email || !dentistFormData.cro) {
      addToast('Nome, E-mail e CRO são obrigatórios.', 'error');
      return;
    }

    if (dentistFormData.id) {
      setDentistsList(prev => prev.map(d => d.id === dentistFormData.id ? { ...d, ...dentistFormData } : d));
      setAppointments(prev => prev.map(a => a.dentistId === dentistFormData.id ? { ...a, dentistName: dentistFormData.name } : a));
      addAuditLog(`Cadastro do dentista ${dentistFormData.name} editado pelo Admin.`);
      addToast('Cadastro do profissional atualizado.');
    } else {
      const newDentist = {
        ...dentistFormData,
        id: Date.now(),
        password: dentistFormData.password || 'admin'
      };
      setDentistsList(prev => [...prev, newDentist]);
      addAuditLog(`Novo dentista contratado: ${dentistFormData.name}`);
      addToast('Dentista cadastrado com sucesso!');
    }

    setDentistFormData({ id: null, name: '', cro: '', specialty: '', email: '', password: '', phone: '', description: '' });
    setIsDentistModalOpen(false);
  };

  const handleEditDentist = (dentist) => {
    setDentistFormData(dentist);
    setIsDentistModalOpen(true);
  };

  const handleDeleteDentist = (dentistId) => {
    const dentist = dentistsList.find(d => d.id === dentistId);
    if (window.confirm(`Deseja realmente remover o(a) ${dentist?.name}?`)) {
      setDentistsList(prev => prev.filter(d => d.id !== dentistId));
      addAuditLog(`Dentista ${dentist?.name} removido da equipe clínica.`);
      addToast('Profissional removido do sistema.', 'info');
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

  // Salvar Configuração da Clínica
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setClinicInfo({ ...settingsForm });
    addAuditLog('Configurações cadastrais da clínica alteradas.');
    addToast('Informações da clínica salvas.');
  };

  // Salvar Configuração do Perfil
  const handleSaveDentistProfile = (e) => {
    e.preventDefault();
    setDentistProfile({ ...dentistForm });
    if (currentUser.role === 'dentist') {
      setDentistsList(prev => prev.map(d => d.id === currentUser.id ? { ...d, ...dentistForm } : d));
      setCurrentUser(prev => ({ ...prev, ...dentistForm }));
    }
    addAuditLog('Perfil profissional de dentista atualizado.');
    addToast('Perfil profissional atualizado.');
  };

  // Salvar Lembretes de WhatsApp e SMS
  const handleSaveWhatsSettings = (e) => {
    e.preventDefault();
    addAuditLog('Lembretes e configurações de disparador de WhatsApp atualizados.');
    addToast('Configurações de lembretes salvas com sucesso.');
  };

  // Testar disparo de mensagem WhatsApp
  const handleTestWhatsMessage = (e) => {
    e.preventDefault();
    if (!whatsSettings.testPhone) {
      addToast('Insira um celular para realizar o disparo de teste.', 'error');
      return;
    }
    addToast(`Mensagem de teste disparada com sucesso para ${whatsSettings.testPhone}!`);
    addAuditLog(`Disparada mensagem WhatsApp de teste para o número ${whatsSettings.testPhone}`);
    setWhatsSettings(prev => ({ ...prev, testPhone: '' }));
  };

  // Alternar conexão da instância de WhatsApp (Simulador API)
  const handleToggleWhatsConnection = () => {
    if (whatsSettings.status === 'connected') {
      setWhatsSettings(prev => ({ ...prev, status: 'disconnected' }));
      addToast('Instância de WhatsApp desconectada.', 'info');
      addAuditLog('Conexão da API de WhatsApp encerrada.');
    } else {
      setWhatsSettings(prev => ({ ...prev, status: 'connecting' }));
      setTimeout(() => {
        setWhatsSettings(prev => ({ ...prev, status: 'connected' }));
        addToast('Instância de WhatsApp pareada via QR Code!');
        addAuditLog('Nova instância de WhatsApp conectada com sucesso via QR Code.');
      }, 2000);
    }
  };

  // Salvar Faturamento e Gateway API
  const handleSaveBillingSettings = (e) => {
    e.preventDefault();
    addAuditLog('Configurações do Gateway de Faturamento atualizadas.');
    addToast('Configurações de cobrança salvas com sucesso.');
  };

  // Alterar Senha
  const handleChangePassword = (e) => {
    e.preventDefault();
    const currentPass = currentUser.role === 'admin_master' ? masterAdmin.password : currentUser.password;
    
    if (secPassword.current !== currentPass) {
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

    if (currentUser.role === 'admin_master') {
      masterAdmin.password = secPassword.next;
    } else {
      setDentistsList(prev => prev.map(d => d.id === currentUser.id ? { ...d, password: secPassword.next } : d));
      setCurrentUser(prev => ({ ...prev, password: secPassword.next }));
    }

    setSecPassword({ current: '', next: '', confirm: '' });
    addAuditLog('Senha redefinida com sucesso.');
    addToast('Senha alterada.');
  };

  // --- LÓGICA DE FILTRAGEM POR FUNÇÃO (RBAC) ---
  const isMaster = currentUser && currentUser.role === 'admin_master';

  // Filtragem de agendamentos
  const getVisibleAppointments = () => {
    if (!currentUser) return [];
    let list = appointments;
    
    if (!isMaster) {
      list = list.filter(appt => appt.dentistId === currentUser.id);
    } else {
      if (selectedDentistFilter !== 'Todos') {
        list = list.filter(appt => appt.dentistId === parseInt(selectedDentistFilter));
      }
    }
    
    return list.filter(a => {
      const matchesSearch = a.patient.toLowerCase().includes(agendaSearch.toLowerCase()) ||
                            a.procedure.toLowerCase().includes(agendaSearch.toLowerCase());
      const matchesFilter = agendaStatusFilter === 'Todos' || a.status === agendaStatusFilter;
      return matchesSearch && matchesFilter;
    });
  };

  const visibleAppointments = getVisibleAppointments();

  // Estatísticas
  const getStats = () => {
    const totalConsultas = visibleAppointments.filter(a => a.status !== 'Concluído').length;
    const totalConcluidos = visibleAppointments.filter(a => a.status === 'Concluído').length;
    
    return [
      { 
        label: isMaster ? 'Consultas Hoje (Clínica)' : 'Suas Consultas Hoje', 
        value: totalConsultas.toString(), 
        icon: <Clock className="w-5 h-5 text-indigo-600" />,
        bg: 'bg-indigo-50/50',
        border: 'border-indigo-100/50'
      },
      { 
        label: 'Pacientes Cadastrados', 
        value: patientsList.length.toString(), 
        icon: <Users className="w-5 h-5 text-teal-650" />,
        bg: 'bg-teal-50/50',
        border: 'border-teal-100/50'
      },
      { 
        label: 'Procedimentos Concluídos', 
        value: totalConcluidos.toString(), 
        icon: <Check className="w-5 h-5 text-emerald-650" />,
        bg: 'bg-emerald-50/50',
        border: 'border-emerald-100/50'
      },
    ];
  };

  const stats = getStats();
  const completedRate = visibleAppointments.length > 0 
    ? Math.round((visibleAppointments.filter(a => a.status === 'Concluído').length / visibleAppointments.length) * 100) 
    : 0;

  // Time slots
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
    const found = visibleAppointments.find(a => a.time === slot.time);
    if (found) {
      slot.appt = found;
    }
  });

  // Sidebar navigation
  const NavContent = () => (
    <nav className="space-y-1.5">
      <button 
        onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-xs uppercase tracking-wider ${
          activeTab === 'dashboard' 
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <ClipboardList className="w-4.5 h-4.5" /> Dashboard
      </button>
      <button 
        onClick={() => {setActiveTab('agenda'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-xs uppercase tracking-wider ${
          activeTab === 'agenda' 
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Calendar className="w-4.5 h-4.5" /> Agenda
      </button>
      <button 
        onClick={() => {setActiveTab('pacientes'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-xs uppercase tracking-wider ${
          activeTab === 'pacientes' 
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Users className="w-4.5 h-4.5" /> Pacientes
      </button>
      
      {isMaster && (
        <button 
          onClick={() => {setActiveTab('equipe'); setIsSidebarOpen(false)}} 
          className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-xs uppercase tracking-wider ${
            activeTab === 'equipe' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <UserCheck className="w-4.5 h-4.5" /> Gestão de Equipe
        </button>
      )}

      <button 
        onClick={() => {setActiveTab('definicoes'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-xs uppercase tracking-wider ${
          activeTab === 'definicoes' 
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Settings className="w-4.5 h-4.5" /> Definições
      </button>
    </nav>
  );

  // TELA DE LOADING TRANSITÓRIA
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
              className="h-full bg-slate-850 transition-all duration-300 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // TELA DE AUTENTICAÇÃO: SPLIT-SCREEN LAYOUT
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-slate-800 animate-fade-in">
        
        {/* Left Side: Brand Panel */}
        <div className="hidden md:flex md:w-1/2 bg-slate-950 text-slate-200 p-12 lg:p-20 flex-col justify-between relative overflow-hidden">
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

          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white">
              <Stethoscope className="w-5.5 h-5.5 text-indigo-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">OdontoGestão</span>
          </div>

          <div className="space-y-6 max-w-md my-auto z-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              A gestão clínica que eleva o nível do seu atendimento.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Gestão multi-profissional completa. Sincronize prontuários, simplifique a grade de horários e gerencie a equipe de dentistas em tempo real.
            </p>
          </div>

          <div className="border-t border-slate-900 pt-6 z-10 max-w-sm">
            <p className="text-xs text-slate-500 italic leading-relaxed">
              "A organização e o rigor técnico que a Odontologia Faraoni precisava para estruturar sua expansão clínica."
            </p>
            <p className="text-[11px] font-bold text-slate-300 mt-2.5">
              Dr. Orlando Faraoni <span className="text-slate-500 font-normal">| CRO-PR 12345</span>
            </p>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 bg-slate-50/40">
          <div className="mx-auto w-full max-w-sm space-y-8">
            
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-white">
                <Stethoscope className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-base font-bold text-slate-900">OdontoGestão</span>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Acesse sua conta clínica
              </h2>
              <p className="mt-2 text-xs text-slate-500 font-medium">
                {authView === 'login' 
                  ? 'Informe seu e-mail administrativo ou credencial de profissional clínico.' 
                  : 'Digite seu e-mail cadastrado para redefinir as credenciais.'}
              </p>
            </div>

            {/* FORM: LOGIN */}
            {authView === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Endereço de E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder="nome@clinica.com"
                      className="w-full bg-white border border-slate-300/70 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm"
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
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-300/70 rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
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

                {/* Demo Logins Guide */}
                <div className="bg-slate-100/80 border border-slate-200/50 p-3.5 rounded-xl space-y-2">
                  <div className="flex gap-2 text-[11px] text-slate-600">
                    <Info className="w-4.5 h-4.5 text-slate-600 shrink-0 mt-0.5" />
                    <span className="font-bold text-slate-800">Credenciais de Teste (senha: "admin"):</span>
                  </div>
                  <div className="text-[10px] text-slate-500 pl-6 space-y-1">
                    <p>• **Admin Master:** <code className="text-slate-900 font-semibold">admin@odontofaraoni.com.br</code></p>
                    <p>• **Dr. Orlando Faraoni:** <code className="text-slate-900 font-semibold">orlando.faraoni@odontofaraoni.com.br</code></p>
                    <p>• **Dra. Beatriz Mendes:** <code className="text-slate-900 font-semibold">beatriz.mendes@odontofaraoni.com.br</code></p>
                  </div>
                </div>
              </form>
            )}

            {/* FORM: FORGOT PASSWORD */}
            {authView === 'forgot-password' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">E-mail de Cadastro</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={resetEmailInput}
                      onChange={e => setResetEmailInput(e.target.value)}
                      placeholder="digite@seuemail.com"
                      className="w-full bg-white border border-slate-300/70 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-sm"
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
                    className="w-full border border-slate-300 text-slate-600 py-2.5 rounded-xl font-semibold hover:bg-slate-50 hover:text-slate-800 transition-all text-xs"
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
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-extrabold text-xs">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate w-32">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 font-semibold truncate">
                {currentUser.role === 'admin_master' ? 'Admin Master' : currentUser.cro}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-slate-800 hover:bg-slate-855 text-slate-400 hover:text-rose-400 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all border border-slate-800"
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
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-855"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="flex-1">
              <NavContent />
            </div>
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">
                  {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-white truncate w-36">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    {currentUser.role === 'admin_master' ? 'Admin Master' : currentUser.cro}
                  </p>
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
                {activeTab === 'agenda' && 'Grade de Atendimentos'}
                {activeTab === 'pacientes' && 'Base de Prontuários'}
                {activeTab === 'equipe' && 'Corpo Clínico (Dentistas)'}
                {activeTab === 'definicoes' && 'Configurações Administrativas'}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium mt-0.5">
                {activeTab === 'dashboard' && `Sessão ativa: ${currentUser.name} | Gestão operacional de prontuários e retornos.`}
                {activeTab === 'agenda' && 'Gestão de horários clínicos e controle de faltas/conclusões.'}
                {activeTab === 'pacientes' && 'Acesso direto a prontuários e evolução clínica individual.'}
                {activeTab === 'equipe' && 'Controle administrativo de logins, especialidades e dados da equipe médica.'}
                {activeTab === 'definicoes' && 'Atualize o perfil profissional e dados de contato da clínica.'}
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
              onClick={() => {
                setFormData({ patientId: '', dentistId: isMaster ? '' : currentUser.id.toString(), procedure: '', time: '', date: '2026-06-05' });
                setIsModalOpen(true);
              }} 
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
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
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
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Próximos Atendimentos</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {isMaster ? 'Consultas agendadas no dia de hoje.' : 'Seus atendimentos agendados para hoje.'}
                        </p>
                      </div>
                      
                      {isMaster && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ver agenda de:</span>
                          <select 
                            value={selectedDentistFilter}
                            onChange={e => setSelectedDentistFilter(e.target.value)}
                            className="py-1 px-3 border border-slate-200 rounded-lg text-xs font-semibold bg-white outline-none focus:border-indigo-600 text-slate-600"
                          >
                            <option value="Todos">Todos os Dentistas</option>
                            {dentistsList.map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    
                    <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
                      <table className="w-full text-left min-w-[500px]">
                        <thead>
                          <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 pb-3">
                            <th className="pb-3 font-semibold">Paciente</th>
                            <th className="pb-3 font-semibold">Responsável</th>
                            <th className="pb-3 font-semibold">Procedimento Clínico</th>
                            <th className="pb-3 font-semibold">Horário</th>
                            <th className="pb-3 font-semibold">Status</th>
                            <th className="pb-3 font-semibold text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleAppointments.slice(0, 4).map((appt) => (
                            <tr key={appt.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/20 transition-colors">
                              <td className="py-3.5 font-bold text-slate-800 text-xs">{appt.patient}</td>
                              <td className="py-3.5 text-xs text-slate-600 font-medium">{appt.dentistName}</td>
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
                          {visibleAppointments.length === 0 && (
                            <tr>
                              <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
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

                {/* Progress & Logs */}
                <div className="space-y-6">
                  
                  {/* Occupancy Progress */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6">
                    <h3 className="font-bold text-slate-900 text-xs mb-4">Progresso do Período</h3>
                    
                    <div className="flex items-center gap-5">
                      <div className="relative flex items-center justify-center shrink-0">
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
                        <p className="text-[11px] font-bold text-slate-600">Conclusão Diária</p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                          {visibleAppointments.filter(a => a.status === 'Concluído').length} de {visibleAppointments.length} consultas foram dadas como concluídas.
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
                  
                  {isMaster && (
                    <select 
                      value={selectedDentistFilter}
                      onChange={e => setSelectedDentistFilter(e.target.value)}
                      className="py-1.5 px-3 border border-slate-300/80 text-xs rounded-xl bg-white outline-none focus:border-indigo-600 text-slate-600 font-semibold shadow-sm"
                    >
                      <option value="Todos">Todos os Dentistas</option>
                      {dentistsList.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  )}

                  <div className="relative shrink-0">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Pesquisar..." 
                      value={agendaSearch}
                      onChange={e => setAgendaSearch(e.target.value)}
                      className="pl-9 pr-4 py-1.5 w-44 md:w-56 text-xs border border-slate-300/80 rounded-xl focus:outline-none focus:border-indigo-600 shadow-sm" 
                    />
                  </div>

                  <select 
                    value={agendaStatusFilter} 
                    onChange={e => setAgendaStatusFilter(e.target.value)}
                    className="py-1.5 px-3 border border-slate-300/80 text-xs rounded-xl outline-none focus:border-indigo-600 text-slate-600 font-semibold shadow-sm"
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
                        <div key={slot.time} className="flex items-center gap-4 p-4 border rounded-xl border-slate-100 bg-slate-50/40 hover:bg-slate-50/80 transition-colors">
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
                            className="text-[10px] text-slate-700 hover:text-slate-900 font-bold bg-white border border-slate-300 px-3 py-1.5 rounded-xl hover:shadow-sm transition-all"
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
                        key={slot.time} 
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
                          <p className="font-bold text-slate-855 text-xs sm:text-sm">{appt.patient}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Responsável: {appt.dentistName}</p>
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
                    className="w-full pl-9 pr-4 py-2 border border-slate-300/80 rounded-xl focus:outline-none focus:border-indigo-600 text-xs shadow-sm" 
                  />
                </div>

                <div className="flex gap-3">
                  <select 
                    value={patientStatusFilter} 
                    onChange={e => setPatientStatusFilter(e.target.value)}
                    className="py-2 px-3 border border-slate-300/80 text-xs rounded-xl outline-none focus:border-indigo-600 text-slate-600 font-semibold shadow-sm"
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
                      <th className="p-4">Próxima Visita</th>
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
                              <p className="text-[10px] text-slate-400 font-medium">{patient.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 text-xs font-semibold">{patient.phone}</td>
                        <td className="p-4 text-slate-500 text-xs font-medium">{patient.lastVisit}</td>
                        <td className="p-4">
                          {patient.nextVisit === 'Agendar' ? (
                            <button 
                              onClick={() => {
                                setFormData({ ...formData, patientId: patient.id.toString(), dentistId: isMaster ? '' : currentUser.id.toString() });
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
                              className="px-2.5 py-1 bg-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-750 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 border border-slate-200 hover:border-indigo-100"
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

          {/* TAB 4: GESTÃO DE EQUIPE - EXCLUSIVO MASTER */}
          {activeTab === 'equipe' && isMaster && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-6 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Controle de Dentistas e Credenciais</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Cadastre, remova, edite dados e redefina as senhas dos dentistas da clínica.</p>
                </div>
                <button 
                  onClick={() => {
                    setDentistFormData({ id: null, name: '', cro: '', specialty: '', email: '', password: '', phone: '', description: '' });
                    setIsDentistModalOpen(true);
                  }}
                  className="bg-slate-900 text-white px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-slate-800 transition-all text-xs font-bold shadow-sm"
                >
                  <PlusCircle className="w-4.5 h-4.5" />
                  <span>Cadastrar Dentista</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dentistsList.map((dentist) => (
                  <div key={dentist.id} className="border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-all relative flex flex-col justify-between space-y-4 bg-slate-50/20">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            {dentist.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-850 text-sm">{dentist.name}</h4>
                            <p className="text-[10px] text-indigo-600 font-bold">{dentist.cro} | {dentist.specialty}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 bg-white border border-slate-100 rounded-lg p-0.5">
                          <button 
                            onClick={() => handleEditDentist(dentist)}
                            className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Editar Cadastro"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDentist(dentist.id)}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Excluir Profissional"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        {dentist.description}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex flex-wrap justify-between items-center gap-2">
                      <div className="text-[10px] text-slate-400 space-y-0.5">
                        <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {dentist.email}</p>
                        <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {dentist.phone}</p>
                      </div>
                      <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 rounded-lg px-2 py-0.5 font-mono font-bold" title="Senha de login">
                        Senha: {dentist.password}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CONFIGURAÇÕES E DEFINIÇÕES AVANÇADAS */}
          {activeTab === 'definicoes' && (
            <div className="space-y-6 animate-fade-in font-sans">
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Menu lateral de sub-abas */}
                <div className="col-span-1 space-y-2">
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase font-extrabold tracking-widest mb-3.5 px-2">Configurações</p>
                    
                    <button 
                      onClick={() => setSettingsSubTab('clinic')}
                      className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-2 text-xs transition-all ${
                        settingsSubTab === 'clinic' 
                          ? 'bg-slate-900 text-white border border-slate-950 shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4 text-indigo-400" /> Registro Clínico
                    </button>
                    
                    <button 
                      onClick={() => setSettingsSubTab('notifications')}
                      className={`w-full text-left p-3 rounded-xl font-bold flex items-center justify-between text-xs transition-all ${
                        settingsSubTab === 'notifications' 
                          ? 'bg-slate-900 text-white border border-slate-950 shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-teal-500" /> Lembretes SMS & Whats
                      </span>
                      {whatsSettings.status === 'connected' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                    </button>
                    
                    <button 
                      onClick={() => setSettingsSubTab('billing')}
                      className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-2 text-xs transition-all ${
                        settingsSubTab === 'billing' 
                          ? 'bg-slate-900 text-white border border-slate-950 shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" /> Cobrança & Faturamento
                    </button>
                  </div>
                </div>

                {/* Formulários dinâmicos baseados no settingsSubTab */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                  
                  {/* SUB-TAB 1: REGISTRO CLÍNICO (EXISTENTE) */}
                  {settingsSubTab === 'clinic' && (
                    <>
                      {currentUser.role === 'dentist' && (
                        <form onSubmit={handleSaveDentistProfile} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2"><Lock className="w-4 h-4 text-indigo-600" /> Perfil Profissional</h3>
                            <p className="text-[11px] text-slate-400">Edite as informações clínicas que assinam eletronicamente seus prontuários.</p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Nome Completo</label>
                              <input 
                                type="text" 
                                value={dentistForm.name} 
                                onChange={e => setDentistForm({ ...dentistForm, name: e.target.value })}
                                className="w-full border border-slate-300/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Inscrição Consular (CRO)</label>
                              <input 
                                type="text" 
                                value={dentistForm.cro} 
                                disabled
                                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium bg-slate-50 text-slate-400 cursor-not-allowed" 
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">E-mail Profissional</label>
                              <input 
                                type="email" 
                                value={dentistForm.email} 
                                onChange={e => setDentistForm({ ...dentistForm, email: e.target.value })}
                                className="w-full border border-slate-300/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Especialidade Dentária</label>
                              <input 
                                type="text" 
                                value={dentistForm.specialty} 
                                onChange={e => setDentistForm({ ...dentistForm, specialty: e.target.value })}
                                className="w-full border border-slate-300/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Descrição Profissional</label>
                            <textarea 
                              rows="3"
                              value={dentistForm.description} 
                              onChange={e => setDentistForm({ ...dentistForm, description: e.target.value })}
                              className="w-full border border-slate-300/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white leading-relaxed" 
                            />
                          </div>

                          <div className="flex justify-end pt-2">
                            <button 
                              type="submit" 
                              className="bg-slate-900 border border-slate-950 text-white px-5 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all text-xs"
                            >
                              Salvar Perfil
                            </button>
                          </div>
                        </form>
                      )}

                      <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-teal-600" /> Cadastro da Clínica</h3>
                          <p className="text-[11px] text-slate-500">Edite as informações jurídicas e contatos comerciais da clínica.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Razão Social</label>
                            <input 
                              type="text" 
                              value={settingsForm.name} 
                              disabled={!isMaster}
                              onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })}
                              className={`w-full border rounded-xl p-2.5 text-xs font-medium outline-none ${
                                isMaster ? 'border-slate-300/70 bg-white focus:border-indigo-600' : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                              }`} 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">CNPJ</label>
                            <input 
                              type="text" 
                              value={settingsForm.cnpj} 
                              disabled={!isMaster}
                              onChange={e => setSettingsForm({ ...settingsForm, cnpj: e.target.value })}
                              className={`w-full border rounded-xl p-2.5 text-xs font-medium outline-none ${
                                isMaster ? 'border-slate-300/70 bg-white focus:border-indigo-600' : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                              }`} 
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Endereço da Clínica</label>
                          <input 
                            type="text" 
                            value={settingsForm.address} 
                            disabled={!isMaster}
                            onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                            className={`w-full border rounded-xl p-2.5 text-xs font-medium outline-none ${
                              isMaster ? 'border-slate-300/70 bg-white focus:border-indigo-600' : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                            }`} 
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">WhatsApp Principal</label>
                            <input 
                              type="text" 
                              value={settingsForm.phone} 
                              disabled={!isMaster}
                              onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                              className={`w-full border rounded-xl p-2.5 text-xs font-medium outline-none ${
                                isMaster ? 'border-slate-300/70 bg-white focus:border-indigo-600' : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                              }`} 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">E-mail Comercial</label>
                            <input 
                              type="email" 
                              value={settingsForm.email} 
                              disabled={!isMaster}
                              onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                              className={`w-full border rounded-xl p-2.5 text-xs font-medium outline-none ${
                                isMaster ? 'border-slate-300/70 bg-white focus:border-indigo-600' : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                              }`} 
                            />
                          </div>
                        </div>

                        {isMaster && (
                          <div className="flex justify-end pt-2">
                            <button 
                              type="submit" 
                              className="bg-slate-900 border border-slate-950 text-white px-5 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all text-xs"
                            >
                              Salvar Configurações
                            </button>
                          </div>
                        )}
                      </form>

                      {/* Alterar Senha de Acesso */}
                      <form onSubmit={handleChangePassword} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2"><KeyRound className="w-4 h-4 text-amber-600" /> Segurança Administrativa</h3>
                          <p className="text-[11px] text-slate-500">Altere a senha mestra de acesso ao painel OdontoGestão.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-555 uppercase tracking-wider">Senha Atual</label>
                            <input 
                              type="password" 
                              required
                              value={secPassword.current}
                              onChange={e => setSecPassword({ ...secPassword, current: e.target.value })}
                              className="w-full border border-slate-300/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-555 uppercase tracking-wider">Nova Senha</label>
                            <input 
                              type="password" 
                              required
                              value={secPassword.next}
                              onChange={e => setSecPassword({ ...secPassword, next: e.target.value })}
                              className="w-full border border-slate-300/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-555 uppercase tracking-wider">Confirmar Nova</label>
                            <input 
                              type="password" 
                              required
                              value={secPassword.confirm}
                              onChange={e => setSecPassword({ ...secPassword, confirm: e.target.value })}
                              className="w-full border border-slate-300/70 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-xs font-medium bg-white" 
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
                    </>
                  )}

                  {/* SUB-TAB 2: LEMBRETES SMS & WHATS (NOVO - IMPLEMENTADO DE FATO) */}
                  {settingsSubTab === 'notifications' && (
                    <div className="space-y-6">
                      
                      {/* WhatsApp Instance Status & QR Code mock */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                              Status da API do WhatsApp
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Gerencie a conexão do disparador automático de lembretes da clínica.</p>
                          </div>
                          
                          <div className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wide border flex items-center gap-1.5 ${
                            whatsSettings.status === 'connected' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            whatsSettings.status === 'connecting' ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' :
                            'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            {whatsSettings.status === 'connected' ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                            {whatsSettings.status === 'connected' ? 'Conectado' :
                             whatsSettings.status === 'connecting' ? 'Conectando...' : 'Desconectado'}
                          </div>
                        </div>

                        {whatsSettings.status === 'disconnected' ? (
                          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-5 justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-white p-2 border border-slate-200 rounded-xl shadow-inner">
                                <QrCode className="w-16 h-16 text-slate-800" />
                              </div>
                              <div className="space-y-1 text-center sm:text-left">
                                <h4 className="text-xs font-bold text-slate-800">Vincular Celular da Clínica</h4>
                                <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs">
                                  Clique no botão ao lado para simular o escaneamento do código QR do WhatsApp Web da clínica.
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={handleToggleWhatsConnection}
                              className="bg-slate-900 text-white text-[11px] font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition-all border border-slate-950 shadow-sm"
                            >
                              Parear Dispositivo
                            </button>
                          </div>
                        ) : whatsSettings.status === 'connecting' ? (
                          <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                            <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                            Gerando sessão de sincronização do aplicativo...
                          </div>
                        ) : (
                          <div className="space-y-3 bg-slate-50/50 p-4 border border-slate-200 rounded-xl">
                            <div className="grid md:grid-cols-2 gap-4 text-xs font-medium">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Instância Ativa</span>
                                <p className="text-slate-800 mt-0.5">{whatsSettings.instanceName}</p>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Endpoint de Disparo (URL webhook)</span>
                                <p className="text-slate-850 mt-0.5 truncate">{whatsSettings.webhookUrl}</p>
                              </div>
                            </div>
                            <div className="flex justify-end pt-2 border-t border-slate-200/50">
                              <button 
                                onClick={handleToggleWhatsConnection}
                                className="text-rose-600 hover:text-rose-700 bg-white border border-rose-100 hover:bg-rose-50 px-3.5 py-1.5 rounded-xl text-[10px] font-bold transition-all"
                              >
                                Desconectar WhatsApp
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Message templates & triggers */}
                      <form onSubmit={handleSaveWhatsSettings} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-5">
                        <div>
                          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">Regras e Modelos de Mensagens</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">Edite os textos das notificações automáticas de agendamento.</p>
                        </div>

                        {/* WhatsApp template text */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Modelo de Mensagem (WhatsApp)</label>
                            <span className="text-[9px] text-slate-400">Variáveis válidas: <code className="bg-slate-100 p-0.5 rounded text-slate-700 font-bold">[PACIENTE], [DATA], [HORA], [DENTISTA], [CLINICA]</code></span>
                          </div>
                          <textarea 
                            rows="3"
                            value={whatsSettings.whatsappTemplate}
                            onChange={e => setWhatsSettings({ ...whatsSettings, whatsappTemplate: e.target.value })}
                            className="w-full border border-slate-300/70 rounded-xl p-3 text-xs font-medium text-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none leading-relaxed bg-white shadow-sm"
                          />
                        </div>

                        {/* SMS template text */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Modelo de Mensagem (SMS)</label>
                          <textarea 
                            rows="2"
                            value={whatsSettings.smsTemplate}
                            onChange={e => setWhatsSettings({ ...whatsSettings, smsTemplate: e.target.value })}
                            className="w-full border border-slate-300/70 rounded-xl p-3 text-xs font-medium text-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none leading-relaxed bg-white shadow-sm"
                          />
                        </div>

                        {/* Rules switches */}
                        <div className="border-t border-slate-100 pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-slate-800">Disparar Lembrete de 24h</p>
                              <p className="text-[10px] text-slate-400">Envia a mensagem contendo o link de confirmação automática 24 horas antes do horário marcado.</p>
                            </div>
                            <div 
                              onClick={() => setWhatsSettings(prev => ({ ...prev, send24h: !prev.send24h }))}
                              className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-all duration-350 p-0.5 ${whatsSettings.send24h ? 'bg-slate-900' : 'bg-slate-300'}`}
                            >
                              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transform transition-all duration-350 ${whatsSettings.send24h ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-slate-800">Notificar Cadastro de Consulta</p>
                              <p className="text-[10px] text-slate-400">Dispara uma mensagem de confirmação instantânea para o paciente assim que o agendamento é salvo.</p>
                            </div>
                            <div 
                              onClick={() => setWhatsSettings(prev => ({ ...prev, sendInstant: !prev.sendInstant }))}
                              className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-all duration-350 p-0.5 ${whatsSettings.sendInstant ? 'bg-slate-900' : 'bg-slate-300'}`}
                            >
                              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transform transition-all duration-350 ${whatsSettings.sendInstant ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-slate-800">Agradecimento Pós-Consulta</p>
                              <p className="text-[10px] text-slate-400">Envia uma mensagem de agradecimento e dicas de pós-operatório 2 horas após a conclusão da consulta.</p>
                            </div>
                            <div 
                              onClick={() => setWhatsSettings(prev => ({ ...prev, sendPostVisit: !prev.sendPostVisit }))}
                              className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-all duration-350 p-0.5 ${whatsSettings.sendPostVisit ? 'bg-slate-900' : 'bg-slate-300'}`}
                            >
                              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transform transition-all duration-350 ${whatsSettings.sendPostVisit ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-slate-100">
                          <button 
                            type="submit" 
                            disabled={!isMaster}
                            className="bg-slate-900 border border-slate-950 text-white px-5 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Save className="w-4 h-4" /> Salvar Lembretes
                          </button>
                        </div>
                      </form>

                      {/* Test trigger component */}
                      <form onSubmit={handleTestWhatsMessage} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">Testar Envio via API</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">Simule o envio real das mensagens inserindo um telefone celular abaixo.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative flex-1">
                            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                              type="text" 
                              placeholder="(44) 99744-3696" 
                              value={whatsSettings.testPhone}
                              onChange={e => setWhatsSettings({ ...whatsSettings, testPhone: e.target.value })}
                              className="w-full bg-white border border-slate-300/70 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
                            />
                          </div>
                          <button 
                            type="submit" 
                            disabled={whatsSettings.status !== 'connected'}
                            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Testar Lembrete
                          </button>
                        </div>
                        {whatsSettings.status !== 'connected' && (
                          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> É necessário parear o WhatsApp antes de realizar disparos de teste.</span>
                        )}
                      </form>

                    </div>
                  )}

                  {/* SUB-TAB 3: COBRANÇA & FATURAMENTO (NOVO - IMPLEMENTADO DE FATO) */}
                  {settingsSubTab === 'billing' && (
                    <div className="space-y-6">
                      
                      {/* Subscription Active plan details */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                          <div>
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg px-2.5 py-0.5 font-bold uppercase tracking-wider">Assinatura Ativa</span>
                            <h3 className="text-base font-bold text-slate-950 mt-1.5 flex items-center gap-2">
                              {billingSettings.planName}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Próxima renovação automática em **{billingSettings.nextRenewal}**.</p>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <p className="text-xs text-slate-400 font-bold">Custo Mensal</p>
                            <p className="text-xl font-black text-slate-900">R$ {billingSettings.planPrice}<span className="text-xs font-semibold text-slate-500">/mês</span></p>
                          </div>
                        </div>
                      </div>

                      {/* API settings for gateways */}
                      <form onSubmit={handleSaveBillingSettings} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2"><CreditCard className="w-4.5 h-4.5 text-indigo-600" /> Integração de Gateway de Recebimentos</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">Integre chaves de API do seu intermediador financeiro para receber cobranças de pacientes (Pix, Cartão, Boleto).</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gateway Financeiro</label>
                            <select 
                              value={billingSettings.gateway}
                              disabled={!isMaster}
                              onChange={e => setBillingSettings({ ...billingSettings, gateway: e.target.value })}
                              className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs font-semibold text-slate-700 bg-white"
                            >
                              <option value="stripe">Stripe API (Global)</option>
                              <option value="asaas">Asaas Gateway (PIX / Boleto)</option>
                              <option value="mercadopago">Mercado Pago</option>
                            </select>
                          </div>
                          
                          <div className="space-y-1 md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Chave Pública (Public API Key)</label>
                            <input 
                              type="text" 
                              value={billingSettings.publicKey}
                              disabled={!isMaster}
                              onChange={e => setBillingSettings({ ...billingSettings, publicKey: e.target.value })}
                              className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs font-medium bg-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Chave Secreta de Produção (Secret API Key)</label>
                          <input 
                            type="password" 
                            value={billingSettings.secretKey}
                            disabled={!isMaster}
                            onChange={e => setBillingSettings({ ...billingSettings, secretKey: e.target.value })}
                            className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs font-mono font-bold bg-white"
                          />
                        </div>

                        {/* Payment methods toggles */}
                        <div className="border-t border-slate-100 pt-4">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Métodos de Faturamento Ativos</span>
                          
                          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={billingSettings.pixEnabled}
                                disabled={!isMaster}
                                onChange={e => setBillingSettings({ ...billingSettings, pixEnabled: e.target.checked })}
                                className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4" 
                              />
                              <span>Pix Instantâneo (QR Code)</span>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={billingSettings.cardEnabled}
                                disabled={!isMaster}
                                onChange={e => setBillingSettings({ ...billingSettings, cardEnabled: e.target.checked })}
                                className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4" 
                              />
                              <span>Cartão de Crédito</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={billingSettings.boletoEnabled}
                                disabled={!isMaster}
                                onChange={e => setBillingSettings({ ...billingSettings, boletoEnabled: e.target.checked })}
                                className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4" 
                              />
                              <span>Boleto Bancário registrado</span>
                            </label>
                          </div>
                        </div>

                        {isMaster && (
                          <div className="flex justify-end pt-2 border-t border-slate-100">
                            <button 
                              type="submit" 
                              className="bg-slate-900 border border-slate-950 text-white px-5 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all text-xs flex items-center gap-1.5"
                            >
                              <Save className="w-4 h-4" /> Salvar Integração
                            </button>
                          </div>
                        )}
                      </form>

                      {/* Recent invoices list */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 space-y-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-950">Histórico de Faturas da Assinatura</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">Lista de cobranças recentes da licença do software.</p>
                        </div>

                        <div className="overflow-x-auto border border-slate-200 rounded-xl">
                          <table className="w-full text-left min-w-[500px]">
                            <thead>
                              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 bg-slate-50/50">
                                <th className="p-3">Código</th>
                                <th className="p-3">Data Faturamento</th>
                                <th className="p-3">Método</th>
                                <th className="p-3">Valor</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Comprovante</th>
                              </tr>
                            </thead>
                            <tbody>
                              {billingSettings.invoices.map((inv, idx) => (
                                <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/20 transition-all text-xs font-semibold text-slate-700">
                                  <td className="p-3 font-mono">{inv.id}</td>
                                  <td className="p-3 text-slate-500">{inv.date}</td>
                                  <td className="p-3 text-slate-600">{inv.method}</td>
                                  <td className="p-3 text-slate-900 font-bold">{inv.amount}</td>
                                  <td className="p-3">
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[9px] font-bold">
                                      {inv.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <button 
                                      onClick={() => addToast(`Recibo ${inv.id} baixado.`, 'success')}
                                      className="p-1 hover:text-indigo-600 hover:bg-slate-100 rounded-lg text-slate-400 transition-all"
                                      title="Baixar Recibo PDF"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}

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
                <p className="text-[11px] text-slate-400">Agende a consulta do paciente e vincule o profissional.</p>
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
                  className="w-full border border-slate-300/70 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="">Selecione o paciente...</option>
                  {patientsList.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Dentista Responsável</label>
                <select 
                  required
                  value={formData.dentistId}
                  disabled={!isMaster}
                  onChange={e => setFormData({ ...formData, dentistId: e.target.value })}
                  className={`w-full border rounded-xl p-2.5 outline-none text-xs font-semibold bg-white ${
                    isMaster ? 'border-slate-300/70 focus:border-indigo-600' : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <option value="">Selecione o profissional...</option>
                  {dentistsList.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
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
                  className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium bg-white" 
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
                    className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-semibold text-slate-700 bg-white"
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
                    className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-semibold text-slate-700 bg-white" 
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors text-xs">
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
                <p className="text-[11px] text-slate-500">Insira as informações de contato do prontuário.</p>
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
                  className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium bg-white" 
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
                  className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-semibold bg-white" 
                  placeholder="Ex: (44) 99111-2222" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Endereço de E-mail</label>
                <input 
                  type="email" 
                  value={patientFormData.email} 
                  onChange={(e) => setPatientFormData({...patientFormData, email: e.target.value})} 
                  className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium bg-white" 
                  placeholder="Ex: carlos@email.com" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status Cadastral</label>
                <select 
                  value={patientFormData.status}
                  onChange={(e) => setPatientFormData({...patientFormData, status: e.target.value})}
                  className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-semibold text-slate-700 bg-white"
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

      {/* MODAL 3: CADASTRO/EDIÇÃO DE DENTISTA - EXCLUSIVO MASTER */}
      {isDentistModalOpen && isMaster && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-zoom-in border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {dentistFormData.id ? 'Editar Dados do Dentista' : 'Cadastrar Novo Dentista'}
                </h3>
                <p className="text-[11px] text-slate-500">Insira as informações clínicas e de autenticação do profissional.</p>
              </div>
              <button onClick={() => setIsDentistModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveDentist} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nome Completo</label>
                  <input 
                    type="text" 
                    required 
                    value={dentistFormData.name} 
                    onChange={(e) => setDentistFormData({...dentistFormData, name: e.target.value})} 
                    className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 transition-all font-semibold bg-white" 
                    placeholder="Ex: Dra. Helena Souza" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Registro CRO</label>
                  <input 
                    type="text" 
                    required 
                    value={dentistFormData.cro} 
                    onChange={(e) => setDentistFormData({...dentistFormData, cro: e.target.value})} 
                    className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 transition-all font-semibold bg-white" 
                    placeholder="Ex: CRO-PR 54321" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Especialidade</label>
                  <input 
                    type="text" 
                    required 
                    value={dentistFormData.specialty} 
                    onChange={(e) => setDentistFormData({...dentistFormData, specialty: e.target.value})} 
                    className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 transition-all font-medium bg-white" 
                    placeholder="Ex: Odontopediatria" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Telefone de Contato</label>
                  <input 
                    type="text" 
                    required 
                    value={dentistFormData.phone} 
                    onChange={(e) => setDentistFormData({...dentistFormData, phone: e.target.value})} 
                    className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 transition-all font-semibold bg-white" 
                    placeholder="Ex: (44) 99111-3333" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">E-mail de Login</label>
                <input 
                  type="email" 
                  required 
                  value={dentistFormData.email} 
                  onChange={(e) => setDentistFormData({...dentistFormData, email: e.target.value})} 
                  className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 transition-all font-medium bg-white" 
                  placeholder="Ex: helena@odontofaraoni.com.br" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Senha de Acesso</label>
                <input 
                  type="text" 
                  value={dentistFormData.password} 
                  onChange={(e) => setDentistFormData({...dentistFormData, password: e.target.value})} 
                  className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 transition-all font-mono font-bold bg-white" 
                  placeholder="Defina a senha (deixe em branco para manter 'admin')" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Descrição Curta (Currículo / Especialidade)</label>
                <textarea 
                  rows="3"
                  value={dentistFormData.description} 
                  onChange={(e) => setDentistFormData({...dentistFormData, description: e.target.value})} 
                  className="w-full border border-slate-300/70 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-600 transition-all font-medium bg-white leading-relaxed" 
                  placeholder="Ex: Especialista em odontologia infantil..."
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsDentistModalOpen(false)} className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-xs">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 px-4 bg-slate-900 border border-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 shadow-sm transition-colors text-xs">
                  {dentistFormData.id ? 'Salvar Dados' : 'Cadastrar Profissional'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER: EVOLUÇÃO E PRONTUÁRIO CLÍNICO */}
      {selectedPatientForHistory && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-lg p-6 md:p-8 relative shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in border-l border-slate-200">
            
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
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 transition-colors"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm"
                    placeholder="Ex: Alergias clínicas relatadas."
                  />
                  <p className="text-[9px] text-slate-400 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Informação vital de anamnese médica.</p>
                </div>

                {/* Medical notes/Anamnesis */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-555 uppercase tracking-wider">Evolução Clínica & Histórico de Prontuário</label>
                  <textarea 
                    rows="8"
                    value={selectedPatientForHistory.medicalNotes}
                    onChange={e => setSelectedPatientForHistory({ ...selectedPatientForHistory, medicalNotes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 leading-relaxed shadow-sm"
                    placeholder="Inserir notas clínicas..."
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
