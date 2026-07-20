const baseUrl = ''; // URL relativa já que servimos os arquivos na mesma porta

// Elementos do DOM - Telas
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const authSubtitle = document.getElementById('auth-subtitle');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authAlert = document.getElementById('auth-alert');

// Elementos do DOM - Cabeçalho
const displayUserName = document.getElementById('display-user-name');
const avatarLetters = document.getElementById('avatar-letters');
const logoutBtn = document.getElementById('logout-btn');
const refreshAppointments = document.getElementById('refresh-appointments');
const appointmentsContainer = document.getElementById('appointments-container');

// Elementos do DOM - Navegação Admin
const adminNavTabs = document.getElementById('admin-nav-tabs');
const tabClientView = document.getElementById('tab-client-view');
const tabAdminView = document.getElementById('tab-admin-view');
const clientView = document.getElementById('client-view');
const adminView = document.getElementById('admin-view');

const tabManageProfessionals = document.getElementById('tab-manage-professionals');
const tabManageServices = document.getElementById('tab-manage-services');
const tabManageAppointments = document.getElementById('tab-manage-appointments');
const panelProfessionals = document.getElementById('panel-professionals');
const panelServices = document.getElementById('panel-services');
const panelAppointments = document.getElementById('panel-appointments');

const adminProfessionalsTbody = document.getElementById('admin-professionals-tbody');
const adminServicesTbody = document.getElementById('admin-services-tbody');
const adminAppointmentsTbody = document.getElementById('admin-appointments-tbody');
const refreshAdminAppointments = document.getElementById('refresh-admin-appointments');

const btnAddProfessional = document.getElementById('btn-add-professional');
const btnAddService = document.getElementById('btn-add-service');

// Elementos do DOM - Formulário de Agendamento Cliente
const bookingForm = document.getElementById('booking-form');
const bookingProfessional = document.getElementById('booking-professional');
const bookingService = document.getElementById('booking-service');
const bookingDate = document.getElementById('booking-date');
const availabilitySection = document.getElementById('availability-section');
const slotsGrid = document.getElementById('slots-grid');
const selectedSlotTime = document.getElementById('selected-slot-time');
const confirmBookingBtn = document.getElementById('confirm-booking-btn');
const bookingAlert = document.getElementById('booking-alert');

// Elementos do DOM - Modal de Reagendamento
const rescheduleModal = document.getElementById('reschedule-modal');
const rescheduleAppId = document.getElementById('reschedule-appointment-id');
const rescheduleProfId = document.getElementById('reschedule-professional-id');
const rescheduleServId = document.getElementById('reschedule-service-id');
const rescheduleDate = document.getElementById('reschedule-date');
const rescheduleSlotsSection = document.getElementById('reschedule-slots-section');
const rescheduleSlotsGrid = document.getElementById('reschedule-slots-grid');
const rescheduleSelectedTime = document.getElementById('reschedule-selected-time');
const confirmRescheduleBtn = document.getElementById('confirm-reschedule-btn');
const cancelRescheduleBtn = document.getElementById('cancel-reschedule-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const rescheduleAlert = document.getElementById('reschedule-alert');

// Elementos do DOM - Modal de Profissional CRUD
const professionalModal = document.getElementById('professional-modal');
const professionalModalTitle = document.getElementById('professional-modal-title');
const closeProfModalBtn = document.getElementById('close-prof-modal-btn');
const professionalForm = document.getElementById('professional-form');
const profFormId = document.getElementById('prof-form-id');
const profFormNome = document.getElementById('prof-form-nome');
const profFormEspecialidade = document.getElementById('prof-form-especialidade');
const profFormTelefone = document.getElementById('prof-form-telefone');
const profFormAtivo = document.getElementById('prof-form-ativo');
const profFormAlert = document.getElementById('prof-form-alert');
const cancelProfBtn = document.getElementById('cancel-prof-btn');

// Elementos do DOM - Modal de Serviço CRUD
const serviceModal = document.getElementById('service-modal');
const serviceModalTitle = document.getElementById('service-modal-title');
const closeServModalBtn = document.getElementById('close-serv-modal-btn');
const serviceForm = document.getElementById('service-form');
const servFormId = document.getElementById('serv-form-id');
const servFormNome = document.getElementById('serv-form-nome');
const servFormPreco = document.getElementById('serv-form-preco');
const servFormDuracao = document.getElementById('serv-form-duracao');
const servFormArea = document.getElementById('serv-form-area');
const servFormAlert = document.getElementById('serv-form-alert');
const cancelServBtn = document.getElementById('cancel-serv-btn');

// Estado da Aplicação
let currentUser = null;
let token = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  setupAuthSwitchers();
  checkAuth();
  setupDateLimits();
  setupBookingFormListeners();
  setupModalListeners();
  setupAdminListeners();
});

