import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";

import { createListAction, ADD_ITEM } from "./reducer";
import { genId } from "./utils";

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ListItem = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  & input[type="text"] {
    width: 100%;
  }
`;

const ListActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: ${(props) => props.justify || "flex-end"};
`;

export function FixedList({
  list,
  renderItem,
  renderBeforeItem,
  renderAfterItem,
  renderAfterAllItems
}) {
  return (
    <List>
      {list.itemOrder.map((itemId, index) => {
        const item = list.items[itemId];
        return (
          <ListItem>
            {renderBeforeItem && renderBeforeItem(item, index, list)}
            {renderItem(item, index, list)}
            {renderAfterItem && renderAfterItem(item, index, list)}
          </ListItem>
        );
      })}
      {renderAfterAllItems && renderAfterAllItems(list)}
    </List>
  );
}
export function FixedList2({
  list,
  renderItem,
  renderBeforeItem,
  renderAfterItem,
  renderAfterAllItems
}) {
  return (
    <List>
      {list.itemOrder.map((itemId, index) => {
        const item = list.items[itemId];
        return (
          <ListItem key={itemId}>
            {renderBeforeItem && renderBeforeItem(item, index, list)}
            {renderItem(item, index, list)}
            {renderAfterItem && renderAfterItem(item, index, list)}
          </ListItem>
        );
      })}
      {renderAfterAllItems && renderAfterAllItems(list)}
    </List>
  );
}
export function ExpandableList({
  addItemConfig,
  removeItemConfig,
  ...otherProps
}) {
  return (
    <FixedList
      {...otherProps}
      renderAfterItem={(item) => (
        <ListActions>
          <button onClick={(e) => removeItemConfig.onRemoveItem(item.id, e)}>
            {removeItemConfig.label}
          </button>
        </ListActions>
      )}
      renderAfterAllItems={(list) => (
        <ListActions>
          <button onClick={(e) => addItemConfig.onAddItem(genId(), e)}>
            {addItemConfig.label}
          </button>
        </ListActions>
      )}
    />
  );
}
export function SortableList2({ ...otherProps }) {
  return (
    <ExpandableList
      {...otherProps}
      renderBeforeItem={(item) => (
        <ListActions>
          <button onClick={(e) => {}}>Drag</button>
        </ListActions>
      )}
    />
  );
}
const ListContainer = styled.div``;
export function SortableList3({
  list,
  listId,
  renderItem,
  removeItemConfig,
  addItemConfig,
  ...otherProps
}) {
  return (
    <ListContainer>
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
                  key={itemId}
                  draggableId={itemId.toString()}
                  index={index}
                >
                  {(provided: any, snapshot: any) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      isDragging={snapshot.isDragging}
                      {...provided.dragHandleProps}
                    >
                      {renderItem(item, index, list)}
                      <ListActions>
                        <button
                          onClick={(e) =>
                            removeItemConfig.onRemoveItem(item.id, e)
                          }
                        >
                          <span className="dashicons dashicons-dismiss"></span>
                        </button>
                      </ListActions>
                    </ListItem>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
      <ListActions>
        <button onClick={(e) => addItemConfig.onAddItem(genId(), e)}>
          <span className="dashicons dashicons-plus-alt"></span>
        </button>
      </ListActions>
    </ListContainer>
  );
}
export function SortableList({
  list,
  listId,
  renderItem,
  removeItemConfig,
  addItemConfig,
  ...otherProps
}) {
  return (
    <ListContainer>
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
                        dragHandleProps: provided.dragHandleProps
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
      <ListActions>
        <button onClick={(e) => addItemConfig.onAddItem(genId(), e)}>
          <span className="dashicons dashicons-plus-alt"></span>
        </button>
      </ListActions>
    </ListContainer>
  );
}
const ListItemHeaderWrap = styled.div`
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
