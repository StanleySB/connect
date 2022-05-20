(this["webpackJsonpsupport-chat-widget"]=this["webpackJsonpsupport-chat-widget"]||[]).push([[5],{43:function(n,e,t){"use strict";t.r(e);var a,c,r,o,i,l,d,u,j,s,x,g,b,M,A,O,p=t(25),N=t(23),D=t(12),f=t(24),h=t(0),S=t(13),E=t(8),T=f.a.div(a||(a=Object(N.a)(['\n  position: "static";\n  width: 100vw;\n  height: 100vh;\n  top: 0;\n  left: 0;\n  background-color: #252833;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font: 12px Tahoma;\n']))),I=f.a.div(c||(c=Object(N.a)(["\n  width: 300px;\n  min-height: 400px;\n  background-color: #f0f0f0;\n  border-radius: 5px;\n"]))),k=f.a.div(r||(r=Object(N.a)(["\n  padding: 40px 20px 20px 20px;\n  min-height: 100px;\n  background-color: #ffffff;\n  border-radius: 5px 5px 0px 0px;\n  box-shadow: 0px 1px 1px rgb(0 0 0 / 10%);\n  font-size: 22px;\n  color: ",";\n  & > div {\n    font-size: 11px;\n    color: ",";\n  }\n"])),S.a.defaultColor,S.a.lightTextColor),C=f.a.div(o||(o=Object(N.a)(["\n  height: 300px;\n  padding: 20px 20px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n"]))),y=f.a.div(i||(i=Object(N.a)(["\n  display: flex;\n  flex-direction: column;\n"]))),L=f.a.input(l||(l=Object(N.a)(['\n  padding: 10px 10px 10px 40px;\n  border-radius: 4px;\n  margin: 10px 0px;\n  border: none;\n  box-shadow: 0px 2px 1px inset rgb(0 0 0 / 25%);\n  background-position: left 10px center;\n  background-repeat: no-repeat;\n  background-size: 18px auto;\n  &:focus {\n    outline: none;\n  }\n  &[name="login"] {\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJ2SURBVEhL7VY7aFRBFF3EXx0/IKgRwUrUXggWooKfoIKfwkpQWwsrDSIYEOwEEYvUioS024TdO/PezNtEVkHcysIPSkCN2gnR1fXcmbNhwaybfbuKxR64MO+8e8+de+e+T2GAAZZCmqZbk7Lfr6Zr0n8P1rqDRtysNb7Rasb4GWPSA3TrL4xx15D0Z0zmnhvxE2q6DslxDz5X6d4fJOLORXH/GZUdI70IJBzVe7H69DTp3iAiayE6h4p+WOv3kv4NSD4SfIx7VywW15DOj0T80ViJmyTVFlb8FH0Pk8oPiFxXMRF3gVRbYMguqi82MEYqPyAyHsSsO0OqLdCds0w8Tio/rM0uUewGqbZAd26qr1ZOKj9EKts4NK//NDQcwjfqWyr5YdK9AdU+ClUb9wAJVpJeRLVaXaX3YrXuIeneMT09u04rji13j/VZFZnZbK3domu0thqSin+ZZdkQw/qDkMi4+Vj5kvZRfejeHyTlbB8qfdFM0jxz2Ctcf2/y6oNWjzCsN/DZrFM8hfBorVZbbUxlh5qeuS37I9jME/rUEXOe4fmA8zsJQX4YwuCYMEiSXQb/VQ2Dd4Uz8Db4iFvQGN0gZbpDkiQb+OKv64sBYs+isJ9rSbCga9iXwGGiNSHW6JCb1w1RbvlAu24HUXF39Bof/O1I9Inc07SU7lHTdUgq7j3avj7EirvPjdzS62Wj0WisQGUfIPDNe7+RdAFneQitHdN2k4rPMDh05TgpvO3sJq1aN6NapDsjSSq7Q2XGC6muofOgGujKTlKdYUx2IrRK3F1SXQPx91SjtRMdoT9wSH4KtotU19BY1fgnP4MD/IcoFH4BgFtbCVPpFC0AAAAASUVORK5CYII=);\n  }\n  &[name="password"] {\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKrSURBVEhL7VY7ixRBEF5FEQMfGIvIJWpwiIoiKr4zUQMfgQYmYmSiiAoGgoH4BwwETTwxEEQDWYXjprq3q2c3WFDEB5qZCHLgJZ54cLp+1VOzzJ6ze3O7cyb6QbHMV131dVd19V3lP/oBEa00pr6BqLG62WwuVnp+kIjxDUP+gzW+lZohnjTGP61F/oAuLQ8QPALBryr0C0JvrOHn+HYpH4z8Y2ZepmGDwVp3BmI/kXjaEt+W8qorQEpdI388U4mXjUZjubr7g7XxNohOBTPusNK5kJNqFSDOj5TuDygxJyXks0p1wDk3VCO+YK3fId+jo80VWPtRYvruOfq4SRLg91Wr1VqgdBtBxPjxsAZ9r0XxTuFtxMeSOH4SFs4VCLymCS4q1QG0YbP4U5OTCy89x/cENjOJSVgUFs8FKNm9kLBLyVSgLmsg8oWovlZdFXBO+JkXsRBwQR4mwW67Un8giOPkM28xqvQiifXrlSoOCN8PpzHupFKFgdF6K7FyD5QqBumrBMK+4XJtVboQpOQhlvidUsWQFcWY7Fa6MCB4R+KR57pSswNP3qUQhBvZl2jER2W0kGO8cJmzopjJPUoH4KFYI49Ft2SY84WW3HnETiHHtI38IXX1BspyuZuoAJflk/q/o+cj1vJpea2I4oMhlvi1+GE/xKdhvZEVxejsVboDqTBsQn/zjGS0NKQ3sPsrEiSi2MA+pQOwiV3GxCfEsCY8jdVqdUn4S2T8TWzmAewuWnTVjbmNGjY7eIzXpaIo236l28BGnok/a+oaDDjJcBCGgFIdaAvL00l8S0xdgyFPWJ5HKX/SAn6f+ONhdZeDPGHpVzhlxv6qsFwanPqcWBzHq9RdDtrC5D/LvyrBdB7hO6XLykcqnGfzKowSLnWR25JnpZf3H0Sl8hvIbtqs7zMeyQAAAABJRU5ErkJggg==);\n  }\n  &[name="phone"] {\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAACFklEQVRYhe3WO2gVQRQG4C+JRqPRgA+wEDWoxChB7QTRUsHKIlhoZaMES7HQNHaWEqzEQlAUBQtFBd8QLLSwMUIaJeILXyBIxFdirsWc5W4Sb9Dcu8EiP2yx/5k5/78zZ+Ys0/iP0YyzGMRDrJ9K8SbcQyn3fMLGqRCfjZsh+gYduBbv77CmSPGGnNhbtAU/CzdyplYVZeBoiLzH2jGxJtyJ+AssLcLAxxDYVCE+F70x5nKtxevwLZK3TDBuc4x5VWsDcDuSd1WId+BDjOkpwsCuSP5YWpFK4lfQWISBRmlpS+jM8fVS9ZdwtSjxDPtDqF86lhnOBH+6SHGYiWchdiDHt+MXhrGuaBM7w8AgWnP8ieAfSZdToTgXYneVC3IeBoK/KNVGYVgoXccldOf4dqkxlXAJc/4wtwsPwuSyakzskPZ9BLtz/JaciSfYkIsdM7qLPseKakx0R6Lv2JrjV6IvYsM4iePxPoS9uF8LE3U4pfxPkO8TTdIX/1T+4iHlO6S5ViYacCESfZG2Jo82nJdWqXNMbKyJ5dWYyFZiGIeNPwXzK8zNm+idrAHSdhyRCrMUSVf/5dxWaat+GN9n/hnb8TpMfMUhE/eHxcoFe71a8QwtUuWPROKX2IcZE4j3Y0mtDGTYJt0F2SkYwEEskv4dM/G+MFMI6rEHT42+hLKnUPE8GqRGdkuqjc/SyVkwFeLTmBR+AzfGm+5rBiJBAAAAAElFTkSuQmCC);\n  }\n  &[name="code"] {\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAApUlEQVRIie3UPQ4BQRjG8R+FRK91As0eQuEKruAeDuMYIhodvUYiarVkacbar4bZVbD/ZIr3mcnzJO/MvHT8JQkOuEesE2Z15mNcIs3zIQWG2IXNNQYf9+AVktHDKohHjCLMawOWQbhiEmleCZgjxQ3TBswrAedQLHIHtthE1FlAX6lXgbSkv1sXaL1FtHzJfOGZ0vJHe9LqqHiSYN+Aee2w6/hBHr+lgAdKDY1mAAAAAElFTkSuQmCC);\n  }\n']))),w=f.a.div(d||(d=Object(N.a)(["\n  font-size: 10px;\n  margin: 10px 0px;\n  text-transform: uppercase;\n  color: ",";\n  position: relative;\n  padding: 4px 2px 1px 40px;\n  user-select: none;\n  display: inline-block;\n  text-align: left;\n  &:before {\n    background-color: rgba(42, 44, 53, 0.65);\n    border: 1px solid ",';\n    content: "";\n    display: block;\n    position: absolute;\n    left: 0;\n    top: 1px;\n    width: 30px;\n    height: calc(100% - 2px);\n    cursor: pointer;\n    transition: background-color 0.2s ease-in-out;\n    box-shadow: 0px 0px 5px inset rgb(0 0 0 / 20%);\n    border-radius: 2px;\n  }\n  &:after {\n    pointer-events: none;\n    background-color: #ffffff;\n    content: "";\n    display: block;\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 15px;\n    height: 100%;\n    transition: left 0.2s ease-in-out;\n    border: 1px solid ',';\n    border-radius: 3px;\n    box-shadow: 0px 1px 1px rgb(0 0 0 / 20%);\n  }\n  &[data-selected="true"] {\n    color: rgba(0, 0, 0, 1);\n  }\n  &[data-selected="true"]:before {\n    background-color: rgb(56, 171, 208);\n    transition: background-color 0.2s ease-in-out;\n  }\n  &[data-selected="true"]:after {\n    left: 15px;\n    transition: left 0.2s ease-in-out;\n  }\n'])),S.a.lightTextColor,S.a.lightBorderColor,S.a.lightBorderColor),m=f.a.div(u||(u=Object(N.a)(["\n  display: flex;\n  justify-content: center;\n"]))),v=f.a.button(j||(j=Object(N.a)(["\n  min-width: 60px;\n  border-radius: 5px;\n  margin: 0px 5px;\n  padding: 12px;\n  border: none;\n  background-color: ",";\n  text-transform: uppercase;\n  color: #fff;\n  transition: 0.1s;\n  box-shadow: 0px 2px 2px rgb(0 0 0 / 20%);\n  cursor: pointer;\n  &:hover {\n    background-color: #393a46;\n    box-shadow: 0px 1px 2px inset rgb(0 0 0 / 20%);\n  }\n  &:disabled {\n    background-color: ",";\n  }\n"])),S.a.defaultColor,S.a.disabledColor),U=f.a.div(s||(s=Object(N.a)(["\n  display: flex;\n  justify-content: center;\n  color: red;\n  word-break: break-word;\n  max-height: 50px;\n  overflow-y: scroll;\n"]))),z=function(){var n=Object(D.useState)("web"),e=Object(p.a)(n,2),t=e[0],a=e[1],c=Object(D.useState)(""),r=Object(p.a)(c,2),o=r[0],i=r[1],l=Object(D.useState)(!1),d=Object(p.a)(l,2),u=d[0],j=d[1],s=Object(D.useRef)(null),x=Object(D.useRef)(null),g=Object(D.useState)(!1),b=Object(p.a)(g,2),M=b[0],A=b[1];Object(D.useEffect)((function(){return h.a.S_AUTH_CODE_REQUESTED.add((function(){a("code"),j(!1),s.current&&(s.current.value="")}),"authpanel"),h.a.S_AUTH_ERROR.add((function(n){h.a.S_LOGE.invoke(n),i(n),j(!1)}),"authpanel"),function(){h.a.S_AUTH_CODE_REQUESTED.clearContext("authpanel"),h.a.S_AUTH_ERROR.clearContext("authpanel")}}));var O=function(n){if(console.log("DO SEND"+t),i(""),j(!0),"web"===t){if(!s.current||!x.current)return;console.log("DO SEND 1"+t),h.a.S_AUTH_REQUEST.invoke({login:s.current.value,password:x.current.value,remember:M})}else if("phone"===t){var e;if(!s.current)return;h.a.S_AUTH_REQUEST_BY_PHONE.invoke({phone:null===(e=s.current)||void 0===e?void 0:e.value})}else if("code"===t){var a;if(!s.current)return;h.a.S_AUTH_CHECK_CODE.invoke({code:parseInt(null===(a=s.current)||void 0===a?void 0:a.value),remember:M})}else console.error("Wrong state: "+t)},N=function(n){i(""),a(n)},f=null;return"web"===t?f=Object(E.jsxs)(I,{children:[Object(E.jsx)(k,{children:"Web Chat"}),Object(E.jsxs)(C,{children:[Object(E.jsxs)(y,{children:[Object(E.jsx)(L,{ref:s,type:"text",name:"login",placeholder:"Login"}),Object(E.jsx)(L,{ref:x,type:"password",name:"password",placeholder:"Password"}),Object(E.jsx)(w,{onClick:function(){return A(!M)},"data-selected":M,children:"Remember Me"}),o&&Object(E.jsx)(U,{children:o})]}),Object(E.jsxs)(m,{children:[Object(E.jsx)(v,{onClick:O,disabled:u,children:"Login"}),Object(E.jsx)(v,{onClick:function(){return N("phone")},disabled:u,children:"Enter by phone"})]})]})]}):"phone"===t?f=Object(E.jsxs)(I,{children:[Object(E.jsxs)(k,{children:["Web Chat",Object(E.jsx)("div",{children:"Please provide your phone number to get verification code via SMS"})]}),Object(E.jsxs)(C,{children:[Object(E.jsxs)(y,{children:[Object(E.jsx)(L,{ref:s,type:"phone",name:"phone",placeholder:"Phone"}),o&&Object(E.jsx)(U,{children:o})]}),Object(E.jsxs)(m,{children:[Object(E.jsx)(v,{onClick:O,disabled:u,children:"Login"}),Object(E.jsx)(v,{onClick:function(){return N("web")},disabled:u,children:"Enter by login"})]})]})]}):"code"===t&&(f=Object(E.jsxs)(I,{children:[Object(E.jsxs)(k,{children:["Web Chat",Object(E.jsx)("div",{children:"Please enter the confirmation code from the received SMS"})]}),Object(E.jsxs)(C,{children:[Object(E.jsxs)(y,{children:[Object(E.jsx)(L,{ref:s,type:"number",name:"code",placeholder:"Code"}),Object(E.jsx)(w,{onClick:function(){return A(!M)},"data-selected":M,children:"Remember Me"}),o&&Object(E.jsx)(U,{children:o})]}),Object(E.jsxs)(m,{children:[Object(E.jsx)(v,{onClick:O,disabled:u,children:"Login"}),Object(E.jsx)(v,{onClick:function(){return N("phone")},disabled:u,children:"Reenter Phone"}),Object(E.jsx)(v,{onClick:function(){return N("web")},disabled:u,children:"Enter by login"})]})]})]})),Object(E.jsx)(T,{children:f})},Q=f.a.div(x||(x=Object(N.a)(["\n    position:absolute;\n    background-color:#0011AA;\n    width:400px;\n    height:300px;\n"]))),R=function(){var n=Object(D.useState)(null),e=Object(p.a)(n,2),t=e[0],a=e[1],c=Object(D.useRef)(null),r=Object(D.useRef)(null);Object(D.useEffect)((function(){return h.a.S_CALL_PLACED.add((function(n){a(n)}),"call"),h.a.S_CALL_ACCEPTED.add((function(n){a(n)})),h.a.S_CALL_CALLEE_ACCEPT_CALL.add((function(n){a(n)})),h.a.S_CALL_LOCAL_MEDIA_READY.add((function(n){c.current&&n.localStream&&(c.current.srcObject=n.localStream)})),h.a.S_CALL_REMOTE_STREAM_READY.add((function(n){r.current&&n.remoteStream&&r.current.srcObject!==n.remoteStream&&(r.current.srcObject=n.remoteStream)})),function(){h.a.S_CALL_PLACED.clearContext("call")}}),[t]);var o=null;return t?(o=Object(E.jsxs)(E.Fragment,{children:[Object(E.jsx)("video",{ref:c,width:"320px",height:"240px",playsInline:!0,autoPlay:!0,muted:!0}),Object(E.jsx)("video",{ref:r,playsInline:!0,autoPlay:!0,muted:!0})]}),Object(E.jsx)(Q,{children:o})):null},Y=f.a.div(g||(g=Object(N.a)(["\n    position:absolute;\n    z-index:21;\n"]))),_=f.a.div(b||(b=Object(N.a)(["\n    width:200px;\n    height:300px;\n    background-color: red;\n"]))),P=f.a.div(M||(M=Object(N.a)(["\n    padding:10px;\n    background-color: #0059ff;\n    cursor:pointer;\n"]))),V=function(){var n=Object(D.useState)(null),e=Object(p.a)(n,2),t=e[0],a=e[1];if(Object(D.useEffect)((function(){return h.a.S_CALL_INCOMING.add((function(n){a({type:"incoming",data:n})}),"callDialogs"),function(){h.a.S_CALL_INCOMING.clearContext("callDialogs")}}),[]),!t)return null;var c=null;if("incoming"===t.type){c=Object(E.jsxs)(_,{"data-type":t.type,children:["Incoming call from: ",t.data.callee.name,Object(E.jsx)(P,{onClick:function(n){h.a.S_CALL_ACCEPT.invoke(t.data),a(null)},children:"ACCEPT"}),Object(E.jsx)(P,{onClick:function(n){h.a.S_CALL_DECLINE.invoke(t.data),a(null)},children:"DECLINE"})]})}return c?Object(E.jsxs)(Y,{children:["CALL DIALOGS ",c]}):null},B=t(41),G=t(26),H=t(30),Z=t(22),F=t(28);H.a.registerPlugin(F.a);var W,K,J,X,q,$,nn,en,tn,an,cn,rn,on,ln,dn,un,jn,sn,xn,gn,bn,Mn,An,On,pn,Nn,Dn,fn=f.a.div(A||(A=Object(N.a)(["\n    position:absolute;\n    z-index:2;\n    background-color:rgba(0,0,0,.4);\n    width:100%;\n    height:100%;\n    z-index:20;\n    backdrop-filter: blur(10px);\n    display:none;\n    transform:translateZ(1);\n"]))),hn=f.a.div(O||(O=Object(N.a)(["\n    background-color: 0;\n    width:100px;\n    height:100px;\n    position:absolute;\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size:cover;\n    border-radius: 6px;\n    transform:translateZ(1);\n"]))),Sn=null,En=null,Tn=function(){var n=Object(D.useRef)(null),e=Object(D.useRef)(null),t=function(t,a,c,r){n.current&&e.current&&(W&&W.kill(),n.current.style.backgroundImage="url(".concat(a,")"),n.current.style.backgroundSize="contain",W=Z.d.to(n.current,.2,{left:"10px",top:"10px",width:"calc(100% - 20px)",height:"calc(100% - 20px",ease:Z.c.easeOut}))},a=function(){var t;if(n.current){null===(t=W)||void 0===t||t.kill(),Sn=null;var a=-1,c=-1,r=-1,o=-1;if(En&&null!=e.current){var i=En.getBoundingClientRect(),l=i.x,d=i.y,u=e.current.getBoundingClientRect();a=l-u.x,c=d-u.y,r=i.width,o=i.height,n.current.style.backgroundImage=En.style.backgroundImage}W&&W.kill(),W=-1===a&&-1===c&&-1===r&&-1===o?Z.d.to(n.current,.2,{left:"50%",top:"50%",width:"0",height:"0",onComplete:function(){e.current&&e.current.style.removeProperty("display")},ease:Z.c.easeOut}):Z.d.to(n.current,.2,{left:a+"px",top:c+"px",width:r+"px",height:o+"px",onComplete:function(){e.current&&e.current.style.removeProperty("display")},ease:Z.c.easeOut})}};return Object(D.useEffect)((function(){return h.a.S_CHAT_OPEN_REQUEST.add((function(n){Sn=null,a()}),"lightbox"),h.a.S_IMAGE_DOWNLOAD_REQUEST.add((function(t){if("msg"===t.target&&(Sn=t.uid,t.src&&"nodeName"in t.src&&"div"===t.src.nodeName.toLowerCase())){var a=-1,c=-1;t.width&&t.height&&(a=parseInt(t.width),c=parseInt(t.height),(isNaN(a)||isNaN(c)||a<1||c<1)&&(a=-1,c=-1)),En=t.src,function(t,a,c,r,o){if(n.current&&e.current){var i=t.getBoundingClientRect(),l=i.x,d=i.y,u=e.current.getBoundingClientRect(),j=l-u.x,s=d-u.y;n.current.style.left=j+"px",n.current.style.top=s+"px",n.current.style.width=i.width+"px",n.current.style.height=i.height+"px",n.current.style.backgroundImage=t.style.backgroundImage,e.current.style.display="block",W&&W.kill(),W=Z.d.to(n.current,.2,{left:"calc(50% - 150px",top:"calc(50% - 150px",onComplete:function(){h.a.S_IMAGE_REQUEST.invoke({uid:a,thumb:!1,chatUID:c})},ease:Z.c.easeOut})}}(t.src,Sn,t.chatUID)}}),"lightbox"),h.a.S_IMAGE_READY.add((function(n){if(n.uid===Sn){var a=document.createElement("img");a.onload=function(c){e.current&&Sn&&t(0,n.b64,a.width,a.height)},a.src=n.b64}}),"lightbox"),function(){h.a.S_IMAGE_REQUEST.clearContext("lightbox"),h.a.S_IMAGE_READY.clearContext("lightbox"),h.a.S_CHAT_OPEN_REQUEST.clearContext("lightbox")}}),[]),Object(E.jsx)(fn,{ref:e,onClick:function(n){n.target===e.current&&(n.preventDefault(),n.stopPropagation(),a())},children:Object(E.jsx)(hn,{ref:n})})},In=t(29),kn=t(27),Cn=f.a.div(K||(K=Object(N.a)(["\n  color: ",';\n  font-family: "Open Sans", sans-serif;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 0.3;\n  max-width: 400px;\n  min-width: 350px;\n  /*background-color: rgba(0,0,0,.3);\n    box-shadow:0px 0px 20px rgba(0,0,0,.2);*/\n  height: calc(100% - 70px);\n  margin-top: 70px;\n'])),S.a.latestColor),yn=f.a.div(J||(J=Object(N.a)(["\n  color: ",";\n  position: relative;\n  overflow: auto;\n  flex-grow: 1;\n"])),S.a.latestColor),Ln=f.a.div(X||(X=Object(N.a)(["\n  position: absolute;\n  color: ",";\n  width: 100%;\n"])),S.a.latestColor),wn=f.a.div(q||(q=Object(N.a)(['\n  padding: 20px 12px 20px 12px;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  cursor: pointer;\n  border-left: 4px solid transparent;\n  &[data-selected="true"] {\n    background-color: #00000096;\n    border-left: 4px solid #e91e63;\n  }\n  color: #9ab2d2;\n  &[data-unread="true"] {\n    color: #ffffff;\n  }\n']))),mn=f.a.div($||($=Object(N.a)(["\n  display: flex;\n  flex-direction: column;\n  margin-left: 20px;\n  overflow: hidden;\n  flex-grow: 1;\n"]))),vn=f.a.div(nn||(nn=Object(N.a)(['\n  font-size: 14px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  &[data-unread="true"] {\n    font-weight: bold;\n  }\n']))),Un=f.a.div(en||(en=Object(N.a)(["\n  color: #afc8d4;\n  position: sticky;\n  font-size: 11px;\n  top: 0;\n  padding: 5px 10px 5px 10px;\n  margin-top: 20px;\n  margin-bottom: 20px;\n  background-color: #2d354e;\n  border-radius: 10px;\n  width: 100px;\n  text-align: center;\n  left: calc(50% - 60px);\n"]))),zn=Object(f.a)(vn)(tn||(tn=Object(N.a)(["\n  font-size: 12px;\n  margin-top: 5px;\n\n  &[data-author]::before {\n    content: attr(data-author);\n    display: inline-block;\n    font-size: 10px;\n    background-color: #374354;\n    padding: 3px 5px 3px 5px;\n    border-radius: 5px;\n    margin-right: 5px;\n    color: #aed086;\n  }\n"]))),Qn=Object(f.a)(vn)(an||(an=Object(N.a)(['\n  font-size: 11px;\n  width: 45px;\n  min-width: 45px;\n  text-align: right;\n  margin-right: 5px;\n  color: #ffffff85;\n  display: flex;\n  flex-direction: column;\n  &::after {\n    content: attr(data-unread);\n    color: #ffc107;\n    font-size: 15px;\n    margin-top: 2px;\n  }\n  &[data-unread="0"]::after {\n    display: none;\n  }\n']))),Rn=f.a.div(cn||(cn=Object(N.a)(["\n  width: 100%;\n  height: 120px;\n  margin-top: 3px;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover;\n  cursor: pointer;\n  border-radius: 3px;\n\n  &[data-author] {\n    background-position: center 23px;\n  }\n\n  &[data-author]::before {\n    content: attr(data-author);\n    display: inline-block;\n    font-size: 10px;\n    background-color: #374354;\n    padding: 3px 5px 3px 5px;\n    border-radius: 5px;\n    margin-right: 5px;\n    color: #aed086;\n  }\n"]))),Yn=Object(D.memo)((function(n){var e,t=(null===(e=n.message.sys)||void 0===e?void 0:e.additionalData.split(","))[0],a=n.message.chatUID,c=Object(D.useState)(null),r=Object(p.a)(c,2),o=r[0],i=r[1];return Object(D.useEffect)((function(){return h.a.S_IMAGE_REQUEST.invoke({uid:t,thumb:!0,chatUID:a}),h.a.S_IMAGE_READY.add((function(n){n.uid===t&&n.thumb&&(console.log("img uid",n.uid),i(n.b64))}),"li"+t),function(){h.a.S_IMAGE_READY.clearContext("li"+t)}}),[t,a]),Object(E.jsx)(Rn,{"data-author":n.author,style:{backgroundImage:"url(".concat(o)}})})),_n=function(n){var e=n.chatVO,t=e.title,a=e.uid,c=e.message,r=e.time,o=e.selected,i=e.author,l=e.unread,d=null;c&&(d="img"===c.type?Object(E.jsx)(Yn,{author:i,message:c}):Object(E.jsx)(zn,{"data-author":i,children:c.text}));var u=null;return"standalone"===n.chatVO.position&&(u=Object(E.jsx)(Un,{children:n.chatVO.date})),Object(E.jsxs)(E.Fragment,{children:[u,Object(E.jsxs)(wn,{"data-unread":l>0,"data-selected":o,onClick:function(e){e.shiftKey?h.a.S_LOG.invoke(n.chatVO):h.a.S_CHAT_OPEN_REQUEST.invoke({chatUID:a})},children:[Object(E.jsx)(kn.a,{user:"",avatar:""}),Object(E.jsxs)(mn,{children:[Object(E.jsx)(vn,{"data-unread":l>0,children:t}),d]}),Object(E.jsx)(Qn,{"data-unread":l,children:r})]})]})},Pn=function(){var n=Object(D.useState)([]),e=Object(p.a)(n,2),t=e[0],a=e[1];Object(D.useEffect)((function(){return h.a.S_LATEST_READY.add((function(n){a(Object(In.a)(n))}),"latestPanel"),h.a.S_LATEST_REQUEST.invoke({viaServer:!1}),h.a.S_LATEST_REQUEST.invoke({viaServer:!0}),function(){h.a.S_LATEST_READY.clearContext("latestPanel")}}),[]);var c=0,r=t.map((function(n){return Object(E.jsx)(_n,{chatVO:n},c++)}));return Object(E.jsx)(Cn,{children:Object(E.jsx)(yn,{children:Object(E.jsx)(Ln,{children:r})})})},Vn=f.a.div(rn||(rn=Object(N.a)(["\n  color: ",';\n  font-family: "Open Sans", sans-serif;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 0.3;\n  max-width: 400px;\n  min-width: 350px;\n  /*background-color: rgba(0,0,0,.3);\n    box-shadow:0px 0px 20px rgba(0,0,0,.2);*/\n  height: calc(100% - 70px);\n  margin-top: 70px;\n'])),S.a.latestColor),Bn=f.a.div(on||(on=Object(N.a)(["\n  color: ",";\n  position: relative;\n  overflow: auto;\n  flex-grow: 1;\n"])),S.a.latestColor),Gn=f.a.div(ln||(ln=Object(N.a)(["\n  position: absolute;\n  color: ",";\n  width: 100%;\n"])),S.a.latestColor),Hn=f.a.div(dn||(dn=Object(N.a)(['\n  padding: 20px 12px 20px 12px;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  cursor: pointer;\n  border-left: 4px solid transparent;\n  &[data-selected="true"] {\n    background-color: #00000096;\n    border-left: 4px solid #e91e63;\n  }\n']))),Zn=f.a.div(un||(un=Object(N.a)(["\n  display: flex;\n  flex-direction: column;\n  margin-left: 20px;\n  overflow: hidden;\n  flex-grow: 1;\n  font-size: 12px;\n  color: #9ab2d2;\n  & > div {\n    margin-top: 2px;\n  }\n"]))),Fn=f.a.div(jn||(jn=Object(N.a)(["\n  font-size: 14px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #ffffff;\n"]))),Wn=function(n){var e,t=n.memberVO,a=t.name,c=t.uid,r=t.city,o=t.companyPhone;return Object(E.jsx)(E.Fragment,{children:Object(E.jsxs)(Hn,{onClick:function(n){h.a.S_CHAT_OPEN_REQUEST.invoke({userUID:[c]})},children:[Object(E.jsx)(kn.a,{user:a,avatar:""}),Object(E.jsxs)(Zn,{children:[Object(E.jsx)(Fn,{children:a}),Object(E.jsxs)("div",{children:["City: ",r]}),Object(E.jsxs)("div",{children:["Departament: ",null===(e=n.departament)||void 0===e?void 0:e.title]}),Object(E.jsxs)("div",{children:["Company Phone: ",o]})]})]})})},Kn=function(){var n=Object(D.useState)([]),e=Object(p.a)(n,2),t=e[0],a=e[1],c=Object(D.useState)(new Map),r=Object(p.a)(c,2),o=r[0],i=r[1],l=Object(D.useState)(!1),d=Object(p.a)(l,2),u=d[0],j=d[1],s=Object(D.useState)(1),x=Object(p.a)(s,2),g=x[0],b=x[1],M=t.slice(0,50*g);return Object(D.useEffect)((function(){return h.a.S_MEMBERS_READY.add((function(n){a(Object(In.a)(n))}),"memberPanel"),h.a.S_DEPARTAMENTS_READY.add((function(n){i(n)}),"memberPanel"),h.a.S_MEMBERS_REQUEST.invoke(),function(){h.a.S_MEMBERS_READY.clearContext("memberPanel"),h.a.S_DEPARTAMENTS_READY.clearContext("memberPanel")}}),[]),Object(D.useEffect)((function(){u&&(b(g+1),j(!1))}),[u,g]),Object(E.jsx)(Vn,{children:Object(E.jsx)(Bn,{onScroll:function(n){n.target.scrollTop+n.target.clientHeight+100<n.target.scrollHeight||j(!0)},children:Object(E.jsx)(Gn,{children:M.map((function(n,e){return Object(E.jsx)(Wn,{memberVO:n,departament:o.get(n.department_id)},e)}))})})})},Jn=function(){return Object(E.jsx)("div",{children:"MENU PANEL"})},Xn=t(31),qn=f.a.div(sn||(sn=Object(N.a)(["\n  color: ",';\n  font-family: "Open Sans", sans-serif;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 0.3;\n  max-width: 400px;\n  min-width: 350px;\n  /*background-color: rgba(0,0,0,.3);\n    box-shadow:0px 0px 20px rgba(0,0,0,.2);*/\n  height: calc(100% - 70px);\n  margin-top: 70px;\n'])),S.a.latestColor),$n=f.a.div(xn||(xn=Object(N.a)(["\n  color: ",";\n  position: relative;\n  overflow: auto;\n  flex-grow: 1;\n"])),S.a.latestColor),ne=f.a.div(gn||(gn=Object(N.a)(["\n  position: absolute;\n  color: ",";\n  width: 100%;\n"])),S.a.latestColor),ee=f.a.div(bn||(bn=Object(N.a)(["\n  padding: 20px 0px 10px 20px;\n  color: rgba(238, 255, 245, 0.55);\n  text-transform: uppercase;\n"]))),te=function(n){var e=Object(D.useState)(),t=Object(p.a)(e,2),a=t[0],c=t[1],r=n.searchText;return Object(D.useEffect)((function(){return h.a.S_MESSENGER_SEARCH_READY.add((function(n){c(Object(Xn.a)({},n))}),"searchPanel"),function(){h.a.S_MESSENGER_SEARCH_READY.clearContext("searchPanel")}}),[]),Object(D.useEffect)((function(){h.a.S_MESSENGER_SEARCH_REQUEST.invoke(r)}),[r]),Object(E.jsx)(qn,{children:Object(E.jsx)($n,{children:Object(E.jsxs)(ne,{children:[Object(E.jsx)(ee,{children:"Chats:"}),null===a||void 0===a?void 0:a.latests.map((function(n,e){return Object(E.jsx)(_n,{chatVO:n},e)})),Object(E.jsx)(ee,{children:"Members:"}),null===a||void 0===a?void 0:a.members.map((function(n,e){return Object(E.jsx)(Wn,{memberVO:n,departament:a.departaments.get(n.department_id)},e)}))]})})})},ae=f.a.div(Mn||(Mn=Object(N.a)(['\n  position: "static";\n  width: 100vw;\n  height: 100vh;\n  top: 0;\n  left: 0;\n  background-color: #252833;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n']))),ce=f.a.div(An||(An=Object(N.a)(["\n  display: flex;\n  width: calc(100% - 50px);\n  /*max-width:700px;*/\n  height: calc(100% - 50px);\n  justify-content: center;\n"]))),re=f.a.div(On||(On=Object(N.a)(["\n  background: rgba(0, 0, 0, 0.3);\n"]))),oe=f.a.div(pn||(pn=Object(N.a)(['\n  width: 55px;\n  height: 55px;\n  background: rgba(1, 1, 1, 0.36);\n  cursor: pointer;\n  background-position: center center;\n  background-repeat: no-repeat;\n  background-size: 21px auto;\n  position: relative;\n  &[data-active="true"] {\n    background-color: #950a44;\n    &::after {\n      background: #f11873;\n      box-shadow: -1px 0px 1px rgba(0, 0, 0, 0.25);\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      right: 0;\n      width: 6px;\n      content: "";\n    }\n  }\n']))),ie=f.a.div(Nn||(Nn=Object(N.a)(["\n  background: rgba(0, 0, 0, 0.1);\n  z-index: 10;\n  max-width: 400px;\n  min-width: 350px;\n  padding: 20px;\n  position: fixed;\n"]))),le=f.a.input(Dn||(Dn=Object(N.a)(["\n  background: rgba(0, 0, 0, 0.25);\n  border-radius: 20px;\n  border: none;\n  padding: 7px 13px;\n  outline: none;\n  color: #d7ff97;\n  width: 100%;\n  &::placeholder {\n    color: #d7ff97;\n  }\n"]))),de=function(n){var e=Object(D.useState)(!1),t=Object(p.a)(e,2),a=t[0],c=t[1],r=n.icon,o=n.onClick,i=n.title,l=n.activeTab,d=n.tab;return Object(E.jsxs)(E.Fragment,{children:[Object(E.jsx)(G.a,{text:i,open:a,additioanalStyle:{right:"-60px"}}),Object(E.jsx)(oe,{style:{backgroundImage:"url(".concat(r,")")},onClick:o,onMouseOver:function(){return c(!0)},onMouseOut:function(){return c(!1)},"data-active":l===d})]})};e.default=function(n){var e=Object(D.useState)("wait"),t=Object(p.a)(e,2),a=t[0],c=t[1],r=Object(D.useState)("latest"),o=Object(p.a)(r,2),i=o[0],l=o[1],d=Object(D.useState)(""),u=Object(p.a)(d,2),j=u[0],s=u[1];Object(D.useEffect)((function(){return h.a.S_NEED_AUTHENTICATE.add((function(){c("auth")}),"messenger"),h.a.S_AUTH_CHECK.invoke((function(n){c(n?"chat":"auth")})),h.a.S_AUTH_COMPLETE.add((function(n){c("chat")})),function(){h.a.S_REQUEST_AUTHENTICATE.clearContext("messenger")}}),[]),Object(D.useEffect)((function(){j.length>=3?l("search"):l("latest")}),[j]);var x=Object(E.jsx)("div",{children:"WAIT"});return"auth"===a?x=Object(E.jsx)(z,{}):"chat"===a&&(x=Object(E.jsxs)(ae,{children:[Object(E.jsx)(V,{}),Object(E.jsx)(Tn,{}),Object(E.jsxs)(ce,{children:[Object(E.jsx)(Jn,{}),Object(E.jsxs)(re,{children:[Object(E.jsx)(de,{onClick:function(){return l("latest")},icon:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMSAyMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjUgMS41MzY5N2UtMDZDNC43MTA0NSAxLjUzNjk3ZS0wNiAwIDQuNzEwNDUgMCAxMC41QzAgMTIuMjE5NSAwLjQ1MjkyMiAxMy44MjY4IDEuMTg3NCAxNS4yNTk5TDAuMDQ5MjE5IDE5LjMzNDhDLTAuMjE1ODgxIDIwLjI4MTYgMC43MjAyNjIgMjEuMjE3NiAxLjY2NzI5IDIwLjk1MjhMNS43NDUyNiAxOS44MTQ2QzcuMTc3MTQgMjAuNTQ3NiA4Ljc4MjA3IDIxIDEwLjUgMjFDMTYuMjg5NSAyMSAyMSAxNi4yODk1IDIxIDEwLjVDMjEgNC43MTA0NSAxNi4yODk1IDAgMTAuNSAwVjEuNTM2OTdlLTA2Wk0xMC41IDEuNTc1QzE1LjQzODMgMS41NzUgMTkuNDI1IDUuNTYxNyAxOS40MjUgMTAuNUMxOS40MjUgMTUuNDM4MyAxNS40MzgzIDE5LjQyNSAxMC41IDE5LjQyNUM4LjkyNDE3IDE5LjQyNSA3LjQ1MDA3IDE5LjAxNTIgNi4xNjQ2NSAxOC4yOTkxQzUuOTgzNDYgMTguMTk4MSA1Ljc2OTc1IDE4LjE3MjcgNS41Njk5MiAxOC4yMjg0TDEuNjkxODkgMTkuMzEwMkwyLjc3NDcxIDE1LjQzNDJDMi44MzA2NCAxNS4yMzQgMi44MDUyMSAxNS4wMTk5IDIuNzAzOTUgMTQuODM4NEMxLjk4NjQyIDEzLjU1MjEgMS41NzUgMTIuMDc3NCAxLjU3NSAxMC41QzEuNTc1IDUuNTYxNyA1LjU2MTcgMS41NzUgMTAuNSAxLjU3NUwxMC41IDEuNTc1Wk02LjAzNzUgNy44NzVDNS43NTM1IDcuODcwOTkgNS40ODkzNCA4LjAyMDIgNS4zNDYxNiA4LjI2NTVDNS4yMDI5OSA4LjUxMDgxIDUuMjAyOTkgOC44MTQyIDUuMzQ2MTYgOS4wNTk1QzUuNDg5MzQgOS4zMDQ4MSA1Ljc1MzUgOS40NTQwMiA2LjAzNzUgOS40NUgxNC45NjI1QzE1LjI0NjUgOS40NTQwMiAxNS41MTA3IDkuMzA0ODEgMTUuNjUzOCA5LjA1OTVDMTUuNzk3IDguODE0MiAxNS43OTcgOC41MTA4MSAxNS42NTM4IDguMjY1NUMxNS41MTA3IDguMDIwMiAxNS4yNDY1IDcuODcwOTkgMTQuOTYyNSA3Ljg3NUg2LjAzNzVaTTYuMDM3NSAxMS41NUM1Ljc1MzUgMTEuNTQ2IDUuNDg5MzQgMTEuNjk1MiA1LjM0NjE2IDExLjk0MDVDNS4yMDI5OSAxMi4xODU4IDUuMjAyOTkgMTIuNDg5MiA1LjM0NjE2IDEyLjczNDVDNS40ODkzNCAxMi45Nzk4IDUuNzUzNSAxMy4xMjkgNi4wMzc1IDEzLjEyNUgxMi44NjI1QzEzLjE0NjUgMTMuMTI5IDEzLjQxMDcgMTIuOTc5OCAxMy41NTM4IDEyLjczNDVDMTMuNjk3IDEyLjQ4OTIgMTMuNjk3IDEyLjE4NTggMTMuNTUzOCAxMS45NDA1QzEzLjQxMDcgMTEuNjk1MiAxMy4xNDY1IDExLjU0NiAxMi44NjI1IDExLjU1SDYuMDM3NVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",title:"Latest",activeTab:i,tab:"latest"}),Object(E.jsx)(de,{onClick:function(){return l("members")},icon:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAyMSAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuNjIxMDkgMC4wOTk5OTk5QzMuOTgxMjkgMC4wOTk5OTk5IDMuNSAwLjc5OTk5OSAzLjUgMC43OTk5OTlDLTAuMTY0NSAwLjc5OTk5OSAxLjg1NzI2IDYuNjQ5MTIgMC43ODA2NjQgNy41MTE1MkMwLjc4MDY2NCA3LjUxMTUyIDEuNDQwNiA4LjMyNzczIDMuNSA4LjMyNzczVjkuMDI2MzdDMi45MzA5IDEwLjUwOSAwIDkuOTYwOSAwIDEyLjdINS42MTY0MUM2LjEwOTIxIDEyLjQwMTggNy43IDExLjU3NDggNy43IDExLjU3NDhDNy4zMTk5IDExLjE2ODggNi43NzE1NyAxMC40NjY4IDYuNTcyMDcgOS45MzU1NUM2LjEzNTI3IDkuNzE2NDUgNS43NjU5IDkuNDU4OTcgNS42IDkuMDI2MzdWOC4zMTk1M0M1LjczMyA4LjMxOTUzIDYuMTI1MTkgOC4yODg4MSA2LjI2MzA5IDguMjU4MDFDNS45NTA4OSA3Ljc3NzExIDUuNjg3NSA2LjY4MTAxIDUuNjg3NSA2LjA2NjQxQzUuNjg3NSA0LjUwMzMxIDYuMzYwNjUgMy4yMTc2MSA3LjQ3NzE1IDIuNDExOTFDNy4xNDA0NSAxLjEyMzIxIDYuMzkyOCAwLjA5OTk5OTkgNC42MjEwOSAwLjA5OTk5OTlINC42MjEwOVpNMTYuMSAwLjA5OTk5OTlDMTQuNTQzOSAwLjA5OTk5OTkgMTMuNTg4NCAxLjE3MDQ0IDEzLjM1NzQgMi41NzMyNEMxNC40ODg2IDMuMTc5NDQgMTUuMjI1IDQuNDg2MzMgMTUuMjI1IDYuMTMyMDNDMTUuMjI1IDYuNjQ2NTMgMTUuMTA1IDcuMTQxNiAxNC45NzQ4IDcuNTI1MTlDMTUuMDIzMSA3LjcxNDg5IDE1LjA1IDcuOTI2NDQgMTUuMDUgOC4xNjA5NEMxNS4wNSA5Ljg4OTk0IDEzLjMgMTEuNjE0NSAxMy4zIDExLjYxNDVDMTMuNjgwMSAxMS43ODA0IDE0Ljg5NjIgMTIuMzk4MyAxNS4zOTMyIDEyLjdIMjFDMjEgOS4wMjUgMTguMDE1OSAxMC4wNzUgMTcuNSA4LjVWNy40NUMxNy43MzI0IDcuMzMzMSAxOC4yODU5IDYuNTI4MjEgMTguMzU1OSA1Ljg5OTYxQzE4LjUzNzkgNS44ODU2MSAxOC45IDUuNDQwNjggMTguOSA1LjA0MjM4QzE4LjkgNC42NDQwOCAxOC43NzM0IDQuNDc2NTEgMTguNjYzNSA0LjQxMjExQzE4LjY2MzUgNC40MTIxMSAxOC45IDMuODg2MyAxOC45IDMuMjVDMTguOSAxLjk3NTMgMTguNTU1NiAwLjc5OTk5OCAxNy41IDAuNzk5OTk4QzE3LjUgMC43OTk5OTggMTcuMTk2OSAwLjA5OTk5ODUgMTYuMSAwLjA5OTk5ODVWMC4wOTk5OTk5Wk0xMC41IDIuOUM4LjYxNTYgMi45IDcuMDg3NSA0LjAzNTAxIDcuMDg3NSA2LjA2NjQxQzcuMDg3NSA2LjkyNTMxIDcuNTY4NzUgNy41OTQ5MiA3LjU2ODc1IDcuNTk0OTJDNy41Njg3NSA3LjU5NDkyIDcuMzUgNy43MDI0NCA3LjM1IDguMTYwOTRDNy4zNSA5LjA1MjA0IDcuOTIyODUgOS4yNjU2MyA3LjkyMjg1IDkuMjY1NjNDOC4wMDI2NSA5Ljk3MTIzIDkuMSAxMS4wMDQ3IDkuMSAxMS4wMDQ3VjEyLjE4NDZDOC41MTA2IDEzLjk1MjggNC45IDEyLjc4NzUgNC45IDE2LjlIMTYuMUMxNi4xIDEyLjc3MzUgMTIuNDg5NCAxMy45NTI4IDExLjkgMTIuMTg0NlYxMS4wMDQ3QzExLjkgMTEuMDA0NyAxMi45OTczIDkuOTcxMjMgMTMuMDc3MSA5LjI2NTYzQzEzLjA3NzEgOS4yNjU2MyAxMy42NSA4Ljg3MDA0IDEzLjY1IDguMTYwOTRDMTMuNjUgNy42Njk1NCAxMy40MzEyIDcuNTk0OTIgMTMuNDMxMiA3LjU5NDkyQzEzLjQzMTIgNy41OTQ5MiAxMy44MjUgNi44NDYwMyAxMy44MjUgNi4xMzIwM0MxMy44MjUgNC43MDA1MyAxMy4xMDY4IDMuNiAxMS45IDMuNkMxMS45IDMuNiAxMS4zODc2IDIuOSAxMC41IDIuOUwxMC41IDIuOVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",title:"Members",activeTab:i,tab:"members"})]}),Object(E.jsxs)("div",{children:[Object(E.jsx)(ie,{children:Object(E.jsx)(le,{value:j,onChange:function(n){return s(n.target.value)},placeholder:"Search..."})}),"members"===i&&Object(E.jsx)(Kn,{}),"latest"===i&&Object(E.jsx)(Pn,{}),"search"===i&&Object(E.jsx)(te,{searchText:j})]}),Object(E.jsx)(B.default,{sharedObject:n.sharedObject}),Object(E.jsx)(R,{}),Object(E.jsx)("div",{onClick:function(n){h.a.S_LOGOUT.invoke()},children:"LOGOUT"})]})]})),x}}}]);