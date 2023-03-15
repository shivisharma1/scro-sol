import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { PublicKey, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";

import IDL from "../utils/idl.json";

import {
  PROGRAM_ID,
  FACTORY_SEED,
  ESCROW_SEED,
  COMMISION_KEY,
} from "../utils/solanaConstants.utils";

export const getProgram = (connection, wallet) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program(IDL, PROGRAM_ID, provider);
  return program;
};

export const getProgramAccountPk = (seeds) => {
  return PublicKey.findProgramAddressSync(seeds, PROGRAM_ID)[0];
};

export const getFactoryAccountPk = () => {
  return getProgramAccountPk([FACTORY_SEED]);
};

export const getEscrowIdPk = (id) => {
  return getProgramAccountPk([
    ESCROW_SEED,
    new BN(id).toArrayLike(Buffer, "le", 8),
  ]);
};

export const getEscrowAccountPk = (uuid) => {
  return getProgramAccountPk([uuid]);
};

export const confirmTx = async (txHash, connection) => {
  const blockHashInfo = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: blockHashInfo.blockhash,
    lastValidBlockHeight: blockHashInfo.lastValidBlockHeight,
    signature: txHash,
  });
};

export const toSolana = (amount) => {
  return new BN(amount * LAMPORTS_PER_SOL);
};

export const fromLamport = (amount) => {
  return new BN(amount / LAMPORTS_PER_SOL);
};

export const createInitDeal = (escrowAdress, wallet, escrowid) => {
  return {
    escrow: escrowAdress,
    payer: wallet?.publicKey,
    escrowid: escrowid,
    systemProgram: SystemProgram.programId,
  };
};

export const createNescrowId = (addr, wallet, factory) => {
  return {
    escrowid: addr,
    signer: wallet?.publicKey,
    factory: factory,
    systemProgram: SystemProgram.programId,
  };
};

export const createEscrowParties = (escrowAdress, wallet) => {
  return {
    escrow: escrowAdress,
    signer: wallet?.publicKey,
    systemProgram: SystemProgram.programId,
  };
};

export const createReleaseFund = (escrowAdress, wallet, reciever) => {
  return {
    escrow: escrowAdress,
    signer: wallet?.publicKey,
    reciever: reciever,
    commisionAccount: COMMISION_KEY,
    systemProgram: SystemProgram.programId,
  };
};

export const createWithdrawFund = (escrowAdress, wallet) => {
  return {
    escrow: escrowAdress,
    signer: wallet?.publicKey,
    commisionAccount: COMMISION_KEY,
    systemProgram: SystemProgram.programId,
  };
};

export const findReciever = (escrow, signer) => {
  let { owner, seller } = escrow;

  owner = owner.toString();
  seller = seller.toString();

  if (!owner || !seller) return;

  const newSigner = signer.toString();
  const newOwner = new PublicKey(owner);
  const newSeller = new PublicKey(seller);

  if (newSigner === owner) {
    return newSeller;
  } else if (newSigner === seller) {
    return newOwner;
  }

  throw new Error("Invalid signer");
};
