export const urlFilter = (originalLink: string, spaLink: string) => {
  let linkToPass;

  // ✅ Get spa_status from localStorage (default to false if not set)
  const stored = localStorage.getItem("spa_status");
  const SPA_status = stored === "true" ? true : false;

  if (SPA_status) {
    linkToPass = spaLink;
  } else {
    linkToPass = originalLink;
  }

  return linkToPass;
};
