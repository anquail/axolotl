import React, { useState, useEffect } from "react";
import { withRouter, useLocation, useHistory } from "react-router-dom";
import fetch from "isomorphic-fetch";
import regeneratorRuntime from "regenerator-runtime";

const Login = React.memo(() => {
  return (
    <div className="mainContainer">
      <div className="loginContainer">
        <h2>Welcome</h2>
        <p>dotConnect()</p>
        <div className="loginButtonContainer">
          <a href="https://github.com/login/oauth/authorize?client_id=8990a039ea7d2619e624">
            <button>
              <i className="fab fa-github-square fa-2x"></i>
              LOGIN WITH GITHUB
            </button>
          </a>
        </div>
      </div>
    </div>
  );
});

export default withRouter(Login);
