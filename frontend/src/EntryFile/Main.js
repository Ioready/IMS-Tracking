/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,Switch,
  HashRouter,
} from "react-router-dom";
import App from "../InitialPage/App";
// import config from "config";

// import "../assets/plugins/fontawesome/css/fontawesome.min.css";
// import "../assets/plugins/fontawesome/css/all.min.css";
import "../assets/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../assets/js/bootstrap.bundle.min.js";
// import "../assets/css/font-awesome.min.css";
import "../assets/css/line-awesome.min.css";
import "../assets/css/style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RightSideBar from "../components/rightSidebar";




const MainApp = () => {

const config = '/'
  return(
    <Router basename={`${config}`}>
    <RightSideBar />
    <ToastContainer />
    <Switch>
      <Route path="/" component={App} />
    </Switch>
  </Router>
  )
  }

export default MainApp;
