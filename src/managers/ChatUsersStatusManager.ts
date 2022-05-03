import GD from "../GD";

class ChatUsersStatusManager {
  private usersInChat: Map<string, Map<string, { active: boolean }> | undefined> = new Map();
  private usersOnline: Map<string, { online: boolean }> = new Map();

  constructor() {
    GD.S_WS_MSG.add((packet) => {
      if (packet.method === "chatUserEnter" && packet.data) {
        GD.S_USER_IN_CHAT_STATUS_CHANGED.invoke({
          chatUID: packet.data?.chatUID,
          userUID: packet.data?.userUid,
          active: true,
        });
        //user leave from all other chats
        this.usersInChat.forEach((value, key) => {
          GD.S_USER_IN_CHAT_STATUS_CHANGED.invoke({
            chatUID: key,
            userUID: packet.data?.userUid,
            active: false,
          });
        });
        packet.data.users.map((user: any) =>
          GD.S_CHAT_USER_STATUS_CHANGED.invoke({
            userUID: user.uid,
            online: true,
          })
        );
      }
      // TODO: get information about method names
      if (packet.method === "chatUserLeave" && packet.data) {
        GD.S_USER_IN_CHAT_STATUS_CHANGED.invoke({
          chatUID: packet.data?.chatUID,
          userUID: packet.data?.userUid,
          active: false,
        });
      }

      if (packet.method === "userStatus" && packet.data) {
        const status = packet.data.status === "offline" ? false : true;
        GD.S_CHAT_USER_STATUS_CHANGED.invoke({
          userUID: packet.data.uid,
          online: status,
        });
      }
    });

    GD.REQ_USERS_IN_CHAT.listener = (data: { chatUID: string }, callback: (value: Map<string, { active: boolean }> | undefined) => void) => {
      callback(this.usersInChat.get(data.chatUID));
    };

    GD.REQ_USERS_STATUS.listener = (data: void, callback: (value: Map<string, { online: boolean }>) => void) => {
      callback(this.usersOnline);
    };

    GD.S_USER_IN_CHAT_STATUS_CHANGED.add((data: { chatUID: string; userUID: string; active: boolean }) => {
      if (this.usersInChat.get(data?.chatUID)) {
        this.usersInChat.get(data?.chatUID)?.set(data.userUID, { active: data.active });
        return;
      }
      this.usersInChat.set(data?.chatUID, new Map().set(data.userUID, { active: data.active }));
    });

    GD.S_CHAT_USER_STATUS_CHANGED.add((data: { userUID: string; online: boolean }) => {
      this.usersOnline.set(data?.userUID, { online: data.online });
    });

    GD.S_SERVICE_READY.invoke("chatUsersStatusManager");
  }
}

export default ChatUsersStatusManager;
