// --- CONFIG ---
const MY_PIN = "1234"; // PUT YOUR PIN HERE

// --- SETTINGS LOGIC ---
let settings = JSON.parse(localStorage.getItem('userSettings')) || {
    panicKey: 'Escape',
    fakeTitle: 'Google Drive'
};

function saveSettings() {
    settings.panicKey = document.getElementById('panicKeyInput').value || 'Escape';
    settings.fakeTitle = document.getElementById('fakeTitleInput').value || 'Google Drive';
    localStorage.setItem('userSettings', JSON.stringify(settings));
    alert("Settings Saved!");
    toggleSettings();
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
}

// --- PANIC KEY ---
window.addEventListener('keydown', (e) => {
    if (e.key === settings.panicKey) window.location.href = "https://google.com";
});

// --- PIN CHECK ---
function checkPin() {
    if (document.getElementById('pinInput').value === MY_PIN) {
        document.getElementById('pinOverlay').style.display = "none";
        document.getElementById('mainContent').style.display = "flex";
    } else { alert("ACCESS DENIED"); }
}

// --- LAUNCHER ---
async function launchBlank() {
    const url = document.getElementById('urlInput').value;
    if (!url.startsWith('http')) return alert("Use https://");

    if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/uv/sw.js', { scope: __uv$config.prefix });
    }

    const win = window.open('about:blank', '_blank');
    if (!win) return alert("Pop-up Blocked!");

    const encoded = window.location.origin + __uv$config.prefix + __uv$config.encodeUrl(url);
    const doc = win.document;
    
    doc.title = settings.fakeTitle;
    doc.body.innerHTML = `<iframe src="${encoded}" style="position:fixed;top:0;left:0;width:100%;height:100%;border:none;margin:0;padding:0;overflow:hidden;"></iframe>`;
}
