// prompt-copy.js - Resilient clipboard copying with visual toast feedback

function showToast(message) {
    let toast = document.getElementById('copy-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'copy-toast';
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${message}</span>`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

async function copyToClipboard(text, successMessage = "Copied to clipboard!") {
    if (!text || text.trim() === "") {
        showToast("Nothing to copy!");
        return;
    }

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            showToast(successMessage);
            return;
        }
    } catch (err) {
        console.warn("Navigator clipboard failed, falling back to execCommand", err);
    }

    // Fallback using textarea
    try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
            showToast(successMessage);
        } else {
            showToast("Failed to copy. Please select and copy manually.");
        }
    } catch (err) {
        console.error("Fallback copy failed", err);
        showToast("Clipboard access denied. Please copy manually.");
    }
}

function copyPromptText(promptId) {
    const el = document.getElementById(`prompt-text-${promptId}`);
    if (el) {
        copyToClipboard(el.innerText || el.textContent, "Prompt copied to clipboard!");
    }
}

function copyInstructionsText(promptId) {
    const el = document.getElementById(`instructions-text-${promptId}`);
    if (el) {
        copyToClipboard(el.innerText || el.textContent, "Instructions copied to clipboard!");
    }
}

function copyBothText(promptId) {
    const pEl = document.getElementById(`prompt-text-${promptId}`);
    const iEl = document.getElementById(`instructions-text-${promptId}`);
    
    let combined = "";
    if (pEl) {
        combined += "=== PROMPT ===\n" + (pEl.innerText || pEl.textContent).trim() + "\n\n";
    }
    if (iEl) {
        combined += "=== INSTRUCTIONS ===\n" + (iEl.innerText || iEl.textContent).trim();
    }

    if (combined) {
        copyToClipboard(combined, "Prompt & Instructions copied!");
    }
}
