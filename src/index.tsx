import { StrictMode, useState } from "react";
import * as ReactDOMClient from "react-dom/client";

//import App from "./App";
//import App from "./emlchk/App";
//import App from "./mwsp/App";
//import App from "./formbuilder/App";
import App from "./re/App";
import { FixedList, ExpandableList, SortableList } from "./utils/List";

const list = {
  items: {
    1: { id: 1 },
    2: { id: 2 }
  },
  itemOrder: []
};
function App2() {
  const [state, setState] = useState(list);
  const renderItem = (item, index, list) => (
    <h2>
      {item.id}-{index}
    </h2>
  );
  return (
    <div>
      <FixedList list={list} renderItem={renderItem} />
      <SortableList
        list={state}
        renderItem={renderItem}
        addItemConfig={{
          label: "Add Rule",
          onAddItem: (id, e) => {
            const newState = {
              ...state,
              items: {
                ...state.items,
                [id]: { id: id }
              },
              itemOrder: state.itemOrder.concat([id])
            };
            console.log(newState);
            setState(newState);
          }
        }}
        removeItemConfig={{
          label: "Remove Rule",
          onRemoveItem: (id, e) => {
            const newState = {
              ...state,
              items: { ...state.items },
              itemOrder: state.itemOrder.filter((itemId) => itemId !== id)
            };
            delete newState.items[id];
            console.log(newState);
            setState(newState);
          }
        }}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
if (null !== rootElement) {
  const root = ReactDOMClient.createRoot(rootElement);
  root.render(<App />);
}
