const OTHER_VALUES = new Set(['other', 'other-drug', 'other-legal']);
const STORAGE_PREFIX = 'healthtech-other:';

const labels = {
  es: 'Especifique qué otra opción describe su situación',
  ar: 'يرجى تحديد الخيار الآخر الذي يصف وضعك',
  zh: '请说明其他哪一项最符合您的情况',
  en: 'Please specify what the other option is'
};

const placeholders = {
  es: 'Escriba aquí…',
  ar: 'اكتب هنا…',
  zh: '请在此输入…',
  en: 'Type your answer here…'
};

function language() {
  return localStorage.getItem('healthtech-language') || 'en';
}

function getKey(select) {
  const option = select.selectedOptions?.[0];
  return `${STORAGE_PREFIX}${option?.value || ''}:${select.name || select.id || 'question'}`;
}

function isOther(select) {
  return OTHER_VALUES.has(select.value);
}

function enhanceSelect(select) {
  const option = select.selectedOptions?.[0];
  if (!option || !OTHER_VALUES.has(option.value)) {
    const existing = select.parentElement?.querySelector('.other-answer-field');
    if (existing) existing.remove();
    return;
  }

  const parent = select.parentElement;
  if (!parent || parent.querySelector('.other-answer-field')) return;

  const lang = language();
  const wrapper = document.createElement('div');
  wrapper.className = 'other-answer-field';

  const label = document.createElement('label');
  label.className = 'other-answer-label';
  label.textContent = labels[lang] || labels.en;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'other-answer-input';
  input.placeholder = placeholders[lang] || placeholders.en;
  input.setAttribute('aria-label', label.textContent);
  input.autocomplete = 'off';
  input.value = localStorage.getItem(getKey(select)) || '';

  input.addEventListener('input', () => {
    localStorage.setItem(getKey(select), input.value);
    const selected = select.selectedOptions?.[0];
    if (selected) {
      selected.dataset.originalLabel ||= selected.textContent;
      selected.textContent = input.value.trim() || selected.dataset.originalLabel;
    }
    window.dispatchEvent(new CustomEvent('healthtech-other-answer', {
      detail: { value: input.value, type: option.value }
    }));
  });

  label.appendChild(input);
  wrapper.appendChild(label);
  select.insertAdjacentElement('afterend', wrapper);

  if (input.value) {
    option.dataset.originalLabel ||= option.textContent;
    option.textContent = input.value;
  }
}

function refresh(root = document) {
  root.querySelectorAll('select').forEach(select => {
    if ([...select.options].some(option => OTHER_VALUES.has(option.value))) {
      enhanceSelect(select);
    }
  });
}

function install() {
  const root = document.getElementById('root');
  if (!root) return;

  refresh(root);

  root.addEventListener('change', event => {
    const select = event.target.closest?.('select');
    if (select) enhanceSelect(select);
  });

  const observer = new MutationObserver(() => refresh(root));
  observer.observe(root, { childList: true, subtree: true });

  window.addEventListener('healthtech-language-change', () => refresh(root));
  window.addEventListener('storage', event => {
    if (event.key === 'healthtech-language') refresh(root);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', install, { once: true });
} else {
  install();
}
