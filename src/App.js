import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import Navbar from "./components/nav/Navbar";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/nav/Footer";
import LiteraturePage from "./pages/LiteraturePage";
import { baseURL } from "./api";
import { useDispatch, useSelector } from "react-redux";
import { homepageActions } from "./redux/homepage-slice";
import { Helmet } from "react-helmet";
import ScrollToTop from "./ScrollToTop";
import DashboardPage from "./pages/DashboardPage";
import EditProfile from "./pages/EditProfile";
import ProductDetails from "./pages/ProductDetails";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/Signup";
import WithdrawPage from "./pages/WithdrawPage";
import ProductsPage from "./pages/ProductsPage";
import PurchasePage from "./pages/PurchasePage";

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.homepage.isLoading);
  const [favIcon, setFavIcon] = useState("");
  const [navbarMenu, setNavbarMenu] = useState();
  const [conByCat, setConByCat] = useState();
  const [busSettings, setBusSettings] = useState();

  const getBusinessSettingsData = async () => {
    dispatch(homepageActions.setIsLoading(true));
    const response = await fetch(`${baseURL}/business-settings`);

    if (!response.ok) return;

    const data = await response.json();

    console.log(data.data[0]);
    dispatch(homepageActions.setHomepageData(data.data[0]));
    // dispatch(homepageActions.setIsLoading(false));
    setFavIcon(data.data[0].favicon);
    setBusSettings(true);
    getContentByCategory();
    // getNavbarMenu();

    const token = localStorage.getItem("tokenLonthon");
    const userData = localStorage.getItem("userDataLonthon");

    if (token && userData) {
      dispatch(homepageActions.setIsLoggedIn(true));
      dispatch(homepageActions.setToken(token));
      dispatch(homepageActions.setUserData(userData));
      console.log("logged in");
    }
  };

  const getContentByCategory = async () => {
    dispatch(homepageActions.setIsLoading(true));
    const response = await fetch(`${baseURL}/content-by-category`);
    console.log("res => ", response);

    if (!response.ok) return;

    const data = await response.json();

    console.log(data.data);
    dispatch(homepageActions.setContentByCat(data.data));
    dispatch(homepageActions.setIsLoading(false));
    setConByCat(true);
  };

  const getNavbarMenu = async () => {
    const response = await fetch(`${baseURL}/category`);

    if (!response.ok) return;

    const data = await response.json();

    console.log(data.data);
    setNavbarMenu(data.data);
    dispatch(homepageActions.setIsLoading(false));
  };

  useEffect(() => {
    // dispatch(homepageActions.setIsLoading(true));
    getBusinessSettingsData();
  }, []);

  // useEffect(() => {
  //   if (navbarMenu && conByCat && busSettings)
  //     dispatch(homepageActions.setIsLoading(false));
  // }, [navbarMenu, conByCat, busSettings]);

  // console.log([navbarMenu, NavbarMenuItems], "HHHHH");

  return (
    <Router>
      <div className={styles.container}>
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        )}

        {!isLoading && (
          <>
            <Navbar menuItems={NavbarMenuItems} />
            <Helmet>
              <link rel="icon" href={favIcon} />
            </Helmet>
            <ScrollToTop>
              <Routes>
                <Route exact path="/" element={<HomePage />} />

                <Route exact path="/dashboard" element={<DashboardPage />} />

                <Route
                  path="/dashboard/edit_profile"
                  element={<EditProfile />}
                />

                <Route path="/dashboard/contents" element={<ProductsPage />} />

                <Route path="/dashboard/purchase" element={<PurchasePage />} />

                <Route path="/dashboard/withdraw" element={<WithdrawPage />} />

                <Route path="/content/:id" element={<ProductDetails />} />

                {/* <Route path="/content/edit/:id" element={<ProductDetails />} /> */}

                <Route path="/login" element={<LoginPage />} />

                <Route path="/signup" element={<Signup />} />

                <Route
                  path="/contents/:cat/:subCat"
                  element={<LiteraturePage />}
                />
              </Routes>
            </ScrollToTop>

            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}

const NavbarMenuItems = [
  { label: "HOME", url: "/" },
  {
    label: "LITERATUE",
    id: 1,
    submenu: [
      { name: "Novel", id: 1 },
      { name: "Novel", id: 2 },
      { name: "Others", id: 3 },
    ],
  },
  {
    label: "MEDIA CONTENT",
    id: 2,
    submenu: [
      { name: "Script", id: 1 },
      { name: "Lyrics", id: 1 },
      { name: "Documentary", id: 1 },
      { name: "Short Films", id: 1 },
      { name: "TVC", id: 1 },
    ],
  },
  {
    label: "AUDIO E-BOOK",
    id: 3,
    submenu: [
      { name: "Novel", id: 1 },
      { name: "Novel", id: 2 },
      { name: "Others", id: 3 },
    ],
  },
  { label: "OTHERS", id: null, url: "others" },
  { label: "PROMOTIONS", id: null, url: "promotions" },
  { label: "DASHBOARD", id: null, url: "dashboard" },
];

export default App;
