/**
 * Logic untuk select Server + Kualitas di halaman episode.
 * Data diambil dari container [data-server-quality-select] (data-episode-lookup, data-api-base, data-api-secret).
 * Panggil initEpisodeServerQuality() sekali setelah halaman episode dimuat.
 */

export interface LookupEntry {
  serverName: string;
  quality: string;
  href: string;
  serverId: string;
  isDirect: boolean;
}

const resolvedUrls: Record<string, string> = {};

function sortQualities(a: string, b: string): number {
  const nA = parseInt(String(a).replace(/\D/g, ""), 10) || 0;
  const nB = parseInt(String(b).replace(/\D/g, ""), 10) || 0;
  return nA - nB;
}

function escapeHtml(s: string): string {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

async function fetchServerUrl(
  serverId: string,
  apiBase: string,
  apiSecret: string
): Promise<string | null> {
  const id =
    (serverId || "").replace(/^.*\/server\//i, "").replace(/\/$/, "") ||
    serverId;
  if (!apiBase || !apiSecret) return null;
  const res = await fetch(`${apiBase}/server/${id}`, {
    headers: {
      "X-API-Key": apiSecret,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.ok && json?.data?.url ? json.data.url : null;
}

function run(): void {
  const container = document.querySelector("[data-server-quality-select]");
  if (!container) return;

  const lookupRaw = container.getAttribute("data-episode-lookup");
  let lookup: LookupEntry[] = [];
  try {
    if (lookupRaw) lookup = JSON.parse(lookupRaw) as LookupEntry[];
  } catch {
    // ignore
  }
  if (!lookup.length) return;

  const apiBase = container.getAttribute("data-api-base") ?? "";
  const apiSecret = container.getAttribute("data-api-secret") ?? "";

  const serverSelect = container.querySelector<HTMLSelectElement>(
    "#episode-server-name-select"
  );
  const qualitySelect = container.querySelector<HTMLSelectElement>(
    "#episode-quality-select"
  );
  const iframe = document.getElementById("episode-iframe") as HTMLIFrameElement | null;
  const loadingEl = document.getElementById("episode-server-loading");
  const qualityLabel = document.getElementById("episode-quality-label");

  if (!serverSelect || !qualitySelect) return;

  const serverEl = serverSelect;
  const qualityEl = qualitySelect;

  function setIframeSrc(url: string, quality: string | null): void {
    if (iframe) {
      iframe.style.display = "";
      iframe.src = url;
    }
    if (loadingEl) loadingEl.classList.add("hidden");
    if (qualityLabel) {
      qualityLabel.textContent = quality ? `${quality} • AUTO` : "AUTO";
    }
  }

  function onServerChange(): void {
    const serverName = (serverEl.value ?? "").trim();
    if (!serverName) {
      qualityEl.innerHTML =
        '<option value="" selected>Pilih server dulu</option>';
      qualityEl.classList.add("quality-select-locked");
      qualityEl.setAttribute("aria-disabled", "true");
      qualityEl.setAttribute("tabindex", "-1");
      return;
    }
    const qualities = [
      ...new Set(
        lookup
          .filter((e) => (e.serverName ?? "").trim() === serverName)
          .map((e) => e.quality)
      ),
    ].sort(sortQualities);

    qualityEl.innerHTML =
      '<option value="" selected disabled>Pilih Kualitas</option>' +
      qualities
        .map(
          (q) =>
            `<option value="${escapeHtml(q)}">${escapeHtml(q)}</option>`
        )
        .join("");

    qualityEl.classList.remove("quality-select-locked");
    qualityEl.removeAttribute("aria-disabled");
    qualityEl.removeAttribute("tabindex");
    qualityEl.value = "";
  }

  function findEntry(): LookupEntry | null {
    const serverName = (serverEl.value ?? "").trim();
    const quality = (qualityEl.value ?? "").trim();
    if (!serverName || !quality) return null;
    return (
      lookup.find(
        (e) =>
          (e.serverName ?? "").trim() === serverName &&
          (e.quality ?? "").trim() === quality
      ) ?? null
    );
  }

  function onQualityChange(): void {
    const entry = findEntry();
    if (!entry) return;

    const cacheKey = `${entry.serverId}|${entry.quality}`;
    if (entry.isDirect && entry.href) {
      resolvedUrls[cacheKey] = entry.href;
      setIframeSrc(entry.href, entry.quality);
      return;
    }
    if (resolvedUrls[cacheKey]) {
      setIframeSrc(resolvedUrls[cacheKey], entry.quality);
      return;
    }

    serverEl.disabled = true;
    qualityEl.disabled = true;
    if (loadingEl) {
      loadingEl.classList.remove("hidden");
      loadingEl.classList.add("flex");
      if (iframe) iframe.style.display = "none";
    }

    fetchServerUrl(entry.serverId, apiBase, apiSecret).then((url) => {
      serverEl.disabled = false;
      qualityEl.disabled = false;
      if (loadingEl) {
        loadingEl.classList.add("hidden");
        loadingEl.classList.remove("flex");
      }
      if (url) {
        resolvedUrls[cacheKey] = url;
        setIframeSrc(url, entry.quality);
      } else {
        if (iframe) iframe.style.display = "";
        qualityEl.selectedIndex = 0;
      }
    });
  }

  serverEl.addEventListener("change", onServerChange);
  serverEl.addEventListener("input", onServerChange);
  qualityEl.addEventListener("change", onQualityChange);
  onServerChange();
}

/**
 * Inisialisasi select Server + Kualitas di halaman episode.
 * Baca data dari container [data-server-quality-select] (data-episode-lookup, data-api-base, data-api-secret).
 */
export function initEpisodeServerQuality(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
}
