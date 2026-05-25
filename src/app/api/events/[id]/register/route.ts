import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email invalido." }, { status: 400 });
  }

  const db = createAdminClient();
  const { data: event, error: eventError } = await db
    .from("events")
    .select("id, capacity, registered")
    .eq("id", id)
    .maybeSingle();

  if (eventError) return NextResponse.json({ error: eventError.message }, { status: 500 });
  if (!event) return NextResponse.json({ error: "Evento nao encontrado." }, { status: 404 });

  if (event.capacity && event.registered >= event.capacity) {
    return NextResponse.json({ error: "Este evento ja esta cheio." }, { status: 409 });
  }

  const { error: insertError } = await db
    .from("event_registrations")
    .insert({ event_id: id, user_email: email });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ error: "Este email ja esta inscrito neste evento." }, { status: 409 });
    }
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { count } = await db
    .from("event_registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id);

  const registered = count ?? event.registered + 1;
  await db.from("events").update({ registered }).eq("id", id);

  return NextResponse.json({ ok: true, registered }, { status: 201 });
}
