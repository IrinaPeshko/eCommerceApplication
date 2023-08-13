export const route = (e: MouseEvent): void => {
  const { currentTarget } = e;

  if (currentTarget instanceof HTMLAnchorElement) {
    window.history.pushState({}, "", currentTarget.href);
  }
};
