// --- CONFIGURATION ---
const MY_PIN = "1234"; // PUT YOUR PIN HERE
const GHOST_TITLE = "Google Drive"; 
const PAGE_TITLE = "My Workspace";

// --- TAB GHOSTING ---
window.onblur = () => document.title = GHOST_TITLE;
window.onfocus = () => document.title = PAGE_TITLE;

// --- PIN CHECK ---
function checkPin() {
    const val = document.getElementById('pinInput').value;
    if (val === MY_PIN) {
        document.getElementById('pinOverlay').style.opacity = "0";
        setTimeout(() => {
            document.getElementById('pinOverlay').style.display = "none";
            document.getElementById('mainContent').style.display = "block";
        }, 500);
    } else {
        alert("Access Denied");
    }
}

// --- SECURE LAUNCH (ULTRAVIOLET) ---
async function launchBlank() {
    const url = document.getElementById('urlInput').value;

    // Register Service Worker (Required for iBoss bypass)
    if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/uv/sw.js', {
            scope: __uv$config.prefix
        });
    }

    const win = window.open('about:blank', '_blank');
    if (!win) return alert("Pop-up blocked!");

    // Rewrite the URL using UV to bypass iBoss/Refused-to-connect
    const encodedUrl = window.location.origin + __uv$config.prefix + __uv$config.encodeUrl(url);

    const doc = win.document;
    const iframe = doc.createElement('iframe');

    doc.title = GHOST_TITLE; // Cloak the new tab too
    doc.body.style.margin = '0';
    doc.body.style.height = '100vh';
    doc.body.style.overflow = 'hidden';

    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = encodedUrl;

    doc.body.appendChild(iframe);
}
