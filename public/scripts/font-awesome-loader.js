/**
 * Icon Sprite Loader
 * Loads the SVG sprite and injects it into the DOM
 */
(function () {
  function loadSprite() {
    fetch("/icons.svg")
      .then((r) => r.text())
      .then((svg) => {
        const div = document.createElement("div");
        div.style.display = "none";
        div.innerHTML = svg;
        document.body.prepend(div);
        document.documentElement.classList.add("icons-loaded");
      })
      .catch((err) => console.error("Icon sprite error:", err));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSprite);
  } else {
    loadSprite();
  }
})();
