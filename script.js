// Конфигурация API
const API_BASE_URL = 'http://localhost:8000';

// Глобальные переменные
let currentUser = null;
let authToken = null;
let machines = [];
let filteredMachines = [];
let machineTypes = [];
let currentLanguage = 'ru';

// Мультиязычность
const translations = {
    ru: {
        // Общие
        "system_title": "Vending System",
        "system_subtitle": "Управление торговыми аппаратами",
        "user_role": "Франчайзер",
        
        // Авторизация
        "login_title": "Вход в систему",
        "login_subtitle": "Введите ваши учетные данные",
        "email_placeholder": "Email",
        "password_placeholder": "Пароль", 
        "login_button": "Войти в систему",
        "test_credentials": "Тестовый доступ: admin@vending.com / admin123",
        
        // Навигация
        "nav_machines": "Торговые аппараты",
        "nav_calendar": "Календарь обслуживания", 
        "nav_schedule": "График работ",
        
        // Страницы
        "page_machines_title": "Торговые аппараты",
        "page_machines_subtitle": "Управление всеми торговыми аппаратами системы",
        "page_calendar_title": "Календарь обслуживания",
        "page_calendar_subtitle": "Плановое обслуживание и мониторинг аппаратов",
        "page_schedule_title": "График работ",
        "page_schedule_subtitle": "Расписание сотрудников и распределение задач",
        
        // Статистика
        "stat_total_machines": "Всего аппаратов",
        "stat_working_machines": "Работают",
        "stat_maintenance_machines": "В ремонте",
        "stat_total_income": "Общий доход",
        
        // Кнопки
        "btn_add_machine": "+ Добавить аппарат",
        "btn_upload_file": "📁 Загрузить из файла",
        "btn_save_machine": "Сохранить аппарат",
        "btn_cancel": "Отмена",
        "btn_generate_schedule": "Сформировать расписание",
        
        // Форма аппарата
        "add_machine_title": "Добавить новый аппарат",
        "label_serial_number": "Серийный номер *",
        "label_inventory_number": "Инвентарный номер *",
        "label_location": "Местоположение *",
        "label_model": "Модель *",
        "label_machine_type": "Тип аппарата *",
        "label_manufacturer": "Производитель",
        "label_manufacture_date": "Дата производства *",
        "label_commissioning_date": "Дата ввода в эксплуатацию *",
        "label_status": "Статус",
        "label_country": "Страна",
        
        // Статусы
        "status_working": "Работает",
        "status_maintenance": "В ремонте",
        
        // Таблица
        "machines_list_title": "Список аппаратов",
        "table_serial_number": "Серийный номер",
        "table_inventory_number": "Инвентарный номер", 
        "table_location": "Местоположение",
        "table_model": "Модель",
        "table_status": "Статус",
        "table_income": "Доход",
        "table_actions": "Действия",
        
        // Поиск
        "search_placeholder": "Поиск аппаратов...",
        
        // Календарь
        "calendar_title": "Календарь обслуживания",
        "calendar_description": "Здесь будет отображаться календарь с плановым обслуживанием аппаратов",
        "calendar_month": "Месяц",
        "calendar_week": "Неделя",
        "calendar_year": "Год",
        
        // График работ
        "schedule_title": "График работ",
        "schedule_description": "Здесь будет отображаться график работ с возможностью drag-and-drop",
        "schedule_day": "День",
        "schedule_week": "Неделя",
        
        // Фильтры
        "filter_all": "Все аппараты",
        "filter_all_employees": "Все сотрудники",
        
        // Сообщения
        "error_auth": "Ошибка авторизации",
        "error_invalid_credentials": "Неверный email или пароль",
        "error_network": "Произошла ошибка при соединении с сервером",
        "error_load_machines": "Не удалось загрузить список аппаратов",
        "error_load_statistics": "Ошибка загрузки статистики",
        "error_load_types": "Ошибка загрузки типов аппаратов",
        "error_delete_machine": "Не удалось удалить аппарат",
        "error_create_machine": "Ошибка создания аппарата",
        "success_machine_added": "Аппарат успешно добавлен",
        "success_machine_deleted": "Аппарат успешно удален",
        "success_export": "Данные успешно экспортированы в CSV файл",
        "confirm_delete": "Вы уверены, что хотите удалить этот аппарат?",
        "no_machines_title": "Нет торговых аппаратов",
        "no_machines_message": "Добавьте первый аппарат, чтобы начать работу"
    },
    en: {
        // Общие
        "system_title": "Vending System",
        "system_subtitle": "Vending Machine Management",
        "user_role": "Franchisor",
        
        // Авторизация
        "login_title": "Login to System",
        "login_subtitle": "Enter your credentials",
        "email_placeholder": "Email",
        "password_placeholder": "Password",
        "login_button": "Login to System", 
        "test_credentials": "Test access: admin@vending.com / admin123",
        
        // Навигация
        "nav_machines": "Vending Machines",
        "nav_calendar": "Maintenance Calendar",
        "nav_schedule": "Work Schedule",
        
        // Страницы
        "page_machines_title": "Vending Machines",
        "page_machines_subtitle": "Manage all vending machines in the system",
        "page_calendar_title": "Maintenance Calendar", 
        "page_calendar_subtitle": "Scheduled maintenance and machine monitoring",
        "page_schedule_title": "Work Schedule",
        "page_schedule_subtitle": "Employee schedule and task distribution",
        
        // Статистика
        "stat_total_machines": "Total Machines",
        "stat_working_machines": "Working",
        "stat_maintenance_machines": "In Maintenance", 
        "stat_total_income": "Total Income",
        
        // Кнопки
        "btn_add_machine": "+ Add Machine",
        "btn_upload_file": "📁 Upload from File",
        "btn_save_machine": "Save Machine",
        "btn_cancel": "Cancel",
        "btn_generate_schedule": "Generate Schedule",
        
        // Форма аппарата
        "add_machine_title": "Add New Machine",
        "label_serial_number": "Serial Number *",
        "label_inventory_number": "Inventory Number *",
        "label_location": "Location *",
        "label_model": "Model *", 
        "label_machine_type": "Machine Type *",
        "label_manufacturer": "Manufacturer",
        "label_manufacture_date": "Manufacture Date *",
        "label_commissioning_date": "Commissioning Date *",
        "label_status": "Status",
        "label_country": "Country",
        
        // Статусы
        "status_working": "Working",
        "status_maintenance": "In Maintenance",
        
        // Таблица
        "machines_list_title": "Machines List",
        "table_serial_number": "Serial Number",
        "table_inventory_number": "Inventory Number",
        "table_location": "Location", 
        "table_model": "Model",
        "table_status": "Status",
        "table_income": "Income",
        "table_actions": "Actions",
        
        // Поиск
        "search_placeholder": "Search machines...",
        
        // Календарь
        "calendar_title": "Maintenance Calendar",
        "calendar_description": "Calendar with scheduled maintenance will be displayed here",
        "calendar_month": "Month",
        "calendar_week": "Week", 
        "calendar_year": "Year",
        
        // График работ
        "schedule_title": "Work Schedule",
        "schedule_description": "Work schedule with drag-and-drop capability will be displayed here",
        "schedule_day": "Day",
        "schedule_week": "Week",
        
        // Фильтры
        "filter_all": "All Machines",
        "filter_all_employees": "All Employees",
        
        // Сообщения
        "error_auth": "Authorization Error",
        "error_invalid_credentials": "Invalid email or password",
        "error_network": "Network connection error occurred",
        "error_load_machines": "Failed to load machines list",
        "error_load_statistics": "Error loading statistics",
        "error_load_types": "Error loading machine types",
        "error_delete_machine": "Failed to delete machine",
        "error_create_machine": "Error creating machine",
        "success_machine_added": "Machine successfully added",
        "success_machine_deleted": "Machine successfully deleted",
        "success_export": "Data successfully exported to CSV file",
        "confirm_delete": "Are you sure you want to delete this machine?",
        "no_machines_title": "No vending machines",
        "no_machines_message": "Add the first machine to get started"
    }
};

