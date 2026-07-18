import React, { useState, useEffect, useMemo } from "react";

/* ============================================================
   DARIJA — apprentissage du marocain parlé
   Palette : zellige de Marrakech
   ============================================================ */

const C = {
  ink: "#1B2B2A",       // vert-noir de la médina
  clay: "#C4552E",      // terre cuite / tadelakt
  saffron: "#E4A11B",   // safran
  mint: "#0F8A7E",      // vert menthe / zellige
  sand: "#F3EADC",      // plâtre chaux
  paper: "#FBF6EE",
  deep: "#123B47",      // bleu Majorelle assombri
};

/* ---------------- Contenu pédagogique ---------------- */

const LESSONS = [
  {
    id: "salam",
    title: "Salutations",
    icon: "☾",
    words: [
      { d: "Salam", ph: "sa-LAM", ar: "سلام", fr: "Salut", note: "Le passe-partout, à toute heure." },
      { d: "Sbah l'khir", ph: "SBAH l-KHIR", ar: "صباح الخير", fr: "Bonjour (matin)" },
      { d: "Msa l'khir", ph: "MSA l-KHIR", ar: "مساء الخير", fr: "Bonsoir" },
      { d: "Labas ?", ph: "la-BAS", ar: "لاباس؟", fr: "Ça va ?", note: "Litt. « pas de mal ? »" },
      { d: "Labas, hamdullah", ph: "la-BAS ham-dou-LLAH", ar: "لاباس الحمد لله", fr: "Ça va, Dieu merci" },
      { d: "Bslama", ph: "bs-la-MA", ar: "بسلامة", fr: "Au revoir" },
      { d: "Chokran", ph: "CHOU-kran", ar: "شكرا", fr: "Merci" },
      { d: "Bla jmil", ph: "bla JMIL", ar: "بلا جميل", fr: "De rien" },
      { d: "Afak", ph: "a-FAK", ar: "عفاك", fr: "S'il te plaît" },
      { d: "Smeh liya", ph: "SMEH li-YA", ar: "سمح ليا", fr: "Excuse-moi" },
    ],
  },
  {
    id: "base",
    title: "Mots essentiels",
    icon: "◆",
    words: [
      { d: "Ah / Iyeh", ph: "ah / i-YEH", ar: "إيه", fr: "Oui" },
      { d: "La", ph: "la", ar: "لا", fr: "Non" },
      { d: "Wakha", ph: "WA-kha", ar: "واخا", fr: "D'accord", note: "Le mot le plus utile du Maroc." },
      { d: "Bzzaf", ph: "bez-ZAF", ar: "بزاف", fr: "Beaucoup / trop" },
      { d: "Chwiya", ph: "chwi-YA", ar: "شوية", fr: "Un peu" },
      { d: "Daba", ph: "DA-ba", ar: "دابا", fr: "Maintenant" },
      { d: "Ghedda", ph: "GHED-da", ar: "غدا", fr: "Demain" },
      { d: "L'bareh", ph: "l-BA-reh", ar: "البارح", fr: "Hier" },
      { d: "Mzyan", ph: "mez-YAN", ar: "مزيان", fr: "Bien / bon" },
      { d: "Machi mzyan", ph: "MA-chi mez-YAN", ar: "ماشي مزيان", fr: "Pas bien" },
      { d: "Inchallah", ph: "in-cha-LLAH", ar: "إن شاء الله", fr: "Si Dieu veut" },
      { d: "Yallah", ph: "YA-llah", ar: "يالله", fr: "Allons-y" },
    ],
  },
  {
    id: "souk",
    title: "Au souk",
    icon: "⌂",
    words: [
      { d: "Bch'hal ?", ph: "bech-HAL", ar: "بشحال؟", fr: "Combien ?" },
      { d: "Ghali bzzaf", ph: "GHA-li bez-ZAF", ar: "غالي بزاف", fr: "C'est trop cher" },
      { d: "Nqes chwiya", ph: "NQESS chwi-YA", ar: "نقص شوية", fr: "Baisse un peu" },
      { d: "Akher taman ?", ph: "A-kher ta-MAN", ar: "آخر ثمن؟", fr: "Dernier prix ?" },
      { d: "Bghit hadi", ph: "BGHIT HA-di", ar: "بغيت هادي", fr: "Je veux celle-ci" },
      { d: "Kanchouf ghir", ph: "kan-CHOUF ghir", ar: "كنشوف غير", fr: "Je regarde seulement" },
      { d: "Flous", ph: "flouss", ar: "فلوس", fr: "Argent" },
      { d: "Derham", ph: "DER-ham", ar: "درهم", fr: "Dirham" },
      { d: "Andek ... ?", ph: "AN-dek", ar: "عندك؟", fr: "Tu as ... ?" },
      { d: "Safi", ph: "SA-fi", ar: "صافي", fr: "Ça suffit / c'est bon" },
    ],
  },
  {
    id: "makla",
    title: "Manger & boire",
    icon: "◎",
    words: [
      { d: "Makla", ph: "MAK-la", ar: "ماكلة", fr: "Nourriture" },
      { d: "Ma", ph: "ma", ar: "ما", fr: "Eau" },
      { d: "Atay", ph: "a-TAY", ar: "أتاي", fr: "Thé à la menthe" },
      { d: "Qahwa", ph: "QAH-wa", ar: "قهوة", fr: "Café" },
      { d: "Khobz", ph: "khobz", ar: "خبز", fr: "Pain" },
      { d: "Lham", ph: "l-HAM", ar: "لحم", fr: "Viande" },
      { d: "Hout", ph: "hout", ar: "حوت", fr: "Poisson" },
      { d: "Ana ji3an", ph: "A-na ji-3AN", ar: "أنا جيعان", fr: "J'ai faim" },
      { d: "Ana 3atchan", ph: "A-na 3at-CHAN", ar: "أنا عطشان", fr: "J'ai soif" },
      { d: "Ldid bzzaf", ph: "l-DID bez-ZAF", ar: "لذيذ بزاف", fr: "C'est délicieux" },
      { d: "L'hsab afak", ph: "l-HSAB a-FAK", ar: "الحساب عفاك", fr: "L'addition s'il vous plaît" },
    ],
  },
  {
    id: "trik",
    title: "Se déplacer",
    icon: "→",
    words: [
      { d: "Fin ... ?", ph: "fin", ar: "فين؟", fr: "Où est ... ?" },
      { d: "Fin kayn l'bit ?", ph: "fin KAYN l-BIT", ar: "فين كاين البيت؟", fr: "Où sont les toilettes ?" },
      { d: "Nichan", ph: "ni-CHAN", ar: "نيشان", fr: "Tout droit" },
      { d: "Limen", ph: "LI-men", ar: "ليمن", fr: "À droite" },
      { d: "Lisser", ph: "LI-sser", ar: "ليسر", fr: "À gauche" },
      { d: "Qrib", ph: "qrib", ar: "قريب", fr: "Proche" },
      { d: "B3id", ph: "b-3ID", ar: "بعيد", fr: "Loin" },
      { d: "Taxi", ph: "TAK-si", ar: "طاكسي", fr: "Taxi" },
      { d: "Wqef hna", ph: "W-QEF h-NA", ar: "وقف هنا", fr: "Arrête-toi ici" },
      { d: "Ana tlft", ph: "A-na TLEFT", ar: "أنا تلفت", fr: "Je suis perdu" },
    ],
  },
  {
    id: "nas",
    title: "Les gens",
    icon: "☉",
    words: [
      { d: "Chnou smitek ?", ph: "ch-NOU smi-TEK", ar: "شنو سميتك؟", fr: "Comment tu t'appelles ?" },
      { d: "Smiti ...", ph: "smi-TI", ar: "سميتي", fr: "Je m'appelle ..." },
      { d: "Mnin nta ?", ph: "m-NIN n-TA", ar: "منين نتا؟", fr: "D'où viens-tu ?" },
      { d: "Ana men Fransa", ph: "A-na men FRAN-sa", ar: "أنا من فرنسا", fr: "Je viens de France" },
      { d: "Sahbi", ph: "SAH-bi", ar: "صاحبي", fr: "Mon ami" },
      { d: "Wlidi", ph: "w-LI-di", ar: "وليدي", fr: "Mon fils / gamin" },
      { d: "Mrati", ph: "m-RA-ti", ar: "مراتي", fr: "Ma femme" },
      { d: "Rajli", ph: "RAJ-li", ar: "راجلي", fr: "Mon mari" },
      { d: "Ma fhemtch", ph: "ma FHEMTCH", ar: "ما فهمتش", fr: "Je n'ai pas compris" },
      { d: "3awd afak", ph: "3AWD a-FAK", ar: "عاود عفاك", fr: "Répète s'il te plaît" },
      { d: "Kathder francais ?", ph: "kat-H'DER fran-SE", ar: "كتهضر فرنسية؟", fr: "Tu parles français ?" },
    ],
  },
  {
    id: "raqm",
    title: "Les chiffres",
    icon: "#",
    words: [
      { d: "Wahed", ph: "WA-hed", ar: "واحد", fr: "1" },
      { d: "Jouj", ph: "jouj", ar: "جوج", fr: "2" },
      { d: "Tlata", ph: "t-LA-ta", ar: "تلاتة", fr: "3" },
      { d: "Rb3a", ph: "REB-3a", ar: "ربعة", fr: "4" },
      { d: "Khamsa", ph: "KHAM-sa", ar: "خمسة", fr: "5" },
      { d: "Setta", ph: "SET-ta", ar: "ستة", fr: "6" },
      { d: "Sb3a", ph: "SEB-3a", ar: "سبعة", fr: "7" },
      { d: "Tmnya", ph: "TEM-nya", ar: "تمنية", fr: "8" },
      { d: "Ts3oud", ph: "tes-3OUD", ar: "تسعود", fr: "9" },
      { d: "3achra", ph: "3ACH-ra", ar: "عشرة", fr: "10" },
      { d: "3achrin", ph: "3ach-RIN", ar: "عشرين", fr: "20" },
      { d: "Miya", ph: "MI-ya", ar: "مية", fr: "100" },
    ],
  },
  {
    id: "3ibarat",
    title: "Phrases du quotidien",
    icon: "❋",
    words: [
      { d: "Bghit nchri", ph: "BGHIT n-CHRI", ar: "بغيت نشري", fr: "Je veux acheter" },
      { d: "Ymken li ... ?", ph: "YEM-ken li", ar: "يمكن لي؟", fr: "Puis-je ... ?" },
      { d: "Ch'hal f'sa3a ?", ph: "chHAL f-SA-3a", ar: "شحال فالساعة؟", fr: "Quelle heure est-il ?" },
      { d: "Mabghitch", ph: "mab-GHITCH", ar: "ما بغيتش", fr: "Je ne veux pas" },
      { d: "Ana f'... ", ph: "A-na f", ar: "أنا ف", fr: "Je suis à ..." },
      { d: "Chwiya b'chwiya", ph: "chwi-YA b-chwi-YA", ar: "شوية بشوية", fr: "Doucement, petit à petit" },
      { d: "Allah y3awnek", ph: "AL-lah y-3AW-nek", ar: "الله يعاونك", fr: "Que Dieu t'aide" },
      { d: "Msaltch", ph: "ma-SALTCH", ar: "ما سالتش", fr: "Ce n'est pas fini" },
      { d: "3andi mochkil", ph: "3AN-di MOCH-kil", ar: "عندي مشكل", fr: "J'ai un problème" },
      { d: "Kolchi mzyan", ph: "KOL-chi mez-YAN", ar: "كلشي مزيان", fr: "Tout va bien" },
    ],
  },
];