// Configurar limites de data mínima (não permitir datas passadas)
function setupDateLimits() {
  const today = new Date().toISOString().split('T')[0];
  bookingDate.min = today;
  rescheduleDate.min = today;
}

// Alternar entre formulários de autenticação
function setupAuthSwitchers() {
  document.getElementById('switch-to-register').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    authSubtitle.innerText = 'Crie sua conta para começar a agendar';
    clearAlerts();
  });

  document.getElementById('switch-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
    authSubtitle.innerText = 'Entre na sua conta para agendar um atendimento';
    clearAlerts();
  });

  logoutBtn.addEventListener('click', logout);
  refreshAppointments.addEventListener('click', loadAppointments);
}

function clearAlerts() {
  authAlert.classList.add('hidden');
  authAlert.innerText = '';
  bookingAlert.classList.add('hidden');
  bookingAlert.innerText = '';
  rescheduleAlert.classList.add('hidden');
  rescheduleAlert.innerText = '';
  profFormAlert.classList.add('hidden');
  profFormAlert.innerText = '';
  servFormAlert.classList.add('hidden');
  servFormAlert.innerText = '';
}

// Verificar se o usuário está logado
function checkAuth() {
  token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    currentUser = JSON.parse(userStr);
    showDashboard();
  } else {
    showAuth();
  }
}

function showDashboard() {
  authScreen.classList.add('hidden');
  dashboardScreen.classList.remove('hidden');
  
  // Atualizar cabeçalho
  displayUserName.innerText = currentUser.name;
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  avatarLetters.innerText = initials;
  
  // Tratar perfil visualmente e habilitar abas administrativas
  const roleSpan = document.querySelector('.user-role');
  if (currentUser.role === 'admin' || currentUser.role === 'administrador') {
    roleSpan.innerText = 'Administrador';
    adminNavTabs.classList.remove('hidden');
  } else {
    roleSpan.innerText = 'Cliente';
    adminNavTabs.classList.add('hidden');
  }

  // Garantir que a aba cliente seja a ativa por padrão
  switchTabToClient();

  // Carregar dados iniciais
  loadDropdowns();
  loadAppointments();
}

function showAuth() {
  dashboardScreen.classList.add('hidden');
  authScreen.classList.remove('hidden');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  token = null;
  showAuth();
}

// Enviar formulário de Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlerts();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const json = await res.json();
    
    if (!json.success) {
      throw new Error(json.error || 'Erro ao realizar login.');
    }
    
    localStorage.setItem('token', json.token);
    localStorage.setItem('user', JSON.stringify(json.user));
    
    token = json.token;
    currentUser = json.user;
    
    showDashboard();
  } catch (error) {
    authAlert.innerText = error.message;
    authAlert.classList.remove('hidden');
  }
});

// Enviar formulário de Cadastro
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlerts();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.error || 'Erro ao realizar cadastro.');
    }

    // Auto-login após o cadastro
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const loginJson = await loginRes.json();
    
    localStorage.setItem('token', loginJson.token);
    localStorage.setItem('user', JSON.stringify(loginJson.user));
    
    token = loginJson.token;
    currentUser = loginJson.user;
    
    showDashboard();
  } catch (error) {
    authAlert.innerText = error.message;
    authAlert.classList.remove('hidden');
  }
});

