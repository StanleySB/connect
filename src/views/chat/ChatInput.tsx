import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import GD from "../../GD";
import CSS from "../CSS";

const ChatInputDiv = styled.div`
  display: flex;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 13px 15px 18px 15px;
  background-color: ${CSS.chatColor};
  align-items: center;
`;

let textParser: HTMLDivElement | null = null;

const ChatInputButton = styled.div`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  align-self: center;
`;
const ChatInputAttachDiv = styled(ChatInputButton)`
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTEuMjUiIHN0cm9rZT0iI0M4RDBEQiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTEyIDVWMTlNNSAxMkgxOSIgc3Ryb2tlPSIjQzhEMERCIiBzdHJva2Utd2lkdGg9IjEuNSIvPgo8L3N2Zz4K);
`;

const ChatInputSendDiv = styled(ChatInputButton)`
  border-radius: 50%;
  background-size: 60%;
  background-color: ${CSS.chatSendBtnBg};
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjMiIHZpZXdCb3g9IjAgMCAyNCAyMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIuMDgyMzEgOS45NjQyNkMxLjI5MyA5Ljc1MjE0IDAuODMzMzk0IDguOTcxMjIgMS4wNTYyIDguMjE4ODRDMS4xODkwOSA3Ljc2ODkzIDEuNTQ3NzcgNy40MTAzNCAyLjAxMzM3IDcuMjYxOTVMMjIuMDY3IDEuMDM1NTNDMjIuNDYwNiAwLjkxMjgyMyAyMi44ODQzIDEuMTE4MjggMjMuMDEzMiAxLjQ5MzA0QzIzLjA2MjEgMS42MzU3MiAyMy4wNjIxIDEuNzg5ODEgMjMuMDE0MiAxLjkzMjQ5TDE2LjQ3ODggMjEuMDMzMUMxNi4yMiAyMS43NzQxIDE1LjM3ODggMjIuMTczNiAxNC42MDA1IDIxLjkyNzNDMTQuMTMyOSAyMS43Nzg5IDEzLjc3MjIgMjEuNDE4NCAxMy42NDAzIDIwLjk2NjZMMTEuMzk2MiAxMi4wOTExTDIuMDgyMzEgOS45NjQyNloiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTIyLjgyOTYgMS4yMDcwM0wxMS4zOTY1IDEyLjA5MTQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==);
  width: 42px;
  height: 42px;
  min-width: 42px;
  min-height: 42px;
  background-position: 7px 10px;
`;

const ChatInputField = styled.div`
  flex-grow: 1;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  color: ${CSS.chatInputColor};
  font-size: 15px;
  line-height: 18px;
  &:focus {
    outline: none;
  }
  margin: 4px 10px 4px 10px;
  &[data-prompt="true"] {
    opacity: 0.7;
    color: #fff;
  }
`;

let inputChanged = false;
let prompt = "Type your message...";
GD.S_SHARED_OBJECT_READY.add((so) => {
  if (so.promptMessage && typeof so.promptMessage === "string")
    prompt = so.promptMessage;
});

