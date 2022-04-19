(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
const ver = "3.0.6";
window['__DCC_LOADER_VERSION'] = ver;
const fetcher = (url) => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = e => {
            resolve({
                data: xhr.response,
                error: false,
                errorMessage: null
            });
        };
        xhr.onerror = e => {
            resolve({
                data: null,
                error: true,
                errorMessage: xhr.status + " " + xhr.statusText
            });
        };
        xhr.onabort = e => {
            resolve({
                data: null,
                error: true,
                errorMessage: "ABORT"
            });
        };
        xhr.open("GET", url);
        xhr.send();
    });
};
class Main {
    constructor() {
        //
        this.host = null;
        this.btn = null;
        this.placeholder = null;
        this.root = null;
        this.loadingSVG = `<div></div> <div></div> <div></div>`;
        this.chatSVG = `<svg class="dcc_startButtonSvg" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.31 18.505A7.287 7.287 0 0021.195 17c.788-.871 1.313-2.06 1.576-3.525.175-.95.263-2.138.219-3.604-.044-2.89-.92-5.109-2.584-6.653-.657-.713-1.664-1.228-3.021-1.624C15.895 1.198 14.23 1 12.348 1c-1.927 0-3.415.119-4.379.317-1.708.317-3.153 1.03-4.335 2.06a8.089 8.089 0 00-1.883 2.772 10.932 10.932 0 00-.744 3.683 14.426 14.426 0 00.438 4.04c.437 1.702 1.27 3.049 2.452 3.96a5.492 5.492 0 001.664.95c-.175.594-.438 1.743-.832 3.406-.088.396 0 .634.306.753.175.079.394.079.57 0 .087-.04.306-.159.613-.396 1.883-1.347 3.196-2.298 3.984-2.812 2.277.198 4.51.079 6.744-.396a7.873 7.873 0 002.365-.832z" stroke="currentColor" stroke-width="1.5"></path></svg>`;
        this.checkForBody();
    }
    checkForBody() {
        if (document && document.body)
            this.findTarget();
        else
            setTimeout(this.checkForBody, 100);
    }
    findTarget() {
        const scripts = document.body.getElementsByTagName("script");
        for (let i of scripts)
            if (i.src.indexOf("dccloader.js") !== -1)
                this.build(i);
    }
    setupPlaceholderStyles() {
        if (!this.placeholder)
            return;
        const style = document.createElement("style");
        let styles = `#${this.placeholder.id}{
            position:fixed;
            top:0;
            left:0;
            width:100vw;
            height:100vh;
            pointer-events: none;
            z-index:10000;
        }
        #${this.placeholder.id}r{
            width:100%;
            height:100%;
            position:relative;
            top:0;
            left:0;
        }
        #${this.placeholder.id}r>div{
            pointer-events: all;
        }`;
        style.innerHTML = styles.replace(/[\n\t\r]*/gm, "").replace(/[\s]{2,}/gm, "");
        document.head.appendChild(style);
    }
    drawButton() {
        if (!this.placeholder)
            return;
        const win = window;
        const sharedObject = win['__DCCSharedObject'];
        let rightOffset = "10px";
        let bottomOffset = "10px";
        const style = document.createElement("style");
        let styles = `#${this.placeholder.id}{
            position:fixed;
            top:0;
            left:0;
            width:100vw;
            height:100vh;
            pointer-events: none;
            z-index:10000;
        }
        #${this.placeholder.id}r{
            width:100%;
            height:100%;
            position:relative;
            top:0;
            left:0;
        }
        #${this.placeholder.id}r>div{
            pointer-events: all;
        }

        .dcc_startButton{
            position:absolute;
            right:${rightOffset};
            bottom:${bottomOffset};
            width: 62px;
            height: 62px;
            border-radius: 50%;
            color: #fff;
            cursor: pointer;
            background:content-box #cf1c1c;
            border: 6px solid rgba(217,38,38,.6);
            transition: border .2s, background-color .2s;
            pointer-events:all;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .dcc_startButton:hover{
            border: 6px solid rgba(255,255,255,1);
            background-color:#b71515;
        }
        .dcc_startButton[loading='1']:hover{
            border: 6px solid rgba(217,38,38,.6);
            background:content-box #cf1c1c;
        }

        .dcc_startButton[loading='1']{
            cursor: auto;
        }

        .dcc_startButtonSvg{
            width: 24px;
            height: 24px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .dcc_startButton[loading='1']>div{
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: 70%;
            height: 70%;
            border: 5px solid #fff;
            border-radius: 50%;
            animation: dcc_anumation_ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            border-color: #fff transparent transparent transparent;
          }
          .dcc_startButton[loading='1']>div:nth-child(1) {
            animation-delay: -0.45s;
          }
          .dcc_startButton[loading='1']>div:nth-child(2) {
            animation-delay: -0.3s;
          }
          .dcc_startButton[loading='1']>div:nth-child(3) {
            animation-delay: -0.15s;
          }

          @keyframes dcc_anumation_ring {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `;
        style.innerHTML = styles.replace(/[\n\t\r]*/gm, "").replace(/[\s]{2,}/gm, "");
        document.head.appendChild(style);
        this.btn = document.createElement("div");
        this.btn.className = "dcc_startButton";
        this.btn.innerHTML = this.chatSVG;
        this.placeholder.appendChild(this.btn);
        this.btn.onclick = async (e) => {
            if (this.btn && this.btn.getAttribute("loading") === "1")
                return;
            if (win['DCC_openChat'] && typeof win['DCC_openChat'] === "function") {
                win['DCC_openChat']();
                this.hideButton();
                return;
            }
            this.setupLoadingButton();
            const success = await this.loadChat();
            if (this.btn) {
                this.btn.removeAttribute("loading");
                this.btn.innerHTML = this.chatSVG;
            }
            if (success)
                this.hideButton();
        };
        win['onDCC_ChatClosed'] = () => {
            // CHAT CLOSED
            this.restoreButton();
        };
        win['onDCC_ChatOpened'] = () => {
            // CHAT OPENED
            this.hideButton();
        };
    }
    restoreButton() {
        if (!this.btn)
            return;
        this.btn.removeAttribute("loading");
        this.btn.innerHTML = this.chatSVG;
        this.placeholder?.appendChild(this.btn);
    }
    hideButton() {
        this.btn?.remove();
    }
    setupLoadingButton() {
        if (!this.btn)
            return;
        this.btn.setAttribute("loading", "1");
        this.btn.innerHTML = this.loadingSVG;
    }
    async loadChat() {
        const prom = new Promise(async (resolve, reject) => {
            const url = this.host + "asset-manifest.json";
            let result;
            let file;
            try {
                result = await fetcher(url);
                if (result.error) {
                    console.error("Can't attach support chat: " + result.errorMessage);
                    resolve(false);
                    return;
                }
                file = JSON.parse(result.data);
                if (!file || !file.entrypoints || !Array.isArray(file.entrypoints)) {
                    console.error("Can't attach support file, wrong data 2");
                    resolve(false);
                    return;
                }
            }
            catch (e) {
                console.error("Can't attach support chat, " + e);
                resolve(false);
                return;
            }
            console.log(file);
            // attach scripts
            for (let i in file.entrypoints) {
                const chunk = document.createElement("script");
                console.log(this.host + " " + file.entrypoints[i]);
                let src = this.host + file.entrypoints[i];
                const res = await fetcher(src);
                if (res.error) {
                    console.error(res.errorMessage);
                    break;
                }
                let data = res.data;
                if (src.toLowerCase().indexOf("runtime") > -1) {
                    // replace chunks
                    data = data.replace(/return\s*(i.p)\s*\+\s*\"(static\/js\/)"/, "return \"" + this.host + "static/js/\"");
                }
                chunk.innerHTML = data;
                document.body.appendChild(chunk);
                //chunk.remove();
            }
            resolve(true);
        });
        return prom;
    }
    async doOpenChat() {
        const win = window;
        if (win['DCC_openChat'] && typeof win['DCC_openChat'] === "function") {
            win['DCC_openChat']();
            return;
        }
        const success = await this.loadChat();
        if (!success) {
            console.error("Can't load chat");
            return;
        }
    }
    async build(el) {
        const tmp = el.src.split("/");
        tmp.pop();
        this.host = tmp.join("/") + "/";
        if (!el.parentElement) {
            console.error("Can't attach support widget, no placeholder found in dom");
            return;
        }
        // create placeholder
        let divID = btoa((Math.random() * 10000 + 1000) + "_" + new Date().getTime());
        divID = divID.replace(/[=+]*/gm, "");
        this.placeholder = document.createElement("div");
        this.placeholder.setAttribute("id", divID);
        el.parentElement.insertBefore(this.placeholder, el);
        el.remove();
        this.root = document.createElement("div");
        this.root.id = divID + "r";
        this.placeholder.appendChild(this.root);
        // create shared object
        const sharedObject = { placeHolderID: divID + "r" };
        for (let i of el.attributes) {
            let name = i.name;
            let index = name.indexOf("-");
            let protect = 0;
            while (index != -1 && index != name.length - 1) {
                let nextChar = name.substr(index + 1, 1).toUpperCase();
                name = name.substr(0, index) + nextChar + name.substr(index + 2);
                index = name.indexOf("-");
                if (protect++ === 255)
                    break;
            }
            let val = i.value;
            if (i.value === "true")
                val = true;
            if (i.value === "false")
                val = false;
            sharedObject[name] = val;
        }
        const win = window;
        win['__DCCSharedObject'] = sharedObject;
        // add loadchat
        win['DCC_loadChat'] = () => {
            if (!sharedObject.removeStartButton && this.btn)
                this.btn.click();
            else
                this.doOpenChat();
        };
        if (win['onDCCReady'] && typeof win['onDCCReady'] === "function")
            win['onDCCReady']();
        if (!sharedObject.removeStartButton)
            this.drawButton();
        else
            this.setupPlaceholderStyles();
    }
}
new Main();

},{}]},{},[1]);