// Carregar Profissionais e Serviços nos Dropdowns (Agenda do Cliente)
async function loadDropdowns() {
  try {
    // 1. Carregar Profissionais
    const profRes = await fetch(`${baseUrl}/professionals`);
    const profJson = await profRes.json();
    
    bookingProfessional.innerHTML = '<option value="" disabled selected>Escolha um profissional</option>';
    profJson.data.forEach(prof => {
      const option = document.createElement('option');
      option.value = prof.id;
      option.innerText = `${prof.nome} (${prof.especialidade})`;
      bookingProfessional.appendChild(option);
    });

    // 2. Carregar Serviços
    const serviceRes = await fetch(`${baseUrl}/services`);
    const serviceJson = await serviceRes.json();
    
    bookingService.innerHTML = '<option value="" disabled selected>Escolha um serviço</option>';
    serviceJson.data.forEach(serv => {
      const option = document.createElement('option');
      option.value = serv.id;
      option.innerText = `${serv.nome_servico} - R$ ${parseFloat(serv.preco).toFixed(2)} (${serv.duracao} min)`;
      bookingService.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao preencher seletores:', error);
  }
}

// Carregar Agendamentos do Usuário
async function loadAppointments() {
  try {
    appointmentsContainer.innerHTML = '<p class="empty-state">Carregando agendamentos...</p>';
    
    const res = await fetch(`${baseUrl}/appointments/user/${currentUser.id}`);
    const json = await res.json();

    if (!json.success) {
      throw new Error(json.error);
    }

    if (json.data.length === 0) {
      appointmentsContainer.innerHTML = '<p class="empty-state">Você não possui nenhum agendamento marcado.</p>';
      return;
    }

    appointmentsContainer.innerHTML = '';
    json.data.forEach(app => {
      const card = document.createElement('div');
      card.className = `appointment-card status-${app.status}`;
      
      const formattedDate = new Date(app.data_hora).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      });

      const badgeClass = `badge badge-${app.status}`;

      let actionButtons = '';
      if (app.status === 'agendado' || app.status === 'confirmado') {
        actionButtons = `
          <button class="btn btn-secondary btn-sm" onclick="openRescheduleModal(${app.id}, ${app.professional_id}, ${app.service_id}, '${app.data_hora.split('T')[0]}')">Reagendar</button>
          <button class="btn btn-danger btn-sm" onclick="cancelAppointment(${app.id})">Cancelar</button>
        `;
      }

      card.innerHTML = `
        <div class="app-details">
          <span class="${badgeClass}">${app.status}</span>
          <h4 class="app-service-name">${app.service.nome_servico}</h4>
          <span class="app-professional"><i data-lucide="user" style="width: 14px; height: 14px;"></i> Profissional: ${app.professional.nome}</span>
          <span class="app-datetime"><i data-lucide="clock" style="width: 14px; height: 14px;"></i> Horário: ${formattedDate}</span>
        </div>
        <div class="app-actions">
          ${actionButtons}
        </div>
      `;
      appointmentsContainer.appendChild(card);
    });
    
    // Atualizar ícones do Lucide nos novos elementos inseridos
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } catch (error) {
    appointmentsContainer.innerHTML = `<p class="empty-state text-danger">Erro ao carregar: ${error.message}</p>`;
  }
}

// Ouvir alterações no formulário de agendamento para buscar disponibilidade
function setupBookingFormListeners() {
  const checkAvailability = async () => {
    const profId = bookingProfessional.value;
    const servId = bookingService.value;
    const date = bookingDate.value;

    if (!profId || !servId || !date) {
      availabilitySection.classList.add('hidden');
      confirmBookingBtn.disabled = true;
      return;
    }

    try {
      slotsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; font-size: 13px; color: var(--color-text-muted);">Buscando horários...</div>';
      availabilitySection.classList.remove('hidden');
      confirmBookingBtn.disabled = true;
      selectedSlotTime.value = '';

      const res = await fetch(`${baseUrl}/agenda/availability?professional_id=${profId}&date=${date}&service_id=${servId}`);
      const json = await res.json();

      if (json.data.length === 0) {
        slotsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; font-size: 13px; color: var(--color-danger);">Nenhum horário disponível nesta data.</div>';
        return;
      }

      slotsGrid.innerHTML = '';
      json.data.forEach(slot => {
        const item = document.createElement('div');
        item.className = 'slot-item';
        item.innerText = slot.time;
        item.addEventListener('click', () => {
          document.querySelectorAll('#slots-grid .slot-item').forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
          selectedSlotTime.value = slot.time;
          confirmBookingBtn.disabled = false;
        });
        slotsGrid.appendChild(item);
      });
    } catch (error) {
      console.error(error);
      slotsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; font-size: 13px; color: var(--color-danger);">Erro ao buscar horários.</div>';
    }
  };

  bookingProfessional.addEventListener('change', checkAvailability);
  bookingService.addEventListener('change', checkAvailability);
  bookingDate.addEventListener('change', checkAvailability);
}

