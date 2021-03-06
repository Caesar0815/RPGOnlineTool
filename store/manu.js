import tools from "@/enums/tools/tools";
import {clearTransformerNodes} from "../logic/stage/functions/transformer/transformer";
import drawTools from "@/enums/tools/drawTools";
import measureTools from "@/enums/tools/measureTools";

export const state = () => ({
	currentTool: tools.DEFAULT,
	drawTool: null,
	measureTool: null,


	layer: "Token",

	freeDrawing: {
		color: "#000000",
		strokeWidth: 3,
		snapToGrid: false
	},

	measureDetails: {
		length: 0,
		unitEnding: "ft",
		boxSize: "5"
	},

	zoomFactor: 1
});

export const mutations = {
	setTool(state, tool) {
		state.currentTool = tool;
	},
	setDrawTool(state, tool) {
		state.drawTool = tool;
	},
	setMeasureTool(state, tool) {
		state.measureTool = tool;
	},
	setDrawingColor(state, color) {
		state.freeDrawing.color = color;
	},
	setLayer(state, layer) {
		state.layer = layer;
	},
	setDrawingObjectSnapToGrid(state, value) {
		state.freeDrawing.snapToGrid = value;
	},
	setMeasureLength(state, length) {
		state.measureDetails.length = length;
	},
	setMeasureDetails(state, detail) {
		state.measureDetails.unitEnding = detail.unitEnding;
		state.measureDetails.boxSize = detail.boxSize;
	},
	setDrawingStrokeWidth(state, width) {
		state.freeDrawing.strokeWidth = parseInt(width);
	},
	setMonsters(state) {
		state.currentTool = tools.monsters;
	},
	setZoomFactor(state, factor) {
		state.zoomFactor = factor;
	}
};

export const actions = {
	setTool({commit}, tool) {
		clearTransformerNodes();
		console.warn(drawTools, tool);
		if (JSON.stringify(drawTools).includes(tool)) {
			commit("setTool", tools.draw);
			commit("setMeasureTool", null);
			commit("setDrawTool", tool);
		} else if (JSON.stringify(measureTools).includes(tool)) {
			commit("setDrawTool", null);
			commit("setTool", tools.measure);
			commit("setMeasureTool", tool);
		} else {
			commit("setDrawTool", null);
			commit("setMeasureTool", null);
			commit("setTool", tool);
		}
	},
};
