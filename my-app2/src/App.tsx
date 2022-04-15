import { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";

import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import { saveToDos } from "./handleLocalStorage";

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(4, 1fr);
`;

interface IForm {
  board: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onValid = ({ board }: IForm) => {
    console.log(board);
    setToDos({ ...toDos, [board]: [] });
    setValue("board", "");
  };
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, draggableId, source, type } = info;
    if (!destination) return;
    if (type === "LeaderBoard") {
      setToDos((allBoards) => {
        const boards = Object.entries(allBoards);
        const [item] = boards.splice(source.index, 1);
        boards.splice(destination.index, 0, item);
        return boards.reduce(
          (rest, [key, arr]) => ({ ...rest, [key]: arr }),
          {}
        );
      });
    } else if (destination?.droppableId === "del") {
      console.log("welcome");
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    } else {
      if (destination?.droppableId === source.droppableId) {
        setToDos((allBoards) => {
          const boardCopy = [...allBoards[source.droppableId]];
          const taskObj = boardCopy[source.index];
          boardCopy.splice(source.index, 1);
          boardCopy.splice(destination?.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: boardCopy,
          };
        });
      }
      if (destination?.droppableId !== source.droppableId) {
        setToDos((allBoards) => {
          const sourceBoardCopy = [...allBoards[source.droppableId]];
          const taskObj = sourceBoardCopy[source.index];
          sourceBoardCopy.splice(source.index, 1);
          const destinationBoardCopy = [...allBoards[destination.droppableId]];
          destinationBoardCopy.splice(destination?.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: sourceBoardCopy,
            [destination.droppableId]: destinationBoardCopy,
          };
        });
      }
    }
  };
  useEffect(() => {
    saveToDos(toDos);
  }, [toDos]);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <form onSubmit={handleSubmit(onValid)}>
        <label>Add Your Board!</label>
        <input {...register("board", { required: true })} type="text"></input>
        <button>Add</button>
      </form>
      <Wrapper>
        <Droppable
          type="LeaderBoard"
          droppableId="LeaderBoard"
          direction="horizontal"
        >
          {(props) => (
            <Boards ref={props.innerRef} {...props.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => (
                <Board
                  boardId={boardId}
                  key={boardId}
                  index={index}
                  toDos={toDos[boardId]}
                />
              ))}
              {props.placeholder}
            </Boards>
          )}
        </Droppable>
        <Droppable droppableId="del">
          {(magic) => (
            <div
              style={{
                position: "absolute",
                width: "100px",
                height: "50px",
                left: "100px",
                backgroundColor: "rgba(0,0,0,0.5)",
                textAlign: "center",
              }}
              ref={magic.innerRef}
              {...magic.droppableProps}
            >
              Delete Here
            </div>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
