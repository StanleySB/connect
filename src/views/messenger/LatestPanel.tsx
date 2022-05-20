import React, { useState, useEffect, memo } from "react";
import styled from "styled-components";
import GD from "../../GD";
import Avatar from "../Avatar";
import CSS from "../CSS";

const LatestDiv = styled.div`
  color: ${CSS.latestColor};
  font-family: "Open Sans", sans-serif;
  display: flex;
  flex-direction: column;
  flex-grow: 0.3;
  max-width: 400px;
  min-width: 350px;
  /*background-color: rgba(0,0,0,.3);
    box-shadow:0px 0px 20px rgba(0,0,0,.2);*/
  height: calc(100% - 70px);
  margin-top: 70px;
`;

const LatestBoxDiv = styled.div`
  color: ${CSS.latestColor};
  position: relative;
  overflow: auto;
  flex-grow: 1;
`;

const LatestBoxContainerDiv = styled.div`
  position: absolute;
  color: ${CSS.latestColor};
  width: 100%;
`;

const LatestItemDiv = styled.div`
  padding: 20px 12px 20px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  border-left: 4px solid transparent;
  &[data-selected="true"] {
    background-color: #00000096;
    border-left: 4px solid #e91e63;
  }
  color: #9ab2d2;
  &[data-unread="true"] {
    color: #ffffff;
  }
`;

const LatestItemMsgBlockDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  overflow: hidden;
  flex-grow: 1;
`;

const LatestItemTitleDiv = styled.div`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &[data-unread="true"] {
    font-weight: bold;
  }
`;
const LatestItemDate = styled.div`
  color: #afc8d4;
  position: sticky;
  font-size: 11px;
  top: 0;
  padding: 5px 10px 5px 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #2d354e;
  border-radius: 10px;
  width: 100px;
  text-align: center;
  left: calc(50% - 60px);
`;

const LatestItemMsgDiv = styled(LatestItemTitleDiv)`
  font-size: 12px;
  margin-top: 5px;

  &[data-author]::before {
    content: attr(data-author);
    display: inline-block;
    font-size: 10px;
    background-color: #374354;
    padding: 3px 5px 3px 5px;
    border-radius: 5px;
    margin-right: 5px;
    color: #aed086;
  }
`;
const LatestItemTimeDiv = styled(LatestItemTitleDiv)`
  font-size: 11px;
  width: 45px;
  min-width: 45px;
  text-align: right;
  margin-right: 5px;
  color: #ffffff85;
  display: flex;
  flex-direction: column;
  &::after {
    content: attr(data-unread);
    color: #ffc107;
    font-size: 15px;
    margin-top: 2px;
  }
  &[data-unread="0"]::after {
    display: none;
  }
`;

const LatestItemMsgImgDiv = styled.div`
  width: 100%;
  height: 120px;
  margin-top: 3px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  cursor: pointer;
  border-radius: 3px;

  &[data-author] {
    background-position: center 23px;
  }

  &[data-author]::before {
    content: attr(data-author);
    display: inline-block;
    font-size: 10px;
    background-color: #374354;
    padding: 3px 5px 3px 5px;
    border-radius: 5px;
    margin-right: 5px;
    color: #aed086;
  }
`;

const LatestItemMsgImg = memo((params: { message: MessageVO; author?: string | null | undefined }) => {
  // load image
  const tmp = params.message.sys?.additionalData.split(",");
  const imgUID = tmp[0];
  const chatUID = params.message.chatUID;
  const [b64, setB64] = useState<string | null>(null);

  useEffect(() => {
    GD.S_IMAGE_REQUEST.invoke({ uid: imgUID, thumb: true, chatUID: chatUID });
    GD.S_IMAGE_READY.add((data) => {
      if (data.uid !== imgUID || !data.thumb) return;
      console.log("img uid", data.uid);
      setB64(data.b64);
    }, "li" + imgUID);
    return () => {
      GD.S_IMAGE_READY.clearContext("li" + imgUID);
    };
  }, [imgUID, chatUID]);

  return <LatestItemMsgImgDiv data-author={params.author} style={{ backgroundImage: `url(${b64}` }}></LatestItemMsgImgDiv>;
});

export const LatestItem = (params: { chatVO: ChatVO }) => {
  const { title, uid, message, time, selected, author, unread } = params.chatVO;
  const onChatClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      GD.S_LOG.invoke(params.chatVO);
      return;
    }
    GD.S_CHAT_OPEN_REQUEST.invoke({ chatUID: uid });
  };
  let msg = null;
  if (message) {
    if (message.type === "img") {
      msg = <LatestItemMsgImg author={author} message={message}></LatestItemMsgImg>;
    } else msg = <LatestItemMsgDiv data-author={author}>{message.text}</LatestItemMsgDiv>;
  }

  let date = null;
  if (params.chatVO.position === "standalone") {
    date = <LatestItemDate>{params.chatVO.date}</LatestItemDate>;
  }

  return (
    <>
      {date}
      <LatestItemDiv data-unread={unread > 0} data-selected={selected} onClick={onChatClick}>
        <Avatar user="" avatar="" />
        <LatestItemMsgBlockDiv>
          <LatestItemTitleDiv data-unread={unread > 0}>{title}</LatestItemTitleDiv>
          {msg}
        </LatestItemMsgBlockDiv>
        <LatestItemTimeDiv data-unread={unread}>{time}</LatestItemTimeDiv>
      </LatestItemDiv>
    </>
  );
};

const LatestPanel = () => {
  const [latest, setLatest] = useState<ChatVO[]>([]);
  useEffect(() => {
    GD.S_LATEST_READY.add((latest) => {
      setLatest([...latest]);
    }, "latestPanel");
    GD.S_LATEST_REQUEST.invoke({ viaServer: false });
    GD.S_LATEST_REQUEST.invoke({ viaServer: true });
    return () => {
      GD.S_LATEST_READY.clearContext("latestPanel");
    };
  }, []);
  let i = 0;
  const latestList = latest.map((val) => <LatestItem chatVO={val} key={i++} />);
  return (
    <LatestDiv>
      <LatestBoxDiv>
        <LatestBoxContainerDiv>{latestList}</LatestBoxContainerDiv>
      </LatestBoxDiv>
    </LatestDiv>
  );
};
export default LatestPanel;
