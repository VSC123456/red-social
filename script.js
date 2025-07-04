// Simulación de base de datos de usuarios
let users = JSON.parse(localStorage.getItem('users')) || [
    { 
        email: "carlos@ejemplo.com", 
        password: "123456", 
        firstName: "Carlos", 
        lastName: "Rodríguez", 
        birthDate: "1990-01-15", 
        location: "Barcelona, España",
        gender: "hombre",
        preferences: ["mujeres"],
        bio: "Me gusta el deporte y viajar. Busco alguien para compartir aventuras.",
        interests: ["deportes", "viajar", "cine"],
        profilePhoto: "https://i.ibb.co/Fbj4TP99/Imagen-de-Whats-App-2025-07-04-a-las-01-00-04-dff6a18d.jpg",
        galleryPhotos: [
            "https://i.ibb.co/wGBzd2T/Imagen-de-Whats-App-2025-07-04-a-las-01-00-04-2f8f9dda.jpg",
            "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        ]
    },
    { 
        email: "ana@ejemplo.com", 
        password: "123456", 
        firstName: "Ana", 
        lastName: "García", 
        birthDate: "1995-05-20", 
        location: "Madrid, España",
        gender: "mujer",
        preferences: ["hombres"],
        bio: "Amante de la lectura y la buena comida. Busco una relación estable.",
        interests: ["leer", "comer", "viajar"],
        profilePhoto: "https://ibb.co/f6qxXTb",
        galleryPhotos: [
            "https://ibb.co/f6qxXTb",
            "https://ibb.co/f6qxXTb"
        ]
    }
];

// Usuarios para chatear
const chatUsers = [
    {
        id: 1,
        name: "Carlos Rodríguez",
        avatar: "https://drive.google.com/uc?export=view&id=1R2Mu9jjdr3GUqb_E9bAOzllTUOkfD0tG",
        status: "En línea",
        lastMessage: "¡Hola! ¿Cómo estás?",
        time: "10:30 AM",
        unread: 2
    },
    {
        id: 2,
        name: "Ana García",
        avatar: "https://drive.google.com/uc?export=view&id=1PcGY_TB5YN6tWMbm2U6C5sIIXgYyUAJb",
        status: "En línea",
        lastMessage: "Nos vemos mañana en el café",
        time: "Ayer",
        unread: 0
    }
];

// Simulación de matches
let matches = JSON.parse(localStorage.getItem('matches')) || [];

// Mensajes de ejemplo
const chatMessages = {
    1: [
        { text: "¡Hola! ¿Cómo estás?", time: "10:30 AM", sender: "other" },
        { text: "Hola Carlos, estoy bien. ¿Y tú?", time: "10:31 AM", sender: "me" },
        { text: "Estoy genial también. ¿Quieres quedar para tomar un café?", time: "10:32 AM", sender: "other" },
        { text: "¡Claro! ¿Qué día te viene bien?", time: "10:33 AM", sender: "me" }
    ],
    2: [
        { text: "Hola Ana, ¿vamos al concierto el viernes?", time: "Ayer 4:20 PM", sender: "me" },
        { text: "¡Sí! Me encantaría. ¿A qué hora quedamos?", time: "Ayer 4:25 PM", sender: "other" },
        { text: "Podríamos encontrarnos a las 7 en la entrada principal", time: "Ayer 4:30 PM", sender: "me" },
        { text: "Perfecto, nos vemos allí entonces", time: "Ayer 4:32 PM", sender: "other" }
    ]
};

// Estadísticas del usuario
let userStats = JSON.parse(localStorage.getItem('userStats')) || {
    likesReceived: 0,
    matchesCount: 0,
    likesSent: 0,
    dislikesSent: 0,
    activity: {
        'Lunes': 12,
        'Martes': 19,
        'Miércoles': 8,
        'Jueves': 15,
        'Viernes': 23,
        'Sábado': 31,
        'Domingo': 18
    }
};

// Variables para recuperación de contraseña
let recoveryEmail = '';
let recoveryCode = '';
let currentRecoveryStep = 1;

// Variables para el sistema de perfiles
let currentProfileIndex = 0;
let displayedProfiles = [];
let currentUser = null;
let fromEditScreen = false;
let userProfilePhoto = null;
let editProfilePhoto = null;
let currentChatUser = null;
let currentCarouselIndex = 0;
let carouselInterval = null;

// Mostrar pantalla específica
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'mainScreen' && fromEditScreen) {
        showNotification('Perfil actualizado con éxito');
        fromEditScreen = false;
    } else if (screenId === 'mainScreen') {
        loadProfiles();
    }
    
    if (screenId === 'chatListScreen') {
        loadChatList();
    }
    
    if (screenId === 'statsScreen') {
        loadStats();
    }

    if (screenId === 'matchesScreen') {
        loadMatches();
    }

    if (screenId === 'recoveryScreen') {
        resetRecoverySteps();
    }
}

