import {init} from "./init";

export function draw(layer) {
  let drawables = init();
  for (let drawable of drawables) {
    layer.add(drawable);
    if (drawable.tr != null) {
      layer.add(drawable.tr);
    }
  }
}