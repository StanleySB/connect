import GD from "../GD";
import { Services } from "../utils/Services";

class ChatManager {
  private chat: ChatVO | undefined;
  //private messages:Map<number,MessageVO>=new Map();
  private sharedObject: SharedObjectVO | null = null;
  private authData: { profile: ProfileVO; key: string } | null = null;
  private uploadingFiles: Map<string, UploadingFileVO> = new Map();

  constructor() {
    GD.S_SHARED_OBJECT_READY.add((so) => {
      this.sharedObject = so;
    });

    GD.S_AUTH_COMPLETE.add((data) => {
      this.authData = data;
    });

    GD.S_WS_AUTHORIZED.add(async () => {
      if (!this.authData) return;

      if (this.sharedObject?.messenger) return;
    });

    GD.S_CHAT_OPENING.add((cvo) => {
      this.chat = cvo;
      GD.S_CHAT_OPENED.invoke(this.chat);

      if (cvo.pointID && cvo.pointID > 0) {
        GD.S_LOG.invoke("Start entry point: " + cvo.pointID);
        this.sendEntryPointStart("EP START");
      }

      GD.S_WS_SEND.invoke({
        method: "chatUserEnter",
        data: {
          chatUID: this.chat?.uid,
        },
      });
    });

    GD.REQ_CURRENT_CHAT.listener = (data, cb) => {
      if (this.chat) cb(this.chat);
    };

    GD.S_CHAT_MESSAGE_SEND_REQUEST.add(async (txt) => {
      if (!this.chat) {
        GD.S_ALERT_ERROR.invoke("Chat not loaded yet!");
        return;
      }
      let msg: string | null = null;

      // 1. prepare text
      txt = txt.replace(/^[\s\n\t\r]/gm, "");
      txt = txt.replace(/[\s\n\t\r]$/gm, "");
      txt = txt.replace(/ {2,}/gm, "");

      if (txt.length === 0) return;

      if (txt.length > 2000) {
        GD.S_ALERT_ERROR.invoke("Message too big!");
        return;
      }

      // 2. request pack
      let key = await GD.REQ_SECURITY_KEY.invoke({ chatUID: this.chat.uid });
      if (!key) return;

      msg = Services.pack(txt, key);

      // 3. send message
      GD.S_WS_SEND.invoke({
        method: "msgAdd",
        data: {
          chatUID: this.chat?.uid,
          text: msg,
        },
      });
      // 4. send epStarted
      if (this.chat.pointID && this.chat.pointID > 0) this.sendEntryPointStart(msg);
    });

    GD.S_CHAT_BOT_COMMAND_SEND_REQUEST.add((req) => {
      if (!this.chat) return;
      let msg: string = JSON.stringify({
        method: "botCommand",
        type: "chatSystem",
        title: req.title,
        action: req.action,
        actionData: req.actionData,
      });
      msg = Services.systemSequence + msg;
      var textToSend: string = "^" + req.botUID + "^" + Services.pack(msg, Services.companySequence);
      GD.S_WS_SEND.invoke({
        method: "msgAdd",
        data: {
          chatUID: this.chat?.uid,
          text: textToSend,
        },
      });
    });

    GD.S_CHAT_SCREENSHOT_SEND_REQUEST.add(async () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const video = document.createElement("video");

      if (!this.chat) return;

      if (!context) {
        GD.S_ALERT_ERROR.invoke("Can't capture screenshot");
        return;
      }

      let frame = null;
      try {
        const captureStream = await (navigator.mediaDevices as any).getDisplayMedia();
        video.srcObject = captureStream;
        context.drawImage(video, 0, 0, 1920, 1080);
        frame = canvas.toDataURL("image/png");
        captureStream.getTracks().forEach((track: any) => track.stop());
      } catch (err) {
        GD.S_ALERT_ERROR.invoke("Can't capture screenshot:\n" + err);
        return;
      }

      if (!frame) {
        GD.S_ALERT_ERROR.invoke("Can't capture screenshot:\nUnknown error");
        return;
      }

      GD.REQ_IMAGE_UPLOAD_AS_B64.invoke({
        fileName: "Screenshot_" + +new Date() + ".png",
        chatUID: this.chat.uid,
        b64: frame,
      });
    });

