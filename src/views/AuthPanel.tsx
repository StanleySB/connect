import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import GD from "../GD";
import CSS from "./CSS";

const AuthPanelDiv = styled.div`
  position: "static";
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: #252833;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 12px Tahoma;
`;

const AuthDiv = styled.div`
  width: 300px;
  min-height: 400px;
  background-color: #f0f0f0;
  border-radius: 5px;
`;

const AuthHeadDiv = styled.div`
  padding: 40px 20px 20px 20px;
  min-height: 100px;
  background-color: #ffffff;
  border-radius: 5px 5px 0px 0px;
  box-shadow: 0px 1px 1px rgb(0 0 0 / 10%);
  font-size: 22px;
  color: ${CSS.defaultColor};
  & > div {
    font-size: 11px;
    color: ${CSS.lightTextColor};
  }
`;

const AuthFormContainer = styled.div`
  height: 300px;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const AuthInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthInput = styled.input`
  padding: 10px 10px 10px 40px;
  border-radius: 4px;
  margin: 10px 0px;
  border: none;
  box-shadow: 0px 2px 1px inset rgb(0 0 0 / 25%);
  background-position: left 10px center;
  background-repeat: no-repeat;
  background-size: 18px auto;
  &:focus {
    outline: none;
  }
  &[name="login"] {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJ2SURBVEhL7VY7aFRBFF3EXx0/IKgRwUrUXggWooKfoIKfwkpQWwsrDSIYEOwEEYvUioS024TdO/PezNtEVkHcysIPSkCN2gnR1fXcmbNhwaybfbuKxR64MO+8e8+de+e+T2GAAZZCmqZbk7Lfr6Zr0n8P1rqDRtysNb7Rasb4GWPSA3TrL4xx15D0Z0zmnhvxE2q6DslxDz5X6d4fJOLORXH/GZUdI70IJBzVe7H69DTp3iAiayE6h4p+WOv3kv4NSD4SfIx7VywW15DOj0T80ViJmyTVFlb8FH0Pk8oPiFxXMRF3gVRbYMguqi82MEYqPyAyHsSsO0OqLdCds0w8Tio/rM0uUewGqbZAd26qr1ZOKj9EKts4NK//NDQcwjfqWyr5YdK9AdU+ClUb9wAJVpJeRLVaXaX3YrXuIeneMT09u04rji13j/VZFZnZbK3domu0thqSin+ZZdkQw/qDkMi4+Vj5kvZRfejeHyTlbB8qfdFM0jxz2Ctcf2/y6oNWjzCsN/DZrFM8hfBorVZbbUxlh5qeuS37I9jME/rUEXOe4fmA8zsJQX4YwuCYMEiSXQb/VQ2Dd4Uz8Db4iFvQGN0gZbpDkiQb+OKv64sBYs+isJ9rSbCga9iXwGGiNSHW6JCb1w1RbvlAu24HUXF39Bof/O1I9Inc07SU7lHTdUgq7j3avj7EirvPjdzS62Wj0WisQGUfIPDNe7+RdAFneQitHdN2k4rPMDh05TgpvO3sJq1aN6NapDsjSSq7Q2XGC6muofOgGujKTlKdYUx2IrRK3F1SXQPx91SjtRMdoT9wSH4KtotU19BY1fgnP4MD/IcoFH4BgFtbCVPpFC0AAAAASUVORK5CYII=);
  }
  &[name="password"] {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKrSURBVEhL7VY7ixRBEF5FEQMfGIvIJWpwiIoiKr4zUQMfgQYmYmSiiAoGgoH4BwwETTwxEEQDWYXjprq3q2c3WFDEB5qZCHLgJZ54cLp+1VOzzJ6ze3O7cyb6QbHMV131dVd19V3lP/oBEa00pr6BqLG62WwuVnp+kIjxDUP+gzW+lZohnjTGP61F/oAuLQ8QPALBryr0C0JvrOHn+HYpH4z8Y2ZepmGDwVp3BmI/kXjaEt+W8qorQEpdI388U4mXjUZjubr7g7XxNohOBTPusNK5kJNqFSDOj5TuDygxJyXks0p1wDk3VCO+YK3fId+jo80VWPtRYvruOfq4SRLg91Wr1VqgdBtBxPjxsAZ9r0XxTuFtxMeSOH4SFs4VCLymCS4q1QG0YbP4U5OTCy89x/cENjOJSVgUFs8FKNm9kLBLyVSgLmsg8oWovlZdFXBO+JkXsRBwQR4mwW67Un8giOPkM28xqvQiifXrlSoOCN8PpzHupFKFgdF6K7FyD5QqBumrBMK+4XJtVboQpOQhlvidUsWQFcWY7Fa6MCB4R+KR57pSswNP3qUQhBvZl2jER2W0kGO8cJmzopjJPUoH4KFYI49Ft2SY84WW3HnETiHHtI38IXX1BspyuZuoAJflk/q/o+cj1vJpea2I4oMhlvi1+GE/xKdhvZEVxejsVboDqTBsQn/zjGS0NKQ3sPsrEiSi2MA+pQOwiV3GxCfEsCY8jdVqdUn4S2T8TWzmAewuWnTVjbmNGjY7eIzXpaIo236l28BGnok/a+oaDDjJcBCGgFIdaAvL00l8S0xdgyFPWJ5HKX/SAn6f+ONhdZeDPGHpVzhlxv6qsFwanPqcWBzHq9RdDtrC5D/LvyrBdB7hO6XLykcqnGfzKowSLnWR25JnpZf3H0Sl8hvIbtqs7zMeyQAAAABJRU5ErkJggg==);
  }
  &[name="phone"] {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAACFklEQVRYhe3WO2gVQRQG4C+JRqPRgA+wEDWoxChB7QTRUsHKIlhoZaMES7HQNHaWEqzEQlAUBQtFBd8QLLSwMUIaJeILXyBIxFdirsWc5W4Sb9Dcu8EiP2yx/5k5/78zZ+Ys0/iP0YyzGMRDrJ9K8SbcQyn3fMLGqRCfjZsh+gYduBbv77CmSPGGnNhbtAU/CzdyplYVZeBoiLzH2jGxJtyJ+AssLcLAxxDYVCE+F70x5nKtxevwLZK3TDBuc4x5VWsDcDuSd1WId+BDjOkpwsCuSP5YWpFK4lfQWISBRmlpS+jM8fVS9ZdwtSjxDPtDqF86lhnOBH+6SHGYiWchdiDHt+MXhrGuaBM7w8AgWnP8ieAfSZdToTgXYneVC3IeBoK/KNVGYVgoXccldOf4dqkxlXAJc/4wtwsPwuSyakzskPZ9BLtz/JaciSfYkIsdM7qLPseKakx0R6Lv2JrjV6IvYsM4iePxPoS9uF8LE3U4pfxPkO8TTdIX/1T+4iHlO6S5ViYacCESfZG2Jo82nJdWqXNMbKyJ5dWYyFZiGIeNPwXzK8zNm+idrAHSdhyRCrMUSVf/5dxWaat+GN9n/hnb8TpMfMUhE/eHxcoFe71a8QwtUuWPROKX2IcZE4j3Y0mtDGTYJt0F2SkYwEEskv4dM/G+MFMI6rEHT42+hLKnUPE8GqRGdkuqjc/SyVkwFeLTmBR+AzfGm+5rBiJBAAAAAElFTkSuQmCC);
  }
  &[name="code"] {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAApUlEQVRIie3UPQ4BQRjG8R+FRK91As0eQuEKruAeDuMYIhodvUYiarVkacbar4bZVbD/ZIr3mcnzJO/MvHT8JQkOuEesE2Z15mNcIs3zIQWG2IXNNQYf9+AVktHDKohHjCLMawOWQbhiEmleCZgjxQ3TBswrAedQLHIHtthE1FlAX6lXgbSkv1sXaL1FtHzJfOGZ0vJHe9LqqHiSYN+Aee2w6/hBHr+lgAdKDY1mAAAAAElFTkSuQmCC);
  }
