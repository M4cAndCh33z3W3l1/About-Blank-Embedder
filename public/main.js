// --- DEFAULTS & STORAGE ---
let config = JSON.parse(localStorage.getItem('sysConfig')) || {
    pin: "1234",
    panicKey: "Escape",
    panicUrl: "https://google.com",
    tabTitle: "Google Drive",
    tabIcon: "https://ssl.gstatic.com",
    idleTime: 5 // Minutes
};

// --- INITIALIZE UI ---
document.getElementById('tabTitle').innerText = config.tabTitle;
document.getElementById('tabIcon').href = config.tabIcon;

// --- GHOST MODE (INACTIVITY) ---
let idleTimer;
function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        document.getElementById('lockScreen').style.display = "flex";
    }, config.idleTime * 60 * 1000);
}

function checkPin() {
    if (document.getElementById('pinInput').value === config.pin) {
        document.getElementById('lockScreen').style.display = "none";
        resetIdleTimer();
    } else { alert("ACCESS DENIED"); }
}

// --- WINDOW MANAGER ---
function openWindow(type) {
    const stage = document.getElementById('workstage');
    stage.innerHTML = ''; // Clear previous window
    
    let html = '';
    if (type === 'unblock') {
        html = `
            <div class="window">
                <h2>DuckDuckGo Unblocker</h2>
                <input type="text" id="proxyInput" placeholder="Search or URL...">
                <button class="yellow-btn" onclick="launchProxy()">PROXY LAUNCH</button>
            </div>`;
    } else if (type === 'settings') {
        html = `
            <div class="window" style="width: 600px;">
                <h2>System Settings</h2>
                <label>PIN Code</label><input type="text" id="s_pin" value="${config.pin}">
                <label>Panic Key</label><input type="text" id="s_key" value="${config.panicKey}">
                <label>Panic Redirect URL</label><input type="text" id="s_purl" value="${config.panicUrl}">
                <label>Tab Title</label><input type="text" id="s_title" value="${config.tabTitle}">
                <label>Tab Icon (Link)</label><input type="text" id="s_icon" value="${config.tabIcon}">
                <label>Ghost Mode (Mins)</label><input type="number" id="s_idle" value="${config.idleTime}">
                <button class="yellow-btn" onclick="saveSettings()">APPLY & SAVE</button>
            </div>`;
    }
    stage.innerHTML = html;
}

function saveSettings() {
    config.pin = document.getElementById('s_pin').value;
    config.panicKey = document.getElementById('s_key').value;
    config.panicUrl = document.getElementById('s_purl').value;
    config.tabTitle = document.getElementById('s_title').value;
    config.tabIcon = document.getElementById('s_icon').value;
    config.idleTime = parseInt(document.getElementById('s_idle').value);
    
    localStorage.setItem('sysConfig', JSON.stringify(config));
    location.reload(); // Refresh to apply tab changes
}

// --- DUCKDUCKGO & UV LAUNCHER ---
async function launchProxy() {
    let query = document.getElementById('proxyInput').value;
    let url = query;

    // Search Engine Logic
    if (!query.includes('.') || query.includes(' ')) {
        url = "https://duckduckgo.com" + encodeURIComponent(query);
    } else if (!query.startsWith('http')) {
        url = "https://" + query;
    }

    if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/uv/sw.js', { scope: __uv$config.prefix });
    }

    const win = window.open('about:blank', '_blank');
    const encoded = window.location.origin + __uv$config.prefix + __uv$config.encodeUrl(url);
    
    win.document.body.innerHTML = `<iframe src="${encoded}" style="position:fixed;top:0;left:0;width:100%;height:100%;border:none;margin:0;padding:0;"></iframe>`;
}

// --- PANIC KEY ---
window.onkeydown = (e) => { if (e.key === config.panicKey) window.location.href = config.panicUrl; };
