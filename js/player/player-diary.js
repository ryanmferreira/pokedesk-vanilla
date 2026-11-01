import { characterState } from "./player-state.js";
import { alterAdditionalPoints, getAttributeTotal } from "./player-management.js";

/* ==========================================================================
   STATES AND SELECTORS
   ========================================================================== */

const diaryModal = document.getElementById('diary-modal');
const diaryEntriesElement = document.getElementById('diary-entries');
const diaryEntryCountElement = document.getElementById('diary-entry-count');
const diaryTitleInput = document.getElementById('diary-title');
const diaryNoteInput = document.getElementById('diary-note');
const addDiaryNoteButton = document.getElementById('add-diary-note');
const cancelDiaryEditButton = document.getElementById('cancel-diary-edit');
const diaryComposeLabel = document.getElementById('diary-compose-label');
const diaryAdditionalPointsElement = document.getElementById('diary-additional-points');
const diaryAdditionalSummary = document.getElementById('diary-additional-summary');

const ATTRIBUTE_LABELS = {
    resistance: 'Resistance',
    strength: 'Strength',
    mind: 'Mind',
    agility: 'Agility'
};

const ATTRIBUTE_ABBREVIATIONS = {
    resistance: 'RES',
    strength: 'STR',
    mind: 'MND',
    agility: 'AGI'
};

let editingEntryId = null;

/* ==========================================================================
   HELPERS
   ========================================================================== */

