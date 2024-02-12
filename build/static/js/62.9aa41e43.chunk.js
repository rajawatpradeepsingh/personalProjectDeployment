(this.webpackJsonpreactfrontend=this.webpackJsonpreactfrontend||[]).push([[62],{1082:function(e,t,a){"use strict";a.r(t);var c=a(0),n=a(75),s=a(28),l=a(16),r=a.n(l),o=a(25),i=a(50),d=a(13),u=a(91),b=a(219),m=a(218),j=a(306),g=a(307),h=a(137),O=a(66),v=a(22),f=a(96),p=a(420),x=a(152),C=a(331),N=a(836),y=a(781),S=a(685),k=a(783),w=a(786),E=a(86),M=a(95),I=a(1);var R=()=>{const{editEnabled:e}=Object(s.c)((e=>e.manager)),{formDisabled:t}=Object(s.c)((e=>e.manager)),{basicInfo:a}=Object(s.c)((e=>e.manager)),[n,l]=Object(c.useState)({}),r=Object(s.b)(),o=Object(c.useCallback)((e=>r(Object(C.b)(e))),[r]);return Object(I.jsx)(c.Fragment,{children:e?Object(I.jsxs)(I.Fragment,{children:[Object(I.jsx)("h3",{className:"disabled-form-section-header",children:" Comments"}),Object(I.jsx)("div",{className:"long-form-subsection",children:Object(I.jsx)(E.a,{type:"text",label:"Comments",name:"comments",value:(null===a||void 0===a?void 0:a.comments)||"",onChange:e=>function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;const c=e.target.max?+e.target.max:null,s=Object(M.a)(t,e.target.value,c),r=""===e.target.value;if(o({...a,[e.target.name]:e.target.value}),s){if(s||r){let t={...n};delete t[e.target.name],l(t)}}else l({...n,[e.target.name]:"Invalid characters"})}(e),maxLength:"3000",charCount:"".concat(null!==a&&void 0!==a&&a.comments?3e3-(null===a||void 0===a?void 0:a.comments.length):3e3," of 3000"),disabled:t})})]}):Object(I.jsxs)(I.Fragment,{children:[Object(I.jsx)("h3",{className:"disabled-form-section-header",children:" Comments"}),Object(I.jsx)("div",{className:"disabled-form-section-content wide",children:Object(I.jsxs)("span",{className:"disabled-form-text wide",children:[Object(I.jsx)("span",{className:"disabled-form-bold-text",children:"Comments:"}),null!==a&&void 0!==a&&a.comments?a.comments.split("\n").map(((e,t)=>Object(I.jsx)("p",{children:e},t))):null]})})]})})},D=a(27),L=a(35),A=a(220);var F=()=>{const[e]=Object(c.useState)(!1),{inputErr:t,requiredErr:a}=Object(s.c)((e=>e.manager)),{editEnabled:n}=Object(s.c)((e=>e.manager)),l=e=>r(Object(C.b)(e)),r=Object(s.b)(),o=e=>r(Object(C.e)(e)),{basicInfo:i}=Object(s.c)((e=>e.manager)),d=(Object(c.useCallback)((e=>r(Object(C.f)(e))),[r]),function(e){let c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;var n;n=!0,r(Object(C.c)(n));const s=Object(M.a)(c,e.target.value);let d;""!==e.target.value&&(d={...a},delete d[e.target.name],(e=>{r(Object(C.g)(e))})(d)),l({...i,[e.target.name]:e.target.value}),s?(d={...t},delete d[e.target.name],o(d)):o({...t,[e.target.name]:"Invalid format or characters"})});return Object(I.jsxs)(I.Fragment,{children:[Object(I.jsx)("h3",{className:"disabled-form-section-header",children:" Basic Information"}),n?Object(I.jsxs)(I.Fragment,{children:[Object(I.jsx)(D.a,{type:"text",label:"First Name",name:"firstName",value:(null===i||void 0===i?void 0:i.firstName)||"",onChange:e=>d(e,"validateName"),maxLength:"40",required:!0,disabled:!n,errMssg:t.firstName}),Object(I.jsx)(D.a,{type:"text",label:"Last Name",name:"lastName",value:(null===i||void 0===i?void 0:i.lastName)||"",onChange:e=>d(e,"validateName"),maxLength:"40",disabled:!n,errMssg:t.lastName})]}):Object(I.jsx)(D.a,{label:"Name",readOnly:!0,value:"".concat(null===i||void 0===i?void 0:i.firstName," ").concat(null===i||void 0===i?void 0:i.lastName)}),Object(I.jsx)(D.a,{type:"email",label:"Email",name:"email",value:(null===i||void 0===i?void 0:i.email)||"",onChange:e=>d(e,"validateEmail"),required:!0,disabled:!n,errMssg:t.email}),Object(I.jsx)(A.a,{label:"Phone Num.",phoneNumber:(null===i||void 0===i?void 0:i.phoneNumber)||"",handleChange:e=>{l({...i,phoneNumber:e})},disabled:!n,setError:e=>{if(e)Object(C.e)({...t,phoneNumber:!0});else{let e={...t};delete e.phoneNumber,Object(C.e)(e)}}}),Object(I.jsx)(L.a,{name:"state",label:"Status",type:"state",id:"state",onChange:e=>d(e),value:null===i||void 0===i?void 0:i.state,options:[{id:1,value:"ACTIVE",name:"Active"},{id:2,value:"INACTIVE",name:"Inactive"}],disabled:!n}),Object(I.jsx)(L.a,{name:"role",label:"Role",type:"role",id:"role",onChange:e=>d(e),value:null===i||void 0===i?void 0:i.role,options:[{id:1,value:"RECRUITER",name:"Recruiter"},{id:2,value:"SALESMANAGER",name:"Sales Manager"}],disabled:!n})]})},V=a(310);t.default=()=>{var e,t;const a=Object(s.b)(),l=Object(n.useHistory)(),E=Object(n.useParams)(),M=Object(c.useMemo)((()=>d.a.getHeaders()),[]),D=Object(c.useMemo)((()=>d.a.getUserInfo()),[]),L=Object(c.useMemo)((()=>"".concat(o.a.serverURL,"/resourcemanager")),[]),[A]=Object(c.useState)({}),[U,Y]=Object(c.useState)(!1),[q,T]=Object(c.useState)({}),{basicInfo:z,manager:K}=Object(s.c)((e=>e.manager)),{changesMade:P}=Object(s.c)((e=>e.manager)),{requiredErr:X}=Object(s.c)((e=>e.manager)),{editEnabled:H,showManagerComments:J}=Object(s.c)((e=>e.manager)),[B,G]=Object(c.useState)(!0),[Q,W]=Object(c.useState)("1"),[Z,$]=Object(c.useState)(!1),[_,ee]=Object(c.useState)(!0),[te,ae]=Object(c.useState)(!1),[ce,ne]=Object(c.useState)(!1),[se,le]=Object(c.useState)(D.roles[0]);console.log(D),Object(c.useEffect)((()=>{d.a.hasAdminRole()&&ne(!0)}),[]);const re=Object(c.useCallback)((()=>{a(Object(u.b)(!1)),d.a.logout()}),[a]),oe=Object(c.useCallback)((e=>{a(Object(C.d)(e)),W("1")}),[a]),ie=()=>{$(!1),T({})},de=()=>{oe(!1)},ue=Object(c.useCallback)((e=>a(Object(C.f)(e))),[a]),be=Object(c.useCallback)((e=>a(Object(C.b)(e))),[a]);Object(c.useEffect)((()=>{J&&W("2")}),[J]);const me=Object(c.useCallback)((e=>a(Object(C.g)(e))),[a]),je=async e=>{e.preventDefault();const t="isLoading",a={...z};Object(N.f)(M,a,z.resourceManagerId).then((e=>{200===e.statusCode?(de(),G(!0),be(e.data),p.b.success({content:"manager updated!",messgKey:t,duration:5,style:{marginTop:"5%"}})):p.b.error({content:"An error occurred while saving changes (".concat(e.statusCode,")"),messgKey:t,duration:10})}))},ge=Object(c.useCallback)((async()=>{try{const e=null===E||void 0===E?void 0:E.resourceManagerId;if(!e)return;const t=await Object(N.c)(M,e);200===t.statusCode?be(t.managerData):401===t.statusCode&&re()}catch(e){console.log(e)}}),[null===E||void 0===E?void 0:E.resourceManagerId,M,be,re]);Object(c.useEffect)((()=>{ge()}),[ge]);const he=()=>{ue(K),oe(!1),ge()};return Object(I.jsxs)(b.a,{children:[Object(I.jsx)(m.a,{breadcrumbs:Object(I.jsx)(j.a,{className:"header",crumbs:[{id:0,text:"Manager",onClick:()=>(de(),oe(!1),void l.push("/viewresourceManager"))},{id:1,text:"".concat(null===z||void 0===z?void 0:z.firstName," ").concat(null===z||void 0===z?void 0:z.lastName),lastCrumb:!0}]}),actions:Object(I.jsxs)(g.a,{children:[ce||se.managerPermission?Object(I.jsx)(v.a,{type:"button",handleClick:()=>{H?he():(oe(!H),G(!B))},className:"btn icon marginX",title:"Edit",children:Object(I.jsx)(y.a,{})}):"",Object(I.jsx)(v.a,{type:"button",handleClick:()=>console.log("put onClick handler, but not an object"),disabled:!0,className:"btn icon marginX",title:"Share",children:Object(I.jsx)(S.a,{})}),Object(I.jsx)(v.a,{type:"button",handleClick:()=>console.log("put onClick handler, but not an object"),disabled:!0,className:"btn icon marginX",title:"Export Report",children:Object(I.jsx)(k.a,{})})]})}),Object(I.jsx)(x.a,{onActive:()=>{ee(!0)},onIdle:()=>{ee(!1)},onLogout:()=>{ae(!0)}}),Object(I.jsxs)("div",{className:"multi-content-container",children:[U&&Object(I.jsx)("span",{className:"fixed-error-banner",children:"Resolve errors before submitting: ".concat(Object.keys(A).concat(Object.keys(X)).join(", "))}),Object(I.jsx)(h.a,{className:"x-small",children:Object(I.jsx)(O.a,{className:"column small",onSubmit:e=>{if(e.preventDefault(),Object.keys(A).length>0||Object.keys(X).length>0)Y(!0);else{Y(!1);const t={};r.a.post("".concat(L,"/checks/").concat(z.resourceManagerId),t,{headers:M}).then((t=>{200===t.status&&je(e)})).catch((e=>{i.d(e),$(!0),T({title:"Error",details:"".concat(e.response.data),confirmValue:"Close"})}))}},cancel:()=>{P?($(!0),T({title:"Confirm Discard Changes",details:"All changes will be discarded, proceed?",confirmValue:"Confirm",cancelValue:"Cancel"})):oe(!1)},formEnabled:H,children:Object(I.jsx)(F,{logout:re,handleRequiredCheck:e=>{if(""===e.target.value)me({...X,[e.target.name]:"Field is required"});else{let t={...X};delete t[e.target.name],me(t)}}})})}),Object(I.jsx)(h.a,{className:"medium",children:Object(I.jsx)(V.a,{activeKey:Q,setActiveKey:e=>{W(e),a(Object(C.h)(!1))},items:[{key:"1",label:Object(I.jsxs)("span",{children:[Object(I.jsx)(w.a,{})," Comments"]}),children:Object(I.jsx)(R,{})}]})})]}),Object(I.jsx)(f.a,{openModal:Z,type:(null===(e=q.title)||void 0===e?void 0:e.toLowerCase())||"",closePopUp:ie,handleConfirmClose:null!==(t=q.title)&&void 0!==t&&t.includes("Confirm")?he:ie,confirmValue:q.confirmValue,cancelValue:q.cancelValue,message:q})]})}},836:function(e,t,a){"use strict";a.d(t,"c",(function(){return u})),a.d(t,"f",(function(){return b})),a.d(t,"e",(function(){return m})),a.d(t,"b",(function(){return j})),a.d(t,"a",(function(){return g})),a.d(t,"d",(function(){return h}));var c=a(25),n=a(13),s=a(16),l=a.n(s),r=a(11),o=a.n(r);const i="".concat(c.a.serverURL,"/resourcemanager"),d=e=>{var t,a;if(!e.response)throw new Error;return 401===(null===(t=e.response)||void 0===t?void 0:t.status)&&n.a.logout(),{status:null===(a=e.response)||void 0===a?void 0:a.status,err:e}},u=async(e,t)=>{try{const a=await l.a.get("".concat(c.a.serverURL,"/resourcemanager/").concat(t),{headers:e});let n={};return 200===a.status&&(n.managerData=a.data,n.Details=a.data,n.statusCode=a.status),n}catch(n){var a;return console.log(n),{statusCode:null===(a=n.response)||void 0===a?void 0:a.status}}},b=async(e,t,a)=>{try{const n=await l.a.patch("".concat(c.a.serverURL,"/resourcemanager/").concat(a),t,{headers:e});if(200===n.status)return{statusCode:200,data:n.data};if(401===n.status)return{statusCode:401}}catch(n){return console.log(n),{statusCode:n.response.status}}},m=async function(e,t,a){let c=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,n=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null;try{const s=c||n?c?"?dropdownFilter=true&pageNo=".concat(t-1,"&pageSize=").concat(a,"&").concat(c):"?dropdownFilter=true&pageNo=".concat(t-1,"&pageSize=").concat(a):"?pageNo=".concat(t-1,"&pageSize=").concat(a),r=n?await l.a.put("".concat(i).concat(s),n,{headers:e}):await l.a.get("".concat(i).concat(s),{headers:e});if(200===r.status)return{data:r.data,totalItems:r.headers["total-elements"],status:r.status}}catch(s){return d(s)}},j=async(e,t,a)=>{try{const n=await l.a.get("".concat(c.a.serverURL,"/resourcemanager?archives=true&pageNo=").concat(t-1,"&pageSize=").concat(a),{headers:e});if(n)return{data:n.data.map((e=>({id:e.resourceManagerId,cellOne:"".concat(e.firstName," ").concat(e.lastName),cellTwo:e.role,cellThree:e.email,cellFour:e.phoneNumber,cellFive:"".concat(o()(null===e||void 0===e?void 0:e.startDate).format("MM.DD.YYYY")),cellSix:"".concat(o()(null===e||void 0===e?void 0:e.endDate).format("MM.DD.YYYY")),cellSeven:e.state}))),totalItems:n.headers["total-elements"]}}catch(n){console.log(n)}},g=async(e,t)=>{try{const a=await l.a.all(t.map((t=>l.a.delete("".concat(i,"/").concat(t),{headers:e}))));if(a.length)return a[0].status}catch(a){return d(a)}},h=async function(e){let t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";const a="".concat(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"").concat(t);return await O(e,a)},O=async function(e,t){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";try{const c=await l.a.get("".concat(i).concat(t).concat(a),{headers:e});let n={};return 200===c.status&&(n.tableData=(e=>e.map((e=>({...e}))))(c.data),n.totalItems=c.headers["total-elements"],n.statusCode=c.status),n}catch(s){var c;return 401===s.response.status&&n.a.logout(),{statusCode:null===(c=s.response)||void 0===c?void 0:c.status}}}}}]);