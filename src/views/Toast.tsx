import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import GD from "../GD";
import CSS from "./CSS";
import { gsap, TweenLite } from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";

gsap.registerPlugin(CSSRulePlugin);

const show = keyframes`
    from {
        transform: translateY(10px);
        opacity: 0;
    }
    to {
        transform: translateY(0px);
        opacity: 1;
    }
`;

const ToastDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const ToastItemDiv = styled.div`
  position: absolute;
  right: 50px;
  border-radius: 15px;
  padding: 5px 10px;
  background: ${CSS.toastBGColor};
  color: ${CSS.toastTextColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${show} 0.5s linear;
  transition: 0.5s ease;
`;

const ToastItemDeleteBtn = styled.div`
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABQElEQVRoge2ZwU7DMBAF2/w7ggOlEge4kP5jBeU6XBI1PJyQxt61K+07Rsm+GUeOanW3i0QikYhVgAfgE3gFOsfebuj8Ah5zBp25pveQGOD7Se85Z9gzv2MqkYAHOOQM3ANvMvBkITF0vRdfMA8JM3gpMJEwh5eiohJu8FJYRMIdXoqzJKrBC8AmierwAnKTRDPwArRKojl4AVuUaBZ+zJJE8/BjBtiPBKj+tmkPfszMm7gP+DELEibwVquxX3mtrcxs2D8buzZnMqQPI/exiWdWvuf6GXU5FG3KErzc057EGni5tx2JW+DlmfoSW+Dl2XoSOfAyw1+iBLzM8pMoCS8z7SUs4GW2nYQlvHSUl/CAl66yEsDRA37SlzoUHXMGfnvBTzpV4pIz7Am4AC8e8JPeDjgM3dv/4IhEIpHIf/kBoa3r5F4Qe6YAAAAASUVORK5CYII=);
  width: 15px;
  height: 15px;
  min-width: 15px;
  min-height: 15px;
  cursor: pointer;
  background-size: 15px;
  margin-left: 5px;
`;

const ToastItem = (params: { toast: ToastVO; position: number; deletedToast: string | null; setToasts: React.Dispatch<React.SetStateAction<ToastVO[]>> }) => {
  const toastRef = useRef<HTMLDivElement | null>(null);

  const onDeleteToast = (tempUID: string) => {
    if (!toastRef.current) return;
    if (!toastRef.current.getAttribute("active")) {
      TweenLite.to(toastRef.current, 0.5, {
        opacity: 0,
        top: `50px`,
        ease: "ease",
        onComplete: () => {
          if (toastRef.current) {
            toastRef.current.style.opacity = "1";
            toastRef.current.style.top = `calc(50px + (${params.position} * 35px))`;
            toastRef.current.setAttribute("active", "1");
          }
          GD.S_TOAST_DELETE.invoke(tempUID);
          GD.REQ_TOASTS.invoke().then((result) => params.setToasts(result));
        },
      });
    }
    if (toastRef.current.getAttribute("active")) {
      toastRef.current.removeAttribute("active");
    }
  };

  if (params.deletedToast === params.toast.tempUID) {
    onDeleteToast(params.toast.tempUID);
  }

  return (
    <ToastItemDiv style={{ top: `calc(50px + (${params.position} * 35px))` }} ref={toastRef}>
      {params.toast.text}
      <ToastItemDeleteBtn onClick={() => onDeleteToast(params.toast.tempUID)} />
    </ToastItemDiv>
  );
};

const Toast = () => {
  const [toasts, setToasts] = useState<ToastVO[]>([]);
  const [deletedToast, setDeletedToast] = useState<string | null>(null);

  useEffect(() => {
    GD.S_TOAST.add(() => {
      GD.REQ_TOASTS.invoke().then((result) => setToasts(result));
    }, "toast");

    GD.S_TOAST_DELETE.add((tempUID) => {
      setDeletedToast(tempUID);
    }, "toast");

    return () => {
      GD.S_TOAST.clearContext("toast");
      GD.S_TOAST_DELETE.clearContext("toast");
    };
  }, []);

  const test = () => {
    GD.S_TOAST.invoke(`"test toast" + ${toasts.length}`);
  };

  return (
    <ToastDiv>
      <button onClick={test}>toast</button>
      {toasts.length > 0 &&
        toasts.map((val, index) => <ToastItem toast={val} key={val.state + index} position={index} deletedToast={deletedToast} setToasts={setToasts} />)}
    </ToastDiv>
  );
};

export default Toast;
