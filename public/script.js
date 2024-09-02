
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
                    <td>${payment.hasOwnProperty("description") ? payment.description : "Label"}</td>
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
                    <td>${contact.name}</td>
                    <td>${contact.offer}</td>
                    <td>${contact.address}</td>
                    <td>Active</td>
                    <td><i class="bi bi-three-dots-vertical"></i></td>
                </tr>
            `;
              $tableBody.append(row);
            });

            updatePaginationControls(page);
          }
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

  $("#invoicePaymentType").on("click", "#backToPaymentType", function () {
    $invoicePaymentType.hide();
    $paymentTypeModal.show()
  })

  $("#offerPaymentType").on("click", "#submitOffer", function () {
    console.log("Offer button clicked")
    const offer = $("#requestOffer").val().trim();
    const amountSat = parseInt($("#offerAmount").val());
    const message = $("#offerDescription").val().trim();
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

  $("#offerPaymentType").on("click", "#backToPaymentType", function () {
    $offerPaymentType.hide();
    $paymentTypeModal.show()

  })

  $("#contactPaymentType").on("click", "#submitContact", async function () {
    console.log("Pay contact button clicked")
    let contactOffer;
    const contactId = $("#paymentContact").val().trim();
    const amountSat = parseInt($("#contactPaymentAmount").val());
    const message = $("#contactPaymentDescription").val().trim();
    console.log(contactId);
    console.log(amountSat);
    console.log(message);

    offer = await getContactOffer(contactId)

    console.log(contactOffer);
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
        var invoiceString = data.serialized;
        $("#invoiceString").val(invoiceString);
        // // $('.invoice').html(`${data.serialized}`);
        new QRCode($("#barcode")[0], {
          text: invoiceString,
          width: 256,
          height: 256
        });

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

  $("#addContact").on('click', function () {
    const name = $("#addContactName").val().trim();
    const offer = $("#addContactOffer").val().trim();
    const address = $("#addContactAddress").val().trim();

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

