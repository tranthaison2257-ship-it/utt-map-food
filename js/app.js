(function () {
  const SHARE_URL = "https://tranthaison2257-ship-it.github.io/utt-map-food/";
  const { INITIAL_RESTAURANTS, UTT_LOCATION } = window.FoodZoneData;
  const NFC_URI_PREFIXES = [
    "", "http://www.", "https://www.", "http://", "https://", "tel:",
    "mailto:", "ftp://anonymous:anonymous@", "ftp://ftp.", "ftps://",
    "sftp://", "smb://", "nfs://", "ftp://", "dav://", "news:",
    "telnet://", "imap:", "rtsp://", "urn:", "pop:", "sip:", "sips:",
    "tftp:", "btspp://", "btl2cap://", "btgoep://", "tcpobex://",
    "irdaobex://", "file://", "urn:epc:id:", "urn:epc:tag:",
    "urn:epc:pat:", "urn:epc:raw:", "urn:epc:", "urn:nfc:"
  ];
  const categories = [
    { id: "all", name: "Tất cả món", icon: "fa-solid fa-utensils" },
    { id: "com", name: "Cơm & Món chính", icon: "fa-solid fa-bowl-rice" },
    { id: "bun-pho", name: "Bún - Phở", icon: "fa-solid fa-bowl-food" },
    { id: "an-vat", name: "Ăn vặt & Lẩu nướng", icon: "fa-solid fa-hotdog" },
    { id: "tra-sua", name: "Trà sữa & Cafe", icon: "fa-solid fa-mug-hot" }
  ];

  let restaurants = INITIAL_RESTAURANTS.map(restaurant => ({ ...restaurant }));
  let activeCategory = "all";
  let searchQuery = "";
  let activeOrigin = [UTT_LOCATION.lat, UTT_LOCATION.lng];
  let nfcScanController = null;

  function getNfcUrl(message) {
    for (const record of message.records) {
      if (record.recordType !== "url" || !record.data) continue;

      const payload = new Uint8Array(
        record.data.buffer,
        record.data.byteOffset,
        record.data.byteLength
      );
      if (payload.length === 0) continue;

      const decodedUrl =
        (NFC_URI_PREFIXES[payload[0]] ?? "") + new TextDecoder().decode(payload.subarray(1));
      try {
        const url = new URL(decodedUrl);
        if (url.protocol === "https:" || url.protocol === "http:") return url.href;
      } catch (error) {
        console.warn("Thẻ NFC chứa liên kết không hợp lệ:", error);
      }
    }

    return null;
  }

  function stopNfcScan() {
    nfcScanController?.abort();
    nfcScanController = null;
    const button = document.getElementById("btn-read-nfc");
    if (button) {
      button.disabled = false;
      button.innerHTML = '<i class="fa-solid fa-mobile-screen-button"></i> Quét thẻ NFC';
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function calculateDistance(pointA, pointB) {
    const toRadians = degrees => degrees * (Math.PI / 180);
    const latitudeDelta = toRadians(pointB[0] - pointA[0]);
    const longitudeDelta = toRadians(pointB[1] - pointA[1]);
    const value =
      Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(toRadians(pointA[0])) *
        Math.cos(toRadians(pointB[0])) *
        Math.sin(longitudeDelta / 2) ** 2;

    return 6371000 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  }

  function formatDistance(distance) {
    return distance < 1000
      ? `${Math.round(distance)}m từ bạn`
      : `${(distance / 1000).toFixed(1)}km từ bạn`;
  }

  function showToast(message, type = "success") {
    const toast = document.getElementById("toast-notification");
    const messageElement = document.getElementById("toast-message");
    if (!toast || !messageElement) return;

    messageElement.textContent = message;
    const icon = toast.querySelector("i");
    if (icon) {
      icon.className = `fa-solid ${
        type === "error" ? "fa-circle-exclamation text-red-400" :
          type === "info" ? "fa-circle-info text-blue-400" :
            "fa-circle-check text-emerald-400"
      } text-lg`;
    }
    toast.classList.remove("hidden");
    toast.classList.add("show");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hidden");
    }, 3200);
  }

  function renderCategoryPills() {
    const container = document.getElementById("category-pills");
    if (!container) return;

    container.innerHTML = categories.map(category => `
      <button
        type="button"
        class="cat-pill whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border border-slate-200 transition-all flex items-center gap-2 ${
          activeCategory === category.id
            ? "active bg-orange-500 text-white"
            : "bg-white text-slate-700 hover:border-orange-300"
        }"
        data-category="${escapeHtml(category.id)}"
        aria-pressed="${activeCategory === category.id}">
        <i class="${escapeHtml(category.icon)}" aria-hidden="true"></i>
        <span>${escapeHtml(category.name)}</span>
      </button>
    `).join("");
  }

  function getFilteredRestaurants() {
    const query = searchQuery.trim().toLocaleLowerCase("vi");
    const priceFilter = document.getElementById("price-filter")?.value ?? "all";
    const sortFilter = document.getElementById("sort-filter")?.value ?? "distance-asc";

    let filtered = restaurants.filter(restaurant => {
      const matchesCategory =
        activeCategory === "all" || restaurant.category === activeCategory;
      const searchableText = [
        restaurant.name,
        restaurant.address,
        restaurant.categoryLabel,
        ...restaurant.signatureDishes
      ].join(" ").toLocaleLowerCase("vi");
      const matchesSearch = !query || searchableText.includes(query);
      const matchesPrice =
        priceFilter === "under-25" ? restaurant.minPrice < 25000 :
          priceFilter === "25-40" ? restaurant.minPrice >= 25000 && restaurant.minPrice <= 40000 :
            priceFilter === "above-40" ? restaurant.maxPrice > 40000 :
              true;

      return matchesCategory && matchesSearch && matchesPrice;
    });

    filtered = filtered.map(restaurant => ({
      ...restaurant,
      distance: calculateDistance(
        activeOrigin,
        [Number(restaurant.lat), Number(restaurant.lng)]
      )
    }));

    if (sortFilter === "rating-desc") {
      filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortFilter === "price-asc") {
      filtered.sort((a, b) => a.minPrice - b.minPrice);
    } else {
      filtered.sort((a, b) => a.distance - b.distance);
    }

    return filtered;
  }

  function renderRestaurantCards(list) {
    const grid = document.getElementById("restaurant-grid");
    const countLabel = document.getElementById("result-count");
    if (!grid) return;

    if (countLabel) {
      countLabel.textContent = `Tìm thấy ${list.length} quán ăn gần trường UTT Vĩnh Phúc`;
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <i class="fa-solid fa-face-frown-open text-5xl text-orange-400 mb-3"></i>
          <h3 class="text-xl font-bold text-slate-800">Không tìm thấy quán ăn phù hợp</h3>
          <p class="mt-2 text-sm text-slate-500">Thử đổi từ khóa hoặc bộ lọc nhé.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(restaurant => `
      <article class="food-card bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col"
        id="restaurant-${escapeHtml(restaurant.id)}">
        <div class="relative h-48 min-h-[12rem] overflow-hidden group">
          <img src="${escapeHtml(restaurant.coverImage)}" alt="${escapeHtml(restaurant.name)}"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy">
          <div class="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
            <i class="fa-solid fa-location-dot text-orange-500"></i> ${escapeHtml(formatDistance(restaurant.distance))}
          </div>
          <div class="absolute top-3 right-3 bg-orange-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            ${escapeHtml(restaurant.categoryLabel)}
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-base md:text-lg text-slate-900 leading-snug line-clamp-2"
              title="${escapeHtml(restaurant.name)}">${escapeHtml(restaurant.name)}</h3>
            <p class="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5 line-clamp-1">
              <i class="fa-solid fa-map-pin text-slate-400 flex-shrink-0"></i>
              ${escapeHtml(restaurant.address)}
            </p>
            <div class="mt-3.5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span class="text-xs text-slate-400 block">Khoảng giá</span>
                <span class="text-sm font-extrabold text-orange-600">${escapeHtml(restaurant.priceRange)}</span>
              </div>
              <div class="text-right">
                <span class="text-xs text-slate-400 block">Món nổi bật</span>
                <span class="text-xs font-semibold text-slate-700">${escapeHtml(restaurant.signatureDishes[0])}</span>
              </div>
            </div>
          </div>

          <div class="mt-5 pt-3 grid grid-cols-2 gap-2">
            <button type="button" data-action="show-on-map" data-place-id="${escapeHtml(restaurant.id)}"
              class="py-2.5 px-3 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 font-semibold text-xs hover:bg-orange-100 transition-colors flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-map-pin"></i> Xem trên bản đồ
            </button>
            <button type="button" data-action="directions" data-place-id="${escapeHtml(restaurant.id)}"
              class="py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5">
              <i class="fa-brands fa-google"></i> Chỉ đường
            </button>
          </div>
        </div>
      </article>
    `).join("");
  }

  function applyFiltersAndRender() {
    const filtered = getFilteredRestaurants();
    renderRestaurantCards(filtered);
    window.FoodZoneMap.renderMarkers(filtered);
  }

  function openDirections(id) {
    const restaurant = restaurants.find(item => String(item.id) === String(id));
    if (!restaurant) return;

    const origin = window.FoodZoneMap.getCurrentPosition() ??
      [UTT_LOCATION.lat, UTT_LOCATION.lng];
    const url = new URL("https://www.google.com/maps/dir/");
    url.searchParams.set("api", "1");
    url.searchParams.set("origin", `${origin[0]},${origin[1]}`);
    url.searchParams.set("destination", `${restaurant.lat},${restaurant.lng}`);
    url.searchParams.set("travelmode", "walking");
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  function scrollToRestaurant(id) {
    const card = document.getElementById(`restaurant-${id}`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.add("food-card-highlight");
      window.setTimeout(() => card.classList.remove("food-card-highlight"), 1800);
    } else {
      showToast("Quán này đang bị ẩn bởi bộ lọc. Hãy đổi bộ lọc để xem.", "info");
    }
  }

  function resetFilters() {
    activeCategory = "all";
    searchQuery = "";
    document.getElementById("search-input").value = "";
    document.getElementById("price-filter").value = "all";
    document.getElementById("sort-filter").value = "distance-asc";
    renderCategoryPills();
    applyFiltersAndRender();
  }

  function openShareDialog() {
    const modal = document.getElementById("share-modal");
    const urlInput = document.getElementById("share-url");
    const qrContainer = document.getElementById("share-qr");
    const qrStatus = document.getElementById("share-qr-status");
    const nativeShareButton = document.getElementById("btn-native-share");
    const nfcButton = document.getElementById("btn-write-nfc");
    const nfcReadButton = document.getElementById("btn-read-nfc");
    const url = SHARE_URL;

    if (!modal || !urlInput || !qrContainer || !qrStatus) return;

    urlInput.value = url;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    nativeShareButton?.classList.toggle("hidden", typeof navigator.share !== "function");
    const supportsWebNfc =
      window.isSecureContext && typeof window.NDEFReader === "function";
    nfcButton?.classList.toggle("hidden", !supportsWebNfc);
    nfcReadButton?.classList.toggle("hidden", !supportsWebNfc);
    document.getElementById("nfc-scan-status").textContent = "";
    document.getElementById("nfc-scan-link").classList.add("hidden");
    qrContainer.replaceChildren();

    if (typeof window.QRCode !== "function") {
      qrStatus.textContent = "Không tải được thư viện QR. Bạn vẫn có thể sao chép hoặc chia sẻ link.";
      console.error("Không thể tạo QR vì thư viện QRCode chưa được tải.");
      return;
    }

    try {
      new window.QRCode(qrContainer, {
        text: url,
        width: 208,
        height: 208,
        colorDark: "#0f172a",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.M
      });
      const isLocalUrl = window.location.protocol === "file:" ||
        ["localhost", "127.0.0.1"].includes(window.location.hostname);
      qrStatus.textContent = isLocalUrl
        ? "Đây là Mã QR."
        : "Mở camera điện thoại và quét mã để truy cập website.";
    } catch (error) {
      console.error("Không thể tạo mã QR:", error);
      qrStatus.textContent = "Không tạo được mã QR. Hãy dùng nút sao chép liên kết.";
    }
  }

  function closeShareDialog() {
    const modal = document.getElementById("share-modal");
    if (!modal) return;
    stopNfcScan();
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  function initialize() {
    window.FoodZoneMap.initialize();
    renderCategoryPills();
    applyFiltersAndRender();

    document.getElementById("search-input")?.addEventListener("input", event => {
      searchQuery = event.target.value;
      applyFiltersAndRender();
    });
    document.getElementById("price-filter")?.addEventListener("change", applyFiltersAndRender);
    document.getElementById("sort-filter")?.addEventListener("change", applyFiltersAndRender);
    document.getElementById("category-pills")?.addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      activeCategory = button.dataset.category;
      renderCategoryPills();
      applyFiltersAndRender();
    });
    document.getElementById("restaurant-grid")?.addEventListener("click", event => {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      if (button.dataset.action === "show-on-map") {
        window.FoodZoneMap.switchMode("osm");
        window.FoodZoneMap.focusRestaurant(button.dataset.placeId);
      } else if (button.dataset.action === "directions") {
        openDirections(button.dataset.placeId);
      }
    });
    document.getElementById("btn-share-link")?.addEventListener("click", openShareDialog);
    document.getElementById("btn-close-share")?.addEventListener("click", closeShareDialog);
    document.getElementById("share-modal")?.addEventListener("click", event => {
      if (event.target.id === "share-modal") closeShareDialog();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeShareDialog();
    });
    document.getElementById("btn-copy-share-link")?.addEventListener("click", async () => {
      const url = document.getElementById("share-url")?.value;
      if (!url) return;

      try {
        await navigator.clipboard.writeText(url);
        showToast("Đã sao chép liên kết để gửi cho bạn bè.");
      } catch (error) {
        console.warn("Không thể sao chép liên kết:", error);
        document.getElementById("share-url")?.select();
        showToast("Không thể tự sao chép. Hãy sao chép liên kết đang được chọn.", "info");
      }
    });
    document.getElementById("btn-native-share")?.addEventListener("click", async () => {
      if (typeof navigator.share !== "function") return;
      try {
        await navigator.share({
          title: document.title,
          text: "Xem các quán ăn quanh UTT Vĩnh Phúc",
          url: SHARE_URL
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Không thể mở bảng chia sẻ của thiết bị:", error);
          showToast("Thiết bị không thể mở chức năng chia sẻ.", "error");
        }
      }
    });
    document.getElementById("btn-write-nfc")?.addEventListener("click", async () => {
      if (!window.isSecureContext || typeof window.NDEFReader !== "function") {
        showToast("Thiết bị hoặc trình duyệt này không hỗ trợ ghi NFC từ web.", "error");
        return;
      }

      try {
        const writer = new window.NDEFReader();
        await writer.write({
          records: [{ recordType: "url", data: SHARE_URL }]
        });
        showToast("Đã ghi liên kết vào thẻ NFC. Chạm thẻ bằng điện thoại khác để mở.");
      } catch (error) {
        console.error("Không thể ghi thẻ NFC:", error);
        showToast("Không ghi được NFC. Hãy kiểm tra NFC, quyền trình duyệt và thẻ trống.", "error");
      }
    });
    document.getElementById("btn-read-nfc")?.addEventListener("click", async event => {
      if (!window.isSecureContext || typeof window.NDEFReader !== "function") {
        showToast("Thiết bị hoặc trình duyệt này không hỗ trợ quét NFC từ web.", "error");
        return;
      }

      stopNfcScan();
      const controller = new AbortController();
      nfcScanController = controller;
      const button = event.currentTarget;
      const status = document.getElementById("nfc-scan-status");
      const link = document.getElementById("nfc-scan-link");
      link.classList.add("hidden");
      status.textContent = "Đang chờ thẻ NFC. Hãy đưa thẻ lại gần mặt lưng điện thoại.";
      button.disabled = true;
      button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang quét...';

      try {
        const reader = new window.NDEFReader();
        reader.onreading = readingEvent => {
          const scannedUrl = getNfcUrl(readingEvent.message);
          if (!scannedUrl) {
            status.textContent = "Thẻ này không chứa liên kết HTTP hoặc HTTPS. Hãy thử thẻ khác.";
            return;
          }

          link.href = scannedUrl;
          link.classList.remove("hidden");
          status.textContent = "Đã đọc được liên kết từ thẻ NFC.";
          stopNfcScan();
        };
        reader.onreadingerror = () => {
          status.textContent = "Không đọc được thẻ NFC. Hãy giữ thẻ gần điện thoại và thử lại.";
        };
        await reader.scan({ signal: controller.signal });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Không thể bắt đầu quét thẻ NFC:", error);
          status.textContent = "Không thể quét NFC. Hãy kiểm tra NFC, quyền trình duyệt và thử lại.";
          showToast("Không thể bắt đầu quét NFC trên thiết bị này.", "error");
        }
        stopNfcScan();
      }
    });
    document.querySelector("[data-action='reset-filters']")?.addEventListener("click", resetFilters);
  }

  window.FoodZoneApp = {
    initialize,
    showToast,
    setOrigin(origin) {
      activeOrigin = origin;
      applyFiltersAndRender();
    },
    scrollToRestaurant
  };
})();

document.addEventListener("DOMContentLoaded", () => window.FoodZoneApp.initialize());
