import React from "react";
import * as CSS from "csstype";
import styled from "styled-components";

const ChipDiv = styled.div`
  position: relative;
  z-index: 100;
`;
const ChipText = styled.div`
  position: absolute;
  top: 10px;
  background: gray;
  border-radius: 5px;
  padding: 5px 5px;
  max-width: 400px;
  width: max-content;
`;

const Chip = (params: { text: string; open: boolean; additioanalStyle?: CSS.Properties }) => {
  const { text, open, additioanalStyle } = params;
  return (
    <ChipDiv style={{ display: `${open ? "block" : "none"}`, ...additioanalStyle }}>
      <ChipText>{text}</ChipText>
    </ChipDiv>
  );
};

export default Chip;
