import { UiElement } from "@cambox/common/types/types/UiElement";

export const SET_UI = 'SET_UI';
export const setUi = ( elements: UiElement[] ) => ({
    type: SET_UI,
    payload: { elements }
})