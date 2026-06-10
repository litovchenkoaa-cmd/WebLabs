'use strict';

/**
 * ============================================
 * МОДЕЛЬ (ХРАНИЛИЩЕ)
 * ============================================
 */
class TodoStore {
    constructor(storageKey = 'todo-app-data') {
        this.storageKey = storageKey;
        this.items = [];
        this._load();
    }

    _load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                this.items = JSON.parse(raw);
            }
        } catch (e) {
            console.warn('Не удалось загрузить данные из localStorage:', e);
            this.items = [];
        }
    }

    _save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        } catch (e) {
            console.warn('Не удалось сохранить данные в localStorage:', e);
        }
    }

    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    getAll() {
        return [...this.items];
    }

    getById(id) {
        return this.items.find(item => item.id === id) || null;
    }

    add(text) {
        const trimmed = String(text || '').trim();
        if (!trimmed) return null;

        const item = {
            id: this._generateId(),
            text: trimmed,
            completed: false,
            createdAt: Date.now(),
        };
        this.items.push(item);
        this._save();
        return item;
    }

    toggle(id) {
        const item = this.getById(id);
        if (!item) return null;
        item.completed = !item.completed;
        this._save();
        return item;
    }

    update(id, newText) {
        const item = this.getById(id);
        if (!item) return null;
        const trimmed = String(newText || '').trim();
        if (!trimmed) return null;
        item.text = trimmed;
        this._save();
        return item;
    }

    remove(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index === -1) return false;
        this.items.splice(index, 1);
        this._save();
        return true;
    }

    clearAll() {
        this.items = [];
        this._save();
        return true;
    }
}

/**
 * ============================================
 * ПРЕДСТАВЛЕНИЕ (РЕНДЕРЕР)
 * ============================================
 */
class TodoRenderer {
    constructor(listElement, emptyStateElement) {
        this.listElement = listElement;
        this.emptyStateElement = emptyStateElement;
    }

