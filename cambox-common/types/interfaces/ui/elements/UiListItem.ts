import { UiStyle } from "../UiStyle";

export interface UiListItem {
    type: 'list_item';
    text: string;
    id?: string;
    styles?: UiStyle[];
    classes?: string[];
}