// Función para cargar perfiles en el feed
function loadProfiles() {
    const profilesContainer = document.getElementById('profilesContainer');
    const noProfilesMessage = document.getElementById('noProfilesMessage');
    const actions = document.querySelector('.actions');
    
    profilesContainer.innerHTML = '';
    
    // Filtrar perfiles disponibles (excluyendo al usuario actual)
    displayedProfiles = users.filter(user => 
        user.email !== (currentUser ? currentUser.email : null)
    );
    
    if (displayedProfiles.length === 0) {
        noProfilesMessage.style.display = 'block';
        actions.style.display = 'none';
        return;
    }
    
    noProfilesMessage.style.display = 'none';
    actions.style.display = 'flex';
    currentProfileIndex = 0;
    
    // Mostrar el primer perfil
    showCurrentProfile();
}

// Función para mostrar el perfil actual
function showCurrentProfile() {
    const profilesContainer = document.getElementById('profilesContainer');
    
    profilesContainer.innerHTML = '';
    
    if (currentProfileIndex >= displayedProfiles.length) {
        loadProfiles(); // Recargar si llegamos al final
        return;
    }
    
    const profile = displayedProfiles[currentProfileIndex];
    const profileCard = document.createElement('div');
    profileCard.className = 'profile-card swipe-transition';
    profileCard.innerHTML = `
        <div class="carousel">
            <div class="carousel-inner">
                <div class="carousel-item">
                    <img src="${profile.profilePhoto}" alt="${profile.firstName}">
                </div>
            </div>
        </div>
        <div class="profile-info">
            <h2 class="profile-name">
                <span>${profile.firstName}</span> <span>${profile.lastName}</span>, 
                <span class="profile-age">${calculateAge(profile.birthDate)}</span>
            </h2>
            <p class="profile-bio">${profile.bio}</p>
            <div class="profile-location">
                <i class="fas fa-map-marker-alt"></i> <span>${profile.location}</span>
            </div>
            <div class="profile-interests">
                <i class="fas fa-heart" style="color: #ff758c;"></i>
                <span style="font-size: 14px; color: #666;">
                    Intereses: ${getInterestsText(profile.interests)}
                </span>
            </div>
        </div>
    `;
    profilesContainer.appendChild(profileCard);
}

// Cargar lista de matches
function loadMatches() {
    const matchesList = document.getElementById('matchesList');
    const noMatchesMessage = document.getElementById('noMatchesMessage');
    
    matchesList.innerHTML = '';
    
    if (matches.length === 0) {
        noMatchesMessage.style.display = 'block';
        return;
    }
    
    noMatchesMessage.style.display = 'none';
    
    matches.forEach(match => {
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';
        matchItem.dataset.matchId = match.id;
        matchItem.innerHTML = `
            <div class="match-item-avatar">
                ${match.avatar ? 
                    `<img src="${match.avatar}" alt="${match.name}">` : 
                    `<i class="fas fa-user"></i>`}
            </div>
            <div class="match-item-info">
                <div class="match-item-name">${match.name}</div>
                <div class="match-item-interests">Intereses: ${match.interests.join(', ')}</div>
                <div class="match-item-time">Match el ${formatDate(match.matchDate)}</div>
            </div>
            <button class="match-chat-btn" data-match-id="${match.id}">
                <i class="fas fa-comment"></i> Chatear
            </button>
        `;
        
        matchesList.appendChild(matchItem);
        
        matchItem.querySelector('.match-chat-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const matchId = parseInt(e.target.closest('.match-chat-btn').dataset.matchId);
            const match = matches.find(m => m.id === matchId);
            if (match) {
                openChatFromMatch(match);
            }
        });
    });
}

// Formatear fecha
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Abrir chat desde match
function openChatFromMatch(match) {
    let chatUser = chatUsers.find(u => u.name === match.name);
    
    if (!chatUser) {
        chatUser = {
            id: chatUsers.length + 1,
            name: match.name,
            avatar: match.avatar,
            status: "En línea",
            lastMessage: "¡Hiciste match con esta persona!",
            time: "Ahora",
            unread: 0
        };
        
        chatUsers.push(chatUser);
        chatMessages[chatUser.id] = [
            { text: "¡Hiciste match con esta persona!", time: "Ahora", sender: "system" }
        ];
    }
    
    openChat(chatUser);
}

