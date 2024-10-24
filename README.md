# Phoenix Server Lightning Wallet
A lighting wallet for Start9 and Umbrell on top Phoenix server.

<p align="center">
<img src="imgs/dashboard.png" alt="Dashboard page" width="40%">
<img src="imgs/login.png" alt="Login page" width="40%">
<img src="imgs/transaction page.png" alt="Transaction page" width="40%">
<img src="imgs/contacts page.png" alt="Contacts page" width="40%">
</p>
## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Install on Start9Os](#installation-on-start9os)
- [Install on Umbrel](#installation-on-umbrel)

## Introduction
This project is a Lightning wallet interface built on top of [Phoenixd server](https://phoenix.acinq.co/server/) designed for [Umbrel Server](https://umbrel.com/umbrelos). 

It lets you easily manage your phoenixd transactions and leverage the power of Phoenixd for your Bitcoin Lightning wallet needs.

## Features

- [x] ~~Send and receive bitcoin with Bolt11 invoices and BOLT12 offers~~
- [x] ~~Transactions history ~~
- [x] ~~Pay wallet contacts~~
- [x] ~~Contacts address book and pay contacts~~
- [x] ~~Password login~~
- [x] ~~Import Wallet offer with QR Scan~~
- [x] ~~Scan QR to pay BOLT11 invoices and wallet offer~~

- [ ] Wallet notifications
- [ ] Create multiple wallets
- [ ] Recieve bitcoin with mainnet address
- [ ] Import wallet contacts
- [ ] Show fee credit amount
- [ ] Nostr Wallet Connect
- [ ] Choose default currency

## Installing on Start9OS
### 1. Install as a Sideload Serivice
1. Download phoenixd-lightning-wallet-ui.s9pk on your Start9os server [link] (https://github.com/hkarani/phoenixd-lightning-wallet-ui-startos/releases/download/v0.1.1/phoenixd-lightning-wallet-ui.s9pk)

2. Go **System > Sideload a Service**
<p align="center">
<img src="imgs/start9systemmenu.png" alt="System menu" width="50%">
</p>

3. Browse to upload phoenixd-lightning-wallet-ui.s9pk and install
<p align="center">
<img src="imgs/start9sideload.png" alt="System menu" width="50%">
</p>

## Installing on Umbrel

1. Go **Umbrell App Store**  > and click **Community App Store** athe 3-dots
<p align="center">
<img src="imgs/goToCommunityStore.png" alt="System menu" width="50%">
</p>

2. Add the [Phoenixd Wallet Community Store link](https://github.com/hkarani/umbrel-community-app-store) 
<p align="center">
<img src="imgs/add-community-app-store-link.png" alt="System menu" width="50%">
</p>

3.Open the community store and open Phoenixd Lightning Wallet
<p align="center">
<img src="imgs/open-the-community-store.png" alt="System menu" width="50%">
</p>

3. Install app and open to start
<p align="center">
<img src="imgs/install-app.png" alt="System menu" width="50%">
</p>

