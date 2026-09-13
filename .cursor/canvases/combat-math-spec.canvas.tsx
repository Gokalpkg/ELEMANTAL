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
  Select,
  Stack,
  Stat,
  Table,
  Text,
  useCanvasState,
} from "cursor/canvas";

type Section = "dmg" | "matrix" | "special" | "arch";

export default function CombatMathSpec() {
  const [section, setSection] = useCanvasState<Section>("combat-section", "dmg");

  return (
    <Stack gap={20} style={{ padding: 20, maxWidth: 1000 }}>
      <Stack gap={6}>
        <H1>Combat math ve mimari</H1>
        <Text tone="secondary">
          Sprint spesifikasyonu. Tam metin: COMBAT_MATH_AND_ARCHITECTURE.md
        </Text>
      </Stack>

      <RowStats />

      <Select
        value={section}
        onChange={(v) => setSection(v as Section)}
        options={[
          { value: "dmg", label: "1. Hasar formulleri" },
          { value: "matrix", label: "2. Status matrisi" },
          { value: "special", label: "3. Ozel mekanikler" },
          { value: "arch", label: "4. Mimari" },
        ]}
      />

      {section === "dmg" && <DmgSection />}
      {section === "matrix" && <MatrixSection />}
      {section === "special" && <SpecialSection />}
      {section === "arch" && <ArchSection />}

      <Divider />
      <Text size="small" tone="tertiary">
        Kaynak: Elementer takeDamage / applyEffect / activateSkill + 2026-09-14 spec. Füzyon toplanmaz; softMul yigilan bonuslari keser.
      </Text>
    </Stack>
  );
}

function RowStats() {
  return (
    <Grid columns={4} gap={10}>
      <Stat value="10" label="Pipeline adimi" />
      <Stat value="1.28" label="Hibrit tavan (harmony)" />
      <Stat value="2.0" label="Normal crit carpani" />
      <Stat value="2.35" label="Kul ambush crit" />
    </Grid>
  );
}

function DmgSection() {
  return (
    <Stack gap={16}>
      <H2>Temel hasar</H2>
      <Callout tone="info" title="Sira sabit">
        base + waveFlat, sonra elemScale, fusionMul, softMul(eklenti), crit, resist, reaction, situational. Floor, min 1.
      </Callout>
      <Text>
        softMul(linear) = 1 + ln(1 + max(0, linear) * 1.85). Taban hasara degil, yigilan yuzdelere uygulanir. linear=0.50 → ~1.66; linear=2.00 → ~2.55.
      </Text>

      <H3>Füzyon — toplanmaz</H3>
      <Table
        headers={["Parca", "Formul"]}
        striped
        rows={[
          ["blend", "0.55 * scaleRoot + 0.45 * scaleSec"],
          ["harmony", "1 - |scaleRoot - scaleSec| / (scaleRoot + scaleSec)"],
          ["hybrid", "1 + 0.28 * harmony  (1.00 .. 1.28)"],
          ["Saf prim", "1.12 (hybrid 1.28 verilmez)"],
          ["Leke vurus", "blend * hybrid * 0.86"],
        ]}
      />

      <H3>Kritik ve direnc</H3>
      <Grid columns={2} gap={12}>
        <Card>
          <CardHeader>critChance</CardHeader>
          <CardBody>
            <Text size="small">
              min(0.85, 0.10 + critMod + comboBonus). Ambush roll atlar. DoT crit atamaz. Normal critMul = 2.0.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>resistMul</CardHeader>
          <CardBody>
            <Text size="small">
              max(0.35, 1 - (armor - shred)). armored armor=0.45. Ayni kalkan 0.40, zayif kalkan 1.48.
            </Text>
          </CardBody>
        </Card>
      </Grid>

      <H3>T1 → T3</H3>
      <Text size="small" tone="secondary">
        Beklenen oyuncu DPS artisi ~2.4–2.8x. Dusman cani ENEMY_HP_MUL=4 ve dalga hpScale ile ayrica buyur. wave * 0.22 softcap disinda kalir.
      </Text>
    </Stack>
  );
}

