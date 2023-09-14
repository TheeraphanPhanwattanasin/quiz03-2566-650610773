import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");

  let filtered = [];
  if (roomId !== null) {
    filtered = DB.rooms.find((std) => std.roomId === roomId);
  }

  let message = DB.messages.filter((std) => std.roomId === roomId);

  if (!filtered)
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );

  return NextResponse.json({
    ok: false,
    message: message,
  });
};

export const POST = async (request) => {
  const body = await request.json();

  let { roomId, messageText } = body;
  readDB();

  let found = DB.rooms.find((x) => x.roomId === roomId);

  if (!found) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();

  DB.message.push({ roomId, messageId, messageText });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const payload = checkToken();

  if (payload === null)
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  let role = payload.role;
  readDB();
  const body = await request.json();
  let messageId = body;

  if (role == "SUPER_ADMIN") {
    let found = DB.messages.findindex((x) => x.messageId === messageId);
    if (found === -1)
      return NextResponse.json(
        {
          ok: false,
          message: "Message is not found",
        },
        { status: 404 }
      );

    writeDB();
    DB.messages.splice(found, 1);
    return NextResponse.json({
      ok: true,
      message: "Message has been deleted",
    });
  }
};
