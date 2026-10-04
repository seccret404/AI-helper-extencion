(() => {
  // Re-clicking Start on an already active tab just resets the bubble.
  if (window.__aihReset) return window.__aihReset();

  const host = document.createElement("div");
  host.style.cssText = "all:initial;position:fixed;right:16px;bottom:16px;z-index:2147483647;";
  const root = host.attachShadow({ mode: "closed" });
  root.innerHTML = `
    <style>
      .b { font: 8px/1.4 system-ui, sans-serif; color: #fff; background: rgba(17,24,39,.92); opacity: .8;
           border-radius: 10px; padding: 3px 8px; max-width: 240px; max-height: 200px; overflow: auto;
           box-shadow: 0 2px 8px rgba(0,0,0,.25); white-space: pre-wrap; word-wrap: break-word; position: relative; }
      .x { position: absolute; top: 1px; right: 4px; cursor: pointer; opacity: .6; }
      .x:hover { opacity: 1; }
      .t { padding-right: 8px; }
    </style>
    <div class="b"><span class="x">×</span><div class="t">waiting</div></div>`;
  const txt = root.querySelector(".t");
  document.documentElement.appendChild(host);

  let busy = false;
  let last = "";
  let hideTimer;
  const set = (s) => { txt.textContent = s; };

  const onUp = (e) => {
    if (busy || e.composedPath().includes(host)) return;
    setTimeout(() => {
      const text = (window.getSelection()?.toString() || "").trim();
      if (!text || text === last) return;
      last = text;
      busy = true;
      clearTimeout(hideTimer);
      set("processing");
      chrome.runtime.sendMessage({ type: "ask", text }, (r) => {
        busy = false;
        const err = chrome.runtime.lastError?.message || r?.error;
        set(err ? "Error: " + err : r.answer);
        // Show the answer for 3s, then go back to waiting for the next question.
        hideTimer = setTimeout(() => set("waiting"), 3000);
      });
    }, 10);
  };

  const stop = () => {
    clearTimeout(hideTimer);
    document.removeEventListener("mouseup", onUp, true);
    host.remove();
    delete window.__aihReset;
  };
  root.querySelector(".x").addEventListener("click", stop);
  document.addEventListener("mouseup", onUp, true);
  window.__aihReset = () => { last = ""; if (!busy) set("waiting"); };
})();
