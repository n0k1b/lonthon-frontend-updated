import React, { useState } from "react";
import styles from "./LongCard.module.css";
// import author_dp from "../../image/author_dp.jpg";
import GreyBtn from "../UI/GreyBtn";
import { Link } from "react-router-dom";

// import { HiOutlineHeart, HiHeart } from "react-icons/hi";
// import { useState } from "react";

const LongCard = ({ data }) => {
  // const [type, setType] = useState();

  // const [liked, setLiked] = useState(false);

  // if (data.media_type === 0) setType("")

  // const likeHandler = () => {
  //   setLiked(!liked);
  // };
  return (
    <div className={styles.container}>
      <div className={styles.imgCon}>
        <img className={styles.img} alt="" src={data.thumbnail_image} />
      </div>
      <div className={styles.contentCon}>
        <div className={styles.text_area}>
          <p className={styles.type}>{data.sub_category.name}</p>
          <p className={styles.title}>{data.title}</p>
          <p className={styles.author2}>{data.author}</p>
          <p className={styles.des}>{data.summary}</p>
        </div>

        <Link className={styles.link} to={`/content/${data.id}`}>
          <GreyBtn>Read More</GreyBtn>
        </Link>

        {/* <div className={styles.authorCon}>
          <hr />
          <div className={styles.author_section}>
            <div className={styles.sec}>
              <div className={styles.details}>
                <img className={styles.author_img} alt="" src={author_dp} />
                <p className={styles.name}>Adnan Hasan</p>
              </div>
              {!liked && (
                <HiOutlineHeart
                  className={styles.unlike}
                  onClick={likeHandler}
                />
              )}
              {liked && (
                <HiHeart className={styles.like} onClick={likeHandler} />
              )}
            </div>
          </div>
        </div> */}
      </div>

      <div className={styles.price}>
        {data.type == 0 ? "Free" : `${data.price} Tk`}
      </div>
    </div>
  );
};

export default LongCard;
