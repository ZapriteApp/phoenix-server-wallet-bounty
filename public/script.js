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
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });
});

sendButton = document.getElementById("sendButton")
receiveButton = document.getElementById("receiveButton")
rightPanel = document.getElementById("rightPanel")
transactions = document.getElementById("transactions")
transactions = document.getElementById("transactions")

$(document).ready(function () {
  var $modal1 = $("#myModal1");
  var $modal2 = $("#myModal2");
  var $modal3 = $("#myModal3");

  // Get the button that opens the modal
  var $sendButton = $("#sendButton");
  var $receiveButton = $("#receiveButton");

  // Get the <span> element that closes the modal
  var $span = $(".close").first();
  $(".close").on("click", function () {
    var modalId = $(this).data('modal');
    $("#" + modalId).hide();
  });

  $(".main-content").on("click", '#receiveButton', function () {
    alert('Receive sats button');
  })

  // When the user clicks the button, open the modal
  $(".main-content").on("click", '#sendButton', function () {
    $modal1.show();
  })



  // When the user clicks on <span> (x), close the modal
  $span.on("click", function () {
    $modal1.hide();
  });


  // When the user clicks anywhere outside of the modal, close it
  $(window).on("click", function (event) {
    if ($(event.target).is($modal1)) {
      $modal1.hide();
    }
  });



  $("#myModal1").on("click", "#submitOption", function () {
    console.log("Submit clicked")
    var selectedOption = $("#options").val();
    if (selectedOption) {
        console.log(selectedOption)
    } else {
      $("#selectedOption").text('No option selected.');
    }
    $modal1.hide();
    
    $modal2.show(); // Close the modal
  });


  $("#myModal2").on("click", "#submitOption2", function () {
    console.log("Submit clicked")
    const invoice = $("#requestInvoice").val();
    const amountSat=50;
    console.log(invoice);
    console.log(amountSat);
    $("#requestInvoice").val(" ");

    fetch('/api/pay-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amountSat, invoice })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      console.log(response.json());
    })
    
    $modal2.hide();
    $modal3.show(); // Close the modal
  });

  $("#myModal3").on("click", "#submitOption3", function () {
    console.log("Submit clicked")
    $modal3.hide(); // Close the modal
  });


})

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

function loadPartial(url) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById('content').innerHTML = data;
    })
    .catch(error => console.error('Error loading partial:', error));
}


