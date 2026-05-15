## cần chú ý việc query DB, query cần ít càng tốt

## chỗ token có thể thêm version trong db để có thể bỏ các token cũ, force login lại

next

tạo thử trận đấu đê
suy nghĩ, note ra các bước, event gửi qua lại ở trong room

tạo bảng skill default trước để dùng, khi tạo nhận vật sẽ có sẵn 3 skill default

v1

- khi match được thì sẽ tiến hành chạy thời gian cố định dựa trên server để quản lí
- sẽ các các wave, mỗi wave có 5 turn, tương ứng với 5 active dùng các skill
- mỗi wave có max 30s (có thể thay đổi) để chọn các action, sau đó sẽ tiến hành đánh với nhau (cần phải check xem việc show amin tốn bao lâu), sau đó sẽ tiếp tục wave mới
- khi hp 1 trong 2 hết thì sẽ kết thúc trận đấu
- lưu log của trận đấu lại và có thể replay lại
- trường hợp cả 2 đều hết hp thì sẽ hòa
- max sẽ là 10 wave (có thể thay đổi)
- sau 10 wave thì có thể thêm các yếu tố để phân biệt thắng thua (có thể để 2 bên hòa giống như cả 2 đều hết máu)

v2

- khi match được thì sẽ tiến hành chạy thời gian cố định dựa trên server để quản lí
- sẽ các các wave, mỗi wave có 5 turn, tương ứng với 5 active dùng các skill
- mỗi wave có max 30s (có thể thay đổi) để chọn các action, sau đó sẽ tiến hành đánh với nhau (cần phải check xem việc show amin tốn bao lâu), sau đó sẽ tiếp tục wave mới
- khi hp 1 trong 2 hết thì sẽ kết thúc trận đấu
- lưu log của trận đấu lại và có thể replay lại
- trường hợp cả 2 đều có hp < 0 trong cũng 1 turn thì sẽ hòa
- max sẽ là 10 wave (có thể thay đổi)
- sau 10 wave thì random cho 1 bên thắng

- xong phần join
- kế tiếp làm phần thời gian 30s và chọn submit 5 active lên

phần log
phần stats lưu vào trong array logs luôn

khi xong tính toán xoong 1 turn thì lúc này update vào log để từ đó bên client render ra anim

sẽ lấy ra stats từ log trước đó, và khi update chỉ push thêm chứ không gắn đè

log gồm {
turn: 0,
wave: 0,
players: map<playerId, BattlePlayerState>,

}

BattlePlayerState
{
stats = new BattlePlayerStatsState();
action = number;
damageCause [{type, value}]
damageReceive [{type, value}]

}

làm chức năng đăng kí bên demo, sau đó làm chức năng tạo room, tìm room theo code, tạo sẳn bot để có thể chơi 1 mình
chức năng hiện lịch sử đấu kèm chức năng replay lại

- tối ưu lại room, cái nào cần sync state, cái nào push event
