<script>
  // Import necessary Svelte functions and Axios
  import { onMount } from 'svelte';
  import axios from 'axios';

  // Define props for the component
  export let apiUrl = 'http://localhost:3000/api/getinfo';

  // Reactive variables to hold data
  let capacitySat = 0;
  let inboundLiquiditySat = 0;

  // Fetch data function
  async function fetchData() {
    try {
      const response = await axios.get(apiUrl);
      const { data } = response.data;

      // Extract data from API response
      if (data.channels && data.channels.length > 0) {
        capacitySat = data.channels[0].capacitySat;
        inboundLiquiditySat = data.channels[0].inboundLiquiditySat;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Fetch data when component mounts
  onMount(fetchData);
</script>

<style>
  .progress-bar {
    height: 40px;
    background-color: #f2f2f2;
    border: 1px solid #cccccc;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    font-family: Arial, sans-serif;
  }

  .bar {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    text-align: center;
    overflow: hidden;
    position: relative;
  }

  .inbound-bar {
    background-color: #2254f3; 
    transition: width 0.5s ease;
  }

  .outbound-bar {
    background-color: #4ca254; 
    transition: width 0.5s ease;
  }

  .label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
    color: white;
    font-size: 14px;
  }
</style>

<div class="progress-bar">
  <div class="bar inbound-bar" style="width: {inboundLiquiditySat}px">
    <span class="label">Inbound liquidity {inboundLiquiditySat} sats</span>
  </div>
  <div class="bar outbound-bar" style="width: {capacitySat}px">
    <span class="label">Outbound liquidity {capacitySat} sats</span>
  </div>
</div>
