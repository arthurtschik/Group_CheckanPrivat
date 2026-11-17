# Hinweise für Claude: Ablauf bei jedem Release

Die App heißt **Group Checkan** (Paket `de.anwesenheit.app`), Repository `arthurtschik/Group_Checkan`.
Der Nutzer veröffentlicht Releases selbst auf GitHub; Antworten und Release-Texte auf Deutsch.

Bei **jedem neuen Release**:

1. Version in `build/build.py` erhöhen und bauen
   (`TOOLS=… KEYSTORE=… KEYSTORE_PASS=… python3 build/build.py`). Der Signaturschlüssel `build/release.p12`
   liegt nicht im Repository; ihn und das Passwort schickt der Nutzer bei Bedarf. Nie committen.
2. Release Notes in `docs/releases/vX.Y.md` schreiben: Titel, kurze Einleitung, **Neuerungen zuerst**,
   danach `## 🔄 Update` und `## 🔏 Signatur`, dann `---` und der Haftungshinweis.
   **Keine `---`-Linie vor den Neuerungen** – alles ab der ersten Trennlinie oder ab den Abschnitten
   Update/Signatur/Hinweis erscheint nicht auf der Download-Seite.
3. **Download-Seite aktualisieren:** `python3 build/site.py` schreibt die Neuerungen der neuesten Datei in
   `docs/index.html` („Was ist neu in X?“) und aktualisiert die Rechtstexte. Hat der Nutzer das Release
   veröffentlicht oder den Text dort geändert, holt `python3 build/site.py --github` den veröffentlichten Text.
   Das Ergebnis immer **mit dem Release committen**.
4. Tests laufen lassen, committen, pushen. Dem Nutzer APK, Tag, Release-Name und Beschreibung zum Kopieren geben.
   Erinnern: Die angehängte Datei muss genau `Group-Checkan.apk` heißen (Releases sind unveränderlich – ein
   falscher Name lässt sich danach nicht mehr korrigieren). Nach dem Veröffentlichen mit
   `gh api repos/arthurtschik/Group_Checkan/releases/latest` Name und SHA-256 der APK prüfen.

## Download-Seite (`docs/`)

Aufbau und Stil wie die Seiten von Twitschik und Watschik (flach, zentriert, Dunkel/Hell nach Gerät), nur mit den
Farben der App. Keine Zusatzeffekte oder zusätzlichen Elemente, die es auf den Vorbild-Seiten nicht gibt.
Auch die App hat eine strenge Content-Security-Policy (`script-src 'self'`): kein Inline-Code und keine `onclick`-Attribute
in `app/assets/` – Logik gehört nach `app/assets/main.js`, Schließen-Knöpfe nutzen `data-close`.
Die Seite hat eine strenge Content-Security-Policy (kein Inline-Script/-Style); Release-Texte werden nur als Text
eingesetzt, Links nur zu `github.com/arthurtschik/`.

