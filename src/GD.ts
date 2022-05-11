import { APIResponse } from "./utils/DCCAPI";
import { Req } from "./utils/Req";
import { Signal } from "./utils/Signal";

class GD {
  static S_APP_READY: Signal<void> = new Signal();
  static S_LOGOUT: Signal<void> = new Signal();

  static REQ_HTTP: Req<{}, APIResponse> = new Req("REQ_HTTP");
  static REQ_CONFIG_SCHEMES: Req<void, Schemes> = new Req("REQ_CONFIG_SCHEMES");
  static REQ_IMAGE_UPLOAD: Req<{ file: File; chatUID: string; secKey: string }, boolean> = new Req("REQ_IMAGE_UPLOAD");
  static REQ_IMAGE_UPLOAD_AS_B64: Req<{ fileName: string; chatUID: string; b64: string }, boolean> = new Req("REQ_IMAGE_UPLOAD");
  static REQ_IMAGE_GET: Req<{ thumb?: boolean; imageUID: string; key: string }, string | null> = new Req("REQ_IMAGE_GET");
  static REQ_FILE_UPLOAD: Req<{ file: File; chatUID: string }, boolean> = new Req("REQ_FILE_UPLOAD");
  static REQ_SECURITY_KEY: Req<{ chatUID: string }, string | null> = new Req("REQ_SECURITY_KEY");
  static REQ_CHAT: Req<{ chatUID: string }, ChatVO | null> = new Req("REQ_SECURITY_KEY");
  static REQ_MESSAGE_PARSE_FROM_CHAT: Req<{ chat: ChatVO }, MessageVO> = new Req("REQ_MESSAGE_PARSE_FROM_CHAT");
  static REQ_CURRENT_CHAT: Req<void, ChatVO> = new Req("REQ_CURRENT_CHAT");
  static REQ_CURRENT_PROFILE: Req<void, ProfileVO | undefined | null> = new Req("REQ_CURRENT_PROFILE");
  static REQ_WS_STATUS: Req<void, number> = new Req("REQ_CURRENT_PROFILE");
  static REQ_FILE_PREVIEW_GET_BY_UID: Req<string, Map<string, UploadingFileVO> | undefined> = new Req("REQ_FILE_PREVIEW_GET_BY_UID");
  static REQ_TOASTS: Req<void, ToastVO[]> = new Req("REQ_TOASTS");

  static S_FILE_DOWNLOAD_REQUEST: Signal<{ uid: string; name: string }> = new Signal();
  static S_FILE_STOP_UPLOAD: Signal<{ file: File; tempUID: string; error: boolean; chatUID: string }> = new Signal();
  static S_FILE_START_UPLOAD: Signal<{ file: File; tempUID: string; chatUID: string }> = new Signal();
  static S_FILE_UPLOADING_LIST_UPDATED: Signal<UploadingFileVO[]> = new Signal();

  static S_FILE_PREVIEW_ATTACH: Signal<File[] | null> = new Signal();
  static S_FILE_PREVIEW_DELETE: Signal<string> = new Signal();
  static S_FILE_PREVIEW_DELETE_ALL: Signal<string> = new Signal();

  static S_SERVICE_READY: Signal<string> = new Signal();

  static S_AUTH_ERROR: Signal<string> = new Signal();
  static S_AUTH_REQUEST: Signal<{ password: string; login: string; remember: boolean }> = new Signal();
  static S_AUTH_COMPLETE: Signal<{ profile: ProfileVO; key: string }> = new Signal();
  static S_AUTH_CHECK: Signal<(status: boolean) => void> = new Signal();
  static S_AUTH_REQUEST_BY_PHONE: Signal<{ phone: string }> = new Signal();
  static S_AUTH_CHECK_CODE: Signal<{ code: number; remember: boolean }> = new Signal();
  static S_AUTH_CODE_REQUESTED: Signal<void> = new Signal();
  static S_NEED_AUTHENTICATE: Signal<void> = new Signal();
  static S_REQUEST_AUTHENTICATE: Signal<void> = new Signal();

