import { UiStyle } from "../UiStyle";

export interface UiInput {
    type: 'input';
    accept: 'text' | 'number';
    id: string;
    placeholder?: string;
    styles?: UiStyle[];
    classes?: string[];
}