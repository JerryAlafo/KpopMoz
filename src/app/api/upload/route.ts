import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { auth } from "@/auth";

const MAX_BYTES     = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/gif":  "gif",
};

async function ensureBucket(db: ReturnType<typeof createAdminClient>) {
  const { error } = await db.storage.getBucket("posts");
  if (error) {
    // Bucket não existe — cria-o público
    await db.storage.createBucket("posts", {
      public:            true,
      fileSizeLimit:     MAX_BYTES,
      allowedMimeTypes:  ALLOWED_TYPES,
    });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Nenhum ficheiro enviado" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato não suportado. Usa JPG, PNG, WebP ou GIF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Ficheiro demasiado grande (máx. 10 MB)" },
      { status: 400 }
    );
  }

  const ext  = EXT_MAP[file.type] ?? "jpg";
  const slug = session.user.email.replace(/[@.]/g, "_");
  const path = `${slug}/${Date.now()}.${ext}`;

  const db = createAdminClient();

  // Garante que o bucket existe (cria na primeira utilização)
  await ensureBucket(db);

  const bytes = await file.arrayBuffer();
  const { error: uploadError } = await db.storage
    .from("posts")
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[upload]", uploadError.message);
    return NextResponse.json({ error: "Erro ao guardar a imagem. Tenta novamente." }, { status: 500 });
  }

  const { data: { publicUrl } } = db.storage.from("posts").getPublicUrl(path);
  return NextResponse.json({ url: publicUrl });
}
