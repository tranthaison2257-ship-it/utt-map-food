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
    name: "Bánh Cuốn Nóng & Bún Chả",
    category: "bun-pho",
    categoryLabel: "Bún - Phở - Mì",
    priceRange: "10.000đ - 30.000đ",
    minPrice: 10000,
    maxPrice: 30000,
    distanceText: "150m từ cổng UTT",
    address: "TP. Vĩnh Yên, từ cổng trường nhìn thẳng, quán nằm bên tay phải",
    phone: "0961 576 463",
    openHours: "",
    lat: 21.292583,
    lng: 105.582722,
    coverImage: "https://github.com/tranthaison2257-ship-it/utt-map-food/blob/377ff2eaa2ae5a9041df421bb2f7933fe662f5f1/src/pics/banh-cuon-nong-bun.jpg?raw=true",
    signatureDishes: ["Bánh cuốn", "Bún chả"]
  },
  {
    id: 2,
    name: "Phở Bò Ngọc Sơn",
    category: "bun-pho",
    categoryLabel: "Bún - Phở - Mì",
    priceRange: "25.000đ - 40.000đ",
    minPrice: 25000,
    maxPrice: 40000,
    distanceText: "320m từ UTT",
    address: "Cù Chính Lan, P. Đồng Tâm, TP. Vĩnh Yên",
    phone: "0972 138 926",
    openHours: "",
    lat: 21.2937672,
    lng: 105.5834473,
    coverImage: "https://github.com/tranthaison2257-ship-it/utt-map-food/blob/377ff2eaa2ae5a9041df421bb2f7933fe662f5f1/src/pics/pho-bo-ngoc-son.jpg?raw=true",
    signatureDishes: ["Phở bò", "Cơm rang dưa bò"]
  },
  {
    id: 3,
    name: "Chạn Buffet Cơ Sở 2 - Vĩnh Yên",
    category: "buffet",
    categoryLabel: "Buffet",
    priceRange: "200.000đ - 300.000đ",
    minPrice: 200000,
    maxPrice: 300000,
    distanceText: "",
    address: "LK2.01, Khu Đô Thị VPIT, Tp.Vĩnh yên, Vĩnh Phúc, Phú Thọ 280000, Việt Nam",
    phone: "0868 460 088",
    openHours: "",
    lat: 21.3110972,
    lng: 105.5704692,
    coverImage: "https://github.com/tranthaison2257-ship-it/utt-map-food/blob/377ff2eaa2ae5a9041df421bb2f7933fe662f5f1/src/pics/nha-hang-chan.jpg?raw=true",
    signatureDishes: ["", "Buffet lẩu nướng"]
  },
  //{
  //   id: 4,
  //   name: "Tiệm Trà Tuổi Trẻ & Trà Chanh Giã Tay",
  //   category: "tra-sua",
  //   categoryLabel: "Trà sữa & Đồ uống",
  //   priceRange: "15.000đ - 30.000đ",
  //   minPrice: 15000,
  //   maxPrice: 30000,
  //   distanceText: "250m từ UTT",
  //   address: "Số 68 Phố Trần Phú kéo dài, P. Đồng Tâm, TP. Vĩnh Yên",
  //   phone: "0963 124 555",
  //   openHours: "08:00 - 23:00",
  //   lat: 21.31150,
  //   lng: 105.58720,
  //   coverImage: "https://images.unsplash.com/photo-1558857563-b37cf5a894f5?auto=format&fit=crop&w=800&q=80",
  //   signatureDishes: ["Trà chanh giã tay", "Trà sữa nướng trân châu"]
  // },

  // {
  //   id: 5,
  //   name: "Bánh Mì Chảo & Sốt Vang Sinh Viên",
  //   category: "com",
  //   categoryLabel: "Ăn sáng & Nhanh",
  //   priceRange: "20.000đ - 35.000đ",
  //   minPrice: 20000,
  //   maxPrice: 35000,
  //   distanceText: "200m từ UTT",
  //   address: "Đường Lam Sơn, P. Đồng Tâm, TP. Vĩnh Yên",
  //   phone: "0981 123 456",
  //   openHours: "06:00 - 12:30",
  //   lat: 21.31300,
  //   lng: 105.58850,
  //   coverImage: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
  //   signatureDishes: ["Bánh mì chảo đầy đủ", "Bánh mì sốt vang đậm đà"]
  // },
  // {
  //   id: 6,
  //   name: "Lẩu Nướng Tự Chọn 99k Đồng Tâm",
  //   category: "an-vat",
  //   categoryLabel: "Lẩu & Nướng",
  //   priceRange: "80.000đ - 150.000đ",
  //   minPrice: 80000,
  //   maxPrice: 150000,
  //   distanceText: "450m từ UTT",
  //   address: "Khu đô thị Đồng Tâm, TP. Vĩnh Yên",
  //   phone: "0978 999 888",
  //   openHours: "16:00 - 23:30",
  //   lat: 21.31050,
  //   lng: 105.59120,
  //   coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  //   signatureDishes: ["Lẩu Thái chua cay", "Ba chỉ bò mỹ nướng sốt BBQ"]
  // },
  // {
  //   id: 7,
  //   name: "Bún Đậu Mắm Tôm Mộc Quán",
  //   category: "bun-pho",
  //   categoryLabel: "Bún - Phở - Mì",
  //   priceRange: "25.000đ - 45.000đ",
  //   minPrice: 25000,
  //   maxPrice: 45000,
  //   distanceText: "300m từ UTT",
  //   address: "Số 12 Phố Chùa Hà, P. Đồng Tâm, TP. Vĩnh Yên",
  //   phone: "0934 567 890",
  //   openHours: "10:00 - 21:00",
  //   lat: 21.31480,
  //   lng: 105.58650,
  //   coverImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
  //   signatureDishes: ["Mẹ bún đậu tá lả", "Chả cốm chiên giòn"]
  // },
  // {
  //   id: 8,
  //   name: "Mì Cay Seoul 7 Cấp Độ Vĩnh Yên",
  //   category: "com",
  //   categoryLabel: "Món Hàn Quốc",
  //   priceRange: "35.000đ - 55.000đ",
  //   minPrice: 35000,
  //   maxPrice: 55000,
  //   distanceText: "500m từ UTT",
  //   address: "Đường Hùng Vương, P. Đồng Tâm, TP. Vĩnh Yên",
  //   phone: "0912 345 678",
  //   openHours: "09:00 - 22:00",
  //   lat: 21.31520,
  //   lng: 105.59200,
  //   coverImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
  //   signatureDishes: ["Mì cay hải sản", "Kimbap chiên xù"]
  // },
  // {
  //   id: 9,
  //   name: "Phở Bò Gia Truyền Nam Định",
  //   category: "bun-pho",
  //   categoryLabel: "Bún - Phở - Mì",
  //   priceRange: "30.000đ - 45.000đ",
  //   minPrice: 30000,
  //   maxPrice: 45000,
  //   distanceText: "180m từ UTT",
  //   address: "Gần cổng phụ UTT Vĩnh Phúc, P. Đồng Tâm",
  //   phone: "0965 432 109",
  //   openHours: "06:00 - 13:00",
  //   lat: 21.31290,
  //   lng: 105.58950,
  //   coverImage: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?auto=format&fit=crop&w=800&q=80",
  //   signatureDishes: ["Phở tái nạm gầu", "Phở bò sốt vang"]
  // }
];

window.FoodZoneData = { UTT_LOCATION, INITIAL_RESTAURANTS };