const ChatInput = (params: { messenger?: boolean }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const file = useRef<HTMLInputElement | null>(null);
  const onSendClick = (e: React.MouseEvent) => {
    send();
  };

  useEffect(() => {
    const cur = ref.current;
    if (cur) cur.addEventListener("paste", onPaste);
    return () => {
      if (cur) cur.removeEventListener("paste", onPaste);
    };
  });

  const onAttachClick = (e: React.MouseEvent) => {
    //GD.S_CHAT_ATTACH_FILE_REQUEST.invoke();
    if (!file.current) return;
    file.current.click();
  };

  const onFileSelected = (e: React.ChangeEvent) => {
    const flist: FileList | null = (e.target as HTMLInputElement).files;

    if (!flist) return;

    const files: File[] = [];
    const l: number = flist.length;
    for (let i = 0; i < l; i++) {
      const f = flist.item(i);
      if (f) files.push(f);
    }
    GD.S_CHAT_ATTACH_FILE_REQUEST.invoke(files);
    (e.target as HTMLInputElement).value = "";
  };

  const onChange = (e: React.KeyboardEvent) => {
    if (!ref.current) return;

    if (e.code === "Enter" && !(e.altKey || e.ctrlKey || e.shiftKey)) {
      e.preventDefault();
      send();
    }

    if (ref.current.textContent && ref.current.textContent.length > 0) {
      inputChanged = true;
    } else {
      inputChanged = false;
    }
  };

  const onFocus = (e: React.FocusEvent) => {
    if (!ref.current) return;
    if (!inputChanged) {
      ref.current.removeAttribute("data-prompt");
      ref.current.textContent = "";
    }
  };

  const onBlur = (e: React.FocusEvent) => {
    if (!ref.current) return;
    if (ref.current.textContent && ref.current.textContent.length === 0)
      inputChanged = false;
    if (!inputChanged) {
      ref.current.textContent = prompt;
      ref.current.setAttribute("data-prompt", "true");
    }
  };

  const onPaste = (e: any) => {
    if (!ref.current) return;
    let evt = e as ClipboardEvent;
    if (!evt || !evt.clipboardData) return;

    let code = false;
    for (let i of evt.clipboardData.items) {
      if (i.kind === "file") {
        const file = i.getAsFile();
        if (file) {
          GD.S_CHAT_ATTACH_FILE_REQUEST.invoke([file]);
        }
      }
      if (
        i.type.indexOf("text/rtf") !== -1 ||
        i.type.indexOf("editor") !== -1
      ) {
        code = true;
      }
    }

    let txt = e.clipboardData.getData("text");
    if (code) txt = "{code}" + txt + "{code}";
    inputChanged = true;

    const selection = window.getSelection();

    if (!selection || !selection.rangeCount) return;

    if (!textParser) textParser = document.createElement("div");
    textParser.textContent = txt;
    txt = textParser.textContent;

    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(txt));
    e.preventDefault();
  };

  const send = () => {
    if (!ref.current) return;

    let txt = ref.current.innerHTML;

    if (!txt) return;

    txt = txt.replace("\t", "TAB");
    txt = txt.replaceAll("<br>", "\n");
    txt = txt.replaceAll("<div>", "");
    txt = txt.replaceAll("</div>", "\n");

    ref.current.textContent = txt;
    txt = ref.current.textContent;

    const translate: SimpleObjectVO = {
      "&nbsp;": "",
      "&amp;": "&",
      "&quot;": '"',
      "&lt;": "<",
      "&gt;": ">",
    };
    for (let i in translate) txt = txt.replaceAll(i, translate[i]);

    if (!txt) {
      GD.S_LOGE.invoke("No text to send");
      return;
    }

    if (!inputChanged) {
      GD.S_LOGE.invoke("Input wasn't changed");
      return;
    }

    if (txt.length > 2000) {
      GD.S_ALERT_ERROR.invoke("Message too big!");
      return;
    }

    inputChanged = false;
    ref.current.textContent = "";
    ref.current.focus();
    GD.S_CHAT_MESSAGE_SEND_REQUEST.invoke(txt);
  };

  //   const onShotClick = (e: React.MouseEvent) => {
  //     GD.S_CHAT_SCREENSHOT_SEND_REQUEST.invoke();
  //   };

  return (
    <ChatInputDiv>
      <ChatInputAttachDiv onClick={onAttachClick}></ChatInputAttachDiv>

      <ChatInputField
        ref={ref}
        onFocus={onFocus}
        data-prompt={true}
        onBlur={onBlur}
        onKeyUp={onChange}
        contentEditable={true}
        suppressContentEditableWarning={true}
      >
        {prompt}
      </ChatInputField>

      <ChatInputSendDiv onClick={onSendClick}></ChatInputSendDiv>
      <input
        ref={file}
        style={{ display: "none" }}
        type="file"
        onChange={onFileSelected}
        onPaste={onPaste}
      />
    </ChatInputDiv>
  );
};

export default ChatInput;
