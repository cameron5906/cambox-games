import { Page } from "../../types/enums/Page";

export const CHANGE_PAGE = 'CHANGE_PAGE';
export const changePage = ( page: Page ) => ({
    type: CHANGE_PAGE,
    payload: { page }
})