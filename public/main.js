const SECRET_PIN = "1234";
let config = JSON.parse(localStorage.getItem('sysConfig')) || {
    panicKey: "Escape", panicUrl: "https://google.com",
    tabTitle: "Google Drive", tabIcon: "https://ssl.gstatic.com",
    idleTime: 5
};

// 1. LIVE CLOCK
setInterval(() => {
    const now = new Date();
    document.getElementById('live-time').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}, 1000);

// 2. WINDOW MANAGER
function openWindow(type) {
    if (document.getElementById(`win-${type}`)) return bringToFront(document.getElementById(`win-${type}`));

    const win = document.createElement('div');
    win.id = `win-${type}`;
    win.className = 'window';
    win.style.width = '350px'; // Smaller default size
    win.style.height = '250px';
    win.style.top = '100px';
    win.style.left = '150px';

    let content = '';
    if (type === 'unblock') content = `<h2>UNBLOCKER</h2><input type="text" id="proxyInput" placeholder="Search..."><button class="yellow-btn glow" onclick="launchProxy()">GO</button>`;
    if (type === 'embedder') content = `<h2>EMBED</h2><input type="text" id="embedInput" placeholder="URL..."><button class="yellow-btn glow" onclick="launchEmbed()">LAUNCH</button>`;
    if (type === 'settings') content = `<h2>SETTINGS</h2><label>Tab Title</label><input type="text" id="s_title" value="${config.tabTitle}"><button class="yellow-btn" onclick="saveSettings()">SAVE</button>`;

    win.innerHTML = `
        <div class="window-header" onmousedown="dragElement(this.parentElement)">
            <span style="font-size:10px; color:#666;">${type.toUpperCase()}</span>
            <div class="ctrls">
                <div class="dot yel" onclick="this.parentElement.parentElement.parentElement.style.display='none'"></div>
                <div class="dot grn" onclick="this.parentElement.parentElement.parentElement.classList.toggle('fullscreen')"></div>
                <div class="dot red" onclick="closeWindow('${type}')"></div>
            </div>
        </div>
        <div class="window-body">${content}</div>
    `;

    document.getElementById('workstage').appendChild(win);
    addTaskIcon(type);
    bringToFront(win);
}

function closeWindow(type) {
    document.getElementById(`win-${type}`).remove();
    document.getElementById(`task-${type}`).remove();
}

function addTaskIcon(type) {
    const icon = document.createElement('img');
    icon.id = `task-${type}`;
    icon.className = 'task-icon';
    icon.src = getIcon(type);
    icon.onclick = () => {
        const w = document.getElementById(`win-${type}`);
        w.style.display = w.style.display === 'none' ? 'block' : 'none';
        if(w.style.display !== 'none') bringToFront(w);
    };
    document.getElementById('taskbar-icons').appendChild(icon);
}

function getIcon(type) {
    if(type === 'unblock') return "https://cdn-icons-png.flaticon.com";
    if(type === 'settings') return "https://cdn-icons-png.flaticon.com";
    return "https://upload.wikimedia.org";
}

// 3. DRAG ENGINE
function dragElement(elm) {
    let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
    elm.onmousedown = (e) => {
        if(e.target.tagName === 'INPUT' || e.target.className.includes('dot')) return;
        p3 = e.clientX; p4 = e.clientY;
        document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
        document.onmousemove = (e) => {
            p1 = p3 - e.clientX; p2 = p4 - e.clientY;
            p3 = e.clientX; p4 = e.clientY;
            elm.style.top = (elm.offsetTop - p2) + "px";
            elm.style.left = (elm.offsetLeft - p1) + "px";
        };
        bringToFront(elm);
    };
}

function bringToFront(elm) {
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = "10");
    elm.style.zIndex = "100";
}

// Other logic (PIN, Proxy, etc.) stays the same as previous main.js version
