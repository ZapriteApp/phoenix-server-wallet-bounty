import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);
export const authToken = writable(null);

// Initialize authentication and token from local storage
export function initializeAuth() {
  const token = localStorage.getItem('authToken');
  const authStatus = token !== null;
  isAuthenticated.set(authStatus);
  authToken.set(token);
}

export function login() {
  // Simulate token generation (you would replace this with actual token from an auth server)
  const token = 'your_generated_token_here'; // Replace with actual token from server

  // Store token and update authentication state
  localStorage.setItem('authToken', token);
  isAuthenticated.set(true);
  authToken.set(token);
}

export function logout() {
  // Clear token and authentication status
  localStorage.removeItem('authToken');
  isAuthenticated.set(false);
  authToken.set(null);
}
