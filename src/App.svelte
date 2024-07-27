<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { Router, Route, navigate } from 'svelte-routing';
  import Welcome from './components/Welcome.svelte';
  import LogOut from './components/buttons/LogOut.svelte';
  import Version from './components/Version.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import TransactionHistory from './components/TransactionHistory.svelte';
  import { isAuthenticated, initializeAuth } from './stores/auth';
  import type { Channel } from './components/Dashboard.svelte';
  import { readable } from 'svelte/store';

  // Initialize authentication status on mount
  onMount(() => {
    initializeAuth();
  });

  let currentPage = 'dashboard';

  $: if (!$isAuthenticated) {
    navigate('/');
  }

  
</script>

<Router>
  <Route path="/" component={Welcome} />

  <Route path="/app/*">

    {#if $isAuthenticated}

      <div class="container">
        <nav>
          <button on:click={() => currentPage = 'dashboard'}>
            <Icon icon="mdi-light:home" /> Dashboard
          </button>
          <button on:click={() => currentPage = 'history'}>
            <Icon icon="bitcoin-icons:exchange-filled" /> Transactions
          </button>
        
          <LogOut />
          <Version />
        </nav>

        <div class="main-content">

          {#if currentPage === 'dashboard'}

            <Dashboard />

          {:else if currentPage === 'history'}

            <TransactionHistory />
          {/if}
        </div>
      </div>
    {/if}
  </Route>
</Router>

<style>
  @import './global.css';

  .container {
    display: flex;
  }

  nav {
    width: 200px;
    padding: 1rem;
    border-right: 1px solid #ddd;
  }

  .main-content {
    flex: 1;
    padding: 1rem;
  }

  button {
    display: block;
    width: 100%;
    padding: 0.5rem;
    border: none;
    margin-bottom: 1rem;
    cursor: pointer;
    border-radius: 5px;
    text-align: left;
  }

  button:hover {
    background-color: #ced4da;
  }
</style>