// Функция для установки языка
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Обновляем активные кнопки языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    // Обновляем все тексты
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Обновляем placeholder'ы
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            element.setAttribute('placeholder', translations[lang][key]);
        }
    });
    
    // Обновляем опции select'ов
    document.querySelectorAll('option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        if (translations[lang][key]) {
            option.textContent = translations[lang][key];
        }
    });
    
    // Обновляем заголовки страниц
    updatePageTitles();
}

// Функция для получения перевода по ключу
function translate(key) {
    return translations[currentLanguage][key] || key;
}

// Функция для обновления заголовков страниц
function updatePageTitles() {
    const activeSection = document.querySelector('.content-section.active');
    if (!activeSection) return;
    
    const activeSectionId = activeSection.id;
    let titleKey = 'page_machines_title';
    let subtitleKey = 'page_machines_subtitle';
    
    if (activeSectionId === 'calendar-section') {
        titleKey = 'page_calendar_title';
        subtitleKey = 'page_calendar_subtitle';
    } else if (activeSectionId === 'schedule-section') {
        titleKey = 'page_schedule_title';
        subtitleKey = 'page_schedule_subtitle';
    }
    
    document.getElementById('page-title').textContent = translate(titleKey);
    document.getElementById('page-subtitle').textContent = translate(subtitleKey);
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Устанавливаем текущие даты по умолчанию
    const today = new Date().toISOString().split('T')[0];
    const manufactureDate = document.getElementById('manufacture-date');
    const commissioningDate = document.getElementById('commissioning-date');
    
    if (manufactureDate) manufactureDate.value = today;
    if (commissioningDate) commissioningDate.value = today;
    
    // Устанавливаем язык из localStorage или по умолчанию русский
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'ru';
    setLanguage(savedLanguage);
    
    // Проверяем, есть ли сохраненный токен
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
        authToken = savedToken;
        checkAuth();
    }
    
    // Настройка обработчиков событий
    setupEventListeners();
}

