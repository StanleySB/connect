import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GD from "../../GD";
import { LatestItem } from "./LatestPanel";
import { MemberItem } from "./MembersPanel";
import { PanelBoxContainerDiv, PanelBoxDiv, PanelDiv } from "./Messenger";

const SearchTitle = styled.div`
  padding: 20px 0px 10px 20px;
  color: rgba(238, 255, 245, 0.55);
  text-transform: uppercase;
`;

const SearchPanel = (params: { searchText: string }) => {
  const [foundedItems, setFoundedItems] = useState<FoundedItemVO>();
  const { searchText } = params;

  useEffect(() => {
    GD.S_MESSENGER_SEARCH_READY.add((foundedItems) => {
      setFoundedItems({ ...foundedItems });
    }, "searchPanel");

    return () => {
      GD.S_MESSENGER_SEARCH_READY.clearContext("searchPanel");
    };
  }, []);

  useEffect(() => {
    GD.S_MESSENGER_SEARCH_REQUEST.invoke(searchText);
  }, [searchText]);

  return (
    <PanelDiv>
      <PanelBoxDiv>
        <PanelBoxContainerDiv>
          <SearchTitle>Chats:</SearchTitle>
          {foundedItems?.latests.map((val, index) => (
            <LatestItem chatVO={val} key={index} />
          ))}
          <SearchTitle>Members:</SearchTitle>
          {foundedItems?.members.map((val, index) => (
            <MemberItem memberVO={val} key={index} departament={foundedItems.departaments.get(val.department_id)} />
          ))}
        </PanelBoxContainerDiv>
      </PanelBoxDiv>
    </PanelDiv>
  );
};
export default SearchPanel;
