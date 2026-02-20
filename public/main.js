// --- CONFIG (PIN is locked) ---
const SECRET_PIN = "1234";
let config = JSON.parse(localStorage.getItem('sysConfig')) || {
    panicKey: "Escape", panicUrl: "https://google.com",
    tabTitle: "Google Drive", tabIcon: "https://ssl.gstatic.com",
    idleTime: 5
};

// Apply Cloak
document.title = config.tabTitle;
document.getElementById('tabIcon').href = config.tabIcon;

// 1. LIVE TIME
setInterval(() => {
    const now = new Date();
    document.getElementById('live-time').innerText = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
}, 1000);

// 2. WINDOWS & SETTINGS
function openWindow(type) {
    if (document.getElementById(`win-${type}`)) {
        const w = document.getElementById(`win-${type}`);
        w.style.display = "block";
        return;
    }

    const win = document.createElement('div');
    win.id = `win-${type}`;
    win.className = 'window animate-pop';
    win.style.top = '100px'; win.style.left = '150px';

    let content = '';
    if (type === 'unblock') {
        content = `<h2 style="color:var(--glow); margin-bottom:15px;">PROXY</h2><input type="text" id="proxyInput" placeholder="Search..."><button class="yellow-btn" onclick="launchProxy()">EXECUTE</button>`;
    } else if (type === 'embedder') {
        content = `<h2 style="color:var(--glow); margin-bottom:15px;">EMBED</h2><input type="text" id="embedInput" placeholder="URL..."><button class="yellow-btn" onclick="launchEmbed()">LAUNCH</button>`;
    } else if (type === 'settings') {
        content = `
            <h2 style="color:var(--glow); margin-bottom:15px;">SYSTEM</h2>
            <div class="settings-scroll">
                <label style="font-size:10px; color:#666;">PANIC KEY</label><input type="text" id="s_key" value="${config.panicKey}">
                <label style="font-size:10px; color:#666;">PANIC REDIRECT</label><input type="text" id="s_url" value="${config.panicUrl}">
                <label style="font-size:10px; color:#666;">TAB TITLE</label><input type="text" id="s_title" value="${config.tabTitle}">
                <label style="font-size:10px; color:#666;">TAB ICON URL</label><input type="text" id="s_icon" value="${config.tabIcon}">
                <label style="font-size:10px; color:#666;">IDLE LOCK (MINS)</label><input type="number" id="s_idle" value="${config.idleTime}">
                <button class="yellow-btn" onclick="saveSettings()">COMMIT CHANGES</button>
            </div>`;
    }

    win.innerHTML = `
        <div class="window-header" onmousedown="dragElement(this.parentElement)">
            <span style="font-size:10px; letter-spacing:2px; color:#555;">${type.toUpperCase()}</span>
            <div style="display:flex; gap:8px;">
                <div onclick="this.parentElement.parentElement.parentElement.style.display='none'" style="width:12px; height:12px; border-radius:50%; background:#ffbd2e; cursor:pointer;"></div>
                <div onclick="toggleFullscreen('${type}')" style="width:12px; height:12px; border-radius:50%; background:#27c93f; cursor:pointer;"></div>
                <div onclick="closeWindow('${type}')" style="width:12px; height:12px; border-radius:50%; background:#ff5f56; cursor:pointer;"></div>
            </div>
        </div>
        <div class="window-body">${content}</div>
    `;

    document.getElementById('workstage').appendChild(win);
    addTaskbarIcon(type);
}

function toggleFullscreen(type) {
    const win = document.getElementById(`win-${type}`);
    win.style.width = "90vw"; win.style.height = "80vh";
    win.style.top = "20px"; win.style.left = "80px";
}

function saveSettings() {
    config.panicKey = document.getElementById('s_key').value;
    config.panicUrl = document.getElementById('s_url').value;
    config.tabTitle = document.getElementById('s_title').value;
    config.tabIcon = document.getElementById('s_icon').value;
    config.idleTime = parseInt(document.getElementById('s_idle').value);
    localStorage.setItem('sysConfig', JSON.stringify(config));
    location.reload();
}
// (Include your dragElement, launchProxy, and launchEmbed functions here as well)
