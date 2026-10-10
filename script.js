/**
 * ==============================================================================
 * UTT FOODZONE - WEB APP ĐÁNH GIÁ QUÁN ĂN SINH VIÊN UTT VĨNH PHÚC
 * Phiên bản: 3.1 (Fix lỗi tràn tên quán, tối ưu giao diện card & Thêm nhiều quán mới)
 * ==============================================================================
 */

const UTT_LOCATION = {
  lat: 21.31254,
  lng: 105.58912,
  name: "ĐH Công nghệ Giao thông Vận tải cơ sở Vĩnh Phúc",
  address: "Phường Đồng Tâm, TP. Vĩnh Yên, Tỉnh Vĩnh Phúc"
};

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
    address: "Số 18 Ngõ 2 Phố Lam Sơn, P. Đồng Tâm, TP. Vĩnh Yên",
    phone: "0982 345 678",
    openHours: "09:30 - 21:00",
    lat: 21.31340,
    lng: 105.58990,
    coverImage: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    signatureDishes: ["Cơm đùi gà xối mỡ da giòn", "Cơm rang dưa bò giòn rụm"]
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
    address: "Số 45 Đường Lam Sơn, P. Đồng Tâm, TP. Vĩnh Yên",
    phone: "0971 889 221",
    openHours: "06:30 - 14:00",
    lat: 21.31420,
    lng: 105.58780,
    coverImage: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
    signatureDishes: ["Bún chả nướng than hoa", "Nem cua bể rán giòn rụm"]
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
    address: "Cổng chính ĐH Công nghệ GTVT, P. Đồng Tâm, TP. Vĩnh Yên",
    phone: "0915 678 123",
    openHours: "14:30 - 22:30",
    lat: 21.31210,
    lng: 105.58970,
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    signatureDishes: ["Xiên que nướng bơ tỏi", "Bánh tráng nướng mỡ hành"]
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
    address: "Số 68 Phố Trần Phú kéo dài, P. Đồng Tâm, TP. Vĩnh Yên",
    phone: "0963 124 555",
    openHours: "08:00 - 23:00",
    lat: 21.31150,
    lng: 105.58720,
    coverImage: "https://images.unsplash.com/photo-1558857563-b37cf5a894f5?auto=format&fit=crop&w=800&q=80",
    signatureDishes: ["Trà chanh giã tay", "Trà sữa nướng trân châu"]
  },
  // --- BỔ SUNG CÁC QUÁN ĂN MỚI XUNG QUANH UTT VĨNH PHÚC ---
  {
    id: 5,
    name: "Bánh Mì Chảo & Sốt Vang Sinh Viên",
    category: "com",
    categoryLabel: "Ăn sáng & Nhanh",
    priceRange: "20.000đ - 35.000đ",
    minPrice: 20000,
    maxPrice: 35000,
    distanceText: "200m từ UTT",
    address: "Đường Lam Sơn, P. Đồng Tâm, TP. Vĩnh Yên",
    phone: "0981 123 456",
    openHours: "06:00 - 12:30",
    lat: 21.31300,
    lng: 105.58850,
    coverImage: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    signatureDishes: ["Bánh mì chảo đầy đủ", "Bánh mì sốt vang đậm đà"]
  },
  {
    id: 6,
    name: "Lẩu Nướng Tự Chọn 99k Đồng Tâm",
    category: "an-vat",
    categoryLabel: "Lẩu & Nướng",
    priceRange: "80.000đ - 150.000đ",
    minPrice: 80000,
    maxPrice: 150000,
    distanceText: "450m từ UTT",
    address: "Khu đô thị Đồng Tâm, TP. Vĩnh Yên",
    phone: "0978 999 888",
    openHours: "16:00 - 23:30",
    lat: 21.31050,
    lng: 105.59120,
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    signatureDishes: ["Lẩu Thái chua cay", "Ba chỉ bò mỹ nướng sốt BBQ"]
  },
  {
    id: 7,
    name: "Bún Đậu Mắm Tôm Mộc Quán",
    category: "bun-pho",
    categoryLabel: "Bún - Phở - Mì",
    priceRange: "25.000đ - 45.000đ",
    minPrice: 25000,
    maxPrice: 45000,
    distanceText: "300m từ UTT",
    address: "Số 12 Phố Chùa Hà, P. Đồng Tâm, TP. Vĩnh Yên",
    phone: "0934 567 890",
    openHours: "10:00 - 21:00",
    lat: 21.31480,
    lng: 105.58650,
    coverImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    signatureDishes: ["Mẹ bún đậu tá lả", "Chả cốm chiên giòn"]
  },
  {
    id: 8,
    name: "Mì Cay Seoul 7 Cấp Độ Vĩnh Yên",
    category: "com",
    categoryLabel: "Món Hàn Quốc",
    priceRange: "35.000đ - 55.000đ",
    minPrice: 35000,
    maxPrice: 55000,
    distanceText: "500m từ UTT",
    address: "Đường Hùng Vương, P. Đồng Tâm, TP. Vĩnh Yên",
    phone: "0912 345 678",
    openHours: "09:00 - 22:00",
    lat: 21.31520,
    lng: 105.59200,
    coverImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    signatureDishes: ["Mì cay hải sản", "Kimbap chiên xù"]
  },
  {
    id: 9,
    name: "Phở Bò Gia Truyền Nam Định",
    category: "bun-pho",
    categoryLabel: "Bún - Phở - Mì",
    priceRange: "30.000đ - 45.000đ",
    minPrice: 30000,
    maxPrice: 45000,
    distanceText: "180m từ UTT",
    address: "Gần cổng phụ UTT Vĩnh Phúc, P. Đồng Tâm",
    phone: "0965 432 109",
    openHours: "06:00 - 13:00",
    lat: 21.31290,
    lng: 105.58950,
    coverImage: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?auto=format&fit=crop&w=800&q=80",
    signatureDishes: ["Phở tái nạm gầu", "Phở bò sốt vang"]
  }
];