  static S_CHAT_OPENED: Signal<ChatVO> = new Signal();
  static S_CHAT_MESSAGES: Signal<{ chatUID: string; msgs: MessageVO[] }> = new Signal();
  static S_CHAT_MESSAGE_SEND_REQUEST: Signal<string> = new Signal();
  static S_CHAT_BOT_COMMAND_SEND_REQUEST: Signal<{ title: string; action: string; actionData: string | null; botUID: string }> = new Signal();
  static S_CHAT_FILE_SEND_REQUEST: Signal<string> = new Signal();
  static S_CHAT_OPEN_REQUEST: Signal<{ chatUID?: string; userUID?: Array<string> }> = new Signal(); // UID
  static S_CHAT_OPENING: Signal<ChatVO> = new Signal(); // UID
  static S_CHAT_SCREENSHOT_SEND_REQUEST: Signal<void> = new Signal(); // UID

  static S_MESSAGE_ADDED: Signal<MessageVO> = new Signal();
  static S_MESSAGE_READ: Signal<MessageVO> = new Signal();

  static S_LATEST_READY: Signal<ChatVO[]> = new Signal();
  static S_LATEST_REQUEST: Signal<{ viaServer?: boolean }> = new Signal();

  static S_TOAST: Signal<string> = new Signal();
  static S_TOAST_DELETE: Signal<string> = new Signal();

  static S_IMAGE_REQUEST: Signal<{ uid: string; thumb: boolean; chatUID?: string }> = new Signal();
  static S_IMAGE_READY: Signal<{ uid: string; b64: string; thumb: boolean }> = new Signal();
  static S_IMAGE_DOWNLOAD_REQUEST: Signal<{
    target: "msg" | "lightbox";
    src?: HTMLDivElement;
    uid: string;
    name: string;
    chatUID: string;
    width?: string;
    height?: string;
  }> = new Signal();

  static S_WS_MSG: Signal<{ method: string; data: SimpleObjectVO | null }> = new Signal();
  static S_WS_SEND: Signal<{ method: string; data: SimpleObjectVO | null }> = new Signal();
  static S_WS_AUTHORIZED: Signal<string | undefined | null> = new Signal(); // user type
  static S_WS_WRONG_AUTHORIZATION: Signal<void> = new Signal();
  static S_WS_CLOSED: Signal<void> = new Signal();
  static S_WS_MSG_SENT_VIA_HTTP: Signal<{ num: number; id: number; chatUID: string; text: string }> = new Signal();
  static S_ALERT_ERROR: Signal<string> = new Signal();

  static S_GUI_MESSAGES_RENDERED: Signal<void> = new Signal();
  static S_GUI_CLOSE_CHAT: Signal<{ uid?: string } | null> = new Signal();
  static S_GUI_OPEN_CHAT: Signal<void> = new Signal();
  static S_GUI_CHAT_CLOSED: Signal<void> = new Signal();
  static S_GUI_CHAT_OPENED: Signal<void> = new Signal();
  static S_GUI_REPOSITION_CHAT: Signal<void> = new Signal();

  static S_SHARED_OBJECT_READY: Signal<SharedObjectVO> = new Signal();

  static S_REQUEST_CALL: Signal<{ chatVO: ChatVO; audio: boolean; video: boolean }> = new Signal();
  static S_CALL_PLACED: Signal<CallVO> = new Signal();
  static S_CALL_LOCAL_MEDIA_READY: Signal<CallVO> = new Signal();
  static S_CALL_INCOMING: Signal<BlackHoleDataCall> = new Signal();
  static S_CALL_ACCEPT: Signal<BlackHoleDataCall> = new Signal();
  static S_CALL_DECLINE: Signal<BlackHoleDataCall> = new Signal();
  static S_CALL_ACCEPTED: Signal<CallVO> = new Signal();
  static S_CALL_REMOTE_STREAM_READY: Signal<CallVO> = new Signal();
  static S_CALL_CALLEE_ACCEPT_CALL: Signal<CallVO> = new Signal();

  static S_LOG: Signal<any> = new Signal();
  static S_LOGE: Signal<any> = new Signal();
  static S_LOG_AVAIALABLE: Signal<boolean> = new Signal();

  static S_MEMBERS_READY: Signal<MemberVO[]> = new Signal();
  static S_DEPARTAMENTS_READY: Signal<Map<number, DepartamentVO>> = new Signal();
}
export default GD;
