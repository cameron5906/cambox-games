import { UiStyle } from "../UiStyle";

export interface UiImage {
    id: string;
    type: 'image';
    url: string;
    styles?: UiStyle[];
    classes?: string[];
}