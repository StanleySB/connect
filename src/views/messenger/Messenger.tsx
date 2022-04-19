import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GD from "../../GD";
import AuthPanel from "../AuthPanel";
import Call from "../call/Call";
import CallDialogs from "../call/CallDialogs";
import Chat from "../chat/Chat";
import Lightbox from "../Lightbox";
import LatestPanel from "./LatestPanel";
import MenuPanel from "./MenuPanel";

const MessengerDiv = styled.div`
  position: "static";
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: #252833;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MessengerBoxDiv = styled.div`
  display: flex;
  width: calc(100% - 50px);
  /*max-width:700px;*/
  height: calc(100% - 50px);
  justify-content: center;
`;

const Messenger = (params: { sharedObject: SharedObjectVO }) => {
  const [state, setState] = useState<"wait" | "auth" | "chat">("wait");
  useEffect(() => {
    GD.S_NEED_AUTHENTICATE.add(() => {
      setState("auth");
    }, "messenger");

    GD.S_AUTH_CHECK.invoke((status) => {
      if (!status) setState("auth");
      else setState("chat");
    });

    GD.S_AUTH_COMPLETE.add((data) => {
      setState("chat");
    });

    return () => {
      GD.S_REQUEST_AUTHENTICATE.clearContext("messenger");
    };
  }, []);

  let content = <div>WAIT</div>;
  if (state === "auth") content = <AuthPanel />;
  else if (state === "chat") {
    content = (
      <MessengerDiv>
        <CallDialogs />
        <Lightbox />
        <MessengerBoxDiv>
          <MenuPanel />
          <LatestPanel />
          <Chat sharedObject={params.sharedObject} />
          <Call />
          <div
            onClick={(e) => {
              GD.S_LOGOUT.invoke();
            }}
          >
            LOGOUT
          </div>
        </MessengerBoxDiv>
      </MessengerDiv>
    );
  }

  return content;
};
export default Messenger;
