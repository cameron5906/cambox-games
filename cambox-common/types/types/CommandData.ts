import { UiCanvasDrawingCommand } from "../interfaces/ui";
import { UiClickCommand } from "../interfaces/ui/commands/UiClickCommand";
import { UiInputChangeCommand } from "../interfaces/ui/commands/UiInputChangeCommand";
import { UiInputSubmitCommand } from "../interfaces/ui/commands/UiInputSubmitCommand";

export type CommandData<T> = UiClickCommand | UiInputChangeCommand | UiInputSubmitCommand | UiCanvasDrawingCommand | any;