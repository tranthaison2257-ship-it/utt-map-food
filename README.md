# 🍜 UTT FoodZone - Khám Phá & Đánh Giá Quán Ăn Sinh Viên UTT Vĩnh Phúc

Trang Web App hiện đại, trực quan được thiết kế & lập trình riêng cho sinh viên **Trường Đại học Công nghệ Giao thông Vận tải (UTT) - Cơ sở Đào tạo Vĩnh Phúc** (Phường Đồng Tâm, Thành phố Vĩnh Yên, Tỉnh Vĩnh Phúc).

---

## 🌐 LINK TRUY CẬP TRỰC TUYẾN CÔNG KHAI (TOÀN CẦU)
Bất kỳ ai trên máy tính khác hoặc điện thoại di động (4G/5G, Wi-Fi) đều có thể vào xem ngay:

👉 **[https://fiction-diagnosis-opened-notre.trycloudflare.com](https://fiction-diagnosis-opened-notre.trycloudflare.com)**

*(Được cung cấp qua Cloudflare Tunnel bảo mật cao, mã hóa HTTPS chuẩn quốc tế)*

---

## 🌟 Điểm nổi bật về UI/UX & Công nghệ
1. **Bản đồ Ẩm thực với 2 kiểu hiển thị:**
   - **OpenStreetMap / Địa hình:** các kiểu nền tương tác không yêu cầu API key; ghim UTT và quán đồng bộ theo kết quả lọc.
   - **Google Maps:** bản đồ nhúng để tra cứu trực quan.
   - Có nút về UTT, định vị GPS và mở chỉ đường.
2. **Responsive 100%:** Hoạt động mượt mà trên cả máy tính (PC) lẫn điện thoại di động.
3. **Hero thu gọn/mở rộng:** Nút mũi tên ở cuối phần giới thiệu cho phép ẩn hoặc hiện nhanh banner; trạng thái được lưu trên `localStorage` để dùng lại ở lần truy cập sau trên cùng trình duyệt.
4. **Danh sách thẻ quán ăn:** Lọc theo món ăn, tầm giá sinh viên (<25k, 25k-40k), sắp xếp theo khoảng cách gần trường nhất.
5. **Tra cứu nhanh:** Tìm theo tên quán, địa chỉ hoặc món nổi bật; lọc khoảng giá và loại món; sắp xếp theo khoảng cách hoặc giá.
6. **Lưu quán yêu thích:** Nhấn biểu tượng trái tim trên thẻ để lưu quán vào `localStorage` của trình duyệt; nút “Đã lưu” lọc riêng danh sách này trên cùng thiết bị và trình duyệt.
7. **Chọn quán ngẫu nhiên:** Nút “Ăn gì?” mở cửa sổ quay và chọn một quán trong danh sách hiện đang phù hợp với bộ lọc.
8. **Trợ lý chat:** Gợi ý quán theo danh mục và dữ liệu có trên trang; câu trả lời chạy cục bộ theo từ khóa, không gọi dịch vụ AI bên ngoài.
9. **Chia sẻ:** Tạo QR, sao chép link hoặc dùng Web Share API để mở bảng chia sẻ của điện thoại; chọn Quick Share (Android) hoặc AirDrop (iPhone) nếu có. Trên một số Android dùng Chrome ở HTTPS, Web NFC có thể ghi/đọc thẻ NFC rời, nhưng không biến điện thoại thành thẻ để chia sẻ bằng cách chạm hai máy.
10. **Dark mode:** Nút cạnh nút chia sẻ chuyển giữa giao diện sáng/tối và lưu lựa chọn trên trình duyệt hiện tại.

### Gửi đề xuất quán mới

Nút **Gửi quán mới** mở form; cần nhập mã truy cập trước khi các trường thông tin được mở. Form gửi đề xuất tới Google Apps Script để quản trị viên xem xét. Người gửi dán link Google Maps; Apps Script trích xuất và trả vĩ độ/kinh độ trong `extractedLat` và `extractedLng`. Nếu không tìm thấy tọa độ, Apps Script trả lỗi và không ghi đề xuất vào Google Docs. Hãy dùng phiên bản script mới nhất trong [`js/appscript.js`](./js/appscript.js) cho Apps Script; sau khi cập nhật code trong Google Apps Script, cần triển khai lại phiên bản Web app để endpoint áp dụng thay đổi. Người gửi ảnh tải trực tiếp lên thư mục Drive được liên kết trong form; không cần dán URL ảnh. Đề xuất chưa được duyệt sẽ không tự xuất hiện trên website. Mã truy cập được kiểm tra trong JavaScript phía trình duyệt nên chỉ giúp ẩn/khóa form trên giao diện, không phải cơ chế bảo mật; người xem mã nguồn có thể đọc được. Muốn bảo vệ thật, cần kiểm tra quyền ở Google Apps Script hoặc dùng xác thực phía máy chủ, tuyệt đối không nhúng mã bí mật vào client.

### Cách tạo đề xuất:
Bước 1: Tạo file Google Docs và Google Apps Script (Làm Backend)Bạn vào Google Docs tạo một file trắng (ví dụ: Danh sách chờ duyệt quán ăn).Nhìn lên thanh địa chỉ (URL) của file Docs, copy đoạn ID của file.(Ví dụ URL là: [https://docs.google.com/document/d/1A2B3C4D.../edit](https://docs.google.com/document/d/1A2B3C4D.../edit), thì ID là 1A2B3C4D...).Truy cập Google Apps Script và tạo một Dự án mới. **Lưu ý:** đoạn code mẫu bên dưới là phiên bản cũ, nhận `lat`/`lng` thủ công nên không dùng được với form Google Maps hiện tại. Để tự trích xuất tọa độ, Apps Script cần đọc `data.mapUrl`, gọi `extractLatLngFromUrl(data.mapUrl)` và trả `extractedLat`/`extractedLng` như trong script mới. Dán đoạn code mẫu sau vào:JavaScriptfunction doPost(e) {
  try {
    // Lấy dữ liệu từ Web gửi lên
    var data = JSON.parse(e.postData.contents);
    
    // Tạo ID ngẫu nhiên (hoặc bạn có thể tự sửa lại sau)
    var randomId = Math.floor(Math.random() * 1000) + 100; 

    // Chuyển chuỗi món ăn thành mảng (ví dụ: "Bún, Cháo" -> ["Bún", "Cháo"])
    var dishesArray = data.signatureDishes.split(',').map(function(item) {
      return item.trim();
    });

    // Ép đúng định dạng bạn yêu cầu
    var formattedString = `
  {
    id: ${randomId},
    name: "${data.name}",
    category: "${data.category}",
    categoryLabel: "${data.categoryLabel}",
    priceRange: "${data.priceRange}",
    minPrice: ${data.minPrice},
    maxPrice: ${data.maxPrice},
    distanceText: "${data.distanceText || ""}",
    address: "${data.address}",
    phone: "${data.phone}",
    openHours: "${data.openHours || ""}",
    lat: ${data.lat},
    lng: ${data.lng},
    coverImage: "${data.coverImage}",
    signatureDishes: ${JSON.stringify(dishesArray)}
  },`;

    // Mở file Docs bằng ID và ghi dữ liệu vào
    var docId = 'DÁN_ID_GOOGLE_DOC_CỦA_BẠN_VÀO_ĐÂY'; 
    var doc = DocumentApp.openById(docId);
    
    // Thêm nội dung và một đường kẻ ngang để ngăn cách các quán
    doc.getBody().appendParagraph(formattedString);
    doc.getBody().appendHorizontalRule();

    // Trả về kết quả thành công cho Web
    return ContentService.createTextOutput(JSON.stringify({"status": "success"})).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.message})).setMimeType(ContentService.MimeType.JSON);
  }
}
Lưu và Triển khai (Deploy):Bấm vào nút Deploy (Triển khai) ở góc trên bên phải $\rightarrow$ New deployment (Triển khai mới).Chạm vào biểu tượng bánh răng $\rightarrow$ Chọn Web app (Ứng dụng web).Mục Who has access (Ai có quyền truy cập): Chọn Anyone (Bất kỳ ai).Bấm Deploy. Google sẽ yêu cầu bạn cấp quyền (bạn đăng nhập Gmail, chọn Nâng cao $\rightarrow$ Đi tới dự án).Cuối cùng, bạn sẽ nhận được một Web app URL. Hãy copy URL này.Bước 2: Tạo HTML Form trên trang web của bạn (Frontend)
---

