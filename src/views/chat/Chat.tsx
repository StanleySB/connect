import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import GD from "../../GD";
import CSS from "../CSS";
import ChatHead from "./ChatHead";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

import { gsap, TweenLite, Quad } from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";
import ChatUploadingFiles from "./ChatUploadingFiles";
import Alert from "../Alert";
import Toast from "../Toast";

gsap.registerPlugin(CSSRulePlugin);

let startWindowRPosition = 25;
let startWindowBPosition = 25;
let startWindowWidth = "320px";
let startWindowHeight = "60vh";

let ChatWindowBase = styled.div`
  bottom: ${startWindowBPosition}px;
  right: ${startWindowRPosition}px;
`;

// const ChatMobile = styled.div`
//   background-color: green;
//   box-sizing: border-box;
//   border: 2px solid red;
//   position: absolute;
//   width: 100vw;
// `;

const ChatWindow = styled(ChatWindowBase)`
  display: flex;
  font-family: "Open Sans", sans-serif;
  flex-direction: column;
  position: absolute;
  width: ${startWindowWidth};
  height: ${startWindowHeight};
  background-color: ${CSS.chatBG};
  border-radius: 30px;
  overflow: hidden;
  font-size: ${CSS.chatMessageTextSize};
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  transition: height 0.2s, width 0.2s;
  line-height: normal !important;
  transform: scaleZ(1);
  &[data-mobile="true"] {
    position: relative;
    bottom: auto;
    right: auto;
    left: 0;
    top: 0;
    border-radius: 0;
    transition: none;
    flex-grow: 1;
    width: 100vw;
    height: 100vh;
    box-shadow: none;
  }

  &[data-messenger="true"] {
    position: relative;
    height: auto;
    bottom: auto;
    right: auto;
    border-radius: 0;
    transition: none;
    flex-grow: 1;
    max-width: 600px;
    box-shadow: none;
  }
`;

