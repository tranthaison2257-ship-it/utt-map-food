/**
 * ==============================================================================
 * UTT FOODZONE - WEB APP ĐÁNH GIÁ QUÁN ĂN SINH VIÊN UTT VĨNH PHÚC
 * Tác giả: Full-stack Web Developer & UI/UX Designer
 * Phiên bản: 2.1 (Tích hợp Esri World Street Map chính thức)
 * ==============================================================================
 */

// Tọa độ trung tâm: Cơ sở Trường Đại học Công nghệ Giao thông Vận tải (UTT) Vĩnh Phúc
// Địa chỉ: Phường Đồng Tâm, TP. Vĩnh Yên, Tỉnh Vĩnh Phúc
const UTT_LOCATION = {
  lat: 21.31254,
  lng: 105.58912,
  name: "ĐH Công nghệ GTVT (Cơ sở Vĩnh Phúc)",
  address: "Phường Đồng Tâm, TP. Vĩnh Yên, Tỉnh Vĩnh Phúc"
};

// 1. MOCK DATA: DANH SÁCH CÁC QUÁN ĂN XUNG QUANH UTT VĨNH PHÚC
const INITIAL_RESTAURANTS = [
  {
    id: 1,
    name: "Cơm Gà Xối Mỡ & Cơm Rang Dưa Bò Cô Ba",
    category: "com",
    categoryLabel: "Cơm sinh viên",
    priceRange: "25.000đ - 35.000đ",
    minPrice: 25000,
    maxPrice: 35000,
    distanceText: "150m từ cổng UTT",
    distanceMeters: 150,
    address: "Số 18 Ngõ 2 Phố Lam Sơn, P. Đồng Tâm, TP. Vĩnh Yên",
    phone: "0982 345 678",
    openHours: "09:30 - 21:00",
    lat: 21.31340,
    lng: 105.58990,
    coverImage: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80"
    ],
    signatureDishes: ["Cơm đùi gà xối mỡ da giòn", "Cơm rang dưa bò giòn rụm", "Canh xương hầm bí đao (Free)"],
    reviews: [
      {
        id: 101,
        userName: "Nguyễn Tuấn Anh (K73 - CNTT UTT)",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=tuananh",
        rating: 5,
        date: "2 ngày trước",
        comment: "Đùi gà bự chảng, da giòn rụm chấm nước sốt mắm tỏi ớt siêu cuốn. Cơm rang hạt tơi không bị ngấy mỡ. Bác chủ quán nhiệt tình, xin thêm canh hay trà đá thoải mái!"
      },
      {
        id: 102,
        userName: "Trần Mai Phương (K72 - Kế Toán)",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=maiphuong",
        rating: 5,
        date: "Tuần trước",
        comment: "Suất 30k mà no căng bụng, trưa nào lớp mình tan học cũng kéo sang đây ăn. Cực kỳ hợp túi tiền sinh viên cơ sở Vĩnh Yên."
      }
    ]
  },
  {
    id: 2,
    name: "Bún Chả & Nem Cua Bể Bà Tám",
    category: "bun-pho",
    categoryLabel: "Bún - Phở - Mì",
    priceRange: "30.000đ - 40.000đ",
    minPrice: 30000,
    maxPrice: 40000,
    distanceText: "320m từ UTT",
    distanceMeters: 320,
    address: "Số 45 Đường Lam Sơn, P. Đồng Tâm, TP. Vĩnh Yên",
    phone: "0971 889 221",
    openHours: "06:30 - 14:00",
    lat: 21.31420,
    lng: 105.58780,
    coverImage: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
    ],
    signatureDishes: ["Bún chả nướng than hoa", "Nem cua bể rán giòn rụm", "Bún chả băm lá lốt"],
    reviews: [
      {
        id: 201,
        userName: "Vũ Đình Trọng (K74 - Cầu Đường)",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=trongvu",
        rating: 5,
        date: "Hôm qua",
        comment: "Thịt nướng than hoa thơm nức mũi cả góc phố Lam Sơn. Nước mắm pha vừa miệng, nem rán giòn tan. Suất 30k nhiều bún ăn no tới chiều."
      }
    ]
  },
  {
    id: 3,
    name: "Thiên Đường Ăn Vặt & Xiên Que Chú Hùng",
    category: "an-vat",
    categoryLabel: "Ăn vặt & Xiên que",
    priceRange: "5.000đ - 25.000đ",
    minPrice: 5000,
    maxPrice: 25000,
    distanceText: "80m (Ngay cạnh cổng chính UTT)",
    distanceMeters: 80,
    address: "Cổng chính ĐH Công nghệ GTVT, P. Đồng Tâm, TP. Vĩnh Yên",
    phone: "0915 678 123",
    openHours: "14:30 - 22:30",
    lat: 21.31210,
    lng: 105.58970,
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
    ],
    signatureDishes: ["Xiên que nướng bơ tỏi (5k/xiên)", "Bánh tráng nướng mỡ hành", "Nem chua rán phố cổ"],
    reviews: [
      {
        id: 301,
        userName: "Phạm Thùy Linh (K74 - Kinh Tế)",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=thuylinh",
        rating: 5,
        date: "3 ngày trước",
        comment: "Điểm tụ tập quen thuộc của hội bạn sau mỗi ca học chiều! Nước sốt me và ớt cay ngọt của chú Hùng tự làm là đỉnh chóp!"
      }
    ]
  },
  {
    id: 4,
    name: "Tiệm Trà Tuổi Trẻ & Trà Chanh Giã Tay",
    category: "tra-sua",
    categoryLabel: "Trà sữa & Đồ uống",
    priceRange: "15.000đ - 30.000đ",
    minPrice: 15000,
    maxPrice: 30000,
    distanceText: "250m từ UTT",
    distanceMeters: 250,
    address: "Số 68 Phố Trần Phú kéo dài, P. Đồng Tâm, TP. Vĩnh Yên",
    phone: "0963 124 555",
    openHours: "08:00 - 23:00",
    lat: 21.31150,
    lng: 105.58720,
    coverImage: "https://images.unsplash.com/photo-1558857563-b37cf5a894f5?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558857563-b37cf5a894f5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80"
    ],
    signatureDishes: ["Trà chanh giã tay tươi mát", "Trà sữa nướng trân châu hoàng kim", "Trà đào cam sả"],
    reviews: [
      {
        id: 401,
        userName: "Dương Quỳnh Trang (K73 - Ngôn Ngữ)",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=quinhtrang",
        rating: 5,
        date: "Hôm nay",
        comment: "Không gian có điều hòa mát rượi, wifi mạnh mang laptop ra chạy deadline đồ án là hết ý."
      }
    ]
  },
  {
    id: 5,
    name: "Cơm Thố & Mì Cay Sinh Viên Seoul",
    category: "com",
    categoryLabel: "Cơm sinh viên",
    priceRange: "35.000đ - 55.000đ",
    minPrice: 35000,
    maxPrice: 55000,
    distanceText: "600m từ UTT",
    distanceMeters: 600,
    address: "Số 112 Đường Hùng Vương, TP. Vĩnh Yên, Vĩnh Phúc",
    phone: "0944 556 778",
    openHours: "10:00 - 22:00",
    lat: 21.31550,
    lng: 105.59250,
    coverImage: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80"
    ],
    signatureDishes: ["Cơm thố bò xào lúc lắc", "Mì cay hải sản 7 cấp độ", "Kimbap chiên xù"],
    reviews: [
      {
        id: 501,
        userName: "Đặng Quang Huy (K72 - Tự Động Hóa)",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=quanghuy",
        rating: 5,
        date: "3 ngày trước",
        comment: "Cơm thố nóng xèo xèo, đáy thố có lớp cơm cháy vàng giòn ăn mê ly. Rủ nhóm bạn đi ăn rất hợp."
      }
    ]
  },
  {
    id: 6,
    name: "Ốc Nhảy & Chân Gà Sả Tắc Vĩnh Yên",
    category: "an-vat",
    categoryLabel: "Ăn vặt & Nhậu nhẹt",
    priceRange: "25.000đ - 55.000đ",
    minPrice: 25000,
    maxPrice: 55000,
    distanceText: "850m từ UTT",
    distanceMeters: 850,
    address: "Khu đô thị Đồng Tâm, Gần Ga Vĩnh Yên, TP. Vĩnh Yên",
    phone: "0936 998 112",
    openHours: "16:00 - 23:30",
    lat: 21.31010,
    lng: 105.59420,
    coverImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
    ],
    signatureDishes: ["Ốc mít luộc chấm mắm gừng cay", "Chân gà rút xương sốt Thái"],
    reviews: [
      {
        id: 601,
        userName: "Trần Văn Nam (K71 - Xây Dựng)",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=vannam",
        rating: 5,
        date: "Hôm qua",
        comment: "Nước chấm ốc đậm đà cay nồng sả ớt, ốc to béo không sạn. Giá sinh viên rất phải chăng."
      }
    ]
  }
];

