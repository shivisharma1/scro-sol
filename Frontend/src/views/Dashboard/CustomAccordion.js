import styles from "./dashboard.module.css";
import Button from "react-bootstrap/Button";
import { useEffect, useRef, useState } from "react";
import {
  fetchAccounts,
  sendSmartContract,
  weiFunctions,
} from "../../services/web3.services";
import {
  WEI,
  BGCOLOR,
  CONTRACT_ADDRESSES,
  CONTRACT_FUNCTIONS,
} from "../../utils/constants.utils";
import escrowProxyAbi from "../../abi/escrowChildContract.json";
import escrowFactoryAbi from "../../abi/escrowFactoryAbi.json";
import { useSolana } from "context/solaServiceContext";

function CustomAccordion(props) {
  const [show, setShow] = useState(false);
  const { obj, onClick, className } = props;
  const [amount, setamount] = useState(obj?.escrow_amount);
  const dealStatus = obj?.deal_status;
  const ref = useRef();
  const { releaseFund, withdrawFund } = useSolana();

  async function convertToWei(amount) {
    const weiAmount = await weiFunctions(`${amount}`, WEI.FROM_WEI);
    return weiAmount;
  }

  useEffect(() => {
    convertToWei(obj?.escrow_amount).then((value) => {
      setamount(value);
    });
  }, [obj]);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleClick = () => {
    if (ref.current?.className?.includes("collapsed")) setShow(false);
    else setShow(true);
  };

  return (
    <div
      onClick={onClick}
      className={`accordion-item ${show ? className : ""}`}
    >
      <table className={`${styles.accordionTable} accordion-header`}>
        <tr
          ref={ref}
          onClick={handleClick}
          className="border"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${obj.id}`}
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          <td className="col-3">{obj?.deal_title}</td>
          <td className="col-3">
            {amount}
            {` `}
            {obj?.deal_token}
          </td>
          <td className={`col-4`}>
            {obj?.seller_wallet ? obj?.seller_wallet : "N/A"}
          </td>
          <td className="col-2 text-center">
            <Button
              className={`btn pt-1 pb-1 ${styles.btnSuccess}`}
              style={{ backgroundColor: BGCOLOR[dealStatus] }}
            >
              {dealStatus}
            </Button>
          </td>
        </tr>
      </table>
      <div
        id={`collapse${obj.id}`}
        className="accordion-collapse collapse"
        aria-labelledby="headingOne"
        data-bs-parent="#accordionFlushExample"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <table>
            <tr>
              <td className={`col-3 ${styles.bodyTitle}`}>Date</td>
              <td className={`col-3 ${styles.bodyTitle}`}>URL </td>
              <td className={`col-3 ${styles.bodyTitle}`}>Description</td>
            </tr>
            <tr>
              <td className="col-3">{formatDate(obj?.createdAt)}</td>
              <td className="col-3">
                <a
                  target="_blank"
                  className={styles.link}
                  href={obj?.deal_link}
                >
                  {obj?.deal_link}
                </a>
              </td>
              <td className="col-4">{obj?.deal_description}</td>
              <td className="col-2 text-center" rowSpan={2}>
                {dealStatus === "ACCEPTED" ? (
                  <Button
                    className={`btn ${styles.btnRelease}`}
                    onClick={async () => {
                      //TODO : Api request to get id
                      await releaseFund("id");
                    }}
                  >
                    Release
                  </Button>
                ) : dealStatus === "FUNDED" ? (
                  <Button
                    className={`btn ${styles.btnWithdraw}`}
                    onClick={async () => {
                      //TODO : Api request to get id
                      await withdrawFund("id");
                    }}
                  >
                    Withdraw
                  </Button>
                ) : dealStatus === "INIT" ? (
                  <Button
                    className={`btn ${styles.btnFunded}`}
                    onClick={async () => {
                      await sendSmartContract(
                        CONTRACT_FUNCTIONS.FACTORY.CREATE_ESCROW,
                        [obj.id],
                        [
                          {
                            from: (await fetchAccounts())[0],
                            value: obj.escrow_amount,
                          },
                        ],
                        escrowFactoryAbi,
                        CONTRACT_ADDRESSES.ESCROW_UPG_FACTORY
                      );
                    }}
                  >
                    Fund
                  </Button>
                ) : (
                  ""
                )}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomAccordion;