let restaurants = [];
let activeCategory = "all";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  restaurants = JSON.parse(JSON.stringify(INITIAL_RESTAURANTS));
  initGoogleMapEmbed();
  initEventListeners();
  renderCategoryPills();
  renderRestaurantCards(restaurants);
});

function initGoogleMapEmbed() {
  const container = document.getElementById("map-container");
  if (!container) return;

  container.innerHTML = `
    <iframe 
      width="100%" 
      height="450" 
      style="border:0; border-radius: 12px; display:block;" 
      loading="lazy" 
      allowfullscreen 
      src="https://maps.google.com/maps?q=${UTT_LOCATION.lat},${UTT_LOCATION.lng}&z=16&output=embed">
    </iframe>
  `;
}

function openGoogleMaps(lat, lng, name) {
  const origin = encodeURIComponent("ĐH Công nghệ Giao thông Vận tải cơ sở Vĩnh Phúc, Đồng Tâm, Vĩnh Yên");
  const destination = encodeURIComponent(`${name}, Vĩnh Yên, Vĩnh Phúc`);
  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  window.open(url, "_blank");
}

function renderCategoryPills() {
  const container = document.getElementById("category-pills");
  if (!container) return;

  const categories = [
    { id: "all", name: "Tất cả món", icon: "fa-solid fa-utensils" },
    { id: "com", name: "Cơm & Món chính", icon: "fa-solid fa-bowl-rice" },
    { id: "bun-pho", name: "Bún - Phở", icon: "fa-solid fa-bowl-food" },
    { id: "an-vat", name: "Ăn vặt & Lẩu nướng", icon: "fa-solid fa-hotdog" },
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
      item.name.toLowerCase().includes(q) || item.address.toLowerCase().includes(q)
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
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(rest => `
    <div class="food-card bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col">
      <!-- Ảnh quán: Đã thêm min-height để không bị đè chữ -->
      <div class="relative h-48 min-h-[12rem] overflow-hidden group cursor-pointer" onclick="openGoogleMaps(${rest.lat}, ${rest.lng}, '${rest.name.replace(/'/g, "\\'")}')">
        <img src="${rest.coverImage}" alt="${rest.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
        <div class="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
          <i class="fa-solid fa-location-dot text-orange-500"></i> ${rest.distanceText}
        </div>
        <div class="absolute top-3 right-3 bg-orange-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
          ${rest.categoryLabel}
        </div>
      </div>

      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <!-- Tên quán: Đã tối ưu chiều cao hiển thị và line-clamp tránh tràn -->
          <h3 class="font-bold text-base md:text-lg text-slate-900 leading-snug line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors" onclick="openGoogleMaps(${rest.lat}, ${rest.lng}, '${rest.name.replace(/'/g, "\\'")}')" title="${rest.name}">
            ${rest.name}
          </h3>
          <p class="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5 line-clamp-1">
            <i class="fa-solid fa-map-pin text-slate-400 flex-shrink-0"></i> ${rest.address}
          </p>
          <div class="mt-3.5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-400 block">Khoảng giá</span>
              <span class="text-sm font-extrabold text-orange-600">${rest.priceRange}</span>
            </div>
            <div class="text-right">
              <div class="flex items-center text-amber-500 gap-1 text-sm font-black justify-end">
                <i class="fa-solid fa-star"></i>
                <span>5.0</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5 pt-3 grid grid-cols-1 gap-2">
          <button onclick="openGoogleMaps(${rest.lat}, ${rest.lng}, '${rest.name.replace(/'/g, "\\'")}')" class="w-full py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
            <i class="fa-brands fa-google text-blue-600"></i> Xem đường đi từ trường UTT
          </button>
        </div>
      </div>
    </div>
  `).join("");
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