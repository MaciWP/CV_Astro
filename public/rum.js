(function () {
  if (window.trustedTypes && !window.ttPolicy) {
    window.ttPolicy = window.trustedTypes.createPolicy("default", {
      createHTML: (input) => input,
      createScriptURL: (input) => input,
      createScript: (input) => input,
    });
  }

  const metrics = { lcp: 0, cls: 0 };

  new PerformanceObserver((list) => {
    const entry = list.getEntries().pop();
    if (entry) metrics.lcp = entry.startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });

  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (!e.hadRecentInput) metrics.cls += e.value;
    }
  }).observe({ type: "layout-shift", buffered: true });

  window.addEventListener("load", () => {
    metrics.t = performance.now();
    navigator.sendBeacon("/cdn-cgi/rum", JSON.stringify(metrics));
  });
})();
