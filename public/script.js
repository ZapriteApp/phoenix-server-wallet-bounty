
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
        const itemsPerPage = 8;
        let currentPage = 1;
        let paymentsData = [];

        function renderTablePage(page) {
          const $tableBody = $('#paymentsTable tbody');
          $tableBody.empty();
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const pageData = paymentsData.slice(startIndex, endIndex);

          pageData.forEach(function (payment) {
            const transferITag = `<i class="bi bi-arrow-up-right"></i>`;
            const paymentITag = `<i class="bi bi-arrow-down-left"></i>`;
            const row = `
              <tr>
                  <td>${payment.hasOwnProperty("receivedSat") ? paymentITag : transferITag}</td>
                  <td>${formatTimestamp(payment.createdAt)}</td>
                  <td>${payment.hasOwnProperty("description") ? truncateText(payment.description) : "-"}</td>
                  <td>${payment.hasOwnProperty("receivedSat") ? payment.receivedSat : payment.sent}</td>
                  <td>${payment.hasOwnProperty("receivedSat") ? "Payment" : "Transfer"}</td>
                  <td>${payment.isPaid ? 'Completed' : 'Uncompleted'}</td>
                  <td><i class="bi bi-three-dots-vertical"></i></td>
              </tr>
          `;
            $tableBody.append(row);
          });

          updatePaginationControls(page);
        }

        function updatePaginationControls(page) {
          const totalPages = Math.ceil(paymentsData.length / itemsPerPage);
          $('#prevPage').prop('disabled', page <= 1);
          $('#nextPage').prop('disabled', page >= totalPages);

          const $pageInfo = $('#pageInfo');
          $pageInfo.text(`Page ${page} of ${totalPages}`);

          const $pageNumbers = $('#pageNumbers');
          $pageNumbers.empty();

          for (let i = 1; i <= totalPages; i++) {
            const pageButton = $('<button>')
              .text(i)
              .addClass('page-number-button')
              .prop('disabled', i === page)
              .click(function () {
                currentPage = i;
                renderTablePage(currentPage);
              });

            $pageNumbers.append(pageButton);
          }
        }

        function fetchData() {
          fetch(`/api/list-incoming-and-outgoing`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
              }
              return response.json();
            })
            .then(data => {
              paymentsData = data;
              renderTablePage(currentPage);
            })
            .catch(error => {
              console.error('Error fetching balance:', error);
            });
        }

        $('#prevPage').click(function () {
          if (currentPage > 1) {
            currentPage--;
            renderTablePage(currentPage);
          }
        });

        $('#nextPage').click(function () {
          const totalPages = Math.ceil(paymentsData.length / itemsPerPage);
          if (currentPage < totalPages) {
            currentPage++;
            renderTablePage(currentPage);
          }
        });

        fetchData();

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
        const itemsPerPage = 8;
        let currentPage = 1;
        let contactsData = [];

        function renderTablePage(page) {
          const $tableBody = $('#contactsTable tbody');
          $tableBody.empty();
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const pageData = contactsData.slice(startIndex, endIndex);

          pageData.forEach(function (contact) {
            const row = `
              <tr>
                  <td>${new Date().toLocaleDateString()}</td>
                  <td>${truncateText(contact.name, 15)}</td>
                  <td>${truncateText(contact.offer, 20)}</td>
                  <td>${truncateText(contact.address, 20)}</td>
                  <td>Active</td>
                  <td><i class="bi bi-three-dots-vertical"></i></td>
              </tr>
          `;
            $tableBody.append(row);
          });

          updatePaginationControls(page);
        }
        function updatePaginationControls(page) {
          const totalPages = Math.ceil(contactsData.length / itemsPerPage);
          $('#prevPage').prop('disabled', page <= 1);
          $('#nextPage').prop('disabled', page >= totalPages);

          const $pageInfo = $('#pageInfo');
          $pageInfo.text(`Page ${page} of ${totalPages}`);

          const $pageNumbers = $('#pageNumbers');
          $pageNumbers.empty();

          for (let i = 1; i <= totalPages; i++) {
            const pageButton = $('<button>')
              .text(i)
              .addClass('page-number-button')
              .prop('disabled', i === page)
              .click(function () {
                currentPage = i;
                renderTablePage(currentPage);
              });

            $pageNumbers.append(pageButton);
          }
        }

        function fetchData() {
          fetch(`/api/get-contacts`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
              }
              return response.json();
            })
            .then(data => {
              contactsData = data.contacts;
              renderTablePage(currentPage);
            })
            .catch(error => {
              console.error('Error fetching balance:', error);
            });

        }

        $('#prevPage').click(function () {
          if (currentPage > 1) {
            currentPage--;
            renderTablePage(currentPage);
          }
        });

        $('#nextPage').click(function () {
          const totalPages = Math.ceil(contactsData.length / itemsPerPage);
          if (currentPage < totalPages) {
            currentPage++;
            renderTablePage(currentPage);
          }
        });

        fetchData();



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
  let balance;
  fetch('/api/get-balance')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      $('.balance').html(`${data.balanceSat} sats`);
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });
});

