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
  height: 100%;
  margin-top: 50px;
`;

const SearchPanelBoxDiv = styled.div`
  color: ${CSS.latestColor};
  position: relative;
  overflow: auto;
  flex-grow: 1;
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
        {foundedItems?.members.map((val, index) => (
          <MemberItem memberVO={val} key={index} departament={foundedItems.departaments.get(val.department_id)} />
        ))}
        {foundedItems?.members.length === 0 && "No Members found"}

        {foundedItems?.latests.map((val, index) => (
          <LatestItem chatVO={val} key={index} />
        ))}
        {foundedItems?.latests.length === 0 && "No Chats found"}
      </SearchPanelBoxDiv>
    </SearchPanelDiv>
  );
};
export default SearchPanel;
