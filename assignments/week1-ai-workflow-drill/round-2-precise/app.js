import { validateForm } from './validation.js';

const form = document.getElementById('settingsForm');
const summary = document.getElementById('formSummary');
const success = document.getElementById('formSuccess');

const fields = {
  name: {
    input: document.getElementById('name'),
    error: document.getElementById('nameError'),
  },
  email: {
    input: document.getElementById('email'),
    error: document.getElementById('emailError'),
  },
};

function clearErrors() {
  for (const key of Object.keys(fields)) {
    fields[key].input.removeAttribute('aria-invalid');
    fields[key].error.textContent = '';
  }
  summary.textContent = '';
  success.hidden = true;
}

function showErrors(errors) {
  let count = 0;
  let firstInvalid = null;

  for (const key of Object.keys(fields)) {
    const message = errors[key];
    const { input, error } = fields[key];
    if (message) {
      count += 1;
      input.setAttribute('aria-invalid', 'true');
      error.textContent = message;
      if (!firstInvalid) firstInvalid = input;
    }
  }

  summary.textContent = `${count} field${count === 1 ? '' : 's'} need${count === 1 ? 's' : ''} attention`;
  if (firstInvalid) firstInvalid.focus();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const errors = validateForm({
    name: fields.name.input.value,
    email: fields.email.input.value,
  });

  const hasErrors = Object.values(errors).some(Boolean);
  if (hasErrors) {
    showErrors(errors);
    return;
  }

  success.hidden = false;
  success.textContent = 'Settings saved.';
});
