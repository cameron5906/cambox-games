import { UiStyle } from "../UiStyle";
import { UiListItem } from "./UiListItem";

export interface UiList {
    type: 'list';
    id: string;
    items: UiListItem[];
    styles?: UiStyle[];
    classes?: string[];
}