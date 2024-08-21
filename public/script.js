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
  function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
  }
  const transactions = "Some transactions";

  const params = {
    all: true,
    limit: 3,
    offset: 2
  }

  const queryString = new URLSearchParams(params).toString();

  fetch(`/api/outgoing-payments?${queryString}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      return response.json();
    })
    .then(data => {
      const $tableBody = $('#paymentsTable tbody');
      console.log(data[0].paymentId);
      data.forEach(function (payment) {
        const row = `
            <tr>
                <td>${payment.paymentId}</td>
                <td>${payment.paymentHash}</td>
                <td>${payment.preimage}</td>
                <td>${payment.isPaid ? 'Yes' : 'No'}</td>
                <td>${payment.sent}</td>
                <td>${payment.fees}</td>
                <td>${payment.invoice}</td>
                <td>${formatTimestamp(payment.completedAt)}</td>
                <td>${formatTimestamp(payment.createdAt)}</td>
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

  $("#paymentTypeModal").on("click", "#submitPaymentType", function () {
    console.log("Payment offer selected")
    var selectedOption = $("#paymentOptions").val();
    console.log(selectedOption);
    
    if (selectedOption == "invoice") {
      $paymentTypeModal.hide();
      $invoicePaymentType.show();
    }

    if (selectedOption == "contact") {
      $paymentTypeModal.hide();
      $invoicePaymentType.show();
    }

    if (selectedOption == "offer") {
      $paymentTypeModal.hide();
      $offerPaymentType.show();
    }    
    
    $("#paymentOptions").val('');

  });


  $("#invoicePaymentType").on("click", "#submitInvoice", function () {
    console.log("Submit clicked")
    const invoice = $("#requestInvoice").val().trim();
    let amountSat =  $("#requestInvoiceAmount").val();
    amountSat = parseInt(amountSat)
    console.log(invoice);
    console.log(amountSat);
    $("#requestInvoice").val(" ");

    fetch('/api/pay-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ invoice })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        console.log(response.json());
      })

    $invoicePaymentType.hide();
    $successfulPaymentModal.show(); // Close the modal
  });

  $("#successfulPaymentModal").on("click", "#submitPaymentSuccess", function () {
    console.log("Submit clicked")
    $successfulPaymentModal.hide(); // Close the modal
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


