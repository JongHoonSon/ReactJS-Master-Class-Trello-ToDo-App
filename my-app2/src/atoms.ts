import { atom, selector } from "recoil";
import { loadToDos } from "./handleLocalStorage";

export interface IToDo {
  id: number;
  text: string;
}

export interface IToDoState {
  [key: string]: IToDo[];
}

export const defaultToDos: IToDoState = {
  "To Do": [],
  Doing: [],
  Done: [],
};

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: loadToDos() ?? defaultToDos,
});
