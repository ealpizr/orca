export const parseParams = (params: Record<string, unknown>) =>
  Object.keys(params)
    .map((key) => {
      return (
        encodeURIComponent(key) +
        "=" +
        encodeURIComponent(String(params[key as keyof typeof params]))
      );
    })
    .join("&");
