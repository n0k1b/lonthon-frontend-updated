import React, { useState, useEffect } from "react";
import styles from "./DashboardPage.module.css";
import { Link, Navigate } from "react-router-dom";

import dp from "../image/dp.jpg";

import classes from "./WithdrawPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { homepageActions } from "../redux/homepage-slice";
import { baseURL } from "../api";
import { Box, CircularProgress } from "@mui/material";
import InfoCard from "../components/UI/InfoCard";
import GreyBtn from "../components/UI/GreyBtn";
import Modal from "@mui/material/Modal";

const WD_LIST = [
  {
    name: "Muhammad Ashraf",
    type: "Book",
    title: "This is a title",
    date: "10-08-23",
    amount: 500,
  },
  {
    name: "Lionel Messi",
    type: "Novel",
    title: "This is a title",
    date: "10-08-23",
    amount: 5500,
  },
  {
    name: "Kylian Mbappe",
    type: "Audio Book",
    title: "This is a title",
    date: "10-08-23",
    amount: 800,
  },
  {
    name: "Cristiano Ronaldo",
    type: "VIdeo",
    title: "This is a title",
    date: "10-08-23",
    amount: 1500,
  },
  {
    name: "Muhammad Ashraf",
    type: "Book",
    title: "This is a title",
    date: "10-08-23",
    amount: 200,
  },
];

