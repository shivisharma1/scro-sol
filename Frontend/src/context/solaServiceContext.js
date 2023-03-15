import { useState, createContext, useContext, useEffect, useMemo } from "react";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  getProgram,
  getFactoryAccountPk,
  getEscrowAccountPk,
  confirmTx,
  createInitDeal,
  createEscrowParties,
  createReleaseFund,
  findReciever,
  createWithdrawFund,
  createNescrowId,
  getEscrowIdPk,
  toSolana,
} from "../services/solana.services";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const SolanaContext = createContext(null);

export const SolanaContextProvider = ({ children }) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [factory, setFactory] = useState(null);
  const [factoryId, setFactoryId] = useState(undefined);
  const [solanaAddr, setSolanaAddr] = useState(null);

  const program = useMemo(() => {
    if (connection && wallet) {
      return getProgram(connection, wallet);
    }
  }, [connection, wallet]);

  useEffect(() => {
    if (connection && wallet) {
      if (!solanaAddr) setSolanaAddr(wallet.publicKey.toString());
    }
  }, [wallet]);

  const updateStates = async () => {
    if (program) {
      try {
        if (!factoryId) {
          let tm = getFactoryAccountPk();
          setFactory(tm);
          let { lastId } = await program.account.factory.fetch(tm);
          console.log("fd", lastId.toNumber());
          setFactoryId(lastId.toNumber());
        }
      } catch (error) {
        console.log("failed to update states", error);
      }
    }
  };

  const newEscrowId = async (uuid) => {
    if (!program) return;
    try {
      console.log("creating escrow id");
      let { lastId } = await program.account.factory.fetch(factory);
      let fid = lastId.toNumber() + 1;
      const escrowAdress = getEscrowIdPk(fid);

      const txHash = await program.methods
        .newEscrowId(uuid)
        .accounts(createNescrowId(escrowAdress, wallet, factory))
        .rpc();
      await confirmTx(txHash, connection);
      console.log("new escrow id has been initiated");
      return lastId;
    } catch (error) {
      console.log("failed to create new escrow id", error);
      return null;
    }
  };

  const initializeDeal = async (id, uuid) => {
    if (!program) return;
    try {
      console.log("initializing");
      const escrowIdAdress = getEscrowIdPk(id);
      const escrowAdress = getEscrowAccountPk(uuid);
      const txHash = await program.methods
        .initializeDeal()
        .accounts(createInitDeal(escrowAdress, wallet, escrowIdAdress))
        .rpc();
      await confirmTx(txHash, connection);

      console.log("new escrow deal has been initiated");
    } catch (error) {
      console.log("failed to initialize deal", error);
      return null;
    }
  };

  const depositSol = async (uuid, amount) => {
    if (!program) return;
    try {
      console.log("sending deposit");
      const escrowAdress = getEscrowAccountPk(uuid);
      const txHash = await program.methods
        .deposit(amount)
        .accounts(createEscrowParties(escrowAdress, wallet))
        .rpc();
      await confirmTx(txHash, connection);

      console.log("deposit of sol successful");
    } catch (error) {
      console.log("failed to deposit sol in escrow", error);
    }
  };

  const acceptDeal = async (uuid) => {
    if (!program) return;
    try {
      console.log("accepting deal");
      const escrowAdress = getEscrowAccountPk(uuid);
      const txHash = await program.methods
        .acceptDeal()
        .accounts(createEscrowParties(escrowAdress, wallet))
        .rpc();
      await confirmTx(txHash, connection);

      console.log("accepting deal successful");
    } catch (error) {
      console.log("failed to accept deal", error);
    }
  };

  const releaseFund = async (uuid) => {
    if (!program) return;
    try {
      console.log("realeasing fund");
      const escrowAdress = getEscrowAccountPk(uuid);
      console.log("account", escrowAdress.toString());
      const escrow = await program.account.escrow.fetch(escrowAdress);
      const reciever = findReciever(escrow, wallet.publicKey);

      const txHash = await program.methods
        .releaseFund()
        .accounts(createReleaseFund(escrowAdress, wallet, reciever))
        .rpc();
      await confirmTx(txHash, connection);

      console.log("release fund successful");
    } catch (error) {
      console.log("failed to relaese fund", error);
    }
  };

  const withdrawFund = async (uuid) => {
    if (!program) return;
    try {
      console.log("withdrawing fund");
      const escrowAdress = getEscrowAccountPk(uuid);

      const txHash = await program.methods
        .withdrawFund()
        .accounts(createWithdrawFund(escrowAdress, wallet))
        .rpc();
      await confirmTx(txHash, connection);

      console.log("withdraw fund successful");
    } catch (error) {
      console.log("failed to withdraw fund", error);
    }
  };

  useEffect(() => {
    updateStates();
  }, [program]);

  return (
    <SolanaContext.Provider
      value={{
        solanaAddr: solanaAddr,
        newEscrowId,
        initializeDeal,
        depositSol,
        acceptDeal,
        releaseFund,
        withdrawFund,
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
};

export const useSolana = () => {
  return useContext(SolanaContext);
};
