<script>
  import { onMount } from 'svelte';
  import Liquidity from './Liquidity.svelte';



  // Define props for the component
  export let apiUrl = 'http://localhost:3000/api/getinfo'; // Default API URL

  // Reactive variables to hold data
  let nodeInfo = {};

  // Fetch data function
  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      const { data } = await response.json();
      nodeInfo = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Fetch data when component mounts
  onMount(fetchData);

  // Function to format Node Information display
  function formatNodeInfo(nodeInfo) {
    if (!nodeInfo || Object.keys(nodeInfo).length === 0) {
      return 'No data available';
    }

    const { nodeId, channels, chain, blockHeight, version } = nodeInfo;
    const firstChannel = channels && channels.length > 0 ? channels[0] : null;

    return `
      Node ID: ${nodeId}
      Chain: ${chain}
      Block Height: ${blockHeight}
      Version: ${version}
      ${firstChannel ? `
        Channel ID: ${firstChannel.channelId}
        State: ${firstChannel.state}
        Capacity: ${firstChannel.capacitySat} sat
        Inbound Liquidity: ${firstChannel.inboundLiquiditySat} sat
      ` : ''}
    `;
  }
</script>

<style>
  .node-info {
    padding: 20px;
    border: 1px solid #F7931A;
    border-radius: 8px;
    background-color: #FFF3E0;
    color: #333;
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    overflow: hidden;
    word-wrap: break-word;
  }

  .node-info h2 {
    color: #F7931A;
    margin-bottom: 10px;
  }

  .node-info pre {
    white-space: pre-wrap;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1rem;
  }
</style>

<div class="node-info">
  <h2>Node Information</h2>
  <pre>{formatNodeInfo(nodeInfo)}</pre>
</div>
<div>
<Liquidity />
</div>