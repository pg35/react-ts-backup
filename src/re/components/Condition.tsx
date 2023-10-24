import { useContext } from "react";
import Select from "react-select";
import styled from "styled-components";

import { createListAction, EDIT_ITEM, REMOVE_ITEM } from "../../utils/reducer";
import { memoize, reactSelectStyles } from "../../utils/utils";

import { COND_LIST } from "../reducer";
import { AppContext } from "../contexts";

const getKeyOptGrps = memoize(getKeyOptionGroups);
const getOpOpts = memoize(getOperatorOptions);

const ConditionWrap = styled.div`
  flex-grow: 1;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;
const Key = styled.div`
  flex-basis: 150px;
  flex-grow: 1;
  min-width: 150px;
`;
const Operator = styled.div`
  flex-basis: 150px;
  flex-grow: 1;
  min-width: 150px;
`;
const Value = styled.div`
  flex-basis: 200px;
  flex-grow: 1;
  & > input[type="text"] {
    width: 100%;
    padding-top: 6px;
    padding-bottom: 6px;
  }
`;
export default function ConditionParts({
  condition,
  screen,
  ruleId,
  sectionId,
  dragHandleProps
}) {
  const { dispatch, meta } = useContext(AppContext);
  const { id, keyId, opId, value } = condition;

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  };
  const groupBadgeStyles: CSSProperties = {
    backgroundColor: "#EBECF0",
    borderRadius: "2em",
    color: "#172B4D",
    display: "inline-block",
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: "1",
    minWidth: 1,
    padding: "0.16666666666667em 0.5em",
    textAlign: "center"
  };

  const formatGroupLabel = (data: GroupedOption) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );
  function updateCondition(name, value) {
    const obj = {
      screenId: screen.id,
      ruleId,
      sectionId,
      item: {
        id,
        [name]: value
      }
    };
    if ("keyId" === name) {
      const keyId = value.value;
      obj.item.opId = getOpOpts(meta.keys[keyId].opIds, meta)[0];
    }
    dispatch(createListAction(COND_LIST, EDIT_ITEM, obj));
  }
  return (
    <>
      <Key>
        <Select
          value={keyId}
          onChange={(selectedOpt) => updateCondition("keyId", selectedOpt)}
          options={getKeyOptGrps(screen.sections[sectionId].keyGroupIds, meta)}
          formatGroupLabel={formatGroupLabel}
          styles={reactSelectStyles}
        />
      </Key>
      <Operator>
        <Select
          value={opId}
          onChange={(selectedOpt) => updateCondition("opId", selectedOpt)}
          options={getOpOpts(meta.keys[keyId.value].opIds, meta)}
          styles={reactSelectStyles}
        />
      </Operator>
      <Value>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => updateCondition("value", e.target.value)}
        />
      </Value>
    </>
  );
}
export function prepareConditionForDropdown(cond, meta) {
  return {
    ...cond,
    keyId: { value: cond.keyId, label: meta.keys[cond.keyId].name },
    opId: { value: cond.opId, label: meta.operators[cond.opId].name }
  };
}

function getKeyOptions(keyIds: number[], meta) {
  return keyIds.map((keyId) => ({
    value: keyId,
    label: meta.keys[keyId].name
  }));
}
function getKeyOptionGroups(keyGroupIds: string[], meta) {
  return keyGroupIds.map((kgId) => {
    const obj = meta.keyGroups[kgId];
    return {
      label: obj.name,
      options: getKeyOptions(obj.keyIds, meta)
    };
  });
}
function getOperatorOptions(opIds: number[], meta) {
  return opIds.map((opId) => ({
    value: opId,
    label: meta.operators[opId].name
  }));
}
