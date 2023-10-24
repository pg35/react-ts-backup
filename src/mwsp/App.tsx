import React, { useEffect, useReducer } from "react";
import { INIT_APP, uiState } from "../utils/reducer";
import { createAction } from "../utils/reducer";
//import { doAjaxDummy as doAjax, ajaxTest } from "../utils/ajax";
import { doAjax, ajaxTest } from "../utils/ajax";

import SaveChanges from "../components/SaveChanges";
import { EDIT_ITEM, reducer } from "./reducer";

import "./styles.css";

const initialState = {
  items: [
    { id: "sku", on: false },
    { id: "wei", on: false },
    { id: "dim", on: false },
    { id: "cat", on: true },
    { id: "tag", on: true },
    { id: "att", on: false },
    { id: "rat", on: false }
  ]
};
ajaxTest.responses = {
  mwsp_init: initialState
};

const id2Label: any = {
  cat: "categories",
  tag: "tags",
  att: "attributes",
  sku: "SKU",
  wei: "weight",
  dim: "dimensions",
  rat: "empty rating"
};

function Item({ item: { id, on }, index, onItemChange }: any) {
  return (
    <div className={`mwsp-item mwsp-item--${id}`}>
      <label>
        <input
          type="checkbox"
          name={id}
          checked={on}
          onChange={(e) => onItemChange(index, e)}
        />{" "}
        {id2Label[id]}
      </label>
    </div>
  );
}

export function ItemList({ items, dispatch }: any) {
  const handleItemChange = (index: number, e: any) => {
    let value;
    if ("checkbox" === e.target.type) value = e.target.checked;
    else value = e.target.value;
    dispatch(
      createAction(EDIT_ITEM, {
        index,
        data: { on: value }
      })
    );
  };
  return (
    <div className="mwsp-list">
      {items.map((item: any, index: number) => (
        <Item
          key={item.id}
          item={item}
          index={index}
          onItemChange={handleItemChange}
        />
      ))}
    </div>
  );
}
export default function App({ items }: any) {
  const [state, dispatch] = useReducer(reducer, { ui: uiState });
  useEffect(() => {
    doAjax(
      {
        data: {
          action: "mwsp_init"
        }
      },
      (res: any) =>
        dispatch(
          createAction(INIT_APP, {
            state: { ...res.data, ui: { ...state.ui, loading: false } }
          })
        )
    );
  }, []);

  if (state.ui.loading) {
    return (
      <div className="mwsp-loading">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="mwsp">
      <h1>Show product details in product loop</h1>
      <p>
        Configure which product data to show in product loop (shop page,
        category page, tag page, up-sells and cross-sells).
      </p>
      <ItemList items={state.items} dispatch={dispatch} />
      <p>
        <small>
          <strong>Note: </strong> weight and dimensions are shown only for
          Simple and Variable product.
        </small>
      </p>
      <SaveChanges
        ui={state.ui}
        data={state.items}
        dispatch={dispatch}
        doAjax={doAjax}
        slug="mwsp"
      />
    </div>
  );
}
