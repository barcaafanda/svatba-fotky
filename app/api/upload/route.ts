import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import { createClient } from '@supabase/supabase-js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Supabase init
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY! // použij service_role key pro zápis
);

// Nahrání
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'svatba' },
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
      });

      if (error) {
        console.error('Supabase insert error:', error.message);
      }

      uploadedUrls.push(uploadResult.secure_url);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// Smazání
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const public_id = searchParams.get('public_id');

    if (!public_id) {
      return NextResponse.json({ error: 'Missing public_id' }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== 'ok' && result.result !== 'not found') {
      return NextResponse.json({ error: 'Cloudinary deletion failed' }, { status: 500 });
    }

    // Smazání z databáze
    const { error } = await supabase.from('photos').delete().eq('public_id', public_id);
    if (error) {
      console.error('Supabase delete error:', error.message);
    }

    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}
