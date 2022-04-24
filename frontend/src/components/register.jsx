import React from "react";
import auth from "../services/authService";
import Joi from "joi-browser";
import Form from "./common/form";
import { Redirect } from "react-router";
import { register } from "../services/userService";

class Register extends Form {
  state = {
    data: { name: "", username: "", password: "" },
    errors: {},
  };

  schema = {
    name: Joi.string().required().min(5).max(15).label("Name"),
    username: Joi.string().required().min(5).max(50).email().label("Username"),
    password: Joi.string().required().min(8).max(20).label("Password"),
  };

  doSubmit = async () => {
    try {
      const response = await register(this.state.data);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = this.state.errors;
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const user = auth.getCurrentUser();

    if (!user) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10%",
          }}
        >
          <div className="col-md-6 col-10 my-5">
            <div className="card mb-4 box-shadow">
              <div
                className="card-header"
                style={{justifyContent:'center', display:'flex', backgroundColor:'orange', color:'black'}}
              >
                <h4
                  className="my-0 font-weight-normal"
                  style={{ alignContent: "center" }}
                >
                  Login
                </h4>
              </div>
              <div
                className="card-body"
                style={{ backgroundColor: "black", color: "white" }}
              >
                <form
                  onSubmit={this.handleSubmit}
                  style={{ color: "white", marginBottom: "5%" }}
                >
                  {this.renderInput("name", "Name")}
                  {this.renderInput("username", "Username")}
                  {this.renderInput("password", "Password", "password")}
                  {this.renderButton("Register")}
                </form>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <p>Returning User?</p>{" "}
                  <a
                    href="/login"
                    style={{
                      marginLeft: "1%",
                      color: "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    Login Here
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      if (user && user.isadmin) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard",
            }}
          ></Redirect>
        );
      } else {
        return (
          <Redirect
            to={{
              pathname: "/mySchedule",
            }}
          ></Redirect>
        );
      }
    }
  }
}

export default Register;