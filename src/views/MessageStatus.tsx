import React from "react";
import styled from "styled-components";

const ChatMessageStatus = styled.div`
  width: 24px;
  min-width: 24px;
  height: 24px;
  margin-right: 5px;
  &[data-status="read"] {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABUUlEQVRIie2SsUrDUBiFv5tcIejcgOAbtLZUFzex3XQQKnR08BkC2hcQxb6EjhmyiYtxEMRJkdCAg7vSWcEhudehsWmDqU0nwZ7xkP/Lf85/Ya65/rzErINVz7FFZF4JeH9qn27m+cbscMMH1jRYk3xZFF53OyUVqWugAjxHqN1JfqGK6m6npFA+sJpAtsL22VueXziBRp0nkFDLuBG2uv2q59gqin0QFdA9LVUzbHX73zMFK9J3IJSW8UGQwAedp/BgBA5JRTX36FagF5WMt0c/qLmH9wIWsj6MHjQfDpC8Im1pWBeR4Vc9x04rQf7kTwsfJsgeSZpm42Hv+PUnX8U6yjto7g/SrcwboAy6pz/VRrDf/chum4z9unmmIgha3b6WcQMIQZSxjJXUV80BXFSKwMcSDJNcOEvSksuP7ZOXMd9zbCLzEgAZ70wDn+uf6AselN1N/IXehQAAAABJRU5ErkJggg==);
  }
  &[data-status="delivered"] {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA20lEQVRIie2UsQrCMBRFb4Ip/kD7FUoHacFJ1E0Hf9XFzc4uJRBw8BPET+iT1MFWQg21abrZO+aFe+57eQQYNcpXbCgjpVRUFMURACVJsqrP+VDmRJQxxpaMsalZ8wZIKUMiOgOYAbhprQ9m3WtEUspQa50BmFfm6zRN74MAupj3BnQ17wVwMbcC8jy/ABBCiF0cxw+zVm8L3g96FUJsm3ea+tqisiwnABZElCmlIh9zawfNEQDYcM6fLmNpBdjSVsdOyVsBlk7gmvwnAPj8LycACIJg75J81B/pBUirmXOOwxAnAAAAAElFTkSuQmCC);
  }
`;

const MessageStatus = (params: { status: "read" | "delivered" }) => {
  const { status } = params;
  return <ChatMessageStatus data-status={status} />;
};

export default MessageStatus;
