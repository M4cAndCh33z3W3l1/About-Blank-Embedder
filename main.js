function launchBlank() {
    const url = document.getElementById('urlInput').value;
    
    if (!url.startsWith('http')) {
        alert("Please enter a full URL (https://...)");
        return;
    }

    const win = window.open('about:blank', '_blank');
    if (!win) {
        alert("Pop-up blocked!");
        return;
    }

    // Creating the iframe inside the blank page
    const doc = win.document;
    const iframe = doc.createElement('iframe');

    // Styling the blank page
    doc.body.style.margin = '0';
    doc.body.style.height = '100vh';
    doc.body.style.width = '100vw';
    doc.title = "Classes"; // Fake title for better cloaking

    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = url;

    doc.body.appendChild(iframe);
}
