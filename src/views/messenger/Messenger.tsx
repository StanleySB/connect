import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GD from "../../GD";
import AuthPanel from "../AuthPanel";
import Call from "../call/Call";
import CallDialogs from "../call/CallDialogs";
import Chat from "../chat/Chat";
import Chip from "../Chip";
import Lightbox from "../Lightbox";
import LatestPanel from "./LatestPanel";
import MembersPanel from "./MembersPanel";
import MenuPanel from "./MenuPanel";
import SearchPanel from "./SearchPanel";
import SettingsPanel from "./SettingsPanel";
import CSS from "../CSS";

const memberIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAyMSAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuNjIxMDkgMC4wOTk5OTk5QzMuOTgxMjkgMC4wOTk5OTk5IDMuNSAwLjc5OTk5OSAzLjUgMC43OTk5OTlDLTAuMTY0NSAwLjc5OTk5OSAxLjg1NzI2IDYuNjQ5MTIgMC43ODA2NjQgNy41MTE1MkMwLjc4MDY2NCA3LjUxMTUyIDEuNDQwNiA4LjMyNzczIDMuNSA4LjMyNzczVjkuMDI2MzdDMi45MzA5IDEwLjUwOSAwIDkuOTYwOSAwIDEyLjdINS42MTY0MUM2LjEwOTIxIDEyLjQwMTggNy43IDExLjU3NDggNy43IDExLjU3NDhDNy4zMTk5IDExLjE2ODggNi43NzE1NyAxMC40NjY4IDYuNTcyMDcgOS45MzU1NUM2LjEzNTI3IDkuNzE2NDUgNS43NjU5IDkuNDU4OTcgNS42IDkuMDI2MzdWOC4zMTk1M0M1LjczMyA4LjMxOTUzIDYuMTI1MTkgOC4yODg4MSA2LjI2MzA5IDguMjU4MDFDNS45NTA4OSA3Ljc3NzExIDUuNjg3NSA2LjY4MTAxIDUuNjg3NSA2LjA2NjQxQzUuNjg3NSA0LjUwMzMxIDYuMzYwNjUgMy4yMTc2MSA3LjQ3NzE1IDIuNDExOTFDNy4xNDA0NSAxLjEyMzIxIDYuMzkyOCAwLjA5OTk5OTkgNC42MjEwOSAwLjA5OTk5OTlINC42MjEwOVpNMTYuMSAwLjA5OTk5OTlDMTQuNTQzOSAwLjA5OTk5OTkgMTMuNTg4NCAxLjE3MDQ0IDEzLjM1NzQgMi41NzMyNEMxNC40ODg2IDMuMTc5NDQgMTUuMjI1IDQuNDg2MzMgMTUuMjI1IDYuMTMyMDNDMTUuMjI1IDYuNjQ2NTMgMTUuMTA1IDcuMTQxNiAxNC45NzQ4IDcuNTI1MTlDMTUuMDIzMSA3LjcxNDg5IDE1LjA1IDcuOTI2NDQgMTUuMDUgOC4xNjA5NEMxNS4wNSA5Ljg4OTk0IDEzLjMgMTEuNjE0NSAxMy4zIDExLjYxNDVDMTMuNjgwMSAxMS43ODA0IDE0Ljg5NjIgMTIuMzk4MyAxNS4zOTMyIDEyLjdIMjFDMjEgOS4wMjUgMTguMDE1OSAxMC4wNzUgMTcuNSA4LjVWNy40NUMxNy43MzI0IDcuMzMzMSAxOC4yODU5IDYuNTI4MjEgMTguMzU1OSA1Ljg5OTYxQzE4LjUzNzkgNS44ODU2MSAxOC45IDUuNDQwNjggMTguOSA1LjA0MjM4QzE4LjkgNC42NDQwOCAxOC43NzM0IDQuNDc2NTEgMTguNjYzNSA0LjQxMjExQzE4LjY2MzUgNC40MTIxMSAxOC45IDMuODg2MyAxOC45IDMuMjVDMTguOSAxLjk3NTMgMTguNTU1NiAwLjc5OTk5OCAxNy41IDAuNzk5OTk4QzE3LjUgMC43OTk5OTggMTcuMTk2OSAwLjA5OTk5ODUgMTYuMSAwLjA5OTk5ODVWMC4wOTk5OTk5Wk0xMC41IDIuOUM4LjYxNTYgMi45IDcuMDg3NSA0LjAzNTAxIDcuMDg3NSA2LjA2NjQxQzcuMDg3NSA2LjkyNTMxIDcuNTY4NzUgNy41OTQ5MiA3LjU2ODc1IDcuNTk0OTJDNy41Njg3NSA3LjU5NDkyIDcuMzUgNy43MDI0NCA3LjM1IDguMTYwOTRDNy4zNSA5LjA1MjA0IDcuOTIyODUgOS4yNjU2MyA3LjkyMjg1IDkuMjY1NjNDOC4wMDI2NSA5Ljk3MTIzIDkuMSAxMS4wMDQ3IDkuMSAxMS4wMDQ3VjEyLjE4NDZDOC41MTA2IDEzLjk1MjggNC45IDEyLjc4NzUgNC45IDE2LjlIMTYuMUMxNi4xIDEyLjc3MzUgMTIuNDg5NCAxMy45NTI4IDExLjkgMTIuMTg0NlYxMS4wMDQ3QzExLjkgMTEuMDA0NyAxMi45OTczIDkuOTcxMjMgMTMuMDc3MSA5LjI2NTYzQzEzLjA3NzEgOS4yNjU2MyAxMy42NSA4Ljg3MDA0IDEzLjY1IDguMTYwOTRDMTMuNjUgNy42Njk1NCAxMy40MzEyIDcuNTk0OTIgMTMuNDMxMiA3LjU5NDkyQzEzLjQzMTIgNy41OTQ5MiAxMy44MjUgNi44NDYwMyAxMy44MjUgNi4xMzIwM0MxMy44MjUgNC43MDA1MyAxMy4xMDY4IDMuNiAxMS45IDMuNkMxMS45IDMuNiAxMS4zODc2IDIuOSAxMC41IDIuOUwxMC41IDIuOVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";
const latestIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMSAyMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjUgMS41MzY5N2UtMDZDNC43MTA0NSAxLjUzNjk3ZS0wNiAwIDQuNzEwNDUgMCAxMC41QzAgMTIuMjE5NSAwLjQ1MjkyMiAxMy44MjY4IDEuMTg3NCAxNS4yNTk5TDAuMDQ5MjE5IDE5LjMzNDhDLTAuMjE1ODgxIDIwLjI4MTYgMC43MjAyNjIgMjEuMjE3NiAxLjY2NzI5IDIwLjk1MjhMNS43NDUyNiAxOS44MTQ2QzcuMTc3MTQgMjAuNTQ3NiA4Ljc4MjA3IDIxIDEwLjUgMjFDMTYuMjg5NSAyMSAyMSAxNi4yODk1IDIxIDEwLjVDMjEgNC43MTA0NSAxNi4yODk1IDAgMTAuNSAwVjEuNTM2OTdlLTA2Wk0xMC41IDEuNTc1QzE1LjQzODMgMS41NzUgMTkuNDI1IDUuNTYxNyAxOS40MjUgMTAuNUMxOS40MjUgMTUuNDM4MyAxNS40MzgzIDE5LjQyNSAxMC41IDE5LjQyNUM4LjkyNDE3IDE5LjQyNSA3LjQ1MDA3IDE5LjAxNTIgNi4xNjQ2NSAxOC4yOTkxQzUuOTgzNDYgMTguMTk4MSA1Ljc2OTc1IDE4LjE3MjcgNS41Njk5MiAxOC4yMjg0TDEuNjkxODkgMTkuMzEwMkwyLjc3NDcxIDE1LjQzNDJDMi44MzA2NCAxNS4yMzQgMi44MDUyMSAxNS4wMTk5IDIuNzAzOTUgMTQuODM4NEMxLjk4NjQyIDEzLjU1MjEgMS41NzUgMTIuMDc3NCAxLjU3NSAxMC41QzEuNTc1IDUuNTYxNyA1LjU2MTcgMS41NzUgMTAuNSAxLjU3NUwxMC41IDEuNTc1Wk02LjAzNzUgNy44NzVDNS43NTM1IDcuODcwOTkgNS40ODkzNCA4LjAyMDIgNS4zNDYxNiA4LjI2NTVDNS4yMDI5OSA4LjUxMDgxIDUuMjAyOTkgOC44MTQyIDUuMzQ2MTYgOS4wNTk1QzUuNDg5MzQgOS4zMDQ4MSA1Ljc1MzUgOS40NTQwMiA2LjAzNzUgOS40NUgxNC45NjI1QzE1LjI0NjUgOS40NTQwMiAxNS41MTA3IDkuMzA0ODEgMTUuNjUzOCA5LjA1OTVDMTUuNzk3IDguODE0MiAxNS43OTcgOC41MTA4MSAxNS42NTM4IDguMjY1NUMxNS41MTA3IDguMDIwMiAxNS4yNDY1IDcuODcwOTkgMTQuOTYyNSA3Ljg3NUg2LjAzNzVaTTYuMDM3NSAxMS41NUM1Ljc1MzUgMTEuNTQ2IDUuNDg5MzQgMTEuNjk1MiA1LjM0NjE2IDExLjk0MDVDNS4yMDI5OSAxMi4xODU4IDUuMjAyOTkgMTIuNDg5MiA1LjM0NjE2IDEyLjczNDVDNS40ODkzNCAxMi45Nzk4IDUuNzUzNSAxMy4xMjkgNi4wMzc1IDEzLjEyNUgxMi44NjI1QzEzLjE0NjUgMTMuMTI5IDEzLjQxMDcgMTIuOTc5OCAxMy41NTM4IDEyLjczNDVDMTMuNjk3IDEyLjQ4OTIgMTMuNjk3IDEyLjE4NTggMTMuNTUzOCAxMS45NDA1QzEzLjQxMDcgMTEuNjk1MiAxMy4xNDY1IDExLjU0NiAxMi44NjI1IDExLjU1SDYuMDM3NVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";
const logoutIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxOCAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguNSAwLjA5OTk5ODVDMy44NjkxNyAwLjA5OTk5ODUgMC4wOTk5OTg1IDMuODY5MTcgMC4wOTk5OTg1IDguNUMwLjA5OTk5ODUgMTMuMTMwOCAzLjg2OTE3IDE2LjkgOC41IDE2LjlDMTAuMjg4NCAxNi45IDExLjk0MTcgMTYuMzI3IDEzLjI5NzUgMTUuMzcyOEMxMy42MTM4IDE1LjE1MDUgMTMuNjkgMTQuNzEzNyAxMy40Njc3IDE0LjM5NzRDMTMuMjQ1MyAxNC4wODEgMTIuODA4NiAxNC4wMDQ4IDEyLjQ5MjIgMTQuMjI3MUMxMS4zNTc0IDE1LjAyNTggOS45OTAzNSAxNS41IDguNSAxNS41QzQuNjI1ODIgMTUuNSAxLjUgMTIuMzc0MiAxLjUgOC41QzEuNSA0LjYyNTgyIDQuNjI1ODMgMS41IDguNSAxLjVDOS45OTAzNSAxLjUgMTEuMzU3NCAxLjk3NDIgMTIuNDkyMiAyLjc3Mjg1QzEyLjgwODYgMi45OTUyMiAxMy4yNDUzIDIuOTE5MDEgMTMuNDY3NyAyLjYwMjY0QzEzLjY5IDIuMjg2MjYgMTMuNjEzOCAxLjg0OTUyIDEzLjI5NzUgMS42MjcxNUMxMS45NDE3IDAuNjczMDAyIDEwLjI4ODQgMC4wOTk5OTk2IDguNSAwLjA5OTk5OTZWMC4wOTk5OTg1Wk0xNC4wOTMyIDQuOTkzMTZDMTMuODA4MyA0Ljk5MzI0IDEzLjU1MTkgNS4xNjU4OSAxMy40NDQ3IDUuNDI5OEMxMy4zMzc1IDUuNjkzNzEgMTMuNDAwOSA1Ljk5NjI1IDEzLjYwNTEgNi4xOTQ5MkwxNS4yMTAyIDcuOEg3LjhDNy41NDc1NSA3Ljc5NjQzIDcuMzEyNzQgNy45MjkwNiA3LjE4NTQ4IDguMTQ3MTFDNy4wNTgyMSA4LjM2NTE2IDcuMDU4MjEgOC42MzQ4NCA3LjE4NTQ4IDguODUyODlDNy4zMTI3NCA5LjA3MDk0IDcuNTQ3NTUgOS4yMDM1NyA3LjggOS4ySDE1LjIxMDJMMTMuNjA1MSAxMC44MDUxQzEzLjQyMjIgMTAuOTgwNiAxMy4zNDg1IDExLjI0MTQgMTMuNDEyNSAxMS40ODY3QzEzLjQ3NjQgMTEuNzMyIDEzLjY2OCAxMS45MjM2IDEzLjkxMzMgMTEuOTg3NUMxNC4xNTg2IDEyLjA1MTUgMTQuNDE5MyAxMS45Nzc4IDE0LjU5NDkgMTEuNzk0OUwxNy4zMzM0IDkuMDU2NDRDMTcuNTA3MiA4LjkyMzgzIDE3LjYwOTEgOC43MTc2MiAxNy42MDg5IDguNDk4OThDMTcuNjA4NiA4LjI4MDMzIDE3LjUwNjIgOC4wNzQzNyAxNy4zMzIgNy45NDIxOEwxNC41OTQ5IDUuMjA1MDhDMTQuNDYzMSA1LjA2OTYgMTQuMjgyMiA0Ljk5MzE3IDE0LjA5MzIgNC45OTMxNlY0Ljk5MzE2WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==";
const settingsIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMSAyMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5LjgwNzIgOC45MTI4MkwxNy4zMjUgOC41MDcxQzE3LjE3OTcgOC4wMDg5OCAxNi45ODEgNy41MzAxOCAxNi43MzI0IDcuMDc3TDE4LjE4MTQgNS4wMTE4NkMxOC4yOTg2IDQuODQ1MTIgMTguMjc4NCA0LjYxNzkgMTguMTM0MyA0LjQ3MzQyTDE2LjUwMSAyLjg0MDg4QzE2LjM1NTIgMi42OTU1NiAxNi4xMjU5IDIuNjc2NjYgMTUuOTU4NyAyLjc5NzJMMTMuOTI0NyA0LjI1OTIyQzEzLjQ2NzMgNC4wMDYzOCAxMi45ODQzIDMuODA1NjIgMTIuNDgzMiAzLjY1OTg4TDEyLjA1MDIgMS4xODc3NkMxMi4wMTQ5IDAuOTg3IDExLjg0MDYgMC44NCAxMS42MzY1IDAuODRIOS4zMjY1MkM5LjEyMDcyIDAuODQgOC45NDUxNiAwLjk4OTEgOC45MTE5OCAxLjE5MjM4TDguNTEwNDYgMy42NTEwNkM4LjAwNjQ2IDMuNzk1OTYgNy41MjI2MiAzLjk5NDYyIDcuMDY2OTIgNC4yNDQxTDUuMDM4MzIgMi43OTUxQzQuODcwNzQgMi42NzU0IDQuNjQyNjggMi42OTQ3MiA0LjQ5Njk0IDIuODM5NjJMMi44NjQ0IDQuNDcyMTZDMi43MjAzNCA0LjYxNjIyIDIuNzAwMTggNC44NDMwMiAyLjgxNzM2IDUuMDA5NzZMNC4yNDQ5NCA3LjA1MjIyQzMuOTkwODQgNy41MTIxMiAzLjc4ODQgNy45OTg5IDMuNjQwOTggOC41MDU0MkwxLjE5MTk2IDguOTEzMjRDMC45ODk1MTkgOC45NDY4NCAwLjg0MDgzOSA5LjEyMjQgMC44NDA4MzkgOS4zMjczNlYxMS42Mzc0QzAuODQwODM5IDExLjg0MTEgMC45ODY5OTkgMTIuMDE1NCAxLjE4NzM0IDEyLjA1MTFMMy42MzYzNiAxMi40ODUzQzMuNzgyOTQgMTIuOTkwNiAzLjk4NTM4IDEzLjQ3NzQgNC4yNDAzMiAxMy45Mzg1TDIuNzk1MSAxNS45NkMyLjY3NTgyIDE2LjEyNjcgMi42OTQ3MiAxNi4zNTU2IDIuODM5NjIgMTYuNTAxNEw0LjQ3MjU4IDE4LjEzNTZDNC42MTY2NCAxOC4yNzk3IDQuODQzODYgMTguMjk5OCA1LjAxMDYgMTguMTgyNkw3LjA1NiAxNi43NUM3LjUxNTA2IDE3LjAwMjQgOC4wMDAxNiAxNy4yMDI4IDguNTAyOSAxNy4zNDgxTDguOTEyODIgMTkuODA5N0M4Ljk0NiAyMC4wMTE3IDkuMTIxMTQgMjAuMTYgOS4zMjY1MiAyMC4xNkgxMS42MzY1QzExLjg0MDIgMjAuMTYgMTIuMDE0NSAyMC4wMTM4IDEyLjA0OTggMTkuODEzNUwxMi40ODg3IDE3LjMzOTdDMTIuOTkyMyAxNy4xOTE0IDEzLjQ3NDkgMTYuOTg5OCAxMy45MjkzIDE2LjczN0wxNS45ODk0IDE4LjE4MjJDMTYuMTU2NiAxOC4zMDAyIDE2LjM4MzQgMTguMjc5NyAxNi41Mjc4IDE4LjEzNTZMMTguMTYwOCAxNi41MDE0QzE4LjMwNjEgMTYuMzU1NiAxOC4zMjUgMTYuMTI1OSAxOC4yMDQ1IDE1Ljk1ODdMMTYuNzM1MyAxMy45MTg4QzE2Ljk4NDQgMTMuNDY1MiAxNy4xODIyIDEyLjk4NTYgMTcuMzI2MyAxMi40ODc0TDE5LjgxMTggMTIuMDUxMUMyMC4wMTMgMTIuMDE1OCAyMC4xNTkyIDExLjg0MTEgMjAuMTU5MiAxMS42Mzc0VjkuMzI3MzZDMjAuMTU5NiA5LjEyMTU2IDIwLjAxMDUgOC45NDYgMTkuODA3MiA4LjkxMjgyWk0xMC41IDEzLjQ0QzguODc2MjggMTMuNDQgNy41NiAxMi4xMjM3IDcuNTYgMTAuNUM3LjU2IDguODc2MjggOC44NzYyOCA3LjU2IDEwLjUgNy41NkMxMi4xMjM3IDcuNTYgMTMuNDQgOC44NzYyOCAxMy40NCAxMC41QzEzLjQ0IDEyLjEyMzcgMTIuMTIzNyAxMy40NCAxMC41IDEzLjQ0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==";
const createNewChatIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyNiAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkuNTgzMzMgMS40MDI3OWUtMDZDNC4yOTkyMiAxLjQwMjc5ZS0wNiAwIDQuMjk5MjIgMCA5LjU4MzMzQzAgMTEuMTUyOCAwLjQxMzM4MSAxMi42MTk3IDEuMDgzNzQgMTMuOTI3N0wwLjA0NDkyMjEgMTcuNjQ2OEMtMC4xOTcwMzQgMTguNTEwOSAwLjY1NzM4MiAxOS4zNjUzIDEuNTIxNzMgMTkuMTIzNkw1LjI0MzY5IDE4LjA4NDhDNi41NTA1NiAxOC43NTM4IDguMDE1MzggMTkuMTY2NyA5LjU4MzMzIDE5LjE2NjdDMTQuODY3NCAxOS4xNjY3IDE5LjE2NjcgMTQuODY3NCAxOS4xNjY3IDkuNTgzMzNDMTkuMTY2NyA0LjI5OTIyIDE0Ljg2NzQgMCA5LjU4MzMzIDBWMS40MDI3OWUtMDZaTTkuNTgzMzMgMS40Mzc1QzE0LjA5MDUgMS40Mzc1IDE3LjcyOTIgNS4wNzYxNSAxNy43MjkyIDkuNTgzMzNDMTcuNzI5MiAxNC4wOTA1IDE0LjA5MDUgMTcuNzI5MiA5LjU4MzMzIDE3LjcyOTJDOC4xNDUwNyAxNy43MjkyIDYuNzk5NjYgMTcuMzU1MiA1LjYyNjQ3IDE2LjcwMTZDNS40NjEwOSAxNi42MDk0IDUuMjY2MDQgMTYuNTg2MiA1LjA4MzY2IDE2LjYzN0wxLjU0NDE5IDE3LjYyNDRMMi41MzI0NyAxNC4wODY4QzIuNTgzNTIgMTMuOTA0MSAyLjU2MDMxIDEzLjcwODYgMi40Njc4OSAxMy41NDNDMS44MTMgMTIuMzY5IDEuNDM3NSAxMS4wMjMgMS40Mzc1IDkuNTgzMzRDMS40Mzc1IDUuMDc2MTYgNS4wNzYxNSAxLjQzNzUgOS41ODMzMyAxLjQzNzVMOS41ODMzMyAxLjQzNzVaTTUuNTEwNDIgNy4xODc1QzUuMjUxMjEgNy4xODM4NCA1LjAxMDExIDcuMzIwMDIgNC44Nzk0NCA3LjU0MzkxQzQuNzQ4NzYgNy43Njc4IDQuNzQ4NzYgOC4wNDQ3MSA0Ljg3OTQ0IDguMjY4NkM1LjAxMDExIDguNDkyNDggNS4yNTEyMSA4LjYyODY3IDUuNTEwNDIgOC42MjVIMTMuNjU2M0MxMy45MTU1IDguNjI4NjcgMTQuMTU2NiA4LjQ5MjQ4IDE0LjI4NzIgOC4yNjg2QzE0LjQxNzkgOC4wNDQ3MSAxNC40MTc5IDcuNzY3OCAxNC4yODcyIDcuNTQzOTFDMTQuMTU2NiA3LjMyMDAyIDEzLjkxNTUgNy4xODM4NCAxMy42NTYzIDcuMTg3NUg1LjUxMDQyWk01LjUxMDQyIDEwLjU0MTdDNS4yNTEyMSAxMC41MzggNS4wMTAxMSAxMC42NzQyIDQuODc5NDQgMTAuODk4MUM0Ljc0ODc2IDExLjEyMiA0Ljc0ODc2IDExLjM5ODkgNC44Nzk0NCAxMS42MjI4QzUuMDEwMTEgMTEuODQ2NyA1LjI1MTIxIDExLjk4MjggNS41MTA0MiAxMS45NzkySDExLjczOTZDMTEuOTk4OCAxMS45ODI4IDEyLjIzOTkgMTEuODQ2NyAxMi4zNzA2IDExLjYyMjhDMTIuNTAxMiAxMS4zOTg5IDEyLjUwMTIgMTEuMTIyIDEyLjM3MDYgMTAuODk4MUMxMi4yMzk5IDEwLjY3NDIgMTEuOTk4OCAxMC41MzggMTEuNzM5NiAxMC41NDE3SDUuNTEwNDJaIiBmaWxsPSIjQjZGRkQzIi8+CjxyZWN0IHg9IjkiIHk9IjkiIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNyIgcng9IjguNSIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTE2LjUyNTYgMjIuMjExNlYxMi4xNTQ4SDE5LjA2ODJWMjIuMjExNkgxNi41MjU2Wk0xMi43Njg1IDE4LjQ1NDVWMTUuOTExOUgyMi44MjUzVjE4LjQ1NDVIMTIuNzY4NVoiIGZpbGw9IiNCNkZGRDMiLz4KPC9zdmc+Cg==";

