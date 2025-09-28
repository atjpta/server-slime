# Welcome to Colyseus!

This project has been created using [⚔️ `create-colyseus-app`](https://github.com/colyseus/create-colyseus-app/) - an npm init template for kick starting a Colyseus project in TypeScript.

[Documentation](http://docs.colyseus.io/)

## :crossed_swords: Usage

```
npm start
```

## Structure

- `index.ts`: main entry point, register an empty room handler and attach [`@colyseus/monitor`](https://github.com/colyseus/colyseus-monitor)
- `src/rooms/MyRoom.ts`: an empty room handler for you to implement your logic
- `src/rooms/schema/MyRoomState.ts`: an empty schema used on your room's state.
- `loadtest/example.ts`: scriptable client for the loadtest tool (see `npm run loadtest`)
- `package.json`:
  - `scripts`:
    - `npm start`: runs `ts-node-dev index.ts`
    - `npm test`: runs mocha test suite
    - `npm run loadtest`: runs the [`@colyseus/loadtest`](https://github.com/colyseus/colyseus-loadtest/) tool for testing the connection, using the `loadtest/example.ts` script.
- `tsconfig.json`: TypeScript configuration file

## License

MIT

ngrok http http://localhost:2567 --url=flamingo-probable-probably.ngrok-free.app

- đọc hết docs của coluseus --- ok
- vào table phayer, khi đăng kí sẽ init player lv 1 cùng các thuộc tính cơ bản mai làm hiển thị ra bên unity --- ok
- vào phòng global (phòng chung, có thể chát chung, thông báo các kiểu) -- đá client kia nếu đăng nhập trùng
- vào phòng battle để choảng nhau
- tương lai thiết kế nhiều server

```

các từ khóa có thể xài
Timing Events
Exception Handling in Rooms


room ở đây đều riêng cả
các chức năng nào cần tương tác real time thì mới viết socket, còn lại dùng http hết
dùng @colyseus/command để tách logic ra khỏi script nhận event (MyRoom.ts) --- tương tự controller và service

public class ExampleManager : ColyseusManager<ExampleManager>
   public async void GetAvailableRooms()
    {
        StarBossRoomAvailable[] rooms = await client.GetAvailableRooms<StarBossRoomAvailable>(_roomController.roomName);

        onRoomsReceived?.Invoke(rooms);
    }
```