## 🚀 Cách chạy cục bộ
- Mở file `index.html` trực tiếp bằng Google Chrome hoặc Microsoft Edge.
- Bản đồ và icon cần kết nối Internet để tải thư viện/lớp nền. GPS cần quyền vị trí và thường cần HTTPS hoặc localhost.
- Hoặc chạy web server cục bộ bằng một web server tĩnh, rồi truy cập địa chỉ localhost tương ứng.

## 🗂️ Cấu trúc mã nguồn
- `index.html`: khung trang, các nút và vùng hiển thị.
- `style.css`: giao diện, bố cục và kiểu ghim bản đồ.
- `js/data.js`: tọa độ UTT và dữ liệu quán tại Vĩnh Yên.
- `js/map.js`: khởi tạo Leaflet, lớp nền, ghim, GPS và chuyển đổi Google Maps.
- `js/app.js`: tìm kiếm, lọc, sắp xếp, hiển thị thẻ quán và liên kết các thao tác UI.

### Tùy chỉnh màu dark mode

Mở `style.css` và chỉnh các biến `--dark-*` trong `:root` để đổi màu nền trang, bề mặt, đường viền và chữ. Các quy tắc dark mode ở cuối file tham chiếu các biến này; có thể thêm biến mới tại `:root` rồi dùng trong các quy tắc `body.dark-mode` tương ứng. Lựa chọn giao diện được lưu bằng khóa `utt-foodzone-theme` trong `localStorage`.

