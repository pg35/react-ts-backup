import { useContext } from "react";
import styled from "styled-components";

import {
  createListAction,
  ADD_ITEM,
  REMOVE_ITEM,
  SELECT_ITEM
} from "../../utils/reducer";

import { SortableList, IconButton, Icon } from "../../utils/List";
import Rule, { RuleHeader } from "./Rule";

import { RULE_LIST } from "../reducer";
import { AppContext } from "../contexts";
import { genId } from "../../utils/utils";

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 5px;
  border-left: 4px solid #888;
  border-left-color: ${(props) => (props.active ? "green" : "#888")};

  & > [data-xs-hide] {
    display: none;
  }
  @media (min-width: 500px) {
    & > input[type="text"] {
      flex-basis: 200px;
      flex-grow: 1;
    }
    & > [data-xs-hide] {
      display: inline-block;
    }
  }
`;
const ListItemActions = styled.div`
  display: flex;
  gap: 10px;
  flex-basis: 100%;
  justify-content: space-between;
  @media (min-width: 500px) {
    flex-basis: auto;
    & > [data-xs-hide] {
      display: inline-block;
    }
    & > [data-md-hide] {
      display: none;
    }
  }
`;
const ListItemTitle = styled.div`
  flex-basis: 350px;
  flex-grow: 1;
  display: flex;
  gap: 10px;
  & > span:first-child {
    color: #000;
    font-weight: bold;
  }
  & > span:last-child {
    color: #888;
    border-left: 1px solid #888;
    padding-left: 10px;
    opacity: 0.5;
  }
`;

export default function RuleList({ rules, screen }) {
  const { dispatch, meta } = useContext(AppContext);
  return (
    <div>
      <SortableList
        list={rules}
        listId={screen.id}
        renderItem={({ item, index, dragHandleProps, isDragging }) => (
          <ListItem active={item.active}>
            <Icon
              iconName="move"
              data-xs-hide={1}
              {...dragHandleProps}
              title="Drag and drop to reorder rules"
            />
            <ListItemTitle>
              <span>
                this is a simple adjustment 2 this is a simple adjustment 3 this
              </span>
              <span>Simple Adjustment</span>
            </ListItemTitle>
            <ListItemActions>
              <Icon
                iconName="move"
                data-md-hide={1}
                {...dragHandleProps}
                title="Drag and drop to reorder rules"
              />
              <IconButton
                iconName="edit"
                handleClick={(e) =>
                  dispatch(
                    createListAction(RULE_LIST, SELECT_ITEM, {
                      screenId: screen.id,
                      item: { id: item.id }
                    })
                  )
                }
                title="Edit rule"
              />
              <IconButton iconName="admin-page" title="Duplicate rule" />
              <IconButton
                iconName="no-alt"
                handleClick={(e) =>
                  dispatch(
                    createListAction(RULE_LIST, REMOVE_ITEM, {
                      screenId: screen.id,
                      item: { id: item.id }
                    })
                  )
                }
                title="Delete rule"
              />
            </ListItemActions>
          </ListItem>
        )}
        addItemConfig={{
          label: "Add Rule",
          handleAddItem: (e, itemId) =>
            dispatch(
              createListAction(RULE_LIST, ADD_ITEM, {
                screenId: screen.id,
                item: { ...screen.defaultItem, id: itemId }
              })
            )
        }}
        emptyListMsg="No rules configured."
      />
    </div>
  );
}
