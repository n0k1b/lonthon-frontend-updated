import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { BiText } from "react-icons/bi";
import { BsCameraVideoFill, BsFiletypePdf, BsImage } from "react-icons/bs";
import { Link, Navigate } from "react-router-dom";
import { baseURL } from "../api";
import GreyBtn from "../components/UI/GreyBtn";
import addBtn from "../image/addBtn.png";
import addBtn2 from "../image/addBtn2.png";
import dp from "../image/dp.jpg";
import styles from "./DashboardPage.module.css";
import classes from "./ProductsPage.module.css";

import { Editor } from "@tinymce/tinymce-react";

import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { homepageActions } from "../redux/homepage-slice";

import Modal from "@mui/material/Modal";
import axios from "axios";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductsPage = () => {
  const isLoading = useSelector((state) => state.homepage.isLoading);
  const isLoggedIn = useSelector((state) => state.homepage.isLoggedIn);
  const token = useSelector((state) => state.homepage.token);
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const [search, setSearch] = useState("");
  const [data, setData] = useState();
  const [upload, setUpload] = useState(false);
  const [image, setImage] = useState(null);
  const [addImg, setAddImg] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);
  const [contentID, setContentID] = useState("");
  const [thumbImg, setThumbImg] = useState(null);
  const [banImg, setBanImg] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [author, setAuthor] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [type, setType] = useState();
  const [price, setPrice] = useState(0);

  const [thumbImgDisplay, setThumbImgDisplay] = useState(null);
  const [banImgDisplay, setBanImgDisplay] = useState(null);
  const [selectedPdfName, setSelectedPdfName] = useState("");

  const [num, setNum] = useState(1);
  const [authorNum, setAuthorNum] = useState([1]);

  const [addPdf, setAddPdf] = useState(false);
  const [addImage, setAddImage] = useState(false);
  const [addText, setAddText] = useState(false);
  const [addVideo, setAddVideo] = useState(false);

  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [genreData, setGenreData] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const [formFillUpError, setFormFillUpError] = useState(false);
  const [submittedPopUp, setSubmittedPopUp] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  const [titleError, setTitleError] = useState(false);
  const [desError, setDesError] = useState(false);
  const [authorError, setAuthorError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const [editUI, setEditUI] = useState(false);
  const [contentSingleData, setContentSingleData] = useState();

  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState();

  const [modalThumbOpen, setModalThumbOpen] = useState(false);
  const modalCloseThumbHandler = () => setModalThumbOpen(false);

  const [modalBanOpen, setModalBanOpen] = useState(false);
  const modalCloseBanHandler = () => setModalBanOpen(false);

  const [thumbImgGal, setThumbImgGal] = useState([]);
  const [banImgGal, setBanImgGal] = useState([]);

  useEffect(() => {
    if (dashboardData) {
      const result = dashboardData.contents.filter((data) =>
        data.title.toLocaleLowerCase().match(search.toLocaleLowerCase())
      );
      setData(result);
    }
  }, [search]);

  useEffect(() => {
    if (image) {
      setAddImg(true);
      if (image.length === 0) {
        setImage(null);
      }
    }
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!image) {
        setImage([file]);
      } else {
        setImage([...image, file]);
      }
    } else {
      console.log("No file selected");
    }
  };

  const handleImageChangeThumb = (event) => {
    if (event.target.files[0]) {
      setThumbImg(event.target.files[0]);
      setThumbImgDisplay(URL.createObjectURL(event.target.files[0]));
    } else {
      console.log("No file selected");
    }
  };

  const handleImageChangeBan = (event) => {
    if (event.target.files[0]) {
      setBanImg(event.target.files[0]);
      setBanImgDisplay(URL.createObjectURL(event.target.files[0]));
    } else {
      console.log("No file selected");
    }
  };

  const authorHandler = () => {
    setNum(num + 1);
    setAuthorNum([...authorNum, num + 1]);
  };

  const pdfUploadSec = () => {
    clearContentHandler();
    setAddPdf(true);
    setAddImage(false);
    setAddText(false);
    setAddVideo(false);
    contentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const imageUploadSec = () => {
    clearContentHandler();
    setAddPdf(false);
    setAddImage(true);
    setAddText(false);
    setAddVideo(false);
    contentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const textUploadSec = () => {
    clearContentHandler();
    setAddPdf(false);
    setAddImage(false);
    setAddText(true);
    setAddVideo(false);
    contentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const videoUploadSec = () => {
    clearContentHandler();
    setAddPdf(false);
    setAddImage(false);
    setAddText(false);
    setAddVideo(true);
    contentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const columns = [
    {
      name: "Content ID",
      selector: (row, i) => i + 1,
    },
    {
      name: "Title",
      selector: (row) => row.title,
    },
    {
      name: "Price",
      selector: (row) => (row.price ? row.price : 0),
    },
    {
      name: "Author",
      selector: (row) => row.author,
    },
    {
      name: "",
      cell: (row) => (
        <>
          <Link className={styles.link} to={`/content/${row.id}`}>
            <GreyBtn>Details</GreyBtn>
          </Link>
          <div
            className={`${styles.link} ${styles.p10}`}
            onClick={() => handleEdit(row.id)}
          >
            <GreyBtn>Edit</GreyBtn>
          </div>
        </>
      ),
    },
  ];

  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      setTextContent(editorRef.current.getContent());
    }
    postDataHandler();
  };
  const updateLog = () => {
    if (editorRef.current) {
      setTextContent(editorRef.current.getContent());
    }
    updateDataHandler();
  };

  const handlePDFInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedPdfName(file.name);
    console.log(file);
    const reader = new FileReader();
    reader.onload = () => {
      // Use the raw file (not base64 encoded)
      setPdfFile(file);
    };
    reader.readAsArrayBuffer(file); // or reader.readAsBinaryString(file) depending on your needs
  };

  const handleEdit = async (id) => {
    setLoading(true);
    await categoryFetch();
    await contentSingleDataFetch(id);
    setLoading(false);
    setEditUI(true);
  };

  const uploadHandler = () => {
    categoryFetch();
    setUpload(true);
  };

  const handleCatSelect = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubCatSelect = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  const handleGenreSelect = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFormFillUpError(false);
  };

  const submitHandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSubmittedPopUp(false);
  };

  const handleTypeSelect = (e) => {
    setType(e.target.value);
  };

  //Data Fetch
  const categoryFetch = async () => {
    const response = await fetch(`${baseURL}/category`);

    if (!response.ok) return;

    const data = await response.json();
    console.log(data);
    setCategoryData(data.data);
  };
  //Data Fetch
  const contentSingleDataFetch = async (id) => {
    setContentID(id);
    const response = await fetch(`${baseURL}/content/${id}`);

    if (!response.ok) return;

    const data = await response.json();
    console.log(data);
    setContentSingleData(data.data);
    const {
      title,
      thumbnail_image,
      feature_image,
      summary,
      author,
      category_id,
      subcategory_id,
      genre_id,
      type,
      media_type,
      price
    } = data.data;

    console.log(data.data);
    if (media_type == 1) {
      clearContentHandler();
      setSelectedPdfName('file.pdf')
      setPdfFile(data.data.media[0].pdf_url)
      setAddPdf(true);
      setAddImage(false);
      setAddText(false);
      setAddVideo(false);
    }
    if (media_type == 2) {
      clearContentHandler();
      setAddPdf(false);
      setAddImage(false);
      setAddText(true);
      setAddVideo(false);
    }
    if (media_type == 0) {
      clearContentHandler();
      setAddPdf(false);
      setAddImage(true);
      setAddText(false);
      setAddVideo(false);
    }
    if (media_type == 4) {
      clearContentHandler();
      setAddPdf(false);
      setAddImage(false);
      setAddText(false);
      setAddVideo(true);
    }

    setTitle(title);
    setPrice(type == 1 ? price : 0)
    setThumbImg(thumbnail_image);
    setBanImg(feature_image);
    setDescription(summary);
    setAuthor(author);
    setSelectedCategory(category_id);
    setSelectedSubCategory(subcategory_id);
    setSelectedGenre(genre_id);
    setThumbImgDisplay(thumbnail_image);
    setBanImgDisplay(feature_image);
    setType(type);
  };

  const subcategoryFetch = async () => {
    const response = await fetch(
      `${baseURL}/category/${parseInt(selectedCategory)}`
    );

    if (!response.ok) return;

    const data = await response.json();
    console.log(data);
    setSubCategoryData(data.data);
  };

  useEffect(() => {
    subcategoryFetch();
  }, [selectedCategory]);

  const genreFetch = async () => {
    const response = await fetch(
      `${baseURL}/sub-category/${selectedSubCategory}`
    );

    if (!response.ok) return;

    const data = await response.json();
    console.log(data);
    setGenreData(data.data);
  };

  useEffect(() => {
    genreFetch();
  }, [selectedSubCategory]);

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
    setData(data.data.contents);
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      dashboardDataFetch();
    }
  }, [isLoggedIn]);

  const thumbGalImgFetch = async () => {
    const response = await fetch(`${baseURL}/thumbnailImageGallery`);

    if (!response.ok) return;

    const data = await response.json();
    setThumbImgGal(data.data);
  };
  useEffect(() => {
    if (modalThumbOpen) {
      thumbGalImgFetch();
    }
  }, [modalThumbOpen]);

  const banGalImgFetch = async () => {
    const response = await fetch(`${baseURL}/bannerImageGallery`);

    if (!response.ok) return;

    const data = await response.json();
    setBanImgGal(data.data);
  };
  useEffect(() => {
    if (modalBanOpen) {
      banGalImgFetch();
    }
  }, [modalBanOpen]);

  const postDataHandler = async () => {
    let content;
    let cType = "";

    if (addPdf) {
      content = pdfFile;
      cType = 1;
    }
    if (addText) {
      content = textContent;
      cType = 2;
    }
    if (addImage) {
      content = image;
      cType = 0;
    }
    if (addVideo) {
      content = videoFile;
      cType = 4;
    }

    if (
      title &&
      thumbImg &&
      banImg &&
      description &&
      author &&
      selectedCategory &&
      selectedSubCategory &&
      selectedGenre &&
      type
    ) {
      dispatch(homepageActions.setIsLoading(true));
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category_id", selectedCategory);
      formData.append("sub_category_id", selectedSubCategory);
      formData.append("genre_id", selectedGenre);
      formData.append("thumbnail_image", thumbImg);
      formData.append("feature_image", banImg);
      formData.append("summary", description);
      formData.append("author", author);
      formData.append("type", 0);
      formData.append("content_type", cType);

      if (cType == 0) {
        for (let i = 0; i < content.length; i++) {
          formData.append("content[]", content);
        }
      } else if (cType == 1 || cType == 4) {
        formData.append("content", content);
      }

      type === 1
        ? formData.append("price", price)
        : formData.append("price", 0);

      try {
        const response = await axios.post(
          `${baseURL}/content-upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Response Data:", response.data);

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        setSubmitMsg(response.data.message);
        setSubmittedPopUp(true);
        setTimeout(() => {
          goBackHandler();
        }, 3000);
      } catch (error) {
        console.error("Error:", error.message);
        setSubmittedPopUp(true);
      } finally {
        dispatch(homepageActions.setIsLoading(false));
      }
    } else {
      setFormFillUpError(true);
      console.log(
        {title,
        thumbImg,
        banImg,
        description,
        author,
        selectedCategory,
        selectedSubCategory,
        selectedGenre,
        type,
        price,
        cType,
        content
      });

      if (!title) setTitleError(true);
      if (!description) setDesError(true);
      if (author.length === 0) setAuthorError(true);
      if (type === 2 && !price) setPriceError(true);

      if (title) setTitleError(false);
      if (description) setDesError(false);
      if (author.length !== 0) setAuthorError(false);
      if (price) setPriceError(false);
    }
  };
  const updateDataHandler = async () => {
    let content;
    let cType = "";

    if (addPdf) {
      content = pdfFile;
      cType = 1;
    }
    if (addText) {
      content = textContent;
      cType = 2;
    }
    if (addImage) {
      content = image;
      cType = 0;
    }
    if (addVideo) {
      content = videoFile;
      cType = 4;
    }

    if (
      title &&
      thumbImg &&
      banImg &&
      description &&
      author &&
      selectedCategory &&
      selectedSubCategory &&
      selectedGenre &&
      type
    ) {
      dispatch(homepageActions.setIsLoading(true));
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category_id", selectedCategory);
      formData.append("sub_category_id", selectedSubCategory);
      formData.append("genre_id", selectedGenre);
      formData.append("thumbnail_image", thumbImg);
      formData.append("feature_image", banImg);
      formData.append("summary", description);
      formData.append("author", author);
      formData.append("type", 0);
      formData.append("content_type", cType);
      console.log({content});
      if (cType == 0) {
        for (let i = 0; i < content.length; i++) {
          formData.append("content[]", content);
        }
      } else if (cType == 1 || cType == 4) {
        formData.append("content", content);
      }

      type === 1
        ? formData.append("price", price)
        : formData.append("price", 0);




      try {
        const response = await axios.post(
          `${baseURL}/content-update/${contentID}`,
          formData,
          {
            headers: {
              // Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );

        console.log("Response Data:", response.data);

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        setSubmitMsg(response.data.message);
        setSubmittedPopUp(true);
        setTimeout(() => {
          goBackHandler();
        }, 3000);
      } catch (error) {
        console.error("Error:", error.message);
        setSubmittedPopUp(true);
      } finally {
        dispatch(homepageActions.setIsLoading(false));
      }
    } else {
      setFormFillUpError(true);
      console.log(
        {title,
        thumbImg,
        banImg,
        description,
        author,
        selectedCategory,
        selectedSubCategory,
        selectedGenre,
        type,
        price,
        cType,
        content
      });

      if (!title) setTitleError(true);
      if (!description) setDesError(true);
      if (author.length === 0) setAuthorError(true);
      if (type === 2 && !price) setPriceError(true);

      if (title) setTitleError(false);
      if (description) setDesError(false);
      if (author.length !== 0) setAuthorError(false);
      if (price) setPriceError(false);
    }
  };

  const goBackHandler = () => {
    setPdfFile(null);
    setThumbImg();
    setBanImg();
    setTextContent("");
    setTitle(null);
    setDescription(null);
    setAuthor([]);
    setImage(null);
    setSelectedVideo(null);
    setVideoFile(null);
    setPrice(0);
    setType();

    setTitleError(false);
    setDesError(false);
    setAuthorError(false);
    setPriceError(false);

    setUpload(false);

    setEditUI(false);
  };

  const clearContentHandler = () => {
    setPdfFile(null);
    setTextContent("");
    setImage(null);
    setSelectedVideo(null);
    setVideoFile(null);
  };

  const handleVideoChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      console.log(file);
      setSelectedVideo(URL.createObjectURL(file));
      setVideoFile(file);
      console.log(URL.createObjectURL(file), "URL");
    }
  };

  const removeVideoHandler = () => {
    setSelectedVideo(null);
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
                  <p className={styles.role}>{dashboardData.user.role}</p>
                </div>
              </div>
              <Link className={styles.link} to="/dashboard/edit_profile">
                <div className={styles.btn}>Edit Profile</div>
              </Link>
            </div>

            <div className={styles.optionsCon}>
              <Link className={styles.link} to="/dashboard">
                <p className={styles.options}>Dashboard</p>
              </Link>

              <Link className={styles.link} to="/dashboard/contact">
                <p className={styles.options}>Contact</p>
              </Link>

              <Link className={styles.link} to="/dashboard/contents">
                <p className={styles.active}>Contents</p>
              </Link>

              <Link className={styles.link} to="/dashboard/withdraw">
                <p className={styles.options}>Withdraw</p>
              </Link>

              <Link className={styles.link} to="/dashboard/purchase">
                <p className={styles.options}>Purchase</p>
              </Link>
            </div>
          </div>

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

          <div className={classes.rightCon}>
            {!editUI && !upload && (
              <div className={classes.rContainer}>
                <p className={classes.pTitle}>Contents</p>

                <div className={classes.filterContainer}>
                  <select className={classes.filterOp} name="filter">
                    <option value="" disabled selected>
                      Select Category
                    </option>
                    <option value="novels">Novels</option>
                    <option value="poems">Poems</option>
                    <option value="others">Others</option>
                  </select>

                  <select className={classes.filterOp} name="filter">
                    <option value="" disabled selected>
                      Select Sub Category
                    </option>
                    <option value="novels">Novels</option>
                    <option value="poems">Poems</option>
                    <option value="others">Others</option>
                  </select>

                  <select className={classes.filterOp} name="filter">
                    <option value="" disabled selected>
                      Genre
                    </option>
                    <option value="novels">Novels</option>
                    <option value="poems">Poems</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <img
                  src={addBtn}
                  className={classes.addBtn}
                  onClick={uploadHandler}
                />

                <div className={classes.tableCon}>
                  <DataTable
                    data={data}
                    columns={columns}
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight="500px"
                    highlightOnHover
                    subHeader
                    subHeaderComponent={
                      <input
                        type="text"
                        placeholder="Search"
                        className={classes.tableSearch}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    }
                  />
                </div>
              </div>
            )}

            {upload && (
              <div className={classes.uploadSection}>
                <p className={classes.back} onClick={goBackHandler}>
                  Go back
                </p>
                <p className={classes.pTitle}>Producte Upload</p>

                <div className={classes.filterContainer}>
                  <select
                    className={classes.filterOp}
                    name="filter"
                    onChange={handleCatSelect}
                  >
                    <option value="" disabled selected>
                      Select Category
                    </option>
                    {categoryData.map((op, i) => (
                      <option key={i} value={op.id}>
                        {op.name}
                      </option>
                    ))}
                  </select>

                  {selectedCategory && (
                    <select
                      className={classes.filterOp}
                      name="filter"
                      onChange={handleSubCatSelect}
                    >
                      <option value="" disabled selected>
                        Select Sub Category
                      </option>
                      {subcategoryData.map((op, i) => (
                        <option key={i} value={op.id}>
                          {op.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {selectedSubCategory && (
                    <select
                      className={classes.filterOp}
                      name="filter"
                      onClick={handleGenreSelect}
                    >
                      <option value="" disabled selected>
                        Genre
                      </option>
                      {genreData.map((op, i) => (
                        <option key={i} value={op.id}>
                          {op.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className={classes.addPForm}>
                  <div>
                    <p className={classes.formTitle}>Title*</p>
                    <input
                      className={classes.inputText}
                      type="text"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                    {titleError && (
                      <p className={classes.errorTxt}>Please add a title!</p>
                    )}
                  </div>
                  <div>
                    <p className={classes.formTitle}>Description*</p>
                    <textarea
                      className={classes.ayInput}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                    {desError && (
                      <p className={classes.errorTxt}>
                        Please add a description!
                      </p>
                    )}
                  </div>
                  <div className={classes.nameCon}>
                    {/* <div className={classes.lanSelectCon}>
                  <p className={classes.formTitle}>Language</p>

                  <select className={classes.filterOpUp} name="filter">
                    <option value="" disabled selected>
                      Select Language
                    </option>
                    <option value="novels">Novels</option>
                    <option value="poems">Poems</option>
                    <option value="others">Others</option>
                  </select>
                </div> */}
                  </div>
                  <div className={classes.authorNameSec}>
                    {authorNum.map((num, index) => (
                      <div key={index}>
                        <p className={classes.formTitle}>Author Name {num}</p>
                        <input
                          className={classes.inputText}
                          type="text"
                          onChange={(e) => {
                            const updatedAuthors = [...author];
                            updatedAuthors[index] = e.target.value;
                            setAuthor(updatedAuthors);
                          }}
                        />
                      </div>
                    ))}
                    <img
                      className={classes.addimgBtn}
                      src={addBtn2}
                      alt=""
                      onClick={authorHandler}
                    />
                    {authorError && (
                      <p className={classes.errorTxt}>Please add an author!</p>
                    )}
                  </div>

                  <div>
                    <select
                      className={classes.filterOp}
                      name="filter"
                      onChange={handleTypeSelect}
                    >
                      <option value="" disabled selected>
                        Select Type
                      </option>
                      <option value={"0"}>Free</option>
                      <option value={"1"}>Paid</option>
                      <option value={"2"}>Negotiation</option>
                    </select>

                    {type === "1" && (
                      <div>
                        <p className={classes.formTitle}>Price*</p>
                        <input
                          className={classes.inputText}
                          type="number"
                          onChange={(e) => {
                            setPrice(parseInt(e.target.value));
                          }}
                        />
                        {priceError && (
                          <p className={classes.errorTxt}>
                            Please add a Price!
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={classes.uploadContentCon}>
                    <p className={classes.ucTitle}>Upload your content</p>
                    <div>
                      <BsFiletypePdf
                        className={classes.docLogo}
                        onClick={pdfUploadSec}
                      />
                      <BsImage
                        className={classes.docLogo}
                        onClick={imageUploadSec}
                      />
                      <BiText
                        className={classes.docLogo}
                        onClick={textUploadSec}
                      />
                      <BsCameraVideoFill
                        className={classes.docLogo}
                        onClick={videoUploadSec}
                      />
                    </div>
                  </div>

                  <div ref={contentRef}>
                    {addText && (
                      <div>
                        <p className={classes.formTitle}>Content</p>
                        {/* <textarea className={classes.contentInput} /> */}
                        <Editor
                          onInit={(evt, editor) => (editorRef.current = editor)}
                          initialValue=""
                          init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                              "advlist autolink lists link image charmap print preview anchor",
                              "searchreplace visualblocks code fullscreen",
                              "insertdatetime media table paste code help wordcount",
                            ],
                            toolbar:
                              "undo redo | formatselect | " +
                              "bold italic backcolor | alignleft aligncenter " +
                              "alignright alignjustify | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                          }}
                        />
                      </div>
                    )}
                    {addImage && (
                      <div>
                        <p className={classes.formTitle}>Content</p>
                        {image === null && (
                          <div
                            className={classes.uploadImg}
                            onClick={() =>
                              document.querySelector(".input_img").click()
                            }
                          >
                            <p>Upload Image</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="input_img"
                          hidden
                          onChange={handleImageChange}
                        />
                        {image &&
                          image.map((item, i) => (
                            <div key={i} className={classes.imagePrevCon}>
                              <img
                                className={classes.previewImg}
                                src={URL.createObjectURL(item)}
                                id={`contentRem${i}`}
                                onClick={(e) => {
                                  const selectedImg = image.filter(
                                    (item) => item !== e.target.src
                                  );
                                  setImage(selectedImg);
                                }}
                              />
                              <p
                                className={classes.imagePrevRem}
                                onClick={() => {
                                  document
                                    .querySelector(`#contentRem${i}`)
                                    .click();
                                }}
                              >
                                Click to Remove
                              </p>
                            </div>
                          ))}

                        {addImg && (
                          <img
                            className={classes.addimgBtn}
                            src={addBtn2}
                            alt=""
                            onClick={() =>
                              document.querySelector(".input_img").click()
                            }
                          />
                        )}
                      </div>
                    )}
                    {addPdf && (
                      <div className={classes.addPDF}>
                        <p className={classes.formTitle}>Content</p>
                        <div
                          className={classes.uploadImg}
                          onClick={() =>
                            document.querySelector(".input_pdf").click()
                          }
                        >
                          <p>Upload PDF</p>
                        </div>
                        <input
                          className="input_pdf"
                          type="file"
                          accept="application/pdf"
                          hidden
                          onChange={handlePDFInputChange}
                        />
                        {selectedPdfName && <p>{selectedPdfName}</p>}
                      </div>
                    )}
                    {addVideo && (
                      <div>
                        <p className={classes.formTitle}>Content</p>
                        <div
                          className={classes.uploadImg}
                          onClick={() =>
                            document.querySelector(".input_video").click()
                          }
                        >
                          <p>Upload Video</p>
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="input_video"
                          hidden
                        />
                        {selectedVideo && (
                          <div className={classes.videoPlayer}>
                            <video src={selectedVideo} height={300} controls />
                            <div onClick={removeVideoHandler}>
                              <GreyBtn>Remove</GreyBtn>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={classes.TBSec}>
                    <p className={classes.formTitle}>Add Thumbnail</p>
                    {!thumbImg && (
                      <div className={classes.thumbImgSelectCon}>
                        <div
                          className={classes.uploadImg}
                          onClick={() =>
                            document.querySelector(".input_thumbImg").click()
                          }
                        >
                          <p>Upload Thumbnail Image</p>
                        </div>
                        <div
                          className={classes.uploadImg}
                          onClick={() => setModalThumbOpen(true)}
                        >
                          <p>Choose From Gallery</p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="input_thumbImg"
                      hidden
                      onChange={handleImageChangeThumb}
                    />

                    {thumbImg && (
                      <div className={classes.imagePrevCon}>
                        <img
                          className={classes.previewImg}
                          src={thumbImgDisplay}
                          onClick={() => {
                            setThumbImg(null);
                          }}
                          id="thumbImgRem"
                        />
                        <p
                          className={classes.imagePrevRem}
                          onClick={() => {
                            document.querySelector("#thumbImgRem").click();
                          }}
                        >
                          Click to Remove
                        </p>
                      </div>
                    )}

                    <p className={classes.formTitle}>Add Banner</p>

                    {!banImg && (
                      <div className={classes.thumbImgSelectCon}>
                        <div
                          className={classes.uploadImgBan}
                          onClick={() =>
                            document.querySelector(".input_banImg").click()
                          }
                        >
                          <p>Upload Banner Image</p>
                        </div>
                        <div
                          className={classes.uploadImg}
                          onClick={() => setModalBanOpen(true)}
                        >
                          <p>Choose From Gallery</p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="input_banImg"
                      hidden
                      onChange={handleImageChangeBan}
                    />
                    {banImg && (
                      <div className={classes.imagePrevCon}>
                        <img
                          className={classes.previewImg}
                          src={banImgDisplay}
                          onClick={() => {
                            setBanImg(null);
                          }}
                          id="banImgRem"
                        />
                        <p
                          className={classes.imagePrevRem}
                          onClick={() => {
                            document.querySelector("#banImgRem").click();
                          }}
                        >
                          Click to Remove
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={classes.saveBtn} onClick={log}>
                    <GreyBtn>Save</GreyBtn>
                  </div>
                </div>
              </div>
            )}

            {editUI && (
              <div className={classes.uploadSection}>
                <p className={classes.back} onClick={goBackHandler}>
                  Go back
                </p>
                <p className={classes.pTitle}>Edit Producte</p>

                <div className={classes.filterContainer}>
                  <select
                    className={classes.filterOp}
                    name="filter"
                    onChange={handleCatSelect}
                  >
                    <option value="" disabled selected>
                      Select Category
                    </option>
                    {categoryData.map((op, i) => (
                      <option
                        key={i}
                        value={op.id}
                        selected={op.id == selectedCategory ? true : false}
                      >
                        {op.name}
                      </option>
                    ))}
                  </select>

                  {selectedCategory && (
                    <select
                      // value={contentSingleData.subcategory_id}
                      className={classes.filterOp}
                      name="filter"
                      onChange={handleSubCatSelect}
                    >
                      <option value="" disabled selected>
                        Select Sub Category
                      </option>
                      {subcategoryData.map((op, i) => (
                        <option
                          key={i}
                          value={op.id}
                          selected={op.id == selectedSubCategory ? true : false}
                        >
                          {op.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {selectedSubCategory && (
                    <select
                      // value={contentSingleData.genre_id}
                      className={classes.filterOp}
                      name="filter"
                      onClick={handleGenreSelect}
                    >
                      <option value="" disabled selected>
                        Genre
                      </option>
                      {genreData.map((op, i) => (
                        <option
                          key={i}
                          value={op.id}
                          selected={op.id == selectedGenre ? true : false}
                        >
                          {op.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className={classes.addPForm}>
                  <div>
                    <p className={classes.formTitle}>Title*</p>
                    <input
                      className={classes.inputText}
                      type="text"
                      defaultValue={contentSingleData.title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                    {titleError && (
                      <p className={classes.errorTxt}>Please add a title!</p>
                    )}
                  </div>
                  <div>
                    <p className={classes.formTitle}>Description*</p>
                    <textarea
                      className={classes.ayInput}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      defaultValue={contentSingleData.summary}
                    />
                    {desError && (
                      <p className={classes.errorTxt}>
                        Please add a description!
                      </p>
                    )}
                  </div>
                  <div className={classes.nameCon}>
                    {/* <div className={classes.lanSelectCon}>
                  <p className={classes.formTitle}>Language</p>

                  <select className={classes.filterOpUp} name="filter">
                    <option value="" disabled selected>
                      Select Language
                    </option>
                    <option value="novels">Novels</option>
                    <option value="poems">Poems</option>
                    <option value="others">Others</option>
                  </select>
                </div> */}
                  </div>
                  <div className={classes.authorNameSec}>
                    {authorNum.map((num, index) => (
                      <div key={index}>
                        <p className={classes.formTitle}>Author Name {num}</p>
                        <input
                          className={classes.inputText}
                          type="text"
                          defaultValue={contentSingleData.author}
                          onChange={(e) => {
                            const updatedAuthors = [...author];
                            updatedAuthors[index] = e.target.value;
                            setAuthor(updatedAuthors);
                          }}
                        />
                      </div>
                    ))}
                    <img
                      className={classes.addimgBtn}
                      src={addBtn2}
                      alt=""
                      onClick={authorHandler}
                    />
                    {authorError && (
                      <p className={classes.errorTxt}>Please add an author!</p>
                    )}
                  </div>

                  <div>
                    <select
                      className={classes.filterOp}
                      name="filter"
                      onChange={handleTypeSelect}
                    >
                      <option value="" disabled selected>
                        Select Type
                      </option>
                      <option
                        selected={contentSingleData.type == 0 ? true : false}
                        value={"0"}
                      >
                        Free
                      </option>
                      <option
                        selected={contentSingleData.type == 1 ? true : false}
                        value={"1"}
                      >
                        Paid
                      </option>
                      <option
                        selected={contentSingleData.type == 2 ? true : false}
                        value={"2"}
                      >
                        Negotiation
                      </option>
                    </select>

                    {type == "1" && (
                      <div>
                        <p className={classes.formTitle}>Price*</p>
                        <input
                          className={classes.inputText}
                          type="number"
                          onChange={(e) => {
                            setPrice(parseInt(e.target.value));
                          }}
                          defaultValue={price}
                        />
                        {priceError && (
                          <p className={classes.errorTxt}>
                            Please add a Price!
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={classes.uploadContentCon}>
                    <p className={classes.ucTitle}>Upload your content</p>
                    <div>
                      <BsFiletypePdf
                        className={classes.docLogo}
                        onClick={pdfUploadSec}
                      />
                      <BsImage
                        className={classes.docLogo}
                        onClick={imageUploadSec}
                      />
                      <BiText
                        className={classes.docLogo}
                        onClick={textUploadSec}
                      />
                      <BsCameraVideoFill
                        className={classes.docLogo}
                        onClick={videoUploadSec}
                      />
                    </div>
                  </div>

                  <div ref={contentRef}>
                    {addText && (
                      <div>
                        <p className={classes.formTitle}>Content</p>
                        {/* <textarea className={classes.contentInput} /> */}
                        <Editor
                          onInit={(evt, editor) => (editorRef.current = editor)}
                          initialValue=""
                          init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                              "advlist autolink lists link image charmap print preview anchor",
                              "searchreplace visualblocks code fullscreen",
                              "insertdatetime media table paste code help wordcount",
                            ],
                            toolbar:
                              "undo redo | formatselect | " +
                              "bold italic backcolor | alignleft aligncenter " +
                              "alignright alignjustify | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                          }}
                        />
                      </div>
                    )}
                    {addImage && (
                      <div>
                        <p className={classes.formTitle}>Content</p>
                        {image === null && (
                          <div
                            className={classes.uploadImg}
                            onClick={() =>
                              document.querySelector(".input_img").click()
                            }
                          >
                            <p>Upload Image</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="input_img"
                          hidden
                          onChange={handleImageChange}
                        />
                        {image &&
                          image.map((item, i) => (
                            <div key={i} className={classes.imagePrevCon}>
                              <img
                                className={classes.previewImg}
                                src={URL.createObjectURL(item)}
                                id={`contentRem${i}`}
                                onClick={(e) => {
                                  const selectedImg = image.filter(
                                    (item) => item !== e.target.src
                                  );
                                  setImage(selectedImg);
                                }}
                              />
                              <p
                                className={classes.imagePrevRem}
                                onClick={() => {
                                  document
                                    .querySelector(`#contentRem${i}`)
                                    .click();
                                }}
                              >
                                Click to Remove
                              </p>
                            </div>
                          ))}

                        {addImg && (
                          <img
                            className={classes.addimgBtn}
                            src={addBtn2}
                            alt=""
                            onClick={() =>
                              document.querySelector(".input_img").click()
                            }
                          />
                        )}
                      </div>
                    )}
                    {addPdf && (
                      <div className={classes.addPDF}>
                        <p className={classes.formTitle}>Content</p>
                        <div
                          className={classes.uploadImg}
                          onClick={() =>
                            document.querySelector(".input_pdf").click()
                          }
                        >
                          <p>Upload PDF</p>
                        </div>
                        <input
                          className="input_pdf"
                          type="file"
                          accept="application/pdf"
                          hidden
                          onChange={handlePDFInputChange}
                        />
                        {selectedPdfName && <p>{selectedPdfName}</p>}
                      </div>
                    )}
                    {addVideo && (
                      <div>
                        <p className={classes.formTitle}>Content</p>
                        <div
                          className={classes.uploadImg}
                          onClick={() =>
                            document.querySelector(".input_video").click()
                          }
                        >
                          <p>Upload Video</p>
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="input_video"
                          hidden
                        />
                        {selectedVideo && (
                          <div className={classes.videoPlayer}>
                            <video src={selectedVideo} height={300} controls />
                            <div onClick={removeVideoHandler}>
                              <GreyBtn>Remove</GreyBtn>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={classes.TBSec}>
                    <p className={classes.formTitle}>Add Thumbnail</p>
                    {!thumbImg && !thumbImgDisplay && (
                      <div className={classes.thumbImgSelectCon}>
                        <div
                          className={classes.uploadImg}
                          onClick={() =>
                            document.querySelector(".input_thumbImg").click()
                          }
                        >
                          <p>Upload Thumbnail Image</p>
                        </div>
                        <div
                          className={classes.uploadImg}
                          onClick={() => setModalThumbOpen(true)}
                        >
                          <p>Choose From Gallery</p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="input_thumbImg"
                      hidden
                      onChange={handleImageChangeThumb}
                    />

                    {thumbImgDisplay && (
                      <div className={classes.imagePrevCon}>
                        <img
                          className={classes.previewImg}
                          src={thumbImgDisplay}
                          onClick={() => {
                            setThumbImg(null);
                          }}
                          id="thumbImgRem"
                        />
                        <p
                          className={classes.imagePrevRem}
                          onClick={() => {
                            document.querySelector("#thumbImgRem").click();
                            setThumbImgDisplay();
                          }}
                        >
                          Click to Remove
                        </p>
                      </div>
                    )}

                    <p className={classes.formTitle}>Add Banner</p>

                    {!banImg && !banImgDisplay && (
                      <div className={classes.thumbImgSelectCon}>
                        <div
                          className={classes.uploadImgBan}
                          onClick={() =>
                            document.querySelector(".input_banImg").click()
                          }
                        >
                          <p>Upload Banner Image</p>
                        </div>
                        <div
                          className={classes.uploadImg}
                          onClick={() => setModalBanOpen(true)}
                        >
                          <p>Choose From Gallery</p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="input_banImg"
                      hidden
                      onChange={handleImageChangeBan}
                    />
                    {banImgDisplay && (
                      <div className={classes.imagePrevCon}>
                        <img
                          className={classes.previewImg}
                          src={banImgDisplay}
                          onClick={() => {
                            setBanImg(null)
                          }}
                          id="banImgRem"
                        />
                        <p
                          className={classes.imagePrevRem}
                          onClick={() => {
                            document.querySelector("#banImgRem").click();
                            setBanImgDisplay(null);
                          }}
                        >
                          Click to Remove
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={classes.saveBtn} onClick={updateLog}>
                    <GreyBtn>Update</GreyBtn>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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

      <Snackbar
        open={formFillUpError}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          Please fill out the form!
        </Alert>
      </Snackbar>

      <Snackbar
        open={submittedPopUp}
        autoHideDuration={6000}
        onClose={submitHandleClose}
      >
        <Alert
          onClose={submitHandleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {submitMsg}
        </Alert>
      </Snackbar>

      <Modal
        open={modalThumbOpen}
        onClose={modalCloseThumbHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <p className={classes.pTitle}>Select Thumbnail</p>
            {thumbImgGal.map((image) => (
              <img
                key={image.id}
                className={classes.modalImage}
                src={image.image}
                onClick={(e) => {
                  const url = e.target.src;
                  const img = url.slice(49);
                  setThumbImg(img);
                  setThumbImgDisplay(e.target.src);
                  setModalThumbOpen(false);
                }}
              />
            ))}
          </div>
        </Box>
      </Modal>

      <Modal
        open={modalBanOpen}
        onClose={modalCloseBanHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <p className={classes.pTitle}>Select Banner</p>
            {banImgGal.map((image) => (
              <img
                key={image.id}
                className={classes.modalImage}
                src={image.image}
                onClick={(e) => {
                  const url = e.target.src;
                  const img = url.slice(49);
                  setBanImg(img);
                  setBanImgDisplay(e.target.src);
                  setModalBanOpen(false);
                }}
              />
            ))}
          </div>
        </Box>
      </Modal>
    </>
  );
};
export default ProductsPage;
