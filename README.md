# Phoenix Server Wallet Bounty

<img width="1478" alt="phoenix-server-wallet-dashboard" src="https://github.com/ZapriteApp/phoenix-server-wallet-bounty/assets/12265052/a50fa592-8188-40a0-b854-d877c575fbff">

This document serves as the summary description of the bounty, and includes a brief outline of the minimum requirements and bounty conditions.

## Bounty Details
- Offered by: Zaprite
- Amount: 2.5m sats (minimum*)

_* A [donation page](https://pay.zaprite.com) is available where anyone is free to donate sats to this bounty to either increase the original payout or incentivize additional features._

### Links

- Phoenix Server: https://phoenix.acinq.co/server
- Phoenix Server API: https://phoenix.acinq.co/server/api
- phoneixd for StartOS: https://github.com/Start9Labs/phoenixd-startos
- Zaprite: https://zaprite.com

## Goal

The goal is to build a lightning wallet UI on top of Phoenix Server (phoenixd) that enables users to connect to third-party wallets, applications and platforms. The wallet should be able to be packaged up and run on hosted nodes like Start9 and Umbrel.

## MVP Requirements

The following items are the minimum functionality required for this bounty to be paid out.
- Standard wallet UI with **Dashboard** showing channel information.
- Basic **Send and Receive** functionality.
- Ability to create and manage permissioned **API Keys** (Admin and Read-only) via the UI.
- Ability to create and manage **Webhook URLs** via the UI.
- A basic **Transaction History** page.

### Send and Receive

The wallet should have the ability to **Send** a lightning payment. This will likely require at least two UI flows:

1. Pay a bolt11 invoice
2. Pay to a bolt12 offer

The wallet should have the ability to **Receive** a lightning payment by:

1. Generating a bolt11 invoice
2. Decoding a bolt12 offer

## API Keys

Zaprite allows merchants to connect wallets and nodes through various methods. Due to Zaprite’s non-custodial stance, this bounty requires that a permissioned API Key system be built around the wallet.

The requirement is for two main API Key permission sets to be created:

1. Read-only (“Invoice”)
2. Full-access (“Admin”)

The _Invoice API Key_ should have access to the **following endpoints only**:

#### Get node info
`GET /getinfo`

#### Get Bolt12 offer
`POST /getoffer`

#### Create Bolt11 invoice
`POST /createinvoice`

#### Get incoming payment
`GET /payments/incoming/{paymentHash}`

## Webhook URLs

Zaprite, and other third-party applications, need to be notified when payments have been received via pheonixd’s built-in Webhooks functionality. The wallet should include a UI to add and manage Webhook URLs.

## Design Prototype

A first draft [design prototype](https://xd.adobe.com/view/9f71dc49-48fd-4cb7-a3db-9e2cbaf308ed-ca22/) has been prepared by Zaprite as a rough guide to accompany this bounty summary.

<img width="1478" alt="phoenix-server-wallet-settings" src="https://github.com/ZapriteApp/phoenix-server-wallet-bounty/assets/12265052/09869e18-3145-4bb0-9691-d4ab7e6855e9">

_**Note**: the prototype above contains additional features not required in the MVP for this bounty to be paid._

## Branding

While the prototype above uses the Sample Wallet branding, a new brand identity will be created for the wallet. However, this is not a requirement for the bounty.

## Additional Specification (Optional)

- NameDesc: https://github.com/lightning/blips/blob/master/blip-0011.md

## Additional Features (Optional)

The following additional features have been added to the design prototype, but are **not required** for the bounty to be paid:

- **Contacts**: the ability to create and manage a contact list.
- **Import Contacts**: the ability to import existing Contacts from other applications (Phoenix, Mutiny, nostr, …).
- **Accounts**: the ability to create and manage multiple accounts.
- **Password**: the ability to set and manage an application password.
- **Mobile Wallet Connect**: the ability to connect a third-party wallet (for example, Phoenix) to the node.

The features above are provided as a guideline only, to indicate future desired wallet functionality. This will be useful for a developer when architecting the code for this wallet.

## Bounty Conditions

All code written must be released as Free and open-source software (FOSS).

## Bounty Payments

The bounty recipient must send a Zaprite Invoice for the final amount in question.

---

# Donations

Zaprite is also hosting a donation page for anyone who would like to contribute sats towards this project. All donations are welcome, and 100%  of all donations will go towards the final bounty payment(s). 

[Donate Here](https://pay.zaprite.com/pl_)
