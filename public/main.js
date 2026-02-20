const SECRET_PIN = "1234"; // Your secret code
let config = JSON.parse(localStorage.getItem('sysConfig')) || {
    panicKey: "Escape", panicUrl: "https://google.com",
    tabTitle: "Google Drive", tabIcon: "https://ssl.gstatic.com",
    idleTime: 5
};

// Apply Cloak
document.title = config.tabTitle;
document.getElementById('tabIcon').href = config.tabIcon;

// Time Update
setInterval(() => {
    const n = new Date();
    document.getElementById('live-time').innerText = n.getHours().toString().padStart(2,'0') + ":" + n.getMinutes().toString().padStart(2,'0');
}, 1000);

// Window Content Logic
function openWindow(type) {
    if (document.getElementById(`win-${type}`)) return;
    const win = document.createElement('div');
    win.id = `win-${type}`;
    win.className = 'window animate-pop';
    win.style.top = '100px'; win.style.left = '150px';

    let content = '';
    if (type === 'unblock') content = `<h2>PROXY</h2><input type="text" id="proxyInput" placeholder="Search..."><button class="yellow-btn" onclick="launchProxy()">GO</button>`;
    if (type === 'embedder') content = `<h2>EMBED</h2><input type="text" id="embedInput" placeholder="URL..."><button class="yellow-btn" onclick="launchEmbed()">LAUNCH</button>`;
    if (type === 'settings') {
        content = `
            <h2>SETTINGS</h2>
            <div style="max-height:250px; overflow-y:auto; text-align:left;">
                <label>PANIC KEY</label><input type="text" id="s_key" value="${config.panicKey}">
                <label>PANIC URL</label><input type="text" id="s_url" value="${config.panicUrl}">
                <label>TAB TITLE</label><input type="text" id="s_title" value="${config.tabTitle}">
                <label>TAB ICON URL</label><input type="text" id="s_icon" value="${config.tabIcon}">
                <button class="yellow-btn" onclick="saveSettings()">APPLY</button>
            </div>`;
    }

    win.innerHTML = `
        <div class="window-header" onmousedown="dragElement(this.parentElement)">
            <span style="font-size:9px; color:#555;">${type.toUpperCase()}</span>
            <div style="display:flex; gap:5px;">
                <div class="dot" style="background:#ffbd2e; width:10px; height:10px; border-radius:50%;" onclick="this.parentElement.parentElement.parentElement.style.display='none'"></div>
                <div class="dot" style="background:#ff5f56; width:10px; height:10px; border-radius:50%;" onclick="closeWindow('${type}')"></div>
            </div>
        </div>
        <div class="window-body" style="padding:20px;">${content}</div>
    `;
    document.getElementById('workstage').appendChild(win);
    // (Include your dragElement and taskbar logic here)
}
