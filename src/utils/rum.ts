import { onCLS, onFID, onLCP, onINP, onTTFB, type Metric } from "web-vitals";

function sendToGA(metric: Metric) {
  const { name, delta, id } = metric;
  const value = name === "CLS" ? Math.round(delta * 1000) : Math.round(delta);
  window.gtag?.("event", name, {
    event_category: "Web Vitals",
    value,
    metric_id: id,
    non_interaction: true,
  });
}

export function initRUM(GA_ID: string) {
  if (!GA_ID || typeof window === "undefined") return;

  onCLS(sendToGA);
  onFID(sendToGA);
  onLCP(sendToGA);
  onINP(sendToGA);
  onTTFB(sendToGA);
}
