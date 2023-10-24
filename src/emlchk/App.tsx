import React, { useEffect, useReducer } from "react";
import { INIT_APP, EDIT_UI, EDIT_ITEM } from "./reducer";
import { createAction, reducer } from "./reducer";
import { doAjaxDummy as doAjax } from "./utils";

import "./styles.css";

const uiState = {
  loading: true,
  dirty: false,
  save: {
    doing: false,
    result: null
  }
};
const id2Label: any = {
  all: "All",
  wpReg: "Defautl user registration form",
  cf7: "Contact Form 7",
  gf: "Gravity Forms",
  ff: "Formidable Forms"
};

function buildHTMLId(index: number, name: string) {
  return `pxq-emlchk-item[${index}]-${name}`;
}
function buildPlaceholder(fieldName: string, index: number) {
  if (0 === index)
    return "For all forms. If empty, error message hardcoded in plugin will be used.";
  return "If empty, error message set for All will be used.";
}
function Item({
  item: { id, isDisposable, disposableError },
  index,
  onItemChange
}: any) {
  return (
    <div className={`pxq-emlchk-item pxq-emlchk-item--${id}`}>
      <div className="pxq-emlchk-item__name">{id2Label[id]}</div>
      <div className="pxq-emlchk-item__isDisposable">
        <input
          type="checkbox"
          name="isDisposable"
          checked={isDisposable}
          onChange={(e) => onItemChange(index, e)}
          id={buildHTMLId(index, "isDisposable")}
        />{" "}
        <label
          className="pxq-emlchk-xs"
          htmlFor={buildHTMLId(index, "isDisposable")}
        >
          {" "}
          Check disposable email
        </label>
      </div>
      <div className="pxq-emlchk-item__disposableError">
        <label
          className="pxq-emlchk-xs"
          htmlFor={buildHTMLId(index, "disposableError")}
        >
          Error Message:
        </label>
        <input
          type="text"
          name="disposableError"
          value={disposableError}
          placeholder={buildPlaceholder(disposableError, index)}
          onChange={(e) => onItemChange(index, e)}
          id={buildHTMLId(index, "disposableError")}
        />
      </div>
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
        data: { [e.target.name]: value }
      })
    );
  };
  return (
    <div className="pxq-emlchk-list">
      <div className="pxq-emlchk-item pxq-emlchk-list__head">
        <div className="pxq-emlchk-item__name"></div>
        <div className="pxq-emlchk-item__isDisposable">
          Check disposable email
        </div>
        <div className="pxq-emlchk-item__disposableError">Error Messages</div>
      </div>
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
function SaveChanges({ state: { ui, items }, dispatch }: any) {
  const { save, dirty } = ui;
  return (
    <div className="pxq-emlchk-save">
      <button
        className="button button-primary"
        onClick={(e) => {
          e.preventDefault();
          dispatch(
            createAction(EDIT_UI, { save: { doing: true, result: null } })
          );
          doAjax(
            {
              data: {
                action: "pxq_emlchk_save",
                data: JSON.stringify({ items })
              },
              method: "POST"
            },
            () =>
              dispatch(
                createAction(EDIT_UI, {
                  dirty: false,
                  save: { doing: false, result: { ok: true } }
                })
              ),
            (errMsg: string) =>
              dispatch(
                createAction(EDIT_UI, {
                  save: { doing: false, result: { ok: false, msg: errMsg } }
                })
              )
          );
        }}
        disabled={!dirty}
      >
        {save.doing ? "Saving..." : "Save changes"}
      </button>{" "}
      {save.result && !dirty && (
        <span
          className={`pxq-emlchk-save__result pxq-emlchk-${
            save.result.ok ? "success" : "error"
          }`}
        >
          {save.result.ok ? "Saved" : save.result.msg}
        </span>
      )}
    </div>
  );
}
export default function App({ items }: any) {
  const [state, dispatch] = useReducer(reducer, { ui: uiState });
  useEffect(() => {
    doAjax(
      {
        data: {
          action: "pxq_emlchk_init"
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
      <div className="pxq_emlchk_loading">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="pxq-emlchk">
      <h1>Email checker</h1>
      <p>Reject disposable email on form submission.</p>
      <ItemList items={state.items} dispatch={dispatch} />
      <SaveChanges state={state} dispatch={dispatch} />
    </div>
  );
}
