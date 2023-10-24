import { createListAction, SELECT_ITEM } from "../../utils/reducer";

import Rule from "./Rule";
import RuleList from "./RuleList";

import { RULE_LIST } from "../reducer";

export default function Screen({ screen, rules, dispatch }) {
  return (
    <div key={screen.id}>
      <h1>{screen.label}</h1>
      <p>{screen.desc}</p>
      <p>
        {rules.selected
          ? `Selected Rule Id is = ${rules.selected}`
          : "No rule is currently selected"}
      </p>
      {rules.selected ? (
        <div>
          <Rule rule={rules.items[rules.selected]} screen={screen} />
          <button
            onClick={() =>
              dispatch(
                createListAction(RULE_LIST, SELECT_ITEM, {
                  screenId: screen.id,
                  item: {
                    id: null
                  }
                })
              )
            }
          >
            Go back
          </button>
        </div>
      ) : (
        <RuleList key={screen.id} rules={rules} screen={screen} />
      )}
    </div>
  );
}