`;

const AuthSwitch = styled.div`
  font-size: 10px;
  margin: 10px 0px;
  text-transform: uppercase;
  color: ${CSS.lightTextColor};
  position: relative;
  padding: 4px 2px 1px 40px;
  user-select: none;
  display: inline-block;
  text-align: left;
  &:before {
    background-color: rgba(42, 44, 53, 0.65);
    border: 1px solid ${CSS.lightBorderColor};
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 1px;
    width: 30px;
    height: calc(100% - 2px);
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    box-shadow: 0px 0px 5px inset rgb(0 0 0 / 20%);
    border-radius: 2px;
  }
  &:after {
    pointer-events: none;
    background-color: #ffffff;
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 15px;
    height: 100%;
    transition: left 0.2s ease-in-out;
    border: 1px solid ${CSS.lightBorderColor};
    border-radius: 3px;
    box-shadow: 0px 1px 1px rgb(0 0 0 / 20%);
  }
  &[data-selected="true"] {
    color: rgba(0, 0, 0, 1);
  }
  &[data-selected="true"]:before {
    background-color: rgb(56, 171, 208);
    transition: background-color 0.2s ease-in-out;
  }
  &[data-selected="true"]:after {
    left: 15px;
    transition: left 0.2s ease-in-out;
  }
`;

const AuthButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const AuthButton = styled.button`
  min-width: 60px;
  border-radius: 5px;
  margin: 0px 5px;
  padding: 12px;
  border: none;
  background-color: ${CSS.defaultColor};
  text-transform: uppercase;
  color: #fff;
  transition: 0.1s;
  box-shadow: 0px 2px 2px rgb(0 0 0 / 20%);
  cursor: pointer;
  &:hover {
    background-color: #393a46;
    box-shadow: 0px 1px 2px inset rgb(0 0 0 / 20%);
  }
  &:disabled {
    background-color: ${CSS.disabledColor};
  }
