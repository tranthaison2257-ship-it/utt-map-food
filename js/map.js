(function () {
  const school = window.FoodZoneData.UTT_LOCATION;
  const DEFAULT_BASE_MAP = "google_streets"; 
  const BASE_MAPS = {
    google_streets: {
        label: "Google Maps",
        icon: "fa-map",
        url: "https://mt{s}.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}",
        subdomains: "0123",
        attribution: "&copy; Google Maps",
        maxZoom: 22 // Google hỗ trợ zoom rất sâu
    },

    // 2. Google Vệ tinh Lai (Ảnh vệ tinh + Tên đường phố, tòa nhà)
    google_hybrid: {
        label: "Google Vệ tinh",
        icon: "fa-satellite",
        url: "https://mt{s}.google.com/vt/lyrs=y&hl=vi&x={x}&y={y}&z={z}",
        subdomains: "0123",
        attribution: "&copy; Google Maps",
        maxZoom: 22
    },

    maptiler_hybrid: {
        label: "Vệ tinh & Đường phố",
        icon: "fa-satellite",
        url: "https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=dArLQuLjyJDg3I50lZwS",
        attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    },
    maptiler_streets: {
        label: "MapTiler Streets",
        icon: "fa-map",
        url: "https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=dArLQuLjyJDg3I50lZwS",
        attribution: '&copy; MapTiler &copy; OpenStreetMap contributors',
        maxZoom: 19
    },
  };
  const markers = new Map();
  const baseLayers = {};
  let map = null;
  let schoolMarker = null;
  let userMarker = null;
  let currentPosition = null;
  let locationRequestId = 0;
  let locationRetryTimer = null;
  let locationAttempt = 0;
  let activeBaseLayer = BASE_MAPS[DEFAULT_BASE_MAP]
    ? DEFAULT_BASE_MAP
    : Object.keys(BASE_MAPS)[0];

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function updateBadge(message, isError = false) {
    const badge = document.getElementById("map-engine-badge");
    if (!badge) return;
    badge.className = `text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center ${
      isError ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
    }`;
    badge.innerHTML = `<i class="fa-solid ${
      isError ? "fa-circle-exclamation" : "fa-circle-check"
    } text-xs mr-1"></i>${escapeHtml(message)}`;
  }

  function initialize() {
    const container = document.getElementById("map-container");
    if (!container) return;
    if (!window.L) {
      updateBadge("Không tải được Leaflet", true);
      console.error("Leaflet chưa được tải. Kiểm tra kết nối hoặc CDN Leaflet.");
      return;
    }

    map = window.L.map(container, {
      center: [school.lat, school.lng],
      zoom: 16,
      zoomControl: true
    });

    Object.entries(BASE_MAPS).forEach(([id, config]) => {
      baseLayers[id] = window.L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: config.maxZoom,
        ...(config.subdomains ? { subdomains: config.subdomains } : {})
      });
    });
    if (!activeBaseLayer) {
      updateBadge("Chưa cấu hình kiểu bản đồ", true);
      console.error("BASE_MAPS phải có ít nhất một kiểu nền bản đồ.");
      return;
    }
    baseLayers[activeBaseLayer].addTo(map);
    renderBaseMapButtons();

    schoolMarker = window.L.marker([school.lat, school.lng], {
      icon: window.L.divIcon({
        className: "school-marker-wrap",
        html: '<span class="custom-pin-school" aria-label="Trường UTT">🎓</span>',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      }),
      zIndexOffset: 1000
    })
      .addTo(map)
      .bindPopup(
        `<strong>${escapeHtml(school.name)}</strong><br><span>${escapeHtml(
          school.address
        )}</span>`
      );

    document.getElementById("btn-center-utt")?.addEventListener("click", recenter);
    document.getElementById("btn-locate-me")?.addEventListener("click", locateUser);
    document.getElementById("btn-select-map")?.addEventListener("click", toggleMapStyleMenu);
    document.getElementById("map-style-options")?.addEventListener("click", event => {
      const option = event.target.closest("[data-map-mode]");
      if (!option) return;
      switchMode(option.dataset.mapMode);
      closeMapStyleMenu();
    });
    document.addEventListener("click", event => {
      if (!event.target.closest("#map-style-selector")) closeMapStyleMenu();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMapStyleMenu();
    });
    updateBadge(`Leaflet · ${BASE_MAPS[activeBaseLayer].label}`);
    updateModeButtons(activeBaseLayer);
    locateUser({ automatic: true });
  }

  function renderMarkers(restaurants) {
    if (!map) return;

    markers.forEach(marker => map.removeLayer(marker));
    markers.clear();

    restaurants.forEach(restaurant => {
      if (!Number.isFinite(Number(restaurant.lat)) || !Number.isFinite(Number(restaurant.lng))) {
        return;
      }

      const marker = window.L.marker([restaurant.lat, restaurant.lng], {
        icon: window.L.divIcon({
          className: "food-marker-wrap",
          html: '<span class="custom-pin-food" aria-hidden="true"><i class="fa-solid fa-utensils"></i></span>',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        })
      })
        .addTo(map)
        .bindPopup(`
          <div class="custom-map-popup">
            <img src="${escapeHtml(restaurant.coverImage)}" alt="${escapeHtml(restaurant.name)}" loading="lazy">
            <h4>${escapeHtml(restaurant.name)}</h4>
            <div class="price">${escapeHtml(restaurant.priceRange)}</div>
            <div class="address">${escapeHtml(restaurant.address)}</div>
            <button type="button" class="popup-btn" data-map-place="${escapeHtml(restaurant.id)}">
              Xem quán trong danh sách
            </button>
          </div>
        `);

      markers.set(String(restaurant.id), marker);
    });
  }

  function recenter() {
    if (!map) return;
    map.flyTo([school.lat, school.lng], 16, { duration: 0.8 });
    schoolMarker?.openPopup();
  }

  function focusRestaurant(id) {
    const restaurant = window.FoodZoneData.INITIAL_RESTAURANTS.find(
      item => String(item.id) === String(id)
    );
    if (!map || !restaurant) return;

    map.flyTo([restaurant.lat, restaurant.lng], 17, { duration: 0.8 });
    markers.get(String(id))?.openPopup();
  }

  function setLocationButtonState(isLocating) {
    const button = document.getElementById("btn-locate-me");
    if (!button) return;

    const label = button.querySelector("span");
    if (label) label.textContent = isLocating ? "Đang định vị..." : "Vị trí tôi";
    button.setAttribute("aria-busy", String(isLocating));
  }

  function cancelLocationRequest() {
    locationRequestId += 1;
    if (locationRetryTimer !== null) {
      window.clearTimeout(locationRetryTimer);
      locationRetryTimer = null;
    }
    locationAttempt = 0;
    setLocationButtonState(false);
  }

  function requestUserLocation(requestId, automatic) {
    if (requestId !== locationRequestId) return;

    const useHighAccuracy = locationAttempt % 2 === 1;
    const timeout = Math.min(60000 + Math.floor(locationAttempt / 2) * 30000, 120000);
    locationAttempt += 1;

    navigator.geolocation.getCurrentPosition(
      position => {
        if (requestId !== locationRequestId) return;
        locationRetryTimer = null;
        locationAttempt = 0;
        setLocationButtonState(false);
        currentPosition = [position.coords.latitude, position.coords.longitude];
        if (userMarker) {
          userMarker.setLatLng(currentPosition);
        } else {
          userMarker = window.L.marker(currentPosition, {
            icon: window.L.divIcon({
              className: "user-marker-wrap",
              html: '<span class="custom-pin-user" aria-label="Vị trí của bạn">●</span>',
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            }),
            zIndexOffset: 1100
          })
            .addTo(map)
            .bindPopup("Vị trí hiện tại của bạn");
        }

        if (document.getElementById("map-container").classList.contains("hidden")) {
          switchMode(activeBaseLayer);
        }
        map.setView(currentPosition, 17, { animate: false });
        window.setTimeout(() => {
          window.FoodZoneApp.setOrigin(currentPosition);
          if (!automatic) {
            window.FoodZoneApp.showToast("Đã cập nhật vị trí và khoảng cách quán.", "success");
          }
        }, 0);
      },
      error => {
        if (requestId !== locationRequestId) return;
        console.warn("Không thể lấy vị trí GPS:", error.message);

        if (error.code === 1) {
          locationRetryTimer = null;
          locationAttempt = 0;
          setLocationButtonState(false);
          window.FoodZoneApp.showToast(
            "Trình duyệt chưa cấp quyền vị trí. Hãy cho phép Location trong cài đặt trang; website cần HTTPS hoặc localhost, sau đó thử lại.",
            "error"
          );
          return;
        }

        const retryDelay = Math.min(1500 * 2 ** Math.min(locationAttempt - 1, 4), 20000);
        setLocationButtonState(true);
        if (locationAttempt === 1) {
          window.FoodZoneApp.showToast(
            "GPS chưa phản hồi; trang sẽ tiếp tục thử lại. Hãy giữ quyền vị trí được cho phép.",
            "info"
          );
        }
        locationRetryTimer = window.setTimeout(
          () => requestUserLocation(requestId, automatic),
          retryDelay
        );
      },
      {
        enableHighAccuracy: useHighAccuracy,
        maximumAge: locationAttempt > 1 ? 120000 : 0,
        timeout
      }
    );
  }

  function locateUser({ automatic = false } = {}) {
    if (!navigator.geolocation) {
      window.FoodZoneApp.showToast("Trình duyệt không hỗ trợ định vị GPS.", "error");
      return;
    }

    cancelLocationRequest();
    const requestId = locationRequestId;
    setLocationButtonState(true);
    if (!automatic) {
      window.FoodZoneApp.showToast("Đang xác định vị trí của bạn...", "info");
    }
    requestUserLocation(requestId, automatic);
  }

  function switchMode(mode) {
    const interactive = document.getElementById("map-container");
    const google = document.getElementById("google-embed-container");
    if (!interactive || !google) return;
    if (mode !== "google" && !baseLayers[mode]) return;

    const showInteractive = mode !== "google";
    interactive.classList.toggle("hidden", !showInteractive);
    google.classList.toggle("hidden", showInteractive);
    if (showInteractive && mode !== activeBaseLayer) {
      map.removeLayer(baseLayers[activeBaseLayer]);
      baseLayers[mode].addTo(map);
      activeBaseLayer = mode;
    }

    updateModeButtons(mode);
    updateBadge(mode === "google" ? "Google Maps" : `Leaflet · ${BASE_MAPS[mode].label}`);
    if (showInteractive && map) {
      window.setTimeout(() => map.invalidateSize(), 100);
    }
  }

  function renderBaseMapButtons() {
    const container = document.getElementById("map-style-options");
    if (!container) return;

    const options = [
      ...Object.entries(BASE_MAPS).map(([id, config]) => ({
        id,
        label: config.label,
        icon: config.icon
      })),
      { id: "google", label: "Google Maps", icon: "fa-brands fa-google" }
    ];

    container.innerHTML = options.map(option => `
      <button
        type="button"
        data-map-mode="${escapeHtml(option.id)}"
        aria-pressed="${option.id === activeBaseLayer}"
        class="map-style-option">
        <i class="${escapeHtml(option.icon)}" aria-hidden="true"></i>
        <span>${escapeHtml(option.label)}</span>
        <i class="fa-solid fa-check map-style-option-check ${option.id === activeBaseLayer ? "" : "hidden"}" aria-hidden="true"></i>
      </button>
    `).join("");
    updateSelectedMapLabel(activeBaseLayer);
  }

  function updateModeButtons(mode) {
    document.querySelectorAll("[data-map-mode]").forEach(button => {
      const isActive = button.dataset.mapMode === mode;
      button.setAttribute("aria-pressed", String(isActive));
      button.querySelector(".map-style-option-check")?.classList.toggle("hidden", !isActive);
    });
    updateSelectedMapLabel(mode);
  }

  function updateSelectedMapLabel(mode) {
    const option = mode === "google"
      ? { label: "Google Maps", icon: "fa-brands fa-google" }
      : BASE_MAPS[mode];
    const icon = document.getElementById("selected-map-icon");
    const label = document.getElementById("selected-map-label");
    if (!option || !icon || !label) return;

    icon.className = `${option.icon.includes("fa-brands") ? "" : "fa-solid "}${option.icon}`;
    label.textContent = option.label;
  }

  function toggleMapStyleMenu() {
    const button = document.getElementById("btn-select-map");
    const menu = document.getElementById("map-style-options");
    if (!button || !menu) return;

    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("hidden", isOpen);
  }

  function closeMapStyleMenu() {
    document.getElementById("btn-select-map")?.setAttribute("aria-expanded", "false");
    document.getElementById("map-style-options")?.classList.add("hidden");
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-map-place]");
    if (button) {
      window.FoodZoneApp.scrollToRestaurant(button.dataset.mapPlace);
    }
  });

  window.FoodZoneMap = {
    initialize,
    renderMarkers,
    recenter,
    focusRestaurant,
    switchMode,
    getCurrentPosition: () => currentPosition
  };
})();
