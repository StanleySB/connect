import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GD from "../../GD";
import CSS from "../CSS";
import { LatestItem } from "./LatestPanel";
import { MemberItem } from "./MembersPanel";

const SearchPanelDiv = styled.div`
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
  height: calc(100% - 50px);
  margin-top: 50px;
`;

const SearchPanelBoxDiv = styled.div`
  color: ${CSS.latestColor};
  position: relative;
  overflow: auto;
  flex-grow: 1;
`;

const SearchPanelBoxContainerDiv = styled.div`
  position: absolute;
  color: ${CSS.latestColor};
  width: 100%;
`;

const SearchTitle = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  font-size: 20px;
  padding: 10px;
  margin: 2px 0px;
  border-bottom: 1px solid;
  border-top: 1px solid;
`;

const SearchEmptyText = styled.div`
  justify-content: center;
  display: flex;
  padding: 5px;
`;

const SearchPanel = (params: { searchText: string }) => {
  const [foundedItems, setFoundedItems] = useState<FoundedItemVO>();
  const { searchText } = params;

  useEffect(() => {
    GD.S_MESSENGER_SEARCH_READY.add((foundedItems) => {
      setFoundedItems(foundedItems);
    }, "searchPanel");

    return () => {
      GD.S_MESSENGER_SEARCH_READY.clearContext("searchPanel");
    };
  }, []);

  useEffect(() => {
    GD.S_MESSENGER_SEARCH_REQUEST.invoke(searchText);
  }, [searchText]);

  return (
    <SearchPanelDiv>
      <SearchPanelBoxDiv>
        <SearchPanelBoxContainerDiv>
          <SearchTitle>Chats</SearchTitle>
          {foundedItems?.latests.map((val, index) => (
            <LatestItem chatVO={val} key={index} />
          ))}
          {foundedItems?.latests.length === 0 && <SearchEmptyText>No Chats found</SearchEmptyText>}
          <SearchTitle>Members</SearchTitle>
          {foundedItems?.members.map((val, index) => (
            <MemberItem memberVO={val} key={index} departament={foundedItems.departaments.get(val.department_id)} />
          ))}
          {foundedItems?.members.length === 0 && <SearchEmptyText>No Members found</SearchEmptyText>}
        </SearchPanelBoxContainerDiv>
      </SearchPanelBoxDiv>
    </SearchPanelDiv>
  );
};
export default SearchPanel;