`;

const AuthErrorDiv = styled.div`
  display: flex;
  justify-content: center;
  color: red;
  word-break: break-word;
  max-height: 50px;
  overflow-y: scroll;
`;

const AuthPanel = () => {
  const [state, setState] = useState<"web" | "phone" | "code">("web");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = useRef<HTMLInputElement | null>(null);
  const pass = useRef<HTMLInputElement | null>(null);
  const [remember, setRemember] = useState<boolean>(false);

  useEffect(() => {
    GD.S_AUTH_CODE_REQUESTED.add(() => {
      setState("code");
      setIsLoading(false);
      if (login.current) login.current.value = "";
    }, "authpanel");

    GD.S_AUTH_ERROR.add((txt) => {
      GD.S_LOGE.invoke(txt);
      setErrorMsg(txt);
      setIsLoading(false);
    }, "authpanel");

    return () => {
      GD.S_AUTH_CODE_REQUESTED.clearContext("authpanel");
      GD.S_AUTH_ERROR.clearContext("authpanel");
    };
  });

  const doSend = (e: React.MouseEvent) => {
    console.log("DO SEND" + state);

    setErrorMsg("");
    setIsLoading(true);

    if (state === "web") {
      if (!login.current || !pass.current) return;
      console.log("DO SEND 1" + state);
      GD.S_AUTH_REQUEST.invoke({
        login: login.current.value,
        password: pass.current.value,
        remember: remember,
      });
    } else if (state === "phone") {
      if (!login.current) return;
      GD.S_AUTH_REQUEST_BY_PHONE.invoke({
        phone: login.current?.value,
      });
    } else if (state === "code") {
      if (!login.current) return;
      GD.S_AUTH_CHECK_CODE.invoke({
        code: parseInt(login.current?.value),
        remember: remember,
      });
    } else {
      console.error("Wrong state: " + state);
    }
  };

  const changeState = (state: "web" | "phone" | "code") => {
    setErrorMsg("");
    setState(state);
  };

  let inner = null;
  if (state === "web") {
    inner = (
      <AuthDiv>
        <AuthHeadDiv>Web Chat</AuthHeadDiv>
        <AuthFormContainer>
          <AuthInputContainer>
            <AuthInput ref={login} type="text" name="login" placeholder="Login" />
            <AuthInput ref={pass} type="password" name="password" placeholder="Password" />
            <AuthSwitch onClick={() => setRemember(!remember)} data-selected={remember}>
              Remember Me
            </AuthSwitch>
            {errorMsg && <AuthErrorDiv>{errorMsg}</AuthErrorDiv>}
          </AuthInputContainer>
          <AuthButtonContainer>
            <AuthButton onClick={doSend} disabled={isLoading}>
              Login
            </AuthButton>
            <AuthButton onClick={() => changeState("phone")} disabled={isLoading}>
              Enter by phone
            </AuthButton>
          </AuthButtonContainer>
        </AuthFormContainer>
      </AuthDiv>
    );
  } else if (state === "phone") {
    inner = (
      <AuthDiv>
        <AuthHeadDiv>
          Web Chat
          <div>Please provide your phone number to get verification code via SMS</div>
        </AuthHeadDiv>
        <AuthFormContainer>
          <AuthInputContainer>
            <AuthInput ref={login} type="phone" name="phone" placeholder="Phone" />
            {errorMsg && <AuthErrorDiv>{errorMsg}</AuthErrorDiv>}
          </AuthInputContainer>
          <AuthButtonContainer>
            <AuthButton onClick={doSend} disabled={isLoading}>
              Login
            </AuthButton>
            <AuthButton onClick={() => changeState("web")} disabled={isLoading}>
              Enter by login
            </AuthButton>
          </AuthButtonContainer>
        </AuthFormContainer>
      </AuthDiv>
    );
  } else if (state === "code") {
    inner = (
      <AuthDiv>
        <AuthHeadDiv>
          Web Chat
          <div>Please enter the confirmation code from the received SMS</div>
        </AuthHeadDiv>
        <AuthFormContainer>
          <AuthInputContainer>
            <AuthInput ref={login} type="number" name="code" placeholder="Code" />
            <AuthSwitch onClick={() => setRemember(!remember)} data-selected={remember}>
              Remember Me
            </AuthSwitch>
            {errorMsg && <AuthErrorDiv>{errorMsg}</AuthErrorDiv>}
          </AuthInputContainer>
          <AuthButtonContainer>
            <AuthButton onClick={doSend} disabled={isLoading}>
              Login
            </AuthButton>
            <AuthButton onClick={() => changeState("phone")} disabled={isLoading}>
              Reenter Phone
            </AuthButton>
            <AuthButton onClick={() => changeState("web")} disabled={isLoading}>
              Enter by login
            </AuthButton>
          </AuthButtonContainer>
        </AuthFormContainer>
      </AuthDiv>
    );
  }

  return <AuthPanelDiv>{inner}</AuthPanelDiv>;
};
export default AuthPanel;
