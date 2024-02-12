import React, { useEffect, useState } from "react";
import { Steps } from "antd";
import Button from "../../common/button/button.component";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./form-nav.styles.css";
import "antd/dist/antd.css";

const FormNav = (props) => {
  const [current, setCurrent] = useState(0);
  const items = props.steps?.map((item) => ({
    title: item.title,
    subTitle: item.subTitle && item.subTitle,
    icon: item.icon && item.icon,
    status: item.status && item.status,
  }));

  useEffect(() => {
    setCurrent(props.index || 0);
  }, [props.index]);

  const next = () => {
    setCurrent(current + 1);
    props.setCurrentPage(props.steps[current + 1]);
  };

  const prev = () => {
    setCurrent(current - 1);
    props.setCurrentPage(props.steps[current - 1]);
  };

  const handleSubmit = (event) => {
    props.submit(event);
    setCurrent(0);
  };

  const handleCancel = () => {
    props.reset();
    setCurrent(0);
  };

  const handleStepClick = (step) => {
    setCurrent(step);
    props.setCurrentPage(props.steps[step]);
  };

  return (
    <div className="form-nav-container">
      <Steps
        className="form-nav-steps"
        current={current}
        percent={props.percent}
        onChange={props.clickable ? handleStepClick : null}
        type={props.type && props.type === "navigation" ? "navigation" : ""}
        items={items}
      />

      <div className="steps-content-container">{props.children}</div>

      <div className="steps-action">
        {!props.hideNavBtns && (
          <Button
            type="button"
            name="form-nav-back-btn"
            className="icon-btn icon-text no-border"
            handleClick={() => prev()}
            disabled={current === 0}
          >
            <LeftOutlined />
            Previous
          </Button>
        )}

        {props.canSubmit && !props.hideFormBtns && (
          <Button
            type="reset"
            name="form-reset-btn"
            className="btn main reset"
            handleClick={handleCancel}
          >
            Cancel
          </Button>
        )}
        {props.canSubmit && !props.hideFormBtns && (
          <Button
            type="submit"
            name="form-submit-btn"
            className="btn main submit"
            disabled={props.submitError}
            handleClick={(event) => handleSubmit(event)}
          >
            Submit
          </Button>
        )}

        {!props.hideFormBtns && (
          <Button
            type="button"
            name="form-nav-next-btn"
            className="icon-btn icon-text no-border"
            handleClick={() => next()}
            disabled={
              props.error ||
              (props.steps[current]?.hasRequiredFields && props.percent < 100) ||
              current >= props.steps?.length - 1
            }
          >
            Next
            <RightOutlined />
          </Button>
        )}

      </div>
    </div>
  );
};

export default FormNav;
