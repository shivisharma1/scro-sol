import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import styles from "./newDeal.module.css";
import DealSuccess from "./DealSuccess";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import PageOne from "../../assets/images/PageOne.svg";
import axiosinstance from "../../configs/axios.config";
import {
  CONTRACT_ADDRESSES,
  CONTRACT_FUNCTIONS,
  ROUTES,
  WEI,
} from "../../utils/constants.utils";
import escrowProxyAbi from "../../abi/escrowFactoryAbi.json";
import {
  fetchAccounts,
  sendSmartContract,
  weiFunctions,
} from "../../services/web3.services";
import { useSolana } from "context/solaServiceContext";
import AcceptDeal from "views/AcceptDeal";
import { toSolana } from "services/solana.services";

const NewDeal = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dealLink, setDealLink] = useState("");
  const [error, setError] = useState("");
  const { initializeDeal, depositSol, solanaAddr } = useSolana();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      amount: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(5, "Title length must be at least 5 characters long")
        .required("Title is required"),
      description: Yup.string()
        .min(10, "Description length must be at least 10 characters long")
        .required("Description is required"),
      amount: Yup.number().required("USTD is required"),
    }),
    onSubmit: async (values) => {
      const amountInLamports = toSolana(values.amount);
      const newAmountInLamports = amountInLamports.toNumber();

      const body = {
        deal_title: values.title,
        deal_description: values.description,
        escrow_amount: newAmountInLamports,
        deal_token: "SOL",
      };
      console.log("solamount", newAmountInLamports);
      await axiosinstance
        .post(ROUTES.DEALS.postDeal, body)
        .then(async function (response) {
          let id = await newEscrowId("uuidfrombackend");
          console.log("fid", id);
          if (!id) return;
          await initializeDeal(id, "uuidfrombackend");

          await depositSol("uuidfrombackend", amountInLamports);
          setDealLink(response.data?.data?.deal_link);
          setIsSubmitted(true);
        })
        .catch(function (error) {
          setError(error?.response?.data?.message);
        });
    },
  });
  return (
    <React.Fragment>
      <SideBar activeProp="New Deal" />
      <Header />
      <div className={styles.newDeal}>
        {isSubmitted ? (
          <DealSuccess dealLink={dealLink} />
        ) : (
          <>
            <span className={styles.heading}>Create New Deal</span>
            <div className={`border mt-3 ${styles.formDiv}`}>
              <div className={styles.image}>
                <img src={PageOne} className={styles.imageWidth} />
              </div>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className={styles.label}>Title</Form.Label>
                  <Form.Control
                    className={styles.customInput}
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <p className={styles.error}>{formik.errors.title}</p>
                  ) : null}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className={styles.label}>Description</Form.Label>
                  <Form.Control
                    className={styles.customInput}
                    type="text"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <p className={styles.error}>{formik.errors.description}</p>
                  ) : null}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className={styles.label}>
                    Amount(in USDT)
                  </Form.Label>
                  <Form.Control
                    className={styles.customInput}
                    type="number"
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.amount && formik.errors.amount ? (
                    <p className={styles.error}>{formik.errors.amount}</p>
                  ) : error ? (
                    <p className={styles.error}>{error}</p>
                  ) : null}
                </Form.Group>
                <Button className={styles.nextBtn} type="submit">
                  Next
                </Button>
              </Form>
            </div>
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default NewDeal;
