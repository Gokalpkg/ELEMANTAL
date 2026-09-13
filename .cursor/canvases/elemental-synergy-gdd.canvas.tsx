import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Select,
  Stack,
  Stat,
  Table,
  Text,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

type Section =
  | "loop"
  | "roots"
  | "pure"
  | "fusion"
  | "mechs"
  | "tier3";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "loop", label: "Dongu ve UI" },
  { id: "roots", label: "6 Kok" },
  { id: "pure", label: "Saf Yol" },
  { id: "fusion", label: "Füzyon" },
  { id: "mechs", label: "Ozel mekanikler" },
  { id: "tier3", label: "Tier 3 graft" },
];

export default function ElementalSynergyGdd() {
  const theme = useHostTheme();
  const [section, setSection] = useCanvasState<Section>("gdd-section", "loop");

  return (
    <Stack gap={20} style={{ padding: 20, maxWidth: 980 }}>
      <Stack gap={6}>
        <H1>Elementel yetenek agaci</H1>
        <Text tone="secondary">
          Elementer hedef mimari. Run basina en fazla 2 element. Tam metin: ELEMENTAL_SYNERGY_GDD.md
        </Text>
      </Stack>

      <Row gap={8} align="center" wrap>
        <Stat value="6" label="Kok element" />
        <Stat value="1" label="Ikinci element hakki" />
        <Stat value="6" label="Imza füzyon" />
        <Stat value="1" label="Tier 3 graft / run" />
      </Row>

      <Select
        value={section}
        onChange={(v) => setSection(v as Section)}
        options={SECTIONS.map((s) => ({ value: s.id, label: s.label }))}
      />

      {section === "loop" && <LoopSection />}
      {section === "roots" && <RootsSection />}
      {section === "pure" && <PureSection />}
      {section === "fusion" && <FusionSection />}
      {section === "mechs" && <MechsSection />}
      {section === "tier3" && <Tier3Section />}

      <Divider />
      <Text size="small" tone="tertiary">
        Kaynak: Elementer index.html (ELEMENTS, COMBO_KITS, restartRun) + 2026-09-14 GDD. Restart run lock ve ozel barlari siler; reklamla devam korur.
      </Text>
      <Text size="small" tone="quaternary" style={{ color: theme.text.quaternary }}>
        Canvas, sohbet disinda duran canli bir gorunumdur.
      </Text>
    </Stack>
  );
}

function LoopSection() {
  return (
    <Stack gap={16}>
      <H2>Temel dongu</H2>
      <Callout tone="info" title="Sert kilit">
        Kok run boyu degismez. Diger 5 elementten yalnizca biri alinir veya hicbiri alinmaz. Ucuncu element yok. Tier 3 ucuncu element acmaz; kilitli bir mekanigi asirir.
      </Callout>

      <H3>Seviye / karar matrisi</H3>
      <Table
        headers={["An", "Karar", "Kilit"]}
        striped
        stickyHeader
        rows={[
          ["Run basi", "6 karttan 1 kok", "Auto + kok status"],
          ["Lv 2-4", "Cekirdek eklenti / auto evrimi", "Sinif yok, ikinci yok"],
          ["Lv 5 kavsak", "Saf Yol veya 1 ikincil", "Path id yazilir, kalan elementler fog"],
          ["Lv 7 / 13 / 20", "Imza skill teklifi", "COMBO_KITS yonune gore sekil"],
          ["Lv 14+", "Nadir graft %12", "Run'da en fazla 1"],
          ["Olum", "Reklamla devam veya Restart", "Devam korur, Restart siler"],
        ]}
      />

      <H3>Agac ekrani (3 katman)</H3>
      <Grid columns={3} gap={12}>
        <Card>
          <CardHeader>Kok seridi</CardHeader>
          <CardBody>
            <Text size="small">
              6 chip. Secilen on, ikincil owned, gerisi fog. Fog tiklayinca “bu run kilitli”.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Sinif omurgasi</CardHeader>
          <CardBody>
            <Text size="small">
              T1 cekirdek, T2 imza, T3 graft yuvasi, Sig. Dolu yesil, siradaki sari.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Kart izgarasi</CardHeader>
          <CardBody>
            <Text size="small">
              3 teklif. Filtre: element kilidi, sinif havuzu, graft kapisi. Reroll kilidi acmaz.
            </Text>
          </CardBody>
        </Card>
      </Grid>

      <H3>Auto kurali (kod degisikligi)</H3>
      <Text>
        Bugun autoRoots her kilitli kombodan a ve b ekliyor. Hedefte auto her zaman koktur. Ikincil yalnizca her N. atista leke birakir. Restart: restartRun → startRun → beginRunWithKit; lockedCombos, pendingElement, playerSig, pressure, sis, kutup, taret sifir.
      </Text>
    </Stack>
  );
}

