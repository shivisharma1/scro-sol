import styles from "./Header.module.css";
import metamaskIcon from "../../assets/icons/metamaskIcon.png";
import copyIcon from "../../assets/icons/copyIcon.png";
import { fetchAccounts } from "../../services/web3.services";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useSolana } from "context/solaServiceContext";

const Header = () => {
  //make sure to fix
  const [account, setAccount] = useState("");
  const { solanaAddr } = useSolana();
  const navigate = useNavigate();
  const auth = useAuth();
  const copyAddress = () => {
    navigator.clipboard.writeText(account);
  };
  const handleClick = () => {
    navigate("/new-deal");
  };
  // const getAccount = async () => {
  //   const account = await fetchAccounts();
  //   setAccount(account[0]);
  // };

  const getAccount = async () => {
    setAccount(solanaAddr);
  };
  useEffect(() => {
    if (solanaAddr) getAccount();
  }, []);
  return (
    <div className={styles.header}>
      <div className={styles.imgDiv}>
        <img src={metamaskIcon} className={styles.image} />
      </div>
      <span id="wallet-address" className={`${styles.walletInput} border`}>
        {account.substring(0, 10) +
          "..." +
          account.substring(account.length - 10)}
      </span>
      <div className={styles.copyDiv} onClick={copyAddress}>
        <img src={copyIcon} className={styles.image} />
      </div>
      <div className={styles.buttonDiv}>
        <button className={styles.button} onClick={handleClick}>
          + CREATE NEW DEAL
        </button>
      </div>
    </div>
  );
};

export default Header;
