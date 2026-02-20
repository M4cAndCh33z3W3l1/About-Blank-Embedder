// 1. CONFIG & CLOAKING
let config = JSON.parse(localStorage.getItem('sysConfig')) || {
    pin: "1234",
    panicKey: "Escape",
    panicUrl: "https://classroom.google.com",
    tabTitle: "Google Drive",
    tabIcon: "https://ssl.gstatic.com",
    idleTime: 5
};

document.title = config.tabTitle;
document.getElementById('tabIcon').href = config.tabIcon;

// 2. GHOST MODE (INACTIVITY)
let idleTimer;
const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        document.getElementById('lockScreen').style.display = "flex";
    }, config.idleTime * 60 * 1000);
};
resetIdleTimer();

// 3. PIN CHECK
function checkPin() {
    if (document.getElementById('pinInput').value === config.pin) {
        document.getElementById('lockScreen').style.display = "none";
        resetIdleTimer();
    } else { alert("ACCESS DENIED"); }
}

// 4. WINDOW MANAGER (THE "DESKTOP" LOGIC)
function openWindow(type) {
    // Prevent duplicate windows
    if (document.getElementById(`win-${type}`)) return;

    const win = document.createElement('div');
    win.id = `win-${type}`;
    win.className = 'window draggable';
    win.style.top = '100px';
    win.style.left = '150px';

    let content = '';
    if (type === 'unblock') {
        content = `
            <h2>Proxy Unblocker</h2>
            <input type="text" id="proxyInput" placeholder="Search DuckDuckGo or enter URL...">
            <button class="yellow-btn" onclick="launchProxy()">LAUNCH PROXY</button>`;
    } else if (type === 'embedder') {
        content = `
            <h2>about:blank Embedder</h2>
            <input type="text" id="embedInput" placeholder="https://example.com" value="https://">
            <button class="yellow-btn" onclick="launchEmbed()">LAUNCH CLOAK</button>`;
    } else if (type === 'settings') {
        content = `
            <div style="max-height:300px; overflow-y:auto; padding-right:10px;">
                <label>PIN</label><input type="text" id="s_pin" value="${config.pin}">
                <label>Panic Key</label><input type="text" id="s_key" value="${config.panicKey}">
                <label>Panic URL</label><input type="text" id="s_purl" value="${config.panicUrl}">
                <label>Tab Title</label><input type="text" id="s_title" value="${config.tabTitle}">
                <label>Tab Icon (URL)</label><input type="text" id="s_icon" value="${config.tabIcon}">
                <label>Idle Time (Min)</label><input type="number" id="s_idle" value="${config.idleTime}">
                <button class="yellow-btn" onclick="saveSettings()">SAVE ALL</button>
            </div>`;
    }

    win.innerHTML = `
        <div class="window-header" onmousedown="dragElement(this.parentElement)">
            <span class="window-title">${type.toUpperCase()}</span>
            <div class="window-controls">
                <span onclick="this.parentElement.parentElement.parentElement.classList.toggle('minimized')">−</span>
                <span onclick="this.parentElement.parentElement.parentElement.classList.toggle('fullscreen')">▢</span>
                <span onclick="this.parentElement.parentElement.parentElement.remove()" style="color:#ff5555">×</span>
            </div>
        </div>
        <div class="window-body">${content}</div>
    `;

    document.getElementById('workstage').appendChild(win);
}

// 5. DRAG LOGIC (The "Chrome Window" feel)
function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (e.target.closest('.window-controls') || e.target.tagName === 'INPUT') return;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        // Bring to front
        document.querySelectorAll('.window').forEach(w => w.style.zIndex = "10");
        elmnt.style.zIndex = "100";
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

// 6. SYSTEM ACTIONS
function saveSettings() {
    config.pin = document.getElementById('s_pin').value;
    config.panicKey = document.getElementById('s_key').value;
    config.panicUrl = document.getElementById('s_purl').value;
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
