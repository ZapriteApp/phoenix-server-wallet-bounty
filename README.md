# Phoenix Server Wallet Bounty

<img width="1478" alt="phoenix-server-wallet-dashboard" src="https://github.com/ZapriteApp/phoenix-server-wallet-bounty/assets/12265052/a50fa592-8188-40a0-b854-d877c575fbff">

## ℹ️ Claimed [2024-07-30]
The bounty has been claimed. More details to follow. We will close this for now and open again if things change.

This document serves as the summary description of the bounty, and includes a brief outline of the minimum requirements and bounty conditions.

## Bounty Details
- Offered by: Zaprite
- Amount: 2.5m sats (minimum*)

_* A [donation page](https://pay.zaprite.com/pl_WzwH6KkHKn) is available where anyone is free to donate sats to this bounty to either increase the original payout or incentivize additional features._

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
- ~~Ability to create and manage permissioned **API Keys** (Admin and Read-only) via the UI.~~ (1)
- ~~Ability to create and manage **Webhook URLs** via the UI.~~ (2)
- A basic **Transaction History** page.

(1) This requirement is no longer needed due to the new 'limited access password' feature: https://github.com/ACINQ/phoenixd/pull/84

(2) This requirement is no longer needed due to the new 'per-invoice webhook' feature: https://github.com/ACINQ/phoenixd/pull/85

### Send and Receive

The wallet should have the ability to **Send** a lightning payment. This will likely require at least two UI flows:

1. Pay a bolt11 invoice
2. Pay to a bolt12 offer

The wallet should have the ability to **Receive** a lightning payment by:

1. Generating a bolt11 invoice
2. Decoding a bolt12 offer

## Design Prototype

A draft [design prototype](https://xd.adobe.com/view/7b5bb288-1c73-4ad5-ac82-cf8cd1e3b192-2e08/) has been prepared by Zaprite as a rough guide to accompany this bounty summary.

<img width="1478" alt="phoenix-server-wallet-settings" src="https://github.com/user-attachments/assets/9aded1d2-031e-4326-9eef-fafb941e0e00">

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

[Donate Here](https://pay.zaprite.com/pl_WzwH6KkHKn)
