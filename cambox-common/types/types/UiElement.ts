import { 
    UiImage, 
    UiButton, 
    UiContainer, 
    UiInput, 
    UiList, 
    UiText, 
    UiListItem 
} from "../interfaces/ui";
import { UiCanvas } from "../interfaces/ui/elements/UiCanvas";

export type UiElement = UiButton | UiContainer | UiInput | UiList | UiText | UiImage | UiListItem | UiCanvas;