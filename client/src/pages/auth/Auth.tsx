import { Link, useParams } from "react-router-dom";
import "./Auth.scss";
import SignIn from "./signin/Signin";
import SignUp from "./signup/Signup";
import React from "react";
const Auth:React.FC = () => {
  const { authName } = useParams();
  return (
    <div className="auth-wrapper">
      <div className="auth-form-wrapper">
      <div className="auth__header">
        <Link
          to="/signIn"
          className={
            authName === "signIn"
              ? "auth-action-title active"
              : "auth-action-title"
          }
        >
          Sign In
        </Link>
        <Link
          to="/signUp"
          className={
            authName === "signUp"
              ? "auth-action-title active"
              : "auth-action-title"
          }
        >
          Create account
        </Link>
      </div>
      {authName === "signIn" ? <SignIn /> : <SignUp />}
      </div>
    </div>
  );
};

export default Auth;