// Confirmar o Novo Agendamento
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlerts();

  const profId = bookingProfessional.value;
  const servId = bookingService.value;
  const date = bookingDate.value;
  const time = selectedSlotTime.value;

  if (!profId || !servId || !date || !time) return;

  try {
    const res = await fetch(`${baseUrl}/appointments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        professional_id: parseInt(profId),
        service_id: parseInt(servId),
        data_hora: `${date}T${time}:00`
      })
    });

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.error || 'Erro ao realizar agendamento.');
    }

    bookingAlert.innerText = 'Agendamento realizado com sucesso!';
    bookingAlert.className = 'alert alert-success';
    
    // Limpar campos
    bookingForm.reset();
    availabilitySection.classList.add('hidden');
    confirmBookingBtn.disabled = true;
    
    // Atualizar agendamentos
    loadAppointments();
    
    setTimeout(clearAlerts, 5000);
  } catch (error) {
    bookingAlert.innerText = error.message;
    bookingAlert.className = 'alert alert-danger';
  }
});

// Cancelar Agendamento
async function cancelAppointment(id) {
  if (!confirm('Deseja realmente cancelar este agendamento?')) return;
  
  try {
    const res = await fetch(`${baseUrl}/appointments/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error);
    }
    
    alert('Agendamento cancelado com sucesso!');
    loadAppointments();
  } catch (error) {
    alert(`Erro ao cancelar: ${error.message}`);
  }
}

// --- MODAL DE REAGENDAMENTO ---

function openRescheduleModal(appId, profId, servId, currentDate) {
  clearAlerts();
  rescheduleAppId.value = appId;
  rescheduleProfId.value = profId;
  rescheduleServId.value = servId;
  rescheduleDate.value = currentDate;
  
  rescheduleSlotsSection.classList.add('hidden');
  confirmRescheduleBtn.disabled = true;
  rescheduleSelectedTime.value = '';
  
  rescheduleModal.classList.remove('hidden');
  
  // Buscar horários para a data selecionada automaticamente
  triggerRescheduleAvailability();
}

