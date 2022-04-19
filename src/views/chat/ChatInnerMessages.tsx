import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import GD from "../../GD";
import CSS from "../CSS";

// BOT COMMAND -----------------------
const MessageBotCommandDiv = styled.div`
  background-color: ${CSS.chatMessageBotItemBg};
  padding: ${CSS.chatMessagePadding};
  border-radius: ${CSS.chatMessageBorderRadius};
`;
export const MessageBotCommand = (params: { msg: MessageVO }) => {
  return (
    <MessageBotCommandDiv data-type="message">
      {params.msg.sys?.title}
    </MessageBotCommandDiv>
  );
};
// -----------------------

// BOT MENU ITEM -----------------------
const BotMenuItemDiv = styled.div`
  cursor: pointer;
  color: ${CSS.chatMessageBotMenuColor};
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 9px 0 9px 0;
  &:first-child {
    border-top: none;
  }
  &:hover {
    text-decoration: underline;
  }
`;

const BotMenuItem = (params: { data: SimpleObjectVO; userUID: string }) => {
  const { text, action } = params.data;
  const onclick = (e: React.MouseEvent) => {
    GD.S_CHAT_BOT_COMMAND_SEND_REQUEST.invoke({
      action: action,
      title: text,
      actionData: null,
      botUID: params.userUID,
    });
  };
  return <BotMenuItemDiv onClick={onclick}>{text}</BotMenuItemDiv>;
};

// BOT MENU -----------------------
const MessageBotMenuTitleDiv = styled.div`
  padding: ${CSS.chatMessagePadding};
  background-color: ${CSS.chatMessageBg};
  color: ${CSS.chatTextColor};
  margin-bottom: 2px;
  border-radius: ${CSS.chatMessageBorderRadius} ${CSS.chatMessageBorderRadius}
    ${CSS.chatMessageBorderRadius} ${CSS.chatMessageSmallBorderRadius};
  &:nth-last-child() {
    background-color: green;
  }
`;
// BOT MENU -----------------------
const MessageBotMenuItemsDiv = styled.div`
  padding: ${CSS.chatMessagePadding};
  background-color: ${CSS.chatMessageBg};
  color: ${CSS.chatTextColor};
  border-radius: ${CSS.chatMessageSmallBorderRadius}
    ${CSS.chatMessageBorderRadius} ${CSS.chatMessageBorderRadius}
    ${CSS.chatMessageBorderRadius};
  ${CSS.messageCloudTaleLeft};
`;
export const MessageBotMenu = (params: {
  data: SystemMessageVO;
  msg: MessageVO;
}) => {
  let adata: SimpleObjectVO | null = null;

  try {
    adata = JSON.parse(params.msg.sys?.additionalData);
  } catch (e) {
    console.error("Can't parse bot menu " + e);
  }

  if (!adata) return <div>NO BOT MENU</div>;

  let title = (
    <MessageBotMenuTitleDiv>{adata.menu.title}</MessageBotMenuTitleDiv>
  );
  let items = null;
  let i = 0;

  if (adata && Array.isArray(adata.menu.items))
    items = (adata.menu.items as Array<SimpleObjectVO>).map(
      (val: SimpleObjectVO) => (
        <BotMenuItem data={val} userUID={params.msg.user_uid} key={i++} />
      )
    );

  return (
    <div>
      {title}
      <MessageBotMenuItemsDiv>{items}</MessageBotMenuItemsDiv>
    </div>
  );
};

// IMAGE -----------------------
const MessageImageDiv = styled.div`
  background-color: rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  padding-top: 75%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-position: contain;
  }
`;

export const MessageImage = memo((params: { msg: MessageVO }) => {
  // load image
  const tmp = params.msg.sys?.additionalData.split(",");
  const imgUID = tmp[0];
  const [b64, setB64] = useState<string | null>(null);

  const onImageClick = (e: React.MouseEvent) => {
    if (params.msg.sys && params.msg.sys.additionalData) {
      GD.S_IMAGE_DOWNLOAD_REQUEST.invoke({
        target: "msg",
        src: e.target as HTMLDivElement,
        uid: imgUID,
        name: params.msg.sys.title,
        chatUID: params.msg.chatUID,
        width: tmp[1],
        height: tmp[2],
      });
    }
  };
  useEffect(() => {
    GD.S_IMAGE_REQUEST.invoke({
      uid: imgUID,
      thumb: true,
      chatUID: params.msg.chatUID,
    });
    GD.S_IMAGE_READY.add((data) => {
      if (data.uid !== imgUID || !data.thumb) return;
      setB64(data.b64);
    }, imgUID);
    return () => {
      GD.S_IMAGE_READY.clearContext(imgUID);
    };
  }, [imgUID, params.msg.chatUID]);

  return (
    <MessageImageDiv
      onClick={onImageClick}
      style={{ backgroundImage: `url(${b64}` }}
    ></MessageImageDiv>
  );
});

// FILE ---------------
const MessageFileDiv = styled.div`
  background-color: ${CSS.chatMessageFileMsgBg};
  padding: 10px;
  border-radius: ${CSS.chatMessageBorderRadius};
  display: flex;
  align-items: center;
  max-width: calc(100% - 20px);
  cursor: pointer;
  &::before {
    content: "";
    display: block;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAeklEQVRIie2UwRGAIAwEL45t2I+VUIdP65RCzo9+IEKIo+M47BPusvAJ8DtIziQj6yxewWYY7pecTUvmYH1a0CZxCuySGwJVIloZAEQku0szGmlvLL3UOqQkHTyCFrqgC7rgBYG2KiKAqbbwLojpgfaDoAWNw4Oj93F2ysfj8659GAAAAAAASUVORK5CYII=);
    width: 30px;
    height: 30px;
    min-width: 30px;
    min-height: 30px;
    background-color: ${CSS.chatMessageFileItemBg};
    background-repeat: no-repeat;
    background-position: center;
    background-size: 80%;
    border-radius: 8px;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.5);
    margin-right: 10px;
  }
  &::after {
    content: attr(data-title);
    display: block;
    flex-grow: 1;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;
export const MessageFile = (params: { msg: MessageVO }) => {
  const onFileClick = (e: React.MouseEvent) => {
    if (params.msg.sys && params.msg.sys.additionalData)
      GD.S_FILE_DOWNLOAD_REQUEST.invoke({
        uid: params.msg.sys.additionalData,
        name: params.msg.sys.title,
      });
  };
  return (
    <MessageFileDiv
      data-title={params.msg.sys?.title}
      onClick={onFileClick}
    ></MessageFileDiv>
  );
};
