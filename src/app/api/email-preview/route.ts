import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isEtherealTransport } from "@/lib/email";

// Demo-only: lets the UI show the Ethereal preview link for the last
// verification/reset email sent to an address, since Ethereal never
// delivers to a real inbox. Always 404s once real SMTP is configured.
export async function GET(req: NextRequest) {
    if (!isEtherealTransport()) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const preview = await prisma.emailPreview.findUnique({ where: { email } });
    if (!preview) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ previewUrl: preview.previewUrl });
}
