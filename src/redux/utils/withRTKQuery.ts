import { store } from "../redux";
import { Component } from "react";

interface WithRTKQueryConfig<Props, ResultType> {
  endpoint: any;
  getQueryParams?: (props: Props) => string;
  propertyName: keyof Props;
}

export function withRTKQuery<
  Props extends Record<string, any>,
  State extends Record<string, any>,
  K extends keyof Props
>(config: WithRTKQueryConfig<Props, Props[K]> & { propertyName: K }) {
  return function (
    WrappedComponent: new (props: Props) => Component<Props, State>
  ) {
    return class RTKQueryWrapper extends WrappedComponent {
      private unsubscribe?: () => void;
      private storeListener?: () => void;

      async componentDidMount() {
        const queryParams = config.getQueryParams?.(this.props) || undefined;
        this.unsubscribe = store.dispatch(
          config.endpoint.initiate(queryParams)
        ).unsubscribe;

        this.storeListener = store.subscribe(() => {
          const state = store.getState();
          const data = config.endpoint.select(queryParams)(state);

          if (this.state) {
            this.setState({
              [config.propertyName]: data ?? null,
            } as Pick<State, keyof State>);
          }
        });

        if (super.componentDidMount) {
          await super.componentDidMount();
        }
      }

      async componentWillUnmount() {
        this.storeListener?.();
        this.unsubscribe?.();

        if (super.componentWillUnmount) {
          await super.componentWillUnmount();
        }
      }
    };
  };
}
