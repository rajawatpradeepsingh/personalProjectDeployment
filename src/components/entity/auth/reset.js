import React, { useState, useEffect } from "react";
//import { runValidation } from "../../../utils/validation.js";
import "./auth.css";
import Button from "../../common/button/button.component.jsx";
import { useHistory } from "react-router-dom";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component.jsx";
import Input from "../../common/input/inputs.component.jsx";
import { forgottenCheck, forgottenEmail } from "../../../API/auth/auth-api.js";
import { forgottenQuestion } from "../../../API/auth/auth-api.js";

const Reset = () => {
  const [stage, setStage] = useState();
  const [tries, setTries] = useState();
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState({});
  const history = useHistory();

  const iniState = () => {
    setStage(1);
    setTries(3);
    setSecurityQuestion({ question: "", answer: "" });
  };

  useEffect(() => {
    iniState();
  }, []);

  useEffect(() => {
    // ban for 15 minutes
    if (tries === 0)
      localStorage.setItem("RCPTimeOff", new Date(Date.now() + 15 * 60 * 1000));
  }, [tries]);

  const changeHandler = (e, validProc = null) => {
    const isDeleted = e.target.value === "";
    //const isValid = runValidation(validProc, e.target.value);
    const isValid = true; // Disabled - Realtime email validation was broken by commit: fb6635993b6cd5ce98b0fdf9be79542c909da7cc (2023-07-03)
    if (isDeleted || isValid) {
      setPrimaryEmail(e.target.value);
    }
  };

  const checkHandler = (e) => {
    e.preventDefault();

    if (securityQuestion.question) {
      forgottenCheck({
        email: primaryEmail,
        answer: securityQuestion.answer,
      }).then((res) => {
        if (res.data) resetHandler();
        else setTries(tries - 1);
      });
    } else {
      resetHandler();
    }
  };

  const resetHandler = () => {
    forgottenEmail(primaryEmail).finally(() => handleDone());
  };

  const handleNext = () => {
    forgottenQuestion(primaryEmail)
      .then((res) => {
        if (res.statusCode === 200) {
          setStage(res.stage);
          setSecurityQuestion({
            ...securityQuestion,
            question: res.question,
          });
        } else {
          setTries(tries - 1);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleAnswer = (e) => {
    setSecurityQuestion({
      ...securityQuestion,
      [e.target.name]: e.target.value,
    });
  };

  const handleDone = () => {
    iniState();
    history.push("/login");
  };

  return (
    <div className="page-container full-width">
      <Content className="small margin-top">
        <h2 className="form-header">Forgot Password</h2>
        <Form className="centered">
          {stage === 1 && (
            <Input
              type="email"
              name="primary"
              id="email"
              onChange={(e) => changeHandler(e, "validateEmail")}
              value={primaryEmail}
              errMssg={
                tries < 3 && tries > 0
                  ? `Email does not match our records. ${tries} attempt(s) left`
                  : tries === 0
                  ? "Exceeded attempt limit. Try again in 15min"
                  : ""
              }
              label="Account Email"
              required
              info="email@example.com"
            />
          )}
          {stage > 1 && (
            <Input
              type="answer"
              label={securityQuestion.question}
              name="answer"
              value={stage === 3 ? "No answer" : securityQuestion.answer || ""}
              errMssg={
                tries < 3 && tries > 0
                  ? `Answer doesn't match our records. ${tries} attempt(s) left`
                  : tries === 0
                  ? "Answer doesn't match our records. Try again in 15 min"
                  : ""
              }
              onChange={handleAnswer}
              required
              disabled={stage === 3}
            />
          )}
          <div className="resetPassword-btn-container">
            <Button
              id="cancel"
              type="reset"
              className="reset"
              handleClick={handleDone}
            >
              cancel
            </Button>
            {stage === 1 && (
              <Button
                type="button"
                className="submit"
                handleClick={handleNext}
                disabled={!(primaryEmail && tries > 0)}
              >
                Next
              </Button>
            )}
            {stage > 1 && (
              <Button
                id="send-reset"
                type="button"
                handleClick={checkHandler}
                disabled={
                  tries === 0 ||
                  !(
                    primaryEmail &&
                    (stage === 3 ||
                      (stage === 2 &&
                        securityQuestion.question &&
                        securityQuestion.answer))
                  )
                }
                className="large submit"
              >
                Reset Password
              </Button>
            )}
          </div>
        </Form>
      </Content>
    </div>
  );
};

export default Reset;
