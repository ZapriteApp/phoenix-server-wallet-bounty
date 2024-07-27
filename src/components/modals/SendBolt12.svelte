<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import axios from 'axios';

  const dispatch = createEventDispatcher();

  let amount = '';
  let offer = '';
  let message = '';
  let responseMessage = '';
  let showResponse = false;

  function handleClose() {
    dispatch('close');
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    // Perform validation
    if (!amount || !offer) {
      responseMessage = 'Amount and Offer are required.';
      showResponse = true;
      return;
    }

    try {
      // Make the API call
      const response = await axios.post('http://localhost:3000/api/payoffer', {
        amountSat: parseInt(amount, 10),
        offer: offer,
        message: message
      });

      // Handle successful response
      const data = response.data;
      responseMessage = `Payment Successful!\n\nPayment ID: ${data.paymentId}\nPayment Hash: ${data.paymentHash}\nPayment Preimage: ${data.paymentPreimage}`;
      showResponse = true;
    } catch (error) {
      console.error('Error sending payment:', error);
      responseMessage = `Failed to send payment. ${error.response ? error.response.data.error : 'Please try again.'}`;
      showResponse = true;
    }
  }
</script>

<main>
  <!-- Modal overlay -->
  <div class="modal-overlay" on:click={handleClose}>
    <!-- Modal content -->
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Pay Bolt12</h2>
        <button class="close-button" on:click={handleClose}>×</button>
      </div>
      <div class="modal-content">
        <form on:submit={handleSubmit}>
          <label>
            Amount (sats):
            <input type="number" bind:value={amount} required class="modal-input" name="amount" min="1" />
          </label>
          <label>
            Offer:
            <input type="text" bind:value={offer} required class="modal-input" name="offer" />
          </label>
          <label>
            Message (optional):
            <textarea bind:value={message} rows="4" class="modal-input" name="message"></textarea>
          </label>
          <button type="submit">Pay Offer</button>
        </form>

        {#if showResponse}
          <div class="response-message">
            <p>{responseMessage}</p>
            <button on:click={handleClose} class="close-button">Close</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>

<style>
  
  .modal-overlay {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    border: 1px solid #888;
    border-radius: var(--border-radius);
    width: var(--modal-width);
    box-shadow: var(--box-shadow);
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--modal-header-padding);
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  .modal-content {
    padding: var(--padding);
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--margin); /* Space between form elements */
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* Space between label and input */
  }

  .modal-input {
    padding: var(--input-padding);
    font-size: var(--font-size-base);
    border: 1px solid #ccc;
    border-radius: var(--border-radius);
    width: 100%;
    box-sizing: border-box;
  }

  textarea {
    resize: vertical;
  }

  button[type="submit"] {
    padding: var(--button-padding);
    font-size: var(--button-font-size);
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    margin-top: var(--margin);
    color: white;
    transition: background-color 0.3s;
  }

  button[type="submit"]:hover {
    background-color: #004499;
  }

  button[type="submit"]:focus {
    outline: none;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: white;
    transition: color 0.3s;
  }

  .close-button:hover {
    color: #ccc;
  }

  .response-message {
    margin-top: var(--margin);
    padding: var(--padding);
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    background-color: #fff;
    box-shadow: var(--box-shadow);
  }

  .response-message p {
    margin: 0;
    font-size: var(--font-size-base);
    color: #333;
  }
</style>
