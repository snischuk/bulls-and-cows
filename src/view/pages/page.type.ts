export type PageAction = () => void;

export interface AppPage {
  readonly element: HTMLElement;
  readonly preserve: PageAction;
  readonly focus: PageAction;
}
