import { UiStyle } from "../UiStyle";

export interface UiButton {
    type: 'button';
    id: string;
    text: string;
    styles?: UiStyle[];
    classes?: string[];
}