// Reiniciar pasos de recuperación
function resetRecoverySteps() {
    currentRecoveryStep = 1;
    updateRecoveryStepsUI();
    document.getElementById('recoveryStep1').style.display = 'block';
    document.getElementById('recoveryStep2').style.display = 'none';
    document.getElementById('recoveryStep3').style.display = 'none';
    document.getElementById('recoveryEmail').value = '';
    document.getElementById('recoveryCode').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// Actualizar UI de pasos de recuperación
function updateRecoveryStepsUI() {
    document.getElementById('step1').className = 'recovery-step';
    document.getElementById('step2').className = 'recovery-step';
    document.getElementById('step3').className = 'recovery-step';

    if (currentRecoveryStep === 1) {
        document.getElementById('step1').className = 'recovery-step active';
    } else if (currentRecoveryStep === 2) {
        document.getElementById('step1').className = 'recovery-step completed';
        document.getElementById('step2').className = 'recovery-step active';
    } else if (currentRecoveryStep === 3) {
        document.getElementById('step1').className = 'recovery-step completed';
        document.getElementById('step2').className = 'recovery-step completed';
        document.getElementById('step3').className = 'recovery-step active';
    }
}

// Cargar estadísticas
function loadStats() {
    document.getElementById('likesReceived').textContent = userStats.likesReceived;
    document.getElementById('matchesCount').textContent = userStats.matchesCount;
    document.getElementById('likesSent').textContent = userStats.likesSent;
    document.getElementById('dislikesSent').textContent = userStats.dislikesSent;
    
    document.getElementById('likesProgress').style.width = 
        Math.min(userStats.likesReceived, 100) + '%';
    document.getElementById('matchesProgress').style.width = 
        Math.min(userStats.matchesCount * 20, 100) + '%';
    
    const activityChart = document.getElementById('activityChart');
    activityChart.innerHTML = '';
    
    const maxValue = Math.max(...Object.values(userStats.activity));
    
    for (const [day, value] of Object.entries(userStats.activity)) {
        const heightPercentage = (value / maxValue) * 100;
        
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = heightPercentage + '%';
        bar.innerHTML = `
            <div class="chart-value">${value}</div>
            <div class="chart-label">${day.substring(0, 3)}</div>
        `;
        
        activityChart.appendChild(bar);
    }
}

// Cargar lista de chats
function loadChatList() {
    const chatList = document.getElementById('chatList');
    const noChatsMessage = document.getElementById('noChatsMessage');
    
    chatList.innerHTML = '';
    
    if (chatUsers.length === 0) {
        noChatsMessage.style.display = 'block';
        return;
    }
    
    noChatsMessage.style.display = 'none';
    
    chatUsers.forEach(user => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.dataset.userId = user.id;
        chatItem.innerHTML = `
            <div class="chat-item-avatar">
                ${user.avatar ? 
                    `<img src="${user.avatar}" alt="${user.name}">` : 
                    `<i class="fas fa-user"></i>`}
            </div>
            <div class="chat-item-info">
                <div class="chat-item-name">${user.name}</div>
                <div class="chat-item-last-message">${user.lastMessage}</div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
                <div class="chat-item-time">${user.time}</div>
                ${user.unread > 0 ? `<div class="unread-badge">${user.unread}</div>` : ''}
            </div>
        `;
        
        chatItem.addEventListener('click', () => openChat(user));
        chatList.appendChild(chatItem);
    });
}

// Abrir chat con un usuario
function openChat(user) {
    currentChatUser = user;
    document.getElementById('chatUserName').textContent = user.name;
    document.getElementById('chatStatus').textContent = user.status;
    
    const chatUserAvatar = document.getElementById('chatUserAvatar');
    chatUserAvatar.innerHTML = '';
    if (user.avatar) {
        const img = document.createElement('img');
        img.src = user.avatar;
        img.alt = user.name;
        chatUserAvatar.appendChild(img);
    } else {
        const icon = document.createElement('i');
        icon.className = 'fas fa-user';
        chatUserAvatar.appendChild(icon);
    }
    
    loadChatMessages(user.id);
    showScreen('chatScreen');
}

