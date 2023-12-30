import React from "react";
import styles from "./Navbar.module.css";
import logo from "../../image/lonthon_logo.png";
import GreyBtn from "../UI/GreyBtn";
import DropDown from "./DropDown";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { homepageActions } from "../../redux/homepage-slice";

const Navbar = ({ menuItems }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.homepage.isLoggedIn);

  // const [litDDOpen, setLitDDOpen] = useState(false);
  // const [mcDDOpen, setMcDDOpen] = useState(false);
  // const [aeDDOpen, setAeDDOpen] = useState(false);
  const [dropdownStates, setDropdownStates] = useState();
  const toggleMenu = useRef();

  // const litDDHandler = (sw) => {
  //   if (sw === "Open") {
  //     setLitDDOpen(true);
  //   }
  //   if (sw === "Close") {
  //     setLitDDOpen(false);
  //   }
  // };

  // const McDDHandler = (sw) => {
  //   if (sw === "Open") {
  //     setMcDDOpen(true);
  //   }
  //   if (sw === "Close") {
  //     setMcDDOpen(false);
  //   }
  // };

  // const AeDDHandler = (sw) => {
  //   if (sw === "Open") {
  //     setAeDDOpen(true);
  //   }
  //   if (sw === "Close") {
  //     setAeDDOpen(false);
  //   }
  // };
  const handleToggleMenu = () => {
    toggleMenu.current.classList.toggle("expanded");
  };
  const toggleDropdown = (index, value) => {
    setDropdownStates(
      menuItems.map((menu, i) => {
        if (index === i) return value;
        else return false;
      })
    );
  };
  React.useEffect(() => {
    if (menuItems) {
      setDropdownStates(menuItems.map((menu) => false));
    }
  }, [menuItems]);

  const logoutHandler = () => {
    dispatch(homepageActions.setIsLoggedIn(false));
    dispatch(homepageActions.setToken(""));
    dispatch(homepageActions.setUserData({}));
    localStorage.removeItem("tokenLonthon");
    localStorage.removeItem("userDataLonthon");
  };

  return (
    <Wrapper menuSize={menuItems.length}>
      <div>
        <div className={styles.content_world}>
          <p className={styles.cw_text}>CONTENT WORLD</p>
          <img className={styles.logo} alt="logo" src={logo} />
        </div>

        <div className={styles.nav_container}>
          <Link className={styles.link} to="/">
            <div className={styles.logo_container}>
              <img className={styles.logo} alt="logo" src={logo} />
              <p>Lonthon</p>
            </div>
          </Link>
          <div className={`${styles.links} mobile-links`} ref={toggleMenu}>
            {menuItems.map((menu, index) => (
              <>
                {!menu.submenu ? (
                  <>
                    {!menu.id && (
                      <Link to={menu.url} className={styles.link} key={index}>
                        <p className={styles.nav_link}>{menu.label}</p>
                      </Link>
                    )}
                  </>
                ) : (
                  <div
                    key={index}
                    className={styles.lit}
                    onMouseEnter={() => toggleDropdown(index, true)}
                    onMouseLeave={() => toggleDropdown(index, false)}
                  >
                    <p className={styles.nav_link}>{menu.label}</p>
                    {dropdownStates && dropdownStates[index] && (
                      <div className={styles.dropDown}>
                        <DropDown links={menu.submenu} catg={menu.id} />
                      </div>
                    )}
                  </div>
                )}
              </>
            ))}

            {!isLoggedIn && (
              <>
                <Link className={styles.link} to="/login">
                  <p className={styles.nav_link}>LOGIN</p>
                </Link>
                <Link className={styles.link} to="/signup">
                  <GreyBtn>SIGNUP</GreyBtn>
                </Link>
              </>
            )}

            {isLoggedIn && (
              <div onClick={logoutHandler}>
                <GreyBtn>LOGOUT</GreyBtn>
              </div>
            )}
          </div>

          {/* Add expanded class to toggle menu mobile view */}
          {/* <div className={`${styles.links} mobile-links`} ref={toggleMenu}>
            <Link to="/" className={styles.link}>
              <p className={styles.nav_link}>HOME</p>
            </Link>

            <div
              onMouseEnter={() => litDDHandler("Open")}
              onMouseLeave={() => litDDHandler("Close")}
              className={styles.lit}
            >
              <Link className={styles.link} to="/literature">
                <p className={styles.nav_link}>LITERATURE</p>
              </Link>
              {litDDOpen && (
                <div className={styles.dropDown}>
                  <DropDown links={["Novel", "Poems", "Others"]} />
                </div>
              )}
            </div>

            <div
              onMouseEnter={() => McDDHandler("Open")}
              onMouseLeave={() => McDDHandler("Close")}
              className={styles.lit}
            >
              <p className={styles.nav_link}>MEDIA CONTENT</p>
              {mcDDOpen && (
                <div className={styles.dropDown}>
                  <DropDown
                    links={[
                      "Script",
                      "Lyrics",
                      "Documentary",
                      "Short Flims",
                      "TVC",
                      "Web Series",
                      "Others",
                    ]}
                  />
                </div>
              )}
            </div>

            <div
              onMouseEnter={() => AeDDHandler("Open")}
              onMouseLeave={() => AeDDHandler("Close")}
              className={styles.lit}
            >
              <p className={styles.nav_link}>AUDIO E-BOOK</p>
              {aeDDOpen && (
                <div className={styles.dropDown}>
                  <DropDown
                    links={[
                      "Novel",
                      "Script",
                      "Music",
                      "Conversation",
                      "Others",
                    ]}
                  />
                </div>
              )}
            </div>

            <p className={styles.nav_link}>OTHERS</p>
            <p className={styles.nav_link}>PROMOTION</p>
            <p className={styles.nav_link}>DASHBOARD</p>
            <p className={styles.nav_link}>LOGIN</p>
            <GreyBtn>SIGNUP</GreyBtn>
          </div> */}
          <div className={styles.toggleMenu}>
            <button className="primary-icon-button" onClick={handleToggleMenu}>
              <FiMenu />
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  .test-class {
    background-color: red;
  }
  .mobile-links {
  }
  .mobile-links.expanded {
    padding: 10px 0px;
    max-height: ${(props) => props.menuSize * 67.78 + 20 + 60 + 60}px;
  }
`;
export default Navbar;
