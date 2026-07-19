const baseUrl = ''; // URL relativa já que servimos os arquivos na mesma porta

// Elementos do DOM
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const authSubtitle = document.getElementById('auth-subtitle');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const authAlert = document.getElementById('auth-alert');

const displayUserName = document.getElementById('display-user-name');
const avatarLetters = document.getElementById('avatar-letters');
const logoutBtn = document.getElementById('logout-btn');
const refreshAppointments = document.getElementById('refresh-appointments');
const appointmentsContainer = document.getElementById('appointments-container');

const bookingForm = document.getElementById('booking-form');
const bookingProfessional = document.getElementById('booking-professional');
const bookingService = document.getElementById('booking-service');
const bookingDate = document.getElementById('booking-date');
const availabilitySection = document.getElementById('availability-section');
const slotsGrid = document.getElementById('slots-grid');
const selectedSlotTime = document.getElementById('selected-slot-time');
const confirmBookingBtn = document.getElementById('confirm-booking-btn');
const bookingAlert = document.getElementById('booking-alert');

// Elementos do Modal de Reagendamento
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
  
  // Carregar dados
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

// Carregar Profissionais e Serviços nos Dropdowns
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
          <button class="btn-icon" title="Cancelar Agendamento" onclick="cancelAppointment(${app.id})">
            <i data-lucide="x"></i>
          </button>
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
    lucide.createIcons();
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
    } catch (error) {
      rescheduleAlert.innerText = error.message;
      rescheduleAlert.className = 'alert alert-danger';
      rescheduleAlert.classList.remove('hidden');
    }
  });
}
