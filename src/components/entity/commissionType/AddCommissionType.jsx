import React, { Component, Fragment } from "react";
import axios from "axios";
import { config } from "../../../config";
import { PageContainer } from "../../container/page-container/PageContainer";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import { PageHeader } from "../../container/page-header/PageHeader";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import Form from "../../common/form/form.component";
import Content from "../../container/content-container/content-container.component";
import Input from "../../common/input/inputs.component";
import { Link } from "react-router-dom";
import PopUp from "../../modal/popup/popup.component";
import { runValidation } from "../../../utils/validation";
import SingleSelect from "../../common/select/selects.component";
import TextBlock from "../../common/textareas/textareas.component";
import "./commissionType.scss"
import auth from "../../../utils/AuthService";
export default class AddCommissionType extends Component {
    constructor(props) {
        super(props);
    
        this.state = { ...this.initialState };
        this.commissionTypeChange = this.commissionTypeChange.bind(this);
        this.submitCommissionType = this.submitCommissionType.bind(this);
        this.docRef = React.createRef(null);
      };
    
      initialState = {
        name: "",
        commRate: "",
        marginFloor:"",
        marginCeiling:"",
        isDeleted:false,
        inputErr: "",
        submitError: "",
        comments:"",
        isValid:true,

      };
    
      submitCommissionType = (event) => {
        event.preventDefault();
    
        const payload = {
          name: this.state.name,
          commRate: this.state.commRate,
          comments:this.state.comments,
          marginFloor:this.state.marginFloor,
          marginCeiling:this.state.marginCeiling,
          isDeleted:false
    
        };
    
        const headers = JSON.parse(sessionStorage.getItem("headers"));
        axios
          .post(`${config.serverURL}/commissionType`, payload, { headers })
          .then((response) => {
            if (response.status === 201) {
              this.resetCT();
              this.setState({ openPopUp: true });
            }
          })
          .catch((error) => {
            this.setState({
              submitError: error.response.data,
              openPopUp: true,
            });
            if (error.response && error.response.status === 401) {
              auth.logout();

            }
            
          });
      };
      resetCT = () => {
        this.setState(() => this.initialState);
      };
  closeForm = () => {
    this.props.history.push("/viewcommissiontype");
  };

  commissionTypeChange = (e, validProc = null) => {
    const { value, max, name } = e.target;
    const isDeleted = value === "";
    const isValid = runValidation(validProc, value, max);
    this.setState({ [name]: value });
    if (!isValid) {
      this.setState({
        inputErr: {
          ...this.state.inputErr,
          [name]: `Invalid format or characters`,
        },
      });
    } else {
      let temp = { ...this.state.inputErr };
      delete temp[name];
      this.setState({ inputErr: temp });
    }

   
  };

  commissionChange = (e) => {
    const { value } = e.target;
        this.setState({ marginCeiling: value });
    this.validateFields(this.state.marginFloor, value);
    
  };
  validateFields = (a, b) => {
    const isValidInput = a !== '' && b !== '' && parseFloat(a) < parseFloat(b);
    this.setState({ isValid: isValidInput });
  };
  togglePopUp = () => {
    this.setState({ openPopUp: !this.state.openPopUp });
  };
    render() {
        return (
            <PageContainer>
            <IdleTimeOutHandler 
              
       onActive={()=>{ this.setState({ setIsActive: true })}}
       onIdle={()=>{ this.setState({ setIsActive: false })}}
       onLogout={()=>{ this.setState({ setLogout: true })}}
       />
        <PageHeader
          breadcrumbs={
            <Breadcrumbs
              className="header"
              crumbs={[
                { id: 0, text: "Commission Type", onClick: () => this.closeForm() },
                { id: 1, text: "Add Commission Type", lastCrumb: true },
              ]}
            />

          }
        />
            <Content>
         
        <Form formEnabled={true} onSubmit={this.submitCommissionType} cancel={this.resetCT}>
            <Fragment>
            <SingleSelect
                    type="text"
                    label="Commision Type"
                    name="name"
                    value={this.state.name}
                    onChange={(e) => this.commissionTypeChange(e)}
                    options={[
                       

                        {id: 1,  value: "Percentage", name: "Percentage"},

                    ]} 
                    required
                  />
                   <Input
                    type="text"
                    label="Commission Rate"
                    name="commRate"
                    className="align"
                    value={this.state.commRate}
                    onChange={(e) => this.commissionTypeChange(e,"validateNum")}
                    errMssg={this.state.inputErr["commRate"]}
                    required
                  />
               
                    <Input
                    type="number"
                    label="Margin Floor ($)"
                    className="margin"
                    name="marginFloor"
                    value={this.state.marginFloor}
                    onChange={(e) => this.commissionTypeChange(e,"validateNum")}
                    errMssg={this.state.inputErr["marginFloor"]}
                    required
                  />
                 <div className="floor">-</div>
                   <Input
                    type="number"
                    label="Margin Ceiling ($)"
                    className="margin"
                    name="marginCeiling"
                    value={this.state.marginCeiling}
                    onChange={(e) => this.commissionChange(e,"validateNum")}
                    required
                  />
                   {!this.state.isValid && (
          <p style={{ color: 'red',paddingLeft:"566px",fontSize:"9px" }}> * Please make sure margin Floor is less than margin Ceiling.</p>
        )}
                   <TextBlock
                  label="Comments"
                  name="comments"
                  value={this.state.comments}
                  onChange={(e) => this.commissionTypeChange(e)}
                  charCount={`${this.state.comments ? 3000 - this.state.comments.length : 3000
                    } of 3000`}
                  maxLength="3000"
                />
            </Fragment>
        </Form>
        <PopUp
            openModal={this.state.openPopUp}
            closePopUp={this.togglePopUp}
            handleConfirmClose={this.togglePopUp}
            type={this.state.submitError ? "Warning" : "Success"}
            message={{
              title: this.state.submitError
                ? "Error"
                : "Commission Type Added Succesfully",
              details: this.state.submitError
                ? `Error while saving record ${this.state.submitError}`
                : "To view Commission Type go to ",
            }}
            link={
              this.state.submitError ? (
                ""
              ) : (
                <Link to="viewcommissiontype">Commission Type</Link>
              )
            }
          />
     
        </Content>
       </PageContainer>
        )
        }

}