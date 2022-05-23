import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GD from "../../GD";
import Avatar from "../Avatar";
import { PanelBoxContainerDiv, PanelBoxDiv, PanelDiv } from "./Messenger";

const phoneIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNCAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjA3MzggNy45NDQ1QzkuODUyNjIgNy44MjU1IDkuNTgwODEgNy44MjggOS4zNjA3NCA3Ljk0OEw4LjI0NjI2IDguNTU3NUM3Ljk5Njc4IDguNjk0IDcuNjg1MiA4LjY3OCA3LjQ1NjQyIDguNTE0QzcuMDYwOTYgOC4yMzA1IDYuNDI0MTggNy43NTM1IDUuODcwMjEgNy4yNDVDNS4zMTYyMyA2LjczNjUgNC43OTY1NyA2LjE1MiA0LjQ4NzcyIDUuNzg5QzQuMzA5MDUgNS41NzkgNC4yOTE2MiA1LjI5MyA0LjQ0MDMzIDUuMDY0TDUuMTA0MzQgNC4wNDFDNS4yMzU2MSAzLjgzOSA1LjIzNjcgMy41ODc1IDUuMTA3MDYgMy4zODQ1TDMuNDcxODIgMC44MjA1QzMuMzEzMzEgMC41NzI1IDIuOTk4NDcgMC40NTA1IDIuNjkzOTcgMC41MTlDMi4zOTgxOSAwLjU4NSAyLjAxNDE3IDAuNzQ2IDEuNjExNjIgMS4xMTZDMC4zNTExNSAyLjI3MyAtMC4zMTgzMDYgNC4yMjQ1IDQuNDIxODEgOC41NzU1QzkuMTYxOTIgMTIuOTI2NSAxMS4yODc0IDEyLjMxMjUgMTIuNTQ4NCAxMS4xNTVDMTIuOTUyMSAxMC43ODQ1IDEzLjEyNjkgMTAuNDMxNSAxMy4xOTk0IDEwLjE1OTVDMTMuMjcyOSA5Ljg4MDUgMTMuMTQyMiA5LjU5MzUgMTIuODcyNSA5LjQ0ODVDMTIuMTk5MyA5LjA4NyAxMC43NDcgOC4zMDY1IDEwLjA3MzggNy45NDQ1VjcuOTQ0NVoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4K";

const MemberItemDiv = styled.div`
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
`;

const MemberItemInfoBlockDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 20px;
  overflow: hidden;
  flex-grow: 1;
  font-size: 12px;
  color: #99d7eb;
  & > div {
    margin-top: 2px;
  }
`;

const MemberItemTitleDiv = styled.div`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #f1d7d7;
`;

const MemberItemPhoneBox = styled.div`
  display: flex;
  color: #fff5d2;
`;
const MemberItemPhoneIcon = styled.div`
  width: 12px;
  height: 12px;
  margin-right: 8px;
`;

export const MemberItem = (params: { memberVO: MemberVO; departament?: DepartamentVO }) => {
  const { name, uid, companyPhone } = params.memberVO;

  const onChatClick = (e: React.MouseEvent) => {
    GD.S_CHAT_OPEN_REQUEST.invoke({ userUID: [uid] });
  };

  return (
    <>
      <MemberItemDiv onClick={onChatClick}>
        <Avatar user={name} avatar="" />
        <MemberItemInfoBlockDiv>
          <div>
            <MemberItemTitleDiv>{name}</MemberItemTitleDiv>
            <div>{params.departament?.title}</div>
          </div>
          <MemberItemPhoneBox>
            <MemberItemPhoneIcon style={{ backgroundImage: `url(${phoneIcon}` }} />
            <div>{companyPhone}</div>
          </MemberItemPhoneBox>
        </MemberItemInfoBlockDiv>
      </MemberItemDiv>
    </>
  );
};

const MembersPanel = () => {
  const [members, setMembers] = useState<MemberVO[]>([]);
  const [departaments, setDepartaments] = useState<Map<number, DepartamentVO>>(new Map());
  const [loadMoreMembers, setLoadMoreMembers] = useState(false);
  const [page, setPage] = useState(1);
  const membersPageCount = 50;

  const slicedMembers = members.slice(0, membersPageCount * page);

  const handleScroll = (event: any) => {
    if (event.target.scrollTop + event.target.clientHeight + 100 < event.target.scrollHeight) return;
    setLoadMoreMembers(true);
  };

  useEffect(() => {
    GD.S_MEMBERS_READY.add((members) => {
      setMembers([...members]);
    }, "memberPanel");

    GD.S_DEPARTAMENTS_READY.add((departaments) => {
      setDepartaments(departaments);
    }, "memberPanel");

    GD.S_MEMBERS_REQUEST.invoke();

    return () => {
      GD.S_MEMBERS_READY.clearContext("memberPanel");
      GD.S_DEPARTAMENTS_READY.clearContext("memberPanel");
    };
  }, []);

  useEffect(() => {
    if (!loadMoreMembers) return;
    setPage(page + 1);
    setLoadMoreMembers(false);
  }, [loadMoreMembers, page]);

  return (
    <PanelDiv>
      <PanelBoxDiv onScroll={handleScroll}>
        <PanelBoxContainerDiv>
          {slicedMembers.map((val, index) => (
            <MemberItem memberVO={val} key={index} departament={departaments.get(val.department_id)} />
          ))}
        </PanelBoxContainerDiv>
      </PanelBoxDiv>
    </PanelDiv>
  );
};
export default MembersPanel;