const MessengerDiv = styled.div`
  position: "static";
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: #252833;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MessengerBoxDiv = styled.div`
  display: flex;
  width: calc(100% - 50px);
  /*max-width:700px;*/
  height: calc(100% - 50px);
  justify-content: center;
`;

const MessengerTabs = styled.div`
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TabItemDiv = styled.div`
  width: 55px;
  height: 55px;
  background: rgba(1, 1, 1, 0.36);
  cursor: pointer;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 21px auto;
  position: relative;
  &[data-active="true"] {
    background-color: #950a44;
    &::after {
      background: #f11873;
      box-shadow: -1px 0px 1px rgba(0, 0, 0, 0.25);
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 6px;
      content: "";
    }
  }
`;

const CreateBtn = styled.div`
  width: 55px;
  height: 55px;
  background: rgba(1, 1, 1, 0.36);
  cursor: pointer;
  background-position: 17px 18px;
  background-repeat: no-repeat;
  background-size: 26px 28px;
  position: relative;
`;

const SearchBox = styled.div`
  background: rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-width: 400px;
  min-width: 350px;
  padding: 20px;
  position: fixed;
`;

const SearchInput = styled.input`
  background: rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  border: none;
  padding: 7px 13px;
  outline: none;
  color: #d7ff97;
  width: 100%;
  &::placeholder {
    color: #d7ff97;
  }
`;

