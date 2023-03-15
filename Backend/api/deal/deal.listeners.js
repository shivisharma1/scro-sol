const { contract, providers } = require("./../config/blockchain.config"),
  EscrowAbi = require("../../contracts/abi/escrow.json"),
  { ConstantMembers } = require("../common/members"),
  { DealTable } = require("./deal.queries"),
  { HelperFunction } = require("../common/helpers");

contract.on(
  "NewProxyAddress",
  async function (
    NewProxyAddress,
    dealId,
    commissionRate,
    minimumEscrowAmount,
    commissionWallet
  ) {
    if ((await DealTable.getDealById(dealId)).rows.length) {
      DealTable.setEscrowWallet({
        id: dealId,
        commissionRate: commissionRate.toString(),
        escrowWallet: NewProxyAddress,
        minimumEscrowAmount: minimumEscrowAmount,
        commissionWallet: commissionWallet,
      });

      const newProxyListener = HelperFunction.initializeContract(
        NewProxyAddress,
        EscrowAbi,
        providers
      );

      newProxyListener.on(
        "Funded",
        function (buyerWallet, escrowWallet, event) {
          DealTable.updateStatusToFunded({
            buyerWallet: buyerWallet,
            dealStatus: ConstantMembers.DEAL_STATUS.FUNDED,
            escrowWallet: escrowWallet,
            txHash: event.transactionHash,
          });
        }
      );

      newProxyListener.on("Accepted", function (escrowWallet, seller) {
        DealTable.updateStatusToAccepted({
          dealStatus: ConstantMembers.DEAL_STATUS.ACCEPTED,
          escrowWallet: escrowWallet,
          seller: seller,
        });
      });

      newProxyListener.on(
        "ReleaseFund",
        function (
          released_by,
          escrowWallet,
          amount_released,
          commission_amount,
          event
        ) {
          DealTable.updateStatusToReleased({
            dealStatus: ConstantMembers.DEAL_STATUS.RELEASED,
            escrowWallet: escrowWallet,
            releasedBy: released_by,
            amountReleased: amount_released.toString(),
            commissionAmount: commission_amount.toString(),
            txHash: event.transactionHash,
          });
        }
      );

      newProxyListener.on(
        "Withdraw",
        function (
          buyer,
          escrowWallet,
          amount_withdrawn,
          commission_amount,
          event
        ) {
          DealTable.updateStatusToRefunded({
            dealStatus: ConstantMembers.DEAL_STATUS.REFUNDED,
            escrowWallet: escrowWallet,
            buyer: buyer,
            amount_withdrawn: amount_withdrawn.toString(),
            commission_amount: commission_amount.toString(),
            txHash: event.transactionHash,
          });
        }
      );

      newProxyListener.on(
        "SixMonths",
        function (_destAddr, escrowWallet, amount_withdrawn, event) {
          DealTable.updateStatusToOwnerWithdraw({
            dealStatus: ConstantMembers.DEAL_STATUS.WITHDRAWN_BY_OWNER,
            escrowWallet: escrowWallet,
            _destAddr: _destAddr,
            amount_withdrawn: amount_withdrawn.toString(),
            txHash: event.transactionHash,
          });
        }
      );
    }
  }
);
