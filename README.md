# Photo Upload App

Tento projekt je jednoduchá aplikace pro anonymní nahrávání fotek přes UploadThing a Next.js.

## Jak používat

1. Zaregistruj se na [UploadThing](https://uploadthing.com) a získej `UPLOADTHING_SECRET` a `UPLOADTHING_APP_ID`.

2. Vytvoř `.env` soubor v kořenovém adresáři a přidej:
```
UPLOADTHING_SECRET=tvuj-secret
UPLOADTHING_APP_ID=tvuj-app-id
```

3. Nainstaluj závislosti:
```
npm install
```

4. Spusť aplikaci lokálně:
```
npm run dev
```

## Nasazení

1. Nahraj repozitář na GitHub.

2. Na GitHubu přidej do repozitáře tajný klíč `VERCEL_TOKEN` (Settings > Secrets and variables > Actions).

3. Propoj repozitář s [Vercel](https://vercel.com/import/git).

4. Přidej v nastavení projektu na Vercelu environment variables `UPLOADTHING_SECRET` a `UPLOADTHING_APP_ID`.

5. Každý push do větve `main` spustí automatický deploy.

## QR kód

Po nasazení získáš URL aplikace, kterou můžeš použít k vytvoření QR kódu na stránkách jako [https://qrcode-monkey.com](https://qrcode-monkey.com).