const SearchInputClearBtn = styled.div`
  position: absolute;
  right: 25px;
  top: 25px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOSIgaGVpZ2h0PSI5IiB2aWV3Qm94PSIwIDAgOSA5IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNOC4wMTIxMSA4LjAxMjFDNy44OTQ5NiA4LjEyOTIxIDcuNzA1MDYgOC4xMjkyMSA3LjU4NzkxIDguMDEyMUw0LjUwMDAxIDQuOTI0MkwxLjQxMjExIDguMDEyMUMxLjI5NDM5IDguMTI1NzkgMS4xMDcyOCA4LjEyNDE2IDAuOTkxNTYzIDguMDA4NDRDMC44NzU4NDMgNy44OTI3MiAwLjg3NDIxNyA3LjcwNTYxIDAuOTg3OTA4IDcuNTg3OUw0LjA3NTgxIDQuNUwwLjk4NzkwOCAxLjQxMjFDMC45MDk5MjEgMS4zMzY3OCAwLjg3ODY0NSAxLjIyNTI0IDAuOTA2MDk5IDEuMTIwMzVDMC45MzM1NTQgMS4wMTU0NiAxLjAxNTQ3IDAuOTMzNTQ1IDEuMTIwMzYgMC45MDYwOUMxLjIyNTI1IDAuODc4NjM1IDEuMzM2NzkgMC45MDk5MTIgMS40MTIxMSAwLjk4Nzg5OUw0LjUwMDAxIDQuMDc1OEw3LjU4NzkxIDAuOTg3ODk5QzcuNzA1NjIgMC44NzQyMDcgNy44OTI3MyAwLjg3NTgzMyA4LjAwODQ1IDAuOTkxNTUzQzguMTI0MTcgMS4xMDcyNyA4LjEyNTggMS4yOTQzOCA4LjAxMjExIDEuNDEyMUw0LjkyNDIxIDQuNUw4LjAxMjExIDcuNTg3OUM4LjEyOTIyIDcuNzA1MDUgOC4xMjkyMiA3Ljg5NDk1IDguMDEyMTEgOC4wMTIxTDguMDEyMTEgOC4wMTIxWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==);
  background-color: rgba(0, 0, 0, 0.8);
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
`;

