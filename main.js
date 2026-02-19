function launchBlank() {
    const rawUrl = document.getElementById('urlInput').value;
    
    // Check if URL is valid
    if (!rawUrl.startsWith('http')) {
        alert("Please enter a full URL starting with https://");
        return;
    }

    // This uses a CORS proxy to bypass "X-Frame-Options"
    // Note: Public proxies can be slow or sometimes blocked by specific sites.
    const proxiedUrl = "https://api.allorigins.win" + encodeURIComponent(rawUrl);

    const win = window.open('about:blank', '_blank');

    if (win) {
        win.document.body.style.margin = '0';
        win.document.body.style.height = '100vh';
        win.document.body.style.overflow = 'hidden';

        const iframe = win.document.createElement('iframe');
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.margin = '0';
        
        // Use the proxied URL to bypass the "Refused to Connect" error
        iframe.src = proxiedUrl;

        win.document.body.appendChild(iframe);
    } else {
        alert("Pop-up blocked! Please allow pop-ups for this site.");
    }
}
