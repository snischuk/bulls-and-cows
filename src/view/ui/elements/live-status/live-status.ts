import { STATUS_REGION } from '@/view/config/interface.config';

import './live-status.css';

type LiveStatusOptions = Readonly<Partial<HTMLDivElement>>;

type CreateLiveStatus = (
  source: HTMLElement,
  options?: LiveStatusOptions,
) => HTMLDivElement;

export const createLiveStatus: CreateLiveStatus = (
  source: HTMLElement,
  options: LiveStatusOptions = {},
): HTMLDivElement => {
  const element: HTMLDivElement = document.createElement('div');
  Object.assign(element, options);
  element.classList.add('live-status');

  const regions: Map<string, HTMLParagraphElement> = new Map();

  for (const name of Object.values(STATUS_REGION)) {
    const region: HTMLParagraphElement = document.createElement('p');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-atomic', 'true');
    region.dataset.liveRegion = name;

    regions.set(name, region);
    element.append(region);
  }

  const updateMessages: MutationCallback = (): void => {
    for (const [name, region] of regions) {
      const message: HTMLElement | null = source.querySelector<HTMLElement>(
        `[data-status-region="${name}"]`,
      );
      const text: string = message?.hidden ? '' : (message?.textContent ?? '');

      if (region.textContent !== text) region.textContent = text;
    }
  };

  const observer: MutationObserver = new MutationObserver(updateMessages);
  observer.observe(source, {
    childList: true,
    characterData: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['hidden'],
  });

  return element;
};
