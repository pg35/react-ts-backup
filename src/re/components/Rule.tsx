import { useContext } from "react";
import Select from "react-select";
import styled from "styled-components";

import { createListAction, EDIT_ITEM, REMOVE_ITEM } from "../../utils/reducer";
import { ListItemHeader } from "../../utils/List";
import { reactSelectStyles } from "../../utils/utils";

import ConditionList from "./ConditionList";

import { RULE_LIST, UPDATE_FIELD } from "../reducer";
import { AppContext } from "../contexts";

const sectionComponents = {
  InquiryFields: () => {},
  InquiryFields1: () => (
    <div style={{ display: "flex" }}>
      <Select
        defaultValue={{ value: 1, label: "abc" }}
        options={[
          { value: 1, label: "abc" },
          { value: 2, label: "abc2" }
        ]}
        styles={reactSelectStyles}
      />
      <input />
    </div>
  ),
  ConditionList: ConditionList
};
const InputWrap = styled.div`
  margin-top: 5px;
`;
const Fields = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: ${(props) => props.direction || "row"};
  flex-wrap: wrap;
  flex-grow: 1;
  width: 100%;
`;
const Field = styled.div`
  flex-grow: 1;
  flex-basis: 300px;
`;
const Input = styled.input`
  width: 100%;
  height: 42px;
`;
const Bold = styled.span`
  font-weight: bold;
`;
const Muted = styled.span`
  opacity: 0.5;
`;
const Margin = styled.div`
  margin: ${($props) => $props.margin || "auto"};
`;
export default function Rule({ rule, screen }) {
  const { dispatch } = useContext(AppContext);

  function updateField(name, value) {
    const obj = {
      screenId: screen.id,
      ruleId: rule.id,
      fields: {
        [name]: value
      }
    };
    dispatch(createListAction(RULE_LIST, UPDATE_FIELD, obj));
  }
  return (
    <div>
      <Fields>
        <Fields>
          <Field>
            <label>
              <Bold>Method</Bold>
              <InputWrap>
                <select value={rule.fields.pricing.method}>
                  <optgroup label="Simple">
                    <option value="simple">Simple adjustment</option>
                  </optgroup>
                  <optgroup label="Volume">
                    <option value="bulk">Bulk pricing</option>
                    <option value="tiered">Tiered pricing</option>
                  </optgroup>
                  <optgroup label="Group">
                    <option value="group">Group of products</option>
                    <option value="group_repeat">
                      Group of products - Repeating
                    </option>
                  </optgroup>
                  <optgroup label="Buy / Get">
                    <option value="bogo_xx">Buy x get x</option>
                    <option value="bogo_xx_repeat">
                      Buy x get x - Repeating
                    </option>
                    <option value="bogo">Buy x get y</option>
                    <option value="bogo_repeat">Buy x get y - Repeating</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="exclude">
                      Exclude products from all rules
                    </option>
                    <option value="restrict_purchase">
                      Restrict purchase of matched products
                    </option>
                  </optgroup>
                </select>
              </InputWrap>
            </label>
          </Field>
          <Field>
            <label>
              <Bold>Note</Bold> <Muted>Private</Muted>
              <InputWrap>
                <input
                  type="text"
                  value={rule.fields.label}
                  onChange={(e) => updateField("label", e.target.value)}
                />
              </InputWrap>
            </label>
          </Field>
        </Fields>
        <Fields>
          <Field>
            <label>
              <Bold>Description</Bold> <Muted>Public</Muted>
              <InputWrap>
                <Input
                  type="text"
                  value={rule.fields.desc}
                  onChange={(e) => updateField("desc", e.target.value)}
                />
              </InputWrap>
            </label>
          </Field>
        </Fields>
      </Fields>
      <h3>Simle Adjustment</h3>
      <Fields>
        <Field>
          <select>
            <optgroup label="Discount">
              <option value="discount__amount">Fixed discount</option>
              <option value="discount__percentage">Percentage discount</option>
            </optgroup>
            <optgroup label="Fee">
              <option value="fee__amount">Fixed fee</option>
              <option value="fee__percentage">Percentage fee</option>
            </optgroup>
            <optgroup label="Price">
              <option value="fixed__price">Fixed price</option>
            </optgroup>
          </select>
        </Field>
        <Field>
          <input type="text" />
        </Field>
      </Fields>

      {Object.keys(screen.sections).map((sectionId) => {
        const section = screen.sections[sectionId];
        const Comp = sectionComponents[section.component];
        return (
          <div key={sectionId}>
            {section.label && <h2>{section.label}</h2>}
            {rule[sectionId] && (
              <Comp
                data={rule[sectionId]}
                screen={screen}
                ruleId={rule.id}
                sectionId={sectionId}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