function createDiaryId() {
    return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeDiary() {
    if (!Array.isArray(characterState.diary)) {
        characterState.diary = [];
    }

    characterState.diary = characterState.diary.map((entry, index) => {
        if (typeof entry === 'string') {
            return {
                id: `legacy-${index}`,
                title: '',
                content: entry,
                createdAt: null,
                updatedAt: null
            };
        }

        return {
            id: entry?.id || `note-${index}`,
            title: entry?.title || '',
            content: entry?.content || '',
            createdAt: entry?.createdAt || null,
            updatedAt: entry?.updatedAt || null
        };
    });
}

function formatDiaryDate(timestamp) {
    if (!timestamp) return '';

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

function getAdditionalPointsFor(attributeName) {
    const additionalPoints = characterState.additionalPoints;

    if (!additionalPoints || typeof additionalPoints !== 'object') {
        return 0;
    }

    return Number(additionalPoints[attributeName]) || 0;
}

function createCounterButton(label, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'plus-button';
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
}

function formatBonus(value) {
    return value > 0 ? `+${value}` : String(value);
}

function getAdditionalPointsSummary() {
    const activeModifiers = Object.keys(ATTRIBUTE_LABELS)
        .map(attributeName => [attributeName, getAdditionalPointsFor(attributeName)])
        .filter(([, value]) => value !== 0)
        .map(([attributeName, value]) => `${ATTRIBUTE_ABBREVIATIONS[attributeName]} ${formatBonus(value)}`);

    return activeModifiers.length > 0
        ? activeModifiers.join(' • ')
        : 'No modifiers';
}

function updateAdditionalPointsSummary() {
    if (diaryAdditionalSummary) {
        diaryAdditionalSummary.textContent = getAdditionalPointsSummary();
    }
}

/* ==========================================================================
   RENDER ADDITIONAL POINTS
   ========================================================================== */

export function renderAdditionalPoints() {
    if (!diaryAdditionalPointsElement) return;

    diaryAdditionalPointsElement.innerHTML = '';

    for (const [attributeName, label] of Object.entries(ATTRIBUTE_LABELS)) {
        const value = getAdditionalPointsFor(attributeName);

        const row = document.createElement('div');
        row.className = 'diary-additional-row';

        const identity = document.createElement('div');
        identity.className = 'diary-additional-identity';

        const name = document.createElement('span');
        name.className = 'diary-additional-name';
        name.textContent = label;

        const total = document.createElement('span');
        total.className = 'diary-additional-total tiny-text';
        total.textContent = `Total: ${getAttributeTotal(attributeName)}`;

        identity.append(name, total);

        const controls = document.createElement('div');
        controls.className = 'static-row counter-control diary-additional-controls';

        const minusButton = createCounterButton('-', () => changeAdditionalPoints(attributeName, -1));
        minusButton.setAttribute('aria-label', `Decrease ${label} additional points`);
        minusButton.title = `Decrease ${label} additional points`;

        const valueElement = document.createElement('span');
        valueElement.className = 'diary-additional-value';
        valueElement.textContent = formatBonus(value);

        if (value > 0) {
            valueElement.classList.add('is-positive');
        } else if (value < 0) {
            valueElement.classList.add('is-negative');
        } else {
            valueElement.classList.add('is-zero');
        }

        const plusButton = createCounterButton('+', () => changeAdditionalPoints(attributeName, 1));
        plusButton.setAttribute('aria-label', `Increase ${label} additional points`);
        plusButton.title = `Increase ${label} additional points`;

        controls.append(minusButton, valueElement, plusButton);
        row.append(identity, controls);

        diaryAdditionalPointsElement.appendChild(row);
    }

    updateAdditionalPointsSummary();
}

function changeAdditionalPoints(attributeName, quantity) {
    alterAdditionalPoints(attributeName, quantity);
    renderAdditionalPoints();
}

/* ==========================================================================
   RENDER NOTES
   ========================================================================== */

export function renderDiary() {
    if (!diaryEntriesElement) return;

    normalizeDiary();

    diaryEntriesElement.innerHTML = '';

    if (diaryEntryCountElement) {
        diaryEntryCountElement.textContent = characterState.diary.length;
    }

    if (characterState.diary.length === 0) {
        const emptyState = document.createElement('span');
        emptyState.className = 'empty-state tiny-text';
        emptyState.textContent = 'No notes yet.';
        diaryEntriesElement.appendChild(emptyState);
        return;
    }

    const sortedEntries = [...characterState.diary]
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    for (const entry of sortedEntries) {
        const entryElement = document.createElement('article');
        entryElement.className = 'diary-entry';

        const entryHead = document.createElement('div');
        entryHead.className = 'diary-entry-head';

        const entryHeading = document.createElement('div');
        entryHeading.className = 'diary-entry-heading';

        const entryTitle = document.createElement('h4');
        entryTitle.className = 'diary-entry-title';
        entryTitle.textContent = entry.title || 'Untitled note';

        entryHeading.appendChild(entryTitle);

        const entryActions = document.createElement('div');
        entryActions.className = 'diary-entry-actions';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'diary-entry-action diary-entry-edit with-icon icon-edit';
        editButton.setAttribute('aria-label', 'Edit note');
        editButton.title = 'Edit note';
        editButton.addEventListener('click', () => startEditingDiaryEntry(entry.id));

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'diary-entry-action diary-entry-delete with-icon icon-delete';
        deleteButton.setAttribute('aria-label', 'Delete note');
        deleteButton.title = 'Delete note';
        deleteButton.addEventListener('click', () => deleteDiaryEntry(entry.id));

        entryActions.append(editButton, deleteButton);
        entryHead.append(entryHeading, entryActions);

        const dateSource = entry.updatedAt || entry.createdAt;
        const entryDate = formatDiaryDate(dateSource);

        if (entryDate) {
            const metaElement = document.createElement('div');
            metaElement.className = 'diary-entry-meta';

            const dateElement = document.createElement('span');
            dateElement.className = 'diary-entry-date tiny-text';
            dateElement.textContent = entryDate;

            metaElement.appendChild(dateElement);

            if (entry.updatedAt) {
                const editedElement = document.createElement('span');
                editedElement.className = 'diary-entry-edited';
                editedElement.textContent = 'Edited';
                metaElement.appendChild(editedElement);
            }

            entryHeading.appendChild(metaElement);
        }

        entryElement.appendChild(entryHead);

        if (entry.content) {
            const contentElement = document.createElement('p');
            contentElement.className = 'diary-entry-content';
            contentElement.textContent = entry.content;
            entryElement.appendChild(contentElement);
        }

        diaryEntriesElement.appendChild(entryElement);
    }
}

/* ==========================================================================
   CREATE / EDIT / DELETE
   ========================================================================== */

function saveDiaryEntry() {
    const title = diaryTitleInput?.value.trim() || '';
    const content = diaryNoteInput?.value.trim() || '';

    if (!title && !content) {
        diaryNoteInput?.focus();
        return;
    }

    normalizeDiary();

    if (editingEntryId) {
        const entry = characterState.diary.find(item => item.id === editingEntryId);

        if (entry) {
            entry.title = title || 'Untitled note';
            entry.content = content;
            entry.updatedAt = Date.now();
        }

        resetDiaryForm();
        renderDiary();
        return;
    }

    characterState.diary.push({
        id: createDiaryId(),
        title: title || 'Untitled note',
        content,
        createdAt: Date.now(),
        updatedAt: null
    });

    resetDiaryForm();
    renderDiary();
    diaryNoteInput?.focus();
}

function startEditingDiaryEntry(entryId) {
    normalizeDiary();

    const entry = characterState.diary.find(item => item.id === entryId);

    if (!entry) return;

    editingEntryId = entry.id;

    if (diaryComposeLabel) {
        diaryComposeLabel.textContent = 'Editing note';
    }

    if (diaryTitleInput) {
        diaryTitleInput.value = entry.title || '';
    }

    if (diaryNoteInput) {
        diaryNoteInput.value = entry.content || '';
    }

    if (addDiaryNoteButton) {
        addDiaryNoteButton.className = 'flex-grow with-icon icon-save';
        addDiaryNoteButton.textContent = 'Save note';
    }

    cancelDiaryEditButton?.classList.remove('hidden');

    diaryTitleInput?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
    diaryTitleInput?.focus();
}

function resetDiaryForm() {
    editingEntryId = null;

    if (diaryComposeLabel) {
        diaryComposeLabel.textContent = 'New note';
    }

    if (diaryTitleInput) {
        diaryTitleInput.value = '';
    }

    if (diaryNoteInput) {
        diaryNoteInput.value = '';
    }

    if (addDiaryNoteButton) {
        addDiaryNoteButton.className = 'flex-grow with-icon icon-plus';
        addDiaryNoteButton.textContent = 'Add note';
    }

    cancelDiaryEditButton?.classList.add('hidden');
}

function deleteDiaryEntry(entryId) {
    normalizeDiary();

    characterState.diary = characterState.diary.filter(entry => entry.id !== entryId);

    if (editingEntryId === entryId) {
        resetDiaryForm();
    }

    renderDiary();
}

/* ==========================================================================
   MODAL CONTROLS
   ========================================================================== */

export function openDiary() {
    renderDiary();
    renderAdditionalPoints();

    diaryModal?.classList.remove('hidden');
    diaryTitleInput?.focus();
}

export function closeDiary() {
    diaryModal?.classList.add('hidden');
}

/* ==========================================================================
   EVENTS
   ========================================================================== */

addDiaryNoteButton?.addEventListener('click', saveDiaryEntry);
cancelDiaryEditButton?.addEventListener('click', resetDiaryForm);

diaryNoteInput?.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        saveDiaryEntry();
    }
});

diaryModal?.addEventListener('click', event => {
    if (event.target === diaryModal) {
        closeDiary();
    }
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !diaryModal?.classList.contains('hidden')) {
        closeDiary();
    }
});

/* ==========================================================================
   GLOBAL FUNCTIONS
   ========================================================================== */

window.openDiary = openDiary;
window.closeDiary = closeDiary;