// Buscar disponibilidade dentro do Modal
async function triggerRescheduleAvailability() {
  const profId = rescheduleProfId.value;
  const servId = rescheduleServId.value;
  const date = rescheduleDate.value;

  if (!profId || !servId || !date) {
    rescheduleSlotsSection.classList.add('hidden');
    confirmRescheduleBtn.disabled = true;
    return;
  }

  try {
    rescheduleSlotsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; font-size: 13px; color: var(--color-text-muted);">Buscando horários...</div>';
    rescheduleSlotsSection.classList.remove('hidden');
    confirmRescheduleBtn.disabled = true;
    rescheduleSelectedTime.value = '';

    const res = await fetch(`${baseUrl}/agenda/availability?professional_id=${profId}&date=${date}&service_id=${servId}`);
    const json = await res.json();

    if (json.data.length === 0) {
      rescheduleSlotsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; font-size: 13px; color: var(--color-danger);">Nenhum horário disponível.</div>';
      return;
    }

    rescheduleSlotsGrid.innerHTML = '';
    json.data.forEach(slot => {
      const item = document.createElement('div');
      item.className = 'slot-item';
      item.innerText = slot.time;
      item.addEventListener('click', () => {
        document.querySelectorAll('#reschedule-slots-grid .slot-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        rescheduleSelectedTime.value = slot.time;
        confirmRescheduleBtn.disabled = false;
      });
      rescheduleSlotsGrid.appendChild(item);
    });
  } catch (error) {
    console.error(error);
    rescheduleSlotsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; font-size: 13px; color: var(--color-danger);">Erro ao buscar horários.</div>';
  }
}

function setupModalListeners() {
  rescheduleDate.addEventListener('change', triggerRescheduleAvailability);

  const closeModal = () => {
    rescheduleModal.classList.add('hidden');
  };

  closeModalBtn.addEventListener('click', closeModal);
  cancelRescheduleBtn.addEventListener('click', closeModal);

  // Confirmar Reagendamento
  confirmRescheduleBtn.addEventListener('click', async () => {
    clearAlerts();
    const appId = rescheduleAppId.value;
    const date = rescheduleDate.value;
    const time = rescheduleSelectedTime.value;

    if (!appId || !date || !time) return;

    try {
      const res = await fetch(`${baseUrl}/appointments/${appId}/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          data_hora: `${date}T${time}:00`
        })
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Erro ao reagendar.');
      }

      alert('Atendimento reagendado com sucesso!');
      closeModal();
      loadAppointments();
      if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'administrador')) {
        loadAdminAppointments();
      }
    } catch (error) {
      rescheduleAlert.innerText = error.message;
      rescheduleAlert.className = 'alert alert-danger';
      rescheduleAlert.classList.remove('hidden');
    }
  });
}

// --- LOGICA DE ADMIN (TABS E CRUD) ---

function setupAdminListeners() {
  // Alterar Abas Principais
  tabClientView.addEventListener('click', switchTabToClient);
  tabAdminView.addEventListener('click', switchTabToAdmin);

  // Alterar Sub-abas de Admin
  tabManageProfessionals.addEventListener('click', () => switchAdminSubtab('professionals'));
  tabManageServices.addEventListener('click', () => switchAdminSubtab('services'));
  tabManageAppointments.addEventListener('click', () => switchAdminSubtab('appointments'));
  refreshAdminAppointments.addEventListener('click', loadAdminAppointments);

  // Abrir Modais de Adicionar
  btnAddProfessional.addEventListener('click', () => openProfessionalModal());
  btnAddService.addEventListener('click', () => openServiceModal());

  // Fechar Modais do Admin
  closeProfModalBtn.addEventListener('click', closeProfessionalModal);
  cancelProfBtn.addEventListener('click', closeProfessionalModal);
  closeServModalBtn.addEventListener('click', closeServiceModal);
  cancelServBtn.addEventListener('click', closeServiceModal);

  // Enviar formulários de Admin
  professionalForm.addEventListener('submit', handleProfessionalSubmit);
  serviceForm.addEventListener('submit', handleServiceSubmit);
}

function switchTabToClient() {
  tabAdminView.classList.remove('active');
  tabClientView.classList.add('active');
  adminView.classList.add('hidden');
  clientView.classList.remove('hidden');
}

function switchTabToAdmin() {
  tabClientView.classList.remove('active');
  tabAdminView.classList.add('active');
  clientView.classList.add('hidden');
  adminView.classList.remove('hidden');
  
  // Carregar dados do admin ao entrar
  loadAdminProfessionals();
  loadAdminServices();
  loadAdminAppointments();
}

function switchAdminSubtab(type) {
  tabManageProfessionals.classList.remove('active');
  tabManageServices.classList.remove('active');
  tabManageAppointments.classList.remove('active');

  panelProfessionals.classList.add('hidden');
  panelServices.classList.add('hidden');
  panelAppointments.classList.add('hidden');

  if (type === 'professionals') {
    tabManageProfessionals.classList.add('active');
    panelProfessionals.classList.remove('hidden');
  } else if (type === 'services') {
    tabManageServices.classList.add('active');
    panelServices.classList.remove('hidden');
  } else if (type === 'appointments') {
    tabManageAppointments.classList.add('active');
    panelAppointments.classList.remove('hidden');
    loadAdminAppointments();
  }
}

// --- CRUD PROFISSIONAIS ---

async function loadAdminProfessionals() {
  try {
    adminProfessionalsTbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Buscando profissionais...</td></tr>';
    
    const res = await fetch(`${baseUrl}/professionals?ativo=all`);
    const json = await res.json();
    
    adminProfessionalsTbody.innerHTML = '';
    if (json.data.length === 0) {
      adminProfessionalsTbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum profissional cadastrado.</td></tr>';
      return;
    }
    
    json.data.forEach(prof => {
      const tr = document.createElement('tr');
      const statusBadge = prof.ativo 
        ? '<span class="badge badge-confirmado">Ativo</span>'
        : '<span class="badge badge-cancelado">Inativo</span>';
        
      tr.innerHTML = `
        <td>${prof.id}</td>
        <td><strong>${prof.nome}</strong></td>
        <td>${prof.especialidade}</td>
        <td>${prof.telefone}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="editProfessional(${prof.id}, '${prof.nome.replace(/'/g, "\\'")}', '${prof.especialidade.replace(/'/g, "\\'")}', '${prof.telefone}', ${prof.ativo})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProfessional(${prof.id})">Excluir</button>
        </td>
      `;
      adminProfessionalsTbody.appendChild(tr);
    });
  } catch (error) {
    adminProfessionalsTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-danger);">Erro ao carregar: ${error.message}</td></tr>`;
  }
}

function openProfessionalModal(prof = null) {
  clearAlerts();
  professionalForm.reset();
  
  if (!prof) {
    professionalModalTitle.innerText = 'Novo Profissional';
    profFormId.value = '';
    profFormAtivo.checked = true;
  } else {
    professionalModalTitle.innerText = 'Editar Profissional';
    profFormId.value = prof.id;
    profFormNome.value = prof.nome;
    profFormEspecialidade.value = prof.especialidade;
    profFormTelefone.value = prof.telefone;
    profFormAtivo.checked = prof.ativo;
  }
  
  professionalModal.classList.remove('hidden');
}

function closeProfessionalModal() {
  professionalModal.classList.add('hidden');
}

// Handler de Escopo Global (para chamar a partir do inline HTML onclick do table)
window.editProfessional = (id, nome, especialidade, telefone, ativo) => {
  openProfessionalModal({ id, nome, especialidade, telefone, ativo });
};

async function handleProfessionalSubmit(e) {
  e.preventDefault();
  clearAlerts();

  const id = profFormId.value;
  const nome = profFormNome.value;
  const especialidade = profFormEspecialidade.value;
  const telefone = profFormTelefone.value;
  const ativo = profFormAtivo.checked;

  const url = id ? `${baseUrl}/professionals/${id}` : `${baseUrl}/professionals`;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nome, especialidade, telefone, ativo })
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Erro ao salvar profissional.');
    }

    closeProfessionalModal();
    loadAdminProfessionals();
    loadAdminServices(); // Recarregar tabela de serviços se um novo serviço de especialidade foi criado
    loadDropdowns(); // Recarregar seletores da agenda cliente
  } catch (error) {
    profFormAlert.innerText = error.message;
    profFormAlert.className = 'alert alert-danger';
    profFormAlert.classList.remove('hidden');
  }
}

