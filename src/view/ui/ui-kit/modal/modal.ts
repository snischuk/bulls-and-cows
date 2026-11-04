import './modal.css';

interface ModalOptions {
  readonly id: string;
  readonly label: string;
  readonly content: readonly Node[];
  readonly initialFocus?: HTMLElement;
}

interface Modal {
  readonly element: HTMLDialogElement;
  readonly open: () => void;
  readonly close: () => void;
}

let openModalCount: number = 0;
let previousOverflow: string = '';
let previousScrollbarGutter: string = '';

type CreateModal = (options: ModalOptions) => Modal;

export const createModal: CreateModal = (options: ModalOptions): Modal => {
  const element: HTMLDialogElement = document.createElement('dialog');
  element.id = options.id;
  element.className = 'ui-modal';
  element.setAttribute('aria-label', options.label);
  element.append(...options.content);

  let opener: HTMLElement | null = null;
  let isScrollLocked: boolean = false;

  const open: () => void = (): void => {
    if (element.open) return;

    opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    element.showModal();

    if (openModalCount === 0) {
      previousOverflow = document.documentElement.style.overflow;
      previousScrollbarGutter = document.documentElement.style.scrollbarGutter;
      document.documentElement.style.scrollbarGutter = 'stable';
      document.documentElement.style.overflow = 'hidden';
    }
    openModalCount += 1;
    isScrollLocked = true;
    options.initialFocus?.focus();
  };

  element.addEventListener('close', (): void => {
    if (isScrollLocked) {
      openModalCount -= 1;
      isScrollLocked = false;
      if (openModalCount === 0) {
        document.documentElement.style.overflow = previousOverflow;
        document.documentElement.style.scrollbarGutter =
          previousScrollbarGutter;
      }
    }
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  });

  element.addEventListener('click', (event: MouseEvent): void => {
    if (event.target !== element) return;

    const bounds: DOMRect = element.getBoundingClientRect();
    const isOutside: boolean =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (isOutside) element.close();
  });

  return { element, open, close: (): void => element.close() };
};
