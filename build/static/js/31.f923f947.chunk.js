(this.webpackJsonpreactfrontend=this.webpackJsonpreactfrontend||[]).push([[31],{1047:function(e,t,s){"use strict";s.r(t),s.d(t,"default",(function(){return O}));var i=s(0),a=s.n(i),n=s(95),r=s(137),d=s(66),c=s(802),l=s(27),o=s(35),h=s(306),u=s(96),b=s(138),m=s(220),p=s(16),g=s.n(p),C=s(25),v=s(106),j=s(219),x=s(218),y=(s(821),s(152)),F=s(1);class O extends i.Component{constructor(e){var t;super(e),t=this,this.initialState={clientName:"",phoneNumber:"",website:"",addressLine1:"",addressLine2:"",addressLine3:"",city:"",clientOptions:[],state:"",country:"",postalCode:"",vmsFees:0,adminFees:0,rebateFees:0,isDeleted:!1,inputErr:"",countryList:[],stateList:[],currentPage:"Basic Information",basicRequiredPercent:0,basicRequiredFields:{clientName:!1},currentPercent:0,openPopUp:!1,showModal:!1,addressRequiredPercent:0,addressRequiredFields:{country:!1,city:!1,addressLine1:!1,postalCode:!1},submitError:""},this.submitClient=e=>{e.preventDefault();const t={clientName:this.state.clientName,website:this.state.website,phoneNumber:this.state.phoneNumber,vmsFees:this.state.vmsFees,adminFees:this.state.adminFees,rebateFees:this.state.rebateFees,address:{city:this.state.city,country:this.state.country,state:this.state.state,postalCode:this.state.postalCode,addressLine1:this.state.addressLine1,addressLine2:this.state.addressLine2,addressLine3:this.state.addressLine3,countryCode:this.state.countryCode,stateCode:this.state.stateCode}},s=JSON.parse(sessionStorage.getItem("headers"));g.a.post("".concat(C.a.serverURL,"/clients"),t,{headers:s}).then((e=>{201===e.status&&(this.resetClient(),this.setState({openPopUp:!0}))})).catch((e=>{e.response&&409===e.response.status&&this.setState({submitError:e.response}),e.response&&e.response.status}))},this.clientChange=function(e){let s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;const{value:i,max:a,name:r}=e.target,d=""===i,c=Object(n.a)(s,i,a);if(t.setState({[r]:i}),c){let e={...t.state.inputErr};delete e[r],t.setState({inputErr:e})}else t.setState({inputErr:{...t.state.inputErr,[r]:"Invalid format or characters"}});if(100!==t.state.basicRequiredPercent||100!==t.state.addressRequiredPercent){const e=["clientName"].includes(r)?"basic":["country","city","addressLine1","postalCode"].includes(r)?"address":"";e&&t.checkRequiredFields(r,!d,e)}},this.setClientAddr=e=>{const t=this.state.clientOptions.filter((t=>+t.id===+e)).pop().address;this.setState({address:{city:(null===t||void 0===t?void 0:t.city)||"",country:(null===t||void 0===t?void 0:t.country)||"",postalCode:(null===t||void 0===t?void 0:t.postalCode)||"",state:(null===t||void 0===t?void 0:t.state)||""}})},this.showModal=()=>{this.setState({show:!this.state.show})},this.setCurrentPage=e=>{this.setState({currentPage:e.title})},this.countryChange=e=>{const t=e.target.selectedOptions[0].index,s=t?this.state.countryList[e.target.selectedOptions[0].index-1]:{};if(t){const e=b.a(s.code);this.setState({country:s.name,countryCode:s.code,stateList:b.d(s.code),stateCode:"",citiesList:e,city:"",disableCities:(null===e||void 0===e?void 0:e.length)>100}),this.checkRequiredFields("country",!0,"address")}else this.setState({stateList:[],citiesList:[],country:"",countryCode:"",state:"",stateCode:"",city:"",disableCities:!1,mandatory:{...this.state.mandatory,address:!1}}),this.checkRequiredFields("country",!1,"address")},this.stateChange=e=>{var t;const s=e.target.selectedOptions[0].index,i=s?this.state.stateList[e.target.selectedOptions[0].index-1]:{};let a=[];var n;s?(a=b.a(this.state.countryCode,i.code),this.setState({disableCities:(null===(n=a)||void 0===n?void 0:n.length)>100&&!(null!==i&&void 0!==i&&i.code)})):(a=b.a(this.state.countryCode),this.setState({disableCities:!1}));this.setState({[e.target.name]:i.name,stateCode:(null===i||void 0===i?void 0:i.code)||"",citiesList:a,city:"",disableCities:(null===(t=a)||void 0===t?void 0:t.length)>100&&!(null!==i&&void 0!==i&&i.code)}),s&&this.setState({disableCities:!1})},this.checkRequiredFields=(e,t,s)=>{switch(s){case"basic":this.setState({basicRequiredFields:{...this.state.basicRequiredFields,[e]:t}});break;case"taxes":default:break;case"address":this.setState({addressRequiredFields:{...this.state.addressRequiredFields,[e]:t}})}},this.togglePopUp=()=>{this.setState({openPopUp:!this.state.openPopUp})},this.cityChange=e=>{this.setState({[e.target.name]:e.target.value}),""!==e.target.value?this.checkRequiredFields("city",!0,"address"):this.checkRequiredFields("city",!1,"address")},this.handlePhoneChange=e=>{this.setState({phoneNumber:e})},this.resetClient=()=>{this.setState((()=>this.initialState))},this.closeForm=()=>{this.props.history.push("/viewclients")},this.state={...this.initialState},this.clientChange=this.clientChange.bind(this),this.submitClient=this.submitClient.bind(this),this.handleNext=this.handleNext.bind(this),this.handleReset=this.handleReset.bind(this),this.docRef=a.a.createRef(null)}async componentDidMount(){this.setState({countryList:b.c(),setIsActive:!0,setLogout:!1})}handleReset(){this.setState({next:null,status:""})}handleNext(e){e.preventDefault(),this.state.status&&!this.state.clientId&&this.setState({next:this.state.status})}componentDidUpdate(e,t){if(this.state.currentPage!==t.currentPage&&("Basic Information"===this.state.currentPage&&this.setState({currentPercent:this.state.basicRequiredPercent}),"Address"===this.state.currentPage&&this.setState({currentPercent:this.state.addressRequiredPercent})),this.state.basicRequiredFields!==t.basicRequiredFields){let e=0;for(let t in this.state.basicRequiredFields)this.state.basicRequiredFields[t]&&(e+=100);this.setState({currentPercent:e}),Object.values(this.state.basicRequiredFields).includes(!1)||this.setState({basicRequiredPercent:100})}if(this.state.addressRequiredFields!==t.addressRequiredFields){let e=0;for(let t in this.state.addressRequiredFields)this.state.addressRequiredFields[t]&&(e+=25);this.setState({currentPercent:e}),Object.values(this.state.addressRequiredFields).includes(!1)||this.setState({addressRequiredPercent:100})}}render(){var e;return Object(F.jsxs)(j.a,{children:[Object(F.jsx)(y.a,{onActive:()=>{this.setState({setIsActive:!0})},onIdle:()=>{this.setState({setIsActive:!1})},onLogout:()=>{this.setState({setLogout:!0})}}),Object(F.jsx)(x.a,{breadcrumbs:Object(F.jsx)(h.a,{className:"header",crumbs:[{id:0,text:"Client",onClick:()=>this.closeForm()},{id:1,text:"Add Client",lastCrumb:!0}]})}),Object(F.jsxs)(r.a,{children:[Object(F.jsx)(c.a,{steps:[{title:"Basic Information",hasRequiredFields:!0,subTitle:Object(F.jsx)("span",{style:{fontSize:"20px",marginBottom:"8px",color:"var(--secondary)"},children:"*"})},{title:"Taxes",hasRequiredFields:!0,subTitle:Object(F.jsx)("span",{style:{fontSize:"20px",marginBottom:"8px",color:"var(--secondary)"},children:"*"})},{title:"Address"}],canSubmit:this.state.basicRequiredPercent>=100&&this.state.addressRequiredPercent>=100,submit:this.submitClient,reset:this.resetClient,setCurrentPage:this.setCurrentPage,percent:this.state.currentPercent,error:Object.keys(this.state.inputErr).length,children:Object(F.jsxs)(d.a,{children:["Basic Information"===this.state.currentPage&&Object(F.jsxs)(i.Fragment,{children:[Object(F.jsx)(l.a,{type:"text",label:"Client Name",name:"clientName",value:this.state.clientName,onChange:e=>this.clientChange(e,"validateName"),maxLength:"20",errMssg:this.state.inputErr.clientName,required:!0}),Object(F.jsx)(l.a,{type:"text",label:"Website",name:"website",value:this.state.website,onChange:e=>this.clientChange(e,"validateURL"),maxLength:"20",errMssg:this.state.inputErr.website,required:!0}),Object(F.jsx)(m.a,{phoneNumber:this.state.phoneNumber,handleChange:this.handlePhoneChange,label:"Phone Num.",setError:this.setPhoneNumError})]}),this.state.currentPage.includes("Taxes")&&Object(F.jsxs)(i.Fragment,{children:[Object(F.jsx)(l.a,{name:"vmsFees",label:"VMS Fees %",type:"number",className:"NumAlign",onChange:e=>this.clientChange(e,"validatePrecentage"),value:Number(this.state.vmsFees).toFixed(2),errMssg:this.state.inputErr.vmsFees}),Object(F.jsx)(l.a,{name:"adminFees",label:"Admin Fees %",type:"number",className:"NumAlign",onChange:e=>this.clientChange(e,"validatePrecentage"),value:Number(this.state.adminFees).toFixed(2),errMssg:this.state.inputErr.adminFees}),Object(F.jsx)(l.a,{name:"rebateFees",label:"Rebate Fees %",type:"number",className:"NumAlign",onChange:e=>this.clientChange(e,"validatePrecentage"),value:Number(this.state.rebateFees).toFixed(2),errMssg:this.state.inputErr.rebateFees})]}),this.state.currentPage.includes("Address")&&Object(F.jsxs)(i.Fragment,{children:[Object(F.jsx)(o.a,{label:"Country",name:"country",value:this.state.country,onChange:this.countryChange,placeholder:"Select Country",options:this.state.countryList,required:!0}),Object(F.jsx)(o.a,{label:"State / Province",name:"state",id:"state",value:this.state.state,onChange:this.stateChange,options:this.state.stateList}),null!==(e=this.state.citiesList)&&void 0!==e&&e.length&&!this.state.disableCities?Object(F.jsx)(o.a,{label:"City",name:"city",value:this.state.city,onChange:this.cityChange,options:this.state.citiesList,required:!0,placeholder:this.state.disableCities?"Select State/Province first":"",disabled:this.state.disableCities}):Object(F.jsx)(l.a,{type:"text",label:"City",name:"city",value:this.state.city,placeholder:"Enter city",onChange:this.clientChange,maxLength:"40",required:!0,errMssg:this.state.inputErr.city}),Object(F.jsx)(l.a,{type:"text",label:"Address Line 1",name:"addressLine1",value:this.state.addressLine1,onChange:this.clientChange,maxLength:"200",required:!0}),Object(F.jsx)(l.a,{type:"text",label:"Address Line 2",name:"addressLine2",maxLength:"200",value:this.state.addressLine2,onChange:this.clientChange}),Object(F.jsx)(l.a,{type:"text",label:"Address Line 3",name:"addressLine3",maxLength:"200",value:this.state.addressLine3,onChange:this.clientChange}),Object(F.jsx)(l.a,{type:"text",label:"ZIP Code",name:"postalCode",value:this.state.postalCode,onChange:e=>this.clientChange(e,"validateZip"),required:!0,maxLength:"6",errMssg:this.state.inputErr.postalCode})]})]})}),Object(F.jsx)(u.a,{openModal:this.state.openPopUp,closePopUp:this.togglePopUp,handleConfirmClose:this.togglePopUp,type:this.state.submitError?"Warning":"Success",message:{title:this.state.submitError?"Error":"Client Added Succesfully",details:this.state.submitError?"Error while saving record ".concat(this.state.submitError):"To view client go to "},link:this.state.submitError?"":Object(F.jsx)(v.b,{to:"viewclients",children:"clients"})})]})]})}}},802:function(e,t,s){"use strict";var i=s(0),a=s(1066),n=s(22),r=s(1042),d=s(677),c=(s(803),s(158),s(1));t.a=e=>{var t,s,l;const[o,h]=Object(i.useState)(0),u=null===(t=e.steps)||void 0===t?void 0:t.map((e=>({title:e.title,subTitle:e.subTitle&&e.subTitle,icon:e.icon&&e.icon,status:e.status&&e.status})));Object(i.useEffect)((()=>{h(e.index||0)}),[e.index]);return Object(c.jsxs)("div",{className:"form-nav-container",children:[Object(c.jsx)(a.a,{className:"form-nav-steps",current:o,percent:e.percent,onChange:e.clickable?t=>{h(t),e.setCurrentPage(e.steps[t])}:null,type:e.type&&"navigation"===e.type?"navigation":"",items:u}),Object(c.jsx)("div",{className:"steps-content-container",children:e.children}),Object(c.jsxs)("div",{className:"steps-action",children:[!e.hideNavBtns&&Object(c.jsxs)(n.a,{type:"button",name:"form-nav-back-btn",className:"icon-btn icon-text no-border",handleClick:()=>(h(o-1),void e.setCurrentPage(e.steps[o-1])),disabled:0===o,children:[Object(c.jsx)(r.a,{}),"Previous"]}),e.canSubmit&&!e.hideFormBtns&&Object(c.jsx)(n.a,{type:"reset",name:"form-reset-btn",className:"btn main reset",handleClick:()=>{e.reset(),h(0)},children:"Cancel"}),e.canSubmit&&!e.hideFormBtns&&Object(c.jsx)(n.a,{type:"submit",name:"form-submit-btn",className:"btn main submit",disabled:e.submitError,handleClick:t=>(t=>{e.submit(t),h(0)})(t),children:"Submit"}),!e.hideFormBtns&&Object(c.jsxs)(n.a,{type:"button",name:"form-nav-next-btn",className:"icon-btn icon-text no-border",handleClick:()=>(h(o+1),void e.setCurrentPage(e.steps[o+1])),disabled:e.error||(null===(s=e.steps[o])||void 0===s?void 0:s.hasRequiredFields)&&e.percent<100||o>=(null===(l=e.steps)||void 0===l?void 0:l.length)-1,children:["Next",Object(c.jsx)(d.a,{})]})]})]})}},803:function(e,t,s){},821:function(e,t,s){}}]);