const WD_LIST_D = [
  { date: "22-02-2023", amount: 500, status: "Pending" },
  { date: "22-02-2023", amount: 5500, status: "Approved" },
  { date: "22-02-2023", amount: 800, status: "Approved" },
  { date: "22-02-2023", amount: 1500, status: "Approved" },
  { date: "22-02-2023", amount: 200, status: "Approved" },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "#eae9e9",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const WithdrawPage = () => {
  const isLoggedIn = useSelector((state) => state.homepage.isLoggedIn);
  const token = useSelector((state) => state.homepage.token);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState();
  const [openModal, setOpenModal] = React.useState(false);
  const [balance, setBalance] = useState(5000);
  const [amount, setAmount] = useState();

  const [insuffErr, setInsuffErr] = useState(false);
  const [inputErr, setInputErr] = useState(false);

  const [bkashSel, setBkashSel] = useState();
  const [nagadSel, setNagadSel] = useState();
  const [paypalSel, setPaypalSel] = useState();

  const [bnAccNum, setBnAccNum] = useState();
  const [paypalAccNum, setPaypalAccNum] = useState();

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const dashboardDataFetch = async () => {
    setLoading(true);
    const response = await fetch(`${baseURL}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);

    if (!response.ok) {
      setLoading(false);
      return;
    }

    const data = await response.json();
    console.log(data.data);
    setDashboardData(data.data);
    dispatch(homepageActions.setDashboardData(data.data));
    setLoading(false);
  };

  const withdrawHandler = () => {
    if (amount > balance) setInsuffErr(true);
    if (!amount || typeof amount !== "number") setInputErr(true);
  };

  useEffect(() => {
    if (isLoggedIn) {
      dashboardDataFetch();
    }
  }, [isLoggedIn]);

  const bkashSelectHandler = () => {
    setBkashSel(true);
    setNagadSel(false);
    setPaypalSel(false);
  };

  const nagadSelectHandler = () => {
    setBkashSel(false);
    setNagadSel(true);
    setPaypalSel(false);
  };
  const paypalSelectHandler = () => {
    setBkashSel(false);
    setNagadSel(false);
    setPaypalSel(true);
  };

  return (
    <>
      {!isLoggedIn && <Navigate to="/login" />}
      {isLoggedIn && !loading && dashboardData && (
        <div className={styles.container}>
          <div className={styles.leftCon}>
            <div className={styles.authorCon}>
              <div className={styles.authorSec}>
                <img className={styles.dp} src={dp} alt="author_dp" />

                <div>
                  <p className={styles.name}>
                    {dashboardData.user.first_name}{" "}
                    {dashboardData.user.last_name}
                  </p>
                  <p className={styles.role}>
                    {dashboardData.user.role.charAt(0).toUpperCase() +
                      dashboardData.user.role.slice(1)}
                  </p>
                </div>
              </div>
              <Link className={styles.link} to="/dashboard/edit_profile">
                <div className={styles.btn}>Edit Profile</div>
              </Link>
            </div>

            <div className={styles.optionsCon}>
              <Link className={styles.link} to="/dashboard">
                <p className={styles.option}>Dashboard</p>
              </Link>

              <Link className={styles.link} to="/dashboard/contact">
                <p className={styles.options}>Contact</p>
              </Link>

              <Link className={styles.link} to="/dashboard/contents">
                <p className={styles.options}>Contents</p>
              </Link>

              <Link className={styles.link} to="/dashboard/withdraw">
                <p className={styles.active}>Withdraw</p>
              </Link>

              <Link className={styles.link} to="/dashboard/purchase">
                <p className={styles.options}>Purchase</p>
              </Link>
            </div>
          </div>

          <div className={styles.rightCon}>
            <div className={styles.dashCon}>
              <p className={styles.title}>Withdraw</p>
              <div className={classes.firstCon}>
                <InfoCard title="Current Balance" amount={balance} sign="$" />

                <div className={classes.payDet}>
                  <p className={styles.graphTitle}>Select Payment Method:</p>

                  <div className={classes.buttons}>
                    <div
                      className={classes.btnCon}
                      onClick={bkashSelectHandler}
                    >
                      <GreyBtn>Bkash</GreyBtn>
                    </div>

                    <div
                      className={classes.btnCon}
                      onClick={nagadSelectHandler}
                    >
                      <GreyBtn>Nagad</GreyBtn>
                    </div>
                    <div
                      className={classes.btnCon}
                      onClick={paypalSelectHandler}
                    >
                      <GreyBtn>Paypal</GreyBtn>
                    </div>
                  </div>

                  {(bkashSel || nagadSel) && (
                    <div>
                      <p className={classes.bnTitle}>
                        Enter Bkash/Nagad number:
                      </p>
                      <input
                        className={classes.inputText}
                        type="number"
                        onChange={(e) => setBnAccNum(e.target.value)}
                      />
                    </div>
                  )}
                  {paypalSel && (
                    <div>
                      <p className={classes.bnTitle}>Enter Paypal ID:</p>
                      <input
                        className={classes.inputText}
                        type="number"
                        onChange={(e) => setPaypalAccNum(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className={classes.wdBtn} onClick={handleOpen}>
                  <GreyBtn>Request to withdraw</GreyBtn>
                </div>
              </div>

              <div className={classes.wdList}>
                <p className={styles.graphTitle}>Withdraw Requests</p>
                {WD_LIST_D.map((data, i) => (
                  <div className={classes.listCardCon}>
                    <div className={classes.infoCon}>
                      <p className={classes.listText}>{data.date}</p>
                      <p className={classes.listText}>
                        Status:{" "}
                        {data.status === "Pending" ? (
                          <span className={classes.pending}>{data.status}</span>
                        ) : (
                          <span className={classes.status}>{data.status}</span>
                        )}
                      </p>
                    </div>

                    <div className={classes.amountCon}>
                      <p className={classes.listText}>${data.amount}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={classes.wdList}>
                <p className={styles.graphTitle}>Content Sold</p>
                {WD_LIST.map((data, i) => (
                  <div className={classes.listCardConCS}>
                    <div className={classes.infoConCS}>
                      <p className={classes.listText}>Name: {data.name}</p>
                      <p className={classes.listText}>
                        Content Type: {data.type}
                      </p>
                      <p className={classes.listText}>
                        Content Title: {data.title}
                      </p>
                      <p className={classes.listText}>Date: {data.date}</p>
                    </div>

                    <div className={classes.amountCon}>
                      <p className={classes.listText}>${data.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p className={styles.graphTitle}>Amount</p>
          <input
            className={classes.inputText}
            type="number"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
          {insuffErr && <p className={classes.error}>Insufficient balance!</p>}
          {inputErr && (
            <p className={classes.error}>Please enter amount correctly!</p>
          )}
          <div className={classes.confirmBtn} onClick={withdrawHandler}>
            <GreyBtn>Confirm</GreyBtn>
          </div>
        </Box>
      </Modal>

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
            marginBottom: "500px",
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </>
  );
};

export default WithdrawPage;
