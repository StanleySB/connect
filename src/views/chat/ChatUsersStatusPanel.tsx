import React, { useState } from "react";
import styled from "styled-components";
import Chip from "../Chip";
import CSS from "../CSS";

const ChatUsersStatusPanelDiv = styled.div`
  background-color: ${CSS.chatColor};
  color: ${CSS.chatHeadColor};
  padding: 5px 15px;
  display: flex;
  overflow-x: auto;
  overflow-y: unset;
`;

const UserDiv = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  background: white;
  border-radius: 10px;
  background-size: contain;
  background-repeat: no-repeat;
  margin: 0px 5px;
  border: 0.5px solid black;
  position: relative;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABmJLR0QA/wD/AP+gvaeTAAADtklEQVRoge2az2scZRjHP8/MJCAYFESrNpSWCC3iRf0DepGiFkwFHZ11QgkKNRsTiwdP0mpPXo1JShDRJJsNLGylsVVQFHuoBwV7KMWToWCsh4jWxIPd7LyPh8QaEs3sj2fSCPO57vt+9/vd533fed93FnJycnJydi6yHV8yMVXZkwT1XpTDCnuB7rWPFgSuKnoOzzs7GEU/Zu0l08CnJyu7kyA5IeiLgJ/S3IFUPY/XB6LoalaeMgs8Xi4fUWUauL3JrsviJC72RXNZ+PKyEB2bmXlVlSrNhwXoUk8/Gp2ZHbb2BRlUeK2yVdr/MZ04edq60qaBR0qlbl+872mtsv/GsvPkwFAUXTPSsx3SnninsAsL0OU7fctQz67CE1OVPXW/Pk/6atwsSaJu73AcL1iImVV4xU+OYB8WwA/we63EzAKL6hNWWhtR0SettOzmsMgDZlqb6bESMly09F47rU3sthKyXKUtV+fMtDPZae1kLAP/Yai1kSUrIcvAZruhLLXtAivzZlqbMdM2fCzpeTOtDSh6zkrLLrDnnQUSM71/qDvVj63EzAKvXs/Ih1Z6N1Het9pHg/Vpqe6fBJYNJZcCTUxPS6aBB46GP4l6z2EztB1CfKyv72cDrZuYbzyK8fOfKvIa4NqQcSIcHywUzObu32R3iTc9+5R6WgK6muy6pOpeeCWOzVbm9WS2tSz2RXNJR9ADOgLUG+jiBJ0OXHIgq7CwTRfxI6VSd4Dfq+IOg+xj3UU8MI9wPnFuznI1zsnJycn5P5LZY6lSqfiLtdojIvKwU3lIRB8E6QbuBO4AQLmO8DvoAnBF4Eried/t8v1LYRhmcfKyDXx6auoeFwTPoHII9CCr4VrhN4SvxMln9U6/OhyGi1Ye2w5cqVQ6F1dWnkUlRngMCAx8racO+jki03cHQTUMw1o7Yi0HHp2cvEs6Ol5GGQTua8dEE1wTZbSzM5h4KQx/bUWg6cBrFR0AeZPWh2y7XBf07dtqtXf6+/v/bKZjU4HHy+WDqvIB6L7m/GWDwA+JuqNDcXyx0T4NnZZUVcZmZk+p8sVOCQug0OOJd2G8XD6hqg0VL7WRqspYufyuIIPtW8wQ4b1iFB0TEd2qWer73F379w+BnLRzlhmPfnv58i+fnDnzzVaNUoe0KsftPGWNpP7zp5E5fL+Bk+0i1WsjgS8ZGNkuUr2mBvaEN2jsTupWsyKrXrckNfBAofClqjyO8jVww8SaLTcEueicHCoWChdutZmcnJycnJyc/+YvUbMou8GhctcAAAAASUVORK5CYII=);
  &::after {
    background-color: red;
    border-radius: 50%;
    content: "";
    height: 10px;
    width: 10px;
    position: absolute;
    top: -3px;
    right: -3px;
  }
  &[data-online="true"]&::after {
    background-color: green;
  }
`;

const ChatUsersStatusPanel = (params: { users: Array<UserVO>; onlineUsers: Map<string, { online: boolean }> }) => {
  const { users, onlineUsers } = params;
  const [isChipOpen, setIsChipOpen] = useState<{ uid: string; open: boolean }>({ uid: "", open: false });

  return (
    <ChatUsersStatusPanelDiv>
      {users.map((user) => {
        return (
          <React.Fragment key={user.uid + isChipOpen + onlineUsers.values}>
            <UserDiv
              style={user.avatar ? { backgroundImage: `url(${user.avatar})` } : {}}
              data-online={onlineUsers.get(user.uid)?.online}
              onMouseOver={() => setIsChipOpen({ uid: user.uid, open: true })}
              onMouseOut={() => setIsChipOpen({ uid: user.uid, open: false })}
            />
            <Chip text={user.name} open={isChipOpen.uid === user.uid ? isChipOpen.open : false} />
          </React.Fragment>
        );
      })}
    </ChatUsersStatusPanelDiv>
  );
};

export default ChatUsersStatusPanel;
