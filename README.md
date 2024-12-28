# PizzaFarm

## Summary

This is a script to automatically take care of your Pizza Pets., every 7 hours and 30 minutes it will:
- Feed pizza to your pets
- Wait for the confirmation
- Shower them
- Sleep until next loop

**The service fee is set to zero, no additional fees are added.**


## Installation

```bash
git clone https://github.com/coffeeweed/pizza-farm.git
cd pizza-farm
yarn
cp .env.example .env
```

Add your mnemonic and wallet index to the .env file in the following format: (there's nothing on this seed lil bro)
Put all your pets inscription ids in the PET_IDS variable, separated by commas.
```
MNEMONIC=acid cloth drink ankle phone flush bomb obscure brass success miracle theory
WALLET_INDEX=0
PET_IDS=67e7aa6a2fd661393ccc816ce2858cf8c59fcc5c1e768be844af2460c4f37ba4i1186,67e7aa6a2fd661393ccc816ce2858cf8c59fcc5c1e768be844af2460c4f37ba4i1190
```

## Run

- Deposit your pets on the wallet (don't run internet scripts on your main wallet u dumbo)
- Deposit some BTC to cover the fees
- Start the script
```bash
yarn run start
```

Example output (11$ gas fees per tx to take care of 5 pets):
```
[12/28 06:28:32][INFO] Wallet: [redacted] 💰
[12/28 06:28:32][INFO] Current fee: 3 sats/vb
[12/28 06:28:35][INFO] Order for pizza created.. 🍕
[12/28 06:28:35][INFO] Transaction signed..
[12/28 06:28:36][INFO] Transaction ID: [redacted]
[12/28 06:28:36][INFO] Waiting for transaction to be confirmed.. Will check every 30 seconds 🕒
[12/28 06:46:38][INFO] Transaction confirmed ! ✨
[12/28 06:46:38][INFO] Waiting for the pets to be sent back.. Will check every 30 seconds 🕒
[12/28 06:46:39][INFO] Pets sent back ! ✨
[12/28 06:46:39][INFO] Current fee: 3 sats/vb
[12/28 06:46:42][INFO] Order for shower created.. 🚿
[12/28 06:46:42][INFO] Transaction signed..
[12/28 06:46:42][INFO] Transaction ID: [redacted]
[12/28 06:46:42][INFO] Waiting for transaction to be confirmed.. Will check every 30 seconds 🕒
[12/28 07:13:16][INFO] Transaction confirmed ! ✨
[12/28 07:13:16][INFO] Waiting for the pets to be sent back.. Will check every 30 seconds 🕒
[12/28 07:13:17][INFO] Pets sent back ! ✨
[12/28 07:13:17][INFO] Sleeping until next loop 💤
....
```


## Potential improvements

- Add a check to shower only if the pet is dirty
- Adjust the fee to be slightly higher during calm periods
- Add a max gas fee to retry later if the current gasfee is too high


## License

Do whatever the fuck you want with it. Take care of your pets.
There's no hidden fees, no hidden costs, no hidden anything. Only love and gas fees.


## Message to NinjaCorp

If you want me to remove this repository, please contact me on X (https://x.com/coffeeweed_eth) I'll respect your wishes.
