(this.webpackJsonpreactfrontend=this.webpackJsonpreactfrontend||[]).push([[39],{1055:function(e,t,a){"use strict";a.r(t);var s=a(0),n=a(75),c=a(28),o=a(11),i=a.n(o),r=a(13),l=a(16),d=a.n(l),u=a(25),b=a(159),m=a(63),j=a(222),v=a(95),h=a(324),y=a(137),O=a(66),g=a(27),p=a(853),C=a(220),f=a(35),x=a(112),N=a(386),w=a(306),S=a(22),P=a(774),k=a(762),q=a(781),E=a(219),I=a(218),_=a(309),L=a(307),A=a(420),M=(a(158),a(152)),D=a(1);t.default=()=>{var e,t,a,o,l,F,R;const U=Object(n.useHistory)(),B=Object(c.b)(),H=Object(n.useParams)(),[J]=Object(s.useState)(r.a.getHeaders()),[Y,Z]=Object(s.useState)({}),[T,W]=Object(s.useState)(!0),[X,z]=Object(s.useState)([]),[G,K]=Object(s.useState)([]),[Q,V]=Object(s.useState)({}),[$,ee]=Object(s.useState)(""),[te,ae]=Object(s.useState)([]),[se,ne]=Object(s.useState)(""),[ce,oe]=Object(s.useState)(i()(new Date).month()+1),[ie,re]=Object(s.useState)(i()(new Date).year()),[le,de]=Object(s.useState)(!0),[ue,be]=Object(s.useState)(!1),[me,je]=Object(s.useState)(!1),ve=Object(s.useMemo)((()=>r.a.getUserInfo()),[]),[he,ye]=Object(s.useState)(ve.roles[0]);Object(s.useEffect)((()=>{r.a.hasAdminRole()&&je(!0)}),[]);const Oe=Object(s.useCallback)((async()=>{try{return await d.a.get("".concat(u.a.serverURL,"/interviewer/").concat(H.interviewerId),{headers:J})}catch(e){console.log(e)}}),[J,H.interviewerId]);Object(s.useEffect)((()=>{let e=!1;return(async()=>{try{if(!e){const e=await Oe();200===e.status&&(Z(e.data),ne("".concat(e.data.firstName," ").concat(e.data.lastName)))}}catch(a){var t;if(!e)401===(null===(t=a.response)||void 0===t?void 0:t.status)&&r.a.logout(),console.log(a)}})(),()=>e=!0}),[Oe]);const ge=Object(s.useCallback)((async()=>{try{return await Object(m.e)("primeSkills",J)}catch(e){console.log(e)}}),[J]);Object(s.useEffect)((()=>{let e=!1;return(async()=>{try{if(!e){const e=await ge();e&&z(e)}}catch(t){e||console.log(t)}})(),()=>e=!0}),[J,ge]);const pe=Object(s.useCallback)((async()=>{try{return await d.a.get(u.a.serverURL+"/clients?dropdownFilter=true",{headers:J})}catch(e){console.log(e)}}),[J]);Object(s.useEffect)((()=>{let e=!1;return(async()=>{try{if(!e){const e=await pe();200===e.status&&K(e.data)}}catch(a){var t;e||401!==(null===(t=a.response)||void 0===t?void 0:t.status)||r.a.logout()}})(),()=>e=!0}),[pe]);const Ce=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;const a=e.target.max?+e.target.max:null,s=Object(v.a)(t,e.target.value,a),n=""===e.target.value;if("postalCode"===e.target.name?Z({...Y,address:{...Y.address,[e.target.name]:e.target.value}}):Z({...Y,[e.target.name]:e.target.value}),s){if(s||n){let t={...Q};delete t[e.target.name],V(t)}}else V({...Q,[e.target.name]:"Invalid characters"})},fe=(e,t)=>{d.a.post("".concat(u.a.serverURL,"/interviewer/checks/").concat(t),e,{headers:J}).then((()=>{xe(e,t)})).catch((e=>{console.log(e)}))},xe=(e,t)=>{d.a.patch("".concat(u.a.serverURL,"/interviewer/").concat(t),e,{headers:J}).then((e=>{200===e.status&&(A.b.success({content:"Interviewer updated!",duration:5,style:{marginTop:"5%"}}),W(!0),Z(e.data),ne("".concat(e.data.firstName," ").concat(e.data.lastName)))})).catch((e=>{var t;console.log(e),e.response&&401===e.response.status&&r.a.logout(),A.b.error({content:"An error occurred while saving changes (".concat(null===(t=e.response)||void 0===t?void 0:t.status,")"),duration:10})}))},Ne=Object(s.useCallback)((()=>{const e="interviewer/".concat(Y.id),t="?year=".concat(ie,"&month=").concat(ce);Object(j.c)(J,e,t).then((e=>ae(e.data))).catch((e=>console.log(e)))}),[J,Y.id,ce,ie]);Object(s.useEffect)((()=>{Y.id&&Ne()}),[Y.id,Ne]);return Object(D.jsxs)(E.a,{children:[Object(D.jsx)(M.a,{onActive:()=>{de(!0)},onIdle:()=>{de(!1)},onLogout:()=>{be(!0)}}),Object(D.jsx)(I.a,{breadcrumbs:Object(D.jsx)(w.a,{className:"header",crumbs:[{id:0,text:"Interviewers",onClick:()=>{U.push("/viewinterviewers")}},{id:1,text:se?"Interviewer: ".concat(se):"Interviewer Profile",lastCrumb:!0}]}),actions:Object(D.jsxs)(D.Fragment,{children:[me||he.managerPermission||he.candidatesPermission||he.clientPermission||he.interviewsPermission||he.jobOpeningsPermission||he.onBoardingsPermission||he.settingsPermission||he.suppliersPermission?Object(D.jsxs)(S.a,{type:"button",className:"btn main margin-right",handleClick:()=>B(Object(b.b)(!0)),children:[Object(D.jsx)(k.a,{className:"icon"}),"Schedule Interview"]}):"",Object(D.jsx)(L.a,{children:me||he.managerPermission||he.candidatesPermission||he.clientPermission||he.interviewsPermission||he.jobOpeningsPermission||he.onBoardingsPermission||he.settingsPermission||he.suppliersPermission?Object(D.jsx)(S.a,{className:"btn icon marginX",type:"button",handleClick:()=>W((e=>!e)),children:Object(D.jsx)(q.a,{})}):""})]})}),Object(D.jsxs)(_.a,{children:[Object(D.jsx)(y.a,{className:"x-small",children:Object(D.jsxs)(O.a,{onSubmit:e=>((e,t)=>{if(e.preventDefault(),Object.keys(Q).length)return void ee("Fix errors before submitting: ".concat(Object.keys(Q).join(", ")));ee("");const a={firstName:Y.firstName,lastName:Y.lastName,email:Y.email,phone_no:Y.phone_no?Y.phone_no:"",interview_skills:Y.interview_skills,total_experience:Y.total_experience,client:{clientName:Y.client.clientName,id:Y.client.id},address:{...Y.address}};fe(a,t)})(e,Y.id),cancel:async()=>{try{const e=await Oe();200===e.status&&(W(!0),Z({...e.data}),ne("".concat(e.data.firstName," ").concat(e.data.lastName)))}catch(e){console.log(e)}},formEnabled:!T,className:"column small",children:[$&&Object(D.jsx)(P.a,{type:"error",showIcon:!0,message:$}),Object(D.jsx)("h3",{className:"disabled-form-section-header",children:"Contact"}),T?Object(D.jsx)(g.a,{type:"text",label:"Name",name:"fullName",value:se||"",readOnly:!0}):Object(D.jsxs)(D.Fragment,{children:[Object(D.jsx)(g.a,{type:"text",label:"First Name",name:"firstName",value:(null===Y||void 0===Y?void 0:Y.firstName)||"",onChange:e=>Ce(e,"validateName"),maxLength:"40",required:!0,disabled:T,errMssg:Q.firstName}),Object(D.jsx)(g.a,{type:"text",label:"Last Name",name:"lastName",value:(null===Y||void 0===Y?void 0:Y.lastName)||"",onChange:e=>Ce(e,"validateName"),maxLength:"40",required:!0,disabled:T,errMssg:Q.lastName})]}),Object(D.jsx)(g.a,{type:"email",label:"Email",name:"email",value:(null===Y||void 0===Y?void 0:Y.email)||"",onChange:e=>Ce(e,"validateEmail"),required:!0,disabled:T,errMssg:Q.email}),Object(D.jsx)(C.a,{label:"Phone Num.",phoneNumber:(null===Y||void 0===Y?void 0:Y.phone_no)||"",handleChange:e=>{Z({...Y,phone_no:e})},disabled:T,setError:e=>{if(e)V({...Q,phoneNumber:!0});else{let e={...Q};delete e.phoneNumber,V(e)}}}),Object(D.jsx)("h3",{className:"disabled-form-section-header",children:"Professional Details"}),Object(D.jsx)(f.a,{label:"Client",name:"clientId","data-testid":"client-options",onChange:e=>{const t=G.filter((t=>+t.id===+e.target.value))[0];Z({...Y,client:{clientName:t.clientName,id:t.id}})},value:(null===(e=Y.client)||void 0===e?void 0:e.id)||"",options:G.map((e=>({id:e.id,name:e.clientName}))),required:!0,disabled:T}),Object(D.jsx)(g.a,{type:"number",label:"Work Experience",info:"Years",name:"total_experience",value:(null===Y||void 0===Y?void 0:Y.total_experience)||"",onChange:e=>Ce(e,"validateNum"),min:"0",max:"50",step:"any",disabled:T,errMssg:Q.total_experience}),Object(D.jsx)(x.a,{label:"Interview Skills",options:null===X||void 0===X?void 0:X.map((e=>{var t;return{id:e.id,value:e.value,label:e.value,selected:null===(t=Y.interview_skills)||void 0===t?void 0:t.includes(e.value)}})),handleChange:e=>((e,t)=>{const a=e.filter((e=>e.selected)).map((e=>e.value)).join(",");Ce({target:{name:"interview_skills",value:a||""}}),e.filter((e=>!e.id&&!e.isDeleted)).forEach((e=>{Object(m.h)(t,e.value,J).then((e=>z([...X,e]))).catch((e=>console.log(e)))})),e.filter((e=>e.isDeleted)).forEach((e=>{Object(m.a)(e.id,J).catch((e=>console.log(e)))}));const s=e.filter((e=>!e.isDeleted));z(s)})(e,"primeSkills"),isMulti:!0,creatable:!0,deletable:r.a.hasAdminRole(),disabled:T}),Object(D.jsx)("h3",{className:"disabled-form-section-header",children:"Location"}),Object(D.jsx)(p.a,{disabled:T,requiredCountry:!0,requiredCity:!0,country:(null===Y||void 0===Y||null===(t=Y.address)||void 0===t?void 0:t.country)||"",countryCode:(null===Y||void 0===Y||null===(a=Y.address)||void 0===a?void 0:a.countryCode)||"",state:(null===Y||void 0===Y||null===(o=Y.address)||void 0===o?void 0:o.state)||"",stateCode:(null===Y||void 0===Y||null===(l=Y.address)||void 0===l?void 0:l.stateCode)||"",city:(null===Y||void 0===Y||null===(F=Y.address)||void 0===F?void 0:F.city)||"",handleAddressChange:e=>{const{country:t,state:a,city:s}=e;Z({...Y,address:{country:t.country,countryCode:t.code,state:a.state,stateCode:a.stateCode,city:s}})}}),Object(D.jsx)(g.a,{type:"text",label:"Zip Code",name:"postalCode",value:(null===Y||void 0===Y||null===(R=Y.address)||void 0===R?void 0:R.postalCode)||"",onChange:e=>Ce(e,"validateZip"),maxLength:"6",disabled:T,errMssg:Q.postalCode})]})}),Object(D.jsxs)(y.a,{className:"medium",children:[Object(D.jsx)("h2",{className:"content-header",children:"Schedule"}),Object(D.jsx)(N.a,{interviews:te,setMonth:oe,setYear:re})]})]}),Object(D.jsx)(h.default,{interviewer:{id:Y.id,name:"".concat(Y.firstName," ").concat(Y.lastName)},loadInterviews:Ne})]})}},853:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var s=a(0),n=a(138),c=a(35),o=a(27),i=(a(854),a(1));const r=e=>{const[t,a]=Object(s.useState)([]),[r,l]=Object(s.useState)([]),[d,u]=Object(s.useState)([]),[b,m]=Object(s.useState)({}),[j,v]=Object(s.useState)({});Object(s.useEffect)((()=>a(n.c())),[]),Object(s.useEffect)((()=>{e.countryCode&&l(n.d(e.countryCode)),e.countryCode&&e.stateCode&&u(n.a(e.countryCode,e.stateCode))}),[e.countryCode,e.stateCode]),Object(s.useEffect)((()=>{e.country||e.state||e.city||(l([]),u([]))}),[e.country,e.state,e.city]);const h=a=>{var s,c;const{name:o,selectedOptions:i,value:d}=a.target;switch(o){case"country":const a=t.length?t[(null===(s=i[0])||void 0===s?void 0:s.index)-1]:null;a&&(m({country:a.name,code:a.code}),e.handleAddressChange({country:{country:a.name,code:a.code},state:{state:"",stateCode:""},city:""}),l(n.d(a.code)),v({}),u([]));break;case"state":const o=r.length?r[(null===(c=i[0])||void 0===c?void 0:c.index)-1]:null;o?(v({state:o.name,code:o.code}),e.handleAddressChange({country:{country:e.country?e.country:b.country,code:e.countryCode?e.countryCode:b.code},state:{state:o.name,code:o.code},city:""}),u(n.a(e.countryCode?e.countryCode:b.code,o.code))):(v({state:d,code:""}),e.handleAddressChange({country:{country:e.country?e.country:b.country,code:e.countryCode?e.countryCode:b.code},state:{state:d,code:""},city:""}),u([]));break;case"city":e.handleAddressChange({country:{country:e.country?e.country:b.country,code:e.countryCode?e.countryCode:b.code},state:{state:e.state?e.state:j.state,code:e.stateCode?e.stateCode:j.code},city:d})}};return Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)(c.a,{label:"Country",name:"country",value:e.country||"",onChange:h,placeholder:"Select Country",options:t,required:e.requiredCountry,disabled:e.disabled}),r.length?Object(i.jsx)(c.a,{label:"State / Province",name:"state",value:e.state||"",onChange:h,options:r,placeholder:"Select State/Province",required:e.requiredCountry,disabled:e.disabled}):Object(i.jsx)(o.a,{label:"State / Province",name:"state",value:e.state||"",onChange:h,placeholder:"Enter State/Province",required:e.requiredCountry,disabled:e.disabled,info:"Select country for options or enter state name"}),d.length?Object(i.jsx)(c.a,{label:"City",name:"city",value:e.city||"",onChange:h,options:d,placeholder:"Select City",required:e.requiredCity,disabled:e.disabled}):Object(i.jsx)(o.a,{type:"text",label:"City",name:"city",value:e.city||"",info:"Select state for options or enter city name",onChange:e=>h(e),maxLength:"40",required:e.requiredCity,disabled:e.disabled})]})}},854:function(e,t,a){}}]);