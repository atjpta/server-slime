# 🎮 Server Slime — Roadmap

## Ký hiệu

| Ký hiệu  | Ý nghĩa                     |
| -------- | --------------------------- |
| `[x]`    | ✅ Đã hoàn thành            |
| `[ ] 🚧` | Đang thực hiện              |
| `[ ] 🔴` | **P0** — Critical, làm ngay |
| `[ ] 🟠` | **P1** — High, quan trọng   |
| `[ ] 🟡` | **P2** — Medium, nên làm    |
| `[ ] 🟢` | **P3** — Low, nice to have  |

---

## 👤 Account

- [x] Login / Register
- [x] 1 user có nhiều nhân vật
- [ ] 🔴 Admin & phân quyền cho admin
- [ ] 🟠 Token versioning trong DB — bỏ token cũ, force login lại
- [ ] 🟠 Xác thực user qua email / số điện thoại
- [ ] 🟠 Thiết kế đa server
- [ ] 🟡 Force logout từng thiết bị — chống share account
- [ ] 🟡 Thiết kế hệ thống Ban / Mute
- [ ] 🟡 OAuth login — Google, Facebook
- [ ] 🟢 2FA (Two-Factor Authentication)

---

## 🏆 Ranking

- [x] Mùa giải vĩnh viễn để demo
- [ ] 🟠 Phần thưởng khi đạt rank nhất định
- [ ] 🟠 Admin có thể config và vận hành qua web
- [ ] 🟡 Nâng cấp nhiều mùa giải — nhiều loại, nhiều mùa
- [ ] 🟡 Tổng kết mùa giải — lưu danh vọng, Hall of Fame, top các mùa cũ
- [ ] 🟢 Hiệu ứng / huy hiệu rank cho từng mùa giải

---

## ⚔️ Battle

- [x] Gameplay chọn 5 actions, đánh cùng lúc
- [x] Cho phép sử dụng item trong trận
- [x] Thiết kế battle replay
- [ ] 🟠 Thiết kế thêm item — nhiều effect hơn
- [ ] 🟠 Tối ưu code để thêm item mới dễ hơn
- [ ] 🟠 Nhiều kiểu battle — thiết kế code linh hoạt để mở rộng
- [ ] 🟠 Matchmaking rating (ELO / MMR) — tách khỏi rank mùa giải
- [ ] 🟡 Co-op battle — đánh cùng nhau với player khác
- [ ] 🟡 Tournament / bracket system — giải đấu có vòng loại
- [ ] 🟢 Spectator mode — xem người khác đánh

---

## ✨ Skill

- [x] Thiết kế 3 skill cơ bản
- [ ] 🟠 Thiết kế thêm skill dựa trên skill cơ bản
- [ ] 🟠 Tối ưu code để thêm skill mới dễ dàng
- [ ] 🟠 Hiệu ứng trạng thái — chảy máu, độc, choáng, ...
- [ ] 🟡 Admin có thể update chỉ số scale để cân bằng game

---

## 🧬 Player

- [ ] 🔴 Level hệ thống
- [ ] 🟠 Thiết kế chỉ số cơ bản cho nhân vật
- [ ] 🟠 Thêm chủng tộc
- [ ] 🟠 Thêm class, chuyển chức
- [ ] 🟠 Thiết kế thêm nhiều chỉ số
- [ ] 🟡 Tiềm năng khi lên level
- [ ] 🟡 Phẩm chất cho chủng tộc / class
- [ ] 🟡 Thống kê cá nhân — tỉ lệ thắng, counter, ...
- [ ] 🟢 Profile showcase — tự chọn thành tích, trang bị hiển thị
- [ ] 🟢 Prestige / rebirth system

---

## 💰 Currency

- [ ] 🚧 Thiết kế wallet — vàng, dust, gem
- [ ] 🟠 Làm phần nạp tiền, các gói nạp
- [ ] 🟠 Thiết kế cửa hàng — nhiều loại shop
- [ ] 🟠 Admin có thể config / update cửa hàng, chợ, gói nạp
- [ ] 🟡 Thiết kế thêm các đơn vị tiền tệ — có thể trao đổi qua lại
- [ ] 🟡 Thiết kế chợ — player buôn bán với nhau
- [ ] 🟡 Trade history log — lịch sử giao dịch cá nhân
- [ ] 🟡 Anti-inflation monitoring — theo dõi lưu thông tiền tệ
- [ ] 🟡 Currency sink mechanism — đốt tiền tránh lạm phát

---

## 🎒 Item

