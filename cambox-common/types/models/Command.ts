import { CommandType } from "../enums/CommandType";

export interface Command<T> {
    type: CommandType;
    data: T;
}