import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../utils/auth.js";
import Header from './Header.js';
import InfoTooltip from './InfoTooltip.js';

function Register(props) {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    register(email, password)
      .then(() => {
        props.setIsSuccessOpen(true);
        navigate('/login');
      })
      .catch((err) => {
        props.setIsFailOpen(true);
        console.log(err);
      });

    e.preventDefault();
  }
  return (
    <div className="register">
      <Header calledFrom="register" className="header" />

      <div className="register__content">
        <h1 className="register__header">Sign up</h1>
        <form onSubmit={handleSubmit} className="register__form">
          <input
            className="register__input register__input_email"
            name="email"
            type="email"
            placeholder="Email"
            ref={emailInputRef}
          />
          <input
            className="register__input register__input_password"
            name="password"
            type="password"
            placeholder="Password"
            ref={passwordInputRef}
          />
          <div className="register__btns-container">
            <button type="submit" className="register__submit-btn">
              Sign up
            </button>
            <Link to="/signin" className="register__signin-link">
              Already a member? Log in here
            </Link>
          </div>
        </form>
      </div>
      {props.isFailOpen && <InfoTooltip
        isFailOpen={props.isFailOpen}
        isSuccessOpen={props.isSuccessOpen}
        onClose={props.closeAllPopups}
        name='register-popup'
      />}
    </div>
  );
}

export default Register;