function setupEventListeners() {
    // Переключатели языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
    
    // Форма авторизации
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Выход из системы
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Навигация по разделам
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Управление аппаратами
    const addMachineBtn = document.getElementById('add-machine-btn');
    if (addMachineBtn) {
        addMachineBtn.addEventListener('click', showAddMachineForm);
    }
    
    const closeMachineForm = document.getElementById('close-machine-form');
    if (closeMachineForm) {
        closeMachineForm.addEventListener('click', hideAddMachineForm);
    }
    
    const cancelMachineBtn = document.getElementById('cancel-machine-btn');
    if (cancelMachineBtn) {
        cancelMachineBtn.addEventListener('click', hideAddMachineForm);
    }
    
    const machineForm = document.getElementById('machine-form');
    if (machineForm) {
        machineForm.addEventListener('submit', handleAddMachine);
    }
    
    const uploadFileBtn = document.getElementById('upload-file-btn');
    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', triggerFileUpload);
    }
    
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    const refreshMachines = document.getElementById('refresh-machines');
    if (refreshMachines) {
        refreshMachines.addEventListener('click', function() {
            loadMachines();
            loadStatistics();
        });
    }
    
    // Поиск
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Календарь
    const calendarView = document.getElementById('calendar-view');
    if (calendarView) {
        calendarView.addEventListener('change', loadCalendar);
    }
    
    const machineFilter = document.getElementById('machine-filter');
    if (machineFilter) {
        machineFilter.addEventListener('change', loadCalendar);
    }
    
    const prevPeriod = document.getElementById('prev-period');
    if (prevPeriod) {
        prevPeriod.addEventListener('click', function() {
            showModal(translate('navigation'), 'Переход к предыдущему периоду');
        });
    }
    
    const nextPeriod = document.getElementById('next-period');
    if (nextPeriod) {
        nextPeriod.addEventListener('click', function() {
            showModal(translate('navigation'), 'Переход к следующему периоду');
        });
    }
    
    // График работ
    const generateSchedule = document.getElementById('generate-schedule');
    if (generateSchedule) {
        generateSchedule.addEventListener('click', function() {
            showModal(translate('schedule_generation'), 'Расписание успешно сформировано с учетом загруженности сотрудников');
        });
    }
    
    // Модальное окно
    const modalClose = document.getElementById('modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
    }
    
    const modalConfirm = document.getElementById('modal-confirm');
    if (modalConfirm) {
        modalConfirm.addEventListener('click', hideModal);
    }
}

// Функции авторизации
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Показываем индикатор загрузки
    const submitBtn = e.target.querySelector('.btn-primary');
    const btnText = submitBtn.querySelector('span');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.opacity = '0.5';
    btnLoader.style.display = 'block';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || translate('error_auth'));
        }
        
        const data = await response.json();
        authToken = data.access_token;
        currentUser = data.user;
        
        // Сохраняем токен
        localStorage.setItem('authToken', authToken);
        
        // Переключаемся на основной экран
        switchToMainScreen();
        
        // Загружаем данные
        loadMachineTypes();
        loadMachines();
        loadStatistics();
        
    } catch (error) {
        showModal(translate('error_auth'), translate('error_invalid_credentials'));
    } finally {
        // Сбрасываем состояние кнопки
        if (btnText) btnText.style.opacity = '1';
        if (btnLoader) btnLoader.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
    }
}

async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            switchToMainScreen();
            loadMachineTypes();
            loadMachines();
            loadStatistics();
        } else {
            // Токен недействителен
            localStorage.removeItem('authToken');
            authToken = null;
        }
    } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        localStorage.removeItem('authToken');
        authToken = null;
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    switchToAuthScreen();
}

