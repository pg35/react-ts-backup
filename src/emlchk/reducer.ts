export const INIT_APP = "INIT_APP";
export const EDIT_UI = "EDIT_UI";
export const EDIT_ITEM = "EDIT_ITEM";
export function createAction(type: any, data = {}) {
  return {
    type,
    ...data
  };
}
export function reducer(state: any, action: any) {
  switch (action.type) {
    case INIT_APP:
      return action.state;
    case EDIT_UI:
      return {
        ...state,
        ui: { ...state.ui, ...action }
      };
    case EDIT_ITEM:
      let newItems = state.items.map((item: any, index: number) => {
        if (index === action.index)
          return { ...state.items[index], ...action.data };
        return item;
      });
      if ("undefined" !== typeof action.data.isDisposable) {
        if (0 === action.index) {
          newItems = newItems.map((item: any) => ({
            ...item,
            isDisposable: newItems[0].isDisposable
          }));
        } else {
          newItems[0].isDisposable = false;
        }
      }
      return { ...state, ui: { ...state.ui, dirty: true }, items: newItems };

    default:
      throw new Error("unknown list action " + action.type);
  }
}
