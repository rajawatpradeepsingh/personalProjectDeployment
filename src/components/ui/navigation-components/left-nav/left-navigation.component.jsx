import { Link } from "react-router-dom";
import NavMenu from "../../menu/nav-menu";
import { MenuOutlined, CloseOutlined, LinkedinOutlined, FacebookOutlined } from "@ant-design/icons";
import "./left-navigation.styles.css";


const LeftNav = ({ focus, handleFocus, admin, menuOpen, setMenuOpen }) => {
  const handleClick = () => setMenuOpen((prev) => !prev);

  return (
    <>
      <span
        className={menuOpen ? "menu-toggle open" : "menu-toggle closed"}
        onClick={handleClick}
      >
        {!menuOpen && <MenuOutlined id="menu-icon-closed" />}
        {menuOpen && <CloseOutlined id="menu-icon-open" />}
      </span>
      <></>
      {menuOpen && (
        <div className="left-nav-container">
         
          <NavMenu
            focus={focus}
            handleFocus={handleFocus}
            admin={admin}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            className="left-nav-container-nav-menu"
          />

          <div className="about-container">
            <address className="contant-container">
              <span className="contact-header">General Info</span>
              <a
                href="mailto:info@drishticon.com"
                target="_blank"
                rel="noreferrer"
                className="contact-text"
              >
                info@drishticon.com
              </a>
              <a
                href="tel:15104024515"
                target="_blank"
                rel="noreferrer"
                className="contact-text phone"
              >
                US: +1 510.402.4515
              </a>
              <a
                href="tel:919819972099"
                target="_blank"
                rel="noreferrer"
                className="contact-text phone"
              >
                India: +91 981.997.2099
              </a>
            </address>
            <address className="contant-container">
              <span className="contact-header">Sales</span>
              <a
                href="mailto:sales@drishticon.com"
                target="_blank"
                rel="noreferrer"
                className="contact-text"
              >
                sales@drishticon.com
              </a>
            </address>
            <address className="contant-container">
              <span className="contact-header">Careers</span>
              <a
                href="mailto:careers@drishticon.com"
                target="_blank"
                rel="noreferrer"
                className="contact-text"
              >
                careers@drishticon.com
              </a>
            </address>
            <a
              href="https://drishticon.com/#/about"
              target="_blank"
              rel="noreferrer"
              className="about-menu-link"
            >
              About Us
            </a>
            <Link
              to="/faqs"
              className="faq-menu-link"
              onClick={() => handleFocus("")}
            >
              FAQs
            </Link>
            <div className="social-icon-container">
              <a
                href="https://www.linkedin.com/company/drishticon/mycompany/verification/"
                target="_blank"
                rel="noreferrer"
                className="social-icon-menu"
              >
                <LinkedinOutlined />
              </a>
              <a
                href="https://www.facebook.com/pages/category/Consulting-agency/Drishticon-Inc-405718472843300/"
                target="_blank"
                rel="noreferrer"
                className="social-icon-menu"
              >
                <FacebookOutlined />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftNav;