// Cargar mensajes del chat
function loadChatMessages(userId) {
    const chatMessagesContainer = document.getElementById('chatMessages');
    chatMessagesContainer.innerHTML = '';
    
    const messages = chatMessages[userId] || [];
    
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${msg.sender === 'me' ? 'sent' : 'received'}`;
        messageElement.innerHTML = `
            <div>${msg.text}</div>
            <div class="message-time">${msg.time}</div>
        `;
        chatMessagesContainer.appendChild(messageElement);
    });
    
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Enviar mensaje
function sendMessage() {
    const input = document.getElementById('chatInput');
    const messageText = input.value.trim();
    
    if (messageText === '') return;
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    const newMessage = {
        text: messageText,
        time: time,
        sender: 'me'
    };
    
    if (!chatMessages[currentChatUser.id]) {
        chatMessages[currentChatUser.id] = [];
    }
    chatMessages[currentChatUser.id].push(newMessage);
    
    input.value = '';
    loadChatMessages(currentChatUser.id);
    
    setTimeout(() => {
        const responses = [
            "¡Qué interesante!",
            "Estoy de acuerdo contigo",
            "¿Y qué piensas hacer?",
            "Me encantaría saber más",
            "Esa es una buena idea"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage = {
            text: randomResponse,
            time: `${hours}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`,
            sender: 'other'
        };
        
        chatMessages[currentChatUser.id].push(responseMessage);
        loadChatMessages(currentChatUser.id);
    }, 2000);
}

// Calcular edad a partir de la fecha de nacimiento
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    
    if (isNaN(birth.getTime())) return null;
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// Actualizar la visualización de la edad
function updateAgeDisplay() {
    const birthDate = document.getElementById('regBirthDate').value;
    const age = calculateAge(birthDate);
    
    if (age !== null) {
        document.getElementById('ageDisplay').textContent = age;
    } else {
        document.getElementById('ageDisplay').textContent = '--';
    }
}

// Mostrar una notificación
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notificationMessage');
    
    messageElement.textContent = message;
    
    if (isError) {
        notification.classList.add('error');
        notification.querySelector('i').className = 'fas fa-exclamation-circle';
    } else {
        notification.classList.remove('error');
        notification.querySelector('i').className = 'fas fa-check-circle';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Manejar la subida de fotos
function handleProfilePhotoUpload(event, previewId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            preview.innerHTML = '';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
            
            if (previewId === 'profilePreview') {
                userProfilePhoto = e.target.result;
            } else if (previewId === 'editProfilePreview') {
                editProfilePhoto = e.target.result;
            }
        }
        reader.readAsDataURL(file);
    }
}

// Manejar la subida de fotos para la galería
function handleGalleryPhotoUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const galleryGrid = document.getElementById('galleryGrid');
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            
            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                galleryItem.remove();
            });
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(deleteBtn);
            galleryGrid.appendChild(galleryItem);
            
            if (currentUser) {
                if (!currentUser.galleryPhotos) {
                    currentUser.galleryPhotos = [];
                }
                currentUser.galleryPhotos.push(e.target.result);
            }
        }
        
        reader.readAsDataURL(file);
    }
}

// Cargar galería de fotos
function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';
    
    if (currentUser && currentUser.galleryPhotos && currentUser.galleryPhotos.length > 0) {
        currentUser.galleryPhotos.forEach(photo => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = photo;
            
            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                const index = currentUser.galleryPhotos.indexOf(photo);
                if (index !== -1) {
                    currentUser.galleryPhotos.splice(index, 1);
                }
                galleryItem.remove();
            });
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(deleteBtn);
            galleryGrid.appendChild(galleryItem);
        });
    } else {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.gridColumn = '1 / span 3';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '20px';
        emptyMsg.style.color = '#777';
        emptyMsg.innerHTML = '<p>No hay fotos en tu galería aún</p>';
        galleryGrid.appendChild(emptyMsg);
    }
}

// Cargar intereses del usuario en el formulario de edición
function loadUserInterests() {
    if (!currentUser) return;

    document.querySelectorAll('#editInterestsGrid .interest-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.parentElement.classList.remove('selected');
    });

    if (currentUser.interests) {
        currentUser.interests.forEach(interest => {
            const checkbox = document.querySelector(`#editInterestsGrid .interest-checkbox[value="${interest}"]`);
            if (checkbox) {
                checkbox.checked = true;
                checkbox.parentElement.classList.add('selected');
            }
        });
    }

    if (currentUser.gender) {
        if (currentUser.gender === 'hombre') {
            document.getElementById('editMaleBtn').classList.add('selected');
            document.getElementById('editGender').value = 'hombre';
        } else if (currentUser.gender === 'mujer') {
            document.getElementById('editFemaleBtn').classList.add('selected');
            document.getElementById('editGender').value = 'mujer';
        }
    }

    document.querySelectorAll('#editPreferencesGrid .preference-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.parentElement.classList.remove('selected');
    });

    if (currentUser.preferences) {
        currentUser.preferences.forEach(preference => {
            const checkbox = document.querySelector(`#editPreferencesGrid .preference-checkbox[value="${preference}"]`);
            if (checkbox) {
                checkbox.checked = true;
                checkbox.parentElement.classList.add('selected');
            }
        });
    }
}

