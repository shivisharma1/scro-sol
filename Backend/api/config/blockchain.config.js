const ether = require("ethers"),
  { HelperFunction } = require("../common/helpers"),
  EscrowFactoryAbi = require("../../contracts/abi/factory.json"),
  { CONTRACT_ADDRESS, BSCT_JSON_RPC_URL } = require("./env"),
  providers = new ether.providers.JsonRpcBatchProvider(BSCT_JSON_RPC_URL);

const contract = HelperFunction.initializeContract(
  CONTRACT_ADDRESS,
  EscrowFactoryAbi,
  providers
);

module.exports = {
  contract,
  providers,
};
