import React from "react";
import styled from "styled-components";

const AvatarDiv = styled.div`
  width: 33px;
  height: 31px;
  min-width: 33px;
  min-height: 31px;
  border-radius: 50%;
  background-color: #595973;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  padding-top: 9px;
  font-size: 11px;
  line-height: 13px;
`;

const Avatar = (params: { user: string; avatar: string }) => {
  const { user } = params;
  const initials = user
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return <AvatarDiv>{initials}</AvatarDiv>;
};

export default Avatar;
