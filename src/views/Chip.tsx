import React from "react";
import styled from "styled-components";

const ChipDiv = styled.div`
  position: relative;
  z-index: 10;
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

const Chip = (params: { text: string; open: boolean }) => {
  const { text, open } = params;
  return (
    <ChipDiv style={{ display: `${open ? "block" : "none"}` }}>
      <ChipText>{text}</ChipText>
    </ChipDiv>
  );
};

export default Chip;