// Update node details
$(document).ready(function () {
  let inboundLiquiditySat;
  let capacitySat;
  let balanceSat;
  let channelId;

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
      channelId = data.channels[0].channelId;

      $('.inbound').html(`${inboundLiquiditySat}`);
      $('.acinq').html(`${capacitySat} sats`);
      $('.outbound').html(`${balanceSat}`);
      $('.channelIdString').html(`${channelId}`);

      inboundLiquiditySat = parseInt(inboundLiquiditySat)
      capacitySat = parseInt(capacitySat)
      balanceSat = parseInt(balanceSat)

      let total = inboundLiquiditySat + balanceSat;
      let inboundPercentage = 100 - (inboundLiquiditySat / total) * 100;


      $('#progressBar').css('width', inboundPercentage + '%');

      fetch('/api/get-btc-price')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {

          btcPrice = parseInt(data.btcPrice);
          let outBoundVal = (balanceSat / 100000000) * btcPrice
          let inBoundVal = (inboundLiquiditySat / 100000000) * btcPrice

          $('#btcPriceOutbound').html(`You can send &#8776 $${outBoundVal.toFixed(2)}`);
          $('#btcPriceInbound').html(`You can receive &#8776 $${inBoundVal.toFixed(2)}`);


        })
        .catch(error => {
          console.error('Error fetching balance:', error);
          $('#btcPriceOutbound').html(`You can send $ ~`);
          $('#btcPriceInbound').html(`You can receive $~`);

        });


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

  $("#invoicePaymentOption").click(function () {
    var value = $(this).data("value");
    console.log(value);
    $paymentTypeModal.hide();
    $invoicePaymentType.show();
  });

  $("#contactPaymentOption").click(function () {
    var value = $(this).data("value");
    console.log(value);
    $paymentTypeModal.hide();
    $contactPaymentType.show()
  });

  $("#offerPaymentOption").click(function () {
    var value = $(this).data("value");
    console.log(value);
    $paymentTypeModal.hide();
    $offerPaymentType.show();
  });

  $("#cancelSendRequest").click(function () {
    $paymentTypeModal.hide();
  });

  $('#requestInvoice').on('input', function () {
    var invoice = $(this).val().trim();

    if (invoice !== "") {
      fetch('/api/decode-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoice: invoice })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {

          if (data.description) {
            $('.decode-invoice .memo').eq(1).text(truncateText(`Payment to ${data.description}`));
          }

          if (data.amount) {
            $('.decode-invoice .invoiceAmount').eq(1).text(`${data.amount / 1000} sats`);
          }

          // if (data.extrahops[0][0]) {
          //   $('.decode-invoice .fees').eq(1).text(`${data.extraHops[0][0].feeBase / 1000} sats`);
          // }else{
          //   $('.decode-invoice .fees').eq(1).text(`- sats`);
          // }
          $('.decode-invoice').show();
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }
  });


  $("#invoicePaymentType").on("click", "#submitInvoice", async function () {
    console.log("Submit clicked")
    const invoice = $("#requestInvoice").val().trim();
    let amountSat = $("#requestInvoiceAmount").val();
    let errorMessage = $('#invoice-error-message');
    amountSat = parseInt(amountSat)
    console.log(invoice);
    console.log(amountSat);


    if (invoice === "") {
      errorMessage.text("The request invoice cannot be empty.");
      errorMessage.show();
      return
    }

    try {
      let response = await fetch('/api/decode-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoice: invoice })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      let data = await response.json();

      if (data.amount) {

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
        $("#requestInvoice").val("");
        $('.decode-invoice').show();
      } else {
        errorMessage.text("The request invoice is not decodable.");
        errorMessage.show();
        return false;
      }
    } catch (error) {
      errorMessage.text("An error occurred while validating the invoice.");
      errorMessage.show();
      return false;
    }

    $("#requestInvoice").val(" ");

  });

  $("#invoicePaymentType").on("click", "#backToPaymentType", function () {
    $invoicePaymentType.hide();
    $paymentTypeModal.show()
  })

  $("#offerPaymentType").on("click", "#submitOffer", async function () {
    console.log("Offer button clicked")
    const offer = $("#requestOffer").val().trim();
    const rawAmount = $("#offerAmount").val().trim();
    const amountSat = $("#offerAmount").val().trim();
    const message = $("#offerDescription").val().trim();
    let errorMessage = $('#offer-error-message');
    console.log(offer);
    console.log(amountSat);
    console.log(message);


    if (rawAmount === "") {
      errorMessage.text("Amount cannot be empty.");
      errorMessage.show();
      return
    }

    if (!/^\d+$/.test(rawAmount)) {
      errorMessage.text("Amount should be number.");
      errorMessage.show();
      return
    }

    if (offer === "") {
      errorMessage.text("Offer cannot be empty.");
      errorMessage.show();
      return
    }

    try {
      let response = await fetch('/api/decode-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offer: offer })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      let data = await response.json();

      if (data.chain) {
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

      } else {
        errorMessage.text("The request offer is not decodable.");
        errorMessage.show();
        return false;
      }
    } catch (error) {
      errorMessage.text("An error occurred while decoding the invoice.");
      errorMessage.show();
      return false;
    }

    $offerPaymentType.hide();
    $successfulPaymentModal.show();

    $("#requestOffer").val("");
    $("#offerAmount").val("");
    $("#offerDesription").val("");
  });

  $("#offerPaymentType").on("click", "#backToPaymentType", function () {
    $offerPaymentType.hide();
    $paymentTypeModal.show()

  })

  $("#contactPaymentType").on("click", "#submitContact", async function () {
    console.log("Pay contact button clicked")
    const contactIdRaw = $("#paymentContact").val();
    let errorMessage = $('#contact-error-message');
    let contactOffer;
    if (contactIdRaw == null) {
      errorMessage.text("You have not selected a contact.");
      errorMessage.show();
      return
    }

    const contactId = $("#paymentContact").val().trim();

    let rawAmount = $("#contactPaymentAmount").val().trim();

    const message = $("#contactPaymentDescription").val().trim();

    console.log(contactId);
    console.log(` Raw amount is ${rawAmount}`);
    console.log(message);

    offer = await getContactOffer(contactId)

    if (contactId === "") {
      errorMessage.text("You have not selected a contact.");
      errorMessage.show();
      return
    }

    if (rawAmount === "") {
      errorMessage.text("Amount cannot be empty.");
      errorMessage.show();
      return
    }

    if (!/^\d+$/.test(rawAmount)) {
      errorMessage.text("Amount should be number.");
      errorMessage.show();
      return
    }
    const amountSat = parseInt(rawAmount);
    console.log(` Amount sat is ${amountSat}`);

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

    $contactPaymentType.hide();
    $successfulPaymentModal.show();

    $("#contactPaymentDescription").val(" ");
    $("#contactPaymentAmount").val(" ");
    $("#paymentContact").val(" ");

  })

  $("#contactPaymentType").on("click", "#backToPaymentType", function () {
    $contactPaymentType.hide();
    $paymentTypeModal.show()

  })

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
    var amountSat = parseInt($("#requestInvoiceAmount").val().trim());
    var rawAmount = $("#requestInvoiceAmount").val().trim()
    var requestInvoiceName = $("#requestInvoiceName").val().trim();
    var requestInvoiceDescription = $("#requestInvoiceDescription").val().trim();
    const description = `${requestInvoiceName} - ${requestInvoiceDescription}`
    const webhookUrl = '';
    const externalId = '';

    let errorMessage = $('#payment-request-error-message');

    console.log(amountSat);
    console.log(description);

    if (rawAmount === "") {
      errorMessage.text("The request amount cannot be empty.");
      errorMessage.show();
      return
    }

    if (!/^\d+$/.test(rawAmount)) {
      errorMessage.text("Amount should be number.");
      errorMessage.show();
      return
    }

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
        var invoiceString = data.serialized;
        $("#invoiceString").val(invoiceString);
        // // $('.invoice').html(`${data.serialized}`);
        new QRCode($("#barcode")[0], {
          text: invoiceString,
          width: 256,
          height: 256,
          correctLevel: QRCode.CorrectLevel.H,
          render: "svg"
        });

        $sharePaymentRequestModal.show();
        console.log(data);
        $("#requestInvoiceAmount").val("");
        $("#requestInvoiceName").val("");
        $("#requestInvoiceName").val("");

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
  $('#copyOffer').click(copyInvoice);
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

$(document).ready(function () {
  $('.menu-item').click(function (e) {
    e.preventDefault();

    $('.menu-item').removeClass('selected');

    $(this).addClass('selected');
  });
})

$(document).ready(function () {
  var $addContactModal = $("#addContactModal");
  var $importContactModal = $("#importContactModal");

  $("#importContact").click(function () {
    console.log("Add contact modal clicked")
    $importContactModal.show();
  });

  $(".pagination").on("click", "#newContact", function () {
    console.log("Add contact modal clicked");
    $addContactModal.show();
  })


  $("#cancelAddContact").click(function () {
    $addContactModal.hide();
  });

  $('#closeContactModal').on("click", function () {
    $importContactModal.hide();
  });

  $("#doneImportContactModal").click(function () {
    $importContactModal.hide();
  });

  $("#addContact").on('click', async function () {
    const name = $("#addContactName").val().trim();
    const offer = $("#addContactOffer").val().trim();
    const address = $("#addContactAddress").val().trim();
    let errorMessage = $('#add-contact-error-message');

    if (name === "") {
      errorMessage.text("The contact name cannot be empty.");
      errorMessage.show();
      return
    }

    if (offer === "") {
      errorMessage.text("The contact offer cannot be empty.");
      errorMessage.show();
      return
    }

    let isValid = await isOfferValid(offer)
    if (!isValid) {
      console.log("Contact offer is invalid")
      errorMessage.text("The contact offer is invalid.");
      errorMessage.show();
      return
    }
    const contactData = {
      name: name,
      offer: offer,
      address: address
    }



    fetch('/api/save-contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Contact saved:', data);
      })
      .catch(error => {
        console.error('Error saving contact:', error);
      });

    console.log(contactData)

    $addContactModal.hide();

  });
});

$(document).ready(function () {
  fetch(`/api/get-contacts`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      $.each(data.contacts, function (index, contact) {
        $('#paymentContact').append(
          $('<option></option>').val(contact.id).text(contact.name)
        );
      });
    })
    .catch(error => {
      console.error('Error fetching contacts:', error);
    });
});

$(document).ready(function () {
  var $updatePasswordModal = $("#updatePasswordModal");
  let errorMessage = $('#update-password-error-message');


  $("#updatePassword").click(function () {
    console.log("Update password modal up")
    $updatePasswordModal.show();
  });

  $("#doneUpdatePassword").click(function () {
    var newPassword = $("#newPassword").val();
    var confirmedPassword = $("#confirmPassword").val();

    console.log("Update password clicked");
    console.log(confirmedPassword)
    console.log(newPassword)

    if (newPassword === "") {
      errorMessage.text("Missing new password!");
      errorMessage.show();
      return
    }

    if (confirmedPassword === "") {
      errorMessage.text("Missing confirmed password!");
      errorMessage.show();
      return
    }

    if (newPassword !== confirmedPassword) {
      errorMessage.text("Passwords do not match!");
      errorMessage.show();
      return
    }

    const password = {
      password: newPassword
    }


    fetch('/api/save-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(password)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Password saved:', data);
      })
      .catch(error => {
        console.error('Error saving password:', error);
      });

    $("#newPassword").val("");
    $("#confirmPassword").val("");
    $updatePasswordModal.hide();
  });
})

