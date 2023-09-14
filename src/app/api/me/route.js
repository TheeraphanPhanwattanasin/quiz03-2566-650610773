import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Theeraphan Phanwattanasin",
    studentId: "650610773",
  });
};