export const PanelDiv = styled.div`
  color: ${CSS.latestColor};
  font-family: "Open Sans", sans-serif;
  display: flex;
  flex-direction: column;
  flex-grow: 0.3;
  max-width: 400px;
  min-width: 350px;
  height: calc(100% - 70px);
  margin-top: 70px;
`;

export const PanelBoxDiv = styled.div`
  color: ${CSS.latestColor};
  position: relative;
  overflow: auto;
  flex-grow: 1;
`;

export const PanelBoxContainerDiv = styled.div`
  position: absolute;
  color: ${CSS.latestColor};
  width: 100%;
`;

const MessengerTabItem = (params: { icon: string; onClick: () => void; title: string; activeTab: string; tab: string }) => {
  const [isChipOpen, setIsChipOpen] = useState(false);
  const { icon, onClick, title, activeTab, tab } = params;
  return (
    <>
      <Chip text={title} open={isChipOpen} additioanalStyle={{ right: "-65px" }} direction="right" />
      <TabItemDiv
        style={{ backgroundImage: `url(${icon})` }}
        onClick={onClick}
        onMouseOver={() => setIsChipOpen(true)}
        onMouseOut={() => setIsChipOpen(false)}
        data-active={activeTab === tab}
      />
    </>
  );
};

const CreateNewChatBtn = () => {
  const [isChipOpen, setIsChipOpen] = useState(false);
  return (
    <>
      <Chip text={"Create new Chat"} open={isChipOpen} additioanalStyle={{ right: "-65px" }} direction="right" />
      <CreateBtn
        style={{ backgroundImage: `url(${createNewChatIcon})` }}
        onClick={() => {}}
        onMouseOver={() => setIsChipOpen(true)}
        onMouseOut={() => setIsChipOpen(false)}
      />
    </>
  );
};