$(document).ready(function () {

  $(".main-content").on("click", '#showOfferQR', function () {
    const offerText = $('#bolt12Offer').text().trim();
    var $offerQRModal = $("#offerQRModal");
    $offerQRModal.show();
    new QRCode($("#offerQRBarcode")[0], {
      text: offerText,
      width: 256,
      height: 256
    });

    $("#doneShowPaymentOffer").click(function () {
      $offerQRModal.hide();
      $("#offerQRBarcode").empty();

    });

    $("#closeShowPaymentOffer").click(function () {
      $offerQRModal.hide();
      $("#offerQRBarcode").empty();

    });

    $(".close").click(function () {
      $offerQRModal.hide();
      $("#offerQRBarcode").empty();

    });
  })

})

$(document).ready(function () {
  const errorMessage = $('#login-error-message');
  $('#login-button').click(function (e) {
    const password = $('#password').val();
    console.log(password)

    if (!password) {
      errorMessage.text('Please enter a password');
      errorMessage.show();
      return;
    }

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          
          localStorage.setItem('token', data.token);
          window.location.href = '';
        } else {
          errorMessage.text('Invalid password. Please try again.');
          errorMessage.show();
        }
      })
      .catch(error => {
        // Handle network errors
        console.error('Error:', error);
        errorMessage.text('An error occurred. Please try again.');
        errorMessage.show();
      });
  });


  $('#log-out').click(function (e) {
    localStorage.removeItem('token');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    
  })

   //Authenticate
   const token = localStorage.getItem('token');
   if (!token) {
     if (window.location.pathname !== '/login') {
      console.log("Redirecting to home");
      window.location.href = '/login';
    }       
     return;
   }

   fetch('http://localhost:3000/api/authenticate', {
     method: 'GET',
     headers: {
       'Authorization': `Bearer ${token}`,
     },
   })
   .then(response => {
     if (!response.ok) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
       return null
     }
     return response.json();
   })
   .then(data => {
    if (data){
      if (window.location.pathname !== '/') {
        console.log("Redirecting to home");
        window.location.href = '/';
      }
    }  
   })
   .catch(error => {
    console.log(error)
   });
})

