const express = require("express");
const fs = require("fs");
require("dotenv").config();

// Server Configurations
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

//Local Variables
let rooms;

app.listen(PORT, async (err) => {
  let json = fs.readFileSync("data.json");
  rooms = JSON.parse(json);
  if (!err) console.log(`listening on port ${PORT}`);
  else console.log(`failed to listen on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({
    status: true,
    msg: "Hello, world!",
  });
});

app.post("/createRoom", (req, res) => {
  let roomName = req.body.roomName;
  let numberOfSeatsAvailable = req.body.numberOfSeatsAvailable;
  let numberOfAmenities = req.body.numberOfAmenities;
  let roomId = Number((Math.random() * 100).toFixed(0));

  rooms.push({
    roomId,
    roomName,
    numberOfSeatsAvailable,
    numberOfAmenities,
    customer: [],
  });

  fs.writeFileSync("data.json", JSON.stringify(rooms));

  res.json({
    status: true,
    msg: "Room created successfully!",
    data: {
      roomId,
      roomName,
      numberOfSeatsAvailable,
      numberOfAmenities,
    },
  });
});

app.post("/bookRoom", (req, res) => {
  let roomId = req.body.roomId;
  let customerName = req.body.customerName;
  let date = req.body.date;
  let startTime = req.body.startTime;
  let endTime = req.body.endTime;

  let statusCheck = rooms.some(
    (room) =>
      room.roomId == roomId &&
      room.customer.length > 0 &&
      room.numberOfSeatsAvailable <= 0
  );

  if (statusCheck) {
    res.json({
      status: 200,
      msg: "Room is already booked! Please try another one",
    });
  } else {
    rooms.find((room, index) => {
      if (room.roomId == roomId) {
        if (
          room.customer.find(
            (e) => e.startTime == startTime && e.date != date
          ) != undefined
        ) {
          res.json({
            status: true,
            msg: "Room is booked for that time, please try booking for some time later",
          });
          return false;
        }
        room.customer.push({
          customerName,
          date,
          startTime,
          endTime,
        });
        room.numberOfSeatsAvailable = room.numberOfSeatsAvailable - 1;
        fs.writeFileSync("data.json", JSON.stringify(rooms));
        res.json({
          status: true,
          data: rooms.find((room) => room.roomId === roomId),
        });
        return true;
      }
    });
    res.json({
      status: false,
      msg: "Room not found!",
    });
    return true;
  }
});

app.get("/getAllRooms", (req, res) => {
  res.json(
    rooms.map((room) => {
      return {
        roomId: room.roomId,
        roomName: room.roomName,
        bookedStatus:
          room.customer.length > 0 ? "Booked" : "Seats are available",
        customerNames:
          room.customer.map((c) => c.customerName) ?? "Not available",
        date:
          room.customer.find((c) => c) == undefined
            ? "Not available"
            : room.customer.find((c) => c).date,
        startTime:
          room.customer.find((c) => c) == undefined
            ? "Not available"
            : room.customer.find((c) => c).startTime,
        endTime:
          room.customer.find((c) => c) == undefined
            ? "Not available"
            : room.customer.find((c) => c).endTime,
      };
    })
  );
});

app.get("/getAllCustomers", (req, res) => {
  res.json(
    rooms.map((room) => {
      return [
        ...room.customer.map((c) => {
          return {
            customerName: c.customerName,
            roomName: room.roomName,
            date: c.date,
            startTime: c.startTime,
            endTime: c.endTime,
          };
        }),
      ];
    })
  );
});
