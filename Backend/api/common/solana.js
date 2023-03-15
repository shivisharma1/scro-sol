const { Program, BN } = require("@project-serum/anchor");
const { Connection, PublicKey } = require("@solana/web3.js");
const IDL = require("./idl.json");

export const PROGRAM_ID = new PublicKey(
  "8pZkBXTmvLdudXm5R7JmtihPJ3C5anAd6N9EvGZzBJ3n"
);

export const RPCENDPOINT =
  "https://radial-wispy-wave.solana-devnet.discover.quiknode.pro/7fafc946c620d59561e98818859c19fb0d7b8854/";

export const ESCROW_SEED = "escrowinitone";

const getAccountData = async (account) => {
  const connection = new Connection(RPCENDPOINT, "confirmed", {
    skipPreflight: true,
  });

  const provider = {
    connection: connection,
    send: async (data, cb) => {
      const response = await connection.sendEncoded(data);
      if (response.error) {
        return cb(response.error);
      }
      return cb(null, response.result);
    },
  };

  const program = new Program(IDL, PROGRAM_ID, provider);

  return await program.account.escrow.fetch(account);
};

export const getProgramAccountPk = (seeds) => {
  return PublicKey.findProgramAddressSync(seeds, PROGRAM_ID)[0];
};

export const getEscrowAccountPk = (uuid) => {
  return getProgramAccountPk([uuid]);
};

const getDepositAddress = async (id) => {
  const account = getEscrowAccountPk(id);
  let data = await getAccountData(account);
  const { owner } = data;
  return owner.toString();
};

const getSellerAdddress = async (id) => {
  const account = getEscrowAccountPk(id);
  let data = await getAccountData(account);
  const { seller } = data;
  return seller.toString();
};

const getMinEscrowAmount = async (id) => {
  const account = getEscrowAccountPk(id);
  let data = await getAccountData(account);
  const { minimumescrowAmount } = data;
  return minimumescrowAmount.toString();
};

const getCommissionRate = async (id) => {
  const account = getEscrowAccountPk(id);
  let data = await getAccountData(account);
  const { commissionrate } = data;
  return commissionrate.toString();
};

const getReleasedBy = async (id) => {
  const account = getEscrowAccountPk(id);
  let data = await getAccountData(account);
  const { realesedBy } = data;
  return realesedBy.toString();
};

const getCommissionAmount = async (id) => {
  const account = getEscrowAccountPk(id);
  let data = await getAccountData(account);
  const { commissionAmount } = data;
  return commissionAmount.toString();
};

const getRealesedAmount = async (id) => {
  const account = getEscrowAccountPk(id);
  let data = await getAccountData(account);
  const { releasedAmount } = data;
  return releasedAmount.toString();
};

const getEscrowAddress = (id) => {
  const account = getEscrowAccountPk(id);
  return account.toString();
};
