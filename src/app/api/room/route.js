import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();

  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: DB.rooms.length,
  });
};

export const POST = async (request) => {
  const payload = checkToken();
  if (payload === null)
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  const body = await request.json();
  let roomName = body;
  readDB();
  let check = [];
  check = DB.rooms.findindex((std) => std.roomName === body.roomName);

  if (check > 0) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${body.roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();

  DB.rooms.push({ roomId, roomName });

  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${body.roomName} has been created`,
  });
};
