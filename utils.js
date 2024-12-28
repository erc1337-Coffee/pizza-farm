import axios from "axios";
import * as unisat from "@unisat/wallet-sdk";
import { NetworkType } from "@unisat/wallet-sdk/lib/network/index.js";

// Constants
const API_ENDPOINTS = {
  UNISAT: 'https://wallet-api.unisat.io/v5',
  MEMPOOL: 'https://mempool.space/api',
};

/**
 * Use the unisat api to get the inscription utxo
 * @param {*} inscription_id - The inscription id
 * @returns - The inscription utxo or an empty array if the inscription is not found
 */
export const getInscriptionUtxo = async (inscription_id) => {
    const data = await axios.get(
        `${API_ENDPOINTS.UNISAT}/inscription/utxo?inscriptionId=${inscription_id}`,
        {
            headers: { Accept: "application/json" },
            validateStatus: function (status) {
                return status < 500;
            },
        },
    );
    if (data.data.msg != "ok") {
        return []
    }
    return data.data.data
}

/**
 * Use the unisat SDK to build a taproot wallet from a mnemonic and the wanted index (will default to index 0)
 * @param {*} mnemo - The mnemonic
 * @param {*} index - The index
 * @returns - The wallet object
 */
export const buildWallet = (mnemo, index=0) => {
  return unisat.wallet.LocalWallet.fromMnemonic(
      unisat.AddressType.P2TR,
      NetworkType.MAINNET,
      mnemo,
      "",
      `m/86'/0'/0'/${index}`,
  );
}


/**
 * Get the recommended fee from mempool.space
 * @returns - The recommended fastest fee
 */
export const getRecommendedFee = async () => {
    const data = await axios.get(
        `${API_ENDPOINTS.MEMPOOL}/v1/fees/recommended`,
    );
    return data.data.fastestFee
}

/**
 * Send a transaction to mempool.space
 * @param tx_hex - The transaction hex
 * @returns - The transaction id or -1 if the transaction failed
 */
export const sendTx = async (tx_hex) => {
  try {
      const data = await axios.post(
          `${API_ENDPOINTS.MEMPOOL}/tx`,
          tx_hex
      );
      return data.data
  } catch (error) {
      return -1
  }
}

/**
 * Get a transaction from mempool.space
 * @param txid - The transaction id
 * @returns - The transaction or an empty array if the transaction is not found
 */
export const getTxStatus = async (txid) => {
    const data = await axios.get(`${API_ENDPOINTS.MEMPOOL}/tx/${txid}/status`)
    return data.data
}

export const getPetUtxoStatus = async (pet_id) => {
    const utxo = await getInscriptionUtxo(pet_id)
    const tx_status = await getTxStatus(utxo.txid)
    return tx_status.confirmed
}