const Messenger = (params: { sharedObject: SharedObjectVO }) => {
  type ITab = "latest" | "members" | "search" | "logout" | "settings";

  const [state, setState] = useState<"wait" | "auth" | "chat">("wait");
  const [activeTab, setActiveTab] = useState<ITab>("latest");
  const [prevTab, setPrevTab] = useState<ITab | null>(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    GD.S_NEED_AUTHENTICATE.add(() => {
      setState("auth");
    }, "messenger");

    GD.S_AUTH_CHECK.invoke((status) => {
      if (!status) setState("auth");
      else setState("chat");
    });

    GD.S_AUTH_COMPLETE.add((data) => {
      setState("chat");
    });

    return () => {
      GD.S_REQUEST_AUTHENTICATE.clearContext("messenger");
    };
  }, []);

  useEffect(() => {
    if (searchText.length >= 3) {
      if (!prevTab) {
        setPrevTab(activeTab);
      }
      setActiveTab("search");
    } else {
      if (prevTab) {
        setActiveTab(prevTab);
        setPrevTab(null);
      }
    }
  }, [searchText, prevTab, activeTab]);

  const changeTab = (tab: ITab) => {
    if (activeTab === "search") {
      setSearchText("");
      setPrevTab(null);
      setActiveTab(tab);
    } else {
      setPrevTab(null);
      setActiveTab(tab);
    }
  };

  let content = <div>WAIT</div>;
  if (state === "auth") content = <AuthPanel />;
  else if (state === "chat") {
    content = (
      <MessengerDiv>
        <CallDialogs />
        <Lightbox />
        <MessengerBoxDiv>
          <MenuPanel />
          <MessengerTabs>
            <div>
              <MessengerTabItem onClick={() => GD.S_LOGOUT.invoke()} icon={logoutIcon} title="Logout" activeTab={activeTab} tab="logout" />
              <MessengerTabItem onClick={() => changeTab("settings")} icon={settingsIcon} title="Settings" activeTab={activeTab} tab="settings" />
              <MessengerTabItem onClick={() => changeTab("latest")} icon={latestIcon} title="Latest" activeTab={activeTab} tab="latest" />
              <MessengerTabItem onClick={() => changeTab("members")} icon={memberIcon} title="Members" activeTab={activeTab} tab="members" />
            </div>
            <div>
              <CreateNewChatBtn />
            </div>
          </MessengerTabs>
          <div>
            <SearchBox>
              <SearchInput value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search..." />
              <SearchInputClearBtn onClick={() => setSearchText("")} />
            </SearchBox>
            {activeTab === "settings" && <SettingsPanel />}
            {activeTab === "members" && <MembersPanel />}
            {activeTab === "latest" && <LatestPanel />}
            {activeTab === "search" && <SearchPanel searchText={searchText} />}
          </div>
          <Chat sharedObject={params.sharedObject} />
          <Call />
        </MessengerBoxDiv>
      </MessengerDiv>
    );
  }

  return content;
};
export default Messenger;
