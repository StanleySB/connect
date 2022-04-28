import React from "react";
import styled from "styled-components";

const ChipDiv = styled.div`
  position: relative;
`;
const ChipText = styled.div`
  position: absolute;
  top: -30px;
  background: gray;
  border-radius: 5px;
  padding: 5px 5px;
  max-width: 200px;
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
