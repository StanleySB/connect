import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GD from "../../GD";
import AuthPanel from "../AuthPanel";
import Call from "../call/Call";
import CallDialogs from "../call/CallDialogs";
import Chat from "../chat/Chat";
import Chip from "../Chip";
import Lightbox from "../Lightbox";
import LatestPanel from "./LatestPanel";
import MembersPanel from "./MembersPanel";
import MenuPanel from "./MenuPanel";
import SearchPanel from "./SearchPanel";

const memberIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAyMSAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuNjIxMDkgMC4wOTk5OTk5QzMuOTgxMjkgMC4wOTk5OTk5IDMuNSAwLjc5OTk5OSAzLjUgMC43OTk5OTlDLTAuMTY0NSAwLjc5OTk5OSAxLjg1NzI2IDYuNjQ5MTIgMC43ODA2NjQgNy41MTE1MkMwLjc4MDY2NCA3LjUxMTUyIDEuNDQwNiA4LjMyNzczIDMuNSA4LjMyNzczVjkuMDI2MzdDMi45MzA5IDEwLjUwOSAwIDkuOTYwOSAwIDEyLjdINS42MTY0MUM2LjEwOTIxIDEyLjQwMTggNy43IDExLjU3NDggNy43IDExLjU3NDhDNy4zMTk5IDExLjE2ODggNi43NzE1NyAxMC40NjY4IDYuNTcyMDcgOS45MzU1NUM2LjEzNTI3IDkuNzE2NDUgNS43NjU5IDkuNDU4OTcgNS42IDkuMDI2MzdWOC4zMTk1M0M1LjczMyA4LjMxOTUzIDYuMTI1MTkgOC4yODg4MSA2LjI2MzA5IDguMjU4MDFDNS45NTA4OSA3Ljc3NzExIDUuNjg3NSA2LjY4MTAxIDUuNjg3NSA2LjA2NjQxQzUuNjg3NSA0LjUwMzMxIDYuMzYwNjUgMy4yMTc2MSA3LjQ3NzE1IDIuNDExOTFDNy4xNDA0NSAxLjEyMzIxIDYuMzkyOCAwLjA5OTk5OTkgNC42MjEwOSAwLjA5OTk5OTlINC42MjEwOVpNMTYuMSAwLjA5OTk5OTlDMTQuNTQzOSAwLjA5OTk5OTkgMTMuNTg4NCAxLjE3MDQ0IDEzLjM1NzQgMi41NzMyNEMxNC40ODg2IDMuMTc5NDQgMTUuMjI1IDQuNDg2MzMgMTUuMjI1IDYuMTMyMDNDMTUuMjI1IDYuNjQ2NTMgMTUuMTA1IDcuMTQxNiAxNC45NzQ4IDcuNTI1MTlDMTUuMDIzMSA3LjcxNDg5IDE1LjA1IDcuOTI2NDQgMTUuMDUgOC4xNjA5NEMxNS4wNSA5Ljg4OTk0IDEzLjMgMTEuNjE0NSAxMy4zIDExLjYxNDVDMTMuNjgwMSAxMS43ODA0IDE0Ljg5NjIgMTIuMzk4MyAxNS4zOTMyIDEyLjdIMjFDMjEgOS4wMjUgMTguMDE1OSAxMC4wNzUgMTcuNSA4LjVWNy40NUMxNy43MzI0IDcuMzMzMSAxOC4yODU5IDYuNTI4MjEgMTguMzU1OSA1Ljg5OTYxQzE4LjUzNzkgNS44ODU2MSAxOC45IDUuNDQwNjggMTguOSA1LjA0MjM4QzE4LjkgNC42NDQwOCAxOC43NzM0IDQuNDc2NTEgMTguNjYzNSA0LjQxMjExQzE4LjY2MzUgNC40MTIxMSAxOC45IDMuODg2MyAxOC45IDMuMjVDMTguOSAxLjk3NTMgMTguNTU1NiAwLjc5OTk5OCAxNy41IDAuNzk5OTk4QzE3LjUgMC43OTk5OTggMTcuMTk2OSAwLjA5OTk5ODUgMTYuMSAwLjA5OTk5ODVWMC4wOTk5OTk5Wk0xMC41IDIuOUM4LjYxNTYgMi45IDcuMDg3NSA0LjAzNTAxIDcuMDg3NSA2LjA2NjQxQzcuMDg3NSA2LjkyNTMxIDcuNTY4NzUgNy41OTQ5MiA3LjU2ODc1IDcuNTk0OTJDNy41Njg3NSA3LjU5NDkyIDcuMzUgNy43MDI0NCA3LjM1IDguMTYwOTRDNy4zNSA5LjA1MjA0IDcuOTIyODUgOS4yNjU2MyA3LjkyMjg1IDkuMjY1NjNDOC4wMDI2NSA5Ljk3MTIzIDkuMSAxMS4wMDQ3IDkuMSAxMS4wMDQ3VjEyLjE4NDZDOC41MTA2IDEzLjk1MjggNC45IDEyLjc4NzUgNC45IDE2LjlIMTYuMUMxNi4xIDEyLjc3MzUgMTIuNDg5NCAxMy45NTI4IDExLjkgMTIuMTg0NlYxMS4wMDQ3QzExLjkgMTEuMDA0NyAxMi45OTczIDkuOTcxMjMgMTMuMDc3MSA5LjI2NTYzQzEzLjA3NzEgOS4yNjU2MyAxMy42NSA4Ljg3MDA0IDEzLjY1IDguMTYwOTRDMTMuNjUgNy42Njk1NCAxMy40MzEyIDcuNTk0OTIgMTMuNDMxMiA3LjU5NDkyQzEzLjQzMTIgNy41OTQ5MiAxMy44MjUgNi44NDYwMyAxMy44MjUgNi4xMzIwM0MxMy44MjUgNC43MDA1MyAxMy4xMDY4IDMuNiAxMS45IDMuNkMxMS45IDMuNiAxMS4zODc2IDIuOSAxMC41IDIuOUwxMC41IDIuOVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";
const latestIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMSAyMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjUgMS41MzY5N2UtMDZDNC43MTA0NSAxLjUzNjk3ZS0wNiAwIDQuNzEwNDUgMCAxMC41QzAgMTIuMjE5NSAwLjQ1MjkyMiAxMy44MjY4IDEuMTg3NCAxNS4yNTk5TDAuMDQ5MjE5IDE5LjMzNDhDLTAuMjE1ODgxIDIwLjI4MTYgMC43MjAyNjIgMjEuMjE3NiAxLjY2NzI5IDIwLjk1MjhMNS43NDUyNiAxOS44MTQ2QzcuMTc3MTQgMjAuNTQ3NiA4Ljc4MjA3IDIxIDEwLjUgMjFDMTYuMjg5NSAyMSAyMSAxNi4yODk1IDIxIDEwLjVDMjEgNC43MTA0NSAxNi4yODk1IDAgMTAuNSAwVjEuNTM2OTdlLTA2Wk0xMC41IDEuNTc1QzE1LjQzODMgMS41NzUgMTkuNDI1IDUuNTYxNyAxOS40MjUgMTAuNUMxOS40MjUgMTUuNDM4MyAxNS40MzgzIDE5LjQyNSAxMC41IDE5LjQyNUM4LjkyNDE3IDE5LjQyNSA3LjQ1MDA3IDE5LjAxNTIgNi4xNjQ2NSAxOC4yOTkxQzUuOTgzNDYgMTguMTk4MSA1Ljc2OTc1IDE4LjE3MjcgNS41Njk5MiAxOC4yMjg0TDEuNjkxODkgMTkuMzEwMkwyLjc3NDcxIDE1LjQzNDJDMi44MzA2NCAxNS4yMzQgMi44MDUyMSAxNS4wMTk5IDIuNzAzOTUgMTQuODM4NEMxLjk4NjQyIDEzLjU1MjEgMS41NzUgMTIuMDc3NCAxLjU3NSAxMC41QzEuNTc1IDUuNTYxNyA1LjU2MTcgMS41NzUgMTAuNSAxLjU3NUwxMC41IDEuNTc1Wk02LjAzNzUgNy44NzVDNS43NTM1IDcuODcwOTkgNS40ODkzNCA4LjAyMDIgNS4zNDYxNiA4LjI2NTVDNS4yMDI5OSA4LjUxMDgxIDUuMjAyOTkgOC44MTQyIDUuMzQ2MTYgOS4wNTk1QzUuNDg5MzQgOS4zMDQ4MSA1Ljc1MzUgOS40NTQwMiA2LjAzNzUgOS40NUgxNC45NjI1QzE1LjI0NjUgOS40NTQwMiAxNS41MTA3IDkuMzA0ODEgMTUuNjUzOCA5LjA1OTVDMTUuNzk3IDguODE0MiAxNS43OTcgOC41MTA4MSAxNS42NTM4IDguMjY1NUMxNS41MTA3IDguMDIwMiAxNS4yNDY1IDcuODcwOTkgMTQuOTYyNSA3Ljg3NUg2LjAzNzVaTTYuMDM3NSAxMS41NUM1Ljc1MzUgMTEuNTQ2IDUuNDg5MzQgMTEuNjk1MiA1LjM0NjE2IDExLjk0MDVDNS4yMDI5OSAxMi4xODU4IDUuMjAyOTkgMTIuNDg5MiA1LjM0NjE2IDEyLjczNDVDNS40ODkzNCAxMi45Nzk4IDUuNzUzNSAxMy4xMjkgNi4wMzc1IDEzLjEyNUgxMi44NjI1QzEzLjE0NjUgMTMuMTI5IDEzLjQxMDcgMTIuOTc5OCAxMy41NTM4IDEyLjczNDVDMTMuNjk3IDEyLjQ4OTIgMTMuNjk3IDEyLjE4NTggMTMuNTUzOCAxMS45NDA1QzEzLjQxMDcgMTEuNjk1MiAxMy4xNDY1IDExLjU0NiAxMi44NjI1IDExLjU1SDYuMDM3NVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";

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

