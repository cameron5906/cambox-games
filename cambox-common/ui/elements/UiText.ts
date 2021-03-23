import { UiStyle } from "../UiStyle";

export interface UiText {
    type: 'text';
    text: string;
    styles?: UiStyle[];
    classes?: string[];
}