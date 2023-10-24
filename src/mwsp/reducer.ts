import { INIT_APP, EDIT_UI } from "../utils/reducer";
import { reducer as coreReducer } from "../utils/reducer";
export const EDIT_ITEM = "EDIT_ITEM";

export function reducer(state: any, action: any) {
  switch (action.type) {
    case INIT_APP:
    case EDIT_UI:
      return coreReducer(state, action);
    case EDIT_ITEM:
      const newItems = state.items.map((item: any, index: number) => {
        if (index === action.index)
          return { ...state.items[index], ...action.data };
        return item;
      });
      return { ...state, ui: { ...state.ui, dirty: true }, items: newItems };
    default:
      throw new Error("unknown list action " + action.type);
  }
}
