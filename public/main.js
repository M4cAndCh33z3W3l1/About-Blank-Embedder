// --- SECURE CONFIG (PIN is now unchangeable via UI) ---
const SECRET_PIN = "1234"; 
let config = JSON.parse(localStorage.getItem('sysConfig')) || {
    panicKey: "Escape",
    panicUrl: "https://classroom.google.com",
    tabTitle: "Google Drive",
    tabIcon: "https://ssl.gstatic.com",
    idleTime: 5
};

// Apply Tab Cloak
document.title = config.tabTitle;
document.getElementById('tabIcon').href = config.tabIcon;

// --- GHOST MODE ---
let idleTimer;
const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        document.getElementById('lockScreen').style.display = "flex";
    }, config.idleTime * 60 * 1000);
};
resetIdleTimer();

function checkPin() {
    if (document.getElementById('pinInput').value === SECRET_PIN) {
        document.getElementById('lockScreen').style.display = "none";
        resetIdleTimer();
    } else { alert("ACCESS DENIED"); }
}

// --- WINDOW & TASKBAR MANAGER ---
function openWindow(type) {
    const existing = document.getElementById(`win-${type}`);
    
    // If window exists, just bring to front and show it
    if (existing) {
        existing.style.display = "block";
        existing.classList.remove('minimized');
        bringToFront(existing);
        return;
    }

    // Create Window
    const win = document.createElement('div');
    win.id = `win-${type}`;
    win.className = 'window animate-pop';
    win.style.top = '15%';
    win.style.left = '30%';

    let content = '';
    if (type === 'unblock') {
        content = `<h2>Proxy Unblocker</h2><input type="text" id="proxyInput" placeholder="Search or URL..."><button class="yellow-btn glow" onclick="launchProxy()">LAUNCH PROXY</button>`;
    } else if (type === 'embedder') {
        content = `<h2>about:blank Embedder</h2><input type="text" id="embedInput" placeholder="https://..." value="https://"><button class="yellow-btn glow" onclick="launchEmbed()">LAUNCH CLOAK</button>`;
    } else if (type === 'settings') {
        content = `
            <h2>System Settings</h2>
            <div class="settings-scroll">
                <label>Panic Key</label><input type="text" id="s_key" value="${config.panicKey}">
                <label>Panic URL</label><input type="text" id="s_purl" value="${config.panicUrl}">
                <label>Tab Title</label><input type="text" id="s_title" value="${config.tabTitle}">
                <label>Tab Icon URL</label><input type="text" id="s_icon" value="${config.tabIcon}">
                <button class="yellow-btn" onclick="saveSettings()">APPLY SYSTEM UPDATES</button>
            </div>`;
    }

    win.innerHTML = `
        <div class="window-header" onmousedown="dragElement(this.parentElement)">
            <span class="window-title-text">${type.toUpperCase()}</span>
            <div class="window-controls">
                <div class="ctrl min" onclick="toggleMin('${type}')"></div>
                <div class="ctrl max" onclick="this.parentElement.parentElement.parentElement.classList.toggle('fullscreen')"></div>
                <div class="ctrl close" onclick="closeWindow('${type}')"></div>
            </div>
        </div>
        <div class="window-body">${content}</div>
    `;

    document.getElementById('workstage').appendChild(win);
    addTaskbarIcon(type);
    bringToFront(win);
}

function addTaskbarIcon(type) {
    const bar = document.getElementById('taskbar');
    const icon = document.createElement('div');
    icon.id = `task-${type}`;
    icon.className = 'task-item';
    icon.innerHTML = `<img src="${getIconPath(type)}">`;
    icon.onclick = () => openWindow(type);
    bar.appendChild(icon);
}

function getIconPath(type) {
    if(type === 'unblock') return "https://cdn-icons-png.flaticon.com";
    if(type === 'settings') return "https://cdn-icons-png.flaticon.com";
    return "https://upload.wikimedia.org";
}

function closeWindow(type) {
    document.getElementById(`win-${type}`).remove();
    document.getElementById(`task-${type}`).remove();
}

function toggleMin(type) {
    const win = document.getElementById(`win-${type}`);
    win.style.display = "none";
}

function bringToFront(elm) {
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = "10");
    elm.style.zIndex = "100";
}

// --- SMOOTH DRAG ENGINE ---
function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (e.target.className.includes('ctrl') || e.target.tagName === 'INPUT') return;
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
        document.onmousemove = (e) => {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        };
        bringToFront(elmnt);
    }
}

// --- UTILS ---
function saveSettings() {
    config.panicKey = document.getElementById('s_key').value;
    config.panicUrl = document.getElementById('s_purl').value;
    config.tabTitle = document.getElementById('s_title').value;
    config.tabIcon = document.getElementById('s_icon').value;
    localStorage.setItem('sysConfig', JSON.stringify(config));
    location.reload();
}

async function launchProxy() {
    let input = document.getElementById('proxyInput').value;
    let url = input;
    if (!input.includes('.') || input.includes(' ')) {
        url = "https://duckduckgo.com" + encodeURIComponent(input);
    } else if (!input.startsWith('http')) { url = "https://" + input; }
    const win = window.open('about:blank', '_blank');
    const encoded = window.location.origin + "/uv/service/" + btoa(url);
    win.document.body.innerHTML = `<iframe src="${encoded}" style="position:fixed;inset:0;width:100%;height:100%;border:none;"></iframe>`;
}

async function launchEmbed() {
    const url = document.getElementById('embedInput').value;
    const win = window.open('about:blank', '_blank');
    win.document.body.innerHTML = `<iframe src="${url}" style="position:fixed;inset:0;width:100%;height:100%;border:none;"></iframe>`;
}

window.onkeydown = (e) => { if (e.key === config.panicKey) window.location.href = config.panicUrl; };
