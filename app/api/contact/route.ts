import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactPayload {
  name: string;
  email: string;
  msg: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<ContactPayload>;

  if (!body.name?.trim() || !body.email?.trim() || !body.msg?.trim()) {
    return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
  }

  const { name, email, msg } = body as ContactPayload;

  const { error } = await resend.emails.send({
    from: "Arcade Vault <onboarding@resend.dev>",
    to: ["marino249907@gmail.com"],
    subject: `[Arcade Vault] Mensaje de ${name}`,
    text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${msg}`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
