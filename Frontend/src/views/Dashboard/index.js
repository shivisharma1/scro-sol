import React, { useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import styles from "./dashboard.module.css";
import searchIcon from "../../assets/icons/searchIcon.png";
import "bootstrap/js/src/collapse.js";
import CustomAccordion from "./CustomAccordion";
import { ROUTES, FILTERS } from "../../utils/constants.utils";
import axiosinstance from "../../configs/axios.config";
import Pagination from "./Pagination";
import { useFormik } from "formik";
import { useSolana } from "context/solaServiceContext";
const dealsPerPage = 3;

const Dashboard = () => {
  const [active, setActive] = useState(null);
  const [acceptedcurrentPage, setAcceptedCurrentPage] = useState(1);
  const [createdCurrentPage, setCreatedCurrentPage] = useState(1);
  const [acceptedSearchPage, setAcceptedSearchPage] = useState(1);
  const [createdSearchPage, setCreatedSearchPage] = useState(1);
  const [createdDeals, setCreatedDeals] = useState([]);
  const [acceptedDeals, setAcceptedDeals] = useState([]);
  const [createdtotalPages, setCreatedTotalPages] = useState(0);
  const [acceptedTotalPages, setAcceptedTotalPages] = useState(0);
  const { solanaAddr } = useSolana();

  const paginate = (pageNumber) => setCreatedCurrentPage(pageNumber);
  const searchPaginate = (pageNumber) => setCreatedSearchPage(pageNumber);

  const acceptedPaginate = (pageNumber) => setAcceptedCurrentPage(pageNumber);
  const acceptedSearchPaginate = (pageNumber) => {
    setAcceptedSearchPage(pageNumber);
  };
  const formik = useFormik({
    initialValues: {
      searchValue: "",
    },
    onSubmit: async (values) => {
      if (values.searchValue.length > 2) {
        if (!solanaAddr) return;
        const body = {
          searchValue: values.searchValue,
          wallet_address: solanaAddr,
          filter: FILTERS.CREATED,
        };
        const acceptedDealsBody = {
          searchValue: values.searchValue,
          wallet_address: "0x36abe7844431d3fcd38edea8f1B479eD7898a2Eb",
          filter: FILTERS.ACCEPTED,
        };
        const params = {
          page_num: createdSearchPage,
          record_limit: dealsPerPage,
        };
        const acceptedParams = {
          page_num: acceptedSearchPage,
          record_limit: dealsPerPage,
        };
        await axiosinstance
          .post(ROUTES.DEALS.searchDeal, body, { params: params })
          .then(function (response) {
            setCreatedDeals(response?.data?.data?.search_list);
            setCreatedTotalPages(response?.data?.data?.total_pages);
          })
          .catch(function (error) {
            console.log(error);
            if (error?.response?.status === 404) {
              setCreatedDeals([]);
            }
          });
        await axiosinstance
          .post(ROUTES.DEALS.searchDeal, acceptedDealsBody, {
            params: acceptedParams,
          })
          .then(function (response) {
            setAcceptedDeals(response?.data?.data?.search_list);
            setAcceptedTotalPages(response?.data?.data?.total_pages);
          })
          .catch(function (error) {
            console.log(error);
            setAcceptedDeals([]);
          });
      }
    },
  });
  const getDeals = async () => {
    if (!solanaAddr) return;
    await axiosinstance
      .get(ROUTES.DEALS.getDeals, {
        params: {
          wallet_address: solanaAddr,
          page_num: createdCurrentPage,
          record_limit: dealsPerPage,
          filter: FILTERS.CREATED,
        },
      })
      .then(async function (response) {
        setCreatedDeals(response?.data?.data?.deal_list);
        setCreatedTotalPages(response?.data?.data?.total_pages);
      })
      .catch(function (error) {
        console.log(error);
      });
    await axiosinstance
      .get(ROUTES.DEALS.getDeals, {
        params: {
          wallet_address: solanaAddr,
          page_num: acceptedcurrentPage,
          record_limit: dealsPerPage,
          filter: FILTERS.ACCEPTED,
        },
      })
      .then(function (response) {
        setAcceptedDeals(response?.data?.data?.deal_list);
        setAcceptedTotalPages(response?.data?.data?.total_pages);
      })
      .catch(function (error) {
        console.log(error);
        // if(error?.response?.status === 404){
      });
  };
  useEffect(() => {
    getDeals();
  }, [createdCurrentPage, acceptedcurrentPage]);

  useEffect(() => {
    formik.handleSubmit();
  }, [createdSearchPage, acceptedSearchPage]);

  const TableHeader = () => {
    return (
      <div className={`row`} id="heading">
        <div className={`col-3 ${styles.title}`}>Title</div>
        <div className={`col-3 ${styles.title}`}>Amount</div>
        <div className={`col-4 ${styles.title}`}>Seller Address</div>
        <div className={`col-2 justify-content-center ${styles.title}`}>
          Status
        </div>
      </div>
    );
  };
  return (
    <React.Fragment>
      <SideBar activeProp="Dashboard" />
      <Header />
      <div className={styles.main}>
        <div className={`${styles.heading} mt-3 ms-3 mb-2`}>
          <div className={`${styles.search} me-3`}>
            <img className={styles.searchIcon} src={searchIcon} />
            <form onSubmit={formik.handleSubmit}>
              <input
                type="text"
                className={`${styles.noBorder} form-control shadow-none`}
                placeholder="Search here..."
                name="searchValue"
                value={formik.values.searchValue}
                onChange={formik.handleChange}
              />
              <button type="submit" style={{ display: "none" }}></button>
            </form>
          </div>
        </div>
        <div className={`${styles.heading} mt-2 mb-2`}>
          <span>Created Deals</span>
        </div>
        <div
          className={`${styles.divWidth} accordion accordion-flush`}
          id="accordionFlushExample"
        >
          <div className={styles.tablewrap}>
            <TableHeader />
            {createdDeals.length > 0 ? (
              createdDeals.map((obj, index) => {
                return (
                  <CustomAccordion
                    index={index}
                    obj={obj}
                    onClick={() => {
                      setActive(obj.id);
                    }}
                    className={`${active === obj.id ? styles.border : ""}`}
                  />
                );
              })
            ) : (
              <div className="display-6 m-5">No Deals Avaialble</div>
            )}
            {createdDeals.length !== 0 && (
              <Pagination
                paginate={formik.values.searchValue ? searchPaginate : paginate}
                currentPage={
                  formik.values.searchValue
                    ? createdSearchPage
                    : createdCurrentPage
                }
                totalPages={createdtotalPages}
              />
            )}
          </div>
          <div className={`${styles.heading} mt-5 mb-2`}>Accepted Deals</div>
          <div className={styles.tablewrap}>
            <TableHeader />
            {acceptedDeals.length > 0 ? (
              acceptedDeals.map((obj, index) => {
                return (
                  <CustomAccordion
                    index={index}
                    obj={obj}
                    onClick={() => {
                      setActive(obj.id);
                    }}
                    className={`${active === obj.id ? styles.border : ""}`}
                  />
                );
              })
            ) : (
              <div className="display-6 m-5">No Deals Avaialble</div>
            )}
            {createdDeals.length !== 0 && (
              <Pagination
                // dealsPerPage={dealsPerPage}
                // totalDeals={acceptedDeals.length}
                paginate={
                  formik.values.searchValue
                    ? acceptedSearchPaginate
                    : acceptedPaginate
                }
                currentPage={
                  formik.values.searchValue
                    ? acceptedSearchPage
                    : acceptedcurrentPage
                }
                totalPages={acceptedTotalPages}
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