- [ ] 🚧 Thiết kế item, inventory, equipment
- [ ] 🟠 Equipment restrictions — giới hạn trang bị theo level, chỉ số, chủng tộc, ...
- [ ] 🟠 Hệ upgrade trang bị — roll chỉ số, cường hóa, tinh luyện, khảm ngọc
- [ ] 🟠 Thiết kế thêm nhiều item
- [ ] 🟡 Giá thị trường cho item — tiện cho giao dịch
- [ ] 🟡 Hệ thống chế đồ (crafting)
- [ ] 🟡 Tối ưu sắp xếp túi đồ
- [ ] 🟢 Thiết kế trang phục thời trang (cosmetic)

---

## 👥 Tribe

- [x] 🟠 Thiết kế tribe cơ bản — tạo, join, leave
- [x] 🟠 Tribe hierarchy — leader, co-leader, member, applicant
- [ ] 🟠 Thiết kế content tribe — war, PvE, ...
- [ ] 🟡 Tribe buff
- [ ] 🟡 Tribe shop
- [ ] 🟡 Tribe quest
- [ ] 🟡 Alert / thông báo nội bộ tribe
- [ ] 🟡 Tribe donation — hiến tế nguyên liệu vào quỹ
- [ ] 🟡 Tribe log — lịch sử join, kick, donate
- [ ] 🟢 Tribe notice board — ghim thông báo

---

## 🧑‍🤝‍🧑 Friend System

- [ ] 🟠 Thêm / xóa bạn bè, block
- [ ] 🟠 Friend list online status
- [ ] 🟡 Thách đấu trực tiếp với bạn bè
- [ ] 🟢 Gift cho bạn bè — có giới hạn chống farm

---

## 💬 Chat

- [ ] 🟠 Chat toàn server
- [ ] 🟠 Chat tribe
- [ ] 🟡 Chat 1:1

---

## 🔔 Thông báo

- [ ] 🟠 Thông báo realtime
- [ ] 🟡 Thông báo đặt trước (scheduled)
- [ ] 🟡 Thông báo các hoạt động đặc biệt của player

---

## 📋 Quest

- [ ] 🟠 Quest hàng ngày
- [ ] 🟠 Quest hàng tuần
- [ ] 🟡 Quest cốt truyện — phải hoàn thành tuần tự
- [ ] 🟡 Quest thành tích
- [ ] 🟡 Danh hiệu — có thể buff chỉ số

---

## 🎁 Reward

- [ ] 🟠 Login reward — thưởng đăng nhập hàng ngày
- [ ] 🟠 Các phần thưởng free / trả phí cho các hoạt động
- [ ] 🟡 Online reward — thưởng theo thời gian online
- [ ] 🟡 Battle Pass

---

## 🌍 Nội dung thế giới

- [ ] 🟠 Thiết kế hệ thống quái
- [ ] 🟠 Phân cấp quái — thường, tinh anh, boss, độc nhất (chỉ giết 1 lần)
- [ ] 🟡 Camp cốt truyện
- [ ] 🟡 Nhiều độ khó khác nhau
- [ ] 🟡 Map cày nguyên liệu hàng ngày
- [ ] 🟡 Map thử thách
- [ ] 🟡 Boss thế giới
- [ ] 🟡 Admin config / update để cân bằng game
- [ ] 🟢 Hệ thống treo máy (AFK farming)

---

## 📬 Mail

- [ ] 🟠 Admin gửi mail cho player — có thể gửi kèm item
- [ ] 🟠 Tự động gửi mail — phát thưởng gift code, tổng kết rank
- [ ] 🟡 Player gửi mail cho nhau — có thể gửi kèm item

---

## 🎰 Gacha

- [ ] 🟡 Thiết kế hệ thống gacha
- [ ] 🟡 Admin có thể config rate, item trong gacha

---

## 🎉 Event System

- [ ] 🟡 Cho phép tạo item / hoạt động theo event được config trước
- [ ] 🟡 Admin config event

---

## 🎟️ Gift Code

- [ ] 🟡 Thiết kế hệ thống gift code gửi quà qua mail
- [ ] 🟡 Admin config / update

---

## 📖 Collection & Codex

- [ ] 🟢 Collection — thu thập được nhận thưởng / buff, admin config
- [ ] 🟢 Codex / Encyclopedia — thông tin game cho player, kết hợp với Collection

---

## 🛠️ Vận hành & Hạ tầng

- [ ] 🟠 Audit log — lưu thao tác player / user, rollback khi sự cố
- [ ] 🟠 Maintenance mode — tắt server tạm, hiển thị countdown
- [ ] 🟡 Hot-reload game config — cập nhật chỉ số không cần restart
- [ ] 🟡 Feature flag — bật / tắt tính năng theo nhóm player / server
- [ ] 🟡 Scheduled tasks dashboard — quản lý cron jobs (reset quest, tổng kết rank, ...)
- [ ] 🟢 Analytics dashboard — DAU/MAU, retention, economy health metrics
