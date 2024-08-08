// document.getElementById('login').addEventListener('click', function() {
//   window.location.href = 'public/dashboard.html';
// });

// function getBalance(){
//   fetch('/api/getbalance')
//   .then(response => {
//     if (!response.ok) {
//         throw new Error('Network response was not ok ' + response.statusText);
//     }
//       return response.json();
//   })
//   .then(data => {
//     document.getElementById('balance').innerText = 'Balance: ' + data.balanceSat;
//   })
//   .catch(error => {
//     console.error('Error fetching balance:', error);
//   });
  
// }


// function login(){

// }


// window.document.getElementById('fetchBalanceBtn').addEventListener('click', () => {
  
// });

sendButton = document.getElementById("sendButton")
receiveButton = document.getElementById("receiveButton")

// alertButton.addEventListener('click', function() {
//   alert('You clicked receive button');
// });

receiveButton.addEventListener('click', function() {
  alert('You clicked send button');
});


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("sendButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Handle the radio button selection
document.getElementById('submitOption').addEventListener('click', function() {
  var selectedOption = document.getElementById('options').value;
    if (selectedOption) {
        console.log(selectedOption)
        document.getElementById('selectedOption').textContent = 'You selected: ' + selectedOption.value;
    } else {
        document.getElementById('selectedOption').textContent = 'No option selected.';
    }
    modal.style.display = "none"; // Close the modal
})
    

  