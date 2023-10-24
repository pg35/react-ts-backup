import React, { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const data: any = {
  tasks: {
    task1: {
      id: "task1",
      desc: "this is 1st taks"
    },
    task2: {
      id: "task2",
      desc: "this is 2nd taks"
    },
    task3: {
      id: "task3",
      desc: "this is 3rd taks"
    },
    task4: {
      id: "task4",
      desc: "t 44444444444"
    },
    task5: {
      id: "task5",
      desc: "55555555555"
    }
  },
  cols: {
    col1: {
      id: "col1",
      taskIds: ["task1", "task3"]
    },
    col2: {
      id: "col2",
      taskIds: ["task2", "task4", "task5"]
    },
    col3: {
      id: "col3",
      taskIds: []
    }
  },
  colOrder: ["col1", "col2", "col3"]
};

const TaskContainer: any = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  cursor: initial;
  background: ${(props: { isDragging: boolean; isDragDisabled: boolean }) =>
    props.isDragDisabled
      ? "lightgrey"
      : props.isDragging
      ? "lightgreen"
      : "white"};
  display: flex;
  gap: 10px;
`;
const Handle: any = styled.div`
  width: 40px;
  height: 40px;
  background: blue;
`;
function Task({
  task,
  index
}: {
  index: number;
  task: { id: string; desc: string };
}) {
  const isDragDisabled = "task5" === task.id;
  return (
    <Draggable
      draggableId={task.id}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided: any, snapshot: any) => (
        <TaskContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          isDragging={snapshot.isDragging}
          isDragDisabled={isDragDisabled}
        >
          <Handle {...provided.dragHandleProps} />
          {task.desc}
        </TaskContainer>
      )}
    </Draggable>
  );
}
const ColContainer = styled.div`
  border: 1px solid #000;
  padding: 10px;
  width: 200px;
  background: ${(props: { isDropDisabled: boolean }) =>
    props.isDropDisabled ? "lightgrey" : "#fff"};
  background: ${(props: any) => (props.isDragging ? "pink" : "#fff")};
`;
const ColTitle = styled.h3`
  padding: 10px;
  border: 1px solid darkblue;
  background: lightblue;
`;
const TaskList = styled.div`
  background: ${(props: { isDraggingOver: boolean; isDropDisabled: boolean }) =>
    props.isDraggingOver ? "lightblue" : "whtie"};
  display: flex;
  gap: 10px;
  flex-direction: column;
  min-height: 100px;
  border: ${(props: { isDraggingOver: boolean }) =>
    props.isDraggingOver ? "2px dashed #000" : "none"};
`;
function Column({
  col,
  tasks,
  index,
  isDropDisabled
}: {
  col: any;
  tasks: any;
  index: number;
  isDropDisabled: boolean;
}) {
  return (
    <Draggable draggableId={col.id} index={index}>
      {(provided: any, snapshot: any) => (
        <ColContainer
          isDropDisabled={isDropDisabled}
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <ColTitle {...provided.dragHandleProps}>{col.id}</ColTitle> -{" "}
          {isDropDisabled ? 1 : 0}
          <Droppable
            droppableId={col.id}
            type={index === 2 ? "task" : "task"}
            isDropDisabled={isDropDisabled}
          >
            {(provided: any, snapshot: any) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {tasks.map((task: any, index: number) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </ColContainer>
      )}
    </Draggable>
  );
}
const AppContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  border: ${(props: { isDraggingOver: boolean }) =>
    props.isDraggingOver ? "2px dashed #000" : "none"};
`;

export default class App extends React.Component {
  state = { cols: data.cols, colOrder: data.colOrder, homeIndex: 0 };
  handleDragStart = (start: any) => {
    document.body.style.color = "orange";
    document.body.style.transition = "background 0.2s ease";

    const homeIndex = this.state.colOrder.indexOf(start.source.droppableId);
    this.setState({
      homeIndex
    });
  };
  handleDragUpdate = (update: any) => {
    const { destination } = update;
    const opacity = destination
      ? destination.index / Object.keys(data.tasks).length
      : 0.5;
    document.body.style.background = `rgba(123,13,75,${opacity})`;
  };
  handleDragEnd = (result: any) => {
    console.log(result);
    this.setState({
      homeIndex: -1
    });
    document.body.style.color = "inherit";
    document.body.style.background = "inherit";
    const { source, destination, draggableId, type } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "column-droppable") {
      const colOrder = [...this.state.colOrder];
      const a = colOrder[source.index];
      colOrder[source.index] = colOrder[destination.index];
      colOrder[destination.index] = a;
      this.setState({ colOrder });
      return;
    }
    const newState = { ...this.state, homeIndex: -1 };
    newState.cols[source.droppableId].taskIds.splice(source.index, 1);
    newState.cols[destination.droppableId].taskIds.splice(
      destination.index,
      0,
      draggableId
    );
    this.setState(newState);
  };

  render() {
    return (
      <DragDropContext
        onDragStart={this.handleDragStart}
        onDragUpdate={this.handleDragUpdate}
        onDragEnd={this.handleDragEnd}
      >
        <Droppable
          droppableId="app"
          direction="horizontal"
          type="column-droppable"
        >
          {(provided: any, snapshot: any) => (
            <AppContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {this.state.colOrder.map((colId: string, index: number) => {
                const col = data.cols[colId];
                const tasks = col.taskIds.map(
                  (taskId: any) => data.tasks[taskId]
                );
                const isDropDisabled = index < this.state.homeIndex;
                return (
                  <Column
                    key={colId}
                    col={col}
                    tasks={tasks}
                    index={index}
                    isDropDisabled={isDropDisabled}
                  />
                );
              })}
              {provided.placeholder}
            </AppContainer>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
