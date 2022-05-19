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

const latestIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADtElEQVRoge3ZS4gcRRzH8c/sYuKa+EATX4kaXXSDxhANKoaIKBLw4kFQFB8HBQ8BUUHFmyAYEQ+ePEiSo5BccjAoPtGoEfGBiiZswOD7mZhARMlmxx0PVe3Ojtnurpoe9bBfKGqm5/+v+v+qq7r/VcMcc8xRRquBNpbhaizFaehgH97DWzjSQB+V5AoZwh14CBeV2H2D9Xih5/piXIWLsQhT+AFv4P2cgHKEnILtuDJ+P4DXsQe/xGtn4XqsQBtb8Rx240nciGNmaf813IJfM2KrzUn4WJg+X+M2DM9i28JT0bYo7Z7vs5U/sAXnDUiHTbGjXTi9hv0wVgpTcJ96IrrLfuVTN4tzMIkJLM/wHxWmS6qYD/sNvJcHY8Nb+2jjEelCOlhT1fBQQhBrY70jwaeXbZl+11QZpAgpFt7nebGALzL9llUZpAgpnk4/5sWC8L6YzPCbX2WQImQq1iMZgXTTzvA5WGWQIqQYyQUZgRQskjcQX1UZpAgp5vfZGYEUnJ/pt6fKIEVIscgvzYsFrMrwmcK7VUYpQj6L9eqMYAquy/Q7o8ogRchxsV5t9vyqjGE13gdHYUjIlCuN6rI+1k+YfoKl8KeQ+eZwONPvqOwW0oUVfbSxSnp60hbyvFJS7sh4rC9L8OnlkgyfZ4QtQ2PcJYzQ93ggw/++6JtyN3ZqZjs+g3l4J3ZwILGDVvRJnVb3NhT7P5iPn2InKXuS5dJF/IZT63aQskYIm6qX4ufbE/xuTewHHjV9BjAQ1ggjdlDInao4Ud42t07bffNi7GxHRYcLhTuYsys8c0Cxz2Cp6f335SV2Y/JEdIQ9fm1S10jBd9gbP3dK7Mp+q2IDjq1rnCuE6V3bRIlN2W9V3IxPcbcEQTmMCyN+QYlNcRbcb/kZjxnAulmCQ6oX5UIhwWxCTEc4EN+CC5sQMYZPYsOv1LDf1qCQorSFTHpejoCV2Cyk1B1ho1XnVi/GRwMQ08HLap4BDOMGvGrmaGwSpk1dRoQs9sgAxGwu6/h4PIwvuxx+j05jCQJ6GcWzQh7VpJgrejtq4R4hxymMxnG/8JdCU5wgZLbFk6/fsrG78QV4vuvHD7DOAPYDXbRiH2/2KeTvY9wRvB0v7sed+ntZ5nCTvL8dOpgoRvtpYfp8K5x07PXfcK4woEuEM+btKc6jwgnHpP4O35pirRDLYUFQbTao8Rj7l9koxPR4itPO6LRuEBFlcq3pB04tWsICO3lQEfXJIWGHWUlLUP5/ZkTDJ41zzJHAXxYg1p1tw14xAAAAAElFTkSuQmCC";
const memberIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACj0lEQVRoge3Zz4tNYRzH8ZefjZlho+RHLBSNWFiRnc0o8QcQhrGhbMRKLFgoKYkUURZEsiFqFpLZCRvFQtnMQojJIGL8yFg8z3WLc9yZ5x5zz8191+l77j3n+X6fz/0+3/M89zm0aNHiv2BCjett2Iq1mIuJBccfxlNcRH/Bvn+xEE8wMk7HeUxO7WxeRtrwEF0YxMn4+UtqoBxmohu9QraPYF+RAXYIv9Ig5hXpOIctMd4wZhXp+Hp0fKBIpzV4FGNuTGmcV7yzo32c4jSRR9HOSWmcJ6Ty/fcUp4l8i3ZSSuOiH6cNoyWkbJRdyCJhnmmvdWPZhazBLbzEHn9ZUpVdyPN4zMAxHM27sexCrmO+kA3YixVZN5ZdCGG2P44rwtDalnVTMwip0Bft0qyLzSRkKNppWRfLJKTyRBpJaVwmIQuifZ/SuCxCurAqnt9PcdBoIW3CfkBfPL+tupwfE6n/kXdiPzoS21foxJR4PiDn0ToaxipkOs5iQ2rADIZwGQfxJtXJWIQsx1VhIfdN2CS4lho48hmv8KNOP6MW0oPTwir0mZCRu/UGL5JaQjqFtFc2BG4K43got0XJeCBMTB+j/Sp7Gd01jn1aF/vyIOtirYx0yB5KnTgj1Epv/X2sn7x55G20N4Qi/70etmOTIKgU5GVkG5YJE1TW2mcg2pWYKgy9pqQdrwWRp9Sx+TwG6qqRPD5hNy5hl7BB0I93if4qfMA54UcaV3qEeiry9cILrM6I9U8yUuGC8EBYj8VCvdTDOtXaPITDCpj1G0EbTqhm547qpvZfM1JWNgv1MiKsxbo1qRBYIrzWGBHeCvRpUiH8OdSaVkiFLapD7V6D+1I3S4Sdx55Gd6RFixYN5CcpOqtXzBpIQAAAAABJRU5ErkJggg==";

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

const TabItemDiv = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.7);
  margin: 5px;
  border-radius: 10px;
  cursor: pointer;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px auto;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 5px;
  border-radius: 10px;
  position: fixed;
  background-color: #252833;
  z-index: 10;
  color: #ffffff;
  max-width: 400px;
  min-width: 350px;
`;

const SearchInput = styled.input`
  background: none;
  border: 1px solid #ffffff;
  border-radius: 10px;
  padding: 5px;
  outline: none;
  color: #ffffff;
  min-width: 230px;
`;

const MessengerTabItem = (params: { icon: string; onClick: () => void; title: string }) => {
  const [isChipOpen, setIsChipOpen] = useState(false);
  const { icon, onClick, title } = params;
  return (
    <>
      <Chip text={title} open={isChipOpen} additioanalStyle={{ right: "-60px" }} />
      <TabItemDiv
        style={{ backgroundImage: `url(${icon})` }}
        onClick={onClick}
        onMouseOver={() => setIsChipOpen(true)}
        onMouseOut={() => setIsChipOpen(false)}
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
          <div>
            <MessengerTabItem onClick={() => setActiveTab("latest")} icon={memberIcon} title="Latest" />
            <MessengerTabItem onClick={() => setActiveTab("members")} icon={latestIcon} title="Members" />
          </div>
          <div>
            <SearchBox>
              Search: <SearchInput value={searchText} onChange={(e) => setSearchText(e.target.value)} />
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
