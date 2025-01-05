import 'dotenv/config';
import { validateMnemonic } from 'bip39';
import { getTimestamp, buildWallet, getRecommendedFee, sendTx, getTxStatus, getPetUtxoStatus } from "./utils.js";
import { buildPetsPayload, buildPayload, getPsbt, createOrder } from "./pizza_utils.js";
import * as unisat from "@unisat/wallet-sdk";

const run = async (params, item) => {
    const fee = await getRecommendedFee()
    console.log(`[${getTimestamp()}][INFO] Current fee: ${fee} sats/vb`)
    const item_id = item === 'shower' ? '001' : '004'
    const pets_payload = await buildPetsPayload(params.pet_ids, params.wallet)
    const payload = buildPayload(pets_payload, params.wallet.address, fee, item_id)
    const order = await createOrder(payload)
    console.log(`[${getTimestamp()}][INFO] Order for ${item} created.. ${ item === 'shower' ? '🚿' : '🍕'}`)
    const psbtResponse = await getPsbt(order.id, params.wallet, fee)
    if(psbtResponse === -1) {
        console.error(`[${getTimestamp()}][ERROR] Transaction creation failed. Please ensure your wallet has enough BTC to cover fees 💸`)
        console.error(`[${getTimestamp()}] Stopping process.. ❌`)
        process.exit(1)
    }

    const psbt = unisat.core.bitcoin.Psbt.fromBase64(psbtResponse.psbtBase64);
    const toSignInputs = [...psbtResponse.ordinalInputIndices, ...psbtResponse.paymentInputIndices].map((entry) => {
        return {
            index: entry,
            address: params.wallet.address,
            sighashType: unisat.core.bitcoin.Transaction.SIGHASH_ALL,
            sighashTypes: [unisat.core.bitcoin.Transaction.SIGHASH_ALL, unisat.core.bitcoin.Transaction.SIGHASH_DEFAULT]
        }
    })    
    const signedPsbt = await params.wallet.signPsbt(psbt, { autoFinalized: true, toSignInputs: toSignInputs })

    // Extract the signed transaction from PSBT and convert to hex
    const signedTx = signedPsbt.extractTransaction()
    const txHex = signedTx.toHex()
    console.log(`[${getTimestamp()}][INFO] Transaction signed..`)

    // Broadcast the signed transaction to the network
    const txid = await sendTx(txHex)
    if(txid === -1) {
        console.error(`[${getTimestamp()}][ERROR] Transaction broadcast failed - please check if the wallet has enough BTC to cover fees 💸`)
        console.error(`[${getTimestamp()}] Stopping process.. ❌`)
        process.exit(1)
    }
    console.log(`[${getTimestamp()}][INFO] Transaction ID: ${txid}`)
    // Gotta wait for the order tx to be confirmed
    console.log(`[${getTimestamp()}][INFO] Waiting for transaction to be confirmed.. Will check every 30 seconds 🕒`)
    while(true) {
        const tx = await getTxStatus(txid)
        if(tx.confirmed) {
            console.log(`[${getTimestamp()}][INFO] Transaction confirmed ! ✨`)
            break
        }
        await new Promise(resolve => setTimeout(resolve, 30000));
    }
    // Then need to wait for the tx sending the pets back to be confirmed
    console.log(`[${getTimestamp()}][INFO] Waiting for the pets to be sent back.. Will check every 30 seconds 🕒`)
    // Wait 10 seconds to ensure the getPetUtxoStatus wont be actively indexing the tx/late and make the tx fail
    await new Promise(resolve => setTimeout(resolve, 10000));
    while(true) {
        // Only check the first pet, if it's confirmed, the others are confirmed too
        const pet_status = await getPetUtxoStatus(params.pet_ids[0])
        if(pet_status) {
            console.log(`[${getTimestamp()}][INFO] Pets sent back ! ✨`)
            break
        }
        await new Promise(resolve => setTimeout(resolve, 30000));
    }
};

/**
 * Wrapper to feed the pets then shower them
 */
const feed_then_shower = async (params) => {
    // Feed the pets
    await run(params, 'pizza');
    // Shower the pets
    await run(params, 'shower');
};

/**
 * Main function to run the script
 * Will run once then re-run every 7 hours and 30 minutes (27000000 ms)
 */
const main = () => {
    // Build the wallet and add it to the instance params
    params.wallet = buildWallet(params.mnemo, params.index);    
    console.log(`[${getTimestamp()}][INFO] Wallet: ${params.wallet.address} 💰`)

    // Daily loop
    setInterval(async () => {
        try {
            await feed_then_shower(params);
            console.log(`[${getTimestamp()}][INFO] Sleeping until next loop 💤`)
        } catch (error) {
            console.error(`[${getTimestamp()}][ERROR] Error in scheduled task: ${error} ❌`);
        }
    }, 27000000);
    // Initial run
    feed_then_shower(params)
        .then(() => {
            console.log(`[${getTimestamp()}][INFO] Sleeping until next loop 💤`)
        })
        .catch((error) => {
            console.error(`[${getTimestamp()}][ERROR] Error in initial run: ${error} ❌`);
            console.error(`[${getTimestamp()}] Stopping process.. ❌`)
            process.exit(1)
        })
}

const params = {
    mnemo: process.env.MNEMONIC,
    index: process.env.WALLET_INDEX,
    pet_ids: process.env.PET_IDS?.split(',')
}
// Check needed params
if(!params.mnemo || !validateMnemonic(params.mnemo) || !params.index || !params.pet_ids) {
    console.error(`[${getTimestamp()}][ERROR] Missing params, please check .env.example and create a valid .env file 📄`)
    console.error(`[${getTimestamp()}] Stopping process.. ❌`)
    process.exit(1)
}
// Run the script
main(params)
