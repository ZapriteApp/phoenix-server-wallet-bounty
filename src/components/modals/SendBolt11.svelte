<script lang="ts">
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let amountSat = '';
  let invoice = '';
  let responseMessage = '';
  let showResponse = false;

  async function sendPayment() {
    try {
      const response = await axios.post('http://localhost:3000/api/payinvoice', {
        amountSat: parseInt(amountSat, 10), 
        invoice: invoice,
      });

      // Parse response
      const data = response.data;
      responseMessage = `Payment Successful!\n\nRecipient Amount: ${data.recipientAmountSat} sats\nRouting Fee: ${data.routingFeeSat} sats\nPayment ID: ${data.paymentId}\nPayment Hash: ${data.paymentHash}\nPayment Preimage: ${data.paymentPreimage}`;
      
      showResponse = true;
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
  <h2>Pay Invoice</h2>

  <div class="form-group">
    <label for="amountSat">Amount (in Satoshis, optional):</label>
    <input type="number" id="amountSat" bind:value={amountSat} min="1" />
  </div>

  <div class="form-group">
    <label for="invoice">BOLT11 Invoice:</label>
    <input type="text" id="invoice" bind:value={invoice} />
  </div>

  <button on:click={sendPayment}>Pay</button>

  {#if showResponse}
    <div class="response-message">
      <p>{responseMessage}</p>
      <button on:click={handleClose} class="close-button">Close</button>
    </div>
  {/if}
</main>

<style>
  :root {
    --font-size-base: 1rem;
    --border-radius: 0.5rem;
    --padding: 0.625rem;
    --margin: 0.625rem;
    --box-shadow: 0 0.625rem 1.25rem rgba(0, 0, 0, 0.1);
    --modal-width: 25rem;
    --button-padding: 0.625rem 1.25rem;
    --input-padding: 0.5rem;
    --button-font-size: 1rem;
  }

  main {
    padding: var(--padding);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    max-width: var(--modal-width);
    margin: auto;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: var(--margin);
  }

  .form-group {
    margin-bottom: var(--margin);
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555; 
  }

  input {
    padding: var(--input-padding);
    font-size: var(--font-size-base);
    border: 1px solid #ccc;
    border-radius: var(--border-radius);
    width: 100%;
    box-sizing: border-box;
  }

  button {
    padding: var(--button-padding);
    font-size: var(--button-font-size);
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    margin-top: var(--margin);
  }

  button:hover {
    background-color: #0056b3;
  }

  button:focus {
    outline: none;
  }

  .response-message {
    margin-top: var(--margin);
    padding: var(--padding);
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
  }

  .response-message p {
    margin: 0;
    font-size: var(--font-size-base);
  }

  .close-button {
    background-color: #dc3545;
    color: white;
    margin-top: var(--margin);
  }

  .close-button:hover {
    background-color: #c82333;
  }
</style>
