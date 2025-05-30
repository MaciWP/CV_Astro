export default async (request: Request, context: any) => {
  const nonce = crypto.randomUUID();
  context.locals.nonce = nonce;
  const response = await context.next();

  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "style-src 'self' 'strict-dynamic' 'nonce-" +
      nonce +
      "' 'sha256-iC8+wSrx0/v1MyD4Ru9xOIZ1+OJweRBAc8JM/B/VRbk=' https://cdnjs.cloudflare.com",
    "script-src 'self' 'strict-dynamic' 'nonce-" +
      nonce +
      "' 'sha256-0g8z/IQg327EqmXEkNuGDPivOhHksRHv02Y8+F+c3KQ=' https://static.cloudflareinsights.com",
    "img-src 'self' data:",
    "font-src 'self' https://cdnjs.cloudflare.com data:",
    "connect-src 'self'",
    "manifest-src 'self'",
    "require-trusted-types-for 'script'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  return response;
};
