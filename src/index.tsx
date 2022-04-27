//import reportWebVitals from './reportWebVitals';
import CSS from "./views/CSS";
import Auth from "./managers/Auth";
import HTTP from "./net/HTTP";
import ChatManager from "./managers/ChatManager";
import Config from "./Config";
import WS from "./net/WS";
import GD from "./GD";
import { Images } from "./managers/Images";
import ReactDOM from "react-dom";
import { Files } from "./managers/Files";
import Logger from "./managers/Logger";
import preval from "preval.macro";
import Latest from "./managers/Latest";
import Messages from "./managers/Messages";
import Users from "./managers/Users";
import ToastManager from "./managers/ToastManager";
import ChatStatusManager from "./managers/ChatStatusManager";
import ChatUsersStatusManager from "./managers/ChatUsersStatusManager";
import Company from "./managers/Company";
import CallManager from "./managers/CallManager";
import { Services } from "./utils/Services";

class Main {
  static version = "3.0.8";

  static main() {
    let services = [
      Logger,
      Config,
      Images,
      Files,
      WS,
      HTTP,
      Auth,
      Messages,
      ChatManager,
      CallManager,
      Latest,
      Company,
      ToastManager,
      Users,
      ChatStatusManager,
      ChatUsersStatusManager,
    ];

    let done = 0;
    GD.S_SERVICE_READY.add((name) => {
      done++;
      GD.S_LOG.invoke("DCC -> Service initialized: " + name);
      if (done === services.length) {
        // ALL SERVICES INITIALIZED!
        this.checkSharedObject();
      }
    });

    for (let i in services) new services[i]();
  }

  static async checkSharedObject() {
    const win = window as unknown as any;
    if (!win["__DCCSharedObject"]) {
      setTimeout(() => this.checkSharedObject, 100);
      return;
    }

    const sharedObject = win["__DCCSharedObject"];

    if (typeof sharedObject != "object") {
      GD.S_LOGE.invoke("Dukascopy Connect -> Wrong shared object");
      return;
    }

    if (!sharedObject.placeHolderID) {
      GD.S_LOGE.invoke("Dukascopy Connect -> No placeholder id");
      return;
    }

    let href = document.location.href.split("?");

    if (href.length > 1) {
      // PARAMS
      const p = href[1].split("&");

      const params: SimpleObjectVO = {
        role: "payer",
        branch: "live",
        token: null,
        scheme: null,
        colors: null,
        mode: null, // messenger
        headless: false,
        ep: -1,
      };

      for (let i of p) {
        if (!i) continue;

        const tmp = i.split("=");
        let name = tmp[0];
        let value = tmp[1];

        if (name) name = name.replace(/^\s*|\s*$/gi, "").toLowerCase();

        if (value) value = value.replace(/^\s*|\s*$/gi, "");

        if (name in params) params[name] = value;
      }

      console.log(">>>> " + params);

      if (params.token != null) {
        if (params.role === "payer" && params.token) sharedObject.supportChatPayToken = params.token;

        if (params.role === "trader" && params.token) sharedObject.supportChatTraderToken = params.token;

        if (params.branch != null && params.role === "trader") {
          params.branch = params.branch.toLowerCase();
          if (params.branch === "live" || params.branch === "demo") sharedObject.branch = params.branch;
          // 2 live,
          // 3 demo
        }
      }

      if (params.headless) {
        sharedObject.headless = params.headless === "1" || params.headless.toLowerCase() === "true";
      }

      if (params.mode) {
        params.mode = params.mode.toLowerCase();
        if (params.mode === "messenger") sharedObject.messenger = true;
        if (params.mode === "mobile") sharedObject.mobile = true;
        if (params.mode === "widget") {
          sharedObject.mobile = false;
          sharedObject.messenger = false;
        }
      }

      if (params.ep > -1) sharedObject.supportChatEp = params.ep;

      if (params.colors !== null) sharedObject.colors = params.colors;

      if (params.scheme) {
        params.scheme = params.scheme.toLowerCase();
        if (params.scheme === "live" || params.scheme === "test" || params.scheme === "pre") sharedObject.scheme = params.scheme;
      }
    }

    // SETUP PLACEHOLDER
    const placeholder = document.getElementById(sharedObject.placeHolderID);
    if (!placeholder) {
      GD.S_LOGE.invoke("Dukascopy Connect -> No placeholder with id: " + sharedObject.placeHolderID);
      return;
    }

    if ("supportChatEp" in sharedObject) sharedObject.entryPointId = sharedObject.supportChatEp;

    if ("supportChatPayToken" in sharedObject) sharedObject.payerAuthToken = sharedObject.supportChatPayToken;

    if ("supportChatTraderToken" in sharedObject) sharedObject.traderAuthToken = sharedObject.supportChatTraderToken;

    if ("supportChatTitle" in sharedObject) sharedObject.title = sharedObject.supportChatTitle;

    GD.S_SHARED_OBJECT_READY.invoke(sharedObject as SharedObjectVO);

    if (sharedObject.colors) CSS.scheme = sharedObject.colors;

    GD.S_LOG.invoke(sharedObject);

    await this.run(sharedObject, placeholder);

    win["DCC_GD"] = GD; // REGISTERING GLOBAL DISPATCHER
    win["DCC_Services"] = Services; // REGISTERING SERVICES

    win.DCC_openChat = () => {
      GD.S_GUI_OPEN_CHAT.invoke();
    };
    win.DCC_closeChat = () => {
      GD.S_GUI_CLOSE_CHAT.invoke(null);
    };

    GD.S_GUI_CHAT_OPENED.add((req) => {
      if (win.onDCC_ChatOpened && typeof win.onDCC_ChatOpened === "function" && win.onDCC_ChatOpened.length === 0) win.onDCC_ChatOpened();
    });

    GD.S_GUI_CHAT_CLOSED.add((req) => {
      if (win.onDCC_ChatClosed && typeof win.onDCC_ChatClosed === "function" && win.onDCC_ChatClosed.length === 0) win.onDCC_ChatClosed();
    });

    win.__DCC_ver = () => {
      console.log(`Dukascopy Connect HTML Widget, version ${Main.version} @ ${preval`module.exports = new Date().toLocaleString();`}`);
    };

    win.__DCC_help = () => {
      console.log(`
        Dukascopy Connect
        available callback, registering in global scope:

        onDCC_ChatLoaded() - invokes when Dukascopy Connect Chat Widget ready to work.
        onDCC_ChatOpend() - invokes when Dukascopy Connect Chat Widget opened.
        onDCC_ChatClosed() - invokes when Dukascopy Connect Chat Widget closed.

        available methods:
        DCC_openChat() - will open chat window
        DCC_closeChat() - will close chat window
        DCC_changeLanguage() - will change language (ISO 639-1)

      `);
    };

    if (win.onDCC_ChatLoaded && typeof win.onDCC_ChatLoaded === "function" && win.onDCC_ChatLoaded.length === 0) win.onDCC_ChatLoaded();

    //'%c'+("Support "),"font-size: 20px; color: #46637b"
    GD.S_APP_READY.invoke();
    GD.S_REQUEST_AUTHENTICATE.invoke();
  }

  static async run(so: SharedObjectVO, placeholder: HTMLElement) {
    if (so.messenger) {
      const module = await import("./views/messenger/Messenger");
      const Messenger = module.default;
      ReactDOM.render(<Messenger sharedObject={so} />, placeholder);
    } else {
      const module = await import("./views/chat/Chat");
      const Chat = module.default;
      ReactDOM.render(<Chat sharedObject={so} />, placeholder);
    }
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
Main.main();
