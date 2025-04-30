export const raffleStartPresenting = () => {
  localStorage.setItem("raffleAction", JSON.stringify({ action: "start" }));
};

export const raffleStopPresenting = () => {
  localStorage.removeItem("raffleAction");
};

export const isRafflePresenting = () => {
  const raffleAction = localStorage.getItem("raffleAction");
  return raffleAction !== null;
};