const ALL_WORDS = LESSONS.flatMap((l) => l.words.map((w) => ({ ...w, lesson: l.id })));

/* ---------------- Utilitaires ---------------- */

const shuffle = (a) => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

// Voix arabe active (choisie selon le genre du profil) — voir pickArabicVoice / refreshActiveVoice.
let activeVoice = null;

const speak = (text) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  if (activeVoice) {
    u.voice = activeVoice;
    u.lang = activeVoice.lang;
  } else {
    u.lang = "ar-MA";
  }
  u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
};

// Indices de genre dans le nom des voix exposées par les navigateurs.
// Aucune API standard ne donne le genre d'une voix : c'est une estimation
// au mieux, avec repli propre si rien ne correspond.
const FEMALE_VOICE_HINTS = ["hoda", "salma", "laila", "leila", "zahra", "amira", "fatima", "yasmin", "hala", "female", "femme", "woman"];
const MALE_VOICE_HINTS = ["naayf", "nayef", "tarek", "karim", "hamed", "majed", "omar", "male", "homme", "man"];

function guessVoiceGender(voiceName) {
  const n = (voiceName || "").toLowerCase();
  if (FEMALE_VOICE_HINTS.some((h) => n.includes(h))) return "f";
  if (MALE_VOICE_HINTS.some((h) => n.includes(h))) return "m";
  return null;
}

