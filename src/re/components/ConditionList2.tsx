import { useContext } from "react";
import styled from "styled-components";

import { createListAction, EDIT_ITEM, REMOVE_ITEM } from "../../utils/reducer";

import List from "./List";
import ConditionParts, { updateCondition } from "./Condition";

import { COND_LIST } from "../reducer";
import { AppContext } from "../contexts";

const Condition = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  & input {
    width: 100%;
  }
`;

const ConditionActions = styled.div`
  flex-shrink: 0;
  & > button {
    width: 38px;
    height: 38px;
  }
`;
export default function ConditionList({ data, screen, ruleId, sectionId }) {
  const { dispatch, meta } = useContext(AppContext);
  return (
    <div>
      <List
        list={data}
        renderItem={(item) => (
          <Condition>
            <ConditionActions>
              <button>Drag</button>
            </ConditionActions>
            <ConditionParts
              condition={item}
              screen={screen}
              ruleId={ruleId}
              sectionId={sectionId}
            />
            <ConditionActions>
              <button
                onClick={() =>
                  dispatch(
                    createListAction(COND_LIST, REMOVE_ITEM, {
                      screenId: screen.id,
                      ruleId,
                      sectionId,
                      item: {
                        id: item.id
                      }
                    })
                  )
                }
              >
                x
              </button>
            </ConditionActions>
          </Condition>
        )}
        listType={COND_LIST}
        addItemConfig={{
          label: "Add condition",
          action: {
            screenId: screen.id,
            ruleId,
            sectionId,
            item: updateCondition(
              { ...screen.sections[sectionId].default },
              meta
            )
          }
        }}
      />
    </div>
  );
}
