import { IToDoState } from "./atoms";

export const LOCAL_TODO = "trello_todos";

export const loadToDos = () => {
  const localToDos = localStorage.getItem(LOCAL_TODO);
  if (localToDos) {
    return JSON.parse(localToDos);
  }
  return null;
};

export const saveToDos = (toDos: IToDoState) => {
  localStorage.setItem(LOCAL_TODO, JSON.stringify(toDos));
};
