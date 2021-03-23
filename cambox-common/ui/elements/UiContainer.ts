import { UiElement } from "../UiElement";
import { UiStyle } from "../UiStyle";

export interface UiContainer {
    type: 'container';
    children: UiElement[];
    styles?: UiStyle[];
    classes?: string[];
}