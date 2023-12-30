import styles from "./Slider.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useRef } from "react";
import Slider from "react-slick";
import LongCard from "../../UI/LongCard";

const MultipleItems = ({ data }) => {
  let DATA = data;
  if (data.length < 3) {
    DATA = [...data, ...data, ...data];
  }
  const slider = useRef(null);
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "7vw",
    slidesToShow: 3,
    speed: 500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1160,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <div className={styles.container}>
      <button
        className={styles.arrowPrev}
        onClick={() => slider.current.slickPrev()}
      >
        ←
      </button>
      <button
        className={styles.arrowNext}
        onClick={() => slider.current.slickNext()}
      >
        →
      </button>
      <Slider ref={slider} {...settings}>
        {DATA.map((item, i) => (
          <div key={i}>
            <LongCard data={item} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MultipleItems;