// 2. STATE ỨNG DỤNG
let restaurants = [];
let activeCategory = "all";
let activePriceFilter = "all";
let activeSort = "distance-asc";
let searchQuery = "";
let currentSelectedRestaurant = null;
let currentRatingValue = 5;

// Biến Bản Đồ Leaflet
let leafletMap = null;
let mapMarkers = [];

// 3. KHỞI CHẠY KHI TẢI XONG TRANG
document.addEventListener("DOMContentLoaded", () => {
  loadDataFromStorage();
  initEventListeners();
  renderCategoryPills();
  applyFiltersAndRender();
  
  setTimeout(() => {
    initInteractiveLeafletMap();
  }, 100);
});

function loadDataFromStorage() {
  const saved = localStorage.getItem("utt_foodzone_restaurants_data");
  if (saved) {
    try {
      restaurants = JSON.parse(saved);
    } catch (e) {
      restaurants = JSON.parse(JSON.stringify(INITIAL_RESTAURANTS));
    }
  } else {
    restaurants = JSON.parse(JSON.stringify(INITIAL_RESTAURANTS));
    saveDataToStorage();
  }
}

function saveDataToStorage() {
  localStorage.setItem("utt_foodzone_restaurants_data", JSON.stringify(restaurants));
}

function calculateAverageRating(restaurant) {
  if (!restaurant.reviews || restaurant.reviews.length === 0) return 5.0;
  const total = restaurant.reviews.reduce((sum, rev) => sum + rev.rating, 0);
  return (total / restaurant.reviews.length).toFixed(1);
}

