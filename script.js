/**
 * ==============================================================================
 * UTT FOODZONE - WEB APP ĐÁNH GIÁ QUÁN ĂN SINH VIÊN UTT VĨNH PHÚC
 * Tác giả: Full-stack Web Developer & UI/UX Designer
 * Phiên bản: 2.3 (Bản đồ tượng trưng & Tự động vẽ lộ trình từ trường UTT)
 * ==============================================================================
 */

// Tọa độ và thông tin trung tâm: Cơ sở Trường Đại học Công nghệ Giao thông Vận tải (UTT) Vĩnh Phúc
const UTT_LOCATION = {
  lat: 21.31254,
  lng: 105.58912,
  name: "ĐH Công nghệ Giao thông Vận tải cơ sở Vĩnh Phúc",
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
let searchQuery = "";
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

/**
 * HÀM XỬ LÝ CHUYỂN SANG GOOGLE MAPS VẼ ĐƯỜNG ĐI TỪ TRƯỜNG UTT ĐẾN QUÁN ĂN
 */
function openGoogleMaps(lat, lng, name) {
  // Điểm xuất phát cố định: Trường ĐH Công nghệ GTVT cơ sở Vĩnh Phúc
  const origin = encodeURIComponent("ĐH Công nghệ Giao thông Vận tải cơ sở Vĩnh Phúc, Đồng Tâm, Vĩnh Yên");
  // Điểm đến: Tên quán + Tọa độ để