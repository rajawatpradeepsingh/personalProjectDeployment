(this.webpackJsonpreactfrontend=this.webpackJsonpreactfrontend||[]).push([[26],{1057:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a(75),i=a(28),s=a(137),d=a(22),r=a(86),l=a(112),o=a(319),u=a(13),j=a(812),b=a(816),h=a(152),m=a(1);t.default=()=>{var e,t,a,v;const f=Object(c.useHistory)(),O=Object(i.b)(),{navMenuOpen:x}=Object(i.c)((e=>e.nav)),{subjects:g,areas:p,clients:y}=Object(i.c)((e=>e.iGuide)),{guide:w}=Object(i.c)((e=>e.iGuide)),[C]=Object(n.useState)(u.a.getHeaders()),[N,S]=Object(n.useState)(),[I,k]=Object(n.useState)([]),[E,A]=Object(n.useState)(!1),[q,T]=Object(n.useState)(!0),[G,M]=Object(n.useState)(!1),P=()=>{O(Object(o.e)({})),S()},Q=Object(n.useCallback)((()=>{f.push("/viewguides")}),[f]);Object(n.useEffect)((()=>{null!==w&&void 0!==w&&w.id&&S(w.subject.id)}),[w]),Object(n.useEffect)((()=>{const e=p.filter((e=>{var t;return+(null===(t=e.subject)||void 0===t?void 0:t.id)===+N}));k(e)}),[p,N]);const D=e=>{const{name:t,value:a}=e.target;let n={...w,[t]:a};n="questions"===t?{...w,[t]:a}:{...w,[t]:{id:a}},"subject"===t&&(n={...n,area:null},S(a)),A("subject"===t),O(Object(o.e)(n))},F=async(e,t)=>{(async(e,t)=>{try{const a=e.find((e=>!e.id));if(!a)return{};let n={name:a.value};return n="subject"===t?{...n}:{...n,subject:{id:N}},await Object(j.i)(C,t,n)}catch{return{}}})(e,t).then((a=>{var n;const c=a.id?[...e.filter((e=>e.id)),{...a,selected:!0}]:e.filter((e=>e.id));if("subject"===t&&a.id){const e=[...g,a];O(Object(o.g)(e))}if("area"===t&&a.id){const e=[...p,a];O(Object(o.b)(e))}const i={name:t,value:null===(n=c.filter((e=>null===e||void 0===e?void 0:e.selected))[0])||void 0===n?void 0:n.id};D({target:i})})).catch((e=>console.log(e)))};return Object(m.jsxs)("div",{className:x?"page-container":"page-container full-width",children:[Object(m.jsx)("div",{className:"page-actions-container",children:Object(b.f)({closeForm:Q,guide:w})}),Object(m.jsxs)(s.a,{className:"guide-modify-container",children:[Object(m.jsx)(h.a,{onActive:()=>{T(!0)},onIdle:()=>{T(!1)},onLogout:()=>{M(!0)}}),Object(m.jsxs)("div",{className:"long-form-subsection",children:[Object(m.jsx)(l.a,{className:"medium",label:"Subject",options:g.map((e=>({id:e.id,value:e.name,selected:+N===+e.id}))),handleChange:e=>F(e,"subject"),placeholder:"Select...",creatable:!0}),Object(m.jsx)(l.a,{label:"Area of focus",options:I.map((e=>{var t;return{id:e.id,value:e.name,selected:+e.id===+(null===w||void 0===w||null===(t=w.area)||void 0===t?void 0:t.id)}})),handleChange:e=>F(e,"area"),placeholder:"Select...",creatable:!0,reset:E}),Object(m.jsx)(l.a,{label:"Client",options:y.map((e=>{var t;return{id:e.id,value:e.clientName,selected:+e.id===+(null===w||void 0===w||null===(t=w.client)||void 0===t?void 0:t.id)}})),handleChange:e=>F(e,"client"),placeholder:"Select..."})]}),Object(m.jsx)(r.a,{className:"guide-textarea",label:"Questions",name:"questions",value:w.questions||"",onChange:D,charCount:"".concat(w.questions?3e3-w.questions.length:3e3," of 3000"),maxLength:"3000",rows:10,disabled:!(null!==(e=w.area)&&void 0!==e&&e.id),placeholder:null!==(t=w.area)&&void 0!==t&&t.id?"":"Please select all required fields before submitting a guide",required:!0}),Object(m.jsxs)("div",{className:"form-btns-container",children:[Object(m.jsx)(d.a,{type:"reset",className:"main reset marginX",handleClick:()=>{P(),Q()},children:"Cancel"}),Object(m.jsx)(d.a,{type:"submit",className:"main submit marginX",handleClick:()=>{const e={...w,user:{id:u.a.getUserId()}};null!==w&&void 0!==w&&w.id?Object(j.j)(C,e).then((()=>Q())).catch((e=>console.log(e))):Object(j.h)(C,e).then((()=>Q())).catch((e=>console.log(e))),P()},disabled:!(null!==(a=w.area)&&void 0!==a&&a.id&&null!==(v=w.questions)&&void 0!==v&&v.length),children:"Submit"})]})]})]})}},798:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));a(800);var n=a(1);const c=e=>Object(n.jsxs)("div",{className:"tablelink-container",children:[Object(n.jsx)("span",{onClick:e.onClick,className:"tablelink ".concat(e.styleRed&&"red"," ").concat(e.className&&e.className),children:e.label}),e.extra&&Object(n.jsx)("span",{className:"table-link-extra",children:e.extra})]})},800:function(e,t,a){},812:function(e,t,a){"use strict";a.d(t,"g",(function(){return o})),a.d(t,"b",(function(){return u})),a.d(t,"i",(function(){return j})),a.d(t,"f",(function(){return b})),a.d(t,"c",(function(){return h})),a.d(t,"h",(function(){return m})),a.d(t,"j",(function(){return v})),a.d(t,"a",(function(){return f})),a.d(t,"d",(function(){return O})),a.d(t,"e",(function(){return x}));var n=a(16),c=a.n(n),i=a(25),s=a(13);const d="".concat(i.a.serverURL,"/guides"),r=e=>({...e,Accept:"application/json","Content-Type":"application/json"}),l=async(e,t,a)=>{try{return await c.a.get("".concat(d).concat(t).concat(a),{headers:e})}catch(i){var n;return 401===i.response.status&&s.a.logout(),{statusCode:null===(n=i.response)||void 0===n?void 0:n.status}}},o=async e=>{const t=await fetch("".concat(d,"/subjects"),{method:"GET",headers:r(e)});return await t.json()},u=async e=>{const t=await fetch("".concat(d,"/areas"),{method:"GET",headers:r(e)});return await t.json()},j=async(e,t,a)=>{const n=await fetch("".concat(d,"/").concat(t,"s"),{method:"POST",headers:r(e),body:JSON.stringify(a)});return await n.json()},b=async(e,t,a,n)=>{const c="?page=".concat(a-1||0,"&size=").concat(n||i.a.ITEMS_PER_PAGE),s=null!==t&&void 0!==t&&t.subject?"&subjectName=".concat(t.subject):"",d=null!==t&&void 0!==t&&t.search?"&search=".concat(t.search):"",r="".concat(c).concat(s).concat(d),o=await l(e,"/latest",r),u={};return 200===o.status&&(u.data=o.data.content,u.totalItems=o.data.totalElements,u.statusCode=o.status),u},h=async(e,t,a,n,i,s)=>{const r="?page=".concat(n-1||0,"&size=").concat(i||10),l="&subjectId=".concat(t,"&areaId=").concat(a),o=null!==s&&void 0!==s&&s.search?"&search=".concat(s.search):"",u="".concat(r).concat(l).concat(o);try{const t=await c.a.put("".concat(d).concat(u),{},{headers:e});return{data:t.data,totalItems:t.headers["total-elements"]}}catch(j){console.log("Error: ".concat(j))}},m=async(e,t)=>{const a=await fetch("".concat(d),{method:"POST",headers:r(e),body:JSON.stringify(t)});return await a.json()},v=async(e,t)=>{var a;const n={subject:{id:t.subject.id},area:{id:t.area.id},client:{id:(null===t||void 0===t||null===(a=t.client)||void 0===a?void 0:a.id)||null},user:{id:t.user.id},questions:t.questions},c=await fetch("".concat(d,"/").concat(t.id),{method:"PUT",headers:r(e),body:JSON.stringify(n)});return await c.json()},f=async(e,t)=>{try{return await c.a.all(t.map((t=>c.a.delete("".concat(d,"/").concat(t),{headers:e}))))}catch(n){var a;return 401===n.response.status&&s.a.logout(),{statusCode:null===(a=n.response)||void 0===a?void 0:a.status,err:n}}},O=async(e,t,a)=>{try{let c={};const i="?pageNo=".concat(t-1,"&pageSize=").concat(a),s="/deleted",d=await l(e,s,i);var n;if(200===d.status)c.tableData=null===(n=d.data.content)||void 0===n?void 0:n.map((e=>{var t,a,n;return{id:e.id,cellOne:null===e||void 0===e||null===(t=e.subject)||void 0===t?void 0:t.name,cellTwo:null===e||void 0===e||null===(a=e.area)||void 0===a?void 0:a.name,cellThree:null===e||void 0===e||null===(n=e.client)||void 0===n?void 0:n.clientName}})),c.totalItems=d.data.totalElements,c.statusCode=d.status;return c}catch(i){var c;return 401===i.response.status&&s.a.logout(),{statusCode:null===(c=i.response)||void 0===c?void 0:c.status,err:i}}},x=async function(e,t){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:i.a.ITEMS_PER_PAGE;const c=Object.entries(t).map((e=>{let[t,a]=e;return"".concat(t,"Name=").concat(a)})).join("&"),s="?page=".concat(a-1||0,"&size=").concat(n),d="".concat(s,"&").concat(c),r=await l(e,"/filter",d),o={};return 200===r.status&&(o.data=r.data.content,o.totalItems=r.data.totalElements,o.statusCode=r.status),o}},816:function(e,t,a){"use strict";a.d(t,"a",(function(){return m})),a.d(t,"e",(function(){return v})),a.d(t,"f",(function(){return f})),a.d(t,"b",(function(){return x})),a.d(t,"c",(function(){return g})),a.d(t,"g",(function(){return p})),a.d(t,"h",(function(){return y})),a.d(t,"d",(function(){return w}));var n=a(22),c=a(306),i=a(321),s=a(783),d=a(762),r=a(685),l=a(781),o=a(50),u=a(798),j=a(218),b=a(307),h=a(1);const m=["Subject","Area","Client"],v=e=>{const{openForm:t,toggleShareModal:a}=e;return Object(h.jsxs)("div",{className:"page-actions-container",children:[Object(h.jsx)("h1",{className:"page-header",children:"Interview Questions Guide"}),Object(h.jsxs)("div",{className:"flex-row",children:[Object(h.jsxs)(n.a,{type:"button",className:"btn main margin-right",handleClick:t,children:[Object(h.jsx)(d.a,{style:{fontSize:"12px",marginRight:"5px"}}),"Add Questions"]}),Object(h.jsx)(i.a,{btns:[{handleClick:a,title:"Share",child:Object(h.jsx)(r.a,{})},{handleClick:()=>console.log("click report"),title:"Export report",child:Object(h.jsx)(s.a,{}),disabled:!0}]})]})]})},f=e=>{const{closeForm:t,guide:a}=e;return Object(h.jsx)(c.a,{className:"header",crumbs:[{id:0,text:"Interview Question Guide",onClick:()=>t()},{id:1,text:"Add New Quide",lastCrumb:!0}]})},O={fontWeight:"600",fontSize:"12px",textTransform:"uppercase"},x=e=>[{title:Object(h.jsx)("div",{style:O,children:"Subject"}),dataIndex:"subject",key:"subject",render:(e,t)=>t.subject.name,filters:null===e||void 0===e?void 0:e.map((e=>({text:e.name,value:e.name}))),filterSearch:!0},{title:Object(h.jsx)("div",{style:O,children:"Area of focus"}),dataIndex:"area",key:"area",render:(e,t)=>t.area.name},{title:Object(h.jsx)("div",{style:O,children:"Modified by"}),dataIndex:"user",key:"user",width:150,render:(e,t)=>Object(o.j)(t.user)},{title:Object(h.jsx)("div",{style:O,children:"Modified on"}),dataIndex:"date",key:"date",width:120,render:(e,t)=>{var a=t.updatedAt.split("/")||t.createdAt.split("/");return new Date(+a[2],a[1]-1,+a[0]).toLocaleDateString()}}],g=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return[{title:Object(h.jsx)("div",{style:O,children:"Subject"}),dataIndex:"subject",render:(t,a)=>Object(h.jsx)(u.a,{label:t.name,onClick:()=>e?e(a.id):{}})},{title:Object(h.jsx)("div",{style:O,children:"Area of focus"}),dataIndex:"area",render:e=>e.name},{title:Object(h.jsx)("div",{style:O,children:"Client"}),dataIndex:"client",render:e=>null===e||void 0===e?void 0:e.clientName},{title:Object(h.jsx)("div",{style:O,children:"Modified by"}),dataIndex:"user",render:e=>Object(o.j)(e),width:150},{title:Object(h.jsx)("div",{style:O,children:"Modified on"}),dataIndex:"modifiedOn",key:"date",render:(e,t)=>new Date(t.updatedAt||t.createdAt).toLocaleDateString(),width:120}]},p=[{title:"Subject",dataIndex:"subject",render:e=>Object(h.jsx)("div",{children:e.name})},{title:"Area of focus",dataIndex:"area",render:e=>Object(h.jsx)("div",{children:e.name})},{title:"Client",dataIndex:"client",render:e=>Object(h.jsx)("div",{children:e.clientName})},{title:"Questions",dataIndex:"questions",render:e=>e&&e.length>35?Object(h.jsx)("span",{title:e,children:e.slice(0,35)+"..."}):e,width:280},{title:Object(h.jsx)("div",{children:"Modified on"}),dataIndex:"modifiedOn",key:"date",render:(e,t)=>new Date(t.updatedAt||t.createdAt).toLocaleDateString(),width:105}],y=e=>[{id:1,name:"Subject",options:e.Subject.map((e=>({id:e.id,name:e.name})))},{id:2,name:"Client",options:e.Clients.map((e=>({id:e.id,name:e.clientName})))}],w=e=>{const{closeForm:t,auth:a,toggleForm:i,handleSubmit:s,editEnabled:d}=e;return Object(h.jsx)(j.a,{breadcrumbs:Object(h.jsx)(c.a,{className:"header",crumbs:[{id:0,text:"Interview Question Guide",onClick:()=>t()},{id:1,text:"Edit Quide",lastCrumb:!0}]}),actions:Object(h.jsxs)(h.Fragment,{children:[d&&Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)(n.a,{type:"button",handleClick:s,className:"btn main submit marginX",children:"Save Changes"}),Object(h.jsx)(n.a,{type:"button",handleClick:t,className:"btn main reset marginX",children:"Cancel"})]}),Object(h.jsx)(b.a,{children:Object(h.jsx)(n.a,{type:"button",handleClick:i,className:"btn icon marginX",title:"Edit",children:Object(h.jsx)(l.a,{})})})]})})}}}]);