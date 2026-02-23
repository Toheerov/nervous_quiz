import { useState, useEffect, useCallback } from "react";

const NERVES = [
  { num: "I", roman: "I", name: "Обонятельный", latin: "Nervus olfactorius", type: "Сенсорный", origin: "Обонятельная луковица / Конечный мозг", nucleus: "Обонятельная луковица", function: "Обоняние", disorder: "Аносмия (потеря обоняния)", emoji: "👃" },
  { num: "II", roman: "II", name: "Зрительный", latin: "Nervus opticus", type: "Сенсорный", origin: "Хиазма / Промежуточный мозг", nucleus: "Наружное коленчатое тело", function: "Зрение", disorder: "Амавроз, неврит зрительного нерва", emoji: "👁" },
  { num: "III", roman: "III", name: "Глазодвигательный", latin: "Nervus oculomotorius", type: "Двигательный", origin: "Межножковая ямка / Средний мозг", nucleus: "Nucleus oculomotorius, ядро Якубовича", function: "Движение глаз, сужение зрачка, подъём века", disorder: "Птоз, мидриаз, косоглазие", emoji: "🔍" },
  { num: "IV", roman: "IV", name: "Блоковый", latin: "Nervus trochlearis", type: "Двигательный", origin: "Дорсальная поверхность среднего мозга", nucleus: "Nucleus trochlearis", function: "Верхняя косая мышца глаза (взгляд вниз-внутрь)", disorder: "Диплопия при взгляде вниз", emoji: "🔄" },
  { num: "V", roman: "V", name: "Тройничный", latin: "Nervus trigeminus", type: "Смешанный", origin: "Боковая поверхность моста", nucleus: "Nucleus motorius V, Nucleus sensorius principalis", function: "Чувствительность лица, жевание", disorder: "Невралгия тройничного нерва", emoji: "😬" },
  { num: "VI", roman: "VI", name: "Отводящий", latin: "Nervus abducens", type: "Двигательный", origin: "Борозда моста и продолговатого мозга", nucleus: "Nucleus abducens (мост)", function: "Латеральная прямая мышца глаза (взгляд наружу)", disorder: "Сходящееся косоглазие", emoji: "👀" },
  { num: "VII", roman: "VII", name: "Лицевой", latin: "Nervus facialis", type: "Смешанный", origin: "Мостомозжечковый угол", nucleus: "Nucleus facialis, Nucleus salivatorius superior", function: "Мимика, слюноотделение, вкус передних 2/3 языка", disorder: "Паралич Белла, прозоплегия", emoji: "😄" },
  { num: "VIII", roman: "VIII", name: "Преддверно-улитковый", latin: "Nervus vestibulocochlearis", type: "Сенсорный", origin: "Мостомозжечковый угол", nucleus: "Nuclei cochleares, Nuclei vestibulares", function: "Слух и равновесие", disorder: "Тугоухость, головокружение, нистагм", emoji: "👂" },
  { num: "IX", roman: "IX", name: "Языкоглоточный", latin: "Nervus glossopharyngeus", type: "Смешанный", origin: "Латеральная борозда продолговатого мозга", nucleus: "Nucleus ambiguus, Nucleus solitarius", function: "Глотание, вкус задней 1/3 языка, слюна (околоушная)", disorder: "Невралгия языкоглоточного нерва, дисфагия", emoji: "👅" },
  { num: "X", roman: "X", name: "Блуждающий", latin: "Nervus vagus", type: "Смешанный", origin: "Латеральная борозда продолговатого мозга", nucleus: "Nucleus dorsalis nervi vagi", function: "Парасимпатика органов грудной и брюшной полости, голос", disorder: "Дисфония, дисфагия, тахикардия", emoji: "🫀" },
  { num: "XI", roman: "XI", name: "Добавочный", latin: "Nervus accessorius", type: "Двигательный", origin: "Спинной мозг C1–C5 + продолговатый мозг", nucleus: "Nucleus accessorius spinalis", function: "Грудино-ключично-сосцевидная и трапециевидная мышцы", disorder: "Кривошея, опущение плеча", emoji: "💪" },
  { num: "XII", roman: "XII", name: "Подъязычный", latin: "Nervus hypoglossus", type: "Двигательный", origin: "Передняя латеральная борозда продолговатого мозга", nucleus: "Nucleus nervi hypoglossi", function: "Движения языка", disorder: "Дизартрия, атрофия языка, девиация языка", emoji: "🗣" },
];

