import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authorize } from "../utils/auth.js";
import Header from './Header.js';
import InfoTooltip from './InfoTooltip.js';

function Login(props) {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;
    e.preventDefault();

    if (!email || !password) {
      return;
    }
    authorize(email, password)
      .then(data => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          props.handleLogin(); //updates the state inside App.js
          props.setUserData({ email: email })
          navigate('/');
        }
      })
      .catch(err => {
        console.log(err)
        props.setIsFailOpen(true);
      })
  }
  return (
    <div className="login">
      <Header calledFrom="login" className="header" />

      <div className="login__content">
        <h1 className="login__header">Log in</h1>
        <form onSubmit={handleSubmit} className="login__form">
          <input
            id="email"
            required
            name="email"
            type="email"
            placeholder='Email'
            className="login__input login__input_email"
            ref={emailInputRef}
          />
          <input
            id="password"
            required
            name="password"
            type="password"
            placeholder="password"
            className="login__input login__input_password"
            minLength="2"
            ref={passwordInputRef}
          />
          <div className="login__btns-container">
            <button type="submit" className="login__submit-btn">
              Log in
            </button>
            <Link to="/signup" className="login__signup-link">
              Not a member yet? Sign up here!
            </Link>
          </div>
        </form>
      </div>
      {props.isFailOpen && <InfoTooltip
        calledFrom={'login'}
        onClose={props.closeAllPopups}
        name='login-popup'
        isFailOpen={props.isFailOpen}
      // setIsOpen={props.setIsOpen}
      />}
    </div>
  );
}

export default Login; 
