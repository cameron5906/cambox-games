import { CommandType } from ".";

export interface Command<T> {
    type: CommandType;
    data: T;
}