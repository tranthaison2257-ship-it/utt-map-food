/**
 * ==============================================================================
 * UTT FOODZONE - WEB APP ĐÁNH GIÁ QUÁN ĂN SINH VIÊN UTT VĨNH PHÚC
 * Tác giả: Full-stack Web Developer & UI/UX Designer
 * Phiên bản: 2.2 (Tích hợp bản đồ tượng trưng & Chỉ đường Google Maps trực tiếp)
 * ==============================================================================
 */

// Tọa độ trung tâm: Cơ sở Trường Đại học Công nghệ Giao thông Vận tải (UTT) Vĩnh Phúc
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
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"
    ],
    signatureDishes: ["Cơm đùi gà xối mỡ da giòn", "Cơm rang dưa bò giòn rụm"],
    reviews: [
      {
        id: 101,
        userName: "Nguyễn Tuấn Anh (K73 - CNTT UTT)",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=tuananh",
        rating: 5,
        date: "2 ngày trước",
        comment: "Đùi gà bự chảng, da giòn rụm chấm nước sốt mắm tỏi ớt siêu cuốn. Cơm rang hạt tơi không bị ngấy mỡ."
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
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80"
    ],
    signatureDishes: ["Bún chả nướng than hoa", "Nem cua bể rán giòn rụm"],
    reviews: [
      {
        id: 201,
        userName: "Vũ Đình Trọng (K74 - Cầu Đường)",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=trongvu",
        rating: 5,
        date: "Hôm qua",
        comment: "Thịt nướng than hoa thơm nức mũi. Nước mắm pha vừa miệng, nem rán giòn tan."
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
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
    ],
    signatureDishes: ["Xiên que nướng bơ tỏi (5k/xiên)", "Bánh tráng nướng mỡ hành"],
    reviews: [
      {
        id: 301,
        userName: "Phạm Thùy Linh (K74 - Kinh Tế)",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=thuylinh",
        rating: 5,
        date: "3 ngày trước",
        comment: "Điểm tụ tập quen thuộc của hội bạn sau mỗi ca học chiều!"
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
      "https://images.unsplash.com/photo-1558857563-b37cf5a894f5?auto=format&fit=crop&w=800&q=80"
    ],
    signatureDishes: ["Trà chanh giã tay tươi mát", "Trà sữa nướng trân châu hoàng kim"],
    reviews: [
      {
        id: 401,
        userName: "Dương Quỳnh Trang (K73 - Ngôn Ngữ)",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=quinhtrang",
        rating: 5,
        date: "Hôm nay",
        comment: "Không gian có điều hòa mát rượi, wifi mạnh mang laptop ra chạy deadline."
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

// 4. BẢN ĐỒ TƯƠNG TÁC (Tượng trưng & Chuyển thẳng sang Google Maps khi click)
function initInteractiveLeafletMap() {
  const container = document.getElementById("map-container");
  if (!container) return;

  if (typeof L === "undefined") {
    setTimeout(initInteractiveLeafletMap, 300);
    return;
  }

  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  try {
    leafletMap = L.map("map-container", {
      center: [UTT_LOCATION.lat, UTT_LOCATION.lng],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false // Khóa cuộn chuột trên bản đồ tượng trưng để trải nghiệm lướt web mượt mà hơn
    });

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; UTT Vĩnh Phúc'
    }).addTo(leafletMap);

    // Ghim trường UTT
    const schoolPinIcon = L.divIcon({
      className: "custom-pin-school-wrapper",
      html: `<div style="background:#2563eb; color:white; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.3);"><i class="fa-solid fa-graduation-cap"></i></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
    L.marker([UTT_LOCATION.lat, UTT_LOCATION.lng], { icon: schoolPinIcon }).addTo(leafletMap)
      .bindPopup(`<b>${UTT_LOCATION.name}</b><br>${UTT_LOCATION.address}`);

    // Ghim các quán ăn (Bấm vào tự động mở Google Maps chỉ đường)
    restaurants.forEach(rest => {
      const foodPinIcon = L.divIcon({
        className: "custom-pin-food-wrapper",
        html: `<div style="background:#f97316; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.3);" title="${rest.name}"><i class="fa-solid fa-utensils text-xs"></i></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([rest.lat, rest.lng], { icon: foodPinIcon }).addTo(leafletMap);
      
      // Khi click vào ghim trên bản đồ tượng trưng -> Chuyển hướng trực tiếp sang Google Maps chỉ đường
      marker.on("click", () => {
        openGoogleMaps(rest.lat, rest.lng, rest.name);
      });

      mapMarkers.push(marker);
    });

    setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); }, 200);

  } catch (err) {
    console.error("Lỗi khởi tạo bản đồ:", err);
  }
}

