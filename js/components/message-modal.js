/* ==========================================================================
   MESSAGE MODAL
   Reusable replacement for native alert(). Creates the modal on first use,
   keeps a single instance for the whole page and returns a Promise that
   resolves when the user dismisses it.
   ========================================================================== */

const DEFAULT_TITLE = 'Message';
const DEFAULT_OK_TEXT = 'OK';

let overlayElement = null;
let titleElement = null;
let messageElement = null;
let okButton = null;

let resolveCurrentMessage = null;
let lastFocusedElement = null;

function closeMessage() {
    if (!overlayElement || overlayElement.classList.contains('hidden')) {
        return;
    }

    overlayElement.classList.add('hidden');

    const resolveMessage = resolveCurrentMessage;
    resolveCurrentMessage = null;

    if (lastFocusedElement instanceof HTMLElement && lastFocusedElement.isConnected) {
        lastFocusedElement.focus();
    }

    lastFocusedElement = null;

    resolveMessage?.();
}

function ensureModal() {
    if (overlayElement) {
        return;
    }

    overlayElement = document.createElement('div');
    overlayElement.className = 'modal-overlay hidden';
    overlayElement.innerHTML = `
        <div class="container modal-card message-modal-card" role="dialog" aria-modal="true"
            aria-labelledby="message-modal-title" aria-describedby="message-modal-text">
            <div class="row message-modal-head">
                <span id="message-modal-title" class="section-title">${DEFAULT_TITLE}</span>
            </div>

            <hr>

            <p id="message-modal-text" class="message-modal-text"></p>

            <div class="action-row">
                <button id="message-modal-ok" type="button" class="btn-dark expand" title="Dismiss message">${DEFAULT_OK_TEXT}</button>
            </div>
        </div>
    `;

    titleElement = overlayElement.querySelector('#message-modal-title');
    messageElement = overlayElement.querySelector('#message-modal-text');
    okButton = overlayElement.querySelector('#message-modal-ok');

    okButton.addEventListener('click', closeMessage);

    overlayElement.addEventListener('click', event => {
        if (event.target === overlayElement) {
            closeMessage();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeMessage();
        }
    });

    document.body.appendChild(overlayElement);
}

/**
 * Shows a message in a modal with an OK button.
 *
 * @param {string} message Message body.
 * @param {{ title?: string, okText?: string }} [options]
 * @returns {Promise<void>} Resolves when the modal is dismissed.
 */
export function showMessage(message, options = {}) {
    const { title = DEFAULT_TITLE, okText = DEFAULT_OK_TEXT } = options;

    ensureModal();

    const wasOpen = !overlayElement.classList.contains('hidden');

    resolveCurrentMessage?.();
    resolveCurrentMessage = null;

    titleElement.textContent = title;
    messageElement.textContent = message ?? '';
    okButton.textContent = okText;

    if (!wasOpen) {
        lastFocusedElement = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
    }

    overlayElement.classList.remove('hidden');
    okButton.focus();

    return new Promise(resolve => {
        resolveCurrentMessage = resolve;
    });
}
