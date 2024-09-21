<script lang="ts">
import Icon from '@iconify/svelte';
import { navigate } from 'svelte-routing';

  let version = 'v 0.0.1'

</script>

<div class="version-button">
  Version {version} <Icon icon="devicon:github-wordmark" />
</div>

<style>
  .version-button {
    padding: 0.5rem 1rem;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    position: absolute; 
    bottom: 10px; 
    left: 10px;
  }

  .version-button:hover {
    background-color: #c82333;
  }
</style>