// Obtener intereses seleccionados
function getSelectedInterests(containerId) {
    const checkboxes = document.querySelectorAll(`#${containerId} .interest-checkbox:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Obtener preferencias seleccionadas
function getSelectedPreferences(containerId) {
    const checkboxes = document.querySelectorAll(`#${containerId} .preference-checkbox:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Generar texto de intereses para mostrar en el perfil
function getInterestsText(interests) {
    if (!interests || interests.length === 0) return '';

    const interestNames = {
        'deportes': 'Deportes',
        'cine': 'Cine',
        'salidas': 'Salidas',
        'comer': 'Comer',
        'leer': 'Leer',
        'bailar': 'Bailar',
        'tomar': 'Tomar',
        'viajar': 'Viajar'
    };

    return interests.map(interest => interestNames[interest] || interest).join(', ');
}

// Enviar código de recuperación (simulado)
function sendRecoveryCode(email) {
    recoveryEmail = email;
    recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    showNotification(`Se ha enviado un código a ${email}. En este demo, el código es: ${recoveryCode}`);
    currentRecoveryStep = 2;
    updateRecoveryStepsUI();
    document.getElementById('recoveryStep1').style.display = 'none';
    document.getElementById('recoveryStep2').style.display = 'block';
}

// Verificar código de recuperación
function verifyRecoveryCode(code) {
    if (code === recoveryCode) {
        currentRecoveryStep = 3;
        updateRecoveryStepsUI();
        document.getElementById('recoveryStep2').style.display = 'none';
        document.getElementById('recoveryStep3').style.display = 'block';
        return true;
    } else {
        showError('recoveryCodeError', 'Código incorrecto. Por favor intenta nuevamente.');
        return false;
    }
}

// Cambiar contraseña
function changePassword(newPassword) {
    const userIndex = users.findIndex(u => u.email === recoveryEmail);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        showNotification('Contraseña actualizada correctamente. Ahora puedes iniciar sesión.');
        showScreen('loginScreen');
        return true;
    } else {
        showNotification('No se encontró una cuenta con ese correo electrónico.', true);
        return false;
    }
}

// Función para leer la imagen como base64
function leerFotoComoBase64(inputFile, callback) {
    const file = inputFile.files[0];
    if (!file) return callback(null);
    const reader = new FileReader();
    reader.onload = function(e) {
        callback(e.target.result); // base64
    };
    reader.readAsDataURL(file);
}

// Guardar usuario en localStorage
function guardarUsuario(usuario) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Mostrar datos del último usuario registrado (sin mostrar JSON)
function mostrarUltimoUsuario() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (usuarios.length === 0) {
        alert('No hay usuarios registrados.');
        return;
    }
    const u = usuarios[usuarios.length - 1];
    // Crea una ventana modal sencilla
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';

    modal.innerHTML = `
        <div style="background:#fff;padding:30px;border-radius:10px;max-width:350px;text-align:center;position:relative;">
            <button id="cerrarModal" style="position:absolute;top:10px;right:10px;font-size:18px;">&times;</button>
            <h2>${u.nombre} ${u.apellido}</h2>
            <img src="${u.fotoPerfil || ''}" alt="Foto" style="width:100px;height:100px;border-radius:50%;object-fit:cover;margin:10px 0;">
            <p><strong>Email:</strong> ${u.email}</p>
            <p><strong>Ubicación:</strong> ${u.ubicacion}</p>
            <p><strong>Sexo:</strong> ${u.sexo}</p>
            <p><strong>Preferencias:</strong> ${u.preferencias.join(', ')}</p>
            <p><strong>Intereses:</strong> ${u.intereses.join(', ')}</p>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('cerrarModal').onclick = () => modal.remove();
}

// Evento para el botón de registro
document.getElementById('registerBtn').addEventListener('click', function() {
    const nombre = document.getElementById('regFirstName').value;
    const apellido = document.getElementById('regLastName').value;
    const email = document.getElementById('regEmail').value;
    const ubicacion = document.getElementById('regLocation').value;
    const sexo = document.getElementById('regGender').value;
    const preferencias = Array.from(document.querySelectorAll('input[name="preferences"]:checked')).map(e => e.value);
    const intereses = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(e => e.value);

    leerFotoComoBase64(document.getElementById('profilePhoto'), function(fotoBase64) {
        const usuario = {
            nombre,
            apellido,
            email,
            ubicacion,
            sexo,
            preferencias,
            intereses,
            fotoPerfil: fotoBase64 || ''
        };
        guardarUsuario(usuario);
        alert('¡Usuario registrado localmente!');
    });
});

// Agrega un botón para mostrar el último usuario registrado
if (!document.getElementById('verUltimoUsuarioBtn')) {
    const btn = document.createElement('button');
    btn.textContent = 'Ver último usuario registrado';
    btn.id = 'verUltimoUsuarioBtn';
    btn.className = 'btn btn-secondary';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.onclick = mostrarUltimoUsuario;
    document.body.appendChild(btn);
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 25);
    const formattedDate = birthDate.toISOString().split('T')[0];
    document.getElementById('regBirthDate').value = formattedDate;
    updateAgeDisplay();
    
    document.getElementById('editBirthDate').value = '1998-05-15';
    
    setTimeout(() => {
        showNotification('¡Bienvenido a Mini Tinder!');
    }, 1000);
    
    // Aquí van TODOS los addEventListener y el código que accede al DOM

    // Ejemplo:
    document.getElementById('registerBtn').addEventListener('click', function() {
        // ...tu código de registro...
    });

    // ...el resto de tus listeners y lógica de inicialización...
});

// Validación de formulario de login
document.getElementById('loginBtn').addEventListener('click', function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !validateEmail(email)) {
        showError('loginEmailError', 'Por favor ingresa un correo válido');
        return;
    } else {
        hideError('loginEmailError');
    }
    
    if (!password || password.length < 6) {
        showError('loginPasswordError', 'La contraseña debe tener al menos 6 caracteres');
        return;
    } else {
        hideError('loginPasswordError');
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        showScreen('mainScreen');
        updateProfileDisplay();
        loadProfiles();
        showNotification('¡Bienvenido de nuevo!');
    } else {
        showError('loginPasswordError', 'Correo o contraseña incorrectos');
    }
});

// Validación de formulario de registro
document.getElementById('registerBtn').addEventListener('click', function() {
    const firstName = document.getElementById('regFirstName').value;
    const lastName = document.getElementById('regLastName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const birthDate = document.getElementById('regBirthDate').value;
    const location = document.getElementById('regLocation').value;
    const gender = document.getElementById('regGender').value;
    
    const intereses = getSelectedInterests('interestsGrid');
    const preferencias = getSelectedPreferences('preferencesGrid');
    const age = calculateAge(birthDate);
    
    let valid = true;
    
    if (!firstName) {
        showError('regFirstNameError', 'Por favor ingresa tu nombre');
        valid = false;
    } else {
        hideError('regFirstNameError');
    }
    
    if (!lastName) {
        showError('regLastNameError', 'Por favor ingresa tu apellido');
        valid = false;
    } else {
        hideError('regLastNameError');
    }
    
    if (!email || !validateEmail(email)) {
        showError('regEmailError', 'Por favor ingresa un correo válido');
        valid = false;
    } else {
        hideError('regEmailError');
    }
    
    if (!password || password.length < 6) {
        showError('regPasswordError', 'La contraseña debe tener al menos 6 caracteres');
        valid = false;
    } else {
        hideError('regPasswordError');
    }
    
    if (!birthDate) {
        showError('regBirthDateError', 'Por favor ingresa tu fecha de nacimiento');
        valid = false;
    } else if (age === null) {
        showError('regBirthDateError', 'Fecha de nacimiento inválida');
        valid = false;
    } else if (age < 18) {
        showError('regBirthDateError', 'Debes tener al menos 18 años para registrarte');
        valid = false;
    } else {
        hideError('regBirthDateError');
    }

    if (!gender) {
        showError('regGenderError', 'Por favor selecciona tu sexo');
        valid = false;
    } else {
        hideError('regGenderError');
    }

    if (preferencias.length === 0) {
        showError('preferencesError', 'Por favor selecciona al menos una opción');
        valid = false;
    } else {
        hideError('preferencesError');
    }
    
    if (!location) {
        showError('regLocationError', 'Por favor ingresa tu ubicación');
        valid = false;
    } else {
        hideError('regLocationError');
    }
    
    if (valid) {
        const newUser = {
            firstName,
            lastName,
            email,
            password,
            birthDate,
            age,
            gender,
            preferencias,
            location,
            bio: "Describe tus intereses y lo que buscas",
            intereses,
            profilePhoto: userProfilePhoto,
            galleryPhotos: []
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = newUser;
        showScreen('mainScreen');
        updateProfileDisplay();
        loadProfiles();
        showNotification('¡Registro exitoso! Bienvenido a Mini Tinder');
    }
});

// Actualizar la visualización del perfil
function updateProfileDisplay() {
    if (!currentUser) return;
    
    document.getElementById('profileFirstName').textContent = currentUser.firstName;
    document.getElementById('profileLastName').textContent = currentUser.lastName;
    
    const age = calculateAge(currentUser.birthDate);
    if (age !== null) {
        document.getElementById('profileAge').textContent = age;
    }
    
    document.getElementById('profileLocation').textContent = currentUser.location;
    document.getElementById('profileBio').textContent = currentUser.bio;
    
    const interestsText = getInterestsText(currentUser.interests);
    const interestsElement = document.getElementById('profileInterests');
    if (interestsText) {
        interestsElement.innerHTML = `
            <i class="fas fa-heart" style="color: #ff758c;"></i>
            <span style="font-size: 14px; color: #666;">Intereses: ${interestsText}</span>
        `;
        interestsElement.style.display = 'block';
    } else {
        interestsElement.style.display = 'none';
    }
}

// Guardar perfil
function saveProfile() {
    if (!currentUser) return;
    
    currentUser.firstName = document.getElementById('editFirstName').value;
    currentUser.lastName = document.getElementById('editLastName').value;
    currentUser.birthDate = document.getElementById('editBirthDate').value;
    currentUser.location = document.getElementById('editLocation').value;
    currentUser.bio = document.getElementById('editBio').value;
    currentUser.gender = document.getElementById('editGender').value;
    currentUser.interests = getSelectedInterests('editInterestsGrid');
    currentUser.preferences = getSelectedPreferences('editPreferencesGrid');
    
    if (editProfilePhoto) {
        currentUser.profilePhoto = editProfilePhoto;
    }
    
    const age = calculateAge(currentUser.birthDate);
    if (age !== null) {
        currentUser.age = age;
    }
    
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    fromEditScreen = true;
    showScreen('mainScreen');
    updateProfileDisplay();
}

// Cerrar sesión
function logout() {
    currentUser = null;
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    showScreen('loginScreen');
    showNotification('Has cerrado sesión correctamente');
}

// Funciones de utilidad
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'none';
}

// Event Listeners
document.getElementById('showRegisterBtn').addEventListener('click', () => {
    showScreen('registerScreen');
});

document.getElementById('backToLoginBtn').addEventListener('click', () => {
    showScreen('loginScreen');
});

document.getElementById('showRecoveryBtn').addEventListener('click', () => {
    showScreen('recoveryScreen');
});

document.getElementById('cancelRecoveryBtn').addEventListener('click', () => {
    showScreen('loginScreen');
});

document.getElementById('sendRecoveryCodeBtn').addEventListener('click', () => {
    const email = document.getElementById('recoveryEmail').value;
    
    if (!email || !validateEmail(email)) {
        showError('recoveryEmailError', 'Por favor ingresa un correo válido');
        return;
    } else {
        hideError('recoveryEmailError');
    }
    
    sendRecoveryCode(email);
});

document.getElementById('backToStep1Btn').addEventListener('click', () => {
    currentRecoveryStep = 1;
    updateRecoveryStepsUI();
    document.getElementById('recoveryStep2').style.display = 'none';
    document.getElementById('recoveryStep1').style.display = 'block';
});

document.getElementById('verifyRecoveryCodeBtn').addEventListener('click', () => {
    const code = document.getElementById('recoveryCode').value;
    
    if (!code || code.length !== 6) {
        showError('recoveryCodeError', 'Por favor ingresa un código válido de 6 dígitos');
        return;
    } else {
        hideError('recoveryCodeError');
    }
    
    verifyRecoveryCode(code);
});

document.getElementById('backToStep2Btn').addEventListener('click', () => {
    currentRecoveryStep = 2;
    updateRecoveryStepsUI();
    document.getElementById('recoveryStep3').style.display = 'none';
    document.getElementById('recoveryStep2').style.display = 'block';
});

document.getElementById('saveNewPasswordBtn').addEventListener('click', () => {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!newPassword || newPassword.length < 6) {
        showError('newPasswordError', 'La contraseña debe tener al menos 6 caracteres');
        return;
    } else {
        hideError('newPasswordError');
    }
    
    if (newPassword !== confirmPassword) {
        showError('confirmPasswordError', 'Las contraseñas no coinciden');
        return;
    } else {
        hideError('confirmPasswordError');
    }
    
    changePassword(newPassword);
});

document.getElementById('editProfileBtn').addEventListener('click', () => {
    if (currentUser) {
        document.getElementById('editFirstName').value = currentUser.firstName;
        document.getElementById('editLastName').value = currentUser.lastName;
        document.getElementById('editBirthDate').value = currentUser.birthDate;
        document.getElementById('editLocation').value = currentUser.location;
        document.getElementById('editBio').value = currentUser.bio;
        document.getElementById('editGender').value = currentUser.gender || '';
        
        const editPreview = document.getElementById('editProfilePreview');
        editPreview.innerHTML = '';
        
        if (currentUser.profilePhoto) {
            const img = document.createElement('img');
            img.src = currentUser.profilePhoto;
            editPreview.appendChild(img);
        } else {
            const icon = document.createElement('i');
            icon.className = 'fas fa-user default-avatar';
            editPreview.appendChild(icon);
        }
        
        loadGallery();
        loadUserInterests();
    }
    
    showScreen('editProfileScreen');
});

document.getElementById('cancelEditBtn').addEventListener('click', () => {
    showScreen('mainScreen');
});

document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);

document.getElementById('regBirthDate').addEventListener('change', updateAgeDisplay);

document.getElementById('uploadTrigger').addEventListener('click', () => {
    document.getElementById('profilePhoto').click();
});

document.getElementById('editUploadTrigger').addEventListener('click', () => {
    document.getElementById('editProfilePhoto').click();
});

document.getElementById('profilePhoto').addEventListener('change', (e) => {
    handleProfilePhotoUpload(e, 'profilePreview');
});

document.getElementById('editProfilePhoto').addEventListener('change', (e) => {
    handleProfilePhotoUpload(e, 'editProfilePreview');
});

document.getElementById('addGalleryPhoto').addEventListener('click', () => {
    document.getElementById('galleryPhoto').click();
});

document.getElementById('galleryPhoto').addEventListener('change', handleGalleryPhotoUpload);

document.querySelectorAll('.interest-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            this.parentElement.classList.add('selected');
        } else {
            this.parentElement.classList.remove('selected');
        }
    });
});

document.querySelectorAll('.preference-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            this.parentElement.classList.add('selected');
        } else {
            this.parentElement.classList.remove('selected');
        }
    });
});

document.getElementById('maleBtn').addEventListener('click', function() {
    document.getElementById('maleBtn').classList.add('selected');
    document.getElementById('femaleBtn').classList.remove('selected');
    document.getElementById('regGender').value = 'hombre';
    hideError('regGenderError');
});

document.getElementById('femaleBtn').addEventListener('click', function() {
    document.getElementById('femaleBtn').classList.add('selected');
    document.getElementById('maleBtn').classList.remove('selected');
    document.getElementById('regGender').value = 'mujer';
    hideError('regGenderError');
});

document.getElementById('editMaleBtn').addEventListener('click', function() {
    document.getElementById('editMaleBtn').classList.add('selected');
    document.getElementById('editFemaleBtn').classList.remove('selected');
    document.getElementById('editGender').value = 'hombre';
});

document.getElementById('editFemaleBtn').addEventListener('click', function() {
    document.getElementById('editFemaleBtn').classList.add('selected');
    document.getElementById('editMaleBtn').classList.remove('selected');
    document.getElementById('editGender').value = 'mujer';
});

document.getElementById('chatBtn').addEventListener('click', () => {
    showScreen('matchesScreen');
});

document.getElementById('backFromChatListBtn').addEventListener('click', () => {
    showScreen('mainScreen');
});

document.getElementById('backFromChatBtn').addEventListener('click', () => {
    showScreen('chatListScreen');
});

document.getElementById('sendBtn').addEventListener('click', sendMessage);

document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('statsBtn').addEventListener('click', () => {
    showScreen('statsScreen');
});

document.getElementById('backFromStatsBtn').addEventListener('click', () => {
    showScreen('mainScreen');
});

document.getElementById('logoutBtn').addEventListener('click', logout);

document.getElementById('backFromMatchesBtn').addEventListener('click', () => {
    showScreen('mainScreen');
});

document.getElementById('likeBtn').addEventListener('click', () => {
    if (displayedProfiles.length === 0) return;
    
    const profileCard = document.querySelector('.profile-card');
    profileCard.classList.add('swipe-right');
    
    userStats.likesSent++;
    
    if (Math.random() > 0.8) {
        userStats.matchesCount += 1;
        
        const currentProfile = displayedProfiles[currentProfileIndex];
        const newMatch = {
            id: matches.length + 1,
            name: `${currentProfile.firstName} ${currentProfile.lastName}`,
            avatar: currentProfile.profilePhoto,
            interests: currentProfile.interests,
            matchDate: new Date().toISOString().split('T')[0]
        };
        
        matches.push(newMatch);
        localStorage.setItem('matches', JSON.stringify(matches));
        
        showNotification('¡Nuevo match!');
    }
    
    localStorage.setItem('userStats', JSON.stringify(userStats));
    
    setTimeout(() => {
        currentProfileIndex++;
        showCurrentProfile();
    }, 500);
});

document.getElementById('dislikeBtn').addEventListener('click', () => {
    if (displayedProfiles.length === 0) return;
    
    const profileCard = document.querySelector('.profile-card');
    profileCard.classList.add('swipe-left');
    
    userStats.dislikesSent++;
    localStorage.setItem('userStats', JSON.stringify(userStats));
    
    setTimeout(() => {
        currentProfileIndex++;
        showCurrentProfile();
    }, 500);
});