function MatrixSection() {
  return (
    <Stack gap={16}>
      <H2>Status tanimlari</H2>
      <Table
        headers={["id", "Element", "Stack", "Etki"]}
        striped
        stickyHeader
        rows={[
          ["burn", "Ates", "1-5", "0.50s tick, 0.22 * hitDmgRef * stack"],
          ["wet", "Su", "1", "move 0.70; sok/reaksiyon kapisi"],
          ["shock", "Elektrik", "1-3", "peek 1.18^stack; islakken 1.55 + zincir"],
          ["poison / root", "Doga", "1-4 / 1", "DoT + shred; kok move=0"],
          ["shred / stun", "Toprak", "0-0.40", "armor azalir; stun CC"],
          ["mark", "Karanlik", "birikir", "stored += 0.22*dealt; patlat *1.15"],
        ]}
      />

      <H3>Capraz reaksiyon (ozet)</H3>
      <Table
        headers={["Durum + vurus", "Sonuc"]}
        striped
        rows={[
          ["burn + water  /  wet + fire", "Buhar patlamasi, consume ikisi, burstK 0.90, r 54"],
          ["wet + storm", "reactionMul 1.55, zincir +2, consume yok"],
          ["shock + fire", "yanma tick *1.10"],
          ["wet + nature", "Bataklik, move 0.50, root +0.40s"],
          ["wet + earth", "Camur, shred +0.10"],
          ["shock + void", "Yarik 1.25, mark %50 patlar"],
          ["mark + void", "Patlat stored*1.15, consume mark"],
          ["root + earth", "Diken kilit, stun 0.20s (boss yok)"],
        ]}
      />
      <Callout tone="warning" title="Buhar kurali">
        Iki status birden gerekir. Su vurusu once wet uygular, sonra reaksiyon bakar. Peek consume reaksiyonlarda 1.0; burst ayri event.
      </Callout>
    </Stack>
  );
}

function SpecialSection() {
  return (
    <Stack gap={16}>
      <H2>Uc ozel mekanik</H2>

      <H3>Buhar — steamPressure 0-100</H3>
      <Table
        headers={["Olay", "Delta"]}
        rows={[
          ["Auto vurus", "+3.0"],
          ["Skill", "+14.0"],
          ["Yanma tick / islak", "+1.0 / +2.0"],
          ["1.5s hasarsiz", "+4.0 / s"],
          ["Hasar al", "-8.0"],
          ["Combat sizma (>20)", "-2.2 / s"],
        ]}
      />
      <Table
        headers={["Band", "Aralik", "Etki"]}
        rowTone={["neutral", "info", "warning", "danger"]}
        rows={[
          ["low", "0-39", "skillMul 1.00"],
          ["mid", "40-79", "skillMul 1.12, koni x1.25"],
          ["crit", "80-99", "burst r=90, stun 0.60, bar=25"],
          ["over", "100", "3s asiri kaynama, self 2/0.5s, bar=40"],
        ]}
      />
      <Text size="small">
        burstDmg = skillBase * (1.35 + pressure/100 * 0.40)
      </Text>

      <H3>Kul — ashVeil</H3>
      <Table
        headers={["Alan", "Deger"]}
        rows={[
          ["Sure / CD", "1.60 s / 16.0 s"],
          ["Hareket", "x1.10"],
          ["Tespit r", "52 (boss 90, tesla 120)"],
          ["Sis icinde tespit", "x0.55"],
          ["Ambush crit", "2.35 (boss 1.20)"],
          ["Kirilma", "hasar, skill, auto — hareket kirmaz"],
        ]}
      />

      <H3>Manyetizma carpışma</H3>
      <Text>
        mass = (r / 14.5)^2. Zit kutup, dist &lt; 28:
      </Text>
      <Text size="small">
        crashDmg = skillDmg * 0.55 * (0.65 + 0.35 * clamp(relSpeed/3.2, 0, 1.4)) * (0.75 + 0.25 * reducedMass)
      </Text>
      <Text size="small" tone="secondary">
        reducedMass = mA*mB / (mA+mB). Boss carpısmaz. Max 8 kutup, 5.0 s.
      </Text>
    </Stack>
  );
}

function ArchSection() {
  return (
    <Stack gap={16}>
      <H2>Moduler servisler</H2>
      <Table
        headers={["Servis", "Is", "Eski kanca"]}
        striped
        rows={[
          ["DamagePipeline", "10 adimli computeHitDamage", "p.dmg + takeDamage + markHitDmg"],
          ["StatusStore", "apply / tick / peek", "applyEffect"],
          ["ReactionResolver", "tablo peek + consume + burst", "tryReactions"],
          ["FusionResolver", "pair → class + fusionMul", "comboInfo / AUTO_FUSE"],
          ["SynergyManager", "kart suzgeci, graft", "elTree / rewards"],
          ["SteamGauge / AshVeil / MagnetSystem", "sinif kaynaklari", "yeni"],
        ]}
      />

      <H3>Mermi akisi</H3>
      <Text size="small">
        overlap → HitEvent → peek reactionMul → DamagePipeline → hp → StatusStore.apply → ReactionResolver.resolve → (BurstEvent) → gauges → prune
      </Text>

      <H3>Sprint sirasi</H3>
      <Table
        headers={["#", "Is"]}
        rows={[
          ["1", "STATUS_DEFS + StatusStore"],
          ["2", "REACTION_TABLE + markHitDmg peek"],
          ["3", "computeHitDamage tek fonksiyon"],
          ["4", "fusionMul currentAuto / activateSkill"],
          ["5", "softMul eklenti"],
          ["6", "Steam / Ash / Magnet"],
          ["7", "SynergyManager kavsak + graft"],
        ]}
      />
      <Callout tone="neutral" title="Restart">
        status, steamPressure, ashVeil, kutuplar sifir. Reklamla devam korur.
      </Callout>
    </Stack>
  );
}
