import GD from "../GD";
import DCCAPI from "../utils/DCCAPI";

class HTTP {
  private dccapi: DCCAPI = new DCCAPI();
  private url: string = "";
  private authKey: string = "web";
  constructor() {
    this.dccapi.debug = true;
    this.dccapi.log = (txt) => GD.S_LOG.invoke(txt);
    this.init();
  }
  private async init() {
    GD.S_AUTH_COMPLETE.add(async (prof) => {
      this.authKey = prof.key;
    });

    GD.REQ_HTTP.listener = async (req, callback) => {
      if (!this.url || this.url.indexOf("http") === -1) {
        const scehemes = await GD.REQ_CONFIG_SCHEMES.invoke();
        this.url = scehemes[scehemes.current].api;
      }

      this.dccapi.call(
        {
          key: this.authKey,
          url: this.url,
          encrypt: true,
          request: req,
        },
        callback
      );
    };
    GD.S_SERVICE_READY.invoke("http");
  }
}
export default HTTP;