### Đổi hoặc thêm kiểu nền bản đồ

Mở `js/map.js` và tìm `BASE_MAPS` ở gần đầu file. Mỗi mục có:
- `label`: tên hiển thị trên nút.
- `icon`: tên icon Font Awesome, bỏ phần `fa-solid`.
- `url`: URL mẫu tile, dùng `{z}`, `{x}`, `{y}`; nếu nhà cung cấp có máy chủ con, khai báo thêm `{s}` trong URL và `subdomains`.
- `attribution`: dòng ghi công bắt buộc theo điều khoản của nhà cung cấp tile.
- `maxZoom`: mức phóng đại tối đa mà nhà cung cấp hỗ trợ.

Để đổi kiểu nền mặc định, sửa `DEFAULT_BASE_MAP` thành ID của mục tương ứng, ví dụ `"topo"`. Muốn thêm kiểu mới, thêm mục mới vào `BASE_MAPS` theo cùng cấu trúc; nút chọn sẽ được tạo tự động. URL tile thường có dạng `https://.../{z}/{x}/{y}.png`; lấy mẫu URL và attribution từ tài liệu của nhà cung cấp. Google Maps nhúng vẫn là lựa chọn riêng. Nếu nhà cung cấp yêu cầu API key, tuân thủ chính sách key của họ và không commit key bí mật vào mã nguồn công khai.

Khi thêm quán, sửa mảng `INITIAL_RESTAURANTS` trong `js/data.js`; nhập `lat` (vĩ độ) và `lng` (kinh độ) chính xác. Các file JavaScript thường được nạp theo thứ tự `data.js` → `map.js` → `app.js`.

Trang tự gọi định vị khi mở. Nếu GPS lần đầu phản hồi chậm hoặc lỗi tín hiệu tạm thời, trang tiếp tục thử lại với thời gian chờ dài hơn và đổi chế độ chính xác; khi nhận được tọa độ, bản đồ và khoảng cách quán sẽ tự cập nhật. GPS yêu cầu HTTPS hoặc localhost và người dùng phải cho phép quyền vị trí; nếu quyền bị chặn, hãy bật lại trong cài đặt trang của trình duyệt rồi bấm “Vị trí tôi”.
