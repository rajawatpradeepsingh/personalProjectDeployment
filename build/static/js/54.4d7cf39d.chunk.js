(this.webpackJsonpreactfrontend=this.webpackJsonpreactfrontend||[]).push([[54],{1031:function(e,t,a){},1101:function(e,t,a){"use strict";a.r(t);var s=a(0),r=a(27),n=a(219),o=a(152),c=a(75),l=a(218),i=a(306),d=a(137),u=a(66),b=a(16),m=a.n(b),j=a(25),g=a(13),h=a(1064),O=(a(1031),a(1));var p=e=>Object(O.jsxs)("div",{className:"cascader-container",children:[Object(O.jsxs)("label",{htmlFor:"cascader",className:"cascader-label",children:[e.required&&!e.disabled&&Object(O.jsx)("span",{className:"required",children:"*"})," ",e.label]}),Object(O.jsx)(h.a,{placeholder:e.placeholder||"Select",value:e.value,options:e.options,onChange:e.onChange,changeOnSelect:!0,bordered:!1}),Object(O.jsx)("span",{className:"cascader-border"})]}),S=a(420),v=a(106),f=a(96),x=a(11),D=a.n(x),N=a(308),A=a.n(N);t.default=e=>{const t={resourceManager:"",startDate:"",endDate:""},a=Object(c.useHistory)(),[b,h]=Object(s.useState)(t),[x,N]=Object(s.useState)([]),[E,L]=Object(s.useState)({}),[R,C]=Object(s.useState)(""),[M,I]=Object(s.useState)([]),[w,y]=Object(s.useState)([]),[k,U]=Object(s.useState)(!0),[q,F]=Object(s.useState)(!0),[J,T]=Object(s.useState)(!1),[Y,G]=Object(s.useState)(!1),[H,P]=Object(s.useState)(""),[V,W]=Object(s.useState)(null);Object(s.useEffect)((()=>{R&&Object.keys(E).length>=3&&C("")}),[R,E]),Object(s.useEffect)((()=>{const e=A()("1d"),t=new Date(+new Date(b.startDate)+e);W(D()(t).format("YYYY-MM-DD"))}),[b.startDate]);Object(s.useEffect)((()=>{(()=>{let e=JSON.parse(sessionStorage.getItem("headers"));m.a.get(j.a.serverURL+"/resourcemanager?dropdownFilter=true&role=SALESMANAGER",{headers:e}).then((e=>{const t=e.data;e.data&&I(t.map((e=>({text:"".concat(e.firstName," ").concat(e.lastName),label:"".concat(e.firstName," ").concat(e.lastName),value:e.resourceManagerId}))))})).catch((e=>{console.log(e),e.response&&401===e.response.status&&g.a.logout()}))})(),(()=>{let e=JSON.parse(sessionStorage.getItem("headers"));m.a.get(j.a.serverURL+"/resourcemanager?dropdownFilter=true&role=RECRUITER",{headers:e}).then((e=>{const t=e.data;e.data&&y(t.map((e=>({text:"".concat(e.firstName," ").concat(e.lastName),label:"".concat(e.firstName," ").concat(e.lastName),value:e.resourceManagerId}))))})).catch((e=>{console.log(e),e.response&&401===e.response.status&&g.a.logout()}))})()}),[]);const z=e=>{const{name:t,value:a}=e.target;if(h({...b,[t]:a}),""!==a)L({...E,[t]:a});else{const e={...E};delete e[t],L(e)}},B=()=>{G(!1)};return Object(O.jsxs)(n.a,{children:[Object(O.jsx)(o.a,{onActive:()=>{F(!0)},onIdle:()=>{F(!1)},onLogout:()=>{T(!0)}}),Object(O.jsx)(l.a,{breadcrumbs:Object(O.jsx)(i.a,{className:"header",crumbs:[{id:0,text:"Commission",onClick:()=>{a.push("/viewcommission")}},{id:1,text:"Add Commission",lastCrumb:!0}]})}),Object(O.jsxs)(d.a,{children:[Object(O.jsxs)(u.a,{formEnabled:!0,onSubmit:e=>{if(e.preventDefault(),Object.keys(E).length<3)return void C("Fill out required fields before submitting");C("");let a={resourceManager:{resourceManagerId:parseInt(b.resourceManager)},startDate:b.startDate,endDate:b.endDate};const s=JSON.parse(sessionStorage.getItem("headers"));k?m.a.post("".concat(j.a.serverURL,"/commission/bulk"),a,{headers:s}):m.a.post("".concat(j.a.serverURL,"/commission/one"),a,{headers:s}).then((e=>{201===e.status&&(G(!0),H(""))})).catch((e=>{e.response&&500===e.response.status&&(S.b.error({content:"Fill Out required fields before submitting",style:{marginTop:"8%"}}),P(e.res.data),G(!0))})),G(!0),h(t),L({}),N([])},children:[Object(O.jsx)(p,{name:"resourceManager",label:"Resource Manager",required:!0,value:x,onChange:e=>{let t="resourceManager";if(!e||1===e.length&&"ALL"!==e[0]){const e={...E};return delete e[t],void L(e)}"ALL"===e[0]?(U(!0),h({...b,[t]:null})):2===e.length&&(U(!1),h({...b,[t]:e[1]})),L({...E,[t]:e}),N(e)},options:[{id:"RECRUITER",value:"RECRUITER",label:"Recruiter",children:w},{id:"SALESMANAGER",value:"SALESMANAGER",label:"Sales Manager",children:M},{id:"ALL",value:"ALL",label:"ALL"}]}),Object(O.jsx)(r.a,{label:"Start Date",type:"date",name:"startDate",value:null===b||void 0===b?void 0:b.startDate,onChange:z,required:!0}),Object(O.jsx)(r.a,{label:"End Date",type:"date",name:"endDate",value:null===b||void 0===b?void 0:b.endDate,onChange:z,required:!0,min:V})]}),Object(O.jsx)(f.a,{openModal:Y,type:H?"Warning":"Success",confirmValue:"Ok",handleConfirmClose:B,closePopUp:B,message:{title:H?"Error":"Commission Added Successfully",details:H?"An error ocurred while trying to save: ".concat(H):"To view Commission go to "},link:H?"":Object(O.jsx)(v.b,{to:"/viewcommission",children:"Commission"})})]})]})}}}]);