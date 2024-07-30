<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { login } from '../stores/auth';

  function handleLogin() {
    login(); // Set authentication state and token
    navigate('/app'); // Redirect to the main app screen
  }
</script>

<div class="login-screen">
  <h3>Welcome to Your Node Manager</h3>
  <button on:click={handleLogin}>Enter App</button>
</div>

<style>
  .login-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    color: white;
    background-color: #007bff;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 2rem;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
