import test from 'node:test';
import assert from 'node:assert/strict';
import { validateName, validateEmail, validateForm } from './validation.js';

test('validateName rejects empty and whitespace-only names', () => {
  assert.equal(validateName(''), 'Name is required');
  assert.equal(validateName('   '), 'Name is required');
});

test('validateName accepts a real name', () => {
  assert.equal(validateName('Dua Shakeel'), null);
});

test('validateEmail rejects empty email', () => {
  assert.equal(validateEmail(''), 'Email is required');
});

test('validateEmail rejects missing @', () => {
  assert.equal(validateEmail('personexample.com'), 'Enter a valid email address');
});

test('validateEmail rejects missing domain', () => {
  assert.equal(validateEmail('person@'), 'Enter a valid email address');
});

test('validateEmail rejects emails with spaces', () => {
  assert.equal(validateEmail('person @example.com'), 'Enter a valid email address');
});

test('validateEmail accepts a valid address', () => {
  assert.equal(validateEmail('person@example.com'), null);
});

test('validateForm reports both fields independently', () => {
  const result = validateForm({ name: '', email: 'bad' });
  assert.equal(result.name, 'Name is required');
  assert.equal(result.email, 'Enter a valid email address');
});

test('validateForm returns no errors for valid input', () => {
  const result = validateForm({ name: 'Dua Shakeel', email: 'person@example.com' });
  assert.equal(result.name, null);
  assert.equal(result.email, null);
});
