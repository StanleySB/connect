class CSS {
  static scheme: "light" | "dark" | "blue" = "light";

  static get scrollbar(): string {
    if (this.scheme === "dark") return "#14171E";
    if (this.scheme === "blue") return "#060E37";
    return "#E8F3FB";
  }

  static get defaultColor(): string {
    return "#484654";
  }

  static get lightTextColor(): string {
    return "rgba(0, 0, 0, 0.5)";
  }

  static get lightBorderColor(): string {
    return "rgba(0, 0, 0, 0.2)";
  }

  static get disabledColor(): string {
    return "#3e3e3e";
  }

  static get chatBG(): string {
    if (this.scheme === "dark") return "#14171E";
    if (this.scheme === "blue") return "#060E37";
    return "#E8F3FB";
  }

  static get chatColor(): string {
    if (this.scheme === "dark") return "#222730";
    if (this.scheme === "blue") return "#1D2852";
    return "#FFFFFF";
  }

  static get chatTextColor(): string {
    if (this.scheme === "light") return "#14171E";
    return "#F7F9FA";
  }

  static get chatMineTextColor(): string {
    return "#F7F9FA";
  }

  static get chatInputColor(): string {
    if (this.scheme === "light") return "#14171E";
    return "#F7F9FA";
  }
  static get chatMessageTextSize(): string {
    return "14px";
  }
  static get chatMessagePadding(): string {
    return "12px 12px 12px 12px"; //15
  }
  static get chatMessageBorderRadius(): string {
    return "17px";
  }
  static get chatMessageSmallBorderRadius(): string {
    return "5px";
  }
  static get chatMessageBg(): string {
    if (this.scheme === "dark") return "#222730";
    if (this.scheme === "blue") return "#1D2852";
    else return "#FFFFFF";
  }
  static get chatMessageBotItemBg(): string {
    return "#2FAA77";
  }
  //mine
  static get chatMessageBgLeft(): string {
    return "#2FAA77";
  }

  // not mine
  static get chatMessageColorLeft(): string {
    if (this.scheme === "dark") return "rgba(255,255,255,.95)";
    return "rgba(0,0,0,.8)";
  }

  // mine
  static get chatMessageColorRight(): string {
    return "rgba(255,255,255,1)";
  }

  static get chatMessageFileItemBg(): string {
    return "#283582";
  }

  static get chatMessageFileMsgBg(): string {
    return "#3f51b5";
  }

  static get chatMessageAuthorColor(): string {
    if (this.scheme === "light") return "rgba(0,0,0,.5)";
    return "#aed086";
  }

  static get chatMessageTimeColor(): string {
    if (this.scheme === "light") return "rgba(0,0,0,.5)";
    return "rgba(255,255,255,.6)";
  }

  static get chatMessageBotMenuColor(): string {
    if (this.scheme === "light") return "red";
    return "#ff9800";
  }

  static get chatSendBtnBg(): string {
    if (this.scheme === "dark") return "#A5201C";
    return "#A5201C";
  }
  static get chatHeadColor(): string {
    if (this.scheme === "light") return "#14171E";
    return "#FFFFFF";
  }

  static get linkColor(): string {
    return "#0b3d65";
  }
  static get linkBGColor(): string {
    return "rgba(255,255,255,.7)";
  }
  static get linkBGColorHover(): string {
    return "rgba(255,255,255,1)";
  }

  static get linkColorRight(): string {
    if (this.scheme === "dark") return "#03a9f4";
    return "#0b3d65";
  }
  static get linkBGColorRight(): string {
    //rgba(255,255,255,.9)';
    if (this.scheme === "dark") return "rgba(0,0,0,.8)";
    return "rgba(255,255,255,1)";
  }
  static get latestColor(): string {
    return "#FFFFFF";
  }

  static get toastBGColor(): string {
    if (this.scheme === "light") return "#283582";
    return "#283582";
  }

  static get toastTextColor(): string {
    if (this.scheme === "light") return "#fff";
    return "#fff";
  }

  static get messageCloudTaleLeft(): string {
    return `
    &:before {
      border-bottom-right-radius: 40px;
      border-left: 20px solid ${CSS.chatMessageBg};
      left: -10px;
      transform: rotate(20deg);
      bottom: 5px;
      content: "";
      height: 15px;
      position: absolute;
    }
    &::after {
      background-color: ${CSS.chatBG};
      border-bottom-right-radius: 14px;
      left: 10px;
      transform: translate(-40px, 1px);
      width: 30px;
      bottom: 10px;
      content: "";
      height: 30px;
      position: absolute;
    }
    `;
  }

  static get messageCloudTaleRight(): string {
    return `
    &:before {
      border-bottom-left-radius: 40px;
      border-right: 20px solid ${CSS.chatMessageBgLeft};
      right: -10px;
      transform: rotate(-20deg);
      bottom: 5px;
      content: "";
      height: 15px;
      position: absolute;
    }
    &::after {
      background-color: ${CSS.chatBG};
      border-bottom-left-radius: 14px;
      right: -50px;
      transform: translate(-30px, -1px);
      width: 20px;
      bottom: 7px;
      content: "";
      height: 30px;
      position: absolute;
    }
    `;
  }
}

export default CSS;
