import React from "react";
import "./footer.css";
import Dslogo from "../../../image/Drishticon_logo.png";
import { LinkedinOutlined, FacebookOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Footer = (props) => {
  return (
    <footer
      className={props.className ? `${props.className} footer` : "footer"}
    >
      <div className="contact">
        <div className="contact-text">
          <p className="contact-header">Contact:</p>
          <a
            className="contact-details"
            href="mailto:info@drishticon.com"
            target="_blank"
            rel="noreferrer"
          >
            <span>General:</span> info@drishticon.com
          </a>
          <a
            className="contact-details"
            href="mailto:sales@drishticon.com"
            target="_blank"
            rel="noreferrer"
          >
            <span>Sales:</span> sales@drishticon.com
          </a>
          <a
            className="contact-details"
            href="mailto:career@drishticon.com"
            target="_blank" rel="noreferrer"

          >
            <span>Career:</span> career@drishticon.com
          </a>
          <a className="contact-details" href="tel:+15104024515">
            <span>US:</span> +1 510-402-4515
          </a>
          <a className="contact-details" href="tel:+919819972099">
            <span>India:</span> +91 981 997 2099
          </a>
        </div>
      </div>
      <div className="logo">
        <a
          href="https://www.drishticon.com/#/home"
          target="_blank"
          rel="noreferrer"
        >
          <img src={Dslogo} alt="Drishticon logo" className="footer-logo" />
        </a>
        <div className="social-icons">
          <a
            href="https://www.linkedin.com/company/drishticon/mycompany/verification/"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedinOutlined className="icon" />
          </a>
          <a
            href="https://www.facebook.com/pages/category/Consulting-agency/Drishticon-Inc-405718472843300/"
            target="_blank"
            rel="noreferrer"
          >
            <FacebookOutlined className="icon" />
          </a>
        </div>
      </div>
      <div className="about">
        <a
          href="https://www.drishticon.com/#/about"
          target="_blank"
          rel="noreferrer"
        >
          About Us
        </a>
        <Link to="/faqs">FAQs</Link>
      </div>
    </footer>
  );
};

export default Footer;
