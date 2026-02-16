// ============================================
// IskoArena Admin Dashboard - Main Script
// ============================================

// ============================================
// Authentication Management
// ============================================

class AuthManager {
    // Initialize admin accounts if not exists
    static initializeAdmins() {
        if (!localStorage.getItem('iskoarenaAdmins')) {
            const defaultAdmins = [
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    fullName: 'Administrator',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('iskoarenaAdmins', JSON.stringify(defaultAdmins));
        }
    }

    // Get all admins
    static getAllAdmins() {
        return JSON.parse(localStorage.getItem('iskoarenaAdmins')) || [];
    }

    // Check if username exists
    static usernameExists(username) {
        return this.getAllAdmins().some(admin => admin.username === username);
    }

    // Register new admin
    static registerAdmin(fullName, username, password) {
        if (this.usernameExists(username)) {
            return { success: false, message: 'Username already exists' };
        }

        const admins = this.getAllAdmins();
        const newAdmin = {
            id: Date.now(),
            username,
            password,
            fullName,
            createdAt: new Date().toISOString()
        };

        admins.push(newAdmin);
        localStorage.setItem('iskoarenaAdmins', JSON.stringify(admins));
        return { success: true, message: 'Account created successfully! You can now login.' };
    }

    // Verify login credentials
    static verifyLogin(username, password) {
        const admin = this.getAllAdmins().find(a => a.username === username && a.password === password);
        return admin || null;
    }
}


class DataManager {
    // Initialize default data structure
    static initializeData() {
        if (!localStorage.getItem('iskoarenaData')) {
            const defaultData = {
                matches: [],
                teams: [],
                players: [],
                results: [],
                media: [],
                notifications: [],
                user: {
                    username: 'admin',
                    name: 'Administrator'
                }
            };
            localStorage.setItem('iskoarenaData', JSON.stringify(defaultData));
        }
    }

    // Get all data
    static getData() {
        return JSON.parse(localStorage.getItem('iskoarenaData'));
    }

    // Save all data
    static saveData(data) {
        localStorage.setItem('iskoarenaData', JSON.stringify(data));
    }

    // Get specific data type
    static get(type) {
        const data = this.getData();
        return data[type] || [];
    }

    // Add item
    static add(type, item) {
        const data = this.getData();
        item.id = Date.now();
        item.createdAt = new Date().toISOString();
        data[type].push(item);
        this.saveData(data);
        return item;
    }

    // Delete item
    static delete(type, id) {
        const data = this.getData();
        data[type] = data[type].filter(item => item.id !== id);
        this.saveData(data);
    }

