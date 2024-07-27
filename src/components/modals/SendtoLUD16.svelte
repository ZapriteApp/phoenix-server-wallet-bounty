<!-- SendToLNAddress.svelte -->
<script lang="ts">
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let amountSat = '';
  let lnAddress = '';
  let message = ''; 
  let responseMessage = '';
  let showResponse = false;

  async function sendPayment() {
    try {
      const response = await axios.post('http://localhost:3000/api/paylnaddress', {
        amountSat: parseInt(amountSat, 10),
        address: lnAddress,
        message
      });

      // Parse response
      const data = response.data;
      responseMessage = `Payment Successful!\n\nRecipient Amount: ${data.recipientAmountSat} sats\nRouting Fee: ${data.routingFeeSat} sats\nPayment ID: ${data.paymentId}\nPayment Hash: ${data.paymentHash}\nPayment Preimage: ${data.paymentPreimage}`;
      
      showResponse = true; // Show response message
    } catch (error) {
      console.error('Error sending payment:', error);
      responseMessage = 'Failed to send payment. Please try again.';
      showResponse = true;
    }
  }

  function handleClose() {
    dispatch('close');
  }
</script>

<main>
  <h2>Send Payment to LN Address</h2>

  <div>
    <label for="amountSat">Amount (in Satoshis):</label>
    <input type="number" id="amountSat" bind:value={amountSat} min="0">
  </div>

  <div>
    <label for="lnAddress">LN Address:</label>
    <input type="text" id="lnAddress" bind:value={lnAddress}>
  </div>

  <div>
    <label for="message">Message (optional):</label>
    <input type="text" id="message" bind:value={message}>
  </div>

  <button on:click={sendPayment}>Send Payment</button>

  {#if showResponse}
    <div class="response-message">
      <p>{responseMessage}</p>
      <button on:click={handleClose}>Close</button>
    </div>
  {/if}
</main>

<style>
  div {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
  }

  button {
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #0056b3;
    margin-top: 10px;
  }

  button:hover {
    background-color: #004494;
  }

  button:focus {
    outline: none;
  }

  .response-message {
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
  }

  .response-message p {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
  }
</style>