function pickArabicVoice(gender) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const arabic = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("ar"));
  if (arabic.length === 0) return null;

  // On préfère une voix ar-MA si disponible, sinon n'importe quelle voix arabe.
  const preferred = arabic.find((v) => v.lang.toLowerCase() === "ar-ma");
  const pool = preferred ? [preferred, ...arabic.filter((v) => v !== preferred)] : arabic;

  const matched = pool.find((v) => guessVoiceGender(v.name) === gender);
  return matched || pool[0]; // repli : première voix arabe dispo, genre non garanti
}

function refreshActiveVoice(gender) {
  activeVoice = pickArabicVoice(gender);
}

/* ---------------- API (profils & progression, via Vercel + Neon) ---------------- */

const PROFILE_STORAGE_KEY = "wakha_active_profile_id";

async function apiFetchUsers() {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Impossible de charger les profils.");
  return res.json();
}

async function apiCreateUser(name, gender) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, gender }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Impossible de créer le profil.");
  }
  return res.json();
}

async function apiFetchProgress(userId) {
  const res = await fetch(`/api/progress?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error("Impossible de charger la progression.");
  return res.json();
}

async function apiSaveProgress(userId, wordKey) {
  // Best-effort : on ne bloque jamais l'interface sur cet appel.
  try {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, wordKey, status: "known" }),
    });
  } catch (err) {
    console.warn("Sauvegarde de progression échouée (hors-ligne ?)", err);
  }
}

/* ---------------- Composants ---------------- */

function Zellige({ size = 40, color, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ opacity }}>
      <path
        d="M20 2 L26 14 L38 20 L26 26 L20 38 L14 26 L2 20 L14 14 Z"
        fill={color}
      />
    </svg>
  );
}

function Progress({ value, total }) {
  const pct = total ? (value / total) * 100 : 0;
  return (
    <div style={{ height: 8, background: "rgba(27,43,42,0.12)", borderRadius: 99, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${C.mint}, ${C.saffron})`,
          borderRadius: 99,
          transition: "width .45s cubic-bezier(.2,.8,.2,1)",
        }}
      />
    </div>
  );
}