    // Update item
    static update(type, id, updatedItem) {
        const data = this.getData();
        const index = data[type].findIndex(item => item.id === id);
        if (index !== -1) {
            data[type][index] = { ...data[type][index], ...updatedItem };
            this.saveData(data);
        }
    }
}

// ============================================
// UI Manager
// ============================================

class UIManager {
    // Show page
    static showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const page = document.getElementById(pageName);
        if (page) {
            page.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`)?.classList.add('active');

        // Update page title
        const titleMap = {
            dashboard: 'Dashboard',
            matches: 'Manage Matches',
            results: 'Record Results',
            media: 'Media Upload',
            teams: 'Teams & Players',
            notifications: 'Notifications',
            archives: 'Archives'
        };
        document.getElementById('pageTitle').textContent = titleMap[pageName] || 'Dashboard';

        // Close sidebar on mobile
        if (window.innerWidth < 768) {
            document.body.classList.remove('sidebar-open');
        }
    }

    // Show modal
    static showModal(title, message, confirmCallback) {
        const modal = document.getElementById('modal');
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        modal.classList.add('active');

        document.getElementById('modalConfirm').onclick = () => {
            confirmCallback();
            this.closeModal();
        };
    }

    // Close modal
    static closeModal() {
        document.getElementById('modal').classList.remove('active');
    }

    // Show success message
    static showSuccess(message) {
        console.log('✓ ' + message);
        // Could be enhanced with toast notifications
    }

    // Show error message
    static showError(message) {
        console.error('✗ ' + message);
        alert('Error: ' + message);
    }
}

// ============================================
// Dashboard Functions
// ============================================

function updateDashboardStats() {
    const matches = DataManager.get('matches');
    const teams = DataManager.get('teams');
    const players = DataManager.get('players');
    const results = DataManager.get('results');

    // Calculate ongoing matches
    const now = new Date();
    const ongoingMatches = matches.filter(match => {
        const matchDateTime = new Date(`${match.date}T${match.time}`);
        // Match is ongoing if it's within 2 hours of the scheduled time and no result is recorded
        const timeDiff = now - matchDateTime;
        const hasResult = results.some(r => r.matchId === match.id);
        return timeDiff > 0 && timeDiff < 2 * 60 * 60 * 1000 && !hasResult;
    }).length;

    document.getElementById('totalMatches').textContent = matches.length;
    document.getElementById('ongoingMatches').textContent = ongoingMatches;
    document.getElementById('totalTeams').textContent = teams.length;
    document.getElementById('totalPlayers').textContent = players.length;

    // Update recent matches table
    updateRecentMatchesTable();
}

function updateRecentMatchesTable() {
    const matches = DataManager.get('matches');
    const results = DataManager.get('results');
    const tbody = document.getElementById('recentMatchesTable');

    if (matches.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No matches yet.</td></tr>';
        return;
    }

    tbody.innerHTML = matches.slice(-5).reverse().map(match => {
        const result = results.find(r => r.matchId === match.id);
        let status = 'Upcoming';
        if (result) {
            status = `<span class="badge badge-success">Completed</span>`;
        }

        return `
            <tr>
                <td>${match.sport}</td>
                <td>${match.teamA}</td>
                <td>${match.teamB}</td>
                <td>${match.date}</td>
                <td>${match.time}</td>
                <td>${status}</td>
            </tr>
        `;
    }).join('');
}

// ============================================
// Match Management Functions
// ============================================

function addMatch(e) {
    e.preventDefault();

    const match = {
        sport: document.getElementById('sport').value,
        teamA: document.getElementById('teamA').value,
        teamB: document.getElementById('teamB').value,
        date: document.getElementById('matchDate').value,
        time: document.getElementById('matchTime').value,
        venue: document.getElementById('venue').value,
        status: 'upcoming'
    };

    if (!match.sport || !match.teamA || !match.teamB || !match.date || !match.time || !match.venue) {
        UIManager.showError('Please fill in all required fields');
        return;
    }

    if (match.teamA === match.teamB) {
        UIManager.showError('Team A and Team B cannot be the same');
        return;
    }

    DataManager.add('matches', match);
    UIManager.showSuccess('Match added successfully!');
    document.getElementById('matchForm').reset();
    updateMatchesTable();
    updateDashboardStats();
    updateResultMatchDropdown();
    updateMediaMatchDropdown();
}

function deleteMatch(matchId) {
    UIManager.showModal(
        'Delete Match',
        'Are you sure you want to delete this match? This action cannot be undone.',
        () => {
            DataManager.delete('matches', matchId);
            UIManager.showSuccess('Match deleted successfully!');
            updateMatchesTable();
            updateDashboardStats();
            updateResultMatchDropdown();
        }
    );
}

function updateMatchesTable() {
    const matches = DataManager.get('matches');
    const tbody = document.getElementById('matchesTable');

    if (matches.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No matches yet.</td></tr>';
        return;
    }

    tbody.innerHTML = matches.map(match => {
        const matchDateTime = new Date(`${match.date}T${match.time}`);
        const status = matchDateTime > new Date() ? 'Upcoming' : 'Completed';

        return `
            <tr>
                <td>${match.sport}</td>
                <td>${match.teamA}</td>
                <td>${match.teamB}</td>
                <td>${match.date}</td>
                <td>${match.time}</td>
                <td>${match.venue}</td>
                <td><span class="badge ${matchDateTime > new Date() ? 'badge-warning' : 'badge-success'}">${status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small" onclick="deleteMatch(${match.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================
// Result Recording Functions
// ============================================

function updateResultMatchDropdown() {
    const matches = DataManager.get('matches');
    const select = document.getElementById('resultMatch');
    const options = '<option value="">Choose a match</option>' +
        matches.map(match => `
            <option value="${match.id}|${match.teamA}|${match.teamB}">
                ${match.sport} - ${match.teamA} vs ${match.teamB} (${match.date})
            </option>
        `).join('');
    select.innerHTML = options;
}

function onResultMatchChange() {
    const value = document.getElementById('resultMatch').value;
    const resultScoreRow = document.getElementById('resultScoreRow');
    const submitBtn = document.getElementById('submitResultBtn');

    if (value) {
        resultScoreRow.style.display = 'grid';
        submitBtn.style.display = 'inline-flex';
    } else {
        resultScoreRow.style.display = 'none';
        submitBtn.style.display = 'none';
    }
}

function recordResult(e) {
    e.preventDefault();

    const matchValue = document.getElementById('resultMatch').value;
    if (!matchValue) {
        UIManager.showError('Please select a match');
        return;
    }

    const [matchId, teamA, teamB] = matchValue.split('|');
    const scoreA = parseInt(document.getElementById('scoreTeamA').value);
    const scoreB = parseInt(document.getElementById('scoreTeamB').value);

    if (isNaN(scoreA) || isNaN(scoreB)) {
        UIManager.showError('Please enter valid scores');
        return;
    }

    const result = {
        matchId: parseInt(matchId),
        teamA,
        teamB,
        scoreA,
        scoreB,
        winner: scoreA > scoreB ? teamA : scoreB > scoreA ? teamB : 'Draw',
        sport: ''
    };

    // Get sport from match
    const match = DataManager.get('matches').find(m => m.id === parseInt(matchId));
    if (match) {
        result.sport = match.sport;
    }

    DataManager.add('results', result);
    UIManager.showSuccess('Result recorded successfully!');
    document.getElementById('resultForm').reset();
    document.getElementById('resultScoreRow').style.display = 'none';
    document.getElementById('submitResultBtn').style.display = 'none';
    updateResultsTable();
    updateDashboardStats();
}

function updateResultsTable() {
    const results = DataManager.get('results');
    const tbody = document.getElementById('resultsTable');

    if (results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No results recorded yet.</td></tr>';
        return;
    }

    tbody.innerHTML = results.map(result => {
        const winnerClass = result.winner === 'Draw' ? 'badge-warning' : 'badge-success';
        return `
            <tr>
                <td>${result.sport}</td>
                <td>${result.teamA}</td>
                <td><strong>${result.scoreA}</strong></td>
                <td><strong>${result.scoreB}</strong></td>
                <td>${result.teamB}</td>
                <td>${new Date(result.createdAt).toLocaleDateString()}</td>
                <td><span class="badge ${winnerClass}">${result.winner}</span></td>
            </tr>
        `;
    }).join('');
}

// ============================================
// Media Functions
// ============================================

function updateMediaMatchDropdown() {
    const matches = DataManager.get('matches');
    const select = document.getElementById('mediaMatch');
    const options = '<option value="">Select a match (optional)</option>' +
        matches.map(match => `
            <option value="${match.id}|${match.sport}">
                ${match.sport} - ${match.teamA} vs ${match.teamB}
            </option>
        `).join('');
    select.innerHTML = options;
}

function onMediaFileChange(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('mediaPreview');
            const previewImg = document.getElementById('previewImg');

            if (file.type.startsWith('image/')) {
                previewImg.src = event.target.result;
                previewImg.style.display = 'block';
                preview.style.display = 'block';
            } else if (file.type.startsWith('video/')) {
                previewImg.style.display = 'none';
                preview.innerHTML = `<p>✓ Video file selected: ${file.name}</p>`;
                preview.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    }
}

function uploadMedia(e) {
    e.preventDefault();

    const fileInput = document.getElementById('mediaFile');
    const file = fileInput.files[0];

    if (!file) {
        UIManager.showError('Please select a file');
        return;
    }

    const title = document.getElementById('mediaTitle').value;
    if (!title) {
        UIManager.showError('Please enter a title');
        return;
    }

    const matchValue = document.getElementById('mediaMatch').value;
    const [matchId, sport] = matchValue ? matchValue.split('|') : ['', ''];

    const reader = new FileReader();
    reader.onload = function(event) {
        const media = {
            title,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            data: event.target.result,
            fileName: file.name,
            matchId: matchId || null,
            sport: sport || '',
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        };

        DataManager.add('media', media);
        UIManager.showSuccess('Media uploaded successfully!');
        document.getElementById('mediaForm').reset();
        document.getElementById('mediaPreview').style.display = 'none';
        updateMediaGallery();
    };
    reader.readAsDataURL(file);
}

function updateMediaGallery() {
    const media = DataManager.get('media');
    const gallery = document.getElementById('mediaGallery');

    if (media.length === 0) {
        gallery.innerHTML = '<p class="empty-state">No media uploaded yet.</p>';
        return;
    }

    gallery.innerHTML = media.map(item => {
        const icon = item.type === 'image' ? '🖼️' : '🎥';
        return `
            <div class="media-item">
                <div class="media-item-preview">
                    ${item.type === 'image' ? `<img src="${item.data}" alt="${item.title}">` : icon}
                </div>
                <div class="media-item-info">
                    <div class="media-item-title">${item.title}</div>
                    <div class="media-item-meta">${item.type} • ${item.size}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// Team & Player Management Functions
// ============================================

function addTeam(e) {
    e.preventDefault();

    const team = {
        name: document.getElementById('teamName').value,
        primarySport: document.getElementById('primarySport').value
    };

    if (!team.name || !team.primarySport) {
        UIManager.showError('Please fill in all required fields');
        return;
    }

    DataManager.add('teams', team);
    UIManager.showSuccess('Team added successfully!');
    document.getElementById('teamForm').reset();
    updateTeamsTable();
    updatePlayerTeamDropdown();
    updateDashboardStats();
}

function deleteTeam(teamId) {
    UIManager.showModal(
        'Delete Team',
        'Are you sure you want to delete this team? Associated players will remain but unassigned.',
        () => {
            DataManager.delete('teams', teamId);
            UIManager.showSuccess('Team deleted successfully!');
            updateTeamsTable();
            updatePlayerTeamDropdown();
            updateDashboardStats();
        }
    );
}

function updateTeamsTable() {
    const teams = DataManager.get('teams');
    const players = DataManager.get('players');
    const tbody = document.getElementById('teamsTable');

    if (teams.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No teams yet.</td></tr>';
        return;
    }

    tbody.innerHTML = teams.map(team => {
        const playerCount = players.filter(p => p.teamId === team.id).length;
        return `
            <tr>
                <td>${team.name}</td>
                <td>${team.primarySport}</td>
                <td>${playerCount}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small" onclick="deleteTeam(${team.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function addPlayer(e) {
    e.preventDefault();

    const player = {
        name: document.getElementById('playerName').value,
        teamId: parseInt(document.getElementById('playerTeam').value),
        position: document.getElementById('playerPosition').value
    };

    if (!player.name || !player.teamId || !player.position) {
        UIManager.showError('Please fill in all required fields');
        return;
    }

    // Get team name for display
    const team = DataManager.get('teams').find(t => t.id === player.teamId);
    if (team) {
        player.teamName = team.name;
    }

    DataManager.add('players', player);
    UIManager.showSuccess('Player added successfully!');
    document.getElementById('playerForm').reset();
    updatePlayersTable();
    updateDashboardStats();
}

function deletePlayer(playerId) {
    UIManager.showModal(
        'Delete Player',
        'Are you sure you want to delete this player?',
        () => {
            DataManager.delete('players', playerId);
            UIManager.showSuccess('Player deleted successfully!');
            updatePlayersTable();
            updateDashboardStats();
        }
    );
}

function updatePlayerTeamDropdown() {
    const teams = DataManager.get('teams');
    const select = document.getElementById('playerTeam');
    const options = '<option value="">Select Team</option>' +
        teams.map(team => `<option value="${team.id}">${team.name}</option>`).join('');
    select.innerHTML = options;
}

function updatePlayersTable() {
    const players = DataManager.get('players');
    const tbody = document.getElementById('playersTable');

    if (players.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No players yet.</td></tr>';
        return;
    }

    tbody.innerHTML = players.map(player => {
        return `
            <tr>
                <td>${player.name}</td>
                <td>${player.teamName || 'Unassigned'}</td>
                <td>${player.position}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small" onclick="deletePlayer(${player.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================
// Notification Functions
// ============================================

function sendNotification(e) {
    e.preventDefault();

    const notification = {
        message: document.getElementById('notificationMessage').value,
        type: document.getElementById('notificationType').value,
        sport: document.getElementById('notificationSport').value || 'All Sports',
        timestamp: new Date().toLocaleString()
    };

    if (!notification.message || !notification.type) {
        UIManager.showError('Please fill in all required fields');
        return;
    }

    DataManager.add('notifications', notification);
    UIManager.showSuccess('Notification sent successfully!');
    document.getElementById('notificationForm').reset();
    updateNotificationsList();
}

function updateNotificationsList() {
    const notifications = DataManager.get('notifications');
    const container = document.getElementById('notificationsList');

    if (notifications.length === 0) {
        container.innerHTML = '<p class="empty-state">No notifications sent yet.</p>';
        return;
    }

    container.innerHTML = notifications.slice().reverse().map(notif => {
        let typeClass = 'success';
        if (notif.type === 'Urgent') typeClass = 'danger';
        if (notif.type === 'Sport') typeClass = 'warning';

        return `
            <div class="notification-item ${typeClass}">
                <div class="notification-header">
                    <h4 class="notification-title">${notif.type} - ${notif.sport}</h4>
                    <span class="notification-time">${notif.timestamp}</span>
                </div>
                <p class="notification-message">${notif.message}</p>
            </div>
        `;
    }).join('');
}

// ============================================
// Archives Functions
// ============================================

function filterArchives() {
    const year = document.getElementById('archiveYear').value;
    const sport = document.getElementById('archiveSport').value;

    updateArchivesTable(year, sport);
}

function updateArchivesTable(year = null, sport = null) {
    const results = DataManager.get('results');
    const tbody = document.getElementById('archivesTable');

    let filteredResults = results;

    if (year) {
        filteredResults = filteredResults.filter(r => {
            const resultYear = new Date(r.createdAt).getFullYear().toString();
            return resultYear === year;
        });
    }

    if (sport) {
        filteredResults = filteredResults.filter(r => r.sport === sport);
    }

    if (filteredResults.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No archived matches found.</td></tr>';
        return;
    }

    tbody.innerHTML = filteredResults.map(result => {
        return `
            <tr>
                <td>${result.sport}</td>
                <td>${result.teamA}</td>
                <td>${result.teamB}</td>
                <td><strong>${result.scoreA} - ${result.scoreB}</strong> (${result.winner})</td>
                <td>${new Date(result.createdAt).toLocaleDateString()}</td>
            </tr>
        `;
    }).join('');
}

function updateArchiveMediaGallery(year = null, sport = null) {
    const media = DataManager.get('media');
    const archiveMediaGallery = document.getElementById('archiveMediaGallery');

    let filteredMedia = media;

    if (year) {
        filteredMedia = filteredMedia.filter(m => {
            const mediaYear = new Date(m.createdAt).getFullYear().toString();
            return mediaYear === year;
        });
    }

    if (sport && sport !== '') {
        filteredMedia = filteredMedia.filter(m => m.sport === sport);
    }

    if (filteredMedia.length === 0) {
        archiveMediaGallery.innerHTML = '<p class="empty-state">No archived media found.</p>';
        return;
    }

    archiveMediaGallery.innerHTML = filteredMedia.map(item => {
        const icon = item.type === 'image' ? '🖼️' : '🎥';
        return `
            <div class="media-item">
                <div class="media-item-preview">
                    ${item.type === 'image' ? `<img src="${item.data}" alt="${item.title}">` : icon}
                </div>
                <div class="media-item-info">
                    <div class="media-item-title">${item.title}</div>
                    <div class="media-item-meta">${item.type} • ${item.size}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// Authentication Functions
// ============================================

function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const admin = AuthManager.verifyLogin(username, password);

    if (admin) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainDashboard').style.display = 'flex';
        document.getElementById('adminName').textContent = admin.fullName;

        // Initialize dashboard
        updateDashboardStats();
        updateMatchesTable();
        updateResultMatchDropdown();
        updateMediaMatchDropdown();
        updatePlayerTeamDropdown();
        updateNotificationsList();

        UIManager.showSuccess(`Welcome back, ${admin.fullName}!`);
    } else {
        UIManager.showError('Invalid username or password');
    }
}

function handleSignup(e) {
    e.preventDefault();

    const fullName = document.getElementById('signupFullName').value;
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const messageEl = document.getElementById('signupMessage');

    // Validation
    if (!fullName || !username || !password || !confirmPassword) {
        messageEl.textContent = 'Please fill in all fields';
        messageEl.className = 'signup-message error';
        return;
    }

    if (password.length < 6) {
        messageEl.textContent = 'Password must be at least 6 characters';
        messageEl.className = 'signup-message error';
        return;
    }

    if (password !== confirmPassword) {
        messageEl.textContent = 'Passwords do not match';
        messageEl.className = 'signup-message error';
        return;
    }

    if (username.length < 3) {
        messageEl.textContent = 'Username must be at least 3 characters';
        messageEl.className = 'signup-message error';
        return;
    }

    // Register admin
    const result = AuthManager.registerAdmin(fullName, username, password);

    if (result.success) {
        messageEl.textContent = result.message;
        messageEl.className = 'signup-message success';
        document.getElementById('signupFormElement').reset();
        
        // Switch to login after 2 seconds
        setTimeout(() => {
            toggleAuthForms();
        }, 2000);
    } else {
        messageEl.textContent = result.message;
        messageEl.className = 'signup-message error';
    }
}

function toggleAuthForms() {
    document.getElementById('loginForm').classList.toggle('active');
    document.getElementById('signupForm').classList.toggle('active');
}

function handleLogout() {
    UIManager.showModal(
        'Logout',
        'Are you sure you want to logout?',
        () => {
            document.getElementById('loginPage').style.display = 'flex';
            document.getElementById('mainDashboard').style.display = 'none';
            document.getElementById('loginForm').reset();
            UIManager.showSuccess('You have been logged out');
        }
    );
}

// ============================================
// Event Listeners & Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication
    AuthManager.initializeAdmins();

    // Initialize data
    DataManager.initializeData();

    // Login/Signup forms
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('signupFormElement').addEventListener('submit', handleSignup);
    document.getElementById('showSignupBtn').addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthForms();
    });
    document.getElementById('showLoginBtn').addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthForms();
    });

    // Nav buttons for login page
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navSignupBtn = document.getElementById('navSignupBtn');
    
    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginForm').classList.add('active');
            document.getElementById('signupForm').classList.remove('active');
        });
    }
    
    if (navSignupBtn) {
        navSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('signupForm').classList.add('active');
            document.getElementById('loginForm').classList.remove('active');
        });
    }

    // Dashboard navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            UIManager.showPage(page);
        });
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Match management
    document.getElementById('matchForm').addEventListener('submit', addMatch);

