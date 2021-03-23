import { UiClickCommand, UiInputChangeCommand, UiInputSubmitCommand, UiCanvasDrawingCommand } from ".";

export type CommandData<T> = UiClickCommand | UiInputChangeCommand | UiInputSubmitCommand | UiCanvasDrawingCommand | any;