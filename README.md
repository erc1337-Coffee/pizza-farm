# PizzaFarm

## Summary

This is a script to automatically take care of your Pizza Pets., every 7 hours and 30 minutes it will automatically:
- Feed pizza to your pets
- Wait for the confirmation
- Shower them
- Sleep for 7 hours and 30 minutes then loop

**The service fee is set to zero, no additional fees are added.**


## Installation

```bash
git clone https://github.com/coffeeweed/pizza-farm.git
cd pizza-farm
yarn
cp .env.example .env
```

Add your mnemonic and wallet index to the .env file in the following format: (there's nothing on this seed lil bro)
```
MNEMONIC=acid cloth drink ankle phone flush bomb obscure brass success miracle theory
WALLET_INDEX=0
PET_IDS=67e7aa6a2fd661393ccc816ce2858cf8c59fcc5c1e768be844af2460c4f37ba4i1186,67e7aa6a2fd661393ccc816ce2858cf8c59fcc5c1e768be844af2460c4f37ba4i1190
```

## Run

- Deposit your pets on the wallet
- Deposit some BTC to cover the fees
- Start the script
```bash
yarn run start
```

Example output (11$ gas fees per tx to take care of 5 pets):
```
[INFO] Wallet: bc1p[redacted] 💰
[INFO] Current fee: 3 sats/vb
[INFO] Order for pizza created.. 🍕
[INFO] Transaction signed..
[INFO] Transaction ID: [redacted]
[INFO] Waiting for transaction to be confirmed.. Will check every 30 seconds 🕒
[INFO] Transaction confirmed ! ✨
[INFO] Waiting for the pets to be sent back.. Will check every 30 seconds 🕒
[INFO] Pets sent back ! ✨
[INFO] Sleeping for 7 hours and 30 minutes 💤
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
