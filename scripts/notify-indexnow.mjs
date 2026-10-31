const site = new URL("https://www.devariam.com");
const key = "9d57d6b20ce74906766b87a5e097ea5e8e0d4078dd7ca721";
const keyLocation = new URL("/indexnow-key.txt", site).href;
const urls = process.argv.slice(2);

if (urls.length === 0) {
  throw new Error(
    "Pass one or more changed canonical URLs, e.g. npm run indexnow -- https://www.devariam.com/services",
  );
}

for (const value of urls) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.host !== site.host || url.search || url.hash) {
    throw new Error(`Not a canonical Devariam URL: ${value}`);
  }
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: site.host,
    key,
    keyLocation,
    urlList: [...new Set(urls)],
  }),
});

if (!response.ok) {
  const details = await response.text();
  throw new Error(`IndexNow request failed (${response.status}): ${details}`);
}

console.log(`IndexNow accepted ${new Set(urls).size} URL(s) (HTTP ${response.status}).`);
