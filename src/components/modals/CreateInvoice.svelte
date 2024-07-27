<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import QRCode from 'qrcode';

  let description = '';
  let amountSat = '';
  let serialized = '';
  let paymentHash = '';
  let showModal = false;
  let qrCodeUrl = '';
  let showForm = true;

  async function createInvoice() {
    try {
      const response = await axios.post('http://localhost:3000/api/createinvoice', {
        description,
        amountSat: parseInt(amountSat, 10)
      });

      serialized = response.data.data.serialized;
      paymentHash = response.data.data.paymentHash;

      // Generate QR code for serialized data
      await generateQRCode(serialized);

      showModal = true;
      showForm = false;
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    }
  }

  async function generateQRCode(data) {
    try {
      qrCodeUrl = await QRCode.toDataURL(data, { width: 300 });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  function closeModal() {
    showModal = false;
    showForm = true;
    description = '';
    amountSat = '';
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => alert('Serialized data copied to clipboard'))
      .catch(err => console.error('Error copying text: ', err));
  }
</script>

<main>
  <h2>Create Invoice</h2>

  {#if showForm}
    <div>
      <label for="description">Description:</label>
      <input type="text" id="description" bind:value={description}>
    </div>

    <div>
      <label for="amountSat">Amount (in Satoshis):</label>
      <input type="number" id="amountSat" bind:value={amountSat} min="0">
    </div>

    <button on:click={createInvoice}>Create Invoice</button>
  {/if}

  <!-- Modal -->
  {#if showModal}
    <div class="modal-overlay" on:click={closeModal}>
      <div class="modal-content" on:click|stopPropagation>
        <span class="close" on:click={closeModal}>&times;</span>
        <h2>Invoice Details</h2>
        <div class="qr-code">
          <img src={qrCodeUrl} alt="QR Code" />
        </div>
        <p>Payment Hash: {paymentHash}</p>
        <textarea rows="6" readonly>{serialized}</textarea>
        <button on:click={() => copyToClipboard(serialized)}>Copy Serialized Data</button>
      </div>
    </div>
  {/if}
</main>

<style>
  :root {
    --font-size-base: 1rem;
    --border-radius: 0.5rem;
    --padding: 0.625rem;
    --margin: 0.625rem;
    --box-shadow: 0 0.625rem 1.25rem rgba(0, 0, 0, 0.2);
    --modal-width: 31.25rem;
    --qr-code-size: 18.75rem;
  }

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

  .modal-content {
    background: white;
    border-radius: var(--border-radius);
    padding: 1.25rem; /* 20px */
    max-width: var(--modal-width);
    width: 90%;
    box-shadow: var(--box-shadow);
    position: relative;
  }

  .qr-code img {
    width: var(--qr-code-size);
    height: var(--qr-code-size);
  }

  .close {
    position: absolute;
    top: 1.25rem; /* 20px */
    right: 1.25rem; /* 20px */
    font-size: 1.5rem; /* 24px */
    cursor: pointer;
    color: #333;
  }

  .close:hover {
    color: #666;
  }

  textarea {
    width: 100%;
    padding: var(--padding);
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    margin-top: var(--margin);
  }

  button {
    padding: var(--padding) 1.25rem; /* 10px 20px */
    font-size: 1rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    margin-top: var(--margin);
    background-color: #0056b3;
    color: white;
  }

  button:hover {
    background-color: #004494;
  }
</style>