$(document).ready(function () {
  $('#zaprite-link').on('click', function () {
    window.open("https://zaprite.com/");
  });

  $('#logout-link').on('click', function () {
    // window.location.href = url;
  });

  $('#github-link').on('click', function () {
    window.open("https://github.com/hkarani/phoenix-server-lightning-wallet")
  });
})

$(document).ready(function () {

  fetch('/api/get-config-info')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      let adminPassword = data.config["http-password"]
      let restrictedPassword = data.config["http-password-limited-access"]
      $('#adminPassword').html(adminPassword);
      $('#restrictedPassword').html(restrictedPassword);

    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });

    fetch('/api/is-password-set')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if(data.success){
        $('.passwordSet').html(`Password Set <i class="bi bi-check2"></i>`);
      }
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });

  $('#copyAdminPassword').on('click', function () {
    copyPassword('#adminPassword');
  });

  // Event listener for restricted password copy button
  $('#copyRestrictedPassword').on('click', function () {
    copyPassword('#restrictedPassword');
  });

})


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


function copyInvoice() {
  var $copyText = $("#invoiceString");
  $copyText.select();
  $copyText[0].setSelectionRange(0, 99999); // For mobile devices
  document.execCommand("copy");
}

function copyOffer() {
  var $copyText = $("#copyOffer").text();
  var $tempInput = $("<input>");
  $("body").append($tempInput);
  $tempInput.val($copyText).select();
  document.execCommand("copy");
  $tempInput.remove();
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

$('#exportCsv').on('click', () => {
  const csvRows = [];
  const headers = ['Payment Type', 'TimeStamp', 'Label', 'Amount', 'Type', 'Status', 'Actions'];
  csvRows.push(headers.join(','));
  let paymenytsData = [];
  fetch(`/api/list-incoming-and-outgoing`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      paymentsData = data;
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });
  paymenytsData.forEach(payment => {
    const transferITag = payment.hasOwnProperty("receivedSat") ? 'Arrow-Up-Right' : 'Arrow-Down-Left';
    const paymentITag = payment.hasOwnProperty("receivedSat") ? 'Payment' : 'Transfer';
    const status = payment.isPaid ? 'Completed' : 'Uncompleted';
    const row = [
      transferITag,
      formatTimestamp(payment.createdAt),
      payment.hasOwnProperty("description") ? payment.description : "Label",
      payment.hasOwnProperty("receivedSat") ? payment.receivedSat : -payment.sent,
      paymentITag,
      status,
      'Three-Dots-Vertical' // Placeholder for Actions icon
    ];
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
});

$('#downloadOffer').on('click', function () {
  const offerText = $('#bolt12Offer').text().trim();
  if (offerText) {
    const blob = new Blob([offerText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = $('<a>').attr({
      href: url,
      download: 'bolt12_offer.txt'
    }).appendTo('body');
    a[0].click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } else {
    alert('No offer available to download.');
  }
});

$('#copyOffer').on('click', function () {
  const offerText = $('#bolt12Offer').text().trim();
  if (offerText) {
    const tempInput = $('<input>');
    $('body').append(tempInput);
    tempInput.val(offerText).select();
    document.execCommand('copy');
    tempInput.remove();
  } else {
    alert('No offer available to copy.');
  }
});

$('#copyChannelIdIcon').on('click', function () {
  const channelIdText = $('.channelIdString').text().trim();
  if (channelIdText) {
    const tempInput = $('<input>');
    $('body').append(tempInput);
    tempInput.val(channelIdText).select();
    document.execCommand('copy');
    tempInput.remove();
  } else {
    alert('No Id available to copy.');
  }
});

async function isOfferValid(offer) {
  try {
    let response = await fetch('/api/decode-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ offer: offer })
    });

    if (!response.ok) {
      console.log("false")
      return false
    }
    let data = await response.json();
    return data.chain ? true : false;
  } catch (error) {
    console.error('Error checking offer validity:', error);
    return false;
  }
}
async function getContactOffer(contactId) {
  try {
    const response = await fetch('/api/get-contacts');
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    const contactOffer = data.contacts.find(i => i.id == contactId)?.offer;
    return contactOffer;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return null;
  }
}

function copyPassword(passwordId) {
  var passwordText = $(passwordId).text();
  var tempInput = $('<input>');
  $('body').append(tempInput);
  tempInput.val(passwordText).select();
  document.execCommand('copy');
  tempInput.remove();
}

