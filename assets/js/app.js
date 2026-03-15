(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const STORAGE = {
    volume: "maneit_v2_volume",
    repeat: "maneit_v2_repeat",
    shuffle: "maneit_v2_shuffle",
    panel: "maneit_v2_panel",
    immersiveTab: "maneit_v2_immersive_tab",
    visualizerMode: "maneit_v2_visualizer_mode",
    eqEnabled: "maneit_v2_eq_enabled",
    eqPreset: "maneit_v2_eq_preset",
    bassBoost: "maneit_v2_eq_bass",
    eqValues: "maneit_v2_eq_values"
  };

  const EQ_BANDS = [
    { key: "pre", label: "Preamp", hz: null },
    { key: "31", label: "31 Hz", hz: 31 },
    { key: "62", label: "62 Hz", hz: 62 },
    { key: "125", label: "125 Hz", hz: 125 },
    { key: "250", label: "250 Hz", hz: 250 },
    { key: "500", label: "500 Hz", hz: 500 },
    { key: "1000", label: "1 kHz", hz: 1000 },
    { key: "2000", label: "2 kHz", hz: 2000 },
    { key: "4000", label: "4 kHz", hz: 4000 },
    { key: "8000", label: "8 kHz", hz: 8000 },
    { key: "16000", label: "16 kHz", hz: 16000 }
  ];

  const PRESETS = {
    flat:            { name: "Flat (Reference)", pre: 0.0, gains: [0,0,0,0,0,0,0,0,0,0] },
    rap_808:         { name: "Rap / 808 (Clean Punch)", pre: -2.5, gains: [4.5,3.0,1.5,0,-0.5,-0.5,0.5,1.5,1.0,0.5] },
    trap_sub:        { name: "Trap (Sub + Snap)", pre: -3.0, gains: [5.5,3.5,1.0,-0.5,-1.0,0.5,1.5,2.0,1.0,0.0] },
    hagle_vocal:     { name: "Hagle / Norwegian Rap (Vocal Forward)", pre: -2.0, gains: [3.0,2.0,0.5,-0.5,-1.0,1.5,2.0,2.0,1.0,0.5] },
    eurodance:       { name: "Eurodance (Bright + Tight)", pre: -2.0, gains: [2.0,1.5,0.5,0.0,-0.5,1.0,2.5,3.0,2.0,1.0] },
    house:           { name: "House (Warm Groove)", pre: -2.0, gains: [3.0,2.0,1.0,0.0,-0.5,0.5,1.0,1.5,1.0,0.5] },
    deep_house:      { name: "Deep House (Warm + Smooth)", pre: -2.5, gains: [3.5,2.5,1.5,0.5,0.0,-0.5,0.0,0.8,0.8,0.5] },
    techno:          { name: "Techno (Mid Drive)", pre: -2.5, gains: [2.5,2.0,1.0,0.0,-0.5,1.0,2.0,1.5,1.0,0.5] },
    hardstyle:       { name: "Hardstyle (Kick + Bite)", pre: -4.0, gains: [5.0,3.0,0.0,-1.0,-1.0,1.0,2.5,3.0,1.5,0.5] },
    happy_hardstyle: { name: "Happy Hardstyle (Bright + Pump)", pre: -4.0, gains: [4.5,2.5,0.0,-0.5,-0.5,1.5,3.0,3.5,2.0,1.0] },
    dnb:             { name: "DnB (Sub + Air)", pre: -3.0, gains: [4.5,3.0,1.0,-0.5,-1.0,0.5,1.5,2.5,2.0,1.0] },
    dubstep:         { name: "Dubstep (Wobble Weight)", pre: -4.0, gains: [6.0,3.5,0.0,-1.0,-1.5,0.5,1.0,2.0,1.5,0.5] },
    pop_clean:       { name: "Pop (Clean + Gloss)", pre: -2.0, gains: [2.0,1.0,0.0,0.0,0.0,1.0,2.0,2.0,1.5,1.0] },
    metal:           { name: "Metal (Crunch + Clarity)", pre: -3.0, gains: [2.0,1.0,0.0,0.5,1.0,1.5,2.0,1.0,0.0,0.0] },
    voice:           { name: "Voice / Podcast (Clear Speech)", pre: -1.5, gains: [-2.0,-1.0,0.0,1.0,2.0,2.5,2.0,1.0,0.0,-0.5] },
    night:           { name: "Night (Low Volume, Loudness-ish)", pre: -3.0, gains: [3.5,2.0,0.5,-0.5,-1.0,1.0,2.0,1.0,0.5,0.0] }
  };

  const els = {
    sortSelect: $("#sortSelect"),
    genreSection: $("#genres"),
    genreStrip: $("#genreStrip"),
    libraryHeading: $("#libraryHeading"),
    librarySubheading: $("#librarySubheading"),
    releaseGrid: $("#releaseGrid"),
    releaseOverlay: $("#releaseOverlay"),
    closeReleaseOverlay: $("#closeReleaseOverlay"),
    releaseDialogTitle: $("#releaseDialogTitle"),
    releaseDialogSubtitle: $("#releaseDialogSubtitle"),
    releaseDialogBody: $("#releaseDialogBody"),
    openStudioNav: $("#openStudioNav"),
    immersiveNav: $("#immersiveNav"),
    panelStack: $("#panelStack"),
    player: $("#player"),
    panelTabs: $$("[data-panel-tab]"),
    panelViews: $$("[data-panel-view]"),
    closePanelStack: $("#closePanelStack"),
    lyricsPanel: $("#lyricsPanel"),
    lyricsHeading: $("#lyricsHeading"),
    queuePanel: $("#queuePanel"),
    visualizerCanvas: $("#visualizerCanvas"),
    studioVisualizerCanvas: $("#studioVisualizerCanvas"),
    visualizerHint: $("#visualizerHint"),
    presetSelect: $("#presetSelect"),
    bassBoostBtn: $("#bassBoostBtn"),
    eqEnableBtn: $("#eqEnableBtn"),
    eqResetBtn: $("#eqResetBtn"),
    audioFxNotice: $("#audioFxNotice"),
    eqGrid: $("#eqGrid"),
    playerTitle: $("#playerTitle"),
    playerSubtitle: $("#playerSubtitle"),
    playerCover: $("#playerCover"),
    timeNow: $("#timeNow"),
    timeTotal: $("#timeTotal"),
    playerProgress: $("#playerProgress"),
    prevBtn: $("#prevBtn"),
    playPauseBtn: $("#playPauseBtn"),
    nextBtn: $("#nextBtn"),
    shuffleBtn: $("#shuffleBtn"),
    repeatBtn: $("#repeatBtn"),
    lyricsBtn: $("#lyricsBtn"),
    queueBtn: $("#queueBtn"),
    visualizerBtn: $("#visualizerBtn"),
    studioBtn: $("#studioBtn"),
    immersiveBtn: $("#immersiveBtn"),
    trackDownloadBtn: $("#trackDownloadBtn"),
    volumeRange: $("#volumeRange"),
    audio: $("#audio"),
    immersiveOverlay: $("#immersiveOverlay"),
    immersiveTitle: $("#immersiveTitle"),
    immersiveSubtitle: $("#immersiveSubtitle"),
    immersiveCover: $("#immersiveCover"),
    immersiveCoverLarge: $("#immersiveCoverLarge"),
    immersiveVisualizerCanvas: $("#immersiveVisualizerCanvas"),
    immersiveFullscreenCanvas: $("#immersiveFullscreenCanvas"),
    immersiveLyricsCopy: $("#immersiveLyricsCopy"),
    immersiveTabs: $$("[data-immersive-tab]"),
    immersiveVisualizerPanel: $("#immersiveVisualizerPanel"),
    immersiveLyricsPanel: $("#immersiveLyricsPanel"),
    closeImmersiveBtn: $("#closeImmersiveBtn"),
    openImmersiveFromLyrics: $("#openImmersiveFromLyrics"),
    navLinks: $$(".nav-link[data-nav]")
  };

  const state = {
    data: null,
    releases: [],
    releasesBySlug: new Map(),
    tracksById: new Map(),
    allTracks: [],
    activeGenre: "all",
    sortMode: "featured",
    activeReleaseSlug: null,
    queue: [],
    queueBase: [],
    queueReleaseSlug: null,
    queueIndex: -1,
    currentTrackId: null,
    isPlaying: false,
    repeatMode: "off",
    shuffle: false,
    activePanel: "lyrics",
    immersiveOpen: false,
    immersiveTab: "lyrics",
    visualizerMode: "retro",
    scrubbing: false,
    lyricCache: new Map(),
    activeLyrics: null,
    activeLyricIndex: -1,
    audioFxAvailable: false,
    audioFxReason: "",
    audioContext: null,
    sourceNode: null,
    analyser: null,
    preGain: null,
    filters: [],
    freqData: null,
    waveData: null,
    animationFrame: 0,
    eqEnabled: true,
    bassBoost: false,
    eqPreset: "flat",
    eqValues: EQ_BANDS.reduce((acc, band) => ({ ...acc, [band.key]: 0 }), {})
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function dbToGain(db) {
    return Math.pow(10, (db || 0) / 20);
  }

  function formatTime(sec) {
    const seconds = Number(sec);
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const whole = Math.floor(seconds);
    const minutes = Math.floor(whole / 60);
    const rest = String(whole % 60).padStart(2, "0");
    return `${minutes}:${rest}`;
  }

  function syncPlayerHeight() {
    if (!els.player) return;
    const height = Math.ceil(els.player.offsetHeight || 0);
    if (height > 0) {
      document.documentElement.style.setProperty("--player-height", `${height}px`);
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function safeTextList(list) {
    return Array.isArray(list)
      ? list.map((item) => String(item ?? "").trim()).filter(Boolean)
      : [];
  }

  function slugify(value) {
    return String(value ?? "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "release";
  }

  function releaseDisplayType(release) {
    return String(release?.type || "Collection");
  }

  function releaseDisplayYear(release) {
    return Number.isFinite(Number(release?.year)) ? String(Number(release.year)) : "";
  }

  function buildMetaLine(parts) {
    return parts.filter(Boolean).join(" · ");
  }

  function buildAutoCover(title, artist) {
    const seed = slugify(`${artist || "artist"}-${title || "title"}`);
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    const hueA = Math.abs(hash) % 360;
    const hueB = (hueA + 42) % 360;
    const initials = String(title || artist || "M")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "M";

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" role="img" aria-label="${escapeHtml(title || "Release")} cover art">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="hsl(${hueA} 68% 58%)" />
            <stop offset="100%" stop-color="hsl(${hueB} 72% 44%)" />
          </linearGradient>
        </defs>
        <rect width="1200" height="1200" rx="110" fill="#050912" />
        <rect x="42" y="42" width="1116" height="1116" rx="84" fill="url(#g)" opacity="0.18" />
        <circle cx="890" cy="310" r="180" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="8" />
        <circle cx="890" cy="310" r="112" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="6" />
        <text x="108" y="225" fill="rgba(255,255,255,0.68)" font-size="42" font-family="Arial, Helvetica, sans-serif" letter-spacing="7">${escapeHtml(String(artist || "Music").toUpperCase())}</text>
        <text x="108" y="980" fill="#f4f7ff" font-size="104" font-weight="700" font-family="Arial, Helvetica, sans-serif">${escapeHtml(initials)}</text>
        <text x="108" y="1070" fill="rgba(255,255,255,0.84)" font-size="58" font-family="Arial, Helvetica, sans-serif">${escapeHtml(title || "Release")}</text>
      </svg>
    `.trim();

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function normalizeAudio(track) {
    if (track?.audio && typeof track.audio === "object") return track.audio;
    return {
      mp3: track?.mp3 || "",
      wav: track?.wav || "",
      flac: track?.flac || "",
      ogg: track?.ogg || ""
    };
  }

  function normalizeLyrics(track) {
    if (track?.lyrics && typeof track.lyrics === "object") return track.lyrics;
    return {
      plain: track?.lyricsPlain || track?.txt || "",
      synced: track?.lyricsSynced || track?.lrc || ""
    };
  }

  function normalizeSimpleProjects(projects) {
    return (projects || []).map((project, releaseIndex) => {
      const releaseArtist = String(
        project?.artist ||
        project?.tracks?.find((track) => track?.artist)?.artist ||
        project?.title ||
        "Unknown artist"
      );
      const slug = String(project?.slug || project?.id || slugify(`${releaseArtist}-${project?.title || releaseIndex + 1}`));
      const genres = safeTextList(project?.genres);
      const cover = project?.cover || buildAutoCover(project?.title || slug, releaseArtist);
      return {
        id: project?.id || slug,
        slug,
        title: project?.title || releaseArtist,
        artist: releaseArtist,
        type: project?.type || "Collection",
        year: Number.isFinite(Number(project?.year)) ? Number(project.year) : null,
        genres,
        moods: safeTextList(project?.moods),
        featured: Boolean(project?.featured),
        language: project?.language || "",
        cover,
        description: project?.description || "",
        notes: project?.notes || "",
        visibility: project?.visibility || "public",
        downloadZip: project?.downloadZip || project?.zip || "",
        tracks: (project?.tracks || []).map((track, index) => ({
          id: track?.id || `${slug}-${String(index + 1).padStart(2, "0")}`,
          slug: track?.slug || slugify(track?.title || `track-${index + 1}`),
          trackNo: Number.isFinite(Number(track?.trackNo)) ? Number(track.trackNo) : index + 1,
          title: track?.title || `Track ${index + 1}`,
          artist: track?.artist || releaseArtist,
          version: track?.version || "",
          duration: Number.isFinite(Number(track?.duration)) ? Number(track.duration) : null,
          bpm: Number.isFinite(Number(track?.bpm)) ? Number(track.bpm) : null,
          key: track?.key || "",
          genres: safeTextList(track?.genres?.length ? track.genres : genres),
          audio: normalizeAudio(track),
          lyrics: normalizeLyrics(track),
          credits: Array.isArray(track?.credits) ? track.credits : [],
          visibility: track?.visibility || project?.visibility || "public",
          addedAt: track?.addedAt || project?.addedAt || "",
          releaseSlug: slug,
          releaseTitle: project?.title || releaseArtist,
          releaseType: project?.type || "Collection",
          releaseYear: Number.isFinite(Number(project?.year)) ? Number(project.year) : null,
          releaseCover: cover
        }))
      };
    });
  }

  function readStorage() {
    try {
      const volume = parseFloat(localStorage.getItem(STORAGE.volume));
      if (Number.isFinite(volume)) {
        els.audio.volume = clamp(volume, 0, 1);
        els.volumeRange.value = String(els.audio.volume);
      }

      const repeat = localStorage.getItem(STORAGE.repeat);
      if (["off", "one", "all"].includes(repeat)) state.repeatMode = repeat;

      state.shuffle = localStorage.getItem(STORAGE.shuffle) === "1";
      state.activePanel = localStorage.getItem(STORAGE.panel) || "lyrics";
      state.immersiveTab = localStorage.getItem(STORAGE.immersiveTab) || "lyrics";
      state.visualizerMode = localStorage.getItem(STORAGE.visualizerMode) || "retro";
      state.eqEnabled = localStorage.getItem(STORAGE.eqEnabled) !== "0";
      state.eqPreset = localStorage.getItem(STORAGE.eqPreset) || "flat";
      state.bassBoost = localStorage.getItem(STORAGE.bassBoost) === "1";

      const storedEq = localStorage.getItem(STORAGE.eqValues);
      if (storedEq) {
        const parsed = JSON.parse(storedEq);
        for (const band of EQ_BANDS) {
          if (typeof parsed?.[band.key] === "number") {
            state.eqValues[band.key] = clamp(parsed[band.key], -12, 12);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to restore storage", error);
    }
  }

  function writeStorage() {
    try {
      localStorage.setItem(STORAGE.volume, String(els.audio.volume));
      localStorage.setItem(STORAGE.repeat, state.repeatMode);
      localStorage.setItem(STORAGE.shuffle, state.shuffle ? "1" : "0");
      localStorage.setItem(STORAGE.panel, state.activePanel || "");
      localStorage.setItem(STORAGE.immersiveTab, state.immersiveTab);
      localStorage.setItem(STORAGE.visualizerMode, state.visualizerMode);
      localStorage.setItem(STORAGE.eqEnabled, state.eqEnabled ? "1" : "0");
      localStorage.setItem(STORAGE.eqPreset, state.eqPreset);
      localStorage.setItem(STORAGE.bassBoost, state.bassBoost ? "1" : "0");
      localStorage.setItem(STORAGE.eqValues, JSON.stringify(state.eqValues));
    } catch (error) {
      console.warn("Failed to write storage", error);
    }
  }

  function bassOffsets() {
    return [3.0, 2.0, 1.0, 0.5, 0, 0, 0, 0, 0, 0];
  }

  function bassPreComp() {
    return -2.0;
  }

  function renderPresetSelect() {
    els.presetSelect.innerHTML = "";
    const custom = document.createElement("option");
    custom.value = "custom";
    custom.textContent = "Preset: Custom";
    els.presetSelect.appendChild(custom);

    const order = [
      "flat", "rap_808", "trap_sub", "hagle_vocal", "eurodance",
      "house", "deep_house", "techno", "hardstyle", "happy_hardstyle",
      "dnb", "dubstep", "pop_clean", "metal", "voice", "night"
    ];

    order.forEach((key) => {
      const preset = PRESETS[key];
      if (!preset) return;
      const option = document.createElement("option");
      option.value = key;
      option.textContent = `Preset: ${preset.name}`;
      els.presetSelect.appendChild(option);
    });

    els.presetSelect.value = state.eqPreset;
  }

  function renderEqGrid() {
    els.eqGrid.innerHTML = "";
    EQ_BANDS.forEach((band) => {
      const card = document.createElement("div");
      card.className = "eq-band";
      card.innerHTML = `
        <label for="eq-${band.key}">
          <span>${band.label}</span>
          <strong data-eq-value="${band.key}">${state.eqValues[band.key].toFixed(1)} dB</strong>
        </label>
        <input id="eq-${band.key}" data-eq-slider="${band.key}" type="range" min="-12" max="12" step="0.1" value="${state.eqValues[band.key]}">
      `;
      els.eqGrid.appendChild(card);
    });

    $$("[data-eq-slider]", els.eqGrid).forEach((slider) => {
      slider.addEventListener("input", (event) => {
        const key = event.currentTarget.dataset.eqSlider;
        const value = clamp(parseFloat(event.currentTarget.value), -12, 12);
        state.eqValues[key] = value;
        state.eqPreset = "custom";
        updateEqText();
        applyEqSettings();
        writeStorage();
      });
    });

    updateEqText();
  }

  function updateEqText() {
    $$("[data-eq-value]", els.eqGrid).forEach((valueEl) => {
      const key = valueEl.dataset.eqValue;
      valueEl.textContent = `${state.eqValues[key].toFixed(1)} dB`;
    });

    $$("[data-eq-slider]", els.eqGrid).forEach((slider) => {
      const key = slider.dataset.eqSlider;
      slider.value = String(state.eqValues[key]);
    });

    els.presetSelect.value = state.eqPreset;
    els.bassBoostBtn.classList.toggle("is-on", state.bassBoost);
    els.bassBoostBtn.setAttribute("aria-pressed", state.bassBoost ? "true" : "false");
    els.eqEnableBtn.classList.toggle("is-on", state.eqEnabled);
    els.eqEnableBtn.textContent = state.eqEnabled ? "EQ on" : "EQ off";
  }

  function applyPreset(key) {
    if (key === "custom") {
      state.eqPreset = "custom";
      updateEqText();
      writeStorage();
      return;
    }

    const preset = PRESETS[key];
    if (!preset) return;

    const offsets = state.bassBoost ? bassOffsets() : Array(10).fill(0);
    const preAdjust = state.bassBoost ? bassPreComp() : 0;

    state.eqPreset = key;
    state.eqValues.pre = clamp(preset.pre + preAdjust, -12, 12);

    const bands = EQ_BANDS.filter((band) => band.key !== "pre");
    bands.forEach((band, index) => {
      state.eqValues[band.key] = clamp((preset.gains[index] || 0) + offsets[index], -12, 12);
    });

    updateEqText();
    applyEqSettings();
    writeStorage();
  }

  function toggleBassBoost() {
    state.bassBoost = !state.bassBoost;

    if (state.eqPreset !== "custom" && PRESETS[state.eqPreset]) {
      applyPreset(state.eqPreset);
      return;
    }

    const offsets = bassOffsets();
    state.eqValues.pre = clamp(
      state.eqValues.pre + (state.bassBoost ? bassPreComp() : -bassPreComp()),
      -12,
      12
    );

    EQ_BANDS.filter((band) => band.key !== "pre").forEach((band, index) => {
      const delta = state.bassBoost ? offsets[index] : -offsets[index];
      state.eqValues[band.key] = clamp(state.eqValues[band.key] + delta, -12, 12);
    });

    state.eqPreset = "custom";
    updateEqText();
    applyEqSettings();
    writeStorage();
  }

  function resetEq() {
    state.eqPreset = "flat";
    state.bassBoost = false;
    applyPreset("flat");
  }

  function normalizeData(data) {
    const releasesInput = Array.isArray(data?.releases)
      ? data.releases
      : Array.isArray(data?.projects)
        ? normalizeSimpleProjects(data.projects)
        : [];

    const normalized = releasesInput.map((release, releaseIndex) => {
      const slug = String(release?.slug || release?.id || slugify(`${release?.artist || "artist"}-${release?.title || releaseIndex + 1}`));
      const artist = String(release?.artist || release?.tracks?.find((track) => track?.artist)?.artist || release?.title || "Unknown artist");
      const genres = safeTextList(release?.genres);
      const cover = release?.cover || buildAutoCover(release?.title || slug, artist);
      const year = Number.isFinite(Number(release?.year)) ? Number(release.year) : null;
      const type = release?.type || "Collection";

      const tracks = (release?.tracks || []).map((track, trackIndex) => ({
        ...track,
        id: track?.id || `${slug}-${String(trackIndex + 1).padStart(2, "0")}`,
        slug: track?.slug || slugify(track?.title || `track-${trackIndex + 1}`),
        trackNo: Number.isFinite(Number(track?.trackNo)) ? Number(track.trackNo) : trackIndex + 1,
        title: track?.title || `Track ${trackIndex + 1}`,
        artist: track?.artist || artist,
        version: track?.version || "",
        duration: Number.isFinite(Number(track?.duration)) ? Number(track.duration) : null,
        bpm: Number.isFinite(Number(track?.bpm)) ? Number(track.bpm) : null,
        key: track?.key || "",
        releaseSlug: slug,
        releaseTitle: release?.title || artist,
        releaseType: type,
        releaseYear: year,
        releaseCover: cover,
        genres: safeTextList(track?.genres?.length ? track.genres : genres),
        audio: normalizeAudio(track),
        lyrics: normalizeLyrics(track),
        credits: Array.isArray(track?.credits) ? track.credits : []
      }));

      return {
        ...release,
        id: release?.id || slug,
        slug,
        title: release?.title || artist,
        artist,
        type,
        year,
        genres,
        moods: safeTextList(release?.moods),
        cover,
        description: release?.description || "",
        notes: release?.notes || "",
        tracks
      };
    });

    const derivedGenres = Array.from(new Set(normalized.flatMap((release) => release.genres).filter(Boolean))).sort((a, b) => a.localeCompare(b));

    state.data = {
      ...data,
      genres: Array.isArray(data?.genres) && data.genres.length ? data.genres : derivedGenres
    };
    state.releases = normalized;
    state.releasesBySlug = new Map(normalized.map((release) => [release.slug, release]));
    state.allTracks = normalized.flatMap((release) => release.tracks);
    state.tracksById = new Map(state.allTracks.map((track) => [track.id, track]));
  }

  function computeReleaseNewest(release) {
    return release.tracks.reduce((latest, track) => {
      const stamp = Date.parse(track.addedAt || 0);
      return Number.isFinite(stamp) && stamp > latest ? stamp : latest;
    }, 0);
  }

  function getVisibleReleases() {
    const filtered = state.releases.filter((release) => {
      if (state.activeGenre === "all") return true;
      return release.genres.some((genre) => genre.toLowerCase() === state.activeGenre);
    });

    const sorted = filtered.sort((a, b) => {
      if (state.sortMode === "title") return a.title.localeCompare(b.title);
      if (state.sortMode === "year") return b.year - a.year || a.title.localeCompare(b.title);
      if (state.sortMode === "newest") return computeReleaseNewest(b) - computeReleaseNewest(a) || b.year - a.year;
      return Number(b.featured) - Number(a.featured) || b.year - a.year || a.title.localeCompare(b.title);
    });

    return sorted;
  }

  function updateLibraryHeading() {
    const label = state.activeGenre === "all"
      ? "All releases"
      : `${state.activeGenre[0].toUpperCase()}${state.activeGenre.slice(1)} releases`;

    els.libraryHeading.textContent = label;
    els.librarySubheading.textContent = state.activeGenre === "all"
      ? "Albums, tapes, sketches, and loose singles."
      : "Filtered by genre.";
  }

  function renderGenreStrip() {
    const listedGenres = safeTextList(state.data?.genres).map((genre) => genre.toLowerCase());
    const uniqueGenres = Array.from(new Set(listedGenres));
    const genres = ["all", ...uniqueGenres];

    if (els.genreSection) {
      els.genreSection.classList.toggle("hidden", uniqueGenres.length === 0);
    }

    els.genreStrip.innerHTML = "";

    genres.forEach((genre) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `genre-chip${state.activeGenre === genre ? " is-active" : ""}`;
      button.textContent = genre === "all" ? "All releases" : genre;
      button.addEventListener("click", () => {
        state.activeGenre = genre;
        renderGenreStrip();
        renderReleaseGrid();
      });
      els.genreStrip.appendChild(button);
    });
  }

  function renderReleaseGrid() {
    updateLibraryHeading();
    const releases = getVisibleReleases();
    els.releaseGrid.innerHTML = "";

    if (!releases.length) {
      els.releaseGrid.innerHTML = `<div class="release-empty">No releases match this genre yet.</div>`;
      return;
    }

    releases.forEach((release) => {
      const card = document.createElement("article");
      card.className = "release-card";
      const releaseMeta = [release.artist, releaseDisplayYear(release), `${release.tracks.length} tracks`].filter(Boolean);
      const releaseDescription = release.description ? `<p>${escapeHtml(release.description)}</p>` : "";
      const tagRow = release.genres.length
        ? `<div class="tag-row">${release.genres.map((genre) => `<span class="tag">${escapeHtml(genre)}</span>`).join("")}</div>`
        : "";

      card.innerHTML = `
        <div class="cover-wrap">
          <img src="${escapeHtml(release.cover)}" alt="${escapeHtml(release.title)} cover art">
          <span class="release-type-badge">${escapeHtml(releaseDisplayType(release))}</span>
        </div>

        <div class="release-meta">
          <div>
            <h3>${escapeHtml(release.title)}</h3>
            <div class="release-subline">
              ${releaseMeta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
            </div>
          </div>

          ${releaseDescription}

          ${tagRow}

          <div class="card-actions">
            <button class="button primary" type="button" data-action="play">Play release</button>
            <button class="button ghost" type="button" data-action="open">Open release</button>
          </div>
        </div>
      `;

      const [playBtn, openBtn] = $$("[data-action]", card);
      playBtn.addEventListener("click", () => playRelease(release.slug, release.tracks[0]?.id, { openPanel: false }));
      openBtn.addEventListener("click", () => openReleaseOverlay(release.slug));
      card.querySelector(".cover-wrap").addEventListener("click", () => openReleaseOverlay(release.slug));

      els.releaseGrid.appendChild(card);
    });
  }

  function setHashRelease(slug) {
    const next = `#release/${slug}`;
    if (window.location.hash !== next) history.replaceState(null, "", next);
  }

  function clearHashRelease() {
    if (window.location.hash.startsWith("#release/")) {
      history.replaceState(null, "", "#library");
    }
  }

  function openReleaseOverlay(slug) {
    const release = state.releasesBySlug.get(slug);
    if (!release) return;

    state.activeReleaseSlug = slug;
    setHashRelease(slug);

    els.releaseDialogTitle.textContent = release.title;
    els.releaseDialogSubtitle.textContent = buildMetaLine([release.artist, releaseDisplayYear(release), releaseDisplayType(release)]);

    const zipButton = release.downloadZip
      ? `<a class="button" href="${escapeHtml(release.downloadZip)}" download>Download release</a>`
      : `<button class="button ghost" type="button" disabled>ZIP later</button>`;

    const trackRows = release.tracks.map((track) => {
      const isActive = track.id === state.currentTrackId;
      const fileUrl = track.audio.mp3 || track.audio.wav || track.audio.flac || track.audio.ogg || "#";
      const extension = track.audio.mp3 ? "MP3" : track.audio.wav ? "WAV" : track.audio.flac ? "FLAC" : "Audio";
      const trackMeta = [
        track.version || releaseDisplayType(release),
        track.genres.join(" · "),
        track.key || "",
        track.bpm ? `${track.bpm} BPM` : ""
      ].filter(Boolean);
      return `
        <div class="track-row${isActive ? " is-active" : ""}" data-track-row="${escapeHtml(track.id)}">
          <div class="track-index">${String(track.trackNo).padStart(2, "0")}</div>
          <div class="track-main">
            <span class="track-title">${escapeHtml(track.title)}</span>
            <div class="track-sub">
              ${trackMeta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
            </div>
          </div>
          <div class="track-time">${track.duration ? formatTime(track.duration) : "—"}</div>
          <div class="track-actions">
            <button class="button primary" type="button" data-track-action="play" data-track-id="${escapeHtml(track.id)}">Play</button>
            <button class="button ghost" type="button" data-track-action="lyrics" data-track-id="${escapeHtml(track.id)}">Lyrics</button>
            <a class="button ghost" href="${escapeHtml(fileUrl)}" download>${extension}</a>
          </div>
        </div>
      `;
    }).join("");

    const releaseTags = release.genres.length
      ? `<div class="tag-row">${release.genres.map((genre) => `<span class="tag">${escapeHtml(genre)}</span>`).join("")}</div>`
      : "";
    const releaseDescription = release.description
      ? `<p class="release-description">${escapeHtml(release.description)}</p>`
      : "";
    const notesSection = release.notes
      ? `<section class="notes-block"><span class="panel-label">Notes</span><p style="margin-top: 10px; white-space: pre-wrap;">${escapeHtml(release.notes)}</p></section>`
      : "";

    els.releaseDialogBody.innerHTML = `
      <section class="release-hero">
        <div class="release-cover-large">
          <img src="${escapeHtml(release.cover)}" alt="${escapeHtml(release.title)} cover art">
        </div>

        <div>
          ${releaseTags}

          ${releaseDescription}

          <div class="release-actions">
            <button class="button primary" type="button" data-release-action="play-all">Play release</button>
            <button class="button" type="button" data-release-action="lyrics-first">Open lyrics view</button>
            ${zipButton}
          </div>

          <div class="detail-grid">
            <div class="detail-card">
              <span class="panel-label">Type</span>
              <strong>${escapeHtml(releaseDisplayType(release))}</strong>
            </div>
            <div class="detail-card">
              <span class="panel-label">Year</span>
              <strong>${escapeHtml(releaseDisplayYear(release) || "—")}</strong>
            </div>
            <div class="detail-card">
              <span class="panel-label">Tracks</span>
              <strong>${release.tracks.length}</strong>
            </div>
            <div class="detail-card">
              <span class="panel-label">Focus</span>
              <strong>${escapeHtml((release.moods?.[0] || release.genres?.[0] || release.artist || "Music"))}</strong>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="section-heading">
          <div>
            <span class="panel-label">Track list</span>
            <h2 style="font-size: 28px; margin-top: 4px;">Release sequence</h2>
          </div>
        </div>
        <div class="tracklist">${trackRows}</div>
      </section>

      ${notesSection}
    `;

    const playAllBtn = $("[data-release-action='play-all']", els.releaseDialogBody);
    const lyricsFirstBtn = $("[data-release-action='lyrics-first']", els.releaseDialogBody);
    playAllBtn?.addEventListener("click", () => playRelease(release.slug, release.tracks[0]?.id, { openPanel: false }));
    lyricsFirstBtn?.addEventListener("click", async () => {
      await playRelease(release.slug, release.tracks[0]?.id, { openPanel: true });
      openPanel("lyrics");
    });

    $$("[data-track-action='play']", els.releaseDialogBody).forEach((button) => {
      button.addEventListener("click", async (event) => {
        const trackId = event.currentTarget.dataset.trackId;
        await playRelease(release.slug, trackId, { openPanel: false });
      });
    });

    $$("[data-track-action='lyrics']", els.releaseDialogBody).forEach((button) => {
      button.addEventListener("click", async (event) => {
        const trackId = event.currentTarget.dataset.trackId;
        await playRelease(release.slug, trackId, { openPanel: true });
        openPanel("lyrics");
      });
    });

    els.releaseOverlay.classList.add("is-open");
    els.releaseOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeReleaseOverlay({ clearHash = true } = {}) {
    els.releaseOverlay.classList.remove("is-open");
    els.releaseOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (clearHash) clearHashRelease();
  }

  function syncPanelSelection() {
    els.panelTabs.forEach((button) => {
      const active = button.dataset.panelTab === state.activePanel;
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.classList.toggle("is-on", active);
    });

    els.panelViews.forEach((view) => {
      view.classList.toggle("is-active", view.dataset.panelView === state.activePanel);
    });
  }

  function openPanel(panel) {
    state.activePanel = panel;
    els.panelStack.classList.add("is-open");
    els.panelStack.setAttribute("aria-hidden", "false");
    syncPanelSelection();
    writeStorage();
  }

  function closePanel() {
    els.panelStack.classList.remove("is-open");
    els.panelStack.setAttribute("aria-hidden", "true");
  }

  function togglePanel(panel) {
    const isOpen = els.panelStack.classList.contains("is-open");
    if (isOpen && state.activePanel === panel) {
      closePanel();
      return;
    }
    openPanel(panel);
  }

  function setImmersiveTab(tab) {
    state.immersiveTab = tab;
    els.immersiveTabs.forEach((button) => {
      const active = button.dataset.immersiveTab === tab;
      button.classList.toggle("is-on", active);
    });
    els.immersiveLyricsPanel.classList.toggle("hidden", tab !== "lyrics");
    els.immersiveVisualizerPanel.classList.toggle("hidden", tab !== "visualizer");
    writeStorage();
  }

  function openImmersive() {
    els.immersiveOverlay.classList.add("is-open");
    els.immersiveOverlay.setAttribute("aria-hidden", "false");
    state.immersiveOpen = true;
    setImmersiveTab(state.immersiveTab || "lyrics");
  }

  function closeImmersive() {
    els.immersiveOverlay.classList.remove("is-open");
    els.immersiveOverlay.setAttribute("aria-hidden", "true");
    state.immersiveOpen = false;
  }

  function setQueueForRelease(releaseSlug, startTrackId) {
    const release = state.releasesBySlug.get(releaseSlug);
    if (!release) return;
    const base = release.tracks.map((track) => track.id);
    state.queueBase = [...base];
    state.queueReleaseSlug = releaseSlug;

    if (state.shuffle) {
      const rest = base.filter((trackId) => trackId !== startTrackId);
      shuffleInPlace(rest);
      state.queue = [startTrackId, ...rest];
    } else {
      state.queue = [...base];
    }

    state.queueIndex = Math.max(0, state.queue.indexOf(startTrackId));
    renderQueue();
  }

  function shuffleInPlace(list) {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
  }

  function refreshQueueOrder() {
    if (!state.queueReleaseSlug || !state.currentTrackId) return;
    setQueueForRelease(state.queueReleaseSlug, state.currentTrackId);
  }

  function currentTrack() {
    return state.currentTrackId ? state.tracksById.get(state.currentTrackId) : null;
  }

  function currentRelease() {
    const track = currentTrack();
    return track ? state.releasesBySlug.get(track.releaseSlug) : null;
  }

  function updateTransportButtons() {
    els.playPauseBtn.textContent = state.isPlaying ? "Pause" : "Play";
    els.shuffleBtn.classList.toggle("is-on", state.shuffle);
    els.shuffleBtn.setAttribute("aria-pressed", state.shuffle ? "true" : "false");
    els.repeatBtn.textContent =
      state.repeatMode === "off" ? "Repeat off" :
      state.repeatMode === "one" ? "Repeat one" :
      "Repeat all";
    els.repeatBtn.dataset.repeat = state.repeatMode;
  }

  function updateNowPlayingUI() {
    const track = currentTrack();
    const release = currentRelease();

    if (!track || !release) {
      const idleCover = state.releases[0]?.cover || buildAutoCover("Music", "Maneit");
      els.playerTitle.textContent = "Pick a release to begin";
      els.playerSubtitle.textContent = "Choose something you want to hear.";
      els.playerCover.src = idleCover;
      els.immersiveCover.src = idleCover;
      els.immersiveCoverLarge.src = idleCover;
      els.trackDownloadBtn.href = "#";
      els.trackDownloadBtn.setAttribute("download", "");
      return;
    }

    const fileUrl = track.audio.mp3 || track.audio.wav || track.audio.flac || track.audio.ogg || "#";
    const ext = track.audio.mp3 ? "mp3" : track.audio.wav ? "wav" : track.audio.flac ? "flac" : "audio";

    els.playerTitle.textContent = track.title;
    els.playerSubtitle.textContent = buildMetaLine([release.title, releaseDisplayYear(release), track.version || releaseDisplayType(release)]);
    els.playerCover.src = release.cover;
    els.playerCover.alt = `${release.title} cover art`;
    els.immersiveCover.src = release.cover;
    els.immersiveCoverLarge.src = release.cover;

    els.immersiveTitle.textContent = track.title;
    els.immersiveSubtitle.textContent = buildMetaLine([release.title, track.genres.join(" · ") || track.artist || release.artist]);

    els.trackDownloadBtn.href = fileUrl;
    els.trackDownloadBtn.setAttribute("download", `${track.slug || track.title}.${ext}`);

    if (els.releaseOverlay.classList.contains("is-open") && state.activeReleaseSlug === release.slug) {
      $$("[data-track-row]", els.releaseDialogBody).forEach((row) => {
        row.classList.toggle("is-active", row.dataset.trackRow === track.id);
      });
    }
  }

  async function canUseAudioFx(url) {
    try {
      const absolute = new URL(url, window.location.href);
      if (absolute.origin === window.location.origin) return true;

      const response = await fetch(absolute.href, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        headers: { Range: "bytes=0-0" }
      });

      return response.ok || response.status === 206;
    } catch {
      return false;
    }
  }

  function showAudioFxNotice(message) {
    els.audioFxNotice.textContent = message;
    els.audioFxNotice.classList.remove("hidden");
    els.visualizerHint.textContent = message;
  }

  function hideAudioFxNotice() {
    els.audioFxNotice.classList.add("hidden");
    els.audioFxNotice.textContent = "";
    els.visualizerHint.textContent = "The visualizer becomes more expressive when Web Audio is available on the current host.";
  }

  async function ensureAudioFx(url) {
    if (state.audioFxAvailable && state.audioContext) {
      if (state.audioContext.state === "suspended") {
        try { await state.audioContext.resume(); } catch {}
      }
      return true;
    }

    const allowed = await canUseAudioFx(url);
    if (!allowed) {
      state.audioFxAvailable = false;
      state.audioFxReason = "Studio EQ and live visualizer need same-origin audio or CORS-enabled files on the host.";
      showAudioFxNotice(state.audioFxReason);
      return false;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error("Web Audio is not supported in this browser.");

      state.audioContext = state.audioContext || new AudioContextClass();
      if (state.audioContext.state === "suspended") {
        try { await state.audioContext.resume(); } catch {}
      }

      if (!state.sourceNode) state.sourceNode = state.audioContext.createMediaElementSource(els.audio);
      if (!state.preGain) state.preGain = state.audioContext.createGain();

      if (!state.filters.length) {
        state.filters = EQ_BANDS.filter((band) => band.hz).map((band) => {
          const filter = state.audioContext.createBiquadFilter();
          filter.type = "peaking";
          filter.frequency.value = band.hz;
          filter.Q.value = 1.0;
          return filter;
        });
      }

      if (!state.analyser) {
        state.analyser = state.audioContext.createAnalyser();
        state.analyser.fftSize = 2048;
        state.analyser.smoothingTimeConstant = 0.85;
        state.freqData = new Uint8Array(state.analyser.frequencyBinCount);
        state.waveData = new Uint8Array(state.analyser.fftSize);
      }

      reconnectAudioGraph();
      applyEqSettings();
      hideAudioFxNotice();
      state.audioFxAvailable = true;
      state.audioFxReason = "";
      return true;
    } catch (error) {
      state.audioFxAvailable = false;
      state.audioFxReason = error.message || "Unable to start Web Audio for this track.";
      showAudioFxNotice(state.audioFxReason);
      return false;
    }
  }

  function disconnectNode(node) {
    try { node.disconnect(); } catch {}
  }

  function reconnectAudioGraph() {
    if (!state.audioContext || !state.sourceNode || !state.analyser) return;

    disconnectNode(state.sourceNode);
    disconnectNode(state.preGain);
    state.filters.forEach(disconnectNode);
    disconnectNode(state.analyser);

    if (state.eqEnabled) {
      state.sourceNode.connect(state.preGain);
      let last = state.preGain;
      state.filters.forEach((filter) => {
        last.connect(filter);
        last = filter;
      });
      last.connect(state.analyser);
    } else {
      state.sourceNode.connect(state.analyser);
    }

    state.analyser.connect(state.audioContext.destination);
  }

  function applyEqSettings() {
    updateEqText();
    if (!state.audioFxAvailable || !state.preGain || !state.filters.length) return;

    state.preGain.gain.value = dbToGain(state.eqValues.pre);
    const gains = EQ_BANDS.filter((band) => band.key !== "pre").map((band) => state.eqValues[band.key]);
    gains.forEach((gain, index) => {
      if (state.filters[index]) state.filters[index].gain.value = gain;
    });

    reconnectAudioGraph();
  }

  function readTrackUrl(track) {
    return track.audio.mp3 || track.audio.wav || track.audio.flac || track.audio.ogg || "";
  }

  async function playTrackById(trackId, { fromReleaseSlug = null, openPanelAfter = false } = {}) {
    const track = state.tracksById.get(trackId);
    if (!track) return;

    const releaseSlug = fromReleaseSlug || track.releaseSlug;
    if (!state.queue.length || state.queueReleaseSlug !== releaseSlug || !state.queue.includes(trackId)) {
      setQueueForRelease(releaseSlug, trackId);
    } else {
      state.queueIndex = state.queue.indexOf(trackId);
    }

    state.currentTrackId = trackId;
    updateNowPlayingUI();

    const url = readTrackUrl(track);
    if (!url) return;

    els.audio.crossOrigin = "anonymous";
    els.audio.src = url;

    await ensureAudioFx(url);

    try {
      await els.audio.play();
      state.isPlaying = true;
      updateTransportButtons();
      renderQueue();
      await loadLyrics(track);
      if (openPanelAfter) openPanel("lyrics");
      updateMediaSession();
    } catch (error) {
      state.isPlaying = false;
      updateTransportButtons();
      showAudioFxNotice(`Playback failed: ${error.message || error}`);
    }
  }

  async function playRelease(releaseSlug, trackId = null, { openPanel = false } = {}) {
    const release = state.releasesBySlug.get(releaseSlug);
    if (!release || !release.tracks.length) return;
    const firstTrack = trackId || release.tracks[0].id;
    await playTrackById(firstTrack, { fromReleaseSlug: releaseSlug, openPanelAfter: openPanel });
  }

  function pausePlayback() {
    els.audio.pause();
    state.isPlaying = false;
    updateTransportButtons();
  }

  async function togglePlayback() {
    if (!state.currentTrackId) {
      const firstRelease = getVisibleReleases()[0] || state.releases[0];
      if (firstRelease) {
        await playRelease(firstRelease.slug, firstRelease.tracks[0]?.id, { openPanel: false });
      }
      return;
    }

    if (state.isPlaying) {
      pausePlayback();
      return;
    }

    try {
      await els.audio.play();
      state.isPlaying = true;
      updateTransportButtons();
      if (state.audioContext?.state === "suspended") {
        try { await state.audioContext.resume(); } catch {}
      }
    } catch (error) {
      showAudioFxNotice(`Playback failed: ${error.message || error}`);
    }
  }

  async function nextTrack({ autoplay = true } = {}) {
    if (!state.queue.length) return;
    let nextIndex = state.queueIndex + 1;
    if (nextIndex >= state.queue.length) {
      if (state.repeatMode === "all") nextIndex = 0;
      else {
        pausePlayback();
        return;
      }
    }

    state.queueIndex = nextIndex;
    const trackId = state.queue[state.queueIndex];
    if (autoplay) await playTrackById(trackId, { fromReleaseSlug: state.queueReleaseSlug });
  }

  async function previousTrack() {
    if (!state.queue.length) return;
    if (els.audio.currentTime > 3) {
      els.audio.currentTime = 0;
      return;
    }

    let nextIndex = state.queueIndex - 1;
    if (nextIndex < 0) nextIndex = state.repeatMode === "all" ? state.queue.length - 1 : 0;
    state.queueIndex = nextIndex;
    const trackId = state.queue[state.queueIndex];
    await playTrackById(trackId, { fromReleaseSlug: state.queueReleaseSlug });
  }

  function cycleRepeat() {
    state.repeatMode = state.repeatMode === "off"
      ? "one"
      : state.repeatMode === "one"
        ? "all"
        : "off";
    updateTransportButtons();
    writeStorage();
  }

  function toggleShuffle() {
    state.shuffle = !state.shuffle;
    refreshQueueOrder();
    updateTransportButtons();
    writeStorage();
  }

  function renderQueue() {
    els.queuePanel.innerHTML = "";
    if (!state.queue.length) {
      els.queuePanel.innerHTML = `<div class="release-empty">Start a release to build a queue.</div>`;
      return;
    }

    state.queue.forEach((trackId, index) => {
      const track = state.tracksById.get(trackId);
      if (!track) return;
      const release = state.releasesBySlug.get(track.releaseSlug);
      const item = document.createElement("div");
      item.className = `queue-item${trackId === state.currentTrackId ? " is-active" : ""}`;
      item.innerHTML = `
        <div class="track-index">${String(index + 1).padStart(2, "0")}</div>
        <div class="queue-item-title">
          <strong>${escapeHtml(track.title)}</strong>
          <span>${escapeHtml(release?.title || "")}</span>
        </div>
        <button type="button" class="button ghost">Play</button>
      `;
      $("button", item).addEventListener("click", () => {
        playTrackById(trackId, { fromReleaseSlug: state.queueReleaseSlug });
      });
      els.queuePanel.appendChild(item);
    });
  }

  function parseLrc(text) {
    const lines = String(text || "").split(/\r?\n/);
    const parsed = [];

    lines.forEach((line) => {
      const matches = [...line.matchAll(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,2}))?\]/g)];
      if (!matches.length) return;
      const content = line.replace(/\[[^\]]+\]/g, "").trim();
      matches.forEach((match) => {
        const minutes = parseInt(match[1], 10) || 0;
        const seconds = parseInt(match[2], 10) || 0;
        const hundredths = parseInt(match[3] || "0", 10) || 0;
        parsed.push({
          time: minutes * 60 + seconds + hundredths / 100,
          text: content
        });
      });
    });

    return parsed.sort((a, b) => a.time - b.time);
  }

  async function fetchText(url) {
    if (!url) return "";
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    return response.text();
  }

  async function loadLyrics(track) {
    if (!track) return;
    if (state.lyricCache.has(track.id)) {
      state.activeLyrics = state.lyricCache.get(track.id);
      renderLyrics();
      return;
    }

    let payload = { type: "empty", lines: [], raw: "" };

    try {
      if (track.lyrics?.synced) {
        const syncedText = await fetchText(track.lyrics.synced);
        const syncedLines = parseLrc(syncedText);
        if (syncedLines.length) payload = { type: "synced", lines: syncedLines, raw: syncedText };
      }
    } catch (error) {
      console.warn("Failed to load synced lyrics", error);
    }

    if (payload.type === "empty") {
      try {
        if (track.lyrics?.plain) {
          const plainText = await fetchText(track.lyrics.plain);
          const plainLines = plainText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
          if (plainLines.length) payload = { type: "plain", lines: plainLines.map((text, index) => ({ time: index * 4, text })), raw: plainText };
        }
      } catch (error) {
        console.warn("Failed to load plain lyrics", error);
      }
    }

    state.lyricCache.set(track.id, payload);
    state.activeLyrics = payload;
    state.activeLyricIndex = -1;
    renderLyrics();
  }

  function renderLyrics() {
    const track = currentTrack();
    const release = currentRelease();
    els.lyricsHeading.textContent = track ? `${track.title} · lyrics` : "Nothing playing yet";

    if (!track || !state.activeLyrics?.lines?.length) {
      const empty = `<div class="release-empty">No lyrics loaded for this track yet.</div>`;
      els.lyricsPanel.innerHTML = empty;
      els.immersiveLyricsCopy.innerHTML = empty;
      return;
    }

    const header = `${track.title} · ${release?.title || ""}`;
    els.lyricsHeading.textContent = header;

    const html = state.activeLyrics.lines.map((line, index) => `
      <div class="lyric-line" data-lyric-index="${index}">
        ${escapeHtml(line.text)}
      </div>
    `).join("");

    els.lyricsPanel.innerHTML = html;
    els.immersiveLyricsCopy.innerHTML = html;

    updateLyricHighlight(true);
  }

  function updateLyricHighlight(force = false) {
    if (!state.activeLyrics?.lines?.length || !currentTrack()) return;

    let nextIndex = -1;
    if (state.activeLyrics.type === "synced") {
      const currentTime = els.audio.currentTime || 0;
      for (let i = 0; i < state.activeLyrics.lines.length; i += 1) {
        if (currentTime >= state.activeLyrics.lines[i].time) nextIndex = i;
        else break;
      }
    } else {
      nextIndex = 0;
    }

    if (!force && nextIndex === state.activeLyricIndex) return;
    state.activeLyricIndex = nextIndex;

    [els.lyricsPanel, els.immersiveLyricsCopy].forEach((container) => {
      $$("[data-lyric-index]", container).forEach((line) => {
        const active = Number(line.dataset.lyricIndex) === nextIndex;
        line.classList.toggle("is-active", active);
        if (active && container.closest(".immersive-panel, .panel-view")) {
          line.scrollIntoView({ block: "center", behavior: force ? "auto" : "smooth" });
        }
      });
    });
  }

  function resizeCanvasToDisplaySize(canvas) {
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const width = Math.floor(canvas.clientWidth * ratio);
    const height = Math.floor(canvas.clientHeight * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function generateSyntheticData(time) {
    if (!state.freqData || !state.waveData) {
      state.freqData = new Uint8Array(1024);
      state.waveData = new Uint8Array(2048);
    }

    for (let i = 0; i < state.freqData.length; i += 1) {
      state.freqData[i] = 80 + 50 * Math.sin(time * 0.0015 + i * 0.12) + 35 * Math.sin(time * 0.0008 + i * 0.03);
    }
    for (let i = 0; i < state.waveData.length; i += 1) {
      state.waveData[i] = 128 + 60 * Math.sin(time * 0.003 + i * 0.025) + 18 * Math.sin(time * 0.007 + i * 0.05);
    }
  }

  function drawVisualizerTo(canvas, time) {
    if (!canvas || canvas.offsetParent === null) return;

    resizeCanvasToDisplaySize(canvas);
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const ratio = window.devicePixelRatio || 1;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, width, height);

    const bassAverage = state.freqData
      ? Array.from(state.freqData.slice(0, 24)).reduce((sum, value) => sum + value, 0) / 24
      : 128;

    const alphaBase = state.visualizerMode === "retro" ? 0.18 : 0.12;
    context.fillStyle = `rgba(3, 7, 14, ${alphaBase})`;
    context.fillRect(0, 0, width, height);

    const gradient = context.createRadialGradient(width * 0.32, height * 0.25, 0, width * 0.32, height * 0.25, Math.max(width, height) * 0.8);
    gradient.addColorStop(0, "rgba(125, 211, 252, 0.22)");
    gradient.addColorStop(0.38, state.visualizerMode === "retro" ? "rgba(249, 168, 212, 0.12)" : "rgba(255,255,255,0.04)");
    gradient.addColorStop(1, "rgba(7, 10, 15, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.52;
    const baseRadius = Math.min(width, height) * 0.14 + bassAverage * 0.3 * ratio;

    context.save();
    context.globalCompositeOperation = "lighter";
    for (let i = 0; i < 3; i += 1) {
      context.beginPath();
      const radius = baseRadius + i * 28 * ratio;
      context.strokeStyle = i === 0 ? "rgba(125, 211, 252, 0.22)" : i === 1 ? "rgba(249, 168, 212, 0.18)" : "rgba(251, 191, 36, 0.14)";
      context.lineWidth = (2 + i) * ratio;
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.stroke();
    }
    context.restore();

    if (state.visualizerMode === "retro") {
      const bars = 84;
      const step = width / bars;
      for (let i = 0; i < bars; i += 1) {
        const sample = state.freqData[Math.floor((i / bars) * state.freqData.length)] || 0;
        const intensity = sample / 255;
        const barHeight = intensity * height * 0.46;
        const hue = (i * 5 + time * 0.02) % 360;
        context.fillStyle = `hsla(${hue}, 85%, 65%, 0.55)`;
        context.fillRect(i * step + step * 0.12, height - barHeight, step * 0.76, barHeight);
      }
    } else {
      context.strokeStyle = "rgba(125, 211, 252, 0.92)";
      context.lineWidth = 2 * ratio;
      context.beginPath();
      const bars = 140;
      for (let i = 0; i < bars; i += 1) {
        const sample = state.freqData[Math.floor((i / bars) * state.freqData.length)] || 0;
        const intensity = sample / 255;
        const x = (i / (bars - 1)) * width;
        const y = height * 0.72 - intensity * height * 0.42;
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }

    context.strokeStyle = "rgba(237, 242, 251, 0.88)";
    context.lineWidth = 2.2 * ratio;
    context.beginPath();
    for (let i = 0; i < state.waveData.length; i += 1) {
      const sample = state.waveData[i] / 255;
      const x = (i / (state.waveData.length - 1)) * width;
      const y = height * 0.3 + (sample - 0.5) * height * 0.32;
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();

    context.fillStyle = "rgba(255,255,255,0.12)";
    for (let i = 0; i < 16; i += 1) {
      const angle = time * 0.0002 + i * (Math.PI / 8);
      const orbit = baseRadius + 80 * ratio + i * 5 * ratio;
      const x = centerX + Math.cos(angle) * orbit;
      const y = centerY + Math.sin(angle) * orbit;
      context.beginPath();
      context.arc(x, y, 2.2 * ratio, 0, Math.PI * 2);
      context.fill();
    }
  }

  function visualizerLoop(time) {
    if (state.audioFxAvailable && state.analyser) {
      state.analyser.getByteFrequencyData(state.freqData);
      state.analyser.getByteTimeDomainData(state.waveData);
    } else {
      generateSyntheticData(time);
    }

    [
      els.visualizerCanvas,
      els.studioVisualizerCanvas,
      els.immersiveVisualizerCanvas,
      els.immersiveFullscreenCanvas
    ].forEach((canvas) => drawVisualizerTo(canvas, time));

    state.animationFrame = requestAnimationFrame(visualizerLoop);
  }

  function updateProgressUI() {
    els.timeNow.textContent = formatTime(els.audio.currentTime || 0);
    els.timeTotal.textContent = formatTime(els.audio.duration || 0);

    if (!state.scrubbing) {
      const ratio = els.audio.duration > 0 ? (els.audio.currentTime / els.audio.duration) : 0;
      els.playerProgress.value = String(Math.round(ratio * 1000));
    }
  }

  function handleEnded() {
    if (state.repeatMode === "one") {
      els.audio.currentTime = 0;
      els.audio.play().catch(() => {});
      return;
    }
    nextTrack({ autoplay: true });
  }

  function updateMediaSession() {
    const track = currentTrack();
    const release = currentRelease();
    if (!("mediaSession" in navigator) || !track || !release) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: release.artist,
      album: release.title,
      artwork: [{ src: release.cover, sizes: "1200x1200", type: "image/svg+xml" }]
    });

    navigator.mediaSession.setActionHandler("play", () => togglePlayback());
    navigator.mediaSession.setActionHandler("pause", () => pausePlayback());
    navigator.mediaSession.setActionHandler("previoustrack", () => previousTrack());
    navigator.mediaSession.setActionHandler("nexttrack", () => nextTrack({ autoplay: true }));
    navigator.mediaSession.setActionHandler("seekbackward", () => {
      els.audio.currentTime = Math.max(0, els.audio.currentTime - 10);
    });
    navigator.mediaSession.setActionHandler("seekforward", () => {
      els.audio.currentTime = Math.min(els.audio.duration || els.audio.currentTime, els.audio.currentTime + 10);
    });
  }

  function handleHashRouting() {
    const hash = window.location.hash || "#library";
    if (hash.startsWith("#release/")) {
      const slug = hash.slice("#release/".length);
      if (state.releasesBySlug.has(slug)) {
        openReleaseOverlay(slug);
        return;
      }
    }
    closeReleaseOverlay({ clearHash: false });
  }

  function bindEvents() {
    els.sortSelect.addEventListener("change", (event) => {
      state.sortMode = event.currentTarget.value;
      renderReleaseGrid();
    });

    els.closeReleaseOverlay.addEventListener("click", () => closeReleaseOverlay());
    els.releaseOverlay.addEventListener("click", (event) => {
      if (event.target === els.releaseOverlay) closeReleaseOverlay();
    });

    els.panelTabs.forEach((button) => {
      if (!button.dataset.panelTab) return;
      button.addEventListener("click", () => openPanel(button.dataset.panelTab));
    });

    els.closePanelStack.addEventListener("click", closePanel);
    els.openStudioNav.addEventListener("click", () => openPanel("studio"));
    els.lyricsBtn.addEventListener("click", () => togglePanel("lyrics"));
    els.queueBtn.addEventListener("click", () => togglePanel("queue"));
    els.visualizerBtn.addEventListener("click", () => togglePanel("visualizer"));
    els.studioBtn.addEventListener("click", () => togglePanel("studio"));

    els.prevBtn.addEventListener("click", previousTrack);
    els.playPauseBtn.addEventListener("click", togglePlayback);
    els.nextBtn.addEventListener("click", () => nextTrack({ autoplay: true }));
    els.shuffleBtn.addEventListener("click", toggleShuffle);
    els.repeatBtn.addEventListener("click", cycleRepeat);

    els.volumeRange.addEventListener("input", (event) => {
      els.audio.volume = clamp(parseFloat(event.currentTarget.value), 0, 1);
      writeStorage();
    });

    els.playerProgress.addEventListener("pointerdown", () => { state.scrubbing = true; });
    els.playerProgress.addEventListener("pointerup", () => { state.scrubbing = false; });
    els.playerProgress.addEventListener("input", () => {
      if (!Number.isFinite(els.audio.duration) || !els.audio.duration) return;
      const ratio = Number(els.playerProgress.value) / 1000;
      els.timeNow.textContent = formatTime(els.audio.duration * ratio);
    });
    els.playerProgress.addEventListener("change", () => {
      if (!Number.isFinite(els.audio.duration) || !els.audio.duration) return;
      const ratio = Number(els.playerProgress.value) / 1000;
      els.audio.currentTime = els.audio.duration * ratio;
      state.scrubbing = false;
    });

    els.audio.addEventListener("loadedmetadata", updateProgressUI);
    els.audio.addEventListener("timeupdate", () => {
      updateProgressUI();
      updateLyricHighlight();
    });
    els.audio.addEventListener("ended", handleEnded);
    els.audio.addEventListener("play", () => {
      state.isPlaying = true;
      updateTransportButtons();
    });
    els.audio.addEventListener("pause", () => {
      state.isPlaying = false;
      updateTransportButtons();
    });
    els.audio.addEventListener("error", () => {
      showAudioFxNotice("The current audio file could not be played.");
    });

    els.immersiveBtn.addEventListener("click", openImmersive);
    els.immersiveNav.addEventListener("click", openImmersive);
    els.openImmersiveFromLyrics.addEventListener("click", openImmersive);
    els.closeImmersiveBtn.addEventListener("click", closeImmersive);
    els.immersiveOverlay.addEventListener("click", (event) => {
      if (event.target === els.immersiveOverlay) closeImmersive();
    });
    els.immersiveTabs.forEach((button) => {
      button.addEventListener("click", () => setImmersiveTab(button.dataset.immersiveTab));
    });

    $$("[data-visualizer-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.visualizerMode = button.dataset.visualizerMode;
        $$("[data-visualizer-mode]").forEach((target) => target.classList.toggle("is-on", target === button));
        writeStorage();
      });
    });

    els.presetSelect.addEventListener("change", (event) => {
      applyPreset(event.currentTarget.value);
    });
    els.bassBoostBtn.addEventListener("click", toggleBassBoost);
    els.eqEnableBtn.addEventListener("click", () => {
      state.eqEnabled = !state.eqEnabled;
      applyEqSettings();
      writeStorage();
    });
    els.eqResetBtn.addEventListener("click", resetEq);

    els.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        els.navLinks.forEach((item) => item.dataset.active = "false");
        link.dataset.active = "true";
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.target.matches("input, textarea, select")) return;
      if (event.code === "Space") {
        event.preventDefault();
        togglePlayback();
      } else if (event.code === "ArrowRight") {
        els.audio.currentTime = Math.min((els.audio.duration || 0), (els.audio.currentTime || 0) + 5);
      } else if (event.code === "ArrowLeft") {
        els.audio.currentTime = Math.max(0, (els.audio.currentTime || 0) - 5);
      } else if (event.code === "KeyL") {
        togglePanel("lyrics");
      } else if (event.code === "KeyV") {
        togglePanel("visualizer");
      }
    });

    window.addEventListener("hashchange", handleHashRouting);
    window.addEventListener("resize", syncPlayerHeight);
  }

  async function loadLibrary() {
    const response = await fetch(`data/library.json?v=2`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load library.json");
    const data = await response.json();
    normalizeData(data);
  }

  async function init() {
    readStorage();
    renderPresetSelect();
    renderEqGrid();
    updateTransportButtons();
    syncPlayerHeight();

    $$("[data-visualizer-mode]").forEach((button) => {
      button.classList.toggle("is-on", button.dataset.visualizerMode === state.visualizerMode);
    });

    try {
      await loadLibrary();
      renderGenreStrip();
      renderReleaseGrid();
      updateNowPlayingUI();
      renderQueue();
      handleHashRouting();
    } catch (error) {
      els.releaseGrid.innerHTML = `<div class="release-empty">Failed to load library data.<br>${escapeHtml(error.message || String(error))}</div>`;
    }

    syncPanelSelection();
    setImmersiveTab(state.immersiveTab || "lyrics");
    updateEqText();
    bindEvents();
    syncPlayerHeight();
    requestAnimationFrame(syncPlayerHeight);
    state.animationFrame = requestAnimationFrame(visualizerLoop);
  }

  init();
})();
