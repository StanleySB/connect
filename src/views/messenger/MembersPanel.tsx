import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GD from "../../GD";
import Avatar from "../Avatar";
import CSS from "../CSS";

const MemberDiv = styled.div`
  color: ${CSS.latestColor};
  font-family: "Open Sans", sans-serif;
  display: flex;
  flex-direction: column;
  flex-grow: 0.3;
  max-width: 400px;
  min-width: 350px;
  margin-right: 20px;
  /*background-color: rgba(0,0,0,.3);
    box-shadow:0px 0px 20px rgba(0,0,0,.2);*/
  height: 100%;
  margin-top: 50px;
`;

const MemberBoxDiv = styled.div`
  color: ${CSS.latestColor};
  position: relative;
  overflow: auto;
  flex-grow: 1;
`;

const MemberBoxContainerDiv = styled.div`
  position: absolute;
  color: ${CSS.latestColor};
  width: 100%;
`;

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

const MemberItemMsgBlockDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  overflow: hidden;
  flex-grow: 1;
  font-size: 12px;
  color: #9ab2d2;
  & > div {
    margin-top: 2px;
  }
`;

const MemberItemTitleDiv = styled.div`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ffffff;
`;

export const MemberItem = (params: { memberVO: MemberVO; departament?: DepartamentVO }) => {
  const { name, uid, city, companyPhone } = params.memberVO;

  const onChatClick = (e: React.MouseEvent) => {
    GD.S_CHAT_OPEN_REQUEST.invoke({ userUID: [uid] });
  };

  return (
    <>
      <MemberItemDiv onClick={onChatClick}>
        <Avatar user={name} avatar="" />
        <MemberItemMsgBlockDiv>
          <MemberItemTitleDiv>{name}</MemberItemTitleDiv>
          <div>City: {city}</div>
          <div>Departament: {params.departament?.title}</div>
          <div>Company Phone: {companyPhone}</div>
        </MemberItemMsgBlockDiv>
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
    <MemberDiv>
      <MemberBoxDiv onScroll={handleScroll}>
        <MemberBoxContainerDiv>
          {slicedMembers.map((val, index) => (
            <MemberItem memberVO={val} key={index} departament={departaments.get(val.department_id)} />
          ))}
        </MemberBoxContainerDiv>
      </MemberBoxDiv>
    </MemberDiv>
  );
};
export default MembersPanel;
