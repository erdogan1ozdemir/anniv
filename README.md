# Yarim'in Bahçesi

> Yıldönümü hediyesi olarak hazırlanan kişisel timeline web uygulaması. Şifreli, sadece ikimiz görüyoruz.

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion
- next/font (Cormorant Garamond + Inter + Caveat)
- Coastal Garden palet sistemi (3 tema: Coastal light/dark, Wild Meadow, Vintage)

## Geliştirme

```bash
cd app
cp .env.example .env.local   # şifreyi düzenle
npm install
npm run dev
```

`http://localhost:3000` → `/giris` (şifre input). `.env.local` içindeki `BAHCE_PASSWORD` değerini girince ana ekrana (`/`) yönlendirir.

## Yapı

```
app/
├── api/auth/        Şifre POST/DELETE
├── ani/[id]/        Anı detay sayfası (magazin layout)
├── bugun/           Geçmiş yıllarda bugün
├── galeri/          Foto-only masonry grid
├── giris/           Login (Jedi portresi + şifre)
├── harita/          Hayali parchment harita
├── jedi/            Jedi profili
├── kategoriler/     Tüm etiketler grid
├── random/          Rastgele anı yönlendirici
├── globals.css      Coastal Garden tokens + animasyonlar
├── layout.tsx       Font + meta + theme yükleme
└── page.tsx         Tree timeline ana sayfa

components/
├── screens/         TreeTimeline, MemoryDetail, LoginForm
├── svg/             Botanic, JediSilhouette
└── ui/              IOSFrame, BottomNav

lib/
├── data.ts          memories.json okuyucu, related logic
└── categories.ts    kategori meta + Türkçe tarih formatlama

types/index.ts       TypeScript memory tipleri

public/data/
├── memories.json    95 anı kartı (deep research'ten)
├── glossary.json    özel kelime sözlüğü
├── locations.json   yer logu
├── music.json       müzik logu
└── maker.json       maker projeleri logu
```

## Veri Pipeline

`/public/data/*.json` dosyaları `bahcemiz/` klasöründeki deep research çıktılarından import edildi. Anı kartları `id, date, title, subtitle, category, tags, story, quote, whatsapp_excerpt, location, song_ref, mood, is_pinned, ai_confidence` alanlarına sahip.

İçerik güncelleme:
1. `bahcemiz/20_master_anilar.json` dosyasını güncelle
2. `cp` ile `app/public/data/memories.json` üzerine yaz
3. `npm run build` veya hot reload otomatik yansır

## Deployment (Vercel)

1. `vercel link` → projeyi bağla
2. Environment variables: `BAHCE_PASSWORD`, `BAHCE_SECRET`
3. `vercel deploy` veya GitHub push otomatik

## Notlar

- Tüm metinlerde em dash (—) yok, düz tire (-) kullan
- Mobile-first (iPhone 13/11 öncelikli)
- `prefers-reduced-motion` desteği var
- Optional alanlar (şarkı, lokasyon, whatsapp) yoksa o bölüm hiç render edilmez
- v2 planı: Supabase + canlı yorum + etiket önerisi (şu an donmuş hediye)

## Kararlar Geçmişi

Bkz: `../yildonumu-timeline-app-brief.md`, `../claude-design-handoff.md`, `../whatsapp-deep-research-prompt.md`.
