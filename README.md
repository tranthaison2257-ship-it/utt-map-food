# 🍜 UTT FoodZone - Khám Phá & Đánh Giá Quán Ăn Sinh Viên UTT Vĩnh Phúc

Trang Web App hiện đại, trực quan được thiết kế & lập trình riêng cho sinh viên **Trường Đại học Công nghệ Giao thông Vận tải (UTT) - Cơ sở Đào tạo Vĩnh Phúc** (Phường Đồng Tâm, Thành phố Vĩnh Yên, Tỉnh Vĩnh Phúc).

---

## 🌐 LINK TRUY CẬP TRỰC TUYẾN CÔNG KHAI (TOÀN CẦU)
Bất kỳ ai trên máy tính khác hoặc điện thoại di động (4G/5G, Wi-Fi) đều có thể vào xem ngay:

👉 **[https://fiction-diagnosis-opened-notre.trycloudflare.com](https://fiction-diagnosis-opened-notre.trycloudflare.com)**

*(Được cung cấp qua Cloudflare Tunnel bảo mật cao, mã hóa HTTPS chuẩn quốc tế)*

---

## 🌟 Điểm nổi bật về UI/UX & Công nghệ
1. **Bản đồ Ẩm thực 2 Chế độ (Dual Mode Map):**
   - **Chế độ 1: Bản đồ Tương tác Pin Quán ăn:** Sử dụng CartoDB Voyager tiles sắc nét, hiển thị chi tiết từng con ngõ tại Vĩnh Yên, ghim trường UTT nổi bật và các ghim quán ăn màu cam đỏ. Bấm vào ghim sẽ mở Popup hiển thị ảnh, giá, sao và nút xem chi tiết.
   - **Chế độ 2: Google Maps Trực quan:** Nhúng trực tiếp bản đồ Google Maps của cơ sở UTT Vĩnh Phúc (Đồng Tâm, Vĩnh Yên) 100% chính chủ Google Maps, chuyển đổi chỉ với 1 click.
2. **Responsive 100%:** Hoạt động mượt mà trên cả máy tính (PC) lẫn điện thoại di động.
3. **Danh sách thẻ quán ăn:** Lọc theo món ăn, tầm giá sinh viên (<25k, 25k-40k), sắp xếp theo khoảng cách gần trường nhất.
4. **Hệ thống đánh giá của sinh viên:** Chọn số sao tương tác 1-5★, viết cảm nhận, cập nhật điểm trung bình tức thì và lưu trữ LocalStorage.

---

## 🚀 Cách chạy cục bộ (Offline)
- Mở file `index.html` trực tiếp bằng Google Chrome hoặc Microsoft Edge.
- Hoặc chạy web server cục bộ qua PowerShell:
  ```powershell
  powershell -ExecutionPolicy Bypass -File "C:\Users\DELL\.gemini\antigravity\scratch\server.ps1" -Port 8080
  ```
  Và truy cập `http://localhost:8080`