function switchToAuthScreen() {
    const authScreen = document.getElementById('auth-screen');
    const mainScreen = document.getElementById('main-screen');
    
    if (authScreen) authScreen.classList.add('active');
    if (mainScreen) mainScreen.classList.remove('active');
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.reset();
}

function switchToMainScreen() {
    const authScreen = document.getElementById('auth-screen');
    const mainScreen = document.getElementById('main-screen');
    
    if (authScreen) authScreen.classList.remove('active');
    if (mainScreen) mainScreen.classList.add('active');
    
    // Обновляем имя пользователя
    if (currentUser) {
        const userName = document.getElementById('user-name');
        const userAvatar = document.getElementById('user-avatar');
        
        if (userName) userName.textContent = currentUser.full_name;
        if (userAvatar) userAvatar.textContent = currentUser.full_name.charAt(0).toUpperCase();
    }
}

// Загрузка типов аппаратов
async function loadMachineTypes() {
    try {
        const response = await fetch(`${API_BASE_URL}/machine-types`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error(translate('error_load_types'));
        }
        
        machineTypes = await response.json();
        populateMachineTypesDropdown();
        
    } catch (error) {
        console.error(translate('error_load_types'), error);
    }
}

function populateMachineTypesDropdown() {
    const select = document.getElementById('machine-type');
    if (!select) return;
    
    select.innerHTML = '<option value="">Выберите тип</option>';
    
    machineTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.type_id;
        option.textContent = type.type_name;
        select.appendChild(option);
    });
}

// Навигация по разделам
function switchSection(section) {
    // Обновляем активные элементы навигации
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`.nav-item[data-section="${section}"]`);
    if (activeNavItem) activeNavItem.classList.add('active');
    
    // Обновляем заголовок страницы
    updatePageTitles();
    
    // Показываем соответствующий раздел
    document.querySelectorAll('.content-section').forEach(sectionEl => {
        sectionEl.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${section}-section`);
    if (targetSection) targetSection.classList.add('active');
    
    // Загружаем данные для раздела
    if (section === 'machines') {
        loadMachines();
        loadStatistics();
    } else if (section === 'calendar') {
        loadCalendar();
    } else if (section === 'schedule') {
        loadSchedule();
    }
}

// Функции для работы с аппаратами
function showAddMachineForm() {
    const addMachineForm = document.getElementById('add-machine-form');
    if (addMachineForm) addMachineForm.style.display = 'flex';
}

function hideAddMachineForm() {
    const addMachineForm = document.getElementById('add-machine-form');
    if (addMachineForm) addMachineForm.style.display = 'none';
    
    const machineForm = document.getElementById('machine-form');
    if (machineForm) machineForm.reset();
    
    // Сбрасываем даты на текущие
    const today = new Date().toISOString().split('T')[0];
    const manufactureDate = document.getElementById('manufacture-date');
    const commissioningDate = document.getElementById('commissioning-date');
    
    if (manufactureDate) manufactureDate.value = today;
    if (commissioningDate) commissioningDate.value = today;
}

async function handleAddMachine(e) {
    e.preventDefault();
    
    const machineData = {
        serial_number: document.getElementById('serial-number').value,
        inventory_number: document.getElementById('inventory-number').value,
        location: document.getElementById('location').value,
        model: document.getElementById('model').value,
        type_id: parseInt(document.getElementById('machine-type').value),
        manufacturer: document.getElementById('manufacturer').value,
        manufacture_date: document.getElementById('manufacture-date').value,
        commissioning_date: document.getElementById('commissioning-date').value,
        status: document.getElementById('status').value,
        country: document.getElementById('country').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/machines`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(machineData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || translate('error_create_machine'));
        }
        
        showModal(translate('success'), translate('success_machine_added'));
        hideAddMachineForm();
        loadMachines();
        loadStatistics();
        
    } catch (error) {
        showModal(translate('error'), error.message);
    }
}

async function loadMachines() {
    try {
        const response = await fetch(`${API_BASE_URL}/machines`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error(translate('error_load_machines'));
        }
        
        machines = await response.json();
        filteredMachines = [...machines];
        renderMachinesTable();
        
    } catch (error) {
        showModal(translate('error'), translate('error_load_machines'));
    }
}

function renderMachinesTable() {
    const tbody = document.getElementById('machines-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (filteredMachines.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div style="padding: 2rem; color: var(--gray-500);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🏪</div>
                        <h3>${translate('no_machines_title')}</h3>
                        <p>${translate('no_machines_message')}</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    filteredMachines.forEach(machine => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${machine.serial_number}</td>
            <td>${machine.inventory_number}</td>
            <td>${machine.location}</td>
            <td>${machine.model}</td>
            <td class="${machine.status === 'Работает' ? 'status-working' : 'status-maintenance'}">
                ${machine.status}
            </td>
            <td>${machine.total_income.toFixed(2)} ₽</td>
            <td>
                <button class="delete-btn" data-id="${machine.machine_id}" title="${translate('table_actions')}">🗑️</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const machineId = this.getAttribute('data-id');
            deleteMachine(machineId);
        });
    });
}