const MODES = [
  { id: "number", label: "Номер → Название", desc: "По номеру угадай название нерва" },
  { id: "name", label: "Название → Номер", desc: "По названию угадай номер" },
  { id: "function", label: "Функция → Нерв", desc: "По функции угадай нерв" },
  { id: "origin", label: "Откуда выходит?", desc: "Место выхода из головного мозга" },
  { id: "disorder", label: "Расстройство → Нерв", desc: "По патологии угадай нерв" },
];

const TYPE_COLORS = {
  "Сенсорный":    { bg: "#0d3d4a", border: "#2EC4B6", text: "#2EC4B6" },
  "Двигательный": { bg: "#3d2a00", border: "#FFD166", text: "#FFD166" },
  "Смешанный":    { bg: "#1a3300", border: "#06D6A0", text: "#06D6A0" },
};

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function getOptions(correct, allNerves, field) {
  const others = allNerves.filter(n => n.num !== correct.num);
  const wrong = shuffle(others).slice(0, 3).map(n => n[field]);
  return shuffle([correct[field], ...wrong]);
}

function getQuestion(nerve, mode) {
  switch (mode) {
    case "name":     return { question: "Какой номер у нерва?",               highlight: `${nerve.emoji} ${nerve.name}`,  answerField: "roman",    displayField: "roman" };
    case "number":   return { question: "Как называется нерв?",               highlight: `Пара ${nerve.roman}`,           answerField: "name",     displayField: "name" };
    case "function": return { question: "Какой нерв выполняет эту функцию?",  highlight: nerve.function,                  answerField: "name",     displayField: "name" };
    case "origin":   return { question: `Откуда выходит ${nerve.name}?`,      highlight: `${nerve.emoji} ${nerve.name}`,  answerField: "origin",   displayField: "origin" };
    case "disorder": return { question: "Какой нерв поражён при патологии?",  highlight: nerve.disorder,                  answerField: "name",     displayField: "name" };
    default: return {};
  }
}

