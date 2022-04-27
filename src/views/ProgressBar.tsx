import React from "react";
import styled from "styled-components";

const ProgressBarDiv = styled.div`
  width: 24px;
  min-width: 24px;
  height: 24px;
  margin-right: 5px;
  font-size: 8px;
`;

const ProgressBar = (params: { progress: number; total: number }) => {
  // TODO: Add chip, change style
  return (
    <ProgressBarDiv>
      Read by {params.progress} / {params.total}
    </ProgressBarDiv>
  );
};

export default ProgressBar;