function RootsSection() {
  return (
    <Stack gap={16}>
      <H2>Alti kok — baslangic auto</H2>
      <Text tone="secondary">
        Hepsi duz mermi. Ozel atis Saf/Hibrit dugumleriyle siser. Status, elementin kimligidir; ayni status iki yoldan uretilmez.
      </Text>
      <Table
        headers={["Id", "Ad", "Status", "Menzil / tempo", "Her N ozel", "Kalkan zayif"]}
        striped
        stickyHeader
        rows={[
          ["fire", "Ates", "Yakma", "250 / int 17", "5 burst", "Su"],
          ["water", "Su", "Yavas", "310 / int 22", "4 freeze", "Elektrik"],
          ["storm", "Elektrik", "Sok", "285 / int 15", "4 zincir", "Toprak"],
          ["nature", "Doga", "Can calma", "265 / int 21", "4 sap", "Ates"],
          ["earth", "Toprak", "Stun", "215 / int 28", "4 heavy", "Doga"],
          ["void", "Karanlik", "Cekme", "255 / int 20", "4 mikro karadelik", "Elektrik"],
        ]}
      />
      <Callout tone="neutral" title="Tekrar oynanabilirlik">
        Secilmeyen 4 (Saf'ta 5) element o run'da auto, skill, status ve biyom pakti olarak yoktur.
      </Callout>
    </Stack>
  );
}

function PureSection() {
  return (
    <Stack gap={16}>
      <H2>Saf Yol — ikincil hakki yanar</H2>
      <Table
        headers={["Sinif", "Kok", "Rol", "Imza skill", "Omurga"]}
        striped
        stickyHeader
        rows={[
          ["Lav", "Ates", "DPS + sinirli lifesteal", "Alev Puf", "Yakma tavan 8, 5. atis 3'lu burst, vurus %4 can"],
          ["Okyanus / Buz", "Su", "CC, itme", "Tsunami Itme", "Dolu auto, 3 yavas = don, su tabakasi"],
          ["Yildirim", "Elektrik", "Harita AoE", "Yildirim Oku", "Sicrama 4, tek hedef zayif"],
          ["Filiz", "Doga", "Taret + infaz", "Sarmasik Infaz", "Max 3 taret, %45 hasar, lavda 2x hasar yer"],
          ["Tas", "Toprak", "Tank / CC", "Kaya Sarma", "+18 can / dugum, -6% hiz, yakin ezme"],
          ["Golge", "Karanlik", "Suikast", "Olay Ufku", "<%35 cana +%40, 1.2s shadowStep"],
        ]}
      />
      <Text size="small" tone="secondary">
        Filiz taretleri oyuncu DPS tavaninin %80'ini gecemez. Boss knock 0.05, stun tavan 0.45s.
      </Text>
    </Stack>
  );
}

function FusionSection() {
  return (
    <Stack gap={16}>
      <H2>Alti imza füzyon</H2>
      <Text>
        A→B ve B→A ayni sinifi acar, skill sekli COMBO_KITS yonune gore degisir. Diger 9 cift sinif acmaz; destek leke olarak map edilir.
      </Text>
      <Table
        headers={["Sinif", "Cift", "Kok→ikincil skill", "Ters yon", "His"]}
        striped
        stickyHeader
        rows={[
          ["Buhar", "Ates + Su", "Buhar Konisi", "Kaynar Dalga", "Basinc, mermi silme"],
          ["Manyetizma", "Toprak + Elektrik", "Manyetik Cekim", "Demir Cekis (oyuncuya)", "Cek / it / carpis"],
          ["Kul", "Toprak + Ates", "Lav Havuzu", "Magma Patlama", "Sis, suikast"],
          ["Plazma", "Ates + Elektrik", "Plazma Cizgisi", "Ince Yildirim", "Delici tek hedef"],
          ["Girdap", "Su + Karanlik", "Abyssal Girdap", "ayni kind", "Cek + bogma"],
          ["Bataklik Filizi", "Toprak + Su", "Camur Batakligi", "Sel Ezmesi", "Yavas alan + tohum"],
        ]}
      />

      <H3>Destek cift → map</H3>
      <Table
        headers={["Cift", "Mevcut skill", "Map"]}
        striped
        rows={[
          ["Ates + Doga", "Kivilcim / Yanan Orman", "Leke; sinif yok"],
          ["Ates + Karanlik", "Entropi / Kara Alev", "Infaz lekesi"],
          ["Su + Elektrik", "Iletken / Zincir Sok", "Buhar veya Yildirim lekesi"],
          ["Su + Doga", "Sifali Yagmur / Su Isin", "Surdurulebilirlik"],
          ["Toprak + Doga", "Diken / Kok", "CC taret lekesi"],
          ["Toprak + Karanlik", "Yercekimi / Meteor", "Ezme / cekim"],
          ["Doga + Elektrik", "Polen / Statik Diken", "AoE hiz"],
          ["Doga + Karanlik", "Ruh Paraziti", "Can + kalkan"],
          ["Elektrik + Karanlik", "Kozmik Ark / Yarık", "Delici yarik"],
        ]}
      />
    </Stack>
  );
}

function MechsSection() {
  return (
    <Stack gap={16}>
      <H2>Uc ozel mekanik</H2>

      <H3>Buhar — Basinc 0–100</H3>
      <Table
        headers={["Esik", "Ad", "Etki"]}
        rows={[
          ["0-39", "Buhar", "Koni mermi siler"],
          ["40-79", "Sikisik", "Koni x1.25, islak +%20, her 3. auto kisa koni"],
          ["80-99", "Kritik", "Sonraki skill 90px patlama + 0.6s stun, bar 25"],
          ["100", "Asiri kaynama", "3s auto x0.7, self 2 hasar / 0.5s, sonra 40"],
        ]}
        rowTone={["neutral", "info", "warning", "danger"]}
      />
      <Text size="small" tone="secondary">
        Auto +3, yakma tick +1, islak +2, skill +14, 1.5s hasarsiz +4/s, hasar -8. Saf Ates/Su bu bari almaz.
      </Text>

      <H3>Kul — Sis ve ashVeil</H3>
      <Grid columns={2} gap={12}>
        <Card>
          <CardHeader>Sis alani</CardHeader>
          <CardBody>
            <Text size="small">
              Lav/magma zone. Nisan -45%, cikis vurusu +%55 (boss +%20). Shooter menzil -30. Sis ici 3 yakma/s. Tesla ve firtina yariçap -25%.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>ashVeil</CardHeader>
          <CardBody>
            <Text size="small">
              T2, 1.6s gizlilik, 16s CD. Hasar / skill / auto kirar, hareket kirmaz. Golge'nin shadowStep'inden ayri. Infaz yok; Kul cam top + tek hedef.
            </Text>
          </CardBody>
        </Card>
      </Grid>

      <H3>Manyetizma — kutup fizigi</H3>
      <Table
        headers={["Kural", "Sayi"]}
        rows={[
          ["Skill vurusu N veya S basar, sonraki skill tersler", "5s bayrak"],
          ["Ayni kutup iter", "force 10 / elite 6 / boss 0"],
          ["Zit kutup ceker, <28px carpisma", "0.55 x skill.dmg, stun 0.25s"],
          ["Kok Elektrik", "Dusmanlari oyuncuya ceker"],
          ["Kok Toprak", "Alan merkezine ceker"],
          ["Tavan", "8 kutuplu dusman; taret ve boss carpismaz"],
        ]}
      />
    </Stack>
  );
}

function Tier3Section() {
  return (
    <Stack gap={16}>
      <H2>Tier 3 — graft, ucuncu element degil</H2>
      <Callout tone="warning" title="Kapı">
        Lv14+, run'da graft yoksa teklifte %12. Graft kilitli elementin auto ve status'unu vermez. Sinifin ana statini genelde %10-15 kisar, zayif yonunu kapatir.
      </Callout>

      <Table
        headers={["Graft", "Kosul", "Ne asirir", "Bedel"]}
        striped
        stickyHeader
        rows={[
          ["Kul Gubre", "Kul", "Yanmaz tohum → kul taret, sis icinde +%35 atis", "Sis disinda %30 yavas, su 2x eritir"],
          ["Iyon Cekirdegi", "Buhar", "Basinc ≥40 skill kutup basar, 80+ carpisma x1.35", "Tek hedef zayiflar, yigin ezer"],
          ["Cokus Yarigi", "Plazma", "Cizgi ucunda 0.8s mini girdap, 2. cizgi x1.25", "Ilk cizgi DPS -12%, boss pull yok"],
          ["Kul Ufku", "Girdap", "Girdap bitince 1.4s kul sisi, bogulmus+yanik +%30", "Pull -15%"],
          ["Iletken Kok", "Manyetizma", "Carpisan zit kutuplar 6s kok birakir (max 3)", "Kok oyuncu kacisini da tıkar"],
        ]}
      />

      <Row gap={8} wrap>
        <Pill tone="neutral" active={false} size="sm">Doga chip acilmaz</Pill>
        <Pill tone="neutral" active={false} size="sm">Restart graft siler</Pill>
        <Pill tone="neutral" active={false} size="sm">Reklamla devam korur</Pill>
      </Row>
    </Stack>
  );
}
