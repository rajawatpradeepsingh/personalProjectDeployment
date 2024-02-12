import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom/cjs/react-router-dom.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import TextBlock from "../../common/textareas/textareas.component";
import { config } from "../../../config.js";
import { runValidation } from "../../../utils/validation.js";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component.jsx";
import auth from "../../../utils/AuthService";
import AuthService from "../../../utils/AuthService.js";
import{getUserById, updateUser} from "../../../API/users/user-apis";
import Input from "../../common/input/inputs.component.jsx";
import SingleSelect from "../../common/select/selects.component.jsx";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import PopUp from "../../modal/popup/popup.component.jsx";
import { InputPhone } from "../../common/input/input-phone/input-phone.component";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import "antd/dist/antd.css";
import { ConsoleLogEntry } from "selenium-webdriver/bidi/logEntries";

 class AddManagerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    ...this.initialState
    };
    this.managerChange = this.managerChange.bind(this);
    this.submitManager = this.submitManager.bind(this);
    // this.handleNext = this.handleNext.bind(this);
    // this.handleReset = this.handleReset.bind(this);
    this.docRef = React.createRef(null);
   
  };

  initialState = {
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    phoneNumber: "",
    state:"",
    startDate: "",
    endDate: "",
    inputErr: "",
    comments:"",
    isDeleted:false,
    managerRole:"",
    headers:"",
 
  };
  showModal = () => {
    this.setState({ show: !this.state.show });
  };
 

  togglePopUp = () => {
    this.setState({ openPopUp: !this.state.openPopUp });
  };


  resetManager = () => {
    this.setState(() => this.initialState);
  };

  handlePhoneChange = (value) => {
    this.setState({ phoneNumber: value });
  };

  closePopUp = () => {
    this.setState({ show: false });
  };

  submitManager(event) {
    event.preventDefault();

    // if (this.state.jobDescriptionErrFlag) return;
//     if (!this.state.managerRole){
//       alert("Access Denied");
//       return;

// }
// else
{


    const manager = {
      firstName:this.state.firstName,
      lastName:this.state.lastName,
      role:this.state.role,
     email:this.state.email,
     phoneNumber: this.state.phoneNumber,
      state: "ACTIVE",
      startDate:this.state.startDate,

      endDate:this.state.endDate,
      comments:this.state.comments,
      isDeleted:false
    };
  
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .post(config.serverURL + "/resourcemanager", manager, { headers })
      .then((response) => {
        console.log(manager)
        if (response.data != null) {
          this.resetManager();
          this.setState({
            
            show: true,
            message: "To view manager go to ",
            status: "Success",
          });
        }
      })
      .catch((err) => {
        this.setState({
          show: true,
          message: err.response.data,
          status: "Error in adding",
        });
        if
        (err.response && err.response.status === 401) {
          AuthService.logout();
        }
      });
  };
}

  managerChange = (e, validProc = null) => {
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

    if (
      this.state.basicRequiredPercent !== 100 
    ) {
      const pageName = ["firstName"].includes(name)
        
      if (pageName)
        this.checkRequiredFields(name, !isDeleted ? true : false, pageName);
    }
  };

  checkRequiredFields = (name, bool, section) => {
    switch (section) {
      case "basic":
        this.setState({
          basicRequiredFields: {
            ...this.state.basicRequiredFields,
            [name]: bool,
          },
        });
        break;
      
    }
  };
//    getRoles = (headers) => {
//     axios
//       .get(config.serverURL + "/roles?dropdownFilter=true", {
//         headers,
//       })
//       .then((res) => {
//         const users = res.data;
//         console.log(users)
       
//       })
//       .catch((error) => {
        
//       });
  
// };

   
   
getUsers =  async() => {
  try {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    const id = JSON.parse(sessionStorage.getItem("userInfo"))
    console.log(id.id)
    const response =  await getUserById(headers, id.id);
    let mrole = response.userdata.roles[0].manager
    console.log(mrole)
    this.setState({
      
      managerRole:mrole
     
    })
    console.log(this.managerRole)
    console.log(response)

  } catch (error) {
    console.log(error);
  }
};





