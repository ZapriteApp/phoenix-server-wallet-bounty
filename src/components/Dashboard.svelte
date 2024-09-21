<script lang="ts">
  import SendReceive from '../components/buttons/SendReceive.svelte';
  import NodeInfo from './NodeInfo.svelte'
  import { onMount } from 'svelte';

 
</script>

<style>
  .dashboard {
    padding: 1rem;
  }
 
</style>

<div class="dashboard component">
  <SendReceive /> 
  <NodeInfo />
</div>

