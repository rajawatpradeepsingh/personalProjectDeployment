(this.webpackJsonpreactfrontend=this.webpackJsonpreactfrontend||[]).push([[42],{1098:function(e,t,a){"use strict";a.r(t);var s=a(0),c=a(75),l=a(28),r=a(13),n=a(25),o=a(97),i=a(805),u=a(808),d=a(22),b=a(801),j=a(765),m=a(762),h=a(219),O=a(218),f=(a(158),a(974),a(420)),p=a(683),v=a(16),g=a.n(v),k=a(804),N=a(91),S=a(798),x=a(50);var y=a(1);t.default=()=>{const e=Object(l.b)(),[t,a]=Object(s.useState)([]),[v,C]=Object(s.useState)(!1),w=n.a.ITEMS_PER_PAGE,[R,A]=Object(s.useState)(!1),[E,F]=Object(s.useState)([]),[P,I]=Object(s.useState)(0),[U,L]=Object(s.useState)(1),z=Object(s.useMemo)((()=>r.a.getHeaders()),[]),[D,M]=Object(s.useState)(!1),T=Object(c.useHistory)(),[_,J]=Object(s.useState)([]),[H,V]=Object(s.useState)([]),[B,G]=Object(s.useState)([]),[K,q]=Object(s.useState)([]),[Q,W]=Object(s.useState)({}),[X,Y]=Object(s.useState)({}),[Z,$]=Object(s.useState)(10),[ee,te]=Object(s.useState)(1),[ae,se]=Object(s.useState)(0),[ce,le]=Object(s.useState)([]),[re,ne]=Object(s.useState)(!1),[oe,ie]=Object(s.useState)(1),[ue,de]=Object(s.useState)(!1),[be,je]=Object(s.useState)(!1),[me,he]=Object(s.useState)(1),Oe=JSON.parse(sessionStorage.getItem("userInfo")),[fe,pe]=Object(s.useState)({}),[ve,ge]=Object(s.useState)(!1);Object(s.useEffect)((()=>{r.a.hasAdminRole()&&ne(!0)}),[]);const ke=Object(s.useCallback)((()=>{e(Object(N.b)(!1)),r.a.logout()}),[e]),Ne=Object(s.useCallback)((e=>{if(null===e||void 0===e||!e.id)return;const s=t.map((t=>t.id===e.id?e:t));a(s)}),[t]),Se=Object(s.useCallback)((e=>{T.push("/users/".concat(e))}),[T]),xe=Object(s.useCallback)((()=>{Object(o.d)(z).then((e=>{200===e.statusCode&&a(e.data)})).catch((e=>console.log(e)))}),[z]),ye=Object(s.useCallback)((()=>{if(0!==Object.keys(Q).length)g.a.put("".concat(n.a.serverURL,"/users?dropdownFilter=true&pageNo=").concat(oe-1,"&pageSize=").concat(w),Q,{headers:z}).then((e=>{e.data&&(de(!1),se(e.headers["total-elements"]),a(e.data)),e.data.length||de(!0)})).catch((e=>{console.log(e),e.response&&401===e.response.status&&ke()}));else{const e=Object.keys(X)[0]?Object.keys(X)[0]:"",t=e?X[e]:"",s=e?"/users?pageNo=".concat(ee-1,"&pageSize=").concat(w,"&orderBy=").concat(e,"&orderMode=").concat(t):"/users?pageNo=".concat(ee-1,"&pageSize=").concat(w);g.a.get("".concat(n.a.serverURL).concat(s),{headers:z}).then((e=>{e.data&&(je(!1),se(e.headers["total-elements"]),de(!1),a(e.data))})).catch((e=>console.log(e)))}}),[Q,ee,w,oe,X,z,ke]);Object(s.useEffect)((()=>{ye()}),[ye,Q,E]);const Ce=Object(s.useCallback)((e=>{ge((e=>!e)),Object(o.j)(z,e.id,{enabled:!e.enabled}).then((e=>{Ne(null===e||void 0===e?void 0:e.data),ge({}),xe()})).catch((e=>console.log(e)))}),[z,Ne,xe]),we=Object(s.useCallback)((async()=>{const e=await g.a.get("".concat(n.a.serverURL,"/users?dropdownFilter=true"),{headers:z});200===e.status?G(e.data.map((e=>({text:e.username,value:e.id})))):f.b.warning("Problem getting supplier filter data, refresh page or contact system admin")}),[z]);Object(s.useEffect)((()=>we()),[we]);const Re=Object(s.useCallback)((async()=>{const e=await g.a.get("".concat(n.a.serverURL,"/roles?dropdownFilter=true"),{headers:z});200===e.status?V(e.data.map((e=>({text:"".concat("".concat(e.roleName)),value:e.id})))):f.b.warning("Problem getting roles filter data, refresh page or contact system admin")}),[z]);Object(s.useEffect)((()=>Re()),[Re]);const Ae=Object(s.useCallback)((e=>{let t=[];for(let a in e)if("string"!==typeof e[a]&&"number"!==typeof e[a]||"id"===a||""===e[a])"object"===typeof e[a]&&(t=t.concat(Ae(e[a])));else if("userName"===a){let s=e[a].split(", ");t.push(s[0],s[1],s[2])}else t.push(e[a]);return t}),[]);Object(s.useEffect)((()=>{if(t){let e=[];for(let a of t){Ae(a).forEach((t=>{e.includes(t)||e.push(t)}))}J(e)}}),[t,Ae]);const Ee=Object(s.useMemo)((()=>[{title:"UserName",dataIndex:"username",key:"username",width:90,filters:B,filterSearch:!0,className:"clickable",render:(e,t)=>Object(y.jsx)(S.a,{label:e,onClick:()=>Se(t.id)})},{title:"Name",dataIndex:"firstName",key:"name",render:(e,t)=>Object(y.jsx)("span",{children:Object(x.j)(t)}),width:150},{title:"Role",dataIndex:"roles",key:"roleId",width:140,filters:H,filterSearch:!0,render:(e,t)=>{var a;return Object(y.jsx)("span",{children:null===(a=t.roles)||void 0===a?void 0:a[0].roleName})}},{title:"Email",dataIndex:"email",key:"email",width:200},{title:"Phone_Number",dataIndex:"phoneNumber",key:"phoneNumber",ellipsis:!0,width:120},{title:"Authorized",dataIndex:"Authorized",key:"Authorized",render:(e,t,a)=>Object(y.jsx)(p.a,{checked:t.enabled,loading:void 0!==ve[t.id],onChange:()=>Ce(t),disabled:!r.a.hasAdminRole()}),width:90}]),[B,H,Oe.id,Ce,ve,Se]);Object(s.useEffect)((()=>{q(Ee)}),[Ee,B,me,H,Oe.id,v]);const Fe=Object(s.useCallback)((()=>{Object(o.e)(z,U,w).then((e=>{e.data&&(I(e.totalItems),F(e.data.map((e=>({id:e.id,cellOne:e.username,cellTwo:e.firstName,cellThree:e.lastName,cellFour:e.email,cellFive:e.roles.map((e=>e.roleName)).join(", "),cellSix:e.phoneNumber})))))})).catch((e=>console.log(e)))}),[U,w,z]);Object(s.useEffect)((()=>{Fe()}),[Fe,U,R]);Object(s.useEffect)((()=>{xe()}),[xe]);const Pe=()=>{le([])},Ie=Object(s.useCallback)((e=>W({...Q,search:e})),[Q]),Ue={onChange:(e,t)=>{le(re?e:[])},selectedRowKeys:ce},Le=e=>{T.push(e)};return Object(y.jsxs)(h.a,{children:[Object(y.jsx)(O.a,{title:"Users",actions:Object(y.jsxs)(y.Fragment,{children:[Object(y.jsxs)(d.a,{type:"button",className:"btn main margin-left",handleClick:()=>Le("/viewroles"),children:[Object(y.jsx)(j.a,{className:"icon"}),"View Roles"]}),Object(y.jsxs)(d.a,{type:"button",className:"btn main margin-left",handleClick:()=>Le("/addrole"),children:[Object(y.jsx)(m.a,{className:"icon"}),"Add Role"]})]})}),Object(y.jsx)(k.a,{loading:v,data:t.map((e=>({...e,key:e.id}))),columns:K,setColumns:q,defaultColumns:Ee,rowSelection:Ue,setFilterTrail:pe,setFilters:e=>{ie(1),W(e)},total:ae,setCurrentPage:te,setPageSize:$,setSort:Y,filters:Q,searchOptions:_,searchList:t,filterTrail:fe,handleSearch:Ie,filterNoMatch:ue,onPageChange:e=>(e=>{Object.keys(Q).length>0?ie(e):be?he(e):te(e)})(e),openArchive:()=>A(!0),openReports:()=>M(!0),handleConfirmArchive:()=>{const e=[...ce];Promise.all(e.map((e=>Object(o.j)(z,e,{enabled:!1})))).then((()=>{Promise.all(e.map((e=>Object(o.b)(z,e)))).then((()=>{xe(),Pe()}))})).catch((e=>console.log(e)))},handleCancelArchiving:Pe,removeableColumns:Ee.filter((e=>"Users"!==e.title&&e.title)).map((e=>e.title))}),Object(y.jsx)(i.a,{showReportModal:D,setShowReportModal:M,individualReportName:"users",individualList:t,list:t.map((e=>({id:e.id,name:"".concat(e.firstName+" "+e.lastName)}))),listLabel:"Users",filename:"users_report",tableFields:[{label:"First Name",value:"fullName",key:"fullName"},{label:"Email",value:"email",key:"email"},{label:"PhoneNumber",value:"phoneNumber",key:"phoneNumber"},{label:"Role",value:"roles",key:"roles"},{label:"Activation Date",value:"activationDate",key:"activationDate"},{label:"Future Role",value:"futureRoles",key:"futureRoles"},{label:"Future Activation Date",value:"futureActivationDate",key:"futureActivationDate"}],pdfFormatter:u.a.userPdfFormat,csvExcelFormatter:u.a.userCSVExcel}),Object(y.jsx)(b.a,{openArchive:R,setOpenArchive:A,loadArchive:Fe,archive:E,archivedData:"users",headers:["Username","FirstName","LastName","Email","Role","Phone Num."],totalItems:P,setArchiveCurrentPage:L,archiveCurrentPage:U})]})}},798:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));a(800);var s=a(1);const c=e=>Object(s.jsxs)("div",{className:"tablelink-container",children:[Object(s.jsx)("span",{onClick:e.onClick,className:"tablelink ".concat(e.styleRed&&"red"," ").concat(e.className&&e.className),children:e.label}),e.extra&&Object(s.jsx)("span",{className:"table-link-extra",children:e.extra})]})},974:function(e,t,a){}}]);