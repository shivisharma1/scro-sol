import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";
import bgImage from "../../assets/images/BackgroundImage.webp";
import MetamaskLogo from "../../assets/images/MetamaskLogo.svg";
import PhantomLogo from "../../assets/images/PhantomLogo.svg";
import {
  checkNetwork,
  connectToMetaMask,
  metamaskInstallationCheck,
  switchOrAddChain,
  fetchAccounts,
} from "../../services/web3.services";
import {
  BINANCE_TEST_NETWORK,
  NETWORKS,
  NETWORK_CHAINS,
  TOAST_RESPONSE,
  successMessage,
} from "../../utils/constants.utils";
import { useAuth } from "../../context/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toastMessage } from "../../utils/helper.utils";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSolana } from "context/solaServiceContext";

const getState = async () => {
  const accounts = await fetchAccounts();
  return accounts[0];
};
const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location?.state?.path || "/dashboard";
  const redirectSearch = location?.state?.search ? location?.state?.search : "";
  const { solanaAddr } = useSolana();

  useEffect(() => {
    // getState().then((value) => {
    //   auth.login(value);
    // });
    // if (auth.user) setIsLoggedIn(true);
    // if (isLoggedIn)
    //   navigate(
    //     { pathname: redirectPath, search: redirectSearch },
    //     { replace: true }
    //   );
  }, [auth, isLoggedIn, navigate, redirectPath]);

  useEffect(() => {
    if (solanaAddr) {
      auth.login(solanaAddr);

      if (auth.user) setIsLoggedIn(true);
      if (isLoggedIn)
        navigate(
          { pathname: redirectPath, search: redirectSearch },
          { replace: true }
        );
    }
  }, [auth, isLoggedIn, navigate, redirectPath, solanaAddr]);

  return (
    <div
      className={styles.wrapper}
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className={styles.mainDiv}>
        <span className={styles.connect}>
          Connect your wallet to <br></br>
          <span className={styles.bold}>Escrow</span>
        </span>
        <div>
          <img
            onClick={async () => {
              if (await metamaskInstallationCheck()) {
                if (await connectToMetaMask()) {
                  if (
                    await checkNetwork(
                      NETWORKS.BINANCE_SMART_CHAIN_TEST_NETWORK
                    )
                  ) {
                    navigate("/dashboard");
                    toastMessage(
                      successMessage.ON_BSC_TESTNET,
                      "toast_success",
                      TOAST_RESPONSE.SUCCESS
                    );
                  } else {
                    if (
                      await switchOrAddChain(
                        NETWORK_CHAINS.BINANCE_TEST_NETWORK
                      )
                    ) {
                      navigate("/dashboard");
                      toastMessage(
                        successMessage.ON_BSC_TESTNET,
                        "toast_success",
                        TOAST_RESPONSE.SUCCESS
                      );
                    }
                  }
                }
              } else {
                window.open("https://metamask.io/download/", "_blank");
              }
            }}
            className={styles.metamaskLogo}
            src={MetamaskLogo}
          />
          {/* <img className={styles.phantomLogo} src={PhantomLogo} /> */}
          <WalletMultiButton />
        </div>
      </div>
    </div>
  );
};

export default Login;
