import axios from "axios";
import { getInscriptionUtxo, getTimestamp } from "./utils.js";

/**
 * Build the pets payload, will fetch the utxo corresponding to each pet
 * @param pet_ids - The pet ids
 * @param wallet - The wallet
 * @returns - The pets payload
 */
export const buildPetsPayload = async (pet_ids, wallet) => {
    const payload = []
    for(const pet_id of pet_ids) {
        const utxo = await getInscriptionUtxo(pet_id)
        payload.push({
            inscriptionId: pet_id,
            returnAddress: wallet.address,
            value: utxo.satoshis
        })
    }
    return payload
}

/**
 * Build the payload for the pizza pets order
 * @param pets_payload - The pets payload
 * @param receiverAddress - The receiver address
 * @param fee - The fee
 * @param itemIdPrefix - The item id prefix
 * @returns - The payload
 */
export const buildPayload = (pets_payload, receiverAddress, fee, itemIdPrefix) => {
    return {
        "delegates": [{"delegateId": "79ad1934b7fbea9c2e509a2977caad7a8c69b7ddec9169355bd9e3847e6cdbc2i0"}],
        "parents": pets_payload,
        "receiveAddress": receiverAddress,
        "lowPostage": true,
        "additionalFee": 0, // Removes the additional fee, not nice for NinjaCorp but it's a shark world out here
        "fee": fee,
        "webhookUrl": "https://feed.pizzapets.fun/.netlify/functions/webhook",
        "inscriptionIdPrefix": itemIdPrefix
    }
}


/**
 * Create an order on pizzapets.fun
 * @param payload - The payload
 * @returns - The order id or -1 if the order failed
 */
export const createOrder = async (payload) => {
    try {
        const data = await axios.post(
            `https://www.pizzapets.fun/.netlify/functions/createDirectOrder`,
            { requestPayload: payload },
        );
        return data.data
    } catch (error) {
        console.error(`[${getTimestamp()}][ERROR] HTTP Error while creating the order on pizzapets.fun ❌`)
        return -1
    }
}


/**
 * Get the psbt for the order from ordinalsbot.com
 * @param order_id - The order id
 * @param wallet - The wallet
 * @param fee - The fee
 * @returns - The psbt or -1 if the psbt failed
 */
export const getPsbt = async (order_id, wallet, fee) => {
    try {
        const data = await axios.post(
            `https://api.ordinalsbot.com/create-parent-child-psbt`,
            {
                "orderId": order_id,
                "paymentAddress": wallet.address,
                "paymentPublicKey": wallet.pubkey,
                "ordinalAddress": wallet.address,
                "ordinalPublicKey": wallet.pubkey,
                "feeRate": fee
            },
        );
        return data.data
    } catch (error) {
        console.error(`[${getTimestamp()}][ERROR] HTTP Error while fetching the order psbt from ordinalsbot.com ❌`)
        return -1
    }
}