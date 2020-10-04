import hotkeys from 'hotkeys-js';
import {store} from "~/logic/stage/main";
import {saveBackgroundLayer} from "~/logic/stage/layers/background/init";
import {deleteSelectedDrawingObjects} from "@/logic/stage/functions/transformer";
import {setViewport} from "~/plugins/backendComunication/viewport";
import tools from "@/enums/tools";

// toggle layer
hotkeys('command+b,ctrl+b', () => {
  toggleLayer()
});

export function toggleLayer() {
  store.commit("manu/setTool", tools.move);

  if (store.state.manu.layer === "Background" || !store.state.authentication.gm) {
    store.commit("manu/setLayer", "Token");
  } else {
    store.commit("manu/setLayer", "Background");
  }
}

// Open Monster search
hotkeys('command+m,ctrl+m', () => {
  store.commit("manu/setMonsters");
});

// Save Background Layer
hotkeys('command+s,ctrl+s', (event) => {
  if (store.state.manu.layer !== "Background")
    return;

  saveBackgroundLayer();
  event.preventDefault();
});

hotkeys('Delete,Backspace', () => {
  deleteSelectedDrawingObjects();
})

hotkeys('command+f,ctrl+f', (event) => {
  event.preventDefault();
  setViewport();
})