async function deleteMachine(machineId) {
    if (!confirm(translate('confirm_delete'))) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/machines/${machineId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error(translate('error_delete_machine'));
        }
        
        showModal(translate('success'), translate('success_machine_deleted'));
        loadMachines();
        loadStatistics();
        
    } catch (error) {
        showModal(translate('error'), translate('error_delete_machine'));
    }
}

async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error(translate('error_load_statistics'));
        }
        
        const stats = await response.json();
        
        const totalMachines = document.getElementById('total-machines');
        const workingMachines = document.getElementById('working-machines');
        const maintenanceMachines = document.getElementById('maintenance-machines');
        const totalIncome = document.getElementById('total-income');
        
        if (totalMachines) totalMachines.textContent = stats.total_machines;
        if (workingMachines) workingMachines.textContent = stats.working_machines;
        if (maintenanceMachines) maintenanceMachines.textContent = stats.maintenance_machines;
        if (totalIncome) totalIncome.textContent = `${stats.total_income.toFixed(2)} ₽`;
        
    } catch (error) {
        console.error(translate('error_load_statistics'), error);
    }
}

// Поиск аппаратов
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
        filteredMachines = [...machines];
    } else {
        filteredMachines = machines.filter(machine => 
            machine.serial_number.toLowerCase().includes(searchTerm) ||
            machine.inventory_number.toLowerCase().includes(searchTerm) ||
            machine.location.toLowerCase().includes(searchTerm) ||
            machine.model.toLowerCase().includes(searchTerm) ||
            (machine.type_name && machine.type_name.toLowerCase().includes(searchTerm)) ||
            machine.status.toLowerCase().includes(searchTerm)
        );
    }
    
    renderMachinesTable();
}

// Функции для загрузки файлов
function triggerFileUpload() {
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.click();
}

async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch(`${API_BASE_URL}/machines/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Ошибка загрузки файла');
        }
        
        const result = await response.json();
        
        let message = 'Результаты загрузки:\n';
        result.results.forEach((item, index) => {
            message += `${item}\n`;
        });
        
        showModal('Загрузка файла', message);
        loadMachines();
        loadStatistics();
        
    } catch (error) {
        showModal('Ошибка', error.message);
    } finally {
        // Сбрасываем значение input
        e.target.value = '';
    }
}

// Функции для календаря обслуживания
function loadCalendar() {
    const container = document.getElementById('calendar-container');
    if (!container) return;
    
    const view = document.getElementById('calendar-view')?.value || 'month';
    const filter = document.getElementById('machine-filter')?.value || 'all';
    
    container.innerHTML = `
        <div class="calendar-placeholder">
            <div class="placeholder-icon">📅</div>
            <h3>${translate('calendar_title')}</h3>
            <p>${translate('calendar_description')}</p>
        </div>
    `;
}

// Функции для графика работ
function loadSchedule() {
    const container = document.getElementById('schedule-container');
    if (!container) return;
    
    const view = document.getElementById('schedule-view')?.value || 'day';
    const employee = document.getElementById('employee-filter')?.value || 'all';
    
    container.innerHTML = `
        <div class="schedule-placeholder">
            <div class="placeholder-icon">👨‍💼</div>
            <h3>${translate('schedule_title')}</h3>
            <p>${translate('schedule_description')}</p>
        </div>
    `;
}

// Экспорт данных
function exportToCSV() {
    if (machines.length === 0) {
        showModal('Экспорт', 'Нет данных для экспорта');
        return;
    }
    
    const headers = ['Серийный номер', 'Инвентарный номер', 'Местоположение', 'Модель', 'Статус', 'Доход'];
    const csvContent = [
        headers.join(','),
        ...machines.map(machine => [
            machine.serial_number,
            machine.inventory_number,
            machine.location,
            machine.model,
            machine.status,
            machine.total_income
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'vending_machines.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showModal('Экспорт', translate('success_export'));
}

// Вспомогательные функции
function showModal(title, message) {
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    if (modalOverlay) modalOverlay.style.display = 'flex';
}

function hideModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) modalOverlay.style.display = 'none';
}

// Обработка ошибок fetch
function handleFetchError(error) {
    console.error('Ошибка сети:', error);
    showModal(translate('error'), translate('error_network'));
}

