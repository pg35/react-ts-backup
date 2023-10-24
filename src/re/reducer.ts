import { INIT_APP, EDIT_UI, createAction } from "../utils/reducer";
import {
  reducer as coreReducer,
  listReducer as coreListReducer
} from "../utils/reducer";
export const RULE_LIST = "RULE_LIST";
export const COND_LIST = "COND_LIST";
export const UPDATE_FIELD = "UPDATE_FIELD";

export function reducer(state: any, action: any) {
  console.log("%cReducer", "color:yellow;font-size:1.5em,background:white");
  console.log(state, action);
  let newState = null;
  if (action.listType) {
    newState = listReducer(state, action);
  } else {
    newState = appReducer(state, action);
  }
  console.log(newState);
  console.log("%cEnd", "color:yellow;font-size:1.5em,background:white");
  return newState;
}

function listReducer(state: any, action: any) {
  let newState = null;
  if (RULE_LIST === action.listType) {
    let newList = null;
    if (UPDATE_FIELD === action.type) {
      const { screenId, ruleId } = action.data;
      const ruleList = state.rules[screenId];
      const rule = ruleList.items[ruleId];
      const newRule = {
        ...rule,
        fields: { ...rule.fields, ...action.data.fields }
      };
      newList = {
        ...ruleList,
        items: { ...ruleList.items, [ruleId]: newRule }
      };
    } else {
      newList = coreListReducer(state.rules[action.data.screenId], action);
    }
    newState = {
      ...state,
      rules: { ...state.rules, [action.data.screenId]: newList }
    };
  } else if (COND_LIST === action.listType) {
    const { screenId, ruleId, sectionId } = action.data;
    const ruleList = state.rules[screenId];
    const rule = ruleList.items[ruleId];
    const list = rule[sectionId];
    const newList = coreListReducer(list, action);
    const newRule = { ...rule, [sectionId]: newList };
    const newRuleList = {
      ...ruleList,
      items: { ...ruleList.items, [ruleId]: newRule }
    };
    newState = {
      ...state,
      rules: { ...state.rules, [screenId]: newRuleList }
    };
  } else {
    throw new Error("app reducer: unknown list type ", action.listType);
  }
  return coreReducer(newState, createAction(EDIT_UI, { dirty: true }));
}
function appReducer(state: any, action: any) {
  let newState = null;
  switch (action.type) {
    case INIT_APP:
    case EDIT_UI:
      newState = coreReducer(state, action);
      break;
    default:
      throw new Error("app reducer: unknown action " + action.type);
  }
  return newState;
}
