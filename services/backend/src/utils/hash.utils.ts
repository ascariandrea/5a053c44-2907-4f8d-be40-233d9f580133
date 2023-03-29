import * as bcrypt from 'bcrypt';

/**
 * Hash the given text with salt (default to 10 rounds)
 */
export const hash = async (
  text: string,
  salt?: string | number,
): Promise<string> => {
  return bcrypt.hash(text, salt ?? 10);
};