    _formatDate(timestamp) {
        const d = new Date(timestamp);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}.${mm}.${yyyy}`;
    }

    _createItemElement(item) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = item.id;

        const label = document.createElement('label');
        label.className = 'todo-item__label';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-item__checkbox';
        checkbox.checked = item.completed;
        checkbox.dataset.action = 'toggle';

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-item__text';
        textSpan.textContent = item.text;

        label.appendChild(checkbox);
        label.appendChild(textSpan);

        const dateSpan = document.createElement('span');
        dateSpan.className = 'todo-item__date';
        dateSpan.textContent = `от ${this._formatDate(item.createdAt)}`;

        const editBtn = document.createElement('button');
        editBtn.className = 'todo-item__edit';
        editBtn.type = 'button';
        editBtn.setAttribute('aria-label', 'Редактировать');
        editBtn.dataset.action = 'edit';
        editBtn.textContent = '✎';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-item__delete';
        deleteBtn.type = 'button';
        deleteBtn.setAttribute('aria-label', 'Удалить');
        deleteBtn.dataset.action = 'delete';
        deleteBtn.textContent = '✖';

        li.appendChild(label);
        li.appendChild(dateSpan);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        return li;
    }

    render(items) {
        this.listElement.innerHTML = '';
        const fragment = document.createDocumentFragment();
        items.forEach(item => {
            fragment.appendChild(this._createItemElement(item));
        });
        this.listElement.appendChild(fragment);
        this._updateEmptyState(items.length);
    }

    _updateEmptyState(count) {
        if (this.emptyStateElement) {
            this.emptyStateElement.style.display = count === 0 ? 'flex' : 'none';
        }
    }

    enterEditMode(id, currentText, onSave, onCancel) {
        const li = this.listElement.querySelector(`[data-id="${id}"]`);
        if (!li) return;

        const label = li.querySelector('.todo-item__label');
        if (!label) return;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'todo-item__edit-input';
        input.value = currentText;

        label.innerHTML = '';
        label.appendChild(input);
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);

        const finish = (save) => {
            const newValue = input.value.trim();
            // Восстанавливаем исходную разметку
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-item__checkbox';
            checkbox.dataset.action = 'toggle';

            const textSpan = document.createElement('span');
            textSpan.className = 'todo-item__text';
            textSpan.textContent = currentText; // временно

            label.innerHTML = '';
            label.appendChild(checkbox);
            label.appendChild(textSpan);

            if (save && newValue && newValue !== currentText) {
                onSave(newValue);
            } else {
                onCancel();
            }
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                finish(true);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                finish(false);
            }
        });

        input.addEventListener('blur', () => finish(true));
    }
}

/**
 * ============================================
 * КОНТРОЛЛЕР (ПРИЛОЖЕНИЕ)
 * ============================================
 */
class TodoApp {
    constructor() {
        this.store = new TodoStore('todo-app-items');
        this.renderer = new TodoRenderer(
            document.querySelector('.todo-list'),
            document.querySelector('.empty-state')
        );

        this.currentFilter = 'all'; // 'all' | 'active' | 'completed'
        this.currentSort = 'date';  // 'date' | 'name'

        this._bindUI();
        this._render();
    }

    _bindUI() {
        // Форма создания
        const input = document.querySelector('.todo-form__input');
        const createBtn = document.querySelector('.todo-form__button--create');
        const clearBtn = document.querySelector('.todo-form__button--clear');

        createBtn.addEventListener('click', () => this._handleCreate(input));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this._handleCreate(input);
            }
        });

        clearBtn.addEventListener('click', () => {
            if (this.store.getAll().length === 0) return;
            if (confirm('Удалить все записи?')) {
                this.store.clearAll();
                this._render();
            }
        });

        // Делегирование событий на списке
        const listEl = document.querySelector('.todo-list');
        listEl.addEventListener('click', (e) => {
            const actionEl = e.target.closest('[data-action]');
            if (!actionEl) return;
            const li = actionEl.closest('.todo-item');
            if (!li) return;
            const id = li.dataset.id;
            const action = actionEl.dataset.action;

            if (action === 'toggle') {
                this.store.toggle(id);
                this._render();
            } else if (action === 'delete') {
                if (confirm('Удалить запись?')) {
                    this.store.remove(id);
                    this._render();
                }
            } else if (action === 'edit') {
                const item = this.store.getById(id);
                if (!item) return;
                this.renderer.enterEditMode(
                    id,
                    item.text,
                    (newText) => {
                        this.store.update(id, newText);
                        this._render();
                    },
                    () => this._render()
                );
            }
        });

        // Фильтры
        document.querySelectorAll('.filter-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentFilter = link.dataset.filter;
                document.querySelectorAll('.filter-link').forEach(l =>
                    l.classList.remove('filter-link--active')
                );
                link.classList.add('filter-link--active');
                this._render();
            });
        });

        // Сортировка
        document.querySelectorAll('.sort-button').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentSort = btn.dataset.sort;
                document.querySelectorAll('.sort-button').forEach(b =>
                    b.classList.remove('sort-button--active')
                );
                btn.classList.add('sort-button--active');
                this._render();
            });
        });

        // Инициализация активной кнопки сортировки
        const defaultSortBtn = document.querySelector(`.sort-button[data-sort="${this.currentSort}"]`);
        if (defaultSortBtn) defaultSortBtn.classList.add('sort-button--active');
    }

    _handleCreate(input) {
        const value = input.value.trim();
        if (!value) {
            input.focus();
            return;
        }
        this.store.add(value);
        input.value = '';
        input.focus();
        this._render();
    }

    _getFilteredAndSorted() {
        let items = this.store.getAll();

        // Фильтрация
        if (this.currentFilter === 'active') {
            items = items.filter(i => !i.completed);
        } else if (this.currentFilter === 'completed') {
            items = items.filter(i => i.completed);
        }

        // Сортировка
        if (this.currentSort === 'name') {
            items.sort((a, b) => a.text.localeCompare(b.text, 'ru'));
        } else {
            // По дате — новые сверху
            items.sort((a, b) => b.createdAt - a.createdAt);
        }

        return items;
    }

    _render() {
        const items = this._getFilteredAndSorted();
        this.renderer.render(items);
    }
}

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});