// 4. BẢN ĐỒ TƯƠNG TÁC: ESRI WORLD STREET MAP CHÍNH THỨC
function initInteractiveLeafletMap() {
  const container = document.getElementById("map-container");
  if (!container) return;

  if (typeof L === "undefined") {
    console.warn("Leaflet chưa sẵn sàng, thử lại sau 300ms...");
    setTimeout(initInteractiveLeafletMap, 300);
    return;
  }

  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  try {
    // Khởi tạo tâm điểm tại UTT Vĩnh Phúc
    leafletMap = L.map("map-container", {
      center: [UTT_LOCATION.lat, UTT_LOCATION.lng],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // Sử dụng Esri World Street Map Tile Layer
    const esriStreetLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, METI, TomTom | UTT Vĩnh Phúc'
    }).addTo(leafletMap);

    // Fallback tile nếu có sự cố mạng
    esriStreetLayer.on("tileerror", function() {
      console.warn("Lỗi tải tile Esri, chuyển sang Voyager backup...");
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", { maxZoom: 19, subdomains: "abcd" }).addTo(leafletMap);
    });

    // 1. Thêm Ghim Trường UTT Vĩnh Phúc
    const schoolPinIcon = L.divIcon({
      className: "custom-pin-school-wrapper",
      html: `
        <div class="custom-pin-school">
          <i class="fa-solid fa-graduation-cap" style="font-size: 18px;"></i>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });

    const schoolMarker = L.marker([UTT_LOCATION.lat, UTT_LOCATION.lng], { icon: schoolPinIcon }).addTo(leafletMap);
    schoolMarker.bindPopup(`
      <div class="custom-map-popup">
        <h4 style="color:#2563eb; font-size:1rem; margin-bottom:4px;">
          <i class="fa-solid fa-graduation-cap"></i> ${UTT_LOCATION.name}
        </h4>
        <p style="font-size:0.8rem; color:#475569; margin:4px 0;">${UTT_LOCATION.address}</p>
        <span style="font-size:0.75rem; background:#eff6ff; color:#1e40af; padding:3px 10px; border-radius:12px; font-weight:700; display:inline-block; margin-top:4px;">
          📍 Tâm điểm đo khoảng cách quán ăn
        </span>
      </div>
    `);

    // 2. Thêm Ghim cho từng quán ăn
    addRestaurantMarkersToMap();

    // 3. Khắc phục dứt điểm lỗi vỡ gạch bằng invalidateSize
    setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); }, 150);
    setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); }, 500);
    setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); }, 1200);

    // Cập nhật nhãn trạng thái bản đồ
    const badge = document.getElementById("map-engine-badge");
    if (badge) {
      badge.innerHTML = `<i class="fa-solid fa-map-marked-alt text-emerald-500 mr-1"></i> Esri World Street Map`;
      badge.className = "bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center";
    }

  } catch (err) {
    console.error("Lỗi khởi tạo Leaflet:", err);
  }
}

function addRestaurantMarkersToMap() {
  if (!leafletMap) return;

  mapMarkers.forEach(m => leafletMap.removeLayer(m));
  mapMarkers = [];

  restaurants.forEach(rest => {
    const avgRating = calculateAverageRating(rest);

    const foodPinIcon = L.divIcon({
      className: "custom-pin-food-wrapper",
      html: `
        <div class="custom-pin-food" title="${rest.name}">
          <i class="fa-solid fa-utensils" style="font-size: 14px;"></i>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });

    const marker = L.marker([rest.lat, rest.lng], { icon: foodPinIcon }).addTo(leafletMap);

    const popupContent = `
      <div class="custom-map-popup">
        <img src="${rest.coverImage}" alt="${rest.name}">
        <h4>${rest.name}</h4>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
          <span class="price"><i class="fa-solid fa-tag"></i> ${rest.priceRange}</span>
          <span class="rating"><i class="fa-solid fa-star"></i> ${avgRating}★</span>
        </div>
        <p style="font-size:0.75rem; color:#64748b; margin-top:4px;">
          <i class="fa-solid fa-location-dot"></i> ${rest.distanceText}
        </p>
        <button class="popup-btn" onclick="openRestaurantModal(${rest.id})">
          <i class="fa-solid fa-eye"></i> Xem chi tiết & Đánh giá
        </button>
      </div>
    `;

    marker.bindPopup(popupContent);
    marker.on("click", () => {
      highlightCard(rest.id);
    });

    mapMarkers.push(marker);
  });
}

