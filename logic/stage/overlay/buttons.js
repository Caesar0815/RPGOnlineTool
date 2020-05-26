import {useHand, usePen} from "../layers/freeDrawing/main";
import {setLayerDragAndDrop} from "../layers/layerFunctions";
import {stage} from "../main";

export function enableMenuButton() {
  let dragAndDropButton = document.getElementById("drag-and-drop-button");
  let paintButton = document.getElementById("paint-button");

  dragAndDropButton.addEventListener('click', () => {
    setStageDragAndDrop(true);

    useHand();
  });

  paintButton.addEventListener('click', () => {
    setStageDragAndDrop(false);

    usePen();
  });
}

function setStageDragAndDrop(enable) {
  enable ? stage.draggable(true) : stage.draggable(false);

  for (let layer of stage.children) {
    setLayerDragAndDrop(layer, enable);
  }
}



