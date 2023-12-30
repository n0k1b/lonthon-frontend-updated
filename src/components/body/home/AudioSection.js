import React from "react";
import styles from "./LiteratureSection.module.css";
import MultipleItems from "./Slider";

const LiteratureSection = () => {
  return (
    <div>
      <div className={styles.titleCon}>
        <p className={styles.title}>Audio E-Book</p>
        <p className={styles.view_all}>View All</p>
      </div>
      <div className={styles.carausel_section}>
        <MultipleItems />
      </div>
    </div>
  );
};

export default LiteratureSection;