    // Result recording
    document.getElementById('resultMatch').addEventListener('change', onResultMatchChange);
    document.getElementById('resultForm').addEventListener('submit', recordResult);

    // Media upload
    document.getElementById('mediaFile').addEventListener('change', onMediaFileChange);
    document.getElementById('mediaForm').addEventListener('submit', uploadMedia);

    // Team management
    document.getElementById('teamForm').addEventListener('submit', addTeam);
    document.getElementById('playerForm').addEventListener('submit', addPlayer);

    // Notifications
    document.getElementById('notificationForm').addEventListener('submit', sendNotification);

    // Archives filter
    document.getElementById('archiveYear').addEventListener('change', filterArchives);
    document.getElementById('archiveSport').addEventListener('change', filterArchives);

    // Modal close
    document.querySelector('.modal-close').addEventListener('click', () => {
        UIManager.closeModal();
    });

    document.getElementById('modalCancel').addEventListener('click', () => {
        UIManager.closeModal();
    });

    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            UIManager.closeModal();
        }
    });

    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.body.classList.toggle('sidebar-open');
    });

    // Load mock data (optional - comment out for clean start)
    loadMockData();

    console.log('IskoArena Dashboard initialized successfully!');
});

// ============================================
// Mock Data for Demo
// ============================================