function panToRestaurant(id) {
  const rest = restaurants.find(r => r.id === id);
  if (!rest) return;

  switchMapMode("interactive");

  const mapSection = document.getElementById("map-section");
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  setTimeout(() => {
    if (leafletMap) {
      leafletMap.invalidateSize();
      leafletMap.flyTo([rest.lat, rest.lng], 17, { duration: 0.8 });
      const index = restaurants.findIndex(r => r.id === id);
      if (mapMarkers[index]) {
        mapMarkers[index].openPopup();
      }
    }
  }, 250);
}

function highlightCard(id) {
  const card = document.getElementById(`restaurant-card-${id}`);
  if (card) {
    card.classList.add("ring-4", "ring-orange-400", "scale-[1.02]");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      card.classList.remove("ring-4", "ring-orange-400", "scale-[1.02]");
    }, 2000);
  }
}

function switchMapMode(mode) {
  const interactiveView = document.getElementById("map-container");
  const googleEmbedView = document.getElementById("google-embed-container");
  const btnInteractive = document.getElementById("btn-mode-interactive");
  const btnGoogle = document.getElementById("btn-mode-google");

  if (mode === "interactive") {
    if (interactiveView) interactiveView.classList.remove("hidden");
    if (googleEmbedView) googleEmbedView.classList.add("hidden");
    if (btnInteractive) {
      btnInteractive.classList.add("bg-orange-500", "text-white");
      btnInteractive.classList.remove("bg-white", "text-slate-700");
    }
    if (btnGoogle) {
      btnGoogle.classList.remove("bg-orange-500", "text-white");
      btnGoogle.classList.add("bg-white", "text-slate-700");
    }
    setTimeout(() => {
      if (leafletMap) leafletMap.invalidateSize();
    }, 100);
  } else {
    if (interactiveView) interactiveView.classList.add("hidden");
    if (googleEmbedView) googleEmbedView.classList.remove("hidden");
    if (btnGoogle) {
      btnGoogle.classList.add("bg-orange-500", "text-white");
      btnGoogle.classList.remove("bg-white", "text-slate-700");
    }
    if (btnInteractive) {
      btnInteractive.classList.remove("bg-orange-500", "text-white");
      btnInteractive.classList.add("bg-white", "text-slate-700");
    }
  }
}

