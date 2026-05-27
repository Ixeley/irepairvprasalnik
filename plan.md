# Stran s povpraševanjem za popravilo – iRepair.si

Izbrana oblikovna smer: **Industrijska delavnica** (modra primarna #1e6fd9, Inter + JetBrains Mono, "01–04" oštevilčeni koraki, temen stranski panel "Zakaj iRepair?").

## Kaj bo na strani

Ena celotna pristajalna stran (`/`) s sledečimi sekcijami:

1. **Glava (nav)** – logotip iR, povezave (Popravila, Rezervni deli, Kontakt) in oznaka "STATUS: DELAVNICA ODPRTA".
2. **Hero** – naslov "Oddajte povpraševanje brezplačno" + kratek opis storitve.
3. **Obrazec** v štirih oštevilčenih korakih:
   - 01 Vrsta naprave (Mobilni telefon / Prenosnik / Tablica)
   - 02 Znamka (Apple, Samsung, Xiaomi, HP, Dell, Lenovo, Asus, Ostalo)
   - 03 Podrobnosti (model, opis težave, opcijska fotografija)
   - 04 Kontakt (ime, e-pošta, telefon, GDPR soglasje)
   - CTA "Pošlji povpraševanje"
4. **Stranski panel (sticky)** – obljuba: 24h odziv, brezplačna diagnostika, 12-mesečna garancija, brezplačen prevzem; kontakt blok.
5. **Footer** – avtorske pravice + povezave (Zasebnost, Pogoji, Lokacije).

Vsa besedila so v slovenščini.

## Tehnične podrobnosti

- **Datoteke**:
  - `src/routes/index.tsx` – celotna stran kot React komponenta, prepisana 1:1 iz izbranega prototipa (ohranim postavitev, hierarhijo, števce 01–04 in stranski panel).
  - `src/routes/__root.tsx` – posodobim `<title>` in meta opise v slovenščini; dodam Google Fonts (Inter + JetBrains Mono).
  - `src/styles.css` – dodam barvne žetone iz prototipa (primary modra `hsl(215 90% 45%)`, mehka background `hsl(220 15% 98%)`) ter `font-sans: Inter`, `font-mono: JetBrains Mono`. Ohranim obstoječo shadcn shemo, le prepišem ključne vrednosti.
- **Stanje obrazca**: lokalni React state, ob "Pošlji" pokažem `sonner` toast "Povpraševanje poslano" (brez backend povezave – obrazec je vizualni predogled).
- **Slike**: namesto `data-lov-image-placeholder` za upload polje uporabim preprost prazen drop-zone (brez generirane slike – funkcionalni placeholder za nalaganje datoteke).
- **SEO**: en `<h1>`, semantične sekcije, slovenske meta oznake.
- Brez backend integracije (Lovable Cloud), brez baz – zgolj predogled, kot je zahteval uporabnik. Pošiljanje obrazca (e-mail/shramba) lahko dodamo v naslednjem koraku.

## Po potrditvi

Preklopi v build mode in zgradil bom stran.