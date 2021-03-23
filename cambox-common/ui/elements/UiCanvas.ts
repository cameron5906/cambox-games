import { UiCanvasInstructionType } from "..";
import { UiStyle } from "../UiStyle";

export interface UiCanvas {
    type: 'canvas';
    id: string;
    width: number;
    height: number;
    instructions: CanvasInstruction[];
    allowDraw: boolean;
    styles?: UiStyle[];
    classes?: string[];
}

export interface CanvasInstruction {
    type: UiCanvasInstructionType;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    amount?: number;
    content?: string;
}