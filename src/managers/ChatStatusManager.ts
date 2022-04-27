import GD from "../GD";

class ChatStatusManager {
  private currentChatUID: string | null = null;
  private chatUsers: Map<string, Array<string>> = new Map();
  private chatReadByUser: Map<string, Map<string, { lastReadMsgID: number }> | undefined> = new Map();
  private chatLastMsgID: Map<string, number> = new Map();

  constructor() {
    GD.S_CHAT_OPENING.add((cvo) => {
      this.currentChatUID = cvo.uid;
      this.chatUsers.set(
        this.currentChatUID,
        cvo.users.map((user) => user.uid)
      );
      this.chatLastMsgID.set(this.currentChatUID, cvo.message.id);
    });

    GD.S_WS_MSG.add((packet) => {
      if (packet.method === "msgAdd" || packet.method === "msgChange" || packet.method === "msgRemove") {
        packet.data &&
          GD.S_CHAT_STATUS_READ.invoke({
            chatUID: packet.data?.chatUID,
            userUID: packet.data?.user_uid,
            lastReadMsgID: packet.data?.id,
          });
        this.chatLastMsgID.set(packet.data?.chatUID, packet.data?.id);

        GD.REQ_USERS_IN_CHAT.invoke({ chatUID: packet.data?.chatUID }).then((result) => {
          result?.forEach((value, key) => {
            if (value.active) {
              GD.S_CHAT_STATUS_READ.invoke({
                chatUID: packet.data?.chatUID,
                userUID: key,
                lastReadMsgID: packet.data?.id,
              });
            }
          });
        });
        return;
      }

      if (packet.method === "chatUserEnter") {
        packet.data &&
          packet.data?.stat.map((user: any) =>
            GD.S_CHAT_STATUS_READ.invoke({
              chatUID: packet.data?.chatUID,
              userUID: user.uid,
              lastReadMsgID: user.lastID || 0,
            })
          );
        GD.S_CHAT_STATUS_READ.invoke({
          chatUID: packet.data?.chatUID,
          userUID: packet.data?.userUid,
          lastReadMsgID: this.chatLastMsgID.get(packet.data?.chatUID) || 0,
        });
      }
    });

    GD.REQ_LAST_READ_MSG.listener = (data: { chatUID: string }, callback: (value: Map<string, { lastReadMsgID: number }> | undefined) => void) => {
      callback(this.chatReadByUser.get(data.chatUID));
    };

    GD.S_CHAT_STATUS_READ.add((data: { chatUID: string; userUID: string; lastReadMsgID: number }) => {
      if (this.chatReadByUser.get(data?.chatUID)) {
        this.chatReadByUser.get(data?.chatUID)?.set(data.userUID, { lastReadMsgID: data.lastReadMsgID });
        return;
      }
      this.chatReadByUser.set(data?.chatUID, new Map().set(data.userUID, { lastReadMsgNum: data.lastReadMsgID }));
    });

    GD.S_SERVICE_READY.invoke("chatStatusManager");
  }
}

export default ChatStatusManager;
