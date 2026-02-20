function launchBlank() {
    const url = document.getElementById('urlInput').value;
    
    if (!url.startsWith('http')) {
        alert("Please include https://");
        return;
    }

    const win = window.open('about:blank', '_blank');
    if (!win) {
        alert("Pop-up blocked! Please allow pop-ups for this site.");
        return;
    }

    const doc = win.document;
    const iframe = doc.createElement('iframe');

    doc.body.style.margin = '0';
    doc.body.style.height = '100vh';
    doc.body.style.overflow = 'hidden';
    doc.title = "Embedder";

    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = url;

    doc.body.appendChild(iframe);
}
