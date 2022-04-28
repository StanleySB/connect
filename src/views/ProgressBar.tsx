import React, { useState } from "react";
import styled from "styled-components";
import Chip from "./Chip";

const ProgressBarDiv = styled.div`
  height: 5px;
  margin-right: 5px;
  background-color: grey;
  border-radius: 2px;
  width: 24px;
  min-width: 24px;
  cursor: pointer;
`;

const Progress = styled.div`
  height: 5px;
  margin-right: 5px;
  background-color: #2faa77;
  border-radius: 2px;
  margin-left: -1px;
`;

const ProgressBar = (params: { progress: number; total: number; chipText: string }) => {
  const [isChipOpen, setIsChipOpen] = useState(false);
  const { progress, total, chipText } = params;

  return (
    <ProgressBarDiv onMouseOver={() => setIsChipOpen(true)} onMouseOut={() => setIsChipOpen(false)}>
      <Chip text={chipText} open={isChipOpen} />
      <Progress style={{ width: `${(progress / total) * 100}%` }} />
    </ProgressBarDiv>
  );
};

export default ProgressBar;