//   componentDidMount() {
//     this.setState({ headers: auth.getHeaders() });
//     this.getUsers()
   
//     // this.getRoles()
//     // this.setState({ managerRole: AuthService.hasBDManagerRole() });
//     // console.log(AuthService.hasBDManagerRole() )
// }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.state.startDate !== prevState.startDate ||
        this.state.endDate !== prevState.endDate) &&
      this.state.endDate
    ) {
      if (this.state.startDate >= this.state.endDate) {
        this.setState({
          inputErr: {
            ...this.state.inputErr,
            endDate: "End date can't be before start date",
          },
        });
      } else {
        let temp = { ...this.state.inputErr };
        delete temp["endDate"];
        this.setState({ inputErr: temp });
      }
    }
  }
  


  closeForm = () => {
    this.props.history.push("/viewresourcemanager");
  };

  render() {

    return (
     
        
  <PageContainer>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Manager", onClick: () => this.closeForm() },
              { id: 1, text: "Add Manager", lastCrumb: true },
            ]}
          />
        }
      />
  
     
        <Content>
          <Form
            onSubmit={this.submitManager}
            cancel={this.resetManager}
            formEnabled={true}
          >
             <Input
                    type="text"
                    label="First Name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={(e) => this.managerChange(e, "validateName")}
                    maxLength="20"
                    errMssg={this.state.inputErr["firstName"]}
                    required
                  />
                   <Input
                    type="text"
                    label="Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={(e) => this.managerChange(e, "validateName")}
                    maxLength="20"
                    errMssg={this.state.inputErr["lastName"]}
                    required
                  />
                      
             <SingleSelect
              label="Role"
              name="role"
              value={this.state.role}
              onChange={this.managerChange}
              required
              options={[
                { id: 1, value: "RECRUITER", name: "Recruiter" },
                { id: 1, value: "SALESMANAGER", name: "Sales Manager" },
               
              ]}
            />

       <Input
            label="Email"
            type="email"
            name="email"
            onChange={(e) => this.managerChange(e, "validateEmail")}
            value={this.state.email}
            required
            errMssg={this.state.inputErr["email"]}
         />
                  <InputPhone
                    phoneNumber={this.state.phoneNumber}
                    handleChange={this.handlePhoneChange}
                    label="Phone Num."
                    setError={this.setPhoneNumError}
                    required
                  />
                    <Input
                 
                  label="Start Date"
                  name="startDate"
                  type="date"
                  max="2999-12-31"
                  onChange={(e) => this.managerChange(e)}
                  value={this.state.startDate}
                  errMssg={this.state.inputErr["startDate"]}
                  required
                />
                <Input
                  name="endDate"
                  label=" End Date"
                  type="date"
                  // min={minDate}
                  max="2999-12-31"
                  onChange={(e) => this.managerChange(e)}
                  value={this.state.endDate}
                  errMssg={this.state.inputErr["endDate"]}
                  required
                />
                 <TextBlock
            type="text"
            label="Comments"
            name="comments"
            value={this.state.comments || ""}
            onChange={(e) => this.managerChange(e)}
            maxLength="3000"
            charCount={`${
              this.state.comments ? 3000 - this.state.comments.length : 3000
            } of 3000`}
          />

          </Form>

          <PopUp
            openModal={this.state.show}
            closePopUp={this.closePopUp}
            type={this.state?.status}
            message={{
              title:
                this.state?.status === "Error"
                  ? "Error"
                  : "Manager Added Succesfully",
              details: this.state?.message,
            }}
            link={
              this.state?.status === "Error" ? (
                ""
              ) : (
                <Link to="/viewresourceManager">Managers</Link>
              )
            }
          />
        </Content>
      </PageContainer>
    );
  }
}
export default withRouter(AddManagerForm);
