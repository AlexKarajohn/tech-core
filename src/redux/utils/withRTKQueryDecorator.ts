import { store } from "../redux";
import { Component } from "react";

interface Fetcher<T> {
  endpoint: any;
  fetchOnMount: boolean;
  propsToParamsSelector?: (props: T) => any;
  returnDataIdentifier: string;
}

interface WithRTKQueryConfig<Props, ResultType> {
  fetchers: Fetcher<Props>[];
}

type voidFunction = () => void;

export const getObjectHash = (obj: any): string => {
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};
export const capitalizeFirstLetter = (word: string): string => {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// New type helpers
type GeneratedState<T extends Fetcher<any>[]> = {
  [K in T[number] as K["returnDataIdentifier"]]: K["fetchOnMount"] extends true
    ? any
    : Record<string, any>;
};

type GeneratedFetchers<T extends Fetcher<any>[]> = {
  [K in T[number] as K["fetchOnMount"] extends false
    ? `fetch${Capitalize<K["returnDataIdentifier"]>}`
    : never]: (params: any) => void;
};

export function withRTKQuery<
  Props extends Record<string, any>,
  State extends Record<string, any>
>({ fetchers }: WithRTKQueryConfig<Props, State>) {
  return function (
    WrappedComponent: new (props: Props) => Component<Props, State>
  ) {
    return class RTKQueryWrapper extends WrappedComponent {
      declare state: State & GeneratedState<typeof fetchers>;
      declare props: Props &
        GeneratedState<typeof fetchers> &
        GeneratedFetchers<typeof fetchers>;

      private unsubscribe?: voidFunction[];
      private storeListener?: voidFunction[];
      [key: string]: any;

      async componentDidMount() {
        const unsubscribes: voidFunction[] = [];
        const storeListeners: voidFunction[] = [];

        for (const fetcher of fetchers) {
          if (fetcher.fetchOnMount) {
            const queryParams =
              fetcher.propsToParamsSelector?.(this.props) || undefined;

            const storeListener = store.subscribe(() => {
              const state = store.getState();
              const data = fetcher.endpoint.select(queryParams)(state);

              const prevData = this.state?.[fetcher.returnDataIdentifier];
              if (JSON.stringify(prevData) !== JSON.stringify(data)) {
                console.log("Changed 1", Date.now());
                this.setState({
                  [fetcher.returnDataIdentifier]: data ?? null,
                } as Pick<State, keyof State>);
              }
            });
            storeListeners.push(storeListener);

            const unsubscribe = store.dispatch(
              fetcher.endpoint.initiate(queryParams)
            ).unsubscribe;
            unsubscribes.push(unsubscribe);
            console.log("init?");
          } else {
            this[
              `fetch${capitalizeFirstLetter(fetcher.returnDataIdentifier)}`
            ] = (queryParams: any) => {
              const unsubscribe = store.dispatch(
                fetcher.endpoint.initiate(queryParams)
              ).unsubscribe;
              unsubscribes.push(unsubscribe);

              const storeListener = store.subscribe(() => {
                const state = store.getState();
                const data = fetcher.endpoint.select(queryParams)(state);

                const prevData =
                  this.state?.[fetcher.returnDataIdentifier]?.[
                    getObjectHash(queryParams)
                  ];
                if (JSON.stringify(prevData) !== JSON.stringify(data)) {
                  console.log("Changed ", Date.now());
                  this.setState(
                    (prev) =>
                      ({
                        ...prev,
                        [fetcher.returnDataIdentifier]: {
                          ...(prev[fetcher.returnDataIdentifier] as Record<
                            string,
                            unknown
                          >),
                          [getObjectHash(queryParams)]: data || null,
                        },
                      } as State)
                  );
                }
              });
              storeListeners.push(storeListener);
            };
          }
        }

        this.unsubscribe = unsubscribes;
        this.storeListener = storeListeners;

        if (super.componentDidMount) {
          await super.componentDidMount();
        }
      }

      async componentWillUnmount() {
        this.storeListener?.forEach((listener) => listener());
        this.unsubscribe?.forEach((unsubscribe) => unsubscribe());

        if (super.componentWillUnmount) {
          await super.componentWillUnmount();
        }
      }
    };
  };
}
