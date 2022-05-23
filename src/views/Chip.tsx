import React from "react";
import * as CSS from "csstype";
import styled from "styled-components";

const ChipDiv = styled.div`
  position: relative;
  z-index: 100;
`;
const ChipText = styled.div`
  position: absolute;
  top: 15px;
  background: rgba(0, 0, 0, 0.9);
  color: #f1d7d7;
  font-size: 12px;
  line-height: 15px;
  border-radius: 4px;
  padding: 11px 15px;
  z-index: 100;
  max-width: 200px;
  width: max-content;
  &:after {
    position: absolute;
    width: 14px;
    height: 14px;
    background: rgba(0, 0, 0, 0.9);
    transform: rotate(-45deg);
    position: absolute;
    content: "";
    border-radius: 1px;
  }
  &[data-direction="right"]:after {
    left: -4px;
  }
  &[data-direction="top"]:after {
    left: 10px;
    top: -5px;
  }
`;

const Chip = (params: { text: string; open: boolean; additioanalStyle?: CSS.Properties; direction?: string }) => {
  const { text, open, additioanalStyle, direction = "top" } = params;

  return (
    <ChipDiv style={{ display: `${open ? "block" : "none"}`, ...additioanalStyle }}>
      <ChipText data-direction={direction}>{text}</ChipText>
    </ChipDiv>
  );
};

export default Chip;
