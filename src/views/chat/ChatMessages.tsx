import React, { useEffect, useState, memo } from "react";
import styled from "styled-components";
import GD from "../../GD";
import { Services } from "../../utils/Services";
import Avatar from "../Avatar";
import CSS from "../CSS";
import MessageStatus from "../MessageStatus";
import ProgressBar from "../ProgressBar";
import { MessageBotCommand, MessageBotMenu, MessageFile, MessageImage } from "./ChatInnerMessages";

const ChatMessagesDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;
let currentChatUID: string | null = null;
let currentChatUsers: Array<string> = [];
let currentChatUsersNameByUID: Map<string, string> = new Map();
let everyUserReadMessageID: Array<number> = [];
let messageReadByUser: Map<string, { lastReadMsgID: number }> = new Map();

GD.S_CHAT_OPENING.add((data) => {
  currentChatUsers = data.users.map((user) => user.uid);
  data.users.map((user) => currentChatUsersNameByUID.set(user.uid, user.name));
  messageReadByUser = new Map();
});

GD.S_CHAT_OPEN_REQUEST.add((data) => {
  if (data.chatUID) currentChatUID = data.chatUID;
});

const ChatMessages = () => {
  const [messages, setMessages] = useState<MessageVO[]>([]);
  everyUserReadMessageID = currentChatUsers.map((user) => messageReadByUser.get(user)?.lastReadMsgID || 0);

  useEffect(() => {
    GD.S_CHAT_MESSAGES.add((data) => {
      if (currentChatUID !== data.chatUID) return;
      setMessages([...data.msgs]);
    }, "ChatMessages");

    GD.S_CHAT_STATUS_READ.add(() => {
      currentChatUID &&
        GD.REQ_LAST_READ_MSG.invoke({ chatUID: currentChatUID }).then((result) => {
          if (result) messageReadByUser = result;
        });
    }, "ChatMessages");

    GD.S_GUI_MESSAGES_RENDERED.invoke();

    return () => {
      GD.S_CHAT_MESSAGES.clearContext("ChatMessages");
      GD.S_CHAT_STATUS_READ.clearContext("ChatMessages");
    };
  });

  let msgs = null;
  let i = 0;
  if (messages && messages.length > 0) msgs = messages.map((val) => <ChatMessage message={val} key={i++} />);

  return <ChatMessagesDiv>{msgs}</ChatMessagesDiv>;
};

// CHAT MESSAGE
const ChatMessageTextDiv = styled.div`
  word-wrap: break-word;
  word-break: break-word;
  background-color: ${CSS.chatMessageBg};
  color: ${CSS.chatTextColor};
  flex-direction: column;
  &[data-mine="true"] {
    background-color: ${CSS.chatMessageBgLeft};
    color: ${CSS.chatMineTextColor};
  }
  &[data-mine="false"] div[data-type="link"] {
    background-color: ${CSS.linkBGColorRight};
    color: ${CSS.linkColorRight};
  }
  align-self: flex-end;
  padding: 15px 0 15px 0;
  border-radius: ${CSS.chatMessageBorderRadius};
  &[data-full-width="true"] {
    width: calc(100% - 50px);
  }
`;

const ChatAvatarHolderDiv = styled.div`
  position: absolute;
  bottom: 1px;
  left: -45px;
`;

const TextBaseDiv = styled.div`
  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

const TextItemLinkDiv = styled(TextBaseDiv)`
  background-color: ${CSS.linkBGColor};
  color: ${CSS.linkColor};
  cursor: pointer;
  padding: 8px;
  border-radius: 3px;
  margin: ${CSS.chatMessagePadding};
  box-sizing: border-box;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
  border: 1px dashed #2196f3;
  transition: background-color 0.2s;
  &:hover {
    text-decoration: underline;
    background-color: ${CSS.linkBGColorHover};
  }
`;

const TextItemVideo = styled.video`
  width: 100%;
  max-width: 434px;
  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
  margin: ${CSS.chatMessagePadding};
