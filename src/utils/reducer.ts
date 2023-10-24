export const INIT_APP = "INIT_APP";
export const EDIT_UI = "EDIT_UI";
export const ADD_ITEM = "ADD_ITEM";
export const EDIT_ITEM = "EDIT_ITEM";
export const REMOVE_ITEM = "REMOVE_ITEM";
export const SWAP_ITEM = "SWAP_ITEM";
export const SELECT_ITEM = "SELECT_ITEM";

export const uiState = {
  loading: true,
  dirty: false,
  save: {
    doing: false,
    result: null
  }
};

export function createAction(type: string, data = {}) {
  return {
    type,
    data
  };
}
export function createListAction(listType: string, type: string, data = {}) {
  return { listType, ...createAction(type, data) };
}
export function reducer(state: any, action: any) {
  switch (action.type) {
    case INIT_APP:
      return { ui: uiState, ...action.data };
    case EDIT_UI:
      return {
        ...state,
        ui: { ...state.ui, ...action.data }
      };
    default:
      throw new Error("unknown list action " + action.type);
  }
}

export function listReducer(state, action) {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        items: { ...state.items, [action.data.item.id]: action.data.item },
        itemOrder: state.itemOrder.concat(action.data.item.id)
      };
    case EDIT_ITEM:
      return {
        ...state,
        items: {
          ...state.items,
          [action.data.item.id]: {
            ...state.items[action.data.item.id],
            ...action.data.item
          }
        }
      };
    case REMOVE_ITEM:
      const newState = {
        ...state,
        items: { ...state.items },
        itemOrder: state.itemOrder.filter(
          (itemId) => itemId !== action.data.item.id
        ),
        selected: state.selected === action.data.item.id ? null : state.selected
      };
      delete newState.items[action.data.item.id];
      return newState;
    case SELECT_ITEM:
      return {
        ...state,
        selected: action.data.item.id
      };
    default:
      throw new Error("unknown list action " + action.type);
  }
}
