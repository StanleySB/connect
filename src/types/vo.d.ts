declare interface SimpleObjectVO {
  [key: string]: string | boolean | number | SimpleObject | Array<any>;
}

declare interface ProfileVO {
  uid: string;
  type: string;
  name: string;
  avatar: string;
}

declare interface BlackHoleDataCall {
  call: {
    callID: string;
    audio: boolean;
    video: boolean;
    participians: UserVO[];
  };
  callee: {
    uid: string;
    name: string;
    avatar: string;
  };
}
declare interface BlackHoleDataCandidate {
  candidate: any;
}
declare interface BlackHoleData {
  ip: string;
  sender: string;
  data: {
    method: string;
    data: BlackHoleDataCall | BlackHoleDataCandidate;
  };
}

declare interface UploadingFileVO {
  file: File;
  tempUID: string;
  chatUID: string;
  status: "start" | "finish" | "fail";
  started: number;
}

declare interface SharedObjectVO {
  entryPointId?: string;
  payerAuthToken?: string | null;
  traderAuthToken?: string | null;
  title?: string;
  promptMessage?: string;
  scheme: "live" | "test" | "pre";
  branch: "live" | "demo";
  enableLog: boolean;
  messenger: boolean;
  bottomOffset: number;
  rightOffset: number;
  headless: booblean;
  colors: "light" | "dark";
  mobile: boolean;
}

declare interface CallVO {
  audio: boolean;
  video: boolean;
  participians: { name: string; uid: string; avatar: string }[];
  callID: string;
  side: "caller" | "callee";
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}
declare interface URLScheme {
  api: string;
  ws: string;
  files: string;
  sequence: string;
}
declare interface Schemes {
  live: URLScheme;
  test: URLScheme;
  pre: URLScheme;
  current: "test" | "live" | "pre";
}

declare interface ChatVO {
  accessed: string;
  created: string;
  avatar: string;
  formId: any;
  message: any;
  ownerID: string;
  platform: string;
  pointID: number;
  schedule: any;
  scheduleDesc: string;
  securityKey: string;
  title: string;
  type: string;
  uid: string;
  time: string;
  chatTime: number;
  date: string;
  promptMessage?: string;
  position: "standalone" | "middle";
  DOY: number;
  selected: boolean;
  parsed: boolean;
  author?: string | null;
  unread: number;
  users: UserVO[];
}

declare interface UserVO {
  age: number;
  avatar: string;
  cm?: {
    username: string;
    company_phone: string;
  };
  created: number;
  fxcomm?: {
    firstname: string;
    lastname: string;
    role: string;
    friends_only: number;
    hide_profile_name: boolean;
    ignore_guests: boolean;
  };
  fxid: number;
  gender: "male" | "female";
  immunity: any;
  labels: any;
  language_ui: string;
  name: string;
  newbie: boolean;
  payRating: number;
  type: string;
  uid: string;
}

/*accessed: "1624958069"
avatar: "7e384a607dcd669bf2c9a0a84bf1488bG"
created: "1493652572"
message:
	chatUID: "WgWyWvIiW6IsIt"
	created: "1624957678"
	delivery: "sent"
	id: "166112377"
	mid: "6e2245565a4eaec21fc0d26c1f52110e"
	num: "49306"
	platform: "desktop"
	stat: [Array(0)]
	status: "created"
	text: "IB"
	user_avatar: ""
	user_name: "marks.vilkelis"
	user_uid: "WAW3WeWeWbWT"
__proto__: Object
msgID: "166112377"
msg_count: "42"
ownerID: "WgDaWwWGDaItIs"
platform: "desktop"
pushAllowed: false
qStatus: ""
qUID: ""
queID: null
securityKey: ".hr.9R.Ha.Su.ZwIARIAT.KeIqd.vC.8"
title: "!IiDWWyWYWvWpW7DDDY"
type: "group"
uid: "WgWyWvIiW6IsIt"
unread: "94"
unreaded: "94"
users: Array(30)
0:
avatar: ""
cm: {username: "Andrew Baigozin", company_phone: "733"}
created: 1422993283
immunity: null
labels: null
language_ui: ""
name: "andrew.baigozin"
newbie: false
type: "ldap"
uid: "WmWxDaWEDDWF"
username: "andrew.baigozin"*/

declare interface SystemMessageVO {
  fileType: string;
  additionalData: any;
  method: string;
  title: string;
  type: string;
}
declare interface MessageVO {
  parsed?: boolean;
  date?: string;
  time?: string;
  position?: "standalone" | "first" | "middle" | "last";
  side?: "left" | "right";
  mine?: boolean;

  sys?: SystemMessageVO;

  archive: any;
  chat_uid: string;
  chatUID: string;
  created: number;
  delivery: string;
  id: number; // string from server
  mid: string;
  num: number; // string from server
  platform: string;
  reaction: null;
  status: string;
  text: string;
  type: "img" | "oldimg" | "file" | "sys" | "vi" | "dukanotes" | "vifail" | "credentials" | "voice" | "botMenu" | "botCommand" | "chatSystem";
  user_avatar: string;
  user_name: string;
  user_uid: string;
  version: number; // string from server
}

declare interface HTTPResponseVO {
  error: boolean;
  errMsg: string;
  data: any;
}

declare interface ToastVO {
  state: "active" | "hidden";
  text: string;
  created: number;
  tempUID: string;
}
