// --- SECURE CONFIG ---
const SECRET_PIN = "1234"; // CHANGE THIS TO YOUR SECRET PIN
let config = JSON.parse(localStorage.getItem('sysConfig')) || {
    panicKey: "Escape", 
    panicUrl: "https://classroom.google.com",
    tabTitle: "Google Drive", 
    tabIcon: "https://ssl.gstatic.com",
    idleTime: 5
};

// Apply Tab Cloak Immediately
document.title = config.tabTitle;
document.getElementById('tabIcon').href = config.tabIcon;

// 1. LIVE TIME (Bottom Left Corner)
setInterval(() => {
    const n = new Date();
    const timeStr = n.getHours().toString().padStart(2,'0') + ":" + n.getMinutes().toString().padStart(2,'0');
    const timeEl = document.getElementById('live-time');
    if (timeEl) timeEl.innerText = timeStr;
}, 1000);

// 2. GHOST MODE (IDLE TIMER)
let idleTimer;
const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        document.getElementById('lockScreen').style.display = "flex";
    }, config.idleTime * 60 * 1000);
};
resetIdleTimer();

// 3. PIN CHECK (Terminal Style)
function checkPin() {
    const input = document.getElementById('pinInput');
    if (input.value === SECRET_PIN) {
        document.getElementById('lockScreen').style.display = "none";
        resetIdleTimer();
        input.value = ""; 
    } else {
        input.value = "";
        input.placeholder = "ACCESS_DENIED";
        input.style.borderBottom = "2px solid #ff5555";
        setTimeout(() => { input.style.borderBottom = "none"; input.placeholder = "ENTER PIN"; }, 1000);
    }
}

// 4. WINDOW MANAGER
function openWindow(type) {
    const existing = document.getElementById(`win-${type}`);
    if (existing) {
        existing.style.display = "block";
        bringToFront(existing);
        return;
    }

    const win = document.createElement('div');
    win.id = `win-${type}`;
    win.className = 'window animate-pop';
    win.style.top = '100px'; 
    win.style.left = '150px';

    let content = '';
    if (type === 'unblock') {
        content = `<h2 class="glow-text">PROXY</h2><p style="font-size:10px;color:#444;margin-bottom:10px;">ENCRYPTED_TUNNEL_ACTIVE</p><input type="text" id="proxyInput" placeholder="Search or URL..."><button class="yellow-btn glow" onclick="launchProxy()">EXECUTE</button>`;
    } else if (type === 'embedder') {
        content = `<h2 class="glow-text">EMBED</h2><p style="font-size:10px;color:#444;margin-bottom:10px;">BLANK_TAB_INJECTION</p><input type="text" id="embedInput" placeholder="https://..." value="https://"><button class="yellow-btn glow" onclick="launchEmbed()">INJECT</button>`;
    } else if (type === 'settings') {
        content = `
            <h2 class="glow-text">SYSTEM</h2>
            <div class="settings-scroll" style="max-height:250px; overflow-y:auto; text-align:left;">
                <label style="font-size:9px;color:#666;">PANIC_KEY</label><input type="text" id="s_key" value="${config.panicKey}">
                <label style="font-size:9px;color:#666;">PANIC_URL</label><input type="text" id="s_url" value="${config.panicUrl}">
                <label style="font-size:9px;color:#666;">TAB_TITLE</label><input type="text" id="s_title" value="${config.tabTitle}">
                <label style="font-size:9px;color:#666;">TAB_ICON_URL</label><input type="text" id="s_icon" value="${config.tabIcon}">
                <label style="font-size:9px;color:#666;">IDLE_MINS</label><input type="number" id="s_idle" value="${config.idleTime}">
                <button class="yellow-btn glow" onclick="saveSettings()">COMMIT_CHANGES</button>
            </div>`;
    }

    win.innerHTML = `
        <div class="window-header" onmousedown="dragElement(this.parentElement)">
            <span style="font-size:9px; color:#555; letter-spacing:2px;">${type.toUpperCase()}</span>
            <div style="display:flex; gap:8px;">
                <div class="dot yel" style="width:12px; height:12px; border-radius:50%; background:#ffbd2e; cursor:pointer;" onclick="this.parentElement.parentElement.parentElement.style.display='none'"></div>
                <div class="dot red" style="width:12px; height:12px; border-radius:50%; background:#ff5f56; cursor:pointer;" onclick="closeWindow('${type}')"></div>
            </div>
        </div>
        <div class="window-body" style="padding:25px;">${content}</div>
    `;

    document.getElementById('workstage').appendChild(win);
    addTaskbarIcon(type);
    bringToFront(win);
}

function closeWindow(type) {
    const win = document.getElementById(`win-${type}`);
    const task = document.getElementById(`task-${type}`);
    if (win) win.remove();
    if (task) task.remove();
}

function addTaskbarIcon(type) {
    const bar = document.getElementById('taskbar-icons');
    if (!bar) return;
    const icon = document.createElement('img');
    icon.id = `task-${type}`;
    icon.className = 'task-icon';
    icon.src = getIconUrl(type);
    icon.onclick = () => {
        const w = document.getElementById(`win-${type}`);
        if (w.style.display === 'none') { w.style.display = 'block'; bringToFront(w); } 
        else { w.style.display = 'none'; }
    };
    bar.appendChild(icon);
}

function getIconUrl(type) {
    if (type === 'unblock') return "https://cdn-icons-png.flaticon.com";
    if (type === 'settings') return "https://cdn-icons-png.flaticon.com";
    return "https://upload.wikimedia.org";
}

// 5. DRAG ENGINE
function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (e.target.tagName === 'INPUT' || e.target.className.includes('dot') || e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        bringToFront(elmnt);
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function bringToFront(elm) {
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = "10");
    elm.style.zIndex = "100";
}

// 6. ACTIONS
function saveSettings() {
    config.panicKey = document.getElementById('s_key').value;
    config.panicUrl = document.getElementById('s_url').value;
    config.tabTitle = document.getElementById('s_title').value;
    config.tabIcon = document.getElementById('s_icon').value;
    config.idleTime = parseInt(document.getElementById('s_idle').value);
    localStorage.setItem('sysConfig', JSON.stringify(config));
    location.reload();
}

async function launchProxy() {
    let input = document.getElementById('proxyInput').value;
    let url = input;
    if (!input.includes('.') || input.includes(' ')) {
        url = "https://duckduckgo.com" + encodeURIComponent(input);
    } else if (!input.startsWith('http')) {
        url = "https://" + input;
    }
    const win = window.open('about:blank', '_blank');
    // Ensure Ultraviolet files are in /uv/ folder on Vercel
    const encoded = window.location.origin + "/uv/service/" + btoa(url); 
    win.document.body.innerHTML = `<iframe src="${encoded}" style="position:fixed;inset:0;width:100%;height:100%;border:none;margin:0;padding:0;overflow:hidden;"></iframe>`;
}

async function launchEmbed() {
    const url = document.getElementById('embedInput').value;
    const win = window.open('about:blank', '_blank');
    win.document.body.innerHTML = `<iframe src="${url}" style="position:fixed;inset:0;width:100%;height:100%;border:none;margin:0;padding:0;overflow:hidden;"></iframe>`;
}

// 7. PANIC KEY
window.onkeydown = (e) => { 
    if (e.key === config.panicKey) window.location.href = config.panicUrl; 
};
