import hotkeys from "hotkeys-js";
import {store} from "~/logic/stage/main";
import {saveBackgroundLayer} from "~/logic/stage/layers/background/init";
import {clearTransformerNodes, deleteSelectedDrawingObjects} from "@/logic/stage/functions/transformer/transformer";
import {setViewport} from "~/plugins/backendComunication/viewport";
import tools from "@/enums/tools/tools";
import {zoomByScale} from "@/logic/stage/functions/zoom";

// toggle layer
hotkeys("command+b,ctrl+b", () => {
	toggleLayer();
});

export function toggleLayer() {
	store.commit("manu/setTool", tools.move);

	if (store.state.manu.layer === "Background" || !store.state.authentication.gm)
		store.commit("manu/setLayer", "Token");
	else
		store.commit("manu/setLayer", "Background");

}

// Open Monster search
hotkeys("command+m,ctrl+m", () => {
	store.commit("manu/setMonsters");
});

// Save Background Layer
hotkeys("command+s,ctrl+s", (event) => {
	if (store.state.manu.layer !== "Background")
		return;

	saveBackgroundLayer();
	event.preventDefault();
});

hotkeys("Delete,Backspace", deleteSelectedDrawingObjects);

hotkeys("esc", clearTransformerNodes);

hotkeys("command+f,ctrl+f", (event) => {
	event.preventDefault();
	setViewport();
});

// open console
hotkeys("command+space,ctrl+space", () => {
	store.commit("console/openConsolePopup", true);
});

hotkeys("command+e,ctrl+e", () => zoomByScale(0.95));

hotkeys("command+shift+e,ctrl+shift+e", () => zoomByScale(1.05));