export default function App() {
  const [screen, setScreen]         = useState("menu");
  const [mode, setMode]             = useState("number");
  const [questions, setQuestions]   = useState([]);
  const [current, setCurrent]       = useState(0);
  const [selected, setSelected]     = useState(null);
  const [score, setScore]           = useState(0);
  const [answers, setAnswers]       = useState([]);
  const [streak, setStreak]         = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [studyIndex, setStudyIndex] = useState(0);
  const [studyFlipped, setStudyFlipped] = useState(false);
  const [timer, setTimer]           = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval;
    if (timerActive) interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const startQuiz = useCallback(() => {
    const shuffled = shuffle(NERVES);
    const q = shuffled.map(nerve => {
      const qData = getQuestion(nerve, mode);
      const options = getOptions(nerve, NERVES, qData.answerField);
      return { nerve, ...qData, options, correct: nerve[qData.answerField] };
    });
    setQuestions(q);
    setCurrent(0); setSelected(null); setScore(0); setAnswers([]);
    setStreak(0); setBestStreak(0); setTimer(0);
    setTimerActive(true);
    setScreen("quiz");
  }, [mode]);

  const handleAnswer = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    const isCorrect = opt === questions[current].correct;
    const newStreak = isCorrect ? streak + 1 : 0;
    setBestStreak(b => Math.max(b, newStreak));
    setStreak(newStreak);
    if (isCorrect) setScore(s => s + 1);
    setAnswers(a => [...a, { nerve: questions[current].nerve, isCorrect, chosen: opt, correct: questions[current].correct }]);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) { setTimerActive(false); setScreen("result"); }
    else { setCurrent(c => c + 1); setSelected(null); }
  };

  const goMenu = () => { setScreen("menu"); setTimerActive(false); };
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const formatTime = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const q = questions[current];

  // ── STYLES ──
  const S = {
    root: { minHeight: "100vh", background: "#0D1B2A", fontFamily: "'Georgia', serif", color: "#E8EEF4", display: "flex", flexDirection: "column", alignItems: "center", padding: "env(safe-area-inset-top, 16px) 16px 24px" },
    inner: { width: "100%", maxWidth: 520 },
    card: { background: "#162336", borderRadius: 16, padding: 20, border: "1px solid #243547", marginBottom: 14 },
    btn: (bg, color, border) => ({ width: "100%", padding: "14px", background: bg, border: `2px solid ${border || bg}`, borderRadius: 12, color, fontFamily: "Georgia, serif", fontSize: 15, fontWeight: "bold", cursor: "pointer", marginBottom: 10 }),
    smallBtn: (bg, border) => ({ background: bg, border: `1px solid ${border}`, borderRadius: 8, color: border, padding: "7px 14px", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 12 }),
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  };

  return (
    <div style={S.root}>
      <div style={S.inner}>

        {/* HEADER */}
        <div style={{ ...S.row, marginBottom: 20, paddingTop: 8 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#2EC4B6", textTransform: "uppercase", marginBottom: 2 }}>Нейроанатомия</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>🧠 Черепные нервы</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {screen !== "menu" && <button onClick={goMenu} style={S.smallBtn("#162336","#2EC4B6")}>← Меню</button>}
            <button onClick={() => { setScreen("study"); setStudyIndex(0); setStudyFlipped(false); }} style={S.smallBtn(screen==="study" ? "#0d3d4a" : "#162336","#2EC4B6")}>📚</button>
          </div>
        </div>

        {/* ══ MENU ══ */}
        {screen === "menu" && (
          <>
            <div style={S.card}>
              <div style={{ fontSize: 12, color: "#8DA9C4", marginBottom: 14 }}>Выберите режим викторины:</div>
              {MODES.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)} style={{
                  width: "100%", textAlign: "left", background: mode===m.id ? "#0d3d4a" : "#0D1B2A",
                  border: `2px solid ${mode===m.id ? "#2EC4B6" : "#243547"}`,
                  borderRadius: 10, padding: "12px 14px", cursor: "pointer", marginBottom: 8,
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ color: mode===m.id ? "#2EC4B6" : "#E8EEF4", fontWeight: "bold", fontSize: 13, fontFamily: "Georgia, serif" }}>{m.label}</div>
                    <div style={{ color: "#8DA9C4", fontSize: 11, marginTop: 2, fontFamily: "Georgia, serif" }}>{m.desc}</div>
                  </div>
                  {mode===m.id && <span style={{ color: "#2EC4B6" }}>✓</span>}
                </button>
              ))}
            </div>

            <button onClick={startQuiz} style={S.btn("#2EC4B6","#0D1B2A")}>
              🧠 Начать викторину (12 вопросов)
            </button>
            <button onClick={() => { setScreen("study"); setStudyIndex(0); setStudyFlipped(false); }} style={S.btn("#162336","#E8EEF4","#243547")}>
              📚 Карточки для изучения
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 8 }}>
              {[["12","Пар нервов"],["3","Сенсорных"],["5","Двигательных"]].map(([v,l]) => (
                <div key={l} style={{ background: "#162336", borderRadius: 10, padding: "14px 8px", textAlign: "center", border: "1px solid #243547" }}>
                  <div style={{ fontSize: 26, fontWeight: "bold", color: "#2EC4B6" }}>{v}</div>
                  <div style={{ fontSize: 10, color: "#8DA9C4", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══ STUDY ══ */}
        {screen === "study" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ color: "#8DA9C4", fontSize: 13 }}>Карточка {studyIndex+1} / {NERVES.length}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setStudyIndex(i => (i-1+NERVES.length)%NERVES.length); setStudyFlipped(false); }} style={S.smallBtn("#162336","#2EC4B6")}>←</button>
                <button onClick={() => { setStudyIndex(i => (i+1)%NERVES.length); setStudyFlipped(false); }} style={S.smallBtn("#162336","#2EC4B6")}>→</button>
              </div>
            </div>

            {/* progress dots */}
            <div style={{ display: "flex", gap: 3, marginBottom: 16, flexWrap: "wrap" }}>
              {NERVES.map((_,i) => (
                <div key={i} onClick={() => { setStudyIndex(i); setStudyFlipped(false); }} style={{ width: 22, height: 5, borderRadius: 3, cursor: "pointer", background: i===studyIndex ? "#2EC4B6" : "#243547" }} />
              ))}
            </div>

            {/* flashcard */}
            <div onClick={() => setStudyFlipped(f => !f)} style={{
              background: "#162336", borderRadius: 20, padding: 24, minHeight: 280,
              border: `2px solid ${TYPE_COLORS[NERVES[studyIndex].type]?.border}`,
              cursor: "pointer", position: "relative",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)", marginBottom: 12
            }}>
              <div style={{ position: "absolute", top: 14, right: 14, fontSize: 10, color: "#8DA9C4", letterSpacing: 2 }}>
                {studyFlipped ? "ЯДРА И ПАТОЛОГИИ" : "НАЖМИ ДЛЯ ДЕТАЛЕЙ"}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                  background: TYPE_COLORS[NERVES[studyIndex].type]?.bg,
                  border: `2px solid ${TYPE_COLORS[NERVES[studyIndex].type]?.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: "bold", color: TYPE_COLORS[NERVES[studyIndex].type]?.text
                }}>{NERVES[studyIndex].roman}</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>{NERVES[studyIndex].emoji} {NERVES[studyIndex].name}</div>
                  <div style={{ fontSize: 12, color: "#8DA9C4", fontStyle: "italic" }}>{NERVES[studyIndex].latin}</div>
                </div>
              </div>

              <div style={{
                display: "inline-block", padding: "3px 12px", borderRadius: 20, marginBottom: 18,
                background: TYPE_COLORS[NERVES[studyIndex].type]?.bg,
                border: `1px solid ${TYPE_COLORS[NERVES[studyIndex].type]?.border}`,
                color: TYPE_COLORS[NERVES[studyIndex].type]?.text, fontSize: 11
              }}>{NERVES[studyIndex].type}</div>

              {!studyFlipped ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <InfoCard icon="⚡" label="Функция" value={NERVES[studyIndex].function} />
                  <InfoCard icon="🧬" label="Выход из мозга" value={NERVES[studyIndex].origin} />
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <InfoCard icon="🔬" label="Ядро" value={NERVES[studyIndex].nucleus} />
                  <InfoCard icon="⚠️" label="Расстройство" value={NERVES[studyIndex].disorder} />
                </div>
              )}
            </div>
            <div style={{ textAlign: "center", color: "#8DA9C4", fontSize: 11 }}>Листай стрелками или нажимай на карточку</div>
          </>
        )}

        {/* ══ QUIZ ══ */}
        {screen === "quiz" && q && (
          <>
            {/* stats bar */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: "bold", color: "#2EC4B6" }}>{score}</div>
                  <div style={{ fontSize: 10, color: "#8DA9C4" }}>Очков</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: "bold", color: streak>2 ? "#FFD166" : "#E8EEF4" }}>{streak}🔥</div>
                  <div style={{ fontSize: 10, color: "#8DA9C4" }}>Серия</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: "#8DA9C4" }}>{current+1} / {questions.length}</div>
                <div style={{ fontSize: 12, color: "#2EC4B6" }}>⏱ {formatTime(timer)}</div>
              </div>
            </div>

            {/* progress bar */}
            <div style={{ height: 4, background: "#243547", borderRadius: 4, marginBottom: 20, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(current/questions.length)*100}%`, background: "#2EC4B6", transition: "width 0.4s", borderRadius: 4 }} />
            </div>

            {/* question */}
            <div style={{ ...S.card, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#8DA9C4", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{q.question}</div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#fff", lineHeight: 1.4 }}>{q.highlight}</div>
              <div style={{ marginTop: 8, fontSize: 11, color: "#8DA9C4", fontStyle: "italic" }}>
                {mode !== "name" && mode !== "number" ? `Нерв ${q.nerve.roman}` : q.nerve.latin}
              </div>
            </div>

            {/* options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => {
                const isCorrect = opt === q.correct;
                const isSelected = opt === selected;
                let bg = "#162336", border = "#243547", color = "#E8EEF4";
                if (selected !== null) {
                  if (isCorrect)       { bg = "#0d3d2a"; border = "#06D6A0"; color = "#06D6A0"; }
                  else if (isSelected) { bg = "#3d1515"; border = "#E63946"; color = "#E63946"; }
                }
                return (
                  <button key={i} onClick={() => handleAnswer(opt)} style={{
                    background: bg, border: `2px solid ${border}`, borderRadius: 12,
                    padding: "14px 16px", cursor: selected ? "default" : "pointer",
                    color, fontFamily: "Georgia, serif", fontSize: 14, textAlign: "left",
                    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12
                  }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 8, background: "#243547", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: "bold",
                      color: selected && isCorrect ? "#06D6A0" : selected && isSelected ? "#E63946" : "#8DA9C4"
                    }}>
                      {selected !== null ? (isCorrect ? "✓" : isSelected ? "✗" : String.fromCharCode(65+i)) : String.fromCharCode(65+i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div style={{ marginTop: 16 }}>
                {selected !== q.correct && (
                  <div style={{ background: "#0d3d4a", borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: "#2EC4B6", border: "1px solid #2EC4B6" }}>
                    💡 Правильный ответ: <strong>{q.correct}</strong>
                  </div>
                )}
                <button onClick={nextQuestion} style={S.btn("#2EC4B6","#0D1B2A")}>
                  {current+1 >= questions.length ? "Завершить →" : "Следующий →"}
                </button>
              </div>
            )}
          </>
        )}

        {/* ══ RESULT ══ */}
        {screen === "result" && (
          <>
            <div style={{ ...S.card, textAlign: "center", padding: 28 }}>
              <div style={{ fontSize: 56, marginBottom: 10 }}>
                {pct>=90?"🏆":pct>=70?"🎓":pct>=50?"📚":"🔄"}
              </div>
              <div style={{ fontSize: 52, fontWeight: "bold", color: pct>=70?"#06D6A0":pct>=50?"#FFD166":"#E63946" }}>
                {pct}%
              </div>
              <div style={{ fontSize: 14, color: "#8DA9C4", marginBottom: 20 }}>
                {score} из {questions.length} правильных ответов
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                <ResultStat label="Лучшая серия" val={`${bestStreak}🔥`} color="#FFD166" />
                <ResultStat label="Время" val={formatTime(timer)} color="#2EC4B6" />
                <ResultStat label="Оценка" val={pct>=90?"Отлично!":pct>=70?"Хорошо":pct>=50?"Неплохо":"Учись!"} color="#06D6A0" />
              </div>
              <button onClick={startQuiz} style={S.btn("#2EC4B6","#0D1B2A")}>🔄 Пройти снова</button>
              <button onClick={goMenu}    style={S.btn("#162336","#E8EEF4","#243547")}>← В меню</button>
            </div>

            {answers.filter(a => !a.isCorrect).length > 0 && (
              <div style={S.card}>
                <div style={{ fontSize: 13, fontWeight: "bold", color: "#E63946", marginBottom: 12 }}>⚠️ Ошибки — повторить:</div>
                {answers.filter(a => !a.isCorrect).map((a, i) => (
                  <div key={i} style={{ padding: "10px 12px", background: "#0D1B2A", borderRadius: 10, marginBottom: 8, borderLeft: "3px solid #E63946" }}>
                    <div style={{ fontWeight: "bold", color: "#fff", fontSize: 13 }}>{a.nerve.emoji} {a.nerve.name} ({a.nerve.roman})</div>
                    <div style={{ fontSize: 11, color: "#8DA9C4", marginTop: 3 }}>Функция: {a.nerve.function}</div>
                    <div style={{ fontSize: 11, color: "#8DA9C4" }}>Выход: {a.nerve.origin}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div style={{ background: "#0D1B2A", borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ fontSize: 10, color: "#8DA9C4", marginBottom: 4 }}>{icon} {label}</div>
      <div style={{ fontSize: 12, color: "#E8EEF4", lineHeight: 1.4 }}>{value}</div>
    </div>
  );
}

function ResultStat({ label, val, color }) {
  return (
    <div style={{ background: "#0D1B2A", borderRadius: 10, padding: "12px 6px", textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: "bold", color }}>{val}</div>
      <div style={{ fontSize: 10, color: "#8DA9C4", marginTop: 3 }}>{label}</div>
    </div>
  );
}
