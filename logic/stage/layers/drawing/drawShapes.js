import {stage, store} from "../../main";
import Konva from "konva";
import {getRelativePointerPosition} from "../../functions/layerFunctions";
import {blockSnapSize} from "../grid/main";
import {layer} from "@/logic/stage/layers/drawing/main";
import {addDrawing} from "@/plugins/backendComunication/drawing";
import drawTools from "@/enums/tools/drawTools";

export function createRect() {
	let start = {x: 0, y: 0};

	let selectionRectangle = new Konva.Rect({
		fill: "rgba(0,0,255,0.5)",
		visible: false
	});
	layer.add(selectionRectangle);

	let x1, y1, x2, y2;
	stage.on("mousedown touchstart", () => {
		if (store.state.manu.drawTool !== drawTools.rectangle)
			return;

		if (store.state.manu.freeDrawing.snapToGrid) {
			x1 = calculateSnapToGrid(getRelativePointerPosition(stage)).x;
			y1 = calculateSnapToGrid(getRelativePointerPosition(stage)).y;
			x2 = calculateSnapToGrid(getRelativePointerPosition(stage)).x;
			y2 = calculateSnapToGrid(getRelativePointerPosition(stage)).y;
		} else {
			x1 = getRelativePointerPosition(stage).x;
			y1 = getRelativePointerPosition(stage).y;
			x2 = getRelativePointerPosition(stage).x;
			y2 = getRelativePointerPosition(stage).y;
		}


		if (store.state.manu.freeDrawing.snapToGrid) {
			start = calculateSnapToGrid(getRelativePointerPosition(stage));
		} else {
			start = getRelativePointerPosition(stage);
		}

		selectionRectangle.visible(true);
		selectionRectangle.width(0);
		selectionRectangle.height(0);
		selectionRectangle.moveToTop();
		layer.draw();
	});

	stage.on("mousemove touchmove", () => {
		// no nothing if we didn't start selection
		if (!selectionRectangle.visible()) {
			return;
		}

		if (store.state.manu.freeDrawing.snapToGrid) {
			x2 = calculateSnapToGrid(getRelativePointerPosition(stage)).x;
			y2 = calculateSnapToGrid(getRelativePointerPosition(stage)).y;
		} else {
			x2 = getRelativePointerPosition(stage).x;
			y2 = getRelativePointerPosition(stage).y;
		}

		selectionRectangle.setAttrs({
			x: Math.min(x1, x2),
			y: Math.min(y1, y2),
			width: Math.abs(x2 - x1),
			height: Math.abs(y2 - y1),
		});
		layer.batchDraw();
	});

	stage.on("mouseup touchend", () => {
		// no nothing if we didn't start selection
		if (!selectionRectangle.visible()) {
			return;
		}

		let width, height;
		if (store.state.manu.freeDrawing.snapToGrid) {
			width = calculateSnapToGrid(getRelativePointerPosition(stage)).x - start.x;
			height = calculateSnapToGrid(getRelativePointerPosition(stage)).y - start.y;
		} else {
			width = getRelativePointerPosition(stage).x - start.x;
			height = getRelativePointerPosition(stage).y - start.y;
		}

		addDrawing({
			stroke: store.state.manu.freeDrawing.color,
			strokeWidth: store.state.manu.freeDrawing.strokeWidth,
			points: [
				start.x, start.y,
				start.x + width, start.y,
				start.x + width, start.y + height,
				start.x, start.y + height,
				start.x, start.y
			],
			type: "Line"
		});

		// update visibility in timeout, so we can check it in click event
		setTimeout(() => {
			selectionRectangle.visible(false);
			layer.batchDraw();
		});

		layer.batchDraw();
	});
}

export function createCircle() {
	let start = {x: 0, y: 0};

	let selectionArrow = new Konva.Arrow({
		strokeWidth: 3,
		fill: "black",
		stroke: "black",
		pointerLength: 20,
		pointerWidth: 20,
		visible: false,
		points: []
	});

	layer.add(selectionArrow);

	stage.on("mousedown touchstart", () => {
		if (store.state.manu.drawTool !== drawTools.circle)
			return;

		if (store.state.manu.freeDrawing.snapToGrid) {
			start = calculateSnapToGrid(getRelativePointerPosition(stage));
		} else {
			start = getRelativePointerPosition(stage);
		}

		selectionArrow.visible(true);
		selectionArrow.moveToTop();

		layer.draw();
	});

	stage.on("mousemove touchmove", () => {
		if (!selectionArrow.visible()) {
			return;
		}

		let end = {};
		if (store.state.manu.freeDrawing.snapToGrid) {
			end = calculateSnapToGrid(getRelativePointerPosition(stage));
		} else {
			end = getRelativePointerPosition(stage);
		}

		selectionArrow.points([start.x, start.y, end.x, end.y]);

		layer.batchDraw();
	});

	stage.on("mouseup touchend", () => {
		if (!selectionArrow.visible()) {
			return;
		}

		let end = {};
		if (store.state.manu.freeDrawing.snapToGrid) {
			end = calculateSnapToGrid(getRelativePointerPosition(stage));
		} else {
			end = getRelativePointerPosition(stage);
		}

		addDrawing({
			x: start.x,
			y: start.y,
			radius: Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)),
			stroke: store.state.manu.freeDrawing.color,
			strokeWidth: store.state.manu.freeDrawing.strokeWidth,
			type: "Circle"
		});

		setTimeout(() => {
			selectionArrow.visible(false);
			layer.batchDraw();
		});

		layer.batchDraw();
	});
}

function calculateSnapToGrid(object) {
	return {
		x: Math.round(object.x / blockSnapSize) * blockSnapSize,
		y: Math.round(object.y / blockSnapSize) * blockSnapSize
	};
}
