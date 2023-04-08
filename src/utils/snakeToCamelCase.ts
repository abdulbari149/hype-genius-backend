export default function snakeToCamelCase(str: string) {
  const strParts = str.split('_');
  const firstPart = strParts[0];
  let endParts = strParts.slice(1);
  if (endParts.length === 0) return firstPart;
  endParts = endParts.map((p) => `${p.charAt(0).toUpperCase()}${p.slice(1)}`);
  return firstPart + endParts.join('');
}
