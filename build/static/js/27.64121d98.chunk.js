(this.webpackJsonpreactfrontend=this.webpackJsonpreactfrontend||[]).push([[27],{1084:function(e,t,a){"use strict";a.r(t);var s=a(0),c=a(75),n=a(16),r=a.n(n),o=a(25),l=a(808),i=a(13),u=a(839),d=a(229),p=a(22),b=a(219),h=a(218),j=a(804),m=a(798),f=a(806),v=a(801),O=a(1);const y=Object(s.forwardRef)(((e,t)=>{let{open:a,setOpen:c,...n}=e;const r=Object(s.useMemo)((()=>i.a.getHeaders()),[]),[o,l]=Object(s.useState)(1),[d,p]=Object(s.useState)(0),[b,h]=Object(s.useState)([]),j=Object(s.useCallback)((async()=>{const e=await Object(u.b)(r,o,10);e&&(h(e.data),p(e.totalItems))}),[o,r]);return Object(s.useEffect)((()=>{j()}),[o,r,j]),Object(s.useImperativeHandle)(t,(()=>({loadArchive(){j()},length:b.length}))),Object(O.jsx)(v.a,{openArchive:a,setOpenArchive:c,loadArchive:j,archive:b,archivedData:"supplier",headers:["Supplier","Name","Email","Phone Number","Location","Title","Website"],totalItems:d,setArchiveCurrentPage:l,archiveCurrentPage:o})}));var g=a(420),S=a(762),w=a(805);a(321);var C=a(152),k=a(63);t.default=()=>{var e;const t=Object(c.useHistory)(),a=Object(s.useMemo)((()=>i.a.getHeaders()),[]),n=Object(s.useRef)(null),[v,x]=Object(s.useState)(!1),[N,I]=Object(s.useState)(!1),[E,R]=Object(s.useState)(!1),[A,L]=Object(s.useState)([]),[D,F]=Object(s.useState)(0),[P,M]=Object(s.useState)(!0),[T,z]=Object(s.useState)(10),[B,U]=Object(s.useState)(1),[_,H]=Object(s.useState)([]),[W,J]=Object(s.useState)({}),[K,V]=Object(s.useState)({}),[q,G]=Object(s.useState)([]),[Q,X]=Object(s.useState)([]),[Y,Z]=Object(s.useState)([]),[$,ee]=Object(s.useState)([]),[te,ae]=Object(s.useState)(!0),[se,ce]=Object(s.useState)(!1),ne=Object(s.useMemo)((()=>i.a.getUserInfo()),[]),[re,oe]=Object(s.useState)(ne.roles[0]),[le,ie]=Object(s.useState)(!1);console.log(re),Object(s.useEffect)((()=>{i.a.hasAdminRole()&&R(!0)}),[]);const ue=Object(s.useCallback)((e=>{t.push("/supplier/".concat(e))}),[t]),de=Object(s.useCallback)((async()=>{200===(await r.a.get("".concat(o.a.serverURL,"/supplier?dropdownFilter=true"),{headers:a})).status||g.b.warning("Problem getting supplier filter data, refresh page or contact system admin")}),[a]);Object(s.useEffect)((()=>de()),[de]);const pe=Object(s.useCallback)((e=>{Object(k.d)(e).then((e=>{e&&ee(e.map((e=>({text:e.value,value:e.value}))))})).catch((e=>{console.log(e)}))}),[]);Object(s.useEffect)((()=>{pe(a)}),[a,pe]);const be=Object(s.useCallback)((e=>{Object(k.i)(e).then((e=>{e&&Z(e.map((e=>({text:e.value,value:e.value}))))})).catch((e=>{console.log(e)}))}),[]);Object(s.useEffect)((()=>{be(a)}),[a,be]);const he=Object(s.useMemo)((()=>[{title:"Supplier",dataIndex:"supplierCompanyName",key:"supplierCompanyName",sorter:!0,render:(e,t)=>Object(O.jsx)(m.a,{label:e,onClick:()=>ue(t.id)}),width:170,filters:Y,filterSearch:!0},{title:"Status",dataIndex:"status",key:"status",sorter:!0,width:90,render:e=>Object(O.jsx)("span",{className:"table-record-status ".concat(e&&e.toLowerCase()),children:e})},{title:"Title",dataIndex:"designation",key:"designation",width:140,filters:$,sorter:!0},{title:"Contact",dataIndex:"firstName",key:"firstName",sorter:!0,render:(e,t)=>Object(O.jsx)(f.a,{name:"".concat(e," ").concat(t.lastName),location:t.email,extra:t.phone_no?Object(d.b)(t.phone_no):""}),width:180},{title:"Location",dataIndex:"address",key:"address.city",sorter:!0,render:e=>Object(O.jsx)(f.a,{name:null===e||void 0===e?void 0:e.city,location:"".concat(null===e||void 0===e?void 0:e.state,", ").concat(null===e||void 0===e?void 0:e.country)}),width:200},{title:"Website",dataIndex:"website",key:"website",ellipsis:!0,width:120}]),[Y,$,ue]);Object(s.useEffect)((()=>{G(he)}),[he,Y,$]);const je=Object(s.useCallback)((async()=>{const e="pageNo=".concat(B,"&pageSize=-1");if(Object.keys(K).length){let e="";for(const a in W)a&&(e+="&orderBy=".concat(a,"&orderMode=").concat(W[a]));const t=Object.keys(K).length?K:null;M(!0);const s=await Object(u.e)(a,B,T,e||"&orderBy=id&orderMode=desc",t);s&&M(!1),200===s.status&&(L(s.data),F(s.totalItems)),200!==s.status&&g.b.error("Something's gone wrong, refresh page or contact your system admin")}else{let t="?".concat(e);for(const e in W)e&&(t+="&orderBy=".concat(e,"&orderMode=").concat(W[e]));const s=await Object(u.d)(a,t);s&&M(!1),200===s.statusCode&&(L(s.tableData),F(s.totalItems)),200!==s.statusCode&&g.b.error("Something's gone wrong, refresh page or contact your system admin")}}),[a,B,T,W,K]);Object(s.useEffect)((()=>{je()}),[je,K,null===n||void 0===n||null===(e=n.current)||void 0===e?void 0:e.length]);Object(s.useEffect)((()=>{je()}),[je]);const me=Object(s.useCallback)((e=>V({...K,search:e})),[K]),fe=Object(s.useCallback)((e=>{let t=[];for(let a in e)if("string"!==typeof e[a]&&"number"!==typeof e[a]||"id"===a||""===e[a])"object"===typeof e[a]&&(t=t.concat(fe(e[a])));else if("supplierCompanyName"===a){let s=e[a].split(", ");t.push(s[0],s[1],s[2])}else t.push(e[a]);return t}),[]);Object(s.useEffect)((()=>{if(A){let e=[];for(let t of A){fe(t).forEach((t=>{e.includes(t)||e.push(t)}))}H(e)}}),[A,fe]);const ve={onChange:(e,t)=>{E||re.suppliersPermission?X(e):X([])},selectedRowKeys:Q};return Object(O.jsxs)(b.a,{children:[Object(O.jsx)(h.a,{title:"Suppliers",actions:E||re.suppliersPermission?Object(O.jsxs)(p.a,{type:"button",className:"btn main",handleClick:()=>{t.push("/addsupplier")},children:[Object(O.jsx)(S.a,{className:"icon"}),"Add Supplier"]}):""}),Object(O.jsx)(C.a,{onActive:()=>{ae(!0)},onIdle:()=>{ae(!1)},onLogout:()=>{ce(!0)}}),Object(O.jsx)(j.a,{loading:P,data:A.map((e=>({...e,key:e.id}))),columns:q,setColumns:G,defaultColumns:he,rowSelection:!(!E&&!re.suppliersPermission)&&ve,total:D,setCurrentPage:U,setPageSize:z,setSort:J,setFilters:V,filters:K,searchOptions:_,searchList:A,handleSearch:me,openArchive:()=>x(!0),openReports:()=>I(!0),handleConfirmArchive:async()=>{200===await Object(u.a)(a,Q)?(je(),g.b.success("Supplier record archived successfully!"),n.current.loadArchive(),X([])):g.b.error("Something's gone wrong, refresh page or contact your system admin")},handleCancelArchiving:()=>{X([])},removeableColumns:he.filter((e=>"Supplier"!==e.title&&e.title)).map((e=>e.title))}),Object(O.jsx)(w.a,{showReportModal:N,setShowReportModal:I,individualReportName:"supplier",individualList:A,list:A.map((e=>({id:e.id,name:"".concat(e.firstName+" "+e.lastName)}))),listLabel:"Supplier",filename:"supplier_report",tableFields:[{label:"Supplier",value:"supplierCompanyName",key:"supplierCompanyName"},{label:"Contact ",value:"phone_no",key:"phone_no"},{label:"Email",value:"email",key:"email"},{label:"Status",value:"status",key:"status"},{label:"Location",value:"location",key:"location"},{label:"NetTerms",value:"netTerms",key:"netTerms"},{label:"W-8Ben",value:"w8Bene",key:"w8Bene"},{label:"D-590",value:"d590",key:"d590"},{label:"W-9",value:"w9",key:"w9"},{label:"A-1099",value:"a1099",key:"a1099"},{label:"Certificate Of Insurance",value:"certificateOfInsurance",key:"certificateOfInsurance"},{label:"Contract Start Date",value:"contractStartDate",key:"contractStartDate"},{label:"Contract End Date",value:"contractEndDate",key:"contractEndDate"}],pdfFormatter:l.a.supplierPdfFormat,csvExcelFormatter:l.a.supplierCSVExcel}),Object(O.jsx)(y,{open:v,setOpen:x,ref:n})]})}},798:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));a(800);var s=a(1);const c=e=>Object(s.jsxs)("div",{className:"tablelink-container",children:[Object(s.jsx)("span",{onClick:e.onClick,className:"tablelink ".concat(e.styleRed&&"red"," ").concat(e.className&&e.className),children:e.label}),e.extra&&Object(s.jsx)("span",{className:"table-link-extra",children:e.extra})]})},806:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));a(807);var s=a(1);const c=e=>{let{name:t,location:a,...c}=e;return Object(s.jsxs)("div",{className:"client-details-container",children:[Object(s.jsx)("span",{children:t}),Object(s.jsx)("span",{children:a}),c.extra&&Object(s.jsx)("span",{children:c.extra})]})}},807:function(e,t,a){},839:function(e,t,a){"use strict";a.d(t,"d",(function(){return i})),a.d(t,"c",(function(){return d})),a.d(t,"f",(function(){return p})),a.d(t,"e",(function(){return b})),a.d(t,"b",(function(){return h})),a.d(t,"a",(function(){return j}));var s=a(25),c=a(13),n=a(16),r=a.n(n);const o="".concat(s.a.serverURL,"/supplier"),l=e=>{var t,a;if(!e.response)throw new Error;return 401===(null===(t=e.response)||void 0===t?void 0:t.status)&&c.a.logout(),{status:null===(a=e.response)||void 0===a?void 0:a.status,err:e}},i=async function(e){let t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";const a="".concat(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"").concat(t);return await u(e,a)},u=async function(e,t){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";try{const s=await r.a.get("".concat(o).concat(t).concat(a),{headers:e});let c={};return 200===s.status&&(c.tableData=(e=>e.map((e=>({...e}))))(s.data),c.totalItems=s.headers["total-elements"],c.statusCode=s.status),c}catch(n){var s;return 401===n.response.status&&c.a.logout(),{statusCode:null===(s=n.response)||void 0===s?void 0:s.status}}},d=async(e,t)=>{try{const a=await r.a.get("".concat(s.a.serverURL,"/supplier/").concat(t),{headers:e});let c={};return 200===a.status&&(c.supplierData=a.data,c.supplierDetails=a.data,c.statusCode=a.status),c}catch(c){var a;return console.log(c),{statusCode:null===(a=c.response)||void 0===a?void 0:a.status}}},p=async(e,t,a)=>{try{const c=await r.a.patch("".concat(s.a.serverURL,"/supplier/").concat(a),t,{headers:e});if(200===c.status)return{statusCode:200,data:c.data};if(401===c.status)return{statusCode:401}}catch(c){return console.log(c),{statusCode:c.response.status}}},b=async(e,t,a,s,c)=>{try{const n=s||c?s?"?dropdownFilter=true&pageNo=".concat(t-1,"&pageSize=").concat(a,"&").concat(s):"?dropdownFilter=true&pageNo=".concat(t-1,"&pageSize=").concat(a):"?pageNo=".concat(t-1,"&pageSize=-1"),l=c?await r.a.put("".concat(o).concat(n),c,{headers:e}):await r.a.get("".concat(o).concat(n),{headers:e});if(200===l.status)return{data:l.data,totalItems:l.headers["total-elements"],status:l.status}}catch(n){return l(n)}},h=async(e,t,a)=>{try{const c=await r.a.get("".concat(s.a.serverURL,"/supplier?archives=true&pageNo=").concat(t-1,"&pageSize=").concat(a),{headers:e});if(c)return{data:c.data.map((e=>{var t,a,s;return{id:e.id,cellOne:e.supplierCompanyName,cellTwo:"".concat(e.firstName," ").concat(e.lastName),cellThree:e.email,cellFour:e.phone_no,cellFive:"".concat(null===(t=e.address)||void 0===t?void 0:t.city,", ").concat(null===(a=e.address)||void 0===a?void 0:a.country,", ").concat(null===(s=e.address)||void 0===s?void 0:s.state),cellSix:e.designation,cellSeven:e.website}})),totalItems:c.headers["total-elements"]}}catch(c){console.log(c)}},j=async(e,t)=>{try{const a=await r.a.all(t.map((t=>r.a.delete("".concat(o,"/").concat(t),{headers:e}))));if(a.length)return a[0].status}catch(a){return l(a)}}}}]);