function loadMockData() {
    const data = DataManager.getData();

    // Add some mock matches if empty
    if (data.matches.length === 0) {
        const mockMatches = [
            {
                id: 1,
                sport: 'Basketball Men',
                teamA: 'COS Scions',
                teamB: 'SOM Tycoons',
                date: '2026-02-20',
                time: '14:00',
                venue: 'Sports Complex Court 1',
                status: 'upcoming',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                sport: 'Volleyball Women',
                teamA: 'CSS Stallions',
                teamB: 'CCAD Phoenix',
                date: '2026-02-21',
                time: '15:30',
                venue: 'Gymnasium A',
                status: 'upcoming',
                createdAt: new Date().toISOString()
            }
        ];

        const mockTeams = [
            {
                id: 1,
                name: 'COS Scions',
                primarySport: 'Basketball Men',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'SOM Tycoons',
                primarySport: 'Basketball Men',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'CSS Stallions',
                primarySport: 'Volleyball Women',
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                name: 'CCAD Phoenix',
                primarySport: 'Volleyball Women',
                createdAt: new Date().toISOString()
            }
        ];

        const mockPlayers = [
            {
                id: 1,
                name: 'Juan Santos',
                teamId: 1,
                teamName: 'COS Scions',
                position: 'Point Guard',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Maria Garcia',
                teamId: 1,
                teamName: 'COS Scions',
                position: 'Forward',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Carlos Reyes',
                teamId: 2,
                teamName: 'SOM Tycoons',
                position: 'Center',
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                name: 'Ana Cruz',
                teamId: 3,
                teamName: 'CSS Stallions',
                position: 'Setter',
                createdAt: new Date().toISOString()
            }
        ];

        data.matches = mockMatches;
        data.teams = mockTeams;
        data.players = mockPlayers;

        DataManager.saveData(data);
    }
}

// ============================================
// Utility Functions
// ============================================

// Format date helper
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format time helper
function formatTime(timeString) {
    return timeString.substring(0, 5); // Returns HH:MM format
}

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.body.classList.remove('sidebar-open');
    }
});
