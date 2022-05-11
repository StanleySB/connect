import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GD from "../../GD";
import CSS from "../CSS";

const ChatHeadDiv = styled.div`
  position: relative;
  background-color: ${CSS.chatColor};
  color: ${CSS.chatHeadColor};
  font-family: "Open Sans", sans-serif;
  font-style: normal;
  font-weight: 700;
  padding: 15px 30px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-size: 22px;
  line-height: 30px;
  &[data-uid]::after {
    content: attr(data-uid);
    display: block;
    font-size: 12px;
    opacity: 0.4;
    line-height: 14px;
    font-family: "SF Pro Display";
    font-weight: 400;
  }
  &[data-status="0"]::before {
    background-color: rgba(0, 0, 0, 0.2);
  }
  &[data-status="1"]::before {
    background-color: #ff9009e1;
  }
  &[data-status="2"]::before {
    background-color: #15ff09e0;
  }
`;

const ChatHeadCloseDiv = styled.div`
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABQElEQVRoge2ZwU7DMBAF2/w7ggOlEge4kP5jBeU6XBI1PJyQxt61K+07Rsm+GUeOanW3i0QikYhVgAfgE3gFOsfebuj8Ah5zBp25pveQGOD7Se85Z9gzv2MqkYAHOOQM3ANvMvBkITF0vRdfMA8JM3gpMJEwh5eiohJu8FJYRMIdXoqzJKrBC8AmierwAnKTRDPwArRKojl4AVuUaBZ+zJJE8/BjBtiPBKj+tmkPfszMm7gP+DELEibwVquxX3mtrcxs2D8buzZnMqQPI/exiWdWvuf6GXU5FG3KErzc057EGni5tx2JW+DlmfoSW+Dl2XoSOfAyw1+iBLzM8pMoCS8z7SUs4GW2nYQlvHSUl/CAl66yEsDRA37SlzoUHXMGfnvBTzpV4pIz7Am4AC8e8JPeDjgM3dv/4IhEIpHIf/kBoa3r5F4Qe6YAAAAASUVORK5CYII=);
  position: absolute;
  right: 30px;
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  top: calc(50% - 10px);
`;

const ChatHead = (params: { onDoubleClick?: (e: React.MouseEvent) => void; messenger?: boolean }) => {
  const [chatVO, setChatVO] = useState<ChatVO | null>(null);
  const [wsStatus, setWSStatus] = useState<number>(0);
  useEffect(() => {
    GD.S_CHAT_OPENED.add((cvo) => {
      setChatVO(cvo);
    }, "ChatHead");
    GD.S_WS_AUTHORIZED.add((userType) => {
      setWSStatus(userType === "guest" ? 1 : 2);
    }, "ChatHead");
    GD.S_WS_CLOSED.add(() => {
      setWSStatus(0);
    }, "ChatHead");
    return () => {
      GD.S_CHAT_OPENED.clearContext("ChatHead");
      GD.S_WS_AUTHORIZED.clearContext("ChatHead");
      GD.S_WS_CLOSED.clearContext("ChatHead");
    };
  });

  const closeClick = (e: React.MouseEvent) => {
    GD.S_LOG.invoke("on close button click");
    GD.S_GUI_CLOSE_CHAT.invoke({ uid: chatVO?.uid });
  };

  let title = "Loading...";
  if (chatVO != null) title = chatVO.title;

  let callBtn = null;
  if (chatVO != null && params.messenger && chatVO.type === "private") {
    const onCallClick = (e: React.MouseEvent) => {
      GD.S_REQUEST_CALL.invoke({ chatVO: chatVO, audio: true, video: true });
    };
    callBtn = <div onClick={onCallClick}>CALL</div>;
  }

  const closeButton = !params.messenger ? <ChatHeadCloseDiv onClick={closeClick}></ChatHeadCloseDiv> : null;
  return (
    <ChatHeadDiv onDoubleClick={params.onDoubleClick} id="chatHead" data-status={wsStatus} data-uid={chatVO ? chatVO?.uid : "..."}>
      {title}
      {closeButton}
      {callBtn}
    </ChatHeadDiv>
  );
};

export default ChatHead;
