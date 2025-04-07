// place files you want to import through the `$lib` alias in this folder.
import { writable } from "svelte/store";
import { get } from "svelte/store";
import { init as apiInit } from "./misskey";
import type { DriveFile, Note } from "misskey-js/entities.js";
import type { AdminEmojiAddRequest } from 'misskey-js/entities.js';

export const serverUrl = writable("");
export const accessToken = writable("");
export const notes = writable<Note[]>([]);

export const getCookie = () => {
  const cookies = document.cookie;
  if (cookies !== "") {
    const strArr = cookies.split("; ");
    strArr.forEach((elem) => {
      if (elem.startsWith("accessToken")) {
        accessToken.set(elem.replace(/accessToken=/, ""));
      }
    })
  }
  apiInit();
}

export const updateCookie = () => {
  document.cookie = `accessToken=${get(accessToken)}; Max-Age=50000000`;
  apiInit();
}