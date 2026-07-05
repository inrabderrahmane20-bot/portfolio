/** Shared motion constants + boot-aware entrance delay. */
export const EASE = 'power4.out';
export const EASE_CSS = 'cubic-bezier(0.19, 1, 0.22, 1)';

/** Hero entrances wait for the preloader on the first paint of a session. */
export const bootDelay = () =>
  typeof window !== 'undefined' && sessionStorage.getItem('ac-booted') ? 0.25 : 2.25;
