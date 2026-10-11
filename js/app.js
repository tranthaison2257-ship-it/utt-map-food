(function () {
  const SHARE_URL = "https://tranthaison2257-ship-it.github.io/utt-map-food/";
  const SAVED_RESTAURANTS_KEY = "utt-foodzone-saved-restaurants";
  const HERO_COLLAPSED_KEY = "utt-foodzone-hero-collapsed";
  const RESTAURANT_SUBMISSION_URL =
    "https://script.google.com/macros/s/AKfycbzc65vJSnKpRatD6e2uRgLnFPJ6mPytZtve8QvyizasITNXzT-n2p47kVCSR07-XmK-/exec";
  const RESTAURANT_ACCESS_CODE = "SBTC";
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
  let savedRestaurantIds = new Set();
  let showSavedRestaurantsOnly = false;
  let activeOrigin = [UTT_LOCATION.lat, UTT_LOCATION.lng];
  let nfcScanController = null;
  let randomSpinTimer = null;
  let selectedRandomRestaurant = null;
  let isRestaurantFormUnlocked = false;

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
      const matchesSaved =
        !showSavedRestaurantsOnly || savedRestaurantIds.has(String(restaurant.id));

      return matchesCategory && matchesSearch && matchesPrice && matchesSaved;
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
          <p class="mt-2 text-sm text-slate-500">${
            showSavedRestaurantsOnly && savedRestaurantIds.size === 0
              ? "Bạn chưa lưu quán nào. Nhấn biểu tượng trái tim trên thẻ quán để lưu lại."
              : "Thử đổi từ khóa hoặc bộ lọc nhé."
          }</p>
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
          <button type="button" data-action="toggle-saved" data-place-id="${escapeHtml(restaurant.id)}"
            class="restaurant-save-button ${savedRestaurantIds.has(String(restaurant.id)) ? "is-saved" : ""}"
            aria-label="${savedRestaurantIds.has(String(restaurant.id)) ? "Bỏ lưu" : "Lưu"} ${escapeHtml(restaurant.name)}"
            aria-pressed="${savedRestaurantIds.has(String(restaurant.id))}"
            title="${savedRestaurantIds.has(String(restaurant.id)) ? "Bỏ lưu quán" : "Lưu quán"}">
            <i class="fa-${savedRestaurantIds.has(String(restaurant.id)) ? "solid" : "regular"} fa-heart" aria-hidden="true"></i>
          </button>
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

  function loadSavedRestaurants() {
    try {
      const savedIds = JSON.parse(localStorage.getItem(SAVED_RESTAURANTS_KEY) ?? "[]");
      if (!Array.isArray(savedIds)) {
        throw new TypeError("Danh sách quán đã lưu không hợp lệ.");
      }
      const knownRestaurantIds = new Set(restaurants.map(restaurant => String(restaurant.id)));
      savedRestaurantIds = new Set(
        savedIds
          .filter(id => typeof id === "string" || typeof id === "number")
          .map(String)
          .filter(id => knownRestaurantIds.has(id))
      );
    } catch (error) {
      console.warn("Không thể đọc danh sách quán đã lưu:", error);
      showToast("Không đọc được quán đã lưu trên trình duyệt.", "error");
      savedRestaurantIds = new Set();
    }
    updateSavedRestaurantsButton();
  }

  function updateSavedRestaurantsButton() {
    const button = document.getElementById("btn-show-saved");
    const count = document.getElementById("saved-count");
    if (button) {
      button.setAttribute("aria-pressed", String(showSavedRestaurantsOnly));
      button.classList.toggle("is-active", showSavedRestaurantsOnly);
      const icon = button.querySelector("i");
      if (icon) icon.className = `fa-${showSavedRestaurantsOnly ? "solid" : "regular"} fa-heart`;
    }
    if (count) count.textContent = String(savedRestaurantIds.size);
  }

  function toggleSavedRestaurant(id) {
    const restaurant = restaurants.find(item => String(item.id) === String(id));
    if (!restaurant) return;

    const nextSavedIds = new Set(savedRestaurantIds);
    if (nextSavedIds.has(String(id))) {
      nextSavedIds.delete(String(id));
    } else {
      nextSavedIds.add(String(id));
    }

    try {
      localStorage.setItem(SAVED_RESTAURANTS_KEY, JSON.stringify([...nextSavedIds]));
    } catch (error) {
      console.error("Không thể lưu danh sách quán vào trình duyệt:", error);
      showToast("Không lưu được quán. Hãy kiểm tra dung lượng hoặc quyền lưu trữ.", "error");
      return;
    }

    savedRestaurantIds = nextSavedIds;
    updateSavedRestaurantsButton();
    showToast(
      savedRestaurantIds.has(String(id))
        ? `Đã lưu ${restaurant.name}.`
        : `Đã bỏ lưu ${restaurant.name}.`
    );
    applyFiltersAndRender();
  }

  function openRandomDialog() {
    const modal = document.getElementById("random-modal");
    if (!modal) return;

    closeRandomDialog();
    selectedRandomRestaurant = null;
    document.getElementById("random-emoji").textContent = "🍜";
    document.getElementById("random-name").textContent = "Sẵn sàng chưa?";
    document.getElementById("random-category").textContent = "Nhấn nút bên dưới để bắt đầu.";
    document.getElementById("random-price").textContent = "";
    document.getElementById("random-address").textContent = "";
    document.getElementById("random-status").textContent = "";
    document.getElementById("btn-random-show-map").classList.add("hidden");
    document.getElementById("btn-random-show-card").classList.add("hidden");
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("btn-spin-random").focus();
  }

  function closeRandomDialog() {
    if (randomSpinTimer !== null) {
      window.clearInterval(randomSpinTimer);
      randomSpinTimer = null;
    }
    const button = document.getElementById("btn-spin-random");
    if (button) button.disabled = false;
    const modal = document.getElementById("random-modal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  function pickRandomRestaurant() {
    const choices = getFilteredRestaurants();
    if (choices.length === 0) {
      selectedRandomRestaurant = null;
      document.getElementById("random-emoji").textContent = "🍜";
      document.getElementById("random-name").textContent = "Chưa có quán phù hợp";
      document.getElementById("random-category").textContent =
        "Hãy đổi bộ lọc hoặc tắt chế độ chỉ xem quán đã lưu rồi thử lại.";
      document.getElementById("random-price").textContent = "";
      document.getElementById("random-address").textContent = "";
      document.getElementById("random-status").textContent = "Không tìm thấy quán để quay.";
      document.getElementById("btn-random-show-map").classList.add("hidden");
      document.getElementById("btn-random-show-card").classList.add("hidden");
      return;
    }

    const result = document.getElementById("random-result");
    const name = document.getElementById("random-name");
    const category = document.getElementById("random-category");
    const price = document.getElementById("random-price");
    const address = document.getElementById("random-address");
    const emoji = document.getElementById("random-emoji");
    const spinButton = document.getElementById("btn-spin-random");
    const chosen = choices[Math.floor(Math.random() * choices.length)];
    const spinCount = 18;
    let spin = 0;

    if (randomSpinTimer !== null) window.clearInterval(randomSpinTimer);
    selectedRandomRestaurant = null;
    spinButton.disabled = true;
    document.getElementById("random-status").textContent = "Đang chọn quán...";
    emoji.textContent = "🍜";
    document.getElementById("btn-random-show-map").classList.add("hidden");
    document.getElementById("btn-random-show-card").classList.add("hidden");
    result.classList.remove("random-pop");

    randomSpinTimer = window.setInterval(() => {
      const preview = choices[Math.floor(Math.random() * choices.length)];
      name.textContent = preview.name;
      category.textContent = preview.categoryLabel;
      price.textContent = preview.priceRange;
      address.textContent = preview.address;
      spin += 1;

      if (spin < spinCount) return;

      window.clearInterval(randomSpinTimer);
      randomSpinTimer = null;
      selectedRandomRestaurant = chosen;
      name.textContent = chosen.name;
      category.textContent = chosen.categoryLabel;
      price.textContent = chosen.priceRange;
      address.textContent = chosen.address;
      emoji.textContent = "😋";
      document.getElementById("random-status").textContent = "Kèo hôm nay đây rồi!";
      document.getElementById("btn-random-show-map").classList.remove("hidden");
      document.getElementById("btn-random-show-card").classList.remove("hidden");
      spinButton.disabled = false;
      result.classList.add("random-pop");
    }, 90);
  }

  function handleRandomDialogAction(event) {
    if (!selectedRandomRestaurant) return;
    const action = event.currentTarget.dataset.action;
    const id = selectedRandomRestaurant.id;
    closeRandomDialog();

    if (action === "show-map") {
      window.FoodZoneMap.switchMode("osm");
      window.FoodZoneMap.focusRestaurant(id);
      document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (action === "show-card") {
      scrollToRestaurant(id);
    }
  }

  function normalizeText(value) {
    return String(value ?? "")
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  }

  function findChatCategory(message) {
    if (/\b(com|com ga|com rang)\b/.test(message)) return "com";
    if (/\b(bun|pho|bun pho|bun cha)\b/.test(message)) return "bun-pho";
    if (/\b(an vat|xi(en|e)n|lau|nuong)\b/.test(message)) return "an-vat";
    if (/\b(tra sua|tra chanh|cafe|ca phe|do uong)\b/.test(message)) return "tra-sua";
    return null;
  }

  function getChatResponse(input) {
    const message = normalizeText(input);
    if (/\b(xin chao|chao ban|hello|hi)\b/.test(message)) {
      return "Chào bạn! Mình có thể gợi ý quán ăn quanh UTT dựa trên danh sách đang có. Bạn muốn ăn món gì?";
    }
    if (/\b(random|hom nay an gi|an gi)\b/.test(message)) {
      openRandomDialog();
      return "Mình đã mở vòng quay chọn quán cho bạn. Nhấn “Quay ngẫu nhiên” nhé!";
    }
    if (/\b(cam on|thanks|thank)\b/.test(message)) {
      return "Không có gì! Chúc bạn tìm được món ngon nhé.";
    }

    const category = findChatCategory(message);
    let matches = restaurants.filter(restaurant => {
      if (category) return restaurant.category === category;
      if (/\b(re|gia|sinh vien|duoi|tiet kiem)\b/.test(message)) {
        return restaurant.maxPrice <= 40000;
      }
      const searchableText = normalizeText([
        restaurant.name,
        restaurant.categoryLabel,
        restaurant.address,
        ...restaurant.signatureDishes
      ].join(" "));
      return searchableText.includes(message);
    });

    if (!category && matches.length === 0 && /\b(quan|gan|ut|truong|mon|an|uong)\b/.test(message)) {
      matches = [...restaurants];
    }
    if (matches.length === 0) {
      return "Mình chưa tìm thấy quán phù hợp trong dữ liệu hiện có. Bạn thử hỏi về cơm, bún-phở, ăn vặt, trà sữa hoặc cà phê nhé.";
    }

    matches = matches
      .map(restaurant => ({
        ...restaurant,
        distance: calculateDistance(activeOrigin, [Number(restaurant.lat), Number(restaurant.lng)])
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    const suggestions = matches.map(restaurant =>
      `• ${restaurant.name} — ${restaurant.priceRange}, ${formatDistance(restaurant.distance)}.`
    ).join("\n");
    return `${category ? "Các quán theo danh mục bạn hỏi" : "Một vài gợi ý trong dữ liệu hiện có"}:\n${suggestions}\nThông tin trên website có thể cần được xác minh/cập nhật thêm.`;
  }

  function appendChatMessage(sender, message) {
    const container = document.getElementById("chat-messages");
    if (!container) return;

    const row = document.createElement("div");
    row.className = `chat-message-row ${sender === "user" ? "is-user" : "is-assistant"}`;
    const bubble = document.createElement("p");
    bubble.className = "chat-message-bubble";
    bubble.textContent = message;
    row.append(bubble);
    container.append(row);
    container.scrollTop = container.scrollHeight;
  }

  function sendChatMessage(message = document.getElementById("chat-input")?.value ?? "") {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    appendChatMessage("user", trimmedMessage);
    const input = document.getElementById("chat-input");
    if (input) input.value = "";
    window.setTimeout(() => appendChatMessage("assistant", getChatResponse(trimmedMessage)), 300);
  }

  function toggleChat(forceOpen) {
    const chat = document.getElementById("chat-window");
    const button = document.getElementById("chat-toggle");
    if (!chat || !button) return;

    const shouldOpen = forceOpen ?? chat.classList.contains("hidden");
    chat.classList.toggle("hidden", !shouldOpen);
    button.setAttribute("aria-expanded", String(shouldOpen));
    button.setAttribute("aria-label", shouldOpen ? "Đóng trợ lý UTT FoodZone" : "Mở trợ lý UTT FoodZone");
    if (shouldOpen) document.getElementById("chat-input")?.focus();
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
    showSavedRestaurantsOnly = false;
    document.getElementById("search-input").value = "";
    document.getElementById("price-filter").value = "all";
    document.getElementById("sort-filter").value = "distance-asc";
    updateSavedRestaurantsButton();
    renderCategoryPills();
    applyFiltersAndRender();
  }

  function setHeroCollapsed(isCollapsed) {
    const section = document.getElementById("hero-banner");
    const button = document.getElementById("btn-toggle-hero");
    const icon = button?.querySelector("i");
    if (!section || !button || !icon) return;

    section.classList.toggle("is-collapsed", isCollapsed);
    const label = isCollapsed ? "Hiện phần giới thiệu" : "Thu gọn phần giới thiệu";
    button.setAttribute("aria-expanded", String(!isCollapsed));
    button.setAttribute("aria-label", label);
    button.title = label;
    icon.className = `fa-solid fa-chevron-${isCollapsed ? "down" : "up"}`;
  }

  function loadHeroPreference() {
    try {
      const savedState = localStorage.getItem(HERO_COLLAPSED_KEY);
      if (savedState === "true" || savedState === "false") {
        setHeroCollapsed(savedState === "true");
      } else if (savedState !== null) {
        console.warn("Trạng thái thu gọn phần giới thiệu không hợp lệ:", savedState);
      }
    } catch (error) {
      console.warn("Không thể đọc trạng thái phần giới thiệu từ localStorage:", error);
      showToast("Không thể khôi phục trạng thái phần giới thiệu đã lưu.", "error");
    }
  }

  function toggleHero() {
    const section = document.getElementById("hero-banner");
    if (!section) return;

    const shouldCollapse = !section.classList.contains("is-collapsed");
    try {
      localStorage.setItem(HERO_COLLAPSED_KEY, String(shouldCollapse));
    } catch (error) {
      console.error("Không thể lưu trạng thái phần giới thiệu:", error);
      showToast("Không lưu được trạng thái thu gọn vào trình duyệt.", "error");
      return;
    }
    setHeroCollapsed(shouldCollapse);
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

  function setRestaurantFormStatus(message, type = "") {
    const status = document.getElementById("add-restaurant-status");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", type === "error");
    status.classList.toggle("is-success", type === "success");
    status.classList.toggle("is-warning", type === "warning");
  }

  function resetRestaurantFormGate() {
    isRestaurantFormUnlocked = false;
    document.getElementById("admin-code-form")?.reset();
    document.getElementById("admin-code-form")?.classList.remove("hidden");
    document.getElementById("add-restaurant-form")?.reset();
    document.getElementById("add-restaurant-form")?.classList.add("hidden");
    const fieldset = document.getElementById("add-restaurant-fields");
    if (fieldset) fieldset.disabled = true;
    setRestaurantFormStatus("");
    const adminStatus = document.getElementById("restaurant-admin-status");
    if (adminStatus) {
      adminStatus.textContent = "";
      adminStatus.classList.remove("is-error", "is-success");
    }
  }

  function openAddRestaurantDialog() {
    const modal = document.getElementById("add-restaurant-modal");
    if (!modal) return;
    resetRestaurantFormGate();
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("restaurant-admin-code")?.focus();
  }

  function closeAddRestaurantDialog() {
    const modal = document.getElementById("add-restaurant-modal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    resetRestaurantFormGate();
  }

  function unlockRestaurantForm(event) {
    event.preventDefault();
    const codeInput = document.getElementById("restaurant-admin-code");
    const status = document.getElementById("restaurant-admin-status");
    if (!codeInput || !status) return;

    if (codeInput.value !== RESTAURANT_ACCESS_CODE) {
      status.textContent = "Mã truy cập không đúng.";
      status.classList.add("is-error");
      status.classList.remove("is-success");
      codeInput.select();
      return;
    }

    isRestaurantFormUnlocked = true;
    codeInput.value = "";
    status.textContent = "";
    document.getElementById("admin-code-form").classList.add("hidden");
    document.getElementById("add-restaurant-fields").disabled = false;
    document.getElementById("add-restaurant-form").classList.remove("hidden");
    document.querySelector("#add-restaurant-fields input")?.focus();
  }

  async function submitRestaurantSuggestion(event) {
    event.preventDefault();
    if (!isRestaurantFormUnlocked) {
      setRestaurantFormStatus("Hãy xác nhận mã truy cập trước khi nhập thông tin.", "error");
      return;
    }

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const minPrice = Number(formData.get("minPrice"));
    const maxPrice = Number(formData.get("maxPrice"));
    const mapUrl = String(formData.get("mapUrl")).trim();
    if (minPrice > maxPrice) {
      setRestaurantFormStatus("Giá nhỏ nhất không được lớn hơn giá lớn nhất.", "error");
      return;
    }

    const submitButton = document.getElementById("btn-submit-add-restaurant");
    if (!submitButton) return;
    submitButton.disabled = true;
    setRestaurantFormStatus("Đang gửi thông tin để chờ quản trị viên duyệt...");

    const postData = {
      name: String(formData.get("name")).trim(),
      category: String(formData.get("category")).trim(),
      categoryLabel: String(formData.get("categoryLabel")).trim(),
      priceRange: String(formData.get("priceRange")).trim(),
      minPrice,
      maxPrice,
      address: String(formData.get("address")).trim(),
      phone: String(formData.get("phone")).trim(),
      mapUrl,
      coverImage: "",
      signatureDishes: String(formData.get("signatureDishes")).trim(),
      distanceText: "",
      openHours: ""
    };

    try {
      const response = await fetch(RESTAURANT_SUBMISSION_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(postData)
      });
      if (!response.ok) {
        throw new Error(`Máy chủ phản hồi HTTP ${response.status}.`);
      }

      const result = await response.json();
      if (result.status === "error") {
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : "Google Apps Script báo không thể xử lý đề xuất."
        );
      }
      if (result.status !== "success") {
        throw new Error("Hệ thống chưa xác nhận đã nhận đề xuất.");
      }

      const extractedLat = Number(result.extractedLat);
      const extractedLng = Number(result.extractedLng);
      const coordinatesFound = Number.isFinite(extractedLat) &&
        Number.isFinite(extractedLng) && extractedLat !== 0;

      form.reset();
      if (coordinatesFound) {
        setRestaurantFormStatus(
          `Đã gửi đề xuất thành công và trích xuất tọa độ: Lat ${extractedLat}, Lng ${extractedLng}. Quán sẽ xuất hiện sau khi quản trị viên kiểm tra.`,
          "success"
        );
      } else {
        setRestaurantFormStatus(
          "Đã gửi đề xuất nhưng không trích xuất được tọa độ từ link Google Maps. Quản trị viên cần bổ sung tọa độ trước khi đăng quán.",
          "warning"
        );
      }
    } catch (error) {
      console.error("Không thể gửi đề xuất quán:", error);
      setRestaurantFormStatus(
        `Gửi chưa thành công: ${error instanceof Error ? error.message : "Lỗi không xác định."}`,
        "error"
      );
    } finally {
      submitButton.disabled = false;
    }
  }

  function initialize() {
    loadHeroPreference();
    window.FoodZoneMap.initialize();
    loadSavedRestaurants();
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
      } else if (button.dataset.action === "toggle-saved") {
        toggleSavedRestaurant(button.dataset.placeId);
      }
    });
    document.getElementById("btn-show-saved")?.addEventListener("click", () => {
      showSavedRestaurantsOnly = !showSavedRestaurantsOnly;
      updateSavedRestaurantsButton();
      applyFiltersAndRender();
    });
    document.getElementById("btn-random-restaurant")?.addEventListener("click", openRandomDialog);
    document.getElementById("btn-close-random")?.addEventListener("click", closeRandomDialog);
    document.getElementById("random-modal")?.addEventListener("click", event => {
      if (event.target.id === "random-modal") closeRandomDialog();
    });
    document.getElementById("btn-spin-random")?.addEventListener("click", pickRandomRestaurant);
    document.getElementById("btn-random-show-map")?.addEventListener("click", handleRandomDialogAction);
    document.getElementById("btn-random-show-card")?.addEventListener("click", handleRandomDialogAction);
    document.getElementById("btn-toggle-hero")?.addEventListener("click", toggleHero);
    document.getElementById("btn-share-link")?.addEventListener("click", openShareDialog);
    document.getElementById("btn-close-share")?.addEventListener("click", closeShareDialog);
    document.getElementById("share-modal")?.addEventListener("click", event => {
      if (event.target.id === "share-modal") closeShareDialog();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeShareDialog();
        closeRandomDialog();
        closeAddRestaurantDialog();
        toggleChat(false);
      }
    });
    document.getElementById("chat-toggle")?.addEventListener("click", () => toggleChat());
    document.getElementById("btn-close-chat")?.addEventListener("click", () => toggleChat(false));
    document.getElementById("chat-form")?.addEventListener("submit", event => {
      event.preventDefault();
      sendChatMessage();
    });
    document.querySelector(".chat-shortcuts")?.addEventListener("click", event => {
      const prompt = event.target.closest("[data-chat-prompt]");
      if (prompt) sendChatMessage(prompt.dataset.chatPrompt);
    });
    document.getElementById("btn-open-add-restaurant")?.addEventListener("click", openAddRestaurantDialog);
    document.getElementById("btn-close-add-restaurant")?.addEventListener("click", closeAddRestaurantDialog);
    document.getElementById("add-restaurant-modal")?.addEventListener("click", event => {
      if (event.target.id === "add-restaurant-modal") closeAddRestaurantDialog();
    });
    document.getElementById("admin-code-form")?.addEventListener("submit", unlockRestaurantForm);
    document.getElementById("add-restaurant-form")?.addEventListener("submit", submitRestaurantSuggestion);
    appendChatMessage(
      "assistant",
      "Xin chào! Mình là trợ lý UTT FoodZone. Mình có thể gợi ý quán từ dữ liệu hiện có quanh trường."
    );
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
