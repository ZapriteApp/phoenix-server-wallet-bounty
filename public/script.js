$(document).ready(function () {
  $('#home-page').on('click', '#home', function () {
    $.ajax({
      url: 'views/partials/home.ejs',
      method: 'GET',
      success: function (html) {
        location.reload();
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

  $('#home-page').on('click', '#contacts', function () {
    $.ajax({
      url: 'views/partials/contacts.ejs',
      method: 'GET',
      success: function (html) {
        $('#rightPanel').html(html);

      },
      error: function (xhr, status, error) {
        console.error('Error loading partial:', error);
      }
    });
  });

  $('#home-page').on('click', '#settings', function () {
    $.ajax({
      url: 'views/partials/settings.ejs',
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
  
  const transactions = "Some transactions";

  const params = {
    all: true,
    limit: 3,
    offset: 2
  }

  const queryString = new URLSearchParams(params).toString();

  fetch(`/api/list-incoming-and-outgoing`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      return response.json();
    })
    .then(data => {
      const $tableBody = $('#paymentsTable tbody');
      console.log(!data[0].receivedSat);
      data.forEach(function (payment) {
        transferITag=`<i class="bi bi-arrow-down-left"></i>`
        paymentITag=`<i class="bi bi-arrow-up-right"></i>`
        const row = `
            <tr>
                <td>${ payment.hasOwnProperty("receivedSat")?  paymentITag : transferITag }</td>
                <td>${ formatTimestamp(payment.createdAt)}</td>
                <td>${ payment.hasOwnProperty("description") ? payment.description : "Label"}</td>
                <td>${payment.hasOwnProperty("receivedSat")?  payment.receivedSat : -payment.sent}</td>
                <td>${ payment.hasOwnProperty("receivedSat")?  "Payment" : "Transfer"}</td>
                <td>${payment.isPaid ? 'Completed' : 'Uncompleted'}</td>
                <td><i class="bi bi-three-dots-vertical"></i></td>
            </tr>
        `;
        $tableBody.append(row);
      });
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });
})


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
      $('.balance').html(`Balance: ${data.balanceSat} sats`);
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });
});

// Update node details
$(document).ready(function () {
  fetch('/api/get-node-info')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      inboundLiquiditySat = data.channels[0].inboundLiquiditySat;
      capacitySat = data.channels[0].capacitySat;
      balanceSat = data.channels[0].balanceSat;

      $('.inbound').html(`${inboundLiquiditySat} sats`);
      $('.acinq').html(`${capacitySat} sats`);
      $('.outbound').html(`${balanceSat} sats`);
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });
});

//Send modal details
$(document).ready(function () {
  var $paymentTypeModal = $("#paymentTypeModal");
  var $invoicePaymentType = $("#invoicePaymentType");
  var $offerPaymentType = $("#offerPaymentType");
  var $contactPaymentType = $("#contactPaymentType");
  var $successfulPaymentModal = $("#successfulPaymentModal");

  // Get the button that opens the modal
  var $sendButton = $("#sendButton");
  var $receiveButton = $("#receiveButton");

  // Get the <span> element that closes the modal
  var $span = $(".close").first();
  $(".close").on("click", function () {
    var modalId = $(this).data('modal');
    $("#" + modalId).hide();
  });

  // When the user clicks the button, open the modal
  $(".main-content").on("click", '#sendButton', function () {
    $paymentTypeModal.show();
  })


  // When the user clicks on <span> (x), close the modal
  $span.on("click", function () {
    $paymentTypeModal.hide();
  });

  // When the user clicks anywhere outside of the modal, close it
  $(window).on("click", function (event) {
    if ($(event.target).is($paymentTypeModal)) {
      $paymentTypeModal.hide();
    }
  });

  $("#invoicePaymentOption").click(function() {
    var value = $(this).data("value");
    console.log(value); 
    $paymentTypeModal.hide();
    $invoicePaymentType.show();
  });

  $("#contactPaymentOption").click(function() {
    var value = $(this).data("value");
    console.log(value);
    $paymentTypeModal.hide();
    $invoicePaymentType.show()
  });

  $("#offerPaymentOption").click(function() {
    var value = $(this).data("value");
    console.log(value);
    $paymentTypeModal.hide();
    $offerPaymentType.show(); 
  });

  $("#cancelSendRequest").click(function() {
    $paymentTypeModal.hide();
  });

  $("#invoicePaymentType").on("click", "#submitInvoice", function () {
    console.log("Submit clicked")
    const invoice = $("#requestInvoice").val().trim();
    let amountSat = $("#requestInvoiceAmount").val();
    amountSat = parseInt(amountSat)
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

    $invoicePaymentType.hide();
    $successfulPaymentModal.show();
  });

  $("#offerPaymentType").on("click", "#submitOffer", function () {
    console.log("Offer button clicked")
    const offer = $("#requestOffer").val().trim();
    const amountSat = parseInt($("#offerAmount").val());
    const message = $("#offerDesription").val().trim();
    console.log(offer);
    console.log(amountSat);
    console.log(message);

    fetch('/api/pay-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amountSat, offer, message })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        console.log(response.json());
      })

    $offerPaymentType.hide();
    $successfulPaymentModal.show();

    $("#requestOffer").val(" ");
    $("#offerAmount").val(" ");
    $("#offerDesription").val(" ");
  });




  $("#successfulPaymentModal").on("click", "#submitPaymentSuccess", function () {
    console.log("Submit clicked")
    $successfulPaymentModal.hide();
  });

})

$(document).ready(function () {
  // Get the button that opens the modal
  var $paymentRequestModal = $("#paymentRequestModal");
  var $sharePaymentRequestModal = $("#sharePaymentRequestModal");

  // Get the <span> element that closes the modal
  var $span = $(".close").first();
  $(".close").on("click", function () {
    var modalId = $(this).data('modal');
    $("#" + modalId).hide();
  });

  $(".main-content").on("click", '#receiveButton', function () {
    $paymentRequestModal.show();
  })

  // When the user clicks on <span> (x), close the modal
  $span.on("click", function () {
    $paymentRequestModal.hide();
  });


  // When the user clicks anywhere outside of the modal, close it
  $(window).on("click", function (event) {
    if ($(event.target).is($paymentRequestModal)) {
      $paymentRequestModal.hide();
    }
  });

  $("#paymentRequestModal").on("click", "#nextToSharePaymentRequest", function () {
    console.log("Next to share payment button clicked")
    var amountSat = parseInt($("#requestInvoiceAmount").val());
    var requestInvoiceName = $("#requestInvoiceName").val();
    var requestInvoiceDescription = $("#requestInvoiceDescription").val();
    const description = `${requestInvoiceName} - ${requestInvoiceDescription}`
    const webhookUrl = '';
    const externalId = '';

    console.log(amountSat);
    console.log(description);

    fetch('/api/create-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description, amountSat, externalId, webhookUrl })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response);
        }
        return response.json();
      }).then(data => {
        $paymentRequestModal.hide();
        $('.invoice').html(`${data.serialized}`);
        $sharePaymentRequestModal.show();
        console.log(data);
        $("#requestInvoiceAmount").val(" ");
        $("#requestInvoiceName").val(" ");
        $("#requestInvoiceName").val(" ");

      })
  });

  $("#paymentRequestModal").on("click", "#cancelPaymentRequest", function () {
    console.log("Submit clicked");
    $paymentRequestModal.hide();
  });

  $('#sharePaymentRequestModal').on('click', '#doneSharePaymentRequest', function () {
    $sharePaymentRequestModal.hide();
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


  $("#sharePaymentRequestModal").on("click", "#closeSharePaymentRequest", function () {
    console.log("Share Payment Request Modal closed")
    $sharePaymentRequestModal.hide();
  });


})

$(document).ready(function () {
  let balance;
  fetch('/api/get-offer')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      $('#bolt12Offer').html(`${data}`);
      // console.log(data);
    })
    .catch(error => {
      console.error('Error fetching offer:', error);
    });
});

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

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 11 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}, ${hours}:${minutes}`;
}


