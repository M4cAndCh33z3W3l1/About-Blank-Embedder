// 1. LOAD CONFIG & UI
let config = JSON.parse(localStorage.getItem('sysConfig')) || {
    pin: "1234", // Default PIN
    panicKey: "Escape",
    panicUrl: "https://classroom.google.com",
    tabTitle: "Google Drive",
    tabIcon: "https://ssl.gstatic.com",
    idleTime: 5
};

// Apply Cloak immediately on load
document.getElementById('tabTitle').innerText = config.tabTitle;
document.getElementById('tabIcon').href = config.tabIcon;

// 2. GHOST MODE (INACTIVITY)
let idleTimer;
function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        document.getElementById('lockScreen').style.display = "flex";
    }, config.idleTime * 60 * 1000);
}
// Start the timer
resetIdleTimer();

// 3. PIN CHECK
function checkPin() {
    const input = document.getElementById('pinInput').value;
    if (input === config.pin) {
        document.getElementById('lockScreen').style.display = "none";
        resetIdleTimer();
    } else {
        alert("ACCESS DENIED");
    }
}

// 4. WINDOW MANAGER (Sidebar Switching)
function openWindow(type) {
    const stage = document.getElementById('workstage');
    stage.innerHTML = ''; 
    
    if (type === 'unblock') {
        stage.innerHTML = `
            <div class="window">
                <h2>Proxy Unblocker</h2>
                <input type="text" id="proxyInput" placeholder="Search DuckDuckGo or enter URL...">
                <button class="yellow-btn" onclick="launchProxy()">LAUNCH</button>
            </div>`;
    } else if (type === 'embedder') {
        stage.innerHTML = `
            <div class="window">
                <h2>about:blank Embedder</h2>
                <input type="text" id="embedInput" placeholder="https://example.com">
                <button class="yellow-btn" onclick="launchEmbed()">EMBED</button>
            </div>`;
    } else if (type === 'settings') {
        stage.innerHTML = `
            <div class="window" style="width: 500px;">
                <h2>Settings</h2>
                <label>System PIN</label><input type="text" id="s_pin" value="${config.pin}">
                <label>Panic Key</label><input type="text" id="s_key" value="${config.panicKey}">
                <label>Panic Redirect URL</label><input type="text" id="s_purl" value="${config.panicUrl}">
                <label>Tab Title</label><input type="text" id="s_title" value="${config.tabTitle}">
                <label>Tab Icon (URL)</label><input type="text" id="s_icon" value="${config.tabIcon}">
                <label>Ghost Mode (Minutes)</label><input type="number" id="s_idle" value="${config.idleTime}">
                <button class="yellow-btn" onclick="saveSettings()">SAVE & APPLY</button>
            </div>`;
    }
}

// 5. SETTINGS PERSISTENCE
function saveSettings() {
    config.pin = document.getElementById('s_pin').value;
    config.panicKey = document.getElementById('s_key').value;
    config.panicUrl = document.getElementById('s_purl').value;
    config.tabTitle = document.getElementById('s_title').value;
    config.tabIcon = document.getElementById('s_icon').value;
    config.idleTime = parseInt(document.getElementById('s_idle').value);
    
    localStorage.setItem('sysConfig', JSON.stringify(config));
    alert("Settings Saved! Refreshing...");
    location.reload(); 
}

// 6. PROXY & EMBED LOGIC
async function launchProxy() {
    let input = document.getElementById('proxyInput').value;
    let url = input;

    if (!input.includes('.') || input.includes(' ')) {
        url = "https://duckduckgo.com/?q=" + encodeURIComponent(input);
    } else if (!input.startsWith('http')) {
        url = "https://" + input;
    }

    const win = window.open('about:blank', '_blank');
    const encoded = window.location.origin + "/uv/service/" + btoa(url); // Simple UV b64 encode for test
    win.document.body.innerHTML = `<iframe src="${encoded}" style="position:fixed;inset:0;width:100%;height:100%;border:none;"></iframe>`;
}

async function launchEmbed() {
    const url = document.getElementById('embedInput').value;
    const win = window.open('about:blank', '_blank');
    win.document.body.innerHTML = `<iframe src="${url}" style="position:fixed;inset:0;width:100%;height:100%;border:none;"></iframe>`;
}

// 7. PANIC KEY
window.onkeydown = (e) => { 
    if (e.key === config.panicKey) window.location.href = config.panicUrl; 
};

// Open Proxy by default
openWindow('unblock');
