import GD from "../GD";

class ChatUsersStatusManager {
  private usersInChat: Map<string, Map<string, { active: boolean }> | undefined> = new Map();

  constructor() {
    GD.S_WS_MSG.add((packet) => {
      if (packet.method === "chatUserEnter") {
        packet.data &&
          GD.S_CHAT_USER_STATUS_CHANGED.invoke({
            chatUID: packet.data?.chatUID,
            userUID: packet.data?.userUid,
            active: true,
          });
        //user leave from all other chats
        this.usersInChat.forEach((value, key) => {
          GD.S_CHAT_USER_STATUS_CHANGED.invoke({
            chatUID: key,
            userUID: packet.data?.userUid,
            active: false,
          });
        });
      }
      // TODO: get information about method names
      if (packet.method === "chatUserLeave") {
        packet.data &&
          GD.S_CHAT_USER_STATUS_CHANGED.invoke({
            chatUID: packet.data?.chatUID,
            userUID: packet.data?.userUid,
            active: false,
          });
      }
    });

    GD.REQ_USERS_IN_CHAT.listener = (data: { chatUID: string }, callback: (value: Map<string, { active: boolean }> | undefined) => void) => {
      callback(this.usersInChat.get(data.chatUID));
    };

    GD.S_CHAT_USER_STATUS_CHANGED.add((data: { chatUID: string; userUID: string; active: boolean }) => {
      if (this.usersInChat.get(data?.chatUID)) {
        this.usersInChat.get(data?.chatUID)?.set(data.userUID, { active: data.active });
        return;
      }
      this.usersInChat.set(data?.chatUID, new Map().set(data.userUID, { active: data.active }));
    });

    GD.S_SERVICE_READY.invoke("chatUsersStatusManager");
  }
}

export default ChatUsersStatusManager;
