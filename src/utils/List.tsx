import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";

import { createListAction, ADD_ITEM } from "./reducer";
import { genId } from "./utils";

const ListWrap = styled.div`
  border: 1px solid #888;
  background: #fcfcfc;
`;
const EmptyList = styled.div`
  padding: 35px 0;
  text-align: center;
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${(props) => (props.isDraggingOver ? "#ccc" : "transparent")};
  padding: 15px;
`;
const ListItem = styled.div`
  border-radius: 5px;
  border: ${(props) =>
    props.isDragging ? "2px dashed #ccc" : "1px solid #888"};
  background: #fff;
  box-shadow: 3px 3px 3px #888;
`;
export const ListFooter = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: ${(props) => props.justify || "flex-end"};
  padding: 0 15px 15px;
`;

export function SortableList({
  list,
  listId,
  renderItem,
  addItemConfig,
  emptyListMsg = "No items configured."
}) {
  if (list.itemOrder.length) {
  }
  return (
    <ListWrap>
      {list.itemOrder.length ? (
        <Droppable droppableId={listId} type={listId}>
          {(provided: any, snapshot: any) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {list.itemOrder.map((itemId, index) => {
                const item = list.items[itemId];
                return (
                  <Draggable
                    key={`${listId}_${itemId}`}
                    draggableId={`${listId}_${itemId}`}
                    index={index}
                    disableInteractiveElementBlocking={false}
                  >
                    {(provided: any, snapshot: any) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        isDragging={snapshot.isDragging}
                      >
                        {renderItem({
                          item,
                          index,
                          dragHandleProps: provided.dragHandleProps,
                          isDragging: snapshot.isDragging
                        })}
                      </ListItem>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      ) : (
        <EmptyList>{emptyListMsg}</EmptyList>
      )}
      <ListFooter>
        <button
          className="button button-secondary"
          onClick={(e) => addItemConfig.handleAddItem(e, genId())}
        >
          {addItemConfig.label}
        </button>
      </ListFooter>
    </ListWrap>
  );
}
export const I = styled.i`
  display: inline-block;
  box-sizing: border-box;
  width: ${(props) => props.size || 30}px;
  height: ${(props) => props.size || 30}px;
  line-height: ${(props) => props.size || 30}px;
  color: #ccc;
  &:hover,
  &:focus {
    color: #000;
    background: #ccc;
  }
`;
const IconButtonWrap = styled.button`
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  &:hover I,
  &:focus I {
    color: #000;
    background: #ccc;
  }
`;

export function Icon({ iconName, ...otherProps }) {
  return <I className={`dashicons dashicons-${iconName}`} {...otherProps} />;
}
export function IconButton({ handleClick, iconName, ...otherProps }) {
  return (
    <IconButtonWrap onClick={handleClick} {...otherProps}>
      <Icon iconName={iconName} />
    </IconButtonWrap>
  );
}
export const ListItemHeaderWrap = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 10px;
  & input {
    flex-grow: 1;
  }
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
export const DragHandle = styled.div`
  width: 40px;
  height: 40px;
  line-height: 40px;
`;
export function ListItemHeader({
  dragHandleProps,
  onDuplicate,
  onRemove,
  children
}) {
  return (
    <ListItemHeaderWrap>
      <DragHandle {...dragHandleProps}>
        <i className="dashicons dashicons-move" />
      </DragHandle>
      {children}
      {onDuplicate && (
        <button onClick={(e) => onDuplicate(e)}>
          <i className="dashicons dashicons-admin-page" />
        </button>
      )}
      {onRemove && (
        <button onClick={(e) => onRemove(e)}>
          <i className="dashicons dashicons-dismiss" />
        </button>
      )}
    </ListItemHeaderWrap>
  );
}
