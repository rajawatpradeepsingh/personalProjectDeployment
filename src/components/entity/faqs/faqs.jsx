import React from "react";
import faqData from "./faqData";
import "./faqs.scss";
import { Collapse } from "antd";
import Content from "../../../components/container/content-container/content-container.component";
import { setIsAuth } from "../../../Redux/appSlice";
import { useDispatch, useSelector } from "react-redux";

const Faqs = () => {
  const { navMenuOpen } = useSelector((state) => state.nav);
  const { Panel } = Collapse;

  const isAuth = sessionStorage.getItem("loggedIn");
  useDispatch(setIsAuth(isAuth));

  return (
    <div
      className={navMenuOpen ? "page-container" : "page-container full-width"}
    >
      <div className="page-actions-container">
        <h1 className="page-header">FAQs</h1>
      </div>
      <Content>
        <div className="faq-qa">
          {faqData.map((item) => {
            return (
              <Collapse accordion
                className="faq-section"
                key={item.id}
              >
                <Panel key={item.id} header={item.question}>
                  {item.answer && typeof item.answer === "string" && <p>{item.answer}</p>}
                  {item?.answer?.text && <p>{item?.answer?.text}</p>}
                  {item?.answer?.list && (
                    <ol className="answer-list">
                      {item?.answer?.list.map(element => <li key={element}>{element}</li>)}
                    </ol>)}
                  {item?.answer?.textTwo && <p>{item?.answer?.textTwo}</p>}
                  {item?.answer?.listTwo && (
                    <ol className="answer-list">
                      {item?.answer?.listTwo.map(element => <li key={element}>{element}</li>)}
                    </ol>)}
                  {item?.answer?.tableData && (
                    <table className="faq-table">
                      <thead>
                        <tr className="header-row">
                          {item.answer.tableData.headers.map((header) => (
                            <th key={header}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {item.answer.tableData.cellData.map((data) => (
                          <tr className="body-row" key={Math.random() * 5}>
                            <td className="first-col">{data.colOne}</td>
                            <td>{data.colTwo}</td>
                            {data.colThree !== undefined ? (
                              <td>{data.colThree}</td>
                            ) : null}
                            {data.colFour !== undefined ? (
                              <td>{data.colFour}</td>
                            ) : null}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </Panel>
              </Collapse>
            );
          })}
        </div>
      </Content>
    </div>
  );
};

export default Faqs;
