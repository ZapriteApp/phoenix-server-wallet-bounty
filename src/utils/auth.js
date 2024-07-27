import { authStore } from '../stores/auth';

// Function to simulate logging out
export function logout() {
  // Clear authentication state
  authStore.set({
    isAuthenticated: false,
    user: null
  });

  // Perform any additional logout operations here (e.g., clearing tokens or cookies)
  // Example: localStorage.removeItem('authToken');
}
