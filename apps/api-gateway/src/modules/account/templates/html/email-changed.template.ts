export const getEmailChangedTemplate = (success: boolean): string => {
  if (success) {
    return `<p>Success!</p>`;
  }

  return `<p>Error</p>`;
};