// 5. RENDER CARDS & BỘ LỌC
function renderCategoryPills() {
  const container = document.getElementById("category-pills");
  if (!container) return;

  const categories = [
    { id: "all", name: "Tất cả món", icon: "fa-solid fa-utensils" },
    { id: "com", name: "Cơm sinh viên", icon: "fa-solid fa-bowl-rice" },
    { id: "bun-pho", name: "Bún - Phở - Mì", icon: "fa-solid fa-bowl-food" },
    { id: "an-vat", name: "Ăn vặt & Xiên que", icon: "fa-solid fa-hotdog" },
    { id: "tra-sua", name: "Trà sữa & Cafe", icon: "fa-solid fa-mug-hot" }
  ];

  container.innerHTML = categories.map(cat => `
    <button 
      class="cat-pill whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border border-slate-200 transition-all flex items-center gap-2 ${activeCategory === cat.id ? 'active' : 'bg-white text-slate-700 hover:border-orange-300'}"
      onclick="setCategory('${cat.id}')">
      <i class="${cat.icon}"></i>
      <span>${cat.name}</span>
    </button>
  `).join("");
}

function setCategory(catId) {
  activeCategory = catId;
  renderCategoryPills();
  applyFiltersAndRender();
}

function applyFiltersAndRender() {
  let filtered = [...restaurants];

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      (item.signatureDishes && item.signatureDishes.some(d => d.toLowerCase().includes(q)))
    );
  }

  if (activeCategory !== "all") {
    filtered = filtered.filter(item => item.category === activeCategory);
  }

  if (activePriceFilter === "under-25") {
    filtered = filtered.filter(item => item.minPrice <= 25000);
  } else if (activePriceFilter === "25-40") {
    filtered = filtered.filter(item => item.minPrice >= 25000 && item.maxPrice <= 40000);
  } else if (activePriceFilter === "above-40") {
    filtered = filtered.filter(item => item.maxPrice > 40000);
  }

  if (activeSort === "distance-asc") {
    filtered.sort((a, b) => a.distanceMeters - b.distanceMeters);
  } else if (activeSort === "rating-desc") {
    filtered.sort((a, b) => calculateAverageRating(b) - calculateAverageRating(a));
  } else if (activeSort === "price-asc") {
    filtered.sort((a, b) => a.minPrice - b.minPrice);
  }

  renderRestaurantCards(filtered);
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
        <p class="text-slate-500 text-sm mt-1">Hãy thử đổi từ khóa tìm kiếm hoặc bấm xem tất cả quán nhé!</p>
        <button onclick="resetFilters()" class="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600">
          Xem tất cả quán
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(rest => {
    const avgRating = calculateAverageRating(rest);

    return `
      <div id="restaurant-card-${rest.id}" class="food-card bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col">
        <div class="relative h-48 overflow-hidden group">
          <img 
            src="${rest.coverImage}" 
            alt="${rest.name}" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy">
          
          <div class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5 border border-slate-100">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <i class="fa-solid fa-location-dot text-orange-500"></i> ${rest.distanceText}
          </div>

          <div class="absolute top-3 right-3 bg-orange-600/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            ${rest.categoryLabel}
          </div>

          <div class="absolute bottom-2 left-3 bg-slate-900/70 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-sm">
            <i class="fa-regular fa-clock"></i> ${rest.openHours}
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-lg text-slate-900 leading-snug hover:text-orange-600 cursor-pointer transition-colors" onclick="openRestaurantModal(${rest.id})">
              ${rest.name}
            </h3>

            <p class="text-xs text-slate-500 mt-1.5 line-clamp-1 flex items-center gap-1.5">
              <i class="fa-solid fa-map-pin text-slate-400"></i> ${rest.address}
            </p>

            <div class="mt-3.5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span class="text-xs text-slate-400 block">Khoảng giá sinh viên</span>
                <span class="text-sm font-extrabold text-orange-600">${rest.priceRange}</span>
              </div>
              
              <div class="text-right">
                <div class="flex items-center text-amber-500 gap-1 text-sm font-black justify-end">
                  <i class="fa-solid fa-star"></i>
                  <span>${avgRating}</span>
                </div>
                <span class="text-xs text-slate-400 block">(${rest.reviews.length} đánh giá)</span>
              </div>
            </div>

            <div class="mt-3 flex flex-wrap gap-1.5">
              ${(rest.signatureDishes || []).slice(0, 2).map(dish => `
                <span class="text-[11px] bg-amber-50 text-amber-800 font-medium px-2 py-0.5 rounded-md border border-amber-200/50">
                  ✨ ${dish}
                </span>
              `).join("")}
            </div>
          </div>

          <div class="mt-5 pt-3 grid grid-cols-2 gap-2">
            <button 
              onclick="panToRestaurant(${rest.id})" 
              class="w-full py-2.5 px-3 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 font-semibold text-xs hover:bg-orange-100 transition-colors flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-map-location-dot"></i> Trên Map
            </button>
            <button 
              onclick="openRestaurantModal(${rest.id})" 
              class="w-full py-2.5 px-3 rounded-xl bg-gradient-brand text-white font-semibold text-xs hover:opacity-95 shadow-sm transition-all flex items-center justify-center gap-1.5">
              <i class="fa-regular fa-comments"></i> Review (${rest.reviews.length})
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// 6. MODAL CHI TIẾT & BÌNH LUẬN
function openRestaurantModal(restaurantId) {
  const rest = restaurants.find(r => r.id === restaurantId);
  if (!rest) return;

  currentSelectedRestaurant = rest;
  const modal = document.getElementById("restaurant-modal");
  const modalContent = document.getElementById("modal-dynamic-content");

  const avgRating = calculateAverageRating(rest);

  modalContent.innerHTML = `
    <div class="relative">
      <div class="relative h-64 md:h-80 w-full overflow-hidden rounded-t-3xl bg-slate-900">
        <img id="modal-main-image" src="${rest.coverImage}" alt="${rest.name}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

        <button onclick="closeRestaurantModal()" class="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>

        <div class="absolute bottom-4 left-6 right-6 text-white">
          <div class="flex items-center gap-2 mb-1.5">
            <span class="bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              ${rest.categoryLabel}
            </span>
            <span class="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              📍 ${rest.distanceText}
            </span>
          </div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            ${rest.name}
          </h2>
        </div>
      </div>

      <div class="flex gap-2 p-4 bg-slate-50 border-b border-slate-200 overflow-x-auto">
        ${(rest.gallery || [rest.coverImage]).map(imgUrl => `
          <img 
            src="${imgUrl}" 
            class="h-16 w-24 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-orange-500 transition-all flex-shrink-0"
            onclick="document.getElementById('modal-main-image').src = '${imgUrl}'">
        `).join("")}
      </div>
    </div>

    <div class="p-6 md:p-8 space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg">
            <i class="fa-solid fa-tags"></i>
          </div>
          <div>
            <span class="text-xs text-slate-500 block">Mức giá sinh viên</span>
            <strong class="text-sm font-bold text-orange-600">${rest.priceRange}</strong>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div>
            <span class="text-xs text-slate-500 block">Giờ mở cửa</span>
            <strong class="text-sm font-bold text-slate-800">${rest.openHours}</strong>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
            <i class="fa-solid fa-phone"></i>
          </div>
          <div>
            <span class="text-xs text-slate-500 block">Số điện thoại ship</span>
            <strong class="text-sm font-bold text-slate-800">${rest.phone}</strong>
          </div>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 text-base mb-1.5 flex items-center gap-2">
          <i class="fa-solid fa-location-dot text-orange-500"></i> Địa chỉ chi tiết
        </h4>
        <p class="text-slate-600 text-sm pl-6">${rest.address}</p>

        <h4 class="font-bold text-slate-900 text-base mt-4 mb-2 flex items-center gap-2">
          <i class="fa-solid fa-utensils text-orange-500"></i> Món ăn được sinh viên yêu thích:
        </h4>
        <div class="flex flex-wrap gap-2 pl-6">
          ${(rest.signatureDishes || []).map(dish => `
            <span class="bg-orange-100/80 text-orange-900 text-xs font-semibold px-3 py-1 rounded-full border border-orange-200">
              🔥 ${dish}
            </span>
          `).join("")}
        </div>
      </div>

      <div class="border-t border-slate-200 pt-6">
        <div class="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h3 class="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <i class="fa-solid fa-star text-amber-500"></i> Đánh giá của sinh viên UTT
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Những cảm nhận thực tế từ sinh viên cơ sở Vĩnh Phúc</p>
          </div>
          
          <div class="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
            <span class="text-3xl font-black text-amber-600">${avgRating}</span>
            <div class="text-xs">
              <div class="text-amber-500 flex gap-0.5 font-bold">
                ${renderStarsHtml(Math.round(avgRating))}
              </div>
              <span class="text-slate-500">Dựa trên ${rest.reviews.length} đánh giá</span>
            </div>
          </div>
        </div>

        <!-- Form Đánh giá -->
        <div class="bg-gradient-to-br from-orange-50/70 to-amber-50/70 p-5 rounded-2xl border border-orange-200/80 mb-8">
          <h4 class="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <i class="fa-solid fa-pen-nib text-orange-500"></i> Viết đánh giá của bạn
          </h4>

          <form id="review-form" onsubmit="handleReviewSubmit(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Tên hoặc Khóa sinh viên của bạn *</label>
              <input 
                type="text" 
                id="review-username" 
                placeholder="VD: Lê Minh Quân (K74 - CNTT)" 
                required
                class="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Mức độ hài lòng: <span id="rating-label" class="text-orange-600 font-bold ml-1">5 sao - Xuất sắc!</span></label>
              <div class="star-rating-input flex items-center gap-2 text-2xl text-slate-300 py-1" id="star-picker">
                <i class="fa-solid fa-star star-item active" data-rating="1" onclick="setStarRating(1)"></i>
                <i class="fa-solid fa-star star-item active" data-rating="2" onclick="setStarRating(2)"></i>
                <i class="fa-solid fa-star star-item active" data-rating="3" onclick="setStarRating(3)"></i>
                <i class="fa-solid fa-star star-item active" data-rating="4" onclick="setStarRating(4)"></i>
                <i class="fa-solid fa-star star-item active" data-rating="5" onclick="setStarRating(5)"></i>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Cảm nhận chi tiết *</label>
              <textarea 
                id="review-comment" 
                rows="3" 
                placeholder="VD: Quán ăn rất ngon, suất 25k no nê, cô chủ thân thiện..." 
                required
                class="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
            </div>

            <button 
              type="submit" 
              class="px-6 py-2.5 bg-gradient-brand text-white font-bold text-sm rounded-xl hover:opacity-95 shadow-md shadow-orange-500/20 transition-all flex items-center gap-2">
              <i class="fa-solid fa-paper-plane"></i> Gửi đánh giá ngay
            </button>
          </form>
        </div>

        <div id="reviews-list-container" class="space-y-4">
          ${renderReviewsListHtml(rest.reviews)}
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  setTimeout(() => modal.classList.add("show"), 10);
  document.body.style.overflow = "hidden";

  currentRatingValue = 5;
  setStarRating(5);
}

function closeRestaurantModal() {
  const modal = document.getElementById("restaurant-modal");
  modal.classList.remove("show");
  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }, 250);
}

