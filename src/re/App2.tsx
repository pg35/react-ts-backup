import React, { useEffect, useReducer } from "react";
import {
  INIT_APP,
  ADD_ITEM,
  EDIT_ITEM,
  REMOVE_ITEM,
  SWAP_ITEM,
  uiState
} from "../utils/reducer";
import { createAction } from "../utils/reducer";
import { doAjaxDummy as doAjax, ajaxTest } from "../utils/ajax";
//import { doAjax, ajaxTest } from "../utils/ajax";
import SaveChanges from "../components/SaveChanges";
import { reducer } from "./reducer";

import { seed } from "./seed";

const initialState = {
  //originally, until item is edited, there is no uistate in reducer state.
  //I just changed to to add uiState on APP_INIT.
  items: seed.rules.inquiry
};
window.ajaxTest.responses = {
  mwsp_init: initialState
};

function InquiryFields(props) {
  return <p>this is inquiry fields</p>;
}
function ConditionList(props) {
  return <p>this is ConditionList</p>;
}
const ID2Control = {
  InquiryFields: InquiryFields,
  ConditionList: ConditionList
};
function Section({ data, control }) {
  const Control = ID2Control[control];
  return (
    <section>
      <h2>{data.label}</h2>
      {control && <Control />}
    </section>
  );
}
export default function App(props) {
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
    <div>
      {seed.config.ui.screens.map((screen) => (
        <div data-id={screen.id} key={screen.id}>
          <h1>{screen.label}</h1>
          <p>{screen.desc}</p>
          {Object.keys(seed.rules).map((screenId) => {
            const list = state.items; //seed.rules[screenId];
            return (
              <div>
                <div className="list">
                  {list.map((rule, index) => (
                    <div>
                      <div key={rule.id}>
                        <h2>{rule.id}</h2>
                        {screen.sections.map((section) => (
                          <Section
                            control={section.control}
                            data={rule[section.id]}
                            key={section.id}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          dispatch(
                            createAction(REMOVE_ITEM, {
                              index
                            })
                          )
                        }
                      >
                        Delete rule
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() =>
                    dispatch(
                      createAction(ADD_ITEM, {
                        item: { id: 3, fields: {}, products: [], criteria: [] }
                      })
                    )
                  }
                >
                  Add rule
                </button>
              </div>
            );
          })}
        </div>
      ))}
      <SaveChanges
        ui={state.ui}
        data={state.items}
        dispatch={dispatch}
        doAjax={doAjax}
        slug="mwsp"
      />
      <button
        onClick={() =>
          dispatch(
            createAction(EDIT_ITEM, {
              index: 0,
              data: { on: true }
            })
          )
        }
      >
        make dirty
      </button>
    </div>
  );
}
