export const lockBody = (lock: boolean) => {
  if (lock) {
    document.body.style.overflow = "hidden";
    document.body.style.position = "relative";
  } else {
    document.body.style.overflow = "auto";
    document.body.style.position = "static";
  }
};