function Btn({ children, onClick, variant = "solid", full, disabled, style }) {
  const base = {
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: 15,
    padding: "13px 22px",
    borderRadius: 14,
    cursor: disabled ? "default" : "pointer",
    border: "2px solid " + C.ink,
    transition: "transform .12s ease, box-shadow .12s ease",
    width: full ? "100%" : undefined,
    opacity: disabled ? 0.45 : 1,
    letterSpacing: "0.01em",
  };
  const skins = {
    solid: { background: C.ink, color: C.paper, boxShadow: `3px 3px 0 ${C.clay}` },
    ghost: { background: "transparent", color: C.ink, boxShadow: `3px 3px 0 rgba(27,43,42,.18)` },
    accent: { background: C.saffron, color: C.ink, boxShadow: `3px 3px 0 ${C.ink}` },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...skins[variant], ...style }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "translate(3px,3px)")}
      onMouseUp={(e) => !disabled && (e.currentTarget.style.transform = "none")}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.transform = "none")}
    >
      {children}
    </button>
  );
}

/* ---------------- Mode : Cartes ---------------- */

function Flashcards({ words, onBack, onLearned }) {
  const [deck] = useState(() => shuffle(words));
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const w = deck[i];

  const next = (known) => {
    if (known) onLearned(w.d);
    setFlip(false);
    setTimeout(() => setI((v) => (v + 1) % deck.length), 120);
  };

  return (
    <div>
      <TopBar onBack={onBack} label={`Carte ${i + 1} / ${deck.length}`} />
      <Progress value={i} total={deck.length} />

      <div
        onClick={() => setFlip((f) => !f)}
        style={{
          marginTop: 28,
          minHeight: 260,
          background: flip ? C.deep : C.paper,
          color: flip ? C.paper : C.ink,
          border: `2px solid ${C.ink}`,
          borderRadius: 22,
          boxShadow: `6px 6px 0 ${flip ? C.saffron : C.mint}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: 30,
          cursor: "pointer",
          textAlign: "center",
          transition: "background .25s ease, box-shadow .25s ease",
        }}
      >
        {!flip ? (
          <>
            <div style={{ fontSize: 13, letterSpacing: ".18em", textTransform: "uppercase", opacity: .5 }}>
              Darija
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 42, fontWeight: 700, lineHeight: 1.1 }}>
              {w.d}
            </div>
            <div style={{
              fontSize: 17, letterSpacing: ".04em", color: C.clay, fontWeight: 600,
            }}>[ {w.ph} ]</div>
            <div style={{ fontSize: 26, opacity: .55, direction: "rtl" }}>{w.ar}</div>
            <div style={{ fontSize: 12, opacity: .4, marginTop: 10 }}>Touche pour retourner</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, letterSpacing: ".18em", textTransform: "uppercase", opacity: .5 }}>
              Français
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 34, fontWeight: 700, lineHeight: 1.2 }}>
              {w.fr}
            </div>
            {w.note && (
              <div style={{ fontSize: 14, opacity: .6, fontStyle: "italic", maxWidth: 300 }}>{w.note}</div>
            )}
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <Btn variant="ghost" onClick={() => speak(w.ar)}>♪ Écouter</Btn>
        <Btn variant="ghost" onClick={() => next(false)} style={{ flex: 1 }}>À revoir</Btn>
        <Btn variant="accent" onClick={() => next(true)} style={{ flex: 1 }}>Je sais ✓</Btn>
      </div>
    </div>
  );
}

/* ---------------- Mode : Quiz ---------------- */

function Quiz({ words, pool, onBack, onLearned }) {
  const questions = useMemo(() => shuffle(words).slice(0, 10), [words]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[i];

  const options = useMemo(() => {
    if (!q) return [];
    const wrong = shuffle(pool.filter((x) => x.fr !== q.fr)).slice(0, 3);
    return shuffle([q, ...wrong]);
  }, [q, pool]);

  const pick = (o) => {
    if (picked) return;
    setPicked(o);
    const ok = o.fr === q.fr;
    if (ok) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      onLearned(q.d);
    } else setStreak(0);
    setTimeout(() => {
      if (i + 1 >= questions.length) setDone(true);
      else {
        setI((v) => v + 1);
        setPicked(null);
      }
    }, 900);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Zellige size={70} color={C.saffron} />
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 34, margin: "18px 0 6px" }}>
          {pct >= 80 ? "Mzyan bzzaf !" : pct >= 50 ? "Mzyan !" : "Chwiya b'chwiya"}
        </h2>
        <p style={{ opacity: .65, marginBottom: 26 }}>
          {score} bonnes réponses sur {questions.length}
        </p>
        <Btn onClick={onBack}>Retour au menu</Btn>
      </div>
    );
  }

  return (
    <div>
      <TopBar onBack={onBack} label={`${i + 1} / ${questions.length}`} right={
        <span style={{ color: C.clay, fontWeight: 700 }}>
          {streak > 1 ? `🔥 ${streak}` : `${score} pts`}
        </span>
      } />
      <Progress value={i} total={questions.length} />

      <div style={{ textAlign: "center", margin: "34px 0 26px" }}>
        <div style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", opacity: .45 }}>
          Que veut dire
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 40, fontWeight: 700, margin: "8px 0 4px" }}>
          {q.d}
        </div>
        <div style={{ fontSize: 16, color: C.clay, fontWeight: 600, letterSpacing: ".04em", marginBottom: 4 }}>
          [ {q.ph} ]
        </div>
        <div style={{ fontSize: 22, opacity: .5, direction: "rtl" }}>{q.ar}</div>
        <button
          onClick={() => speak(q.ar)}
          style={{ marginTop: 10, background: "none", border: "none", cursor: "pointer", fontSize: 20, opacity: .6 }}
        >♪</button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {options.map((o, k) => {
          const isRight = o.fr === q.fr;
          const chosen = picked === o;
          let bg = C.paper, bd = C.ink, sh = "rgba(27,43,42,.18)";
          if (picked) {
            if (isRight) { bg = C.mint; bd = C.mint; sh = C.ink; }
            else if (chosen) { bg = C.clay; bd = C.clay; sh = C.ink; }
          }
          return (
            <button
              key={k}
              onClick={() => pick(o)}
              style={{
                textAlign: "left",
                padding: "16px 18px",
                borderRadius: 14,
                border: `2px solid ${bd}`,
                background: bg,
                color: picked && (isRight || chosen) ? C.paper : C.ink,
                boxShadow: `3px 3px 0 ${sh}`,
                fontSize: 16,
                fontWeight: 500,
                cursor: picked ? "default" : "pointer",
                transition: "all .2s ease",
              }}
            >
              {o.fr}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Mode : Association ---------------- */

function Matching({ words, onBack, onLearned }) {
  const [round, setRound] = useState(0);
  const set = useMemo(() => shuffle(words).slice(0, 5), [words, round]);
  const [left] = useMemo(() => [shuffle(set)], [set]);
  const rightCol = useMemo(() => shuffle(set), [set]);
  const [sel, setSel] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(null);

  useEffect(() => { setMatched([]); setSel(null); }, [round]);

  const clickRight = (r) => {
    if (!sel || matched.includes(r.d)) return;
    if (sel.d === r.d) {
      setMatched((m) => [...m, r.d]);
      onLearned(r.d);
      setSel(null);
    } else {
      setWrong(r.d);
      setTimeout(() => { setWrong(null); setSel(null); }, 500);
    }
  };

  const complete = matched.length === set.length;

  const cell = (active, ok, bad) => ({
    padding: "14px 12px",
    borderRadius: 12,
    border: `2px solid ${ok ? C.mint : bad ? C.clay : C.ink}`,
    background: ok ? C.mint : bad ? C.clay : active ? C.saffron : C.paper,
    color: ok || bad ? C.paper : C.ink,
    boxShadow: ok ? "none" : `3px 3px 0 rgba(27,43,42,.16)`,
    cursor: ok ? "default" : "pointer",
    fontSize: 15,
    fontWeight: 600,
    textAlign: "center",
    opacity: ok ? 0.5 : 1,
    transition: "all .2s ease",
  });

  return (
    <div>
      <TopBar onBack={onBack} label="Associe les paires" right={`${matched.length}/${set.length}`} />
      <Progress value={matched.length} total={set.length} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 26 }}>
        <div style={{ display: "grid", gap: 10 }}>
          {left.map((w) => (
            <div
              key={w.d}
              onClick={() => !matched.includes(w.d) && setSel(w)}
              style={{ ...cell(sel?.d === w.d, matched.includes(w.d), false), fontFamily: "Georgia, serif", fontSize: 17, lineHeight: 1.25 }}
            >
              {w.d}
              <div style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 11,
                fontWeight: 600, opacity: .7, letterSpacing: ".03em", marginTop: 2,
              }}>{w.ph}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {rightCol.map((w) => (
            <div
              key={w.fr}
              onClick={() => clickRight(w)}
              style={cell(false, matched.includes(w.d), wrong === w.d)}
            >
              {w.fr}
            </div>
          ))}
        </div>
      </div>

      {complete && (
        <div style={{ textAlign: "center", marginTop: 26 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 26, marginBottom: 14 }}>Safi ! Bien joué</div>
          <Btn variant="accent" onClick={() => setRound((r) => r + 1)}>Série suivante</Btn>
        </div>
      )}
    </div>
  );
}

/* ---------------- Mode : Écoute ---------------- */

function Listening({ words, pool, onBack, onLearned }) {
  const questions = useMemo(() => shuffle(words).slice(0, 8), [words]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[i];

  const options = useMemo(() => {
    if (!q) return [];
    const wrong = shuffle(pool.filter((x) => x.d !== q.d)).slice(0, 3);
    return shuffle([q, ...wrong]);
  }, [q, pool]);

  useEffect(() => { if (q) setTimeout(() => speak(q.ar), 350); }, [i]);

  const pick = (o) => {
    if (picked) return;
    setPicked(o);
    if (o.d === q.d) { setScore((s) => s + 1); onLearned(q.d); }
    setTimeout(() => {
      if (i + 1 >= questions.length) setDone(true);
      else { setI((v) => v + 1); setPicked(null); }
    }, 900);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Zellige size={70} color={C.mint} />
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 32, margin: "16px 0 6px" }}>Terminé</h2>
        <p style={{ opacity: .65, marginBottom: 24 }}>{score} / {questions.length} reconnus à l'oreille</p>
        <Btn onClick={onBack}>Retour au menu</Btn>
      </div>
    );

  return (
    <div>
      <TopBar onBack={onBack} label={`Écoute ${i + 1} / ${questions.length}`} />
      <Progress value={i} total={questions.length} />

      <div style={{ textAlign: "center", margin: "36px 0 28px" }}>
        <button
          onClick={() => speak(q.ar)}
          style={{
            width: 110, height: 110, borderRadius: "50%",
            border: `2px solid ${C.ink}`, background: C.deep, color: C.paper,
            fontSize: 38, cursor: "pointer", boxShadow: `5px 5px 0 ${C.saffron}`,
          }}
        >♪</button>
        <div style={{ fontSize: 13, opacity: .5, marginTop: 14 }}>
          Touche pour réécouter — quel mot entends-tu ?
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {options.map((o, k) => {
          const isRight = o.d === q.d;
          const chosen = picked === o;
          let bg = C.paper, col = C.ink;
          if (picked && isRight) { bg = C.mint; col = C.paper; }
          else if (picked && chosen) { bg = C.clay; col = C.paper; }
          return (
            <button key={k} onClick={() => pick(o)}
              style={{
                padding: "16px 18px", borderRadius: 14, border: `2px solid ${C.ink}`,
                background: bg, color: col, boxShadow: "3px 3px 0 rgba(27,43,42,.18)",
                fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 600,
                cursor: picked ? "default" : "pointer", transition: "all .2s ease",
              }}>
              {o.d}
              {picked && (
                <span style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 14,
                  fontWeight: 600, opacity: .75, marginLeft: 10, letterSpacing: ".04em",
                }}>[ {o.ph} ]</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Barre supérieure ---------------- */

function TopBar({ onBack, label, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: 15, fontWeight: 600, color: C.ink, opacity: .7, padding: 0,
      }}>← Menu</button>
      <span style={{ fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", opacity: .5 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, minWidth: 46, textAlign: "right" }}>{right}</span>
    </div>
  );
}

/* ---------------- Sélection de profil ---------------- */

function ProfileGate({ onSelect }) {
  const [profiles, setProfiles] = useState(null); // null = chargement
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("f");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetchUsers()
      .then(setProfiles)
      .catch((err) => setError(err.message));
  }, []);

  const handleCreate = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      const user = await apiCreateUser(name.trim(), gender);
      onSelect(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
        <Zellige size={22} color={C.clay} opacity={.8} />
        <Zellige size={22} color={C.mint} />
        <Zellige size={22} color={C.saffron} opacity={.8} />
      </div>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 30, margin: "0 0 6px" }}>
        Qui s'entraîne ?
      </h1>
      <p style={{ fontSize: 14, opacity: .6, marginBottom: 28 }}>
        Choisis ton profil pour retrouver ta progression.
      </p>

      {error && (
        <div style={{
          background: C.clay, color: C.paper, borderRadius: 12, padding: "10px 14px",
          fontSize: 13, marginBottom: 18,
        }}>{error}</div>
      )}

      {profiles === null ? (
        <div style={{ opacity: .5, fontSize: 14, marginBottom: 24 }}>Chargement des profils…</div>
      ) : (
        <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              style={{
                display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                padding: "14px 18px", background: C.paper, border: `2px solid ${C.ink}`,
                borderRadius: 16, boxShadow: `4px 4px 0 ${p.gender === "f" ? C.mint : C.clay}`,
                cursor: "pointer", fontFamily: "inherit", color: C.ink,
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: p.gender === "f" ? C.mint : C.clay, color: C.paper,
                display: "grid", placeItems: "center", fontSize: 17, fontWeight: 700, flexShrink: 0,
                fontFamily: "Georgia, serif",
              }}>{p.name.trim().charAt(0).toUpperCase()}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700 }}>{p.name}</div>
            </button>
          ))}
          {profiles.length === 0 && (
            <div style={{ opacity: .5, fontSize: 14 }}>Aucun profil pour l'instant — crée le premier ci-dessous.</div>
          )}
        </div>
      )}

      {!creating ? (
        <Btn variant="ghost" onClick={() => setCreating(true)}>+ Nouveau profil</Btn>
      ) : (
        <div style={{
          display: "grid", gap: 12, textAlign: "left", maxWidth: 320, marginInline: "auto",
          background: C.paper, border: `2px solid ${C.ink}`, borderRadius: 16, padding: 18,
          boxShadow: `4px 4px 0 ${C.saffron}`,
        }}>
          <div>
            <label style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", opacity: .5 }}>
              Prénom
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              placeholder="Ex. Léa"
              maxLength={40}
              style={{
                width: "100%", marginTop: 6, padding: "10px 12px", fontSize: 15,
                border: `2px solid ${C.ink}`, borderRadius: 10, fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", opacity: .5 }}>
              Voix pour l'écoute
            </label>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <Chip active={gender === "f"} onClick={() => setGender("f")}>Féminine</Chip>
              <Chip active={gender === "m"} onClick={() => setGender("m")}>Masculine</Chip>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={() => setCreating(false)} style={{ flex: 1 }}>Annuler</Btn>
            <Btn variant="accent" onClick={handleCreate} disabled={!name.trim() || saving} style={{ flex: 1 }}>
              {saving ? "…" : "Créer"}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Application ---------------- */

export default function App() {
  const [profile, setProfile] = useState(null);
  const [profileReady, setProfileReady] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [mode, setMode] = useState(null);
  const [learned, setLearned] = useState([]);

  // Retrouve le profil actif mémorisé sur cet appareil au démarrage.
  useEffect(() => {
    const storedId = typeof window !== "undefined" ? localStorage.getItem(PROFILE_STORAGE_KEY) : null;
    if (!storedId) { setProfileReady(true); return; }
    apiFetchUsers()
      .then((users) => {
        const found = users.find((u) => u.id === storedId);
        if (found) setProfile(found);
      })
      .catch(() => {})
      .finally(() => setProfileReady(true));
  }, []);

  // Charge la progression du profil actif + choisit la voix (genre) correspondante.
  useEffect(() => {
    if (!profile) return;
    refreshActiveVoice(profile.gender);
    apiFetchProgress(profile.id)
      .then((rows) => setLearned(rows.map((r) => r.word_key)))
      .catch((err) => console.warn("Progression indisponible", err));
  }, [profile]);

  // Les listes de voix arrivent parfois de façon asynchrone (Chrome notamment).
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const handler = () => { if (profile) refreshActiveVoice(profile.gender); };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", handler);
  }, [profile]);

  const selectProfile = (user) => {
    setProfile(user);
    localStorage.setItem(PROFILE_STORAGE_KEY, user.id);
  };

  const switchProfile = () => {
    setProfile(null);
    setLearned([]);
    setMode(null);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  };

  const addLearned = (d) => {
    setLearned((l) => (l.includes(d) ? l : [...l, d]));
    if (profile) apiSaveProgress(profile.id, d);
  };

  const activeWords = lesson ? LESSONS.find((l) => l.id === lesson).words : ALL_WORDS;

  const back = () => setMode(null);

  const shell = (children) => (
    <div style={{
      minHeight: "100vh", background: C.sand, color: C.ink,
      fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif",
      padding: "22px 18px 60px",
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>{children}</div>
    </div>
  );

  if (!profileReady) {
    return shell(<div style={{ textAlign: "center", padding: "80px 0", opacity: .5 }}>Chargement…</div>);
  }

  if (!profile) {
    return shell(<ProfileGate onSelect={selectProfile} />);
  }

  if (mode) {
    const props = { words: activeWords, pool: ALL_WORDS, onBack: back, onLearned: addLearned };
    return shell(
      mode === "cards" ? <Flashcards {...props} /> :
      mode === "quiz" ? <Quiz {...props} /> :
      mode === "match" ? <Matching {...props} /> :
      <Listening {...props} />
    );
  }

  return shell(
    <>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "18px 0 30px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
          <Zellige size={22} color={C.clay} opacity={.8} />
          <Zellige size={22} color={C.mint} />
          <Zellige size={22} color={C.saffron} opacity={.8} />
        </div>
        <h1 style={{
          fontFamily: "Georgia, serif", fontWeight: 700,
          margin: 0, letterSpacing: "-0.02em", lineHeight: .92,
        }}>
          <span style={{
            display: "block", fontSize: 30, color: C.clay,
            letterSpacing: "0.02em", fontStyle: "italic",
          }}>Wakha</span>
          <span style={{ display: "block", fontSize: 52 }}>Darija</span>
        </h1>
        <div style={{ fontSize: 26, opacity: .35, direction: "rtl", marginTop: 6 }}>واخا الدارجة</div>
        <p style={{ fontSize: 15, opacity: .6, marginTop: 12, maxWidth: 330, marginInline: "auto", lineHeight: 1.5 }}>
          Le marocain qu'on parle vraiment dans la rue, au souk et autour d'un verre de thé.
        </p>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          marginTop: 16, fontSize: 13, opacity: .7,
        }}>
          <span style={{
            width: 20, height: 20, borderRadius: "50%", display: "grid", placeItems: "center",
            background: profile.gender === "f" ? C.mint : C.clay, color: C.paper,
            fontSize: 11, fontWeight: 700, fontFamily: "Georgia, serif", flexShrink: 0,
          }}>{profile.name.trim().charAt(0).toUpperCase()}</span>
          <span>{profile.name}</span>
          <button onClick={switchProfile} style={{
            background: "none", border: "none", cursor: "pointer", color: C.clay,
            fontWeight: 600, fontSize: 13, padding: 0, textDecoration: "underline",
            fontFamily: "inherit",
          }}>changer</button>
        </div>
      </div>

      {/* Compteur */}
      <div style={{
        background: C.deep, color: C.paper, borderRadius: 18,
        border: `2px solid ${C.ink}`, boxShadow: `5px 5px 0 ${C.clay}`,
        padding: "18px 20px", marginBottom: 26,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", opacity: .6 }}>
            Mots maîtrisés
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 700 }}>
            {learned.length}<span style={{ opacity: .4, fontSize: 18 }}> / {ALL_WORDS.length}</span>
          </div>
        </div>
        <div style={{ width: 130 }}>
          <Progress value={learned.length} total={ALL_WORDS.length} />
        </div>
      </div>

      {/* Thème */}
      <div style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", opacity: .5, marginBottom: 10 }}>
        Thème
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
        <Chip active={lesson === null} onClick={() => setLesson(null)}>Tout ({ALL_WORDS.length})</Chip>
        {LESSONS.map((l) => (
          <Chip key={l.id} active={lesson === l.id} onClick={() => setLesson(l.id)}>
            {l.icon} {l.title}
          </Chip>
        ))}
      </div>

      {/* Modes */}
      <div style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", opacity: .5, marginBottom: 10 }}>
        Comment veux-tu réviser ?
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <ModeCard color={C.mint} icon="▣" title="Cartes" desc="Retourne, écoute, mémorise" onClick={() => setMode("cards")} />
        <ModeCard color={C.saffron} icon="?" title="Quiz" desc="Quatre choix, une bonne réponse" onClick={() => setMode("quiz")} />
        <ModeCard color={C.clay} icon="⇄" title="Association" desc="Relie le darija au français" onClick={() => setMode("match")} />
        <ModeCard color={C.deep} icon="♪" title="Écoute" desc="Reconnais le mot à l'oreille" onClick={() => setMode("listen")} />
      </div>

      {/* Vocabulaire du thème */}
      <div style={{ marginTop: 34 }}>
        <div style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", opacity: .5, marginBottom: 10 }}>
          Vocabulaire ({activeWords.length})
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {activeWords.map((w) => (
            <div key={w.d + w.fr} onClick={() => speak(w.ar)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", background: C.paper,
              border: `1px solid rgba(27,43,42,.15)`, borderRadius: 10, cursor: "pointer",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                background: learned.includes(w.d) ? C.mint : "rgba(27,43,42,.15)",
              }} />
              <span style={{ minWidth: 126 }}>
                <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 15, display: "block" }}>{w.d}</span>
                <span style={{ fontSize: 12, color: C.clay, fontWeight: 600, letterSpacing: ".03em" }}>{w.ph}</span>
              </span>
              <span style={{ fontSize: 14, opacity: .65, flex: 1 }}>{w.fr}</span>
              <span style={{ fontSize: 14, opacity: .35, direction: "rtl" }}>{w.ar}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 12, opacity: .4, marginTop: 34, lineHeight: 1.6 }}>
        Phonétique en <span style={{ color: C.clay, fontWeight: 600 }}>orange</span> : les syllabes en
        MAJUSCULES sont accentuées.<br />
        Le 3 se lit « ع » (ain, guttural), le 7 un « h » soufflé, le « kh » comme la jota espagnole.<br />
        La prononciation audio utilise la voix arabe de ton appareil.
      </p>
    </>
  );
}

function Chip({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 99,
      border: `2px solid ${active ? C.ink : "rgba(27,43,42,.2)"}`,
      background: active ? C.ink : "transparent",
      color: active ? C.paper : C.ink,
      fontSize: 13, fontWeight: 600, cursor: "pointer",
      fontFamily: "inherit", transition: "all .18s ease",
    }}>{children}</button>
  );
}

function ModeCard({ color, icon, title, desc, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 16, textAlign: "left",
      padding: "16px 18px", background: C.paper, border: `2px solid ${C.ink}`,
      borderRadius: 16, boxShadow: `4px 4px 0 ${color}`, cursor: "pointer",
      fontFamily: "inherit", color: C.ink, transition: "transform .12s ease",
    }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "translate(4px,4px)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "none")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 12, background: color, color: C.paper,
        display: "grid", placeItems: "center", fontSize: 20, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 19, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 13, opacity: .6 }}>{desc}</div>
      </div>
    </button>
  );
}
