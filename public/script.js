$(document).ready(function () {
  $('#home-page').on('click', '#home', function () {
    $.ajax({
      url: 'views/partials/home.ejs',
      method: 'GET',
      success: function (html) {
        $('#rightPanel').html(html);
      },
      error: function (xhr, status, error) {
        console.error('Error loading partial:', error);
      }
    });
  });

  $('#home-page').on('click', '#transactions', function () {
    $.ajax({
      url: 'views/partials/transactions.ejs',
      method: 'GET',
      success: function (html) {
        $('#rightPanel').html(html);
      },
      error: function (xhr, status, error) {
        console.error('Error loading partial:', error);
      }
    });
  });
});


$(document).ready(function () {
  let balance;
  fetch('/api/get-balance')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // document.getElementsByClassName('.balance').innerText = data.balanceSat;
      $('.balance').html(`Balance: ${data.balanceSat} sats`);
      console.log(data)
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });
});



// document.getElementById('home').addEventListener('click', function() {
//   fetch('views/partials/home.ejs')
//   .then(response => response.text())
//   .then(html => {
//       document.getElementById('rightPanel').innerHTML = html;
//   })
//   .catch(error => console.error('Error loading partial:', error));
// });

// document.getElementById('transactions').addEventListener('click', function() {
//   fetch('views/partials/transactions.ejs')
//   .then(response => response.text())
//   .then(html => {
//       document.getElementById('rightPanel').innerHTML = html;
//   })
//   .catch(error => console.error('Error loading partial:', error));
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
rightPanel = document.getElementById("rightPanel")
transactions = document.getElementById("transactions")
transactions = document.getElementById("transactions")


// receiveButton.addEventListener('click', function () {
//   alert('You clicked recieve button');
// });


// // Get the modal
// var modal = document.getElementById("myModal");

// // Get the button that opens the modal
// var btn = document.getElementById("sendButton");

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks the button, open the modal 
// btn.onclick = function() {
//   modal.style.display = "block";
// }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }
$(document).ready(function () {
  var $modal = $("#myModal");

  // Get the button that opens the modal
  var $sendButton = $("#sendButton");
  var $receiveButton = $("#receiveButton");

  // Get the <span> element that closes the modal
  var $span = $(".close").first();

  $(".main-content").on("click", '#receiveButton', function () {
    alert('Receive sats button');
  })

  // When the user clicks the button, open the modal
  $(".main-content").on("click", '#sendButton', function () {
    $modal.show();
  })



  // When the user clicks on <span> (x), close the modal
  $span.on("click", function () {
    $modal.hide();
  });


  // When the user clicks anywhere outside of the modal, close it
  $(window).on("click", function (event) {
    if ($(event.target).is($modal)) {
      $modal.hide();
    }
  });



  $("#myModal").on("click", "#submitOption", function () {
    console.log("Submit clicked")
    var selectedOption = $("#options").val();
    if (selectedOption) {
      $("#selectedOption").text('You selected: ' + selectedOption);
    } else {
      $("#selectedOption").text('No option selected.');
    }
    $modal.hide(); // Close the modal
  });


  // attachSubmitOptionHandler();

  // // Example function to update DOM and reattach handlers
  // function updateDOM() {
  //   attachSubmitOptionHandler();
  // }

  // updateDOM();

})

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }

document.querySelectorAll('.load-partial').forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const url = this.getAttribute('href');

    fetch(url)
      .then(response => response.text())
      .then(data => {
        document.getElementById('partialContainer').innerHTML = data;
      })
      .catch(error => console.error('Error loading partial:', error));
  });
});

// Handle the radio button selection
// document.getElementById('submitOption').addEventListener('click', function () {
//   var selectedOption = document.getElementById('options').value;
//   if (selectedOption) {
//     console.log(selectedOption)
//     document.getElementById('selectedOption').textContent = 'You selected: ' + selectedOption.value;
//   } else {
//     document.getElementById('selectedOption').textContent = 'No option selected.';
//   }
//   modal.style.display = "none"; // Close the modal
// })

// document.getElementById('transactions').addEventListener('click', function(event) {
//   event.preventDefault();
//   console.log("Clicked transactions")
//   // fetch('views/partials/transactions.ejs')
//   // .then(response => response.text())
//   // .then(data => {
//   //   document.getElementById("rightPanel").innerHTML =data;
//   // })
//   // .catch(error => console.error('Error loading partial view:', error));
//   rightPanel.innerHTML = '<h1>You clicked transctions</h1>';
// })


function loadPartial(url) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById('content').innerHTML = data;
    })
    .catch(error => console.error('Error loading partial:', error));
}


