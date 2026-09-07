const LOADING_OVERLAY_ID = 'app-loading-overlay';

function getLoadingOverlay() {
    return document.getElementById(LOADING_OVERLAY_ID);
}

function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = LOADING_OVERLAY_ID;
    overlay.className = 'loading-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');

    const content = document.createElement('div');
    content.className = 'loading-overlay__content';

    const icon = document.createElement('img');
    icon.className = 'loading-overlay__icon';
    icon.src = '/assets/icons/pokeball.svg';
    icon.alt = '';

    const message = document.createElement('p');
    message.className = 'loading-overlay__message';
    message.dataset.loadingMessage = '';

    content.append(icon, message);
    overlay.append(content);
    document.body.append(overlay);

    return overlay;
}

/**
 * Exibe o overlay. A folha css/components/loading.css precisa estar carregada.
 */
export function showLoading(message = 'Loading...') {
    const overlay = getLoadingOverlay() ?? createLoadingOverlay();
    const messageElement = overlay.querySelector('[data-loading-message]');

    messageElement.textContent = message;
    overlay.hidden = false;
    document.body.setAttribute('aria-busy', 'true');
}

/**
 * Oculta o overlay criado por showLoading.
 */
export function hideLoading() {
    const overlay = getLoadingOverlay();

    if (!overlay) {
        return;
    }

    overlay.hidden = true;
    document.body.removeAttribute('aria-busy');
}

/**
 * Executa uma tarefa assíncrona mantendo o overlay visível até sua conclusão.
 */
export async function withLoading(task, message = 'Loading...') {
    showLoading(message);

    try {
        return await task();
    } finally {
        hideLoading();
    }
}
