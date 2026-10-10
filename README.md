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
3. **Danh sách thẻ quán ăn:** Lọc theo món ăn, tầm giá sinh viên (<25k, 25k-40k), sắp xếp theo khoảng cách gần trường nhất.
4. **Tra cứu nhanh:** Tìm theo tên quán, địa chỉ hoặc món nổi bật; lọc khoảng giá và loại món; sắp xếp theo khoảng cách hoặc giá.
5. **Lưu quán yêu thích:** Nhấn biểu tượng trái tim trên thẻ để lưu quán vào `localStorage` của trình duyệt; nút “Đã lưu” lọc riêng danh sách này trên cùng thiết bị và trình duyệt.
6. **Chọn quán ngẫu nhiên:** Nút “Ăn gì?” mở cửa sổ quay và chọn một quán trong danh sách hiện đang phù hợp với bộ lọc.
7. **Trợ lý chat:** Gợi ý quán theo danh mục và dữ liệu có trên trang; câu trả lời chạy cục bộ theo từ khóa, không gọi dịch vụ AI bên ngoài.
8. **Chia sẻ:** Tạo QR, sao chép link hoặc dùng Web Share API để mở bảng chia sẻ của điện thoại; chọn Quick Share (Android) hoặc AirDrop (iPhone) nếu có. Trên một số Android dùng Chrome ở HTTPS, Web NFC có thể ghi/đọc thẻ NFC rời, nhưng không biến điện thoại thành thẻ để chia sẻ bằng cách chạm hai máy.

### Gửi đề xuất quán mới

Người dùng bấm **Gửi quán mới** để mở GitHub Issue Form và gửi tên, danh mục, địa chỉ, vị trí cùng khoảng giá. GitHub lưu đề xuất dưới dạng issue; dev kiểm tra thông tin trước khi cập nhật `INITIAL_RESTAURANTS` trong `js/data.js` và phát hành website. Đề xuất chưa được duyệt sẽ không tự xuất hiện trên web. Cách này không cần database hay API key trong trình duyệt; người gửi cần đăng nhập GitHub để tạo issue. Không nên để trình duyệt tự ghi thẳng vào mã nguồn vì sẽ phải nhúng thông tin xác thực bí mật vào mã client.

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

### Đổi hoặc thêm kiểu nền bản đồ

Mở `js/map.js` và tìm `BASE_MAPS` ở gần đầu file. Mỗi mục có:
- `label`: tên hiển thị trên nút.
- `icon`: tên icon Font Awesome, bỏ phần `fa-solid`.
- `url`: URL mẫu tile, dùng `{z}`, `{x}`, `{y}`; nếu nhà cung cấp có máy chủ con, khai báo thêm `{s}` trong URL và `subdomains`.
- `attribution`: dòng ghi công bắt buộc theo điều khoản của nhà cung cấp tile.
- `maxZoom`: mức phóng đại tối đa mà nhà cung cấp hỗ trợ.

Để đổi kiểu nền mặc định, sửa `DEFAULT_BASE_MAP` thành ID của mục tương ứng, ví dụ `"topo"`. Muốn thêm kiểu mới, thêm mục mới vào `BASE_MAPS` theo cùng cấu trúc; nút chọn sẽ được tạo tự động. URL tile thường có dạng `https://.../{z}/{x}/{y}.png`; lấy mẫu URL và attribution từ tài liệu của nhà cung cấp. Google Maps nhúng vẫn là lựa chọn riêng. Nếu nhà cung cấp yêu cầu API key, tuân thủ chính sách key của họ và không commit key bí mật vào mã nguồn công khai.

Khi thêm quán, sửa mảng `INITIAL_RESTAURANTS` trong `js/data.js`; nhập `lat` (vĩ độ) và `lng` (kinh độ) chính xác. Các file JavaScript thường được nạp theo thứ tự `data.js` → `map.js` → `app.js`.

Trang tự gọi định vị khi mở. Trình duyệt sẽ hỏi quyền nếu chưa có lựa chọn trước đó; nếu quyền đã được cấp thì vị trí lấy tự động mà không hỏi lại. Khi có tọa độ, bản đồ chuyển ngay đến vị trí đó; khoảng cách và danh sách được cập nhật ngay sau. GPS yêu cầu HTTPS hoặc localhost và cần người dùng cho phép.