`;

const TextItemCodeDiv = styled(TextBaseDiv)`
  background-color: #0f2a38;
  max-height: 60vh;
  overflow: auto;
  white-space: pre;
  padding: 10px;
  font-family: monospace;
  font-size: 13px;
  color: #3bffd1;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin: ${CSS.chatMessagePadding};
`;
const TextItemCodeLineDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1px;
  &::before {
    content: attr(data-line);
    display: block;
    width: 25px;
    min-width: 25px;
    background-color: rgba(0, 0, 0, 0.2);
    border-right: 1px solid rgba(0, 0, 0, 0.6);
    margin-right: 8px;
    padding: 3px;
    color: rgba(255, 255, 255, 0.5);
  }
`;

const TextItemTextDiv = styled(TextBaseDiv)`
  margin: 0 15px 0 15px;
`;

const TextItem = (params: { data: { content: string; type: string } }) => {
  const { content, type } = params.data;
  if (type === "link") {
    const a = document.createElement("a");
    a.href = content;
    a.target = "_blank";
    a.style.display = "absoulte";
    const onLinkClick = (e: React.MouseEvent) => {
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    let txt = content;
    if (txt.length > 40) {
      txt = content.substr(0, 15) + "..." + content.substr(15);
      txt = txt.substr(0, 35);
    }

    if (content.toLowerCase().endsWith(".mp4")) {
      return (
        <>
          <TextItemVideo controls src={content}>
            <source src={content} type="video/mp4"></source>
          </TextItemVideo>
          <TextItemLinkDiv data-type="link" onClick={onLinkClick}>
            {content}
          </TextItemLinkDiv>
        </>
      );
    }

    return (
      <TextItemLinkDiv data-type="link" onClick={onLinkClick}>
        {content}
      </TextItemLinkDiv>
    );
  }
  if (type === "code") {
    const linesArr = content.split("\n");
    let i = 1;
    const lines = linesArr.map((val) => (
      <TextItemCodeLineDiv data-line={i} key={i++}>
        {val}
      </TextItemCodeLineDiv>
    ));
    return <TextItemCodeDiv data-type="code">{lines}</TextItemCodeDiv>;
  }
  return <TextItemTextDiv>{content}</TextItemTextDiv>;
};

//TODO: Compare text
const ChatMessageText = memo((params: { msg: MessageVO }) => {
  // Prepare text block
  //{quote type="quote-type" author="Igor Bloom [776]" dt="22.06.2021 - 14:59:01" target="24809"}у дамы явный талант{quote}

  // linkages
  let { text, mine } = params.msg;

  //TODO: cutoff scripts

  const blockMask = "%{blck#$}";
  const blocks: { type: string; content: string }[] = [];
  let needFullWidth = false;
  text = text.replace(
    /(\b((https:\/\/)|(http:\/\/)|(ftp:\/\/)|(www\.))((.*?)[^\s\n\t\r\v]*))|\n|{code}([\w\W]+?){code}|{code}([\w\W]+?){\/code}/gim,
    (a, b) => {
      if (a === "\n") {
        blocks.push({ type: "br", content: "" });
        return blockMask;
      }
      if (a.toLowerCase().startsWith("{code}")) {
        blocks.push({ type: "code", content: a.substr(6, a.length - 12) });
        needFullWidth = true;
        return blockMask;
      }
      blocks.push({ type: "link", content: a });
      return blockMask;
    }
  );

  const textBlocks = text.split(blockMask);
  const textBlocksArr: { type: string; content: string }[] = [];
  for (let i in textBlocks) {
    const tblock = textBlocks[i];
    if (tblock.length > 0) textBlocksArr.push({ type: "text", content: tblock });
    const block = blocks[i];
    if (block) textBlocksArr.push(block);
  }
  let i = 0;
  const blockitems = textBlocksArr.map((val) => <TextItem data={val} key={i++} />);

  // br, links, etc...
  let status = null;
  if (text === "+") {
    status = "plus";
  }
  if (text === "-") status = "minus";

  return (
    <ChatMessageTextDiv data-status={status} data-full-width={needFullWidth} data-mine={mine} data-type="message">
      {blockitems}
    </ChatMessageTextDiv>
  );
});

const ChatMessageDiv = styled.div`
  width: 88%;
  max-width: 88%;
  position: relative;
  align-self: flex-start;
  align-items: center;
  display: flex;
  color: ${CSS.chatMessageColorLeft};
  &[data-mine="true"] {
    justify-content: flex-end;
    align-self: flex-end;
    color: ${CSS.chatMessageColorRight};
  }
  &[data-mine="false"] {
    flex-direction: row-reverse;
    justify-content: flex-end;
    margin-left: 50px;
  }

  &[data-mine="true"] {
    &[data-position="last"],
    &[data-position="standalone"] {
      & div[data-type="message"] {
        ${CSS.messageCloudTaleRight}
      }
    }
  }
  &[data-mine="false"] {
    &[data-position="last"],
    &[data-position="standalone"] {
      & div[data-type="message"] {
        ${CSS.messageCloudTaleLeft}
      }
    }
  }

  & > div[data-status="plus"] {
    background-color: #4caf50;
    color: white;
    :before {
      border-color: #4caf50 !important;
    }
  }
  & > div[data-status="minus"] {
    background-color: #ce3f44;
    color: white;
    :before {
      border-color: #ce3f44 !important;
    }
  }

  &[data-mine="true"] {
    &[data-position="middle"] {
      & div[data-type="message"] {
        border-radius: ${CSS.chatMessageBorderRadius} ${CSS.chatMessageSmallBorderRadius} ${CSS.chatMessageSmallBorderRadius} ${CSS.chatMessageBorderRadius};
      }
    }

    &[data-position="first"] {
      & div[data-type="message"] {
        border-radius: ${CSS.chatMessageBorderRadius} ${CSS.chatMessageBorderRadius} ${CSS.chatMessageSmallBorderRadius} ${CSS.chatMessageBorderRadius};
      }
    }

    &[data-position="last"] {
      & div[data-type="message"] {
        border-radius: ${CSS.chatMessageBorderRadius} ${CSS.chatMessageSmallBorderRadius} ${CSS.chatMessageBorderRadius} ${CSS.chatMessageBorderRadius};
      }
    }
  }

  &[data-mine="false"] {
    &[data-position="middle"] {
      & div[data-type="message"] {
        border-radius: ${CSS.chatMessageSmallBorderRadius} ${CSS.chatMessageBorderRadius} ${CSS.chatMessageBorderRadius} ${CSS.chatMessageSmallBorderRadius};
      }
    }

    &[data-position="first"] {
      & div[data-type="message"] {
        border-radius: ${CSS.chatMessageBorderRadius} ${CSS.chatMessageBorderRadius} ${CSS.chatMessageBorderRadius} ${CSS.chatMessageSmallBorderRadius};
      }
    }

    &[data-position="last"] {
      & div[data-type="message"] {
        border-radius: ${CSS.chatMessageSmallBorderRadius} ${CSS.chatMessageBorderRadius} ${CSS.chatMessageBorderRadius} ${CSS.chatMessageBorderRadius};
      }
    }
  }

  &[data-position="middle"],
  &[data-position="first"],
  &[data-position="last"] {
    margin-bottom: 1px;
  }
  &[data-position="standalone"],
  &[data-position="last"] {
    margin-bottom: 30px;
  }
  &:hover > div[data-type="time"] {
    opacity: 1;
    transition: opacity 0.2s;
  }
`;
const TimeDiv = styled.div`
  font-size: 10px;
  white-space: nowrap;
  color: ${CSS.chatMessageTimeColor};
  opacity: 0;
  margin: 0 10px 0 10px;
  transition: opacity 0.2s 5s;
  user-select: none;
  pointer-events: none;
  /* background-color: #213346b7;
    padding:3px 7px 3px 7px;
    border-radius:9px;
    color:white;*/
`;

const ChatMessageAuthorDiv = styled.div`
  font-size: 11px;
  position: absolute;
  top: -16px;
  color: ${CSS.chatMessageAuthorColor};
`;

const DateDiv = styled.div`
  /*background-color: #213346b7;*/
  background-color: #5a6979;
  padding: 5px 15px 5px 15px;
  font-size: 11px;
  color: rgba(255, 255, 255, 1);
  white-space: nowrap;
  border-radius: 10px;
  margin: 0px 0 25px 0;
  text-align: center;
  width: 120px;
  align-self: center;
  position: sticky;
  z-index: 10;
  top: 10px;
`;

const MessageTime = (params: { message: MessageVO }) => {
  const time = Services.dateFormatter.format(params.message.created, "%h:%i");
  return <TimeDiv data-type="time">{time}</TimeDiv>;
};

const ChatMessage = (params: { message: MessageVO }) => {
  const { message } = params;
  let inner = null;
  if (message.sys) {
    if (message.type === "botMenu") inner = <MessageBotMenu data={message.sys} msg={message} />;
    if (message.type === "botCommand") inner = <MessageBotCommand msg={message} />;
    if (message.type === "img") inner = <MessageImage msg={message} />;
    if (message.type === "file") inner = <MessageFile msg={message} />;

    if (inner == null) message.text = message.sys?.title;
    if (!message.text) message.text = `System msg ${message.sys.method} without title`;
  }

  const onMsgClick = (e: React.MouseEvent) => {
    if (e.shiftKey) console.log(params.message);
  };

  let date = null;
  if (message.date) date = <DateDiv>{message.date}</DateDiv>;

  let author = null;
  let avatar = null;
  if (!message.mine && (message.position === "first" || message.position === "standalone"))
    author = <ChatMessageAuthorDiv>{message.user_name}</ChatMessageAuthorDiv>;

  if (!message.mine && (message.position === "last" || message.position === "standalone"))
    avatar = (
      <ChatAvatarHolderDiv>
        <Avatar user={message.user_name} avatar={message.user_avatar} />
      </ChatAvatarHolderDiv>
    );

  if (inner == null) inner = <ChatMessageText msg={message} />;

  const usersWhoReadMessageCount = everyUserReadMessageID.filter((id) => {
    if (id) {
      return id >= message.id;
    } else {
      return null;
    }
  }).length;

  const lastFullReadMessage = Math.max(...everyUserReadMessageID);
  let messageReadBy: Array<string> = [];

  messageReadByUser.forEach((value, key) => {
    const lastReadMsg = messageReadByUser.get(key)?.lastReadMsgID;
    if (lastReadMsg && lastReadMsg >= message.id) {
      const userName = currentChatUsersNameByUID.get(key);
      userName && messageReadBy.push(userName);
    }
  });

  return (
    <>
      {date}
      <ChatMessageDiv data-position={message.position} data-mine={message.mine} onClick={onMsgClick}>
        <MessageTime message={message} />
        {author}

        {(message.mine && usersWhoReadMessageCount && usersWhoReadMessageCount !== currentChatUsers.length && (
          <ProgressBar total={currentChatUsers.length} progress={usersWhoReadMessageCount} chipText={`Read by: ${messageReadBy.join(", ")}`} />
        )) ||
          null}

        {(message.mine && usersWhoReadMessageCount && usersWhoReadMessageCount === currentChatUsers.length && lastFullReadMessage === message.id && (
          <MessageStatus status="read" />
        )) ||
          null}
        {message.mine && !usersWhoReadMessageCount && <MessageStatus status="delivered" />}

        {inner}
        {avatar}
      </ChatMessageDiv>
    </>
  );
};

export default ChatMessages;
