import {Image as KonvaImage} from "konva";
import {stage, store} from "../main";
import {setMoveObjectByArrow} from "./objectFunctions";
import {manageTransformerLayer} from "../layers/layerManager";
import tools from '@/enums/tools';
import {setCharacterAttrs} from "@/plugins/backendComunication/characters";
import {blockSnapSize} from "@/logic/stage/layers/grid/main";

let transformer;
let transformerLayer;
let transformerNodes = [];

export function createTransformer() {
  transformer = new Konva.Transformer({
    nodes: [],
    visible: true,
    rotationSnaps: [0, 90, 180, 270],
    rotationSnapTolerance: 10,
    name: "transformer"
  });
}

export function setNodesToTransformer(nodes) {
  clearTransformerNodes();
  transformer.nodes(nodes);

  for (let object of transformer.nodes()) {
    transformerNodes.push(object.id())

    object.draggable(true);
    object.moveToTop();
  }

  transformer.moveToTop();

  if (nodes[0].characterID != null) {
    store.commit('character/setSelectedCharacter', nodes[0].characterID);
    for (let condition of nodes[0].conditions) {
      condition.moveToTop();
    }
  }

  setMoveObjectByArrow(nodes[0]);
}

export function clearTransformerNodes() {
  for (let object of transformer.nodes())
    object.draggable(false);

  transformer.nodes([]);
  transformerNodes = [];
  setMoveObjectByArrow(null);

  store.commit('character/setSelectedCharacter', '');

  stage.batchDraw();
}

export function addTransformerToLayer(layer) {
  layer.add(transformer);
  transformerLayer = layer;
}

export function addTransformerClickListener(object) {
  stage.on('click tap', (e) => {
    if (store.state.manu.currentTool !== tools.move) {
      return;
    }
    manageTransformerLayer();
    if (e.target == stage) {
      clearTransformerNodes();
    } else if (e.target == object && Array.from(transformerLayer.children).includes(object) && store.state.manu.currentTool == tools.DEFAULT) { //is this object the target && is the object in the current layer of selection
      setNodesToTransformer([object]);
    }
    transformerLayer.batchDraw();
  })
}

export function selectToken(characterSelection) {
  manageTransformerLayer();
  for (let character of transformerLayer.children.filter(char => char instanceof KonvaImage)) {
    if (character.characterID == characterSelection.id) {
      setNodesToTransformer([character]);
    }
  }
  transformerLayer.batchDraw();
}

export function deleteSelectedDrawingObjects() {
  for (let object of transformer.nodes()) {
    object.removeElement();
    object.destroy();
  }
  clearTransformerNodes();
  stage.batchDraw();
}

export function addTransformationListener(object) {
  object.on("transformend", () => {
    let pastRot = object.rotation();
    object.rotation(0);

    let width = object.width() * object.getTransform().getMatrix()[0];

    setCharacterAttrs(object.characterID, pastRot, Math.round(width / blockSnapSize))
  });
}