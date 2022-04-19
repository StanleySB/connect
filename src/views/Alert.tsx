import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GD from "../GD";

const AlertDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.65);
`;
const AlertBlockDiv = styled.div`
  width: 80%;
  max-height: 80%;
  min-height: 10%;
  border-radius: 10px;
  padding: 10px;
  background-color: white;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  color: #e91e63;
  display: flex;
  font-size: 15px;
  text-align: center;
  justify-content: center;
  align-items: center;
  white-space: pre-line;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Alert = () => {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    GD.S_ALERT_ERROR.add((txt) => {
      GD.S_LOGE.invoke(txt);
      setMsg(txt);
    }, "alert");
    return () => {
      GD.S_ALERT_ERROR.clearContext("alert");
    };
  });
  const alertClick = (e: React.MouseEvent) => {
    setMsg(null);
  };
  if (!msg) return <></>;
  return (
    <AlertDiv onClick={alertClick}>
      <AlertBlockDiv>{msg}</AlertBlockDiv>
    </AlertDiv>
  );
};

export default Alert;