const MessengerTabs = styled.div`
  background: rgba(0, 0, 0, 0.3);
`;

const TabItemDiv = styled.div`
  width: 55px;
  height: 55px;
  background: rgba(1, 1, 1, 0.36);
  cursor: pointer;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 21px auto;
  position: relative;
  &[data-active="true"] {
    background-color: #950a44;
    &::after {
      background: #f11873;
      box-shadow: -1px 0px 1px rgba(0, 0, 0, 0.25);
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 6px;
      content: "";
    }
  }
`;

const SearchBox = styled.div`
  background: rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-width: 400px;
  min-width: 350px;
  padding: 20px;
  position: fixed;
`;

const SearchInput = styled.input`
  background: rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  border: none;
  padding: 7px 13px;
  outline: none;
  color: #d7ff97;
  width: 100%;
  &::placeholder {
    color: #d7ff97;
  }
`;

const MessengerTabItem = (params: { icon: string; onClick: () => void; title: string; activeTab: string; tab: string }) => {
  const [isChipOpen, setIsChipOpen] = useState(false);
  const { icon, onClick, title, activeTab, tab } = params;
  return (
    <>
      <Chip text={title} open={isChipOpen} additioanalStyle={{ right: "-60px" }} />
      <TabItemDiv
        style={{ backgroundImage: `url(${icon})` }}
        onClick={onClick}
        onMouseOver={() => setIsChipOpen(true)}
        onMouseOut={() => setIsChipOpen(false)}
        data-active={activeTab === tab}
      />
    </>
  );
};

