function launchBlank() {
    const url = document.getElementById('urlInput').value;
    
    // Open a new about:blank window
    const win = window.open('about:blank', '_blank');

    if (win) {
        // Set up the blank page styles to fill the screen
        win.document.body.style.margin = '0';
        win.document.body.style.height = '100vh';
        win.document.body.style.overflow = 'hidden';

        // Create the iframe
        const iframe = win.document.createElement('iframe');
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.margin = '0';
        iframe.src = url;

        // Add iframe to the new page
        win.document.body.appendChild(iframe);
    } else {
        alert("Pop-up blocked! Please allow pop-ups for this site.");
    }
}
