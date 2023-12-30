import React, { useEffect, useState } from "react";
import styles from "./ProductDetails.module.css";
import Slider from "react-slick";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import author_dp from "../image/author_dp.jpg";
import product_banner from "../image/product_banner.png";
import text_image from "../image/text_image.jpg";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

import { useParams, Navigate } from "react-router-dom";
import { baseURL } from "../api";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ProductDetails = () => {
  const params = useParams();


  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState();
  const isLoggedIn = useSelector((state) => state.homepage.isLoggedIn);
  const token = useSelector((state) => state.homepage.token);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const prevHandler = () => {
    if (pageNumber === 1) {
      setPageNumber(numPages);
    } else {
      setPageNumber(pageNumber - 1);
    }
  };

  const nextHandler = () => {
    if (pageNumber === numPages) {
      setPageNumber(1);
    } else {
      setPageNumber(pageNumber + 1);
    }
  };


  //Fetch Data
  const dataFetch = async () => {
    setLoading(true);
    const response = await fetch(`${baseURL}/content/${parseInt(params.id)}`);


    if (!response.ok) return;

    const data = await response.json();
    console.log(data);
    setContent(data.data);
    setLoading(false);
  };
  const handlePayment = async (contentId) => {
    if (!isLoggedIn) {

      window.location.href = '/login';
      return;
    }
    try {
      const response = await axios.post(
        `${baseURL}/initiate-payment`,
        {
          contentId: contentId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log(data);


      if (data.status) {

        window.location.href = data.data.redirectUrl;
      } else {

        console.error('Failed to initiate payment');
      }
    } catch (error) {
      console.log('test');
      console.error('Error:', error);
    }
  };



  useEffect(() => {
    try {
      dataFetch();
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  }, []);

  return (
    <>
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

      {!loading && (
        <>
          <div>
            <div className={styles.cover}>
              <div className={styles.coverText}>
                <p className={styles.title}>{content.sub_category.name}</p>
                <p className={styles.route}>{content.category.name} &gt; {content.sub_category.name}</p>
              </div>
            </div>

            <div className={styles.contentSec}>
              <div className={styles.contentBox}>
                <div className={styles.part1}>
                  <div className={styles.productData}>
                    <p className={styles.productTitle}>{content.title}</p>
                    <p className={styles.productDes}>{content.summary}</p>

                    <div className={styles.authorSec}>
                      {/* <img
                        className={styles.authorDp}
                        src={author_dp}
                        alt="author"
                      /> */}
                      <div>
                        <p className={styles.authorName}>{content.author}</p>
                      </div>
                    </div>

                    <div>
                    <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
  <p style={{ fontWeight:'bold',  fontSize: '20px'}}>Price: <span style={{ fontWeight: 'bold', color: 'green' }}>{content.price} BDT</span></p>
</div>
                      {/* <select className={styles.filterOp} name="download">
                        <option value="" disabled selected>
                          Download With
                        </option>
                        <option value="PDF">PDF</option>
                        <option value="JPG">JPG</option>
                        <option value="PHP">PHP</option>
                      </select> */}
                    </div>
                  </div>
                  <img
                    className={styles.banner}
                    src={content.feature_image}
                    alt="banner"
                  />
                </div>



                <div className={styles.part2}>
  <div className={styles.part2Content}>
    <div>
      <div>
        {content.media_type === 0 && (
          <Slider {...settings}>
            {content.media.map((item, i) => (
              <img
                key={i}
                className={styles.sliderImg}
                src={item.media_url}
                alt=""
              />
            ))}
          </Slider>
        )}

        {content.media_type === 1 && (
          <div className={styles.pdfCon}>
            <Document
              file={`data:application/pdf;base64,${content.media[0].pdf_url}`}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={console.error}
            >
              <Page width="600" pageNumber={pageNumber} />
            </Document>
          </div>
        )}
      </div>
      {content.media_type === 1 && (
        <div className={styles.pdfBtnCon}>
          <BsFillArrowLeftCircleFill
            className={styles.pdfBtn}
            onClick={prevHandler}
          />
          <BsFillArrowRightCircleFill
            className={styles.pdfBtn}
            onClick={nextHandler}
          />
        </div>
      )}

      {content.media_type === 4 && (
        <div className={styles.videoPlayerCon}>
          <video
            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            height={500}
            controls
          />
        </div>
      )}
    </div>

    {content.download_status == 0 && content.type == 1 ? (
  <div className={styles.blurOverlay}></div>
) : null}

{content.download_status == 0 && content.type == 1 ? (
  <div className={styles.centeredDiv}>
    <button className={styles.payNowButton} onClick={() => handlePayment(content.id)}>
      Pay Now
    </button>
    <p className={styles.helperText}>Click the button to complete the payment</p>
  </div>
) : null}



  </div>
</div>




              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
