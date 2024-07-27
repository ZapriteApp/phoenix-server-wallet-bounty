<script>
  import { onMount } from 'svelte';
  import QRCode from 'qrcode';


  export let offer;
  export let onClose;

  let qrCodeUrl = '';
  let jsonText = '';
  let showQRCodeModal = false;

  // Function to generate QR code from the offer data
  async function generateQRCode() {
    try {
      qrCodeUrl = await QRCode.toDataURL(offer);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  // Function to copy offer text to clipboard
  async function copyToClipboard() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(offer);
        alert('Offer copied to clipboard');
      } else {
        // Fallback method for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = offer;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Offer copied to clipboard');
      }
    } catch (err) {
      console.error('Error copying text:', err);
      alert('Failed to copy offer to clipboard. Please try again.');
    }
  }

  // Function to toggle QR code modal visibility
  function toggleQRCodeModal() {
    showQRCodeModal = !showQRCodeModal;
  }

  // Call generateQRCode and set jsonText on component mount
  onMount(async () => {
    await generateQRCode();
    jsonText = offer; 
  });
</script>

<div class="display-bar">
    <div class="text-container">
      <textarea readonly>{jsonText}</textarea>
    </div>
    <div class="buttons">
      <button on:click={copyToClipboard}>Copy Bolt12 paycode</button>
      <button on:click={toggleQRCodeModal}>Show QR Code</button>
    </div>
</div>

{#if showQRCodeModal}
  <div class="modal-overlay" on:click={toggleQRCodeModal}>
    <div class="modal" on:click|stopPropagation>
      <span class="close" on:click={toggleQRCodeModal}>&times;</span>
      <h2>QR Code</h2>
      <div class="qr-code">
        <img src={qrCodeUrl} alt="QR Code" />
      </div>
    </div>
  </div>
{/if}

<style>
  :root {
    --font-size-base: 1rem;
    --button-padding: 0.5rem 1rem;
    --border-radius: 0.3125rem;
    --box-shadow: 0 0.625rem 1.25rem rgba(0, 0, 0, 0.25);
    --modal-width: 37.5rem;
    --textarea-height: 1.875rem;
    --spacing: 0.625rem;
  }

  .display-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.25rem;
    border: 1px solid #888;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    max-width: var(--modal-width);
    margin: auto;
  }

  .text-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  textarea {
    width: 100%;
    height: var(--textarea-height);
    padding: 0.3125rem;
    margin-bottom: var(--spacing);
    border: 1px solid #ccc;
    border-radius: var(--border-radius);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    resize: none;
    font-size: 1rem;
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: var(--spacing);
  }

  button {
    padding: var(--button-padding);
    font-size: 0.9rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    background-color: #0056b3;
    color: white;
  }

  button:hover {
    background-color: #004494;
  }

  button:focus {
    outline: none;
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

  .modal {
    border: 1px solid #888;
    border-radius: 0.5rem;
    width: 31.25rem;
    box-shadow: var(--box-shadow);
    padding: 1.25rem;
    position: relative;
  }

  .close {
    color: #aaa;
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    font-size: 1.75rem;
    font-weight: bold;
    cursor: pointer;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
  }

  .qr-code {
    margin-top: 1.25rem;
  }

  .qr-code img {
    max-width: 100%;
    height: auto;
  }
</style>
