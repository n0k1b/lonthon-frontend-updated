import React from "react";
import styles from "./Footer.module.css";
import MN_Logo from "../../image/MN_Logo.png";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SendBtn from "../UI/SendBtn";
import logo from "../../image/lonthon_logo.png";

const Footer = () => {
  return (
    <>
      <div className={styles.content_world}>
        <p className={styles.cw_text}>CONTENT WORLD</p>
        <img className={styles.cw_logo} alt="logo" src={logo} />
      </div>

      <div className={styles.container}>
        <div className={styles.footer}>
          <div className={styles.socials}>
            <div>
              <img alt="logo" src={MN_Logo} className={styles.logo} />
              <p className={styles.des}>
                Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>

            <div className={styles.social_icons}>
              <div className={styles.sCon}>
                <FaFacebookF className={styles.icon} />
              </div>
              <div className={styles.sCon}>
                <FaTwitter className={styles.icon} />
              </div>
              <div className={styles.sCon}>
                <FaInstagram className={styles.icon} />
              </div>
            </div>
          </div>

          <div className={styles.titleLinkContainer}>
            <p className={styles.title}>Content</p>
            <p className={styles.links}>New Content</p>
            <p className={styles.links}>Popular Content</p>
            <p className={styles.links}>Search Trend</p>
            <p className={styles.links}>Blog</p>
          </div>

          <div className={styles.titleLinkContainer}>
            <p className={styles.title}>Information</p>
            <p className={styles.links}>Plans & Pricing</p>
            <p className={styles.links}>About Us</p>
            <p className={styles.links}>Sell Your Content</p>
          </div>

          <div className={styles.titleLinkContainer}>
            <p className={styles.title}>Legal</p>
            <p className={styles.links}>Terms & Conditions</p>
            <p className={styles.links}>Privacy Policy</p>
            <p className={styles.links}>Copyrignt Information</p>
          </div>

          <div>
            <p className={styles.title}>Contact</p>
            <p className={styles.links}>Email</p>
            <div className={styles.emailInput}>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": {
                    m: 0,
                    width: "100%",
                    background: "#D9D9D9",
                  },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField id="outlined-basic" label="" variant="outlined" />
                <SendBtn />
              </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
