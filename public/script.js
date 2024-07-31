function getBalance() {
    fetch('/api/balance')
      .then(response => response.json())
      .then(data => {
        document.getElementById('balance').innerText = 'Balance: ' + data.balance;
      })
      .catch(error => {
        console.error('Error fetching balance:', error);
      });
  }
  