/**
 * Hàm mở Google Maps chỉ đường đến quán ăn
 */
function openGoogleMaps(lat, lng, name) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Vĩnh Yên Vĩnh Phúc")}`;
  window.open(url, "_blank");
}

function panToRestaurant(id) {
  const rest = restaurants.find(r => r.id === id);
  if (!rest) return;
  // Bấm vào quán từ danh sách sẽ gọi thẳng Google Maps chỉ đường
  openGoogleMaps(rest.lat, rest.lng, rest.name);
}

// 5. RENDER GIAO DIỆN VÀ TÌM KIẾM
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
      class="cat-pill whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border border-slate-200 transition-all flex items-center gap-2 ${activeCategory === cat.id ? 'active bg-orange-500 text-white' : 'bg-white text-slate-700 hover:border-orange-300'}"
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
        <p class="text-slate-500 text-sm mt-1">Hãy thử đổi từ khóa tìm kiếm nhé!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(rest => {
    const avgRating = calculateAverageRating(rest);

    return `
      <div id="restaurant-card-${rest.id}" class="food-card bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col">
        <div class="relative h-48 overflow-hidden group cursor-pointer" onclick="openGoogleMaps(${rest.lat}, ${rest.lng}, '${rest.name.replace(/'/g, '')}')">
          <img src="${rest.coverImage}" alt="${rest.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
          <div class="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
            <i class="fa-solid fa-location-dot text-orange-500"></i> ${rest.distanceText}
          </div>
          <div class="absolute top-3 right-3 bg-orange-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            ${rest.categoryLabel}
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-lg text-slate-900 leading-snug hover:text-orange-600 cursor-pointer transition-colors" onclick="openGoogleMaps(${rest.lat}, ${rest.lng}, '${rest.name.replace(/'/g, '')}')">
              ${rest.name}
            </h3>
            <p class="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
              <i class="fa-solid fa-map-pin text-slate-400"></i> ${rest.address}
            </p>
            <div class="mt-3.5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span class="text-xs text-slate-400 block">Khoảng giá</span>
                <span class="text-sm font-extrabold text-orange-600">${rest.priceRange}</span>
              </div>
              <div class="text-right">
                <div class="flex items-center text-amber-500 gap-1 text-sm font-black justify-end">
                  <i class="fa-solid fa-star"></i>
                  <span>${avgRating}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 pt-3 grid grid-cols-2 gap-2">
            <button onclick="openGoogleMaps(${rest.lat}, ${rest.lng}, '${rest.name.replace(/'/g, '')}')" class="w-full py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5">
              <i class="fa-brands fa-google"></i> Chỉ đường
            </button>
            <button onclick="openRestaurantModal(${rest.id})" class="w-full py-2.5 px-3 rounded-xl bg-orange-500 text-white font-semibold text-xs hover:bg-orange-600 transition-all flex items-center justify-center gap-1.5">
              <i class="fa-regular fa-comments"></i> Chi tiết
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function initEventListeners() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      applyFiltersAndRender();
    });
  }
}

function openRestaurantModal(id) {
  const rest = restaurants.find(r => r.id === id);
  if (!rest) return;
  // Mở modal chi tiết quán hoặc chuyển sang Google Maps luôn tùy bạn chọn
  openGoogleMaps(rest.lat, rest.lng, rest.name);
}

function closeRestaurantModal() {
  // Đóng modal
}