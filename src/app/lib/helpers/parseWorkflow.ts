const parseWorkflow = (value: unknown): object => {
  if (value && typeof value === "object") return value as object;
  if (typeof value !== "string") return {};

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err: any) {
    return {};
  }
};

export default parseWorkflow;
