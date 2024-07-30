<script lang="ts">
  import { logout } from '../../stores/auth';
  import { navigate } from 'svelte-routing';

  function handleLogout() {
    logout(); 
    navigate('/');
  }
</script>

<button class="logout-button" on:click={handleLogout}>
  Logout
</button>

<style>
  .logout-button {
    padding: 0.5rem 1rem;
    background-color: #dc3545;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    position: absolute;
    bottom: 45px;
    left: 10px;
  }

  .logout-button:hover {
    background-color: #c82333;
  }
</style>
