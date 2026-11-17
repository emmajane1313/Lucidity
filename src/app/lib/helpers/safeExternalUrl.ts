const safeExternalUrl = (
  value: string | undefined | null,
  httpsOnly: boolean = false
): string | undefined => {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  try {
    const parsed = new URL(
      /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
        ? trimmed
        : `https://${trimmed.replace(/^\/+/, "")}`
    );

    if (
      parsed.protocol !== "https:" &&
      (httpsOnly || parsed.protocol !== "http:")
    ) {
      return undefined;
    }

    return parsed.href;
  } catch (err: any) {
    return undefined;
  }
};

export default safeExternalUrl;