window.deleteProfessional = async (id) => {
  if (!confirm(`Deseja realmente excluir o profissional com ID ${id}?`)) return;

  try {
    const res = await fetch(`${baseUrl}/professionals/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Erro ao deletar profissional.');
    }

    alert('Profissional excluído com sucesso!');
    loadAdminProfessionals();
    loadDropdowns();
  } catch (error) {
    alert(`Erro ao excluir: ${error.message}`);
  }
};

// --- CRUD SERVIÇOS ---

async function loadAdminServices() {
  try {
    adminServicesTbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Buscando serviços...</td></tr>';
    
    const res = await fetch(`${baseUrl}/services`);
    const json = await res.json();
    
    adminServicesTbody.innerHTML = '';
    if (json.data.length === 0) {
      adminServicesTbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum serviço cadastrado.</td></tr>';
      return;
    }
    
    json.data.forEach(serv => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${serv.id}</td>
        <td><strong>${serv.nome_servico}</strong></td>
        <td>R$ ${parseFloat(serv.preco).toFixed(2)}</td>
        <td>${serv.duracao} min</td>
        <td>${serv.area_id}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="editService(${serv.id}, '${serv.nome_servico.replace(/'/g, "\\'")}', ${serv.preco}, ${serv.duracao}, ${serv.area_id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteService(${serv.id})">Excluir</button>
        </td>
      `;
      adminServicesTbody.appendChild(tr);
    });
  } catch (error) {
    adminServicesTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-danger);">Erro ao carregar: ${error.message}</td></tr>`;
  }
}