function renderReviewsListHtml(reviewsList) {
  if (!reviewsList || reviewsList.length === 0) {
    return `<p class="text-sm text-slate-400 italic text-center py-4">Chưa có đánh giá nào. Hãy là người đầu tiên nhận xét nhé!</p>`;
  }

  return reviewsList.map(rev => `
    <div class="bg-white p-4.5 rounded-xl border border-slate-100 shadow-sm">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <img src="${rev.avatar}" alt="${rev.userName}" class="w-10 h-10 rounded-full bg-slate-100 p-0.5 border border-slate-200">
          <div>
            <h5 class="font-bold text-slate-900 text-sm">${rev.userName}</h5>
            <span class="text-xs text-slate-400">${rev.date}</span>
          </div>
        </div>

        <div class="text-amber-500 text-xs flex gap-0.5">
          ${renderStarsHtml(rev.rating)}
        </div>
      </div>

      <p class="text-slate-700 text-sm mt-3 leading-relaxed">
        ${rev.comment}
      </p>
    </div>
  `).join("");
}

function renderStarsHtml(count) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= count) {
      html += `<i class="fa-solid fa-star"></i>`;
    } else {
      html += `<i class="fa-regular fa-star text-slate-300"></i>`;
    }
  }
  return html;
}

function setStarRating(rating) {
  currentRatingValue = rating;
  const stars = document.querySelectorAll("#star-picker .star-item");
  const label = document.getElementById("rating-label");

  const ratingLabels = {
    1: "1 sao - Rất tệ 😞",
    2: "2 sao - Chưa ưng ý 😐",
    3: "3 sao - Bình thường 🙂",
    4: "4 sao - Rất ngon & hài lòng! 😋",
    5: "5 sao - Xuất sắc, sinh viên UTT nên thử! 🔥"
  };

  if (label) label.textContent = ratingLabels[rating] || `${rating} sao`;

  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("active", "fa-solid");
      star.classList.remove("fa-regular", "text-slate-300");
    } else {
      star.classList.remove("active", "fa-solid");
      star.classList.add("fa-regular", "text-slate-300");
    }
  });
}

