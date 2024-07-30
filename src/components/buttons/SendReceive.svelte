<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import CreateInvoice from '../../components/modals/CreateInvoice.svelte';
  import SendBolt11 from '../../components/modals/SendBolt11.svelte';
  import ReceiveBolt12 from '../../components/modals/Bolt12.svelte';
  import SendBolt12 from '../../components/modals/SendBolt12.svelte';
  import SendtoLUD16 from '../../components/modals/SendtoLUD16.svelte'; // Import the new component

  let balance = null;
  let offer = null;

  let showReceiveOptions = false;
  let showSendOptions = false;
  let showCreateInvoiceModal = false;
  let showSendBolt11Modal = false;
  let showReceiveBolt12Modal = false;
  let showSendBolt12Modal = false;
  let showSendtoLUD16Modal = false; // New state for LUD16 modal

  async function fetchData() {
    try {
      const balanceResponse = await fetch('http://localhost:3000/api/getbalance');
      const balanceData = await balanceResponse.json();
      balance = balanceData.data.balanceSat;

      const offerResponse = await fetch('http://localhost:3000/api/getoffer');
      const offerData = await offerResponse.json();
      offer = offerData.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  onMount(fetchData);

  function handleReceiveClick() {
    showReceiveOptions = !showReceiveOptions;
    if (showSendOptions) showSendOptions = false;
  }

  function handleSendClick() {
    showSendOptions = !showSendOptions;
    if (showReceiveOptions) showReceiveOptions = false;
  }

  function handleReceiveInvoiceClick() {
    showCreateInvoiceModal = true;
    showReceiveOptions = false;
  }

  function handleReceiveBolt12Click() {
    showReceiveBolt12Modal = true;
    showReceiveOptions = false;
  }

  function handleSendBolt11Click() {
    showSendBolt11Modal = true;
    showSendOptions = false;
  }

  function handleSendBolt12Click() {
    showSendBolt12Modal = true;
    showSendOptions = false;
  }

  function handleSendtoLUD16Click() {
    showSendtoLUD16Modal = true;
    showSendOptions = false;
  }

  function handleCloseCreateInvoiceModal() {
    showCreateInvoiceModal = false;
  }

  function handleCloseSendBolt11Modal() {
    showSendBolt11Modal = false;
  }

  function handleCloseReceiveBolt12Modal() {
    showReceiveBolt12Modal = false;
  }

  function handleCloseSendBolt12Modal() {
    showSendBolt12Modal = false;
  }

  function handleCloseSendtoLUD16Modal() {
    showSendtoLUD16Modal = false;
  }
</script>

<main>
  <div class="balance-container">
    <span class="balance">Balance: {balance} sats</span>
  </div>

  <div class="action-container">
    <div class="action-group">
      <button class="action-button" on:click={handleReceiveClick}>
        Receive <Icon icon="hugeicons:money-receive-circle" />
      </button>
      {#if showReceiveOptions}
        <div class="options options-receive">
          <button class="option-button" on:click={handleReceiveInvoiceClick}>
            Invoice <Icon icon="hugeicons:money-receive-circle" />
          </button>
          <button class="option-button" on:click={handleReceiveBolt12Click}>
            Bolt12 <Icon icon="hugeicons:money-receive-circle" />
          </button>
        </div>
      {/if}
    </div>

    <div class="action-group">
      <button class="action-button" on:click={handleSendClick}>
        Send <Icon icon="hugeicons:money-send-circle" />
      </button>
      {#if showSendOptions}
        <div class="options options-send">
          <button class="option-button" on:click={handleSendBolt11Click}>
            Bolt11 <Icon icon="hugeicons:money-send-circle" />
          </button>
          <button class="option-button" on:click={handleSendBolt12Click}>
            Bolt12 <Icon icon="hugeicons:money-send-circle" />
          </button>
          <button class="option-button" on:click={handleSendtoLUD16Click}>
            LUD16 <Icon icon="hugeicons:money-send-circle" />
          </button>
        </div>
      {/if}
    </div>
  </div>

  {#if showCreateInvoiceModal}
    <div class="modal-backdrop" on:click={handleCloseCreateInvoiceModal}>
      <div class="modal" on:click|stopPropagation>
        <CreateInvoice on:close={handleCloseCreateInvoiceModal} />
      </div>
    </div>
  {/if}

  {#if showSendBolt11Modal}
    <div class="modal-backdrop" on:click={handleCloseSendBolt11Modal}>
      <div class="modal" on:click|stopPropagation>
        <SendBolt11 on:close={handleCloseSendBolt11Modal} />
      </div>
    </div>
  {/if}

  {#if showReceiveBolt12Modal}
    <div class="modal-backdrop" on:click={handleCloseReceiveBolt12Modal}>
      <div class="modal" on:click|stopPropagation>
        <ReceiveBolt12 {offer} on:close={handleCloseReceiveBolt12Modal} />
      </div>
    </div>
  {/if}

  {#if showSendBolt12Modal}
    <div class="modal-backdrop" on:click={handleCloseSendBolt12Modal}>
      <div class="modal" on:click|stopPropagation>
        <SendBolt12 on:close={handleCloseSendBolt12Modal} />
      </div>
    </div>
  {/if}

  {#if showSendtoLUD16Modal}
    <div class="modal-backdrop" on:click={handleCloseSendtoLUD16Modal}>
      <div class="modal" on:click|stopPropagation>
        <SendtoLUD16 on:close={handleCloseSendtoLUD16Modal} />
      </div>
    </div>
  {/if}
</main>

<style>
  :root {
    --font-size-base: 1rem; /* Base font size */
    --font-size-small: 0.875rem; /* Small font size */
    --border-radius: 0.5rem; /* Border radius */
    --padding: 0.625rem; /* Padding */
    --margin: 0.625rem; /* Margin */
    --box-shadow: 0 0.625rem 1.25rem rgba(0, 0, 0, 0.1); /* Box shadow */
    --modal-width: 25rem; /* Modal width */
    --button-padding: 0.625rem 1.25rem; /* Button padding */
    --input-padding: 0.5rem; /* Input padding */
    --button-font-size: 1rem; /* Button font size */
    --modal-header-padding: 1.25rem; /* Modal header padding */
  }

  .balance-container {
    display: flex;
    justify-content: center;
    margin-top: var(--margin);
  }

  .balance {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .action-container {
    display: flex;
    justify-content: space-around;
    margin-top: var(--margin);
  }

  .action-group {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 var(--margin);
  }

  .action-button {
    padding: var(--padding) var(--button-padding);
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: var(--border-radius);
    margin-bottom: var(--margin);
    display: flex;
    align-items: center;
  }

  .action-button:hover {
    background-color: #0056b3;
  }

  .action-button svg {
    margin-left: var(--padding);
  }

  .options {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    width: 12.5rem; /* Fixed width for the options */
    padding: var(--padding) 0;
    z-index: 1000;
  }

  .options-receive {
    top: 100%; /* Position below the button */
  }

  .options-send {
    top: 100%; /* Position below the button */
  }

  .option-button {
    padding: var(--padding) var(--button-padding);
    background-color: #f8f9fa;
    color: #333;
    border: none;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    text-align: left;
    display: flex;
    align-items: center;
  }

  .option-button:last-child {
    border-bottom: none;
  }

  .option-button:hover {
    background-color: #e2e6ea;
  }

  .option-button svg {
    margin-left: var(--padding);
  }

  .modal-backdrop {
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
    padding: var(--padding);
  }
</style>