const ChatBodyDiv = styled.div`
  flex-grow: 1;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  width: calc(100% - 5px);
`;
const ChatBodyBox = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
`;

let animation: TweenLite | null = null;

const Chat = (params: { sharedObject: SharedObjectVO }) => {
  let smx = 0;
  let smy = 0;
  let sx = 0;
  let sy = 0;
  const ref = useRef<HTMLDivElement | null>(null);
  const body = useRef<HTMLDivElement | null>(null);

  const moveBox = (e: MouseEvent) => {
    if (!ref.current) return;

    let tx = sx - (e.clientX - smx);
    let ty = sy - (e.clientY - smy);

    ref.current.style.bottom = ty + "px";
    ref.current.style.right = tx + "px";
    setupBounds();
  };

  const setupBounds = (): void => {
    if (!ref.current) return;

    const bounds = ref.current.getBoundingClientRect();
    let tx = parseInt(ref.current.style.right);
    let ty = parseInt(ref.current.style.bottom);

    if (isNaN(tx) || isNaN(ty)) return;
    if (tx < startWindowRPosition) tx = startWindowRPosition;
    if (ty < startWindowBPosition) ty = startWindowBPosition;

    let boundX = window.innerWidth - bounds.width;
    let boundY = window.innerHeight - bounds.height;
    if (tx > boundX) tx = boundX;
    if (ty > boundY) ty = boundY;
    ref.current.style.bottom = ty + "px";
    ref.current.style.right = tx + "px";
  };

  const onWindowResize = (e: Event) => {
    setupBounds();
  };

  const onMouseMove = (e: MouseEvent) => {
    moveBox(e);
  };

  const onMouseUp = (e: MouseEvent) => {
    moveBox(e);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const onMDown = (e: React.MouseEvent) => {
    if (params.sharedObject.mobile) return;

    if (!ref.current) return;

    if ((e.target as HTMLElement).id !== "chatHead") return;

    smx = e.clientX;
    smy = e.clientY;

    const rect = ref.current.getBoundingClientRect();
    sx = rect.left;
    sy = rect.top;

    sx = parseInt(ref.current.style.right);
    sy = parseInt(ref.current.style.bottom);

    if (isNaN(sx)) {
      sx = startWindowRPosition;
      ref.current.style.right = sx + "px";
    }
    if (isNaN(sy)) {
      sy = startWindowBPosition;
      ref.current.style.bottom = sy + "px";
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const headDoubleClick = (e: React.MouseEvent) => {
    if (!ref.current) return;

    if (ref.current.getAttribute("closing")) return;

    if (params.sharedObject.messenger || params.sharedObject.mobile) return;

    if (ref.current.getAttribute("expanded")) {
      animation = TweenLite.to(ref.current, 0.2, {
        width: 320,
        height: "50vh",
        bottom: startWindowBPosition + "px",
        right: startWindowRPosition + "px",
        ease: Quad.easeOut,
      });
      ref.current.removeAttribute("expanded");
    } else {
      animation = TweenLite.to(ref.current, 0.2, {
        width: 390,
        height: `calc(95vh - ${startWindowBPosition}px)`,
        bottom: startWindowBPosition + "px",
        right: startWindowRPosition + "px",
        ease: Quad.easeOut,
      });
      ref.current.setAttribute("expanded", "1");
    }
  };

  const closeChat = () => {
    if (!ref.current) return;
    if (animation) animation.kill();
    ref.current.setAttribute("closing", "1");
    ref.current.removeAttribute("expanded");
    animation = TweenLite.to(ref.current, 0.2, {
      width: 0,
      height: 0,
      bottom: startWindowBPosition + "px",
      right: startWindowRPosition + "px",
      opacity: 0,
      ease: Quad.easeIn,
      onComplete: () => {
        if (ref.current) {
          ref.current.style.display = "none";
          ref.current.removeAttribute("closing");
        }
        GD.S_GUI_CHAT_CLOSED.invoke();
      },
    });
  };

  const openChat = () => {
    if (!ref.current) return;
    if (animation) animation.kill();
    ref.current.setAttribute("opening", "1");
    ref.current.removeAttribute("expanded");
    ref.current.style.opacity = "0";
    ref.current.style.removeProperty("display");
    animation = TweenLite.to(ref.current, 0.2, {
      width: startWindowWidth,
      height: startWindowHeight,
      bottom: startWindowBPosition + "px",
      right: startWindowRPosition + "px",
      opacity: 1,
      ease: Quad.easeIn,
      onComplete: () => {
        if (ref.current) ref.current.removeAttribute("opening");
        GD.S_GUI_CHAT_OPENED.invoke();
      },
    });
  };

  useEffect(() => {
    GD.S_GUI_MESSAGES_RENDERED.add(() => {
      if (body.current) body.current.scrollTop = body.current.scrollHeight - body.current.clientHeight;
      if (ref.current && ref.current.style.display === "none") openChat();
    }, "chat");

    const so: SharedObjectVO = (window as any).__DCCSharedObject;
    if (so && !params.sharedObject.messenger && ref.current) {
      if (!params.sharedObject.mobile) {
        ref.current.style.right = startWindowRPosition + "px";
        ref.current.style.bottom = startWindowBPosition + "px";
        if (so.bottomOffset && !isNaN(so.bottomOffset)) startWindowBPosition = so.bottomOffset;
        if (so.rightOffset && !isNaN(so.rightOffset)) startWindowRPosition = so.rightOffset;
      }
      setupBounds();
    }

    GD.S_GUI_CLOSE_CHAT.add((data) => {
      closeChat();
    }, "chat");

    GD.S_GUI_OPEN_CHAT.add(() => {
      openChat();
    }, "chat");

    if (!params.sharedObject.messenger) window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onWindowResize);
      GD.S_GUI_MESSAGES_RENDERED.clearContext("chat");
      GD.S_GUI_CLOSE_CHAT.clearContext("chat");
      GD.S_GUI_OPEN_CHAT.clearContext("chat");
      GD.S_GUI_REPOSITION_CHAT.clearContext("chat");
      if (animation) animation.kill();
    };
  });

  const onDrop = (ev: React.DragEvent) => {
    ev.preventDefault();
    const f: File[] = [];

    const l = ev.dataTransfer.files.length;
    for (let i = 0; i < l; i++) {
      const file = ev.dataTransfer.files.item(i);
      if (file) f.push(file);
    }
    GD.S_CHAT_ATTACH_FILE_REQUEST.invoke(f);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const head = params.sharedObject.headless ? null : <ChatHead messenger={params.sharedObject.messenger} onDoubleClick={headDoubleClick} />;

  if (params.sharedObject.messenger) {
    return (
      <ChatWindow id="DukascopyConnect" data-messenger={params.sharedObject.messenger} ref={ref}>
        {head}

        <ChatBodyDiv ref={body} onDrop={onDrop} onDragOver={onDragOver}>
          <ChatBodyBox>
            <ChatMessages />
          </ChatBodyBox>
        </ChatBodyDiv>
        <ChatUploadingFiles />
        <ChatInput messenger={params.sharedObject.messenger} />
        <Toast />
        <Alert />
      </ChatWindow>
    );
  }

  return (
    <ChatWindow id="DukascopyConnect" data-mobile={params.sharedObject.mobile} ref={ref} onMouseDown={onMDown}>
      {head}
      <ChatBodyDiv ref={body} onDrop={onDrop} onDragOver={onDragOver}>
        <ChatBodyBox>
          <ChatMessages />
        </ChatBodyBox>
      </ChatBodyDiv>
      <ChatUploadingFiles />
      <ChatInput />

      <Alert />
    </ChatWindow>
  );
};

export default Chat;
