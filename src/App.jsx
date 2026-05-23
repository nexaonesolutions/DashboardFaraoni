import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, ClipboardList, Settings, PlusCircle, Clock, Menu, X, 
  Search, Filter, MoreVertical, Bell, Save, Phone, Mail, Check, 
  Trash2, Edit, AlertCircle, FileText, ArrowRight, UserPlus, Info, CheckCircle2, Trash
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  
  // Custom Toast notification system
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Clinic Profile State
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Odontologia Faraoni',
    cnpj: '00.000.000/0001-00',
    address: 'Marialva - PR',
    phone: '+55 (44) 99744-3696',
    email: 'contacto@odontofaraoni.com.br',
    reminders: true
  });

  // Temp settings form state
  const [settingsForm, setSettingsForm] = useState({ ...clinicInfo });

  // State to store appointments dynamically
  const [appointments, setAppointments] = useState([
    { id: 1, patientId: 1, patient: 'Maria Oliveira', procedure: 'Limpeza', time: '09:00', date: '2026-05-22', status: 'Confirmado' },
    { id: 2, patientId: 2, patient: 'João Silva', procedure: 'Avaliação Implante', time: '10:30', date: '2026-05-22', status: 'Pendente' }
  ]);
  
  // New appointment form state
  const [formData, setFormData] = useState({ patientId: '', procedure: '', time: '', date: '2026-05-22' });

  // Patients state
  const [patientsList, setPatientsList] = useState([
    { id: 1, name: 'Maria Oliveira', phone: '(44) 99123-4567', email: 'maria@email.com', lastVisit: '15/05/2026', nextVisit: '22/05/2026', status: 'Ativo' },
    { id: 2, name: 'João Silva', phone: '(44) 99876-5432', email: 'joao@email.com', lastVisit: '10/04/2026', nextVisit: '22/05/2026', status: 'Em Tratamento' },
    { id: 3, name: 'Ana Souza', phone: '(44) 99765-4321', email: 'ana@email.com', lastVisit: '05/01/2026', nextVisit: 'Agendar', status: 'Inativo' },
    { id: 4, name: 'Carlos Mendes', phone: '(44) 99111-2222', email: 'carlos@email.com', lastVisit: '20/05/2026', nextVisit: '15/06/2026', status: 'Ativo' }
  ]);

  // New/Edit Patient form state
  const [patientFormData, setPatientFormData] = useState({ id: null, name: '', phone: '', email: '', status: 'Ativo' });

  // Search and Filter states
  const [patientSearch, setPatientSearch] = useState('');
  const [patientStatusFilter, setPatientStatusFilter] = useState('Todos');
  const [agendaSearch, setAgendaSearch] = useState('');
  const [agendaStatusFilter, setAgendaStatusFilter] = useState('Todos');

  // Handle appointment scheduling
  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.procedure || !formData.time) {
      addToast('Preencha todos os campos do agendamento!', 'error');
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
      date: formData.date || '2026-05-22',
      status: 'Pendente'
    };
    
    setAppointments(prev => [...prev, newAppt]);
    
    // Update patient's next visit if it's the 22nd or later
    setPatientsList(prev => prev.map(p => {
      if (p.id === selectedPatient.id) {
        return { ...p, nextVisit: '22/05/2026' };
      }
      return p;
    }));

    setFormData({ patientId: '', procedure: '', time: '', date: '2026-05-22' });
    setIsModalOpen(false);
    addToast('Consulta agendada com sucesso!');
  };

  // Change appointment status
  const handleToggleStatus = (apptId) => {
    setAppointments(prev => prev.map(appt => {
      if (appt.id === apptId) {
        const nextStatus = appt.status === 'Confirmado' ? 'Pendente' : appt.status === 'Pendente' ? 'Concluído' : 'Confirmado';
        addToast(`Consulta de ${appt.patient} alterada para: ${nextStatus}`);
        return { ...appt, status: nextStatus };
      }
      return appt;
    }));
  };

  // Delete an appointment
  const handleDeleteAppointment = (apptId) => {
    setAppointments(prev => prev.filter(appt => appt.id !== apptId));
    addToast('Consulta cancelada com sucesso!', 'info');
  };

  // Handle Patient Actions
  const handleSavePatient = (e) => {
    e.preventDefault();
    if (!patientFormData.name || !patientFormData.phone) {
      addToast('Nome e Telefone são obrigatórios!', 'error');
      return;
    }

    if (patientFormData.id) {
      // Edit
      setPatientsList(prev => prev.map(p => p.id === patientFormData.id ? { ...p, ...patientFormData } : p));
      // Update name in appointments as well
      setAppointments(prev => prev.map(a => a.patientId === patientFormData.id ? { ...a, patient: patientFormData.name } : a));
      addToast('Cadastro de paciente atualizado!');
    } else {
      // Create
      const newPatient = {
        id: Date.now(),
        name: patientFormData.name,
        phone: patientFormData.phone,
        email: patientFormData.email || 'Não informado',
        lastVisit: 'Hoje',
        nextVisit: 'Agendar',
        status: patientFormData.status
      };
      setPatientsList(prev => [...prev, newPatient]);
      addToast('Novo paciente cadastrado com sucesso!');
    }

    setPatientFormData({ id: null, name: '', phone: '', email: '', status: 'Ativo' });
    setIsPatientModalOpen(false);
  };

  const handleEditPatient = (patient) => {
    setPatientFormData(patient);
    setIsPatientModalOpen(true);
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Deseja realmente remover este paciente? Todos os agendamentos vinculados serão mantidos.')) {
      setPatientsList(prev => prev.filter(p => p.id !== patientId));
      addToast('Paciente excluído com sucesso!', 'info');
    }
  };

  // Handle clinic configurations
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setClinicInfo({ ...settingsForm });
    addToast('Informações da clínica salvas com sucesso!');
  };

  // Dynamic statistics
  const stats = [
    { 
      label: 'Consultas Hoje', 
      value: appointments.filter(a => a.status !== 'Concluído').length.toString(), 
      icon: <Clock className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50',
      border: 'border-sky-100/60'
    },
    { 
      label: 'Pacientes Cadastrados', 
      value: patientsList.length.toString(), 
      icon: <Users className="w-5 h-5 text-teal-600" />,
      bg: 'bg-teal-50',
      border: 'border-teal-100/60'
    },
    { 
      label: 'Agendamentos Pendentes', 
      value: appointments.filter(a => a.status === 'Pendente').length.toString(), 
      icon: <Calendar className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100/60'
    },
  ];

  // Filters application
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

  // Pre-filled slots for calendar layout (combining interactive status)
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

  // Map state appointments into timeSlots
  allTimeSlots.forEach(slot => {
    const found = appointments.find(a => a.time === slot.time);
    if (found) {
      slot.appt = found;
    }
  });

  const NavContent = () => (
    <nav className="space-y-1">
      <button 
        onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'dashboard' ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
      >
        <ClipboardList className="w-5 h-5" /> Dashboard
      </button>
      <button 
        onClick={() => {setActiveTab('agenda'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'agenda' ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
      >
        <Calendar className="w-5 h-5" /> Agenda
      </button>
      <button 
        onClick={() => {setActiveTab('pacientes'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'pacientes' ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
      >
        <Users className="w-5 h-5" /> Pacientes
      </button>
      <button 
        onClick={() => {setActiveTab('definicoes'); setIsSidebarOpen(false)}} 
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'definicoes' ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
      >
        <Settings className="w-5 h-5" /> Definições
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans antialiased text-slate-800">
      
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
            {t.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" /> :
             t.type === 'info' ? <Info className="w-5 h-5 shrink-0 text-blue-500" /> :
             <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            }
            <div className="text-sm font-medium">{t.message}</div>
          </div>
        ))}
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-100 p-6 border-r border-slate-800 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-sky-500 p-2 rounded-xl text-white shadow-lg shadow-sky-500/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-sky-400 to-teal-300 bg-clip-text text-transparent">OdontoGestão</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Dental System</p>
          </div>
        </div>
        
        <div className="flex-1">
          <NavContent />
        </div>

        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 bg-slate-850 p-3 rounded-xl border border-slate-800 bg-slate-800/40">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 to-teal-400 flex items-center justify-center text-slate-900 font-bold text-sm">
              OF
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-100 truncate w-32">{clinicInfo.name}</p>
              <p className="text-[10px] text-sky-400 font-medium">Administrador</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="w-72 max-w-[85vw] h-full bg-slate-900 text-white p-6 flex flex-col transition-all duration-300 relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-2">
                <div className="bg-sky-500 p-1.5 rounded-lg text-white">
                  <Calendar className="w-5 h-5" />
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
            <div className="pt-6 border-t border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-slate-900 font-bold text-sm">
                OF
              </div>
              <div>
                <p className="text-xs font-bold text-white truncate w-36">{clinicInfo.name}</p>
                <p className="text-[10px] text-sky-400">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 z-35 shadow-sm shadow-slate-100/20">
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
                {activeTab === 'dashboard' && 'Acompanhe as estatísticas e os próximos atendimentos de hoje.'}
                {activeTab === 'agenda' && 'Visualize seus horários, confirme status e organize seu dia.'}
                {activeTab === 'pacientes' && 'Cadastre, edite e acompanhe o histórico dos seus pacientes.'}
                {activeTab === 'definicoes' && 'Gerencie o perfil da clínica, horários e lembretes.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setPatientFormData({ id: null, name: '', phone: '', email: '', status: 'Ativo' });
                setIsPatientModalOpen(true);
              }} 
              className="bg-white text-slate-700 border border-slate-200 p-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-all text-sm font-semibold shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-sky-600" /> 
              <span className="hidden lg:inline">Novo Paciente</span>
            </button>

            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-sky-600 text-white p-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/10 transition-all text-sm font-semibold shadow-sm"
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
            <div className="space-y-6">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {stats.map((s, i) => (
                  <div key={i} className={`bg-white p-5 rounded-2xl border ${s.border} shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between`}>
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
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Próximos atendimentos</h3>
                      <p className="text-xs text-slate-400">Lista ordenada por horário de consulta</p>
                    </div>
                    <button onClick={() => setActiveTab('agenda')} className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1">
                      Ver Agenda Completa <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
                    <table className="w-full text-left min-w-[500px]">
                      <thead>
                        <tr className="text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100 pb-3">
                          <th className="pb-3 font-semibold">Paciente</th>
                          <th className="pb-3 font-semibold">Procedimento</th>
                          <th className="pb-3 font-semibold">Horário</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appt) => (
                          <tr key={appt.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/40 transition-colors">
                            <td className="py-4 font-semibold text-slate-800 text-sm">{appt.patient}</td>
                            <td className="py-4 text-sm text-slate-600 font-medium">{appt.procedure}</td>
                            <td className="py-4 text-sm text-slate-500 font-semibold">{appt.time}</td>
                            <td className="py-4">
                              <button 
                                onClick={() => handleToggleStatus(appt.id)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                                  appt.status === 'Confirmado' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' :
                                  appt.status === 'Concluído' ? 'text-slate-600 bg-slate-100 border border-slate-200/60' :
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
                                  title="Alterar Status"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteAppointment(appt.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                  title="Cancelar Agendamento"
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
                              Nenhum agendamento para hoje.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Actions & Shortcut Side info */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-800 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl"></div>
                    
                    <h3 className="font-bold text-base text-sky-400 mb-2">Resumo da Clínica</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Seu portal administrativo da **{clinicInfo.name}**. Faça a gestão de pacientes e consultas diárias em um clique.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-850 p-2.5 rounded-xl border border-slate-800 bg-slate-800/50">
                        <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                        <span>{clinicInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-850 p-2.5 rounded-xl border border-slate-800 bg-slate-800/50">
                        <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                        <span className="truncate">{clinicInfo.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Tip card */}
                  <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-5 shadow-inner">
                    <div className="flex gap-3">
                      <Bell className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-sky-900 mb-1">Dica de Produtividade</h4>
                        <p className="text-xs text-sky-700 leading-relaxed">
                          Você pode alterar rapidamente o status de um agendamento clicando na badge de status diretamente na tabela de atendimentos ou na agenda.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: AGENDA */}
          {activeTab === 'agenda' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 space-y-6">
              
              {/* Header and Controls */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-slate-50 pb-5">
                <div>
                  <h3 className="font-bold text-slate-850 text-base">Agenda Diária</h3>
                  <p className="text-xs text-slate-400">22 de Maio, 2026</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative shrink-0">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar na agenda..." 
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
              <div className="space-y-3.5 max-w-4xl">
                {allTimeSlots
                  .filter(slot => {
                    // Filter logic based on agendaSearch and agendaStatusFilter
                    if (!slot.appt) {
                      // Free slots only show up if no filter is applied, or if search is empty
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
                      // FREE SLOT
                      return (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-xl border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                          <div className="w-16 font-bold text-slate-400 text-sm flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {slot.time}
                          </div>
                          <div className="flex-1 text-slate-400 text-xs italic font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-350"></span>
                            Horário Livre
                          </div>
                          <button 
                            onClick={() => {
                              setFormData({ ...formData, time: slot.time });
                              setIsModalOpen(true);
                            }}
                            className="text-xs text-sky-600 hover:text-sky-700 font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:shadow-sm transition-all"
                          >
                            Agendar
                          </button>
                        </div>
                      );
                    }

                    // APPOINTMENT SLOT
                    const isConfirmado = appt.status === 'Confirmado';
                    const isConcluido = appt.status === 'Concluído';

                    return (
                      <div 
                        key={appt.id} 
                        className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-xl relative overflow-hidden transition-all hover:shadow-sm ${
                          isConcluido ? 'border-slate-200 bg-slate-50/60 opacity-80' :
                          isConfirmado ? 'border-sky-100 bg-sky-50/20' : 
                          'border-amber-100 bg-amber-50/20'
                        }`}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          isConcluido ? 'bg-slate-400' :
                          isConfirmado ? 'bg-sky-500' : 
                          'bg-amber-500'
                        }`}></div>

                        <div className="w-16 font-bold text-slate-800 text-sm flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {appt.time}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm sm:text-base">{appt.patient}</p>
                          <p className={`text-xs font-semibold ${isConfirmado ? 'text-sky-700' : isConcluido ? 'text-slate-550' : 'text-amber-700'}`}>
                            {appt.procedure}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                            isConfirmado ? 'text-sky-700 bg-sky-50 border-sky-100' :
                            isConcluido ? 'text-slate-600 bg-slate-100 border-slate-200' :
                            'text-amber-700 bg-amber-50 border-amber-100'
                          }`}>
                            {appt.status}
                          </span>

                          <div className="flex items-center gap-1 border-l border-slate-200/80 pl-3">
                            <button 
                              onClick={() => handleToggleStatus(appt.id)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                              title="Alterar Status"
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 space-y-6">
              
              {/* Header and Controls */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar por nome, telefone ou email..." 
                    value={patientSearch}
                    onChange={e => setPatientSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-250 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm shadow-sm" 
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
                      <th className="p-4">Nome</th>
                      <th className="p-4">Contacto</th>
                      <th className="p-4">Última Visita</th>
                      <th className="p-4">Próxima Visita</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-all">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                              {patient.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{patient.name}</p>
                              <p className="text-xs text-slate-400 font-medium">{patient.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 text-sm font-semibold">{patient.phone}</td>
                        <td className="p-4 text-slate-500 text-sm font-medium">{patient.lastVisit}</td>
                        <td className="p-4">
                          {patient.nextVisit === 'Agendar' ? (
                            <button 
                              onClick={() => {
                                // Match appropriate patient
                                setFormData({ ...formData, patientId: patient.id.toString() });
                                setIsModalOpen(true);
                              }}
                              className="text-xs text-sky-600 hover:text-sky-700 font-bold border border-sky-100 bg-sky-50/40 px-2.5 py-1 rounded-lg"
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
                              'text-slate-600 bg-slate-100 border-slate-200'}`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => handleEditPatient(patient)}
                              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Editar Paciente"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeletePatient(patient.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
                          Nenhum paciente encontrado correspondendo aos filtros.
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
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Menu Lateral de Definições */}
              <div className="col-span-1 space-y-2">
                <button className="w-full text-left p-3 rounded-xl bg-sky-50 text-sky-700 font-bold border border-sky-100/60 shadow-sm">
                  Perfil da Clínica
                </button>
                <button 
                  onClick={() => addToast('Recurso em desenvolvimento! Integrado com WhatsApp API.', 'info')} 
                  className="w-full text-left p-3 rounded-xl text-slate-600 hover:bg-slate-100/80 hover:text-slate-800 font-semibold transition-colors flex justify-between items-center"
                >
                  <span>Integração WhatsApp</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">Próximo</span>
                </button>
                <button 
                  onClick={() => addToast('Notificações automatizadas configuradas no perfil!', 'info')} 
                  className="w-full text-left p-3 rounded-xl text-slate-600 hover:bg-slate-100/80 hover:text-slate-800 font-semibold transition-colors"
                >
                  Notificações e Alertas
                </button>
                <button 
                  onClick={() => addToast('Controle de acesso por cargo disponível na versão Pro.', 'info')} 
                  className="w-full text-left p-3 rounded-xl text-slate-600 hover:bg-slate-100/80 hover:text-slate-800 font-semibold transition-colors"
                >
                  Equipe e Permissões
                </button>
              </div>

              {/* Formulário Principal */}
              <form onSubmit={handleSaveSettings} className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-850">Informações da Clínica</h3>
                  <p className="text-xs text-slate-400">Edite as informações cadastrais e detalhes de contato principal da clínica.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Nome da Clínica</label>
                    <input 
                      type="text" 
                      value={settingsForm.name} 
                      onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">CNPJ / NIF</label>
                    <input 
                      type="text" 
                      value={settingsForm.cnpj} 
                      onChange={e => setSettingsForm({ ...settingsForm, cnpj: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Endereço Completo</label>
                  <input 
                    type="text" 
                    value={settingsForm.address} 
                    onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-2"><Phone className="w-3.5 h-3.5 text-sky-500" /> Contato Principal</h4>
                    <input 
                      type="text" 
                      value={settingsForm.phone} 
                      onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-2"><Mail className="w-3.5 h-3.5 text-teal-500" /> E-mail de Contato</h4>
                    <input 
                      type="email" 
                      value={settingsForm.email} 
                      onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-medium" 
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-100/60 p-2 rounded-xl text-sky-600"><Bell className="w-5 h-5" /></div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">Lembretes Automáticos</p>
                      <p className="text-xs text-slate-400">Enviar lembretes no WhatsApp/SMS 24h antes das consultas</p>
                    </div>
                  </div>
                  {/* Interactive toggle */}
                  <div 
                    onClick={() => {
                      const nextVal = !settingsForm.reminders;
                      setSettingsForm({ ...settingsForm, reminders: nextVal });
                      addToast(nextVal ? 'Lembretes automáticos ativados!' : 'Lembretes automáticos desativados.', 'info');
                    }}
                    className={`w-12 h-6.5 rounded-full relative cursor-pointer transition-all duration-300 p-0.5 ${settingsForm.reminders ? 'bg-sky-600' : 'bg-slate-350'}`}
                  >
                    <div className={`w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition-all duration-300 ${settingsForm.reminders ? 'translate-x-5.5' : 'translate-x-0'}`}></div>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button 
                    type="submit" 
                    className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-sky-700 transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-sky-600/10 text-sm"
                  >
                    <Save className="w-4.5 h-4.5" /> Salvar Configurações
                  </button>
                </div>
              </form>
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
                <p className="text-xs text-slate-400">Selecione o paciente e defina o horário do atendimento.</p>
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
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Procedimento</label>
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
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Data</label>
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
                  Salvar
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
                  {patientFormData.id ? 'Editar Paciente' : 'Novo Paciente'}
                </h3>
                <p className="text-xs text-slate-400">Insira os detalhes de identificação e contato do paciente.</p>
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
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Telefone / Contacto</label>
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
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">E-mail</label>
                <input 
                  type="email" 
                  value={patientFormData.email} 
                  onChange={(e) => setPatientFormData({...patientFormData, email: e.target.value})} 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all font-medium" 
                  placeholder="Ex: carlos@email.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Status</label>
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
                  {patientFormData.id ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
