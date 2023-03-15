import React, { useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { Form, Button } from "react-bootstrap";
import styles from "./acceptDeal.module.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  NETWORK_CHAINS,
  CONTRACT_FUNCTIONS,
  NETWORKS,
  ROUTES,
  WEI,
  errorMessage,
  TOAST_RESPONSE,
} from "../../utils/constants.utils";
import axiosinstance from "../../configs/axios.config";
import escrowProxyAbi from "../../abi/escrowChildContract.json";
import {
  checkNetwork,
  connectToMetaMask,
  metamaskInstallationCheck,
  sendSmartContract,
  switchOrAddChain,
  weiFunctions,
  fetchAccounts,
} from "../../services/web3.services";
import { toastMessage } from "../../utils/helper.utils";
import { useSolana } from "context/solaServiceContext";
import { fromLamport } from "services/solana.services";

const AcceptDeal = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [escrowAddress, setEscrowAddress] = useState("");
  const [disable, setDisable] = useState(false);
  const { solanaAddr, acceptDeal } = useSolana();

  const getDealData = async () => {
    const deal_id = searchParams.get("id");
    await axiosinstance
      .get(ROUTES.DEALS.acceptDeal, { params: { deal_id: deal_id } })
      .then(async function (response) {
        if (response?.data?.code == 200) {
          await axiosinstance
            .get(ROUTES.DEALS.getDeals, { params: { deal_id: deal_id } })
            .then(async function (response) {
              const amountInEther = fromLamport(
                response?.data?.data[0]?.escrow_amount
              );

              console.log(response?.data?.data[0]);
              const account = await fetchAccounts();
              if (response?.data?.data[0].buyer_wallet === account[0]) {
                setDisable(true);
              }
              setTitle(response?.data?.data[0]?.deal_title);
              setDescription(response?.data?.data[0]?.deal_description);
              setAmount(amountInEther.toNumber());
              setEscrowAddress(response?.data?.data[0]?.escrow_wallet);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
        if (error?.response?.status === 400) {
          toastMessage(
            errorMessage.LINK_INACTIVE,
            "toast_link_inactive",
            TOAST_RESPONSE.ERROR
          );
          navigate("/dashboard");
        }
      });
  };
  useEffect(() => {
    getDealData();
  }, []);

  // const handleAccept = async () => {
  //   if (await metamaskInstallationCheck()) {
  //     if (await connectToMetaMask()) {
  //       if (await checkNetwork(NETWORKS.BINANCE_SMART_CHAIN_TEST_NETWORK)) {
  //         if (
  //           (
  //             await sendSmartContract(
  //               CONTRACT_FUNCTIONS.ESCROW.ACCEPT_DEAL,
  //               [],
  //               [{ from: (await connectToMetaMask())[0] }],
  //               escrowProxyAbi,
  //               escrowAddress
  //             )
  //           ).status
  //         ) {
  //           navigate("/dashboard");
  //         }
  //       } else {
  //         if (await switchOrAddChain(NETWORK_CHAINS.BINANCE_TEST_NETWORK)) {
  //           if (
  //             (
  //               await sendSmartContract(
  //                 CONTRACT_FUNCTIONS.ESCROW.ACCEPT_DEAL,
  //                 [],
  //                 [{ from: (await connectToMetaMask())[0] }],
  //                 escrowProxyAbi,
  //                 escrowAddress
  //               )
  //             ).status
  //           ) {
  //             navigate("/dashboard");
  //           }
  //         }
  //       }
  //     }
  //   } else {
  //     toastMessage(
  //       errorMessage.INSTALL_METAMASK,
  //       "toast_install",
  //       TOAST_RESPONSE.ERROR
  //     );
  //     // TODO: Display a message to the user to install MetaMask via a toast.
  //     window.open("https://metamask.io/download/", "_blank");
  //   }
  // };
  const handleDecline = () => {};

  const handleAccept = async () => {
    //TODO : Api request to get id
    if (solanaAddr) {
      await acceptDeal(3);
      navigate("/dashboard");
    } else {
      //TODO : Update for solana
      toastMessage(
        errorMessage.INSTALL_METAMASK,
        "toast_install",
        TOAST_RESPONSE.ERROR
      );
    }
  };

  return (
    <React.Fragment>
      <SideBar />
      <Header />
      <div className={styles.newDeal}>
        <>
          <span className={styles.heading}>Accept Deal</span>
          <div className={`border mt-3 ${styles.formDiv}`}>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className={styles.label}>Title</Form.Label>
                <Form.Control
                  className={styles.customInput}
                  type="text"
                  name="title"
                  value={title}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className={styles.label}>Description</Form.Label>
                <Form.Control
                  className={styles.customInput}
                  type="text"
                  name="description"
                  value={description}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className={styles.label}>
                  Amount(in USDT)
                </Form.Label>
                <Form.Control
                  className={styles.customInput}
                  type="number"
                  name="amount"
                  value={amount}
                  readOnly
                />
              </Form.Group>
              <div className={styles.btnDiv}>
                <Button
                  disabled={disable}
                  className={styles.acceptBtn}
                  onClick={handleAccept}
                >
                  Accept
                </Button>
                <Button
                  disabled={disable}
                  className={styles.declineBtn}
                  onClick={handleDecline}
                >
                  Decline
                </Button>
              </div>
            </Form>
          </div>
        </>
      </div>
    </React.Fragment>
  );
};

export default AcceptDeal;
