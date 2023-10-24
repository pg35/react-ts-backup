import React, { useEffect, useReducer } from "react";

//common
import { createAction, uiState, INIT_APP } from "../utils/reducer";
import { seedId, mapList } from "../utils/utils";
//import { doAjax, ajaxTest } from "../utils/ajax";
import { doAjaxDummy as doAjax } from "../utils/ajax";
import SaveChanges from "../components/SaveChanges";

//nested local
import List from "./components/List";
import Rule from "./components/Rule";
import { updateCondition } from "./components/Condition";

//local
import { reducer, RULE_LIST } from "./reducer";
import { AppContext } from "./contexts";
import { seed } from "./seed";

import "./styles.css";

//originally, until item is edited, there is no uistate in reducer state.
//I just changed to to add uiState on APP_INIT.
window.ajaxTest.responses.mwsp_init = seed;

let config: any = null;

function prepareRules(rules, meta) {
  const newRules = {};
  Object.keys(rules).forEach((screenId) => {
    newRules[screenId] = mapList(rules[screenId], (rule) => ({
      ...rule,
      products: mapList(rule.products, (cond) => updateCondition(cond, meta)),
      criteria: mapList(rule.criteria, (cond) => updateCondition(cond, meta))
    }));
  });
  return newRules;
}

function onAppInit(state, dispatch) {
  doAjax({ data: { action: "mwsp_init" } }, (res: any) => {
    dispatch(
      createAction(INIT_APP, {
        rules: prepareRules(res.data.rules, res.data.config.meta),
        ui: { ...state.ui, loading: false }
      })
    );
    config = res.data.config;
    seedId(res.data.nextId);
  });
}
export default function App(props) {
  const [state, dispatch] = useReducer(reducer, { ui: uiState });
  useEffect(() => onAppInit(state, dispatch), [config]);

  if (state.ui.loading || !config) {
    return (
      <div className="mwsp-loading">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <AppContext.Provider value={{ dispatch, meta: config.meta }}>
      {config.ui.screens.map((screen) => (
        <div key={screen.id}>
          <h1>{screen.label}</h1>
          <p>{screen.desc}</p>
          {Object.keys(state.rules).map((screenId) => (
            <List
              key={screenId}
              list={state.rules[screenId]}
              renderItem={(item) => <Rule rule={item} screen={screen} />}
              listType={RULE_LIST}
              addItemConfig={{
                label: "Add rule",
                action: { screenId, item: { ...screen.default } }
              }}
            />
          ))}
        </div>
      ))}
      <SaveChanges
        ui={state.ui}
        data={state.rules}
        dispatch={dispatch}
        doAjax={doAjax}
        slug="msre"
      />
    </AppContext.Provider>
  );
}
