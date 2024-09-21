<script>
  import { onMount } from 'svelte';
  import axios from 'axios';

  let payments = [];

  const backendBaseUrl = 'http://localhost:3000/api'; // Adjust this URL based on your backend setup

  async function fetchPayments() {
    try {
      // Fetch outgoing payments
      const outgoingResponse = await axios.get(`${backendBaseUrl}/payments/outgoing`);
      const outgoingPayments = outgoingResponse.data.data;

      // Fetch incoming payments
      const incomingResponse = await axios.get(`${backendBaseUrl}/payments/incoming`);
      const incomingPayments = incomingResponse.data.data;

      // Combine both outgoing and incoming payments
      payments = [
        ...outgoingPayments.map(payment => ({ ...payment, type: 'outgoing' })),
        ...incomingPayments.map(payment => ({ ...payment, type: 'incoming' }))
      ];

      // Sort payments by completedAt date (newest first)
      payments.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  }

  onMount(fetchPayments); // Fetch data when the component mounts

  function formatSatoshis(satoshis = 0) {
    return satoshis.toLocaleString(); // Display satoshis with commas for better readability
  }
</script>

<style>
  .transaction-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for modern look */
  }

  .transaction-table h2 {
    margin: 0;
    padding: 15px;
    font-size: 1.25rem;
    text-align: center;
  }

  .transaction-table table {
    width: 100%;
    border-collapse: collapse;
  }

  .transaction-table th,
  .transaction-table td {
    padding: 8px;
    text-align: left;
    word-wrap: break-word;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .no-data {
    text-align: center;
    padding: 20px;
    font-style: italic;
    color: #666;
  }

  .transaction-table table, .transaction-table th, .transaction-table td {
    border: none;
  }

  .transaction-table tr {
    border-bottom: 1px solid #ddd;
  }

  @media (max-width: 768px) {
    .transaction-table {
      overflow-x: auto; 
    }

    .transaction-table th,
    .transaction-table td {
      padding: 8px; 
      font-size: 0.875rem;
    }

    .transaction-table h2 {
      font-size: 1rem;
    }
  }
</style>

<div class="transaction-table">
  <h2>Transaction History</h2>
  <table>
    <thead>
      <tr>
        <th>Type</th>
        <th>ID</th>
        <th>Description</th>
        <th>Amount (Sats)</th>
        <th>Fees (Sats)</th>
        <th>Completed At</th>
      </tr>
    </thead>
    <tbody>
      {#each payments as payment (payment.paymentId || payment.paymentHash)}
        <tr class={payment.type}>
          <td>{payment.type === 'outgoing' ? 'Outgoing' : 'Incoming'}</td>
          <td title={payment.paymentId || payment.paymentHash}>
            {payment.paymentId || payment.paymentHash}
          </td>
          <td>{payment.description || 'N/A'}</td>
          <td>{formatSatoshis(payment.amountSat || payment.receivedSat || 0)}</td>
          <td>{formatSatoshis(payment.fees || 0)}</td>
          <td>{new Date(payment.completedAt).toLocaleString()}</td>
        </tr>
      {:else}
        <tr>
          <td colspan="6" class="no-data">No transactions found.</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
