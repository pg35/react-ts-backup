import { useContext } from "react";
import styled from "styled-components";

import { createListAction, ADD_ITEM } from "../../utils/reducer";
import { genId } from "../../utils/utils";

import { AppContext } from "../contexts";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ListActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function List({ list, renderItem, listType, addItemConfig }) {
  const { dispatch } = useContext(AppContext);
  return (
    <ListContainer>
      {list.itemOrder.map((itemId, index) => (
        <div key={itemId} className="list__item">
          {renderItem(list.items[itemId], index)}
        </div>
      ))}
      <ListActions>
        <button
          onClick={() => {
            addItemConfig.action.item.id = genId();
            dispatch(
              createListAction(listType, ADD_ITEM, addItemConfig.action)
            );
          }}
        >
          {addItemConfig.label}
        </button>
      </ListActions>
    </ListContainer>
  );
}