function openServiceModal(service = null) {
  clearAlerts();
  serviceForm.reset();
  
  if (!service) {
    serviceModalTitle.innerText = 'Novo Serviço';
    servFormId.value = '';
  } else {
    serviceModalTitle.innerText = 'Editar Serviço';
    servFormId.value = service.id;
    servFormNome.value = service.nome_servico;
    servFormPreco.value = service.preco;
    servFormDuracao.value = service.duracao;
    servFormArea.value = service.area_id;
  }
  
  serviceModal.classList.remove('hidden');
}

function closeServiceModal() {
  serviceModal.classList.add('hidden');
}

window.editService = (id, nome_servico, preco, duracao, area_id) => {
  openServiceModal({ id, nome_servico, preco, duracao, area_id });
};

async function handleServiceSubmit(e) {
  e.preventDefault();
  clearAlerts();

  const id = servFormId.value;
  const nome_servico = servFormNome.value;
  const preco = parseFloat(servFormPreco.value);
  const duracao = parseInt(servFormDuracao.value);
  const area_id = parseInt(servFormArea.value);

  const url = id ? `${baseUrl}/services/${id}` : `${baseUrl}/services`;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nome_servico, preco, duracao, area_id })
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Erro ao salvar serviço.');
    }

    closeServiceModal();
    loadAdminServices();
    loadDropdowns(); // Recarregar seletores da agenda cliente
  } catch (error) {
    servFormAlert.innerText = error.message;
    servFormAlert.className = 'alert alert-danger';
    servFormAlert.classList.remove('hidden');
  }
}

window.deleteService = async (id) => {
  if (!confirm(`Deseja realmente excluir o serviço com ID ${id}?`)) return;

  try {
    const res = await fetch(`${baseUrl}/services/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Erro ao deletar serviço.');
    }

    alert('Serviço excluído com sucesso!');
    loadAdminServices();
    loadDropdowns();
  } catch (error) {
    alert(`Erro ao excluir: ${error.message}`);
  }
};

// --- AGENDA GERAL DO SALÃO (ADMIN) ---

async function loadAdminAppointments() {
  try {
    adminAppointmentsTbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Buscando agendamentos...</td></tr>';

    const res = await fetch(`${baseUrl}/appointments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const json = await res.json();

    adminAppointmentsTbody.innerHTML = '';
    if (json.data.length === 0) {
      adminAppointmentsTbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Nenhum agendamento registrado.</td></tr>';
      return;
    }

    json.data.forEach(app => {
      const tr = document.createElement('tr');
      
      const formattedDate = new Date(app.data_hora).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      });

      const badgeClass = `badge badge-${app.status}`;
      
      let actionButtons = '';
      if (app.status === 'agendado' || app.status === 'confirmado') {
        actionButtons = `
          <button class="btn btn-secondary btn-sm" onclick="openRescheduleModal(${app.id}, ${app.professional_id}, ${app.service_id}, '${app.data_hora.split('T')[0]}')">Reagendar</button>
          <button class="btn btn-danger btn-sm" onclick="adminCancelAppointment(${app.id})">Cancelar</button>
        `;
      }

      tr.innerHTML = `
        <td>${app.id}</td>
        <td><strong>${app.user.name}</strong><br><small style="color: var(--color-text-muted);">${app.user.email}</small></td>
        <td>${app.professional.nome}</td>
        <td>${app.service.nome_servico}</td>
        <td>${formattedDate}</td>
        <td><span class="${badgeClass}">${app.status}</span></td>
        <td>${actionButtons}</td>
      `;
      adminAppointmentsTbody.appendChild(tr);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } catch (error) {
    adminAppointmentsTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-danger);">Erro ao carregar: ${error.message}</td></tr>`;
  }
}

window.adminCancelAppointment = async (id) => {
  if (!confirm('Deseja realmente cancelar este agendamento (Ação do Administrador)?')) return;

  try {
    const res = await fetch(`${baseUrl}/appointments/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error);
    }

    alert('Agendamento cancelado com sucesso!');
    loadAdminAppointments();
    loadAppointments(); // Atualiza também a tabela do cliente se estiver aberta
  } catch (error) {
    alert(`Erro ao cancelar: ${error.message}`);
  }
};