function handleReviewSubmit(e) {
  e.preventDefault();
  if (!currentSelectedRestaurant) return;

  const usernameInput = document.getElementById("review-username");
  const commentInput = document.getElementById("review-comment");

  const userName = usernameInput.value.trim();
  const comment = commentInput.value.trim();

  if (!userName || !comment) {
    showToast("Vui lòng điền đầy đủ tên và cảm nhận!", "error");
    return;
  }

  const newReview = {
    id: Date.now(),
    userName: userName,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`,
    rating: currentRatingValue,
    date: "Vừa xong",
    comment: comment
  };

  currentSelectedRestaurant.reviews.unshift(newReview);

  const index = restaurants.findIndex(r => r.id === currentSelectedRestaurant.id);
  if (index !== -1) {
    restaurants[index] = currentSelectedRestaurant;
    saveDataToStorage();
  }

  const reviewsContainer = document.getElementById("reviews-list-container");
  if (reviewsContainer) {
    reviewsContainer.innerHTML = renderReviewsListHtml(currentSelectedRestaurant.reviews);
  }

  applyFiltersAndRender();
  addRestaurantMarkersToMap();

  usernameInput.value = "";
  commentInput.value = "";
  setStarRating(5);

  showToast("🎉 Cảm ơn bạn! Đánh giá đã được đăng thành công.");
}

// 7. LISTENERS
function initEventListeners() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      applyFiltersAndRender();
    });
  }

  const priceFilter = document.getElementById("price-filter");
  if (priceFilter) {
    priceFilter.addEventListener("change", (e) => {
      activePriceFilter = e.target.value;
      applyFiltersAndRender();
    });
  }

  const sortFilter = document.getElementById("sort-filter");
  if (sortFilter) {
    sortFilter.addEventListener("change", (e) => {
      activeSort = e.target.value;
      applyFiltersAndRender();
    });
  }

  const resetMapBtn = document.getElementById("btn-center-utt");
  if (resetMapBtn) {
    resetMapBtn.addEventListener("click", () => {
      switchMapMode("interactive");
      if (leafletMap) {
        leafletMap.flyTo([UTT_LOCATION.lat, UTT_LOCATION.lng], 16);
      }
      showToast("📍 Đã quay về tâm điểm: UTT Cơ sở Vĩnh Phúc");
    });
  }

  const modal = document.getElementById("restaurant-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeRestaurantModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeRestaurantModal();
  });

  window.addEventListener("resize", () => {
    if (leafletMap) leafletMap.invalidateSize();
  });
}

function resetFilters() {
  searchQuery = "";
  activeCategory = "all";
  activePriceFilter = "all";
  activeSort = "distance-asc";

  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";

  const priceFilter = document.getElementById("price-filter");
  if (priceFilter) priceFilter.value = "all";

  const sortFilter = document.getElementById("sort-filter");
  if (sortFilter) sortFilter.value = "distance-asc";

  renderCategoryPills();
  applyFiltersAndRender();
}

function showToast(message) {
  const toast = document.getElementById("toast-notification");
  const msgEl = document.getElementById("toast-message");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}