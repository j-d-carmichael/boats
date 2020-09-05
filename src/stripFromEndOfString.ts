export default (input: string, strip: string): string => {
  return input.substring(input.length - strip.length) === strip
    ? input.substring(0, input.length - strip.length)
    : input;
};
