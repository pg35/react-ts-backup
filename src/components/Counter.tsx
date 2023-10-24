import * as React from "react";

interface Props {
  count?: number;
}
export const Counter: React.FunctionComponent<Props> = (props) => {
  return <h1>{props.count}</h1>;
};
Counter.defaultProps = {
  count: 1000
};

interface State {
  count: number;
}

export default class CountMgr extends React.Component<Props, State> {
  state: State = {
    count: 100
  };
  static defaultProps: Props = {
    count: 5000
  };
  render() {
    return (
      <div>
        <h2>
          <Counter />
        </h2>
        <h2>{this.state.count}</h2>
        <button onClick={(e) => this.setState((p) => ({ count: p.count + 1 }))}>
          Add
        </button>
        <button
          onClick={(e) => this.setState((p) => ({ count: p.count - 1.2 }))}
        >
          Sub
        </button>
      </div>
    );
  }
}
