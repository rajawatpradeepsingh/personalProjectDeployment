(this.webpackJsonpreactfrontend=this.webpackJsonpreactfrontend||[]).push([[33],{1102:function(e,t,a){"use strict";a.r(t);var c=a(0),s=a(16),r=a.n(s),n=a(75),o=a(25),l=a(13),u=a(22),i=a(762),d=a(28),m=a(91),p=a(219),b=a(218),h=a(798),j=a(152),v=a(804),O=a(845),f=a(801),g=a(1);const y=Object(c.forwardRef)(((e,t)=>{let{open:a,setOpen:s,...r}=e;const n=Object(c.useMemo)((()=>l.a.getHeaders()),[]),[o,u]=Object(c.useState)(1),[i,d]=Object(c.useState)(0),[m,p]=Object(c.useState)([]),b=Object(c.useCallback)((async()=>{const e=await Object(O.a)(n,o,10);e&&(p(e.data),d(e.totalItems))}),[o,n]);return Object(c.useEffect)((()=>{b()}),[o,n,b]),Object(c.useImperativeHandle)(t,(()=>({loadArchive(){b()},length:m.length}))),Object(g.jsx)(f.a,{openArchive:a,setOpenArchive:s,loadArchive:b,archive:m,archivedData:"parameter",headers:["Param Type","Param Value","Param Level","Comments"],totalItems:i,setArchiveCurrentPage:u,archiveCurrentPage:o})}));var x=a(420),S=a(54),C=a(858),k=a(808),w=a(805);t.default=()=>{const[e,t]=Object(c.useState)([]),[a,s]=Object(c.useState)(0),f=o.a.ITEMS_PER_PAGE,[L,P]=Object(c.useState)(1),[A,E]=Object(c.useState)(!1),[R,N]=Object(c.useState)([]),[V,z]=Object(c.useState)(0),[T,I]=Object(c.useState)(1),[F,H]=Object(c.useState)({}),[M,U]=Object(c.useState)({}),B=Object(n.useHistory)(),[_,J]=Object(c.useState)([]),D=Object(d.b)(),[G,K]=Object(c.useState)([]),[q,Q]=Object(c.useState)(!1),[W,X]=Object(c.useState)(!0),[Y,Z]=Object(c.useState)([]),[$,ee]=Object(c.useState)(!1),[te,ae]=Object(c.useState)(10),ce=Object(c.useRef)(null),se=Object(c.useMemo)((()=>l.a.getHeaders()),[]);Object(c.useEffect)((()=>{l.a.hasAdminRole()&&Q(!0)}),[]);const re=Object(c.useCallback)((()=>{D(Object(m.b)(!1)),l.a.logout()}),[D]),[ne,oe]=Object(c.useState)(!0),[le,ue]=Object(c.useState)(!1),ie={onChange:e=>{Z(q?e:[])},selectedRowKeys:Y},de=Object(c.useCallback)((async()=>{let e="";for(const t in M)t&&(e+="&orderBy=".concat(t,"&orderMode=").concat(M[t]));const a=Object.keys(F).length?F:null;X(!0);const c=await Object(O.c)(se,L,te,e,a);c&&X(!1),200===c.status&&(t(c.data),s(c.totalItems)),200!==c.status&&x.b.error("Something's gone wrong, refresh page or contact your system admin")}),[F,L,te,se,M]);Object(c.useEffect)((()=>{de()}),[de,A]);const me=Object(c.useCallback)((e=>{B.push("/parameter/".concat(e))}),[B]),pe=Object(c.useCallback)((e=>H({...F,search:e})),[F]),be=Object(c.useCallback)((e=>{let t=[];for(let a in e)if("string"!==typeof e[a]&&"number"!==typeof e[a]||"[id]"===a||""===e[a])"object"===typeof e[a]&&(t=t.concat(be(e[a])));else if("paramType"===a){let c=e[a].split(", ");t.push(c[0],c[1],c[2])}else t.push(e[a]);return t}),[]);Object(c.useEffect)((()=>{if(e){let t=[];for(let a of e){be(a).forEach((e=>{t.includes(e)||t.push(e)}))}J(t)}}),[e,be]);const he=Object(c.useMemo)((()=>[{title:"Param Type",dataIndex:"paramType",key:"paramType",filters:S.b.map((e=>({text:e,value:e}))),render:(e,t)=>Object(g.jsx)(h.a,{label:e,onClick:()=>me(t.id)}),sorter:!0,filterMultiple:!1},{title:"Param Level",dataIndex:"paramLevel",key:"paramLevel",sorter:!0,render:e=>Object(g.jsx)("div",{style:{textAlign:"right",marginLeft:"10px"},children:e})},{title:"Param Value",dataIndex:"paramValue",key:"paramValue",sorter:!0,render:e=>Object(g.jsx)("div",{style:{textAlign:"right",marginLeft:"10px"},children:Number(e).toFixed(2)})},{title:"Comments",dataIndex:"comments",key:"comments",render:(e,t)=>Object(g.jsx)("div",{children:Object(g.jsx)("span",{children:e?"".concat(e.substring(0,40),"..."):""})})}]),[me]);Object(c.useEffect)((()=>{K(he)}),[he]);const je=Object(c.useCallback)((()=>{r.a.get("".concat(o.a.serverURL,"/parameter?archives=true&pageNo=").concat(T-1,"&pageSize=").concat(f),{headers:se}).then((e=>{e.data&&(z(e.headers["total-elements"]),N(e.data.map((e=>({id:e.id,cellOne:e.paramType,cellTwo:e.paramLevel,cellThree:e.paramValue,cellFour:e.comments?"".concat(e.comments.substring(0,50),"..."):""})))))})).catch((e=>{console.log(e),e.response&&401===e.response.status&&re()}))}),[T,f,se,re]);Object(c.useEffect)((()=>{je()}),[je,T]);return Object(c.useEffect)((()=>{de()}),[de,A]),Object(g.jsxs)(p.a,{children:[Object(g.jsx)(b.a,{title:"Parameter",actions:q&&Object(g.jsxs)(u.a,{type:"button",className:"btn main",handleClick:()=>{B.push("/addparameter")},children:[Object(g.jsx)(i.a,{className:"icon"}),"Add Parameter"]})}),Object(g.jsx)(j.a,{onActive:()=>{oe(!0)},onIdle:()=>{oe(!1)},onLogout:()=>{ue(!0)}}),Object(g.jsx)(v.a,{loading:W,data:e.map((e=>({...e,key:e.id}))),columns:G,setColumns:K,defaultColumns:he,rowSelection:ie,total:a,setCurrentPage:P,setPageSize:ae,setSort:U,setFilters:H,filters:F,searchOptions:_,searchList:e,handleSearch:pe,openArchive:()=>E(!0),handleConfirmArchive:async()=>{await r.a.all(Y.map((e=>r.a.delete("".concat(o.a.serverURL,"/parameter/").concat(e),{headers:se})))).then((e=>{de(),Z([]),x.b.success("Parameter record archived successfully!"),ce.current.loadArchive()})).catch((e=>{e.response&&401===e.response.status&&l.a.logout()}))},openReports:()=>ee(!0),handleCancelArchiving:()=>{Z([])},removeableColumns:he.filter((e=>"Param Type"!==e.title&&e.title)).map((e=>e.title))}),Object(g.jsx)(y,{open:A,setOpen:E,ref:ce}),Object(g.jsx)(w.a,{showReportModal:$,setShowReportModal:ee,individualReportName:"parameter",individualList:e,list:e.map((e=>({id:e.id,name:"".concat(e.paramType," (").concat(e.paramLevel,")")}))),listLabel:"Parameter",filename:"parameter_report",tableFields:Object(C.b)(),pdfFormatter:k.a.parameterPdfFormat,csvExcelFormatter:k.a.parameterCSVExcel})]})}},798:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));a(800);var c=a(1);const s=e=>Object(c.jsxs)("div",{className:"tablelink-container",children:[Object(c.jsx)("span",{onClick:e.onClick,className:"tablelink ".concat(e.styleRed&&"red"," ").concat(e.className&&e.className),children:e.label}),e.extra&&Object(c.jsx)("span",{className:"table-link-extra",children:e.extra})]})},814:function(e,t,a){"use strict";var c=a(2),s=a(0),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M296 250c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm184 144H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm-48 458H208V148h560v320c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h264c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm440-88H728v-36.6c46.3-13.8 80-56.6 80-107.4 0-61.9-50.1-112-112-112s-112 50.1-112 112c0 50.7 33.7 93.6 80 107.4V764H520c-8.8 0-16 7.2-16 16v152c0 8.8 7.2 16 16 16h352c8.8 0 16-7.2 16-16V780c0-8.8-7.2-16-16-16zM646 620c0-27.6 22.4-50 50-50s50 22.4 50 50-22.4 50-50 50-50-22.4-50-50zm180 266H566v-60h260v60z"}}]},name:"audit",theme:"outlined"},n=a(24),o=function(e,t){return s.createElement(n.a,Object(c.a)({},e,{ref:t,icon:r}))};t.a=s.forwardRef(o)},845:function(e,t,a){"use strict";a.d(t,"b",(function(){return l})),a.d(t,"d",(function(){return u})),a.d(t,"a",(function(){return i})),a.d(t,"c",(function(){return d}));var c=a(16),s=a.n(c),r=a(25),n=a(13);const o="".concat(r.a.serverURL,"/parameter"),l=async(e,t)=>{try{const a=await s.a.get("".concat(o,"/").concat(t),{headers:e});let c={};return 200===a.status&&(c.parameterdata=a.data,c.statusCode=a.status),c}catch(r){var a,c;return 401===(null===(a=r.response)||void 0===a?void 0:a.status)&&n.a.logout(),{statusCode:null===(c=r.response)||void 0===c?void 0:c.status}}},u=async(e,t,a)=>{try{const c=await s.a.patch("".concat(o,"/").concat(a),t,{headers:e});if(200===c.status)return{statusCode:200,data:c.data};if(401===c.status)return{statusCode:c.status}}catch(r){var c;return 401===r.response.status&&n.a.logout(),{statusCode:null===(c=r.response)||void 0===c?void 0:c.status}}},i=async(e,t,a)=>{try{const c=await s.a.get("".concat(r.a.serverURL,"/parameter?archives=true&pageNo=").concat(t-1,"&pageSize=").concat(a),{headers:e});if(c)return{data:c.data.map((e=>({id:e.id,cellOne:e.paramType,cellThree:e.paramLevel,cellFour:e.paramValue,cellFive:e.comments}))),totalItems:c.headers["total-elements"]}}catch(c){console.log(c)}},d=async(e,t,a,c,r)=>{try{const n=c||r?c?"?dropdownFilter=true&pageNo=".concat(t-1,"&pageSize=").concat(a,"&").concat(c):"?dropdownFilter=true&pageNo=".concat(t-1,"&pageSize=").concat(a):"?pageNo=".concat(t-1,"&pageSize=-1"),l=r?await s.a.put("".concat(o).concat(n),r,{headers:e}):await s.a.get("".concat(o).concat(n),{headers:e});if(200===l.status)return{data:l.data,totalItems:l.headers["total-elements"],status:l.status}}catch(l){return(e=>{var t,a;if(!e.response)throw new Error;return 401===(null===(t=e.response)||void 0===t?void 0:t.status)&&n.a.logout(),{status:null===(a=e.response)||void 0===a?void 0:a.status,err:e}})(l)}}},858:function(e,t,a){"use strict";a.d(t,"a",(function(){return r})),a.d(t,"b",(function(){return n}));var c=a(814),s=a(1);const r=()=>[{title:"Comments",icon:Object(s.jsx)(c.a,{style:{color:"var(--secondary-muted)",fontSize:"18px",marginBottom:"1px"}}),status:"finish"}],n=()=>[{label:"Param Value",value:"paramValue",key:"paramValue"},{label:"Param Level",value:"paramLevel",key:"paramLevel"},{label:"Comments",value:"comments",key:"comments"}]}}]);