const Messenger = (params: { sharedObject: SharedObjectVO }) => {
  const [state, setState] = useState<"wait" | "auth" | "chat">("wait");
  const [activeTab, setActiveTab] = useState<"latest" | "members" | "search">("latest");
  const [searchText, setSearchText] = useState("");

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

  useEffect(() => {
    if (searchText.length >= 3) {
      setActiveTab("search");
    } else {
      setActiveTab("latest");
    }
  }, [searchText]);

  let content = <div>WAIT</div>;
  if (state === "auth") content = <AuthPanel />;
  else if (state === "chat") {
    content = (
      <MessengerDiv>
        <CallDialogs />
        <Lightbox />
        <MessengerBoxDiv>
          <MenuPanel />
          <MessengerTabs>
            <MessengerTabItem onClick={() => setActiveTab("latest")} icon={latestIcon} title="Latest" activeTab={activeTab} tab="latest" />
            <MessengerTabItem onClick={() => setActiveTab("members")} icon={memberIcon} title="Members" activeTab={activeTab} tab="members" />
          </MessengerTabs>
          <div>
            <SearchBox>
              <SearchInput value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search..." />
            </SearchBox>
            {activeTab === "members" && <MembersPanel />}
            {activeTab === "latest" && <LatestPanel />}
            {activeTab === "search" && <SearchPanel searchText={searchText} />}
          </div>
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
