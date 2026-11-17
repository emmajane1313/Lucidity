import escapeHtml from "./escapeHtml";
import safeExternalUrl from "./safeExternalUrl";

const descripcionRegex = (description: string, colorChange: boolean) => {
  const replacedDescription = String(description ?? "").replace(
    /\n\n/g,
    "\n \n"
  );
  const lines = replacedDescription.split(/[\r\n]+/);
  const color = colorChange ? "#f9ed00" : "#81A8F8";

  const styledLines = lines.map((line: string) => {
    const words = line.split(/(?=[@#])|\s+/);
    const styledWords = words.map((word) => {
      const safeWord = escapeHtml(word);
      if (word[0] === "#") {
        return `<em id="hashtags" style="color: ${color}; font-style: normal; word-break: break-all; margin-right: 4px;">${safeWord}</em>`;
      } else if (word[0] === "@") {
        const link = escapeHtml(
          `https://cypher.digitalax.xyz/autograph/${encodeURIComponent(
            word.replace(".lens", "").replace("@", "")
          )}`
        );
        return ` <a href="${link}" rel="noreferrer" target="_blank" style="word-break: break-all; margin-right: 4px;"> <span style="color: ${color};">${safeWord}</span> </a> `;
      } else if (
        word.startsWith("http") ||
        word.startsWith("www.") ||
        word.endsWith(".xyz") ||
        word.endsWith(".com")
      ) {
        const url = safeExternalUrl(word);
        if (!url) {
          return safeWord;
        }
        return ` <a href="${escapeHtml(
          url
        )}" style="word-break: break-all; margin-right: 4px;" target="_blank" rel="noreferrer"> <span style="color: ${color};">${safeWord}</span> </a> `;
      } else {
        return safeWord;
      }
    });
    return `<span>${styledWords.join(" ")}</span>`;
  });

  const formattedDescription = styledLines.join("<br />");
  return `<div style="word-wrap: break-word; max-width: 100%;">${formattedDescription}</div>`;
};

export default descripcionRegex;
