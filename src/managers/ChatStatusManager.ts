import GD from "../GD";

class ChatStatusManager {
  private currentChatUID: string | null = null;
  private currentUser: ProfileVO | null = null;
  private chatUsers: Map<string, Array<string>> = new Map();
  private chatReadByUser: Map<string, Map<string, { lastReadMsgNum: number }> | undefined> = new Map();
  private chatLastMsgNum: Map<string, number> = new Map();

  constructor() {
    GD.S_CHAT_OPENING.add((cvo) => {
      this.currentChatUID = cvo.uid;
      this.chatUsers.set(
        this.currentChatUID,
        cvo.users.map((user) => user.uid)
      );
      this.chatLastMsgNum.set(this.currentChatUID, cvo.message.num);
    });

    GD.S_AUTH_COMPLETE.add((data) => {
      this.currentUser = data.profile;
    });

    GD.S_WS_MSG.add((packet) => {
      if (packet.method === "msgAdd" || packet.method === "msgChange" || packet.method === "msgRemove") {
        packet.data &&
          GD.S_CHAT_STATUS_READ.invoke({
            chatUID: packet.data?.chatUID,
            userUID: packet.data?.user_uid,
            lastReadMsgNum: packet.data?.num,
          });
        this.chatLastMsgNum.set(packet.data?.chatUID, packet.data?.num);
        console.log(this.chatReadByUser, packet.data);

        return;
      }

      packet.data &&
        GD.S_CHAT_STATUS_READ.invoke({
          chatUID: packet.data?.chatUID,
          userUID: packet.data?.userUid,
          lastReadMsgNum: this.chatLastMsgNum.get(packet.data?.chatUID) || 0,
        });

      console.log(this.chatReadByUser, packet.data, this.chatLastMsgNum);
    });

    GD.REQ_LAST_READ_MSG.listener = (data: { chatUID: string }, callback: (value: { lastReadMsgNum: number } | undefined) => void) => {
      this.chatReadByUser.get(data.chatUID)?.forEach((value, key) => {
        if (this.currentUser?.uid !== key) {
          callback(value);
        }
      });
    };

    GD.S_CHAT_STATUS_READ.add((data: { chatUID: string; userUID: string; lastReadMsgNum: number }) => {
      this.chatReadByUser.set(data?.chatUID, new Map().set(data.userUID, { lastReadMsgNum: data.lastReadMsgNum }));
    });

    GD.S_SERVICE_READY.invoke("chatStatusManager");
  }
}

export default ChatStatusManager;
