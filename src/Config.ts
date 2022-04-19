import GD from "./GD";

class Config {
  webrtc = [
    { url: "stun:stun01.sipphone.com" },
    { url: "stun:stun.ekiga.net" },
    { url: "stun:stun.fwdnet.net" },
    { url: "stun:stun.ideasip.com" },
    { url: "stun:stun.iptel.org" },
    { url: "stun:stun.rixtelecom.se" },
    { url: "stun:stun.schlund.de" },
    { url: "stun:stun.l.google.com:19302" },
    { url: "stun:stun1.l.google.com:19302" },
    { url: "stun:stun2.l.google.com:19302" },
    { url: "stun:stun3.l.google.com:19302" },
    { url: "stun:stun4.l.google.com:19302" },
    { url: "stun:stunserver.org" },
    { url: "stun:stun.softjoys.com" },
    { url: "stun:stun.voiparound.com" },
    { url: "stun:stun.voipbuster.com" },
    { url: "stun:stun.voipstunt.com" },
    { url: "stun:stun.voxgratia.org" },
    { url: "stun:stun.xten.com" },
    /*{
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        },
        {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        },
        {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        }*/
  ];

  schemes: Schemes = {
    live: {
      api: "https://dccapi.dukascopy.com/",
      files: "https://dccfilesapi.dukascopy.com/?method=files.get&",
      ws: "wss://ws.dukascopy.com/",
      sequence: ".ap.iO.Oe.eT.tP.vHIqv.mI.xd.5WIJ",
    },
    pre: {
      api: "https://pre-dccapi-02.site.dukascopy.com/",
      files: "https://dccfilesapi.dukascopy.com/?method=files.get&",
      ws: "wss://ws1.dukascopy.com/",
      sequence: ".ap.iO.Oe.eT.tP.vHIqv.mI.xd.5WIJ",
    },
    test: {
      api: "https://loki.telefision.com/master/",
      files: "https://loki.telefision.com/master/?method=files.get&",
      ws: "wss://loki.telefision.com/wss/",
      sequence: ".ap.iO.Oe.eT.tP.vHIqv.mI.xd.5WIJ",
    },
    current: "live",
  };

  constructor() {
    GD.S_SHARED_OBJECT_READY.add((so) => {
      GD.S_LOG.invoke("SETUP SCEHEMES");
      if (
        so.scheme &&
        (so.scheme === "live" || so.scheme === "test" || so.scheme === "pre")
      )
        this.schemes.current = so.scheme;
    });

    GD.REQ_CONFIG_SCHEMES.listener = (data, cb) => {
      cb(this.schemes);
    };
    GD.S_SERVICE_READY.invoke("config");
  }
}
export default Config;
