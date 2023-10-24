import { useContext } from "react";
import styled from "styled-components";

import { createListAction, ADD_ITEM, REMOVE_ITEM } from "../../utils/reducer";

import { SortableList, IconButton, Icon } from "../../utils/List";
import ConditionParts, { updateCondition } from "./Condition";

import { COND_LIST } from "../reducer";
import { AppContext } from "../contexts";

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 5px;
`;

export default function ConditionList({ data, screen, ruleId, sectionId }) {
  const { dispatch, meta } = useContext(AppContext);

  const createItemConfig = (label, cbName, actionType, createItem) => ({
    label,
    [cbName]: (itemId) =>
      dispatch(
        createListAction(COND_LIST, actionType, {
          screenId: screen.id,
          ruleId,
          sectionId,
          item: createItem(itemId)
        })
      )
  });
  return (
    <SortableList
      list={data}
      listId={sectionId}
      renderItem={({ item, dragHandleProps }) => (
        <ListItem>
          <Icon
            iconName="move"
            {...dragHandleProps}
            title="Drag and drop to reorder conditions"
          />
          <ConditionParts
            condition={item}
            screen={screen}
            ruleId={ruleId}
            sectionId={sectionId}
          />
          <IconButton
            iconName="no-alt"
            handleClick={(e) =>
              dispatch(
                createListAction("RULE_LIST", REMOVE_ITEM, {
                  screenId: screen.id,
                  item: { id: item.id }
                })
              )
            }
            title="Delete condition"
          />
        </ListItem>
      )}
      addItemConfig={{
        label: "Add Condition",
        handleAddItem: (e, itemId) =>
          dispatch(
            createListAction(RULE_LIST, ADD_ITEM, {
              screenId: screen.id,
              item: { ...screen.defaultItem, id: itemId }
            })
          )
      }}
    />
  );
}
