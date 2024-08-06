window.document.getElementById('fetchBalanceBtn').addEventListener('click', () => {
  fetch('/api/getbalance')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('balance').innerText = 'Balance: ' + data.balanceSat;
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });
});


  