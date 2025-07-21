import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import { createClient } from '@supabase/supabase-js';

// Konfigurace Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Připojení k Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY! // service_role key – má právo zapisovat
);

// 📤 Nahrávání
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'Žádné soubory nebyly nahrány.' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const mimetype = file.type;
      const resourceType = mimetype.startsWith('video') ? 'video' : 'image';

      // Nahrání na Cloudinary
      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'svatba',
            resource_type: 'auto',
          },
          (err, result) => {
            if (err || !result) return reject(err);
            resolve(result);
          }
        );
        Readable.from(buffer).pipe(stream);
      });

      // Uložení do Supabase
      const { error } = await supabase.from('photos').insert({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        type: resourceType,
      });

      if (error) {
        console.error('Chyba při ukládání do Supabase:', error.message);
      }

      uploadedUrls.push(uploadResult.secure_url);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error('Chyba při uploadu:', error);
    return NextResponse.json({ error: 'Upload selhal' }, { status: 500 });
  }
}

// 🗑️ Smazání
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const public_id = searchParams.get('public_id');

    if (!public_id) {
      return NextResponse.json({ error: 'Chybí public_id' }, { status: 400 });
    }

    // Smazání z Cloudinary
    const cloudinaryResult = await cloudinary.uploader.destroy(public_id, {
      resource_type: 'auto',
    });

    // Smazání z databáze
    const { error } = await supabase.from('photos').delete().eq('public_id', public_id);

    if (error) {
      console.error('Supabase chyba:', error.message);
      return NextResponse.json({ error: 'Chyba při mazání z DB' }, { status: 500 });
    }

    return NextResponse.json({ success: true, cloudinaryResult });
  } catch (error) {
    console.error('Chyba při mazání:', error);
    return NextResponse.json({ error: 'Mazání selhalo' }, { status: 500 });
  }
}
