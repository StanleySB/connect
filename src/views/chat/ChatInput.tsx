import React, { useRef, useEffect, useState } from "react";
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

const ChatInputButton = styled.button`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  align-self: center;
  border: none;
  background: none;
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
  background-repeat: no-repeat;
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

const ChatInputPreviewContainer = styled.div`
  width: 100%;
  display: flex;
  margin: 0px 10px;
  overflow-x: auto;
`;

const ChatInputPreviewClearBnt = styled.div`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABQElEQVRoge2ZwU7DMBAF2/w7ggOlEge4kP5jBeU6XBI1PJyQxt61K+07Rsm+GUeOanW3i0QikYhVgAfgE3gFOsfebuj8Ah5zBp25pveQGOD7Se85Z9gzv2MqkYAHOOQM3ANvMvBkITF0vRdfMA8JM3gpMJEwh5eiohJu8FJYRMIdXoqzJKrBC8AmierwAnKTRDPwArRKojl4AVuUaBZ+zJJE8/BjBtiPBKj+tmkPfszMm7gP+DELEibwVquxX3mtrcxs2D8buzZnMqQPI/exiWdWvuf6GXU5FG3KErzc057EGni5tx2JW+DlmfoSW+Dl2XoSOfAyw1+iBLzM8pMoCS8z7SUs4GW2nYQlvHSUl/CAl66yEsDRA37SlzoUHXMGfnvBTzpV4pIz7Am4AC8e8JPeDjgM3dv/4IhEIpHIf/kBoa3r5F4Qe6YAAAAASUVORK5CYII=);
  cursor: pointer;
  background-size: 16px;
  background-repeat: no-repeat;
  background-position: 3px 3px;
  border-radius: 50%;
  background-color: #a5201c;
  margin-right: 5px;
  border: 1px solid #fff;
`;

const ChatInputPreviewDiv = styled.div`
  width: 80px;
  height: 80px;
  min-width: 80px;
  min-height: 80px;
  border-radius: 15px;
  margin: 2.5px 5px;
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: #3b548d;
  word-break: break-all;
  font-size: 12px;
  text-align: center;
  padding: 0px 5px;
  padding-top: 50px;
  overflow: hidden;
  color: #fff;
`;
const ChatInputPreviewDivDeleteBtn = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  line-height: 0px;
  font-size: 15px;
  font-weight: bold;
  padding-top: 6px;
  background: rgba(0, 0, 0, 0.5);
`;

const ChatInputPreview = (params: { fileVo: UploadingFileVO }) => {
  const [base64, setBase64] = useState<string | null | ArrayBuffer>(null);

  const isImage = (base64: string | null | ArrayBuffer) => {
    const res = base64 && base64?.toString()?.match(/(jpeg|jpg|gif|png);base64/) != null;
    return res;
  };

  const toBase64 = (file: File) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setBase64(reader.result);
    };
    reader.onerror = function (error) {
      console.error("Error: ", error);
    };
  };

  toBase64(params.fileVo.file);

  const onDelete = () => {
    GD.S_FILE_PREVIEW_DELETE.invoke(params.fileVo.tempUID);
  };

  return (
    <ChatInputPreviewDiv style={{ backgroundImage: `url(${base64}` }}>
      {!isImage(base64) && params.fileVo.file.name}
      <ChatInputPreviewDivDeleteBtn onClick={onDelete}>x</ChatInputPreviewDivDeleteBtn>
    </ChatInputPreviewDiv>
  );
};

let inputChanged = false;
let prompt = "Type your message...";
GD.S_SHARED_OBJECT_READY.add((so) => {
  if (so.promptMessage && typeof so.promptMessage === "string") prompt = so.promptMessage;
});

const ChatInput = (params: { messenger?: boolean }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const file = useRef<HTMLInputElement | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<UploadingFileVO[] | null>(null);
  const [chatVO, setChatVO] = useState<ChatVO | null>(null);

  const onSendClick = (e: React.MouseEvent) => {
    send();
  };

  const getFiles = (uid: string) => {
    GD.REQ_FILE_PREVIEW_GET_BY_UID.invoke(uid).then((result) => (result ? setAttachedFiles(Array.from(result.values())) : setAttachedFiles(null)));
  };

  useEffect(() => {
    const cur = ref.current;
    if (cur) cur.addEventListener("paste", onPaste);

    GD.S_CHAT_OPENED.add((cvo) => {
      setChatVO(cvo);
      getFiles(cvo.uid);
    }, "chatInput");

    chatVO &&
      GD.S_FILE_PREVIEW_ATTACH.add(() => {
        getFiles(chatVO.uid);
      }, "chatInput") &&
      GD.S_FILE_PREVIEW_DELETE.add(() => {
        getFiles(chatVO.uid);
      }, "chatInput") &&
      GD.S_FILE_PREVIEW_DELETE_ALL.add(() => {
        setAttachedFiles(null);
      }, "chatInput");

    return () => {
      if (cur) cur.removeEventListener("paste", onPaste);
      GD.S_AUTH_ERROR.clearContext("chatInput");
      GD.S_CHAT_OPENED.clearContext("chatInput");
      GD.S_FILE_PREVIEW_ATTACH.clearContext("chatInput");
      GD.S_FILE_PREVIEW_DELETE.clearContext("chatInput");
      GD.S_FILE_PREVIEW_DELETE_ALL.clearContext("chatInput");
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
    if (l > 10) {
      alert(`You can select up to 10 files`);
      return;
    }
    GD.S_FILE_PREVIEW_ATTACH.invoke(files);
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

  const onCancelFileSend = () => {
    chatVO && GD.S_FILE_PREVIEW_DELETE_ALL.invoke(chatVO?.uid);
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
    if (ref.current.textContent && ref.current.textContent.length === 0) inputChanged = false;
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
          GD.S_FILE_PREVIEW_ATTACH.invoke([file]);
        }
      }
      if (i.type.indexOf("text/rtf") !== -1 || i.type.indexOf("editor") !== -1) {
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
    if (attachedFiles && attachedFiles.length > 0 && chatVO) {
      GD.S_CHAT_FILE_SEND_REQUEST.invoke(chatVO.uid);
      inputChanged = false;
      return;
    }

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

  console.log(inputChanged);
  return (
    <ChatInputDiv>
      <ChatInputAttachDiv onClick={onAttachClick} disabled={!!(attachedFiles?.length === 10)}></ChatInputAttachDiv>

      {attachedFiles && attachedFiles.length > 0 ? (
        <>
          <ChatInputPreviewContainer>
            {attachedFiles.map((fileVo, index) => {
              return <ChatInputPreview fileVo={fileVo} key={index} />;
            })}
          </ChatInputPreviewContainer>
          <ChatInputPreviewClearBnt onClick={onCancelFileSend} />
        </>
      ) : (
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
      )}
      <ChatInputSendDiv onClick={onSendClick}></ChatInputSendDiv>
      <input ref={file} multiple style={{ display: "none" }} type="file" onChange={onFileSelected} onPaste={onPaste} />
    </ChatInputDiv>
  );
};

export default ChatInput;