    GD.S_CHAT_FILE_SEND_REQUEST.add((chatUID: string) => {
      if (!this.chat) return;
      this.getFilesByChatUID(chatUID);
      this.fireFiles();
    });

    GD.S_IMAGE_REQUEST.add(async (req) => {
      if (!req.chatUID) return;
      const chat = await GD.REQ_CHAT.invoke({ chatUID: req.chatUID });
      if (!chat) return;
      let key = chat.securityKey;
      if (!key) return;
      const img = await GD.REQ_IMAGE_GET.invoke({
        thumb: req.thumb,
        imageUID: req.uid,
        key: key,
      });
      if (img) GD.S_IMAGE_READY.invoke({ uid: req.uid, b64: img, thumb: req.thumb });
    });

    GD.S_SHARED_OBJECT_READY.add((so) => {
      this.sharedObject = so;
    });

    GD.S_SERVICE_READY.invoke("chat");
  }

  private fireFiles(): void {
    const files = Array.from(this.uploadingFiles.values());
    files.sort((a, b) => {
      if (a.started > b.started) return 1;
      if (b.started > a.started) return -1;
      return 0;
    });
    GD.S_FILE_UPLOADING_LIST_UPDATED.invoke(files);
  }

  private onFileUploaded(tempUID: string, error: boolean) {
    const uf: UploadingFileVO | undefined = this.uploadingFiles.get(tempUID);
    if (!uf) return;
    uf.status = error ? "fail" : "finish";
    setTimeout(() => {
      console.log("Check timestatus");
      for (let i of this.uploadingFiles) {
        if (i[1].status !== "start") this.uploadingFiles.delete(i[1].tempUID);
      }
      this.fireFiles();
    }, 1000 * 3);
    this.fireFiles();
  }

  private sendEntryPointStart = (msg: string | null) => {
    if (!this.chat) return;
    GD.S_WS_SEND.invoke({
      method: "entryPointStart",
      data: {
        chatUID: this.chat?.uid,
        text: msg,
        pid: this.chat.pointID,
      },
    });
  };

  private async getFilesByChatUID(chatUID: string) {
    await GD.REQ_FILE_PREVIEW_GET_BY_UID.invoke(chatUID).then((result) => result && (this.uploadingFiles = result));
    this.uploadingFiles.forEach((file) => this.uploadFile(file.file, file.tempUID));
  }

  private async uploadFile(file: File | null, tempUID: string) {
    if (!file) return;

    if (!this.chat) return;

    //uploadingFiles

    let error = false;
    if (this.isImage(file)) {
      if (file.size > 1024 * 1024 * 30) {
        GD.S_ALERT_ERROR.invoke("Can't upload image:" + file.name + ", size too big: " + (file.size / 1024 / 1024).toFixed(2) + "mb");
        this.onFileUploaded(tempUID, true);
        return;
      }

      let key = this.chat.securityKey;
      GD.S_FILE_PREVIEW_DELETE_ALL.invoke(this.chat.uid);
      error = !(await GD.REQ_IMAGE_UPLOAD.invoke({ file: file, chatUID: this.chat.uid, secKey: key }));
    } else {
      if (file.size > 1024 * 1024 * 25) {
        GD.S_ALERT_ERROR.invoke("Can't upload file:" + file.name + ", size too big");
        this.onFileUploaded(tempUID, true);
        return;
      }
      GD.S_FILE_PREVIEW_DELETE_ALL.invoke(this.chat.uid);
      error = !(await GD.REQ_FILE_UPLOAD.invoke({ file: file, chatUID: this.chat.uid }));
    }

    this.onFileUploaded(tempUID, error);
  }

  private isImage(file: File): Boolean {
    console.log(file.type);
    if (file.type.indexOf("/image") !== -1) return false;

    return file.type.indexOf("jpeg") !== -1 || file.type.indexOf("jpg") !== -1 || file.type.indexOf("png") !== -1 || file.type.indexOf("gif") !== -1;
  }
}
export default ChatManager;
