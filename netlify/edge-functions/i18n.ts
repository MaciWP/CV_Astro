import { Context } from "https://edge.netlify.com";

function preferredLang(header: string | null): "es" | "fr" | null {
  if (!header) return null;
  for (const part of header.split(",")) {
    const lang = part.split(";")[0].trim().toLowerCase();
    if (lang.startsWith("es")) return "es";
    if (lang.startsWith("fr")) return "fr";
  }
  return null;
}

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);

  if (url.pathname === "/") {
    const lang = preferredLang(request.headers.get("accept-language"));

    if (lang) {
      const redirectUrl = new URL(`/${lang}/`, url.origin);
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl.toString(),
          "Edge-TTL": "86400",
        },
      });
    }
  }

  return context.next();
}
