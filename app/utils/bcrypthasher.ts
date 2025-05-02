import bcrypt from "bcryptjs";

export const hashPassword = async (plainText: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainText, salt);
};

export const checkPassword = async (
  plainText: string,
  hashed: string
): Promise<boolean> => {
  return await bcrypt.compare(plainText, hashed);
};
