import GD from "../GD";

export class FilePreviewManager {
  uploadingFiles: Map<string, Map<string, UploadingFileVO>> = new Map();
  private chatUID: string | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    GD.S_CHAT_OPENED.add((data) => {
      this.chatUID = data.uid;
    });

    GD.REQ_FILE_PREVIEW_GET_BY_UID.listener = (chatUID: string, callback: (fileList: Map<string, UploadingFileVO> | undefined) => void) => {
      const uploadingFiles = this.uploadingFiles.get(chatUID);
      callback(uploadingFiles);
    };

    GD.S_FILE_PREVIEW_ATTACH.add((fileList: File[] | null) => {
      GD.S_LOG.invoke(fileList);
      if (!fileList || !this.chatUID) return;

      GD.S_LOG.invoke(fileList);

      for (let i = 0; i < fileList.length; i++) {
        const tempUID: string = btoa(Math.random() * 10000 + "_" + +new Date());
        const file = fileList[i];
        if (!file) continue;
        const fileObj: UploadingFileVO = {
          file: file,
          tempUID: tempUID,
          chatUID: this.chatUID,
          status: "start",
          started: +new Date(),
        };

        if (this.uploadingFiles.get(this.chatUID)) {
          this.uploadingFiles.get(this.chatUID)?.set(tempUID, fileObj);
        } else {
          const newChatFilesMap: Map<string, UploadingFileVO> = new Map();

          newChatFilesMap.set(tempUID, fileObj);
          this.uploadingFiles.set(this.chatUID, newChatFilesMap);
        }
      }
    });

    GD.S_FILE_PREVIEW_DELETE.add((tempUID: string) => {
      this.chatUID && this.uploadingFiles.get(this.chatUID)?.delete(tempUID);
    });

    GD.S_FILE_PREVIEW_DELETE_ALL.add((chatUID: string) => {
      this.uploadingFiles.delete(chatUID);
    });

    GD.S_SERVICE_READY.invoke("filePreviewManager");
  }
}
