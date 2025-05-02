// Define the type for algorithm function
type AlgoFunction = (text: string) => string;

// Example algo map
const algos: Record<string, { encode: AlgoFunction; decode: AlgoFunction }> = {
  reverse: {
    encode: (text: string) => text.split("").reverse().join(""),
    decode: (text: string) => text.split("").reverse().join("")
  },
  shift: {
    encode: (text: string) =>
      text
        .split("")
        .map((char) => String.fromCharCode(char.charCodeAt(0) + 1))
        .join(""),
    decode: (text: string) =>
      text
        .split("")
        .map((char) => String.fromCharCode(char.charCodeAt(0) - 1))
        .join("")
  }
};

// giberate function (encode)
const giberate = (text: string, algo: string): string => {
  const selectedAlgo = algos[algo];
  if (!selectedAlgo) {
    throw new Error(`Algorithm "${algo}" not found.`);
  }
  return selectedAlgo.encode(text);
};

// ungiberate function (decode)
const ungiberate = (text: string, algo: string): string => {
  const selectedAlgo = algos[algo];
  if (!selectedAlgo) {
    throw new Error(`Algorithm "${algo}" not found.`);
  }
  return selectedAlgo.decode(text);
};

export { giberate, ungiberate };
