import { api } from "misskey-js";

import { accessToken, notes } from "./store";
import { get } from "svelte/store";
import type { APIClient } from "misskey-js/api.js";
import { PUBLIC_SERVER_URL } from "$env/static/public";
import type { Note } from "misskey-js/entities.js";


let miApi: APIClient;

export const init = () => {
  miApi = new api.APIClient({
    origin: PUBLIC_SERVER_URL,
    credential: get(accessToken),
  })
}

export const getNotes = async (timeline: "local" | "home" | "social" | "global", untilId: string | undefined, withRenotes: boolean) => {

  let currentNotes: Note[] = [];
  switch (timeline) {
    case "local":
      currentNotes = await miApi.request("notes/local-timeline", {
        limit: 10,
        untilId,
        withRenotes,
        withFiles: true,
      })
      break;
    case "home":
      currentNotes = await miApi.request("notes/timeline", {
        limit: 10,
        untilId,
        withRenotes,
        withFiles: true,
      })
      break;
    case "social":
      currentNotes = await miApi.request("notes/hybrid-timeline", {
        limit: 10,
        untilId,
        withRenotes,
        withFiles: true,
      })
      break;
    case "global":
      currentNotes = await miApi.request("notes/global-timeline", {
        limit: 10,
        untilId,
        withRenotes,
        withFiles: true,
      })
      break;
  }

  console.log(currentNotes);

  notes.set([ ...get(notes), ...currentNotes ]);
}

