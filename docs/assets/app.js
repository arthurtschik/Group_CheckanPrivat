// Holt beim Öffnen das neueste Release von GitHub und setzt Version, Größe und den direkten APK-Link.
// Ohne JavaScript oder bei einem Fehler bleibt der Knopf auf dem festen „latest“-Link.
(function () {
  "use strict";
  // Feste Repository-ID: bleibt gleich, auch wenn das Repository umbenannt wird.
  var API = "https://api.github.com/repositories/1452715470/releases/latest";
  var OWNER = "https://github.com/arthurtschik/";

  var btn = document.getElementById("dl");
  var meta = document.getElementById("meta");
  var digestRow = document.getElementById("digest");
  var digestVal = document.getElementById("digestv");
  if (!btn || !meta) return;

  function fallback() { meta.textContent = "Die aktuelle Version findest du über den Knopf."; }
  if (!window.fetch) { fallback(); return; }

  var ctrl = typeof AbortController === "function" ? new AbortController() : null;
  var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 8000) : null;

  fetch(API, {
    headers: { Accept: "application/vnd.github+json" },
    referrerPolicy: "no-referrer",
    signal: ctrl ? ctrl.signal : undefined
  })
    .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
    .then(function (rel) {
      // Nur .apk-Dateien aus Releases dieses Kontos werden als Download-Link übernommen.
      var apk = (rel.assets || []).filter(function (a) {
        var u = a && a.browser_download_url;
        return typeof u === "string" && /\.apk$/i.test(u) && u.indexOf(OWNER) === 0 && u.indexOf("/releases/download/") > 0;
      })[0];
      if (!apk) throw new Error("keine APK");
      btn.href = apk.browser_download_url;

      // nur echte Versionsnummern anzeigen (z. B. v2.7), sonst weglassen
      var tag = String(rel.tag_name || "");
      var version = /^v?\d+(\.\d+){0,3}$/i.test(tag) ? tag.replace(/^v/i, "") : "";
      var mb = (Number(apk.size) / 1048576).toFixed(1).replace(".", ",");
      var date = rel.published_at ? new Date(rel.published_at).toLocaleDateString("de-DE") : "";
      var parts = [];
      if (version) parts.push("Version " + version);
      if (isFinite(Number(apk.size)) && Number(apk.size) > 0) parts.push(mb + " MB");
      if (date && date !== "Invalid Date") parts.push(date);
      meta.textContent = parts.length ? parts.join(" · ") : "Aktuelle Version bereit zum Download";

      // Prüfsumme der Datei, falls GitHub sie mitliefert (nur Text, nie als HTML eingefügt)
      if (digestRow && digestVal && typeof apk.digest === "string" && /^sha256:[0-9a-f]{64}$/.test(apk.digest)) {
        digestVal.textContent = apk.digest.slice(7);
        digestRow.hidden = false;
      }
    })
    .catch(fallback)
    .then(function () { if (timer) clearTimeout(timer); });
})();
