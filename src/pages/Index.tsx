import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const BEACH_IMG = "https://cdn.poehali.dev/projects/7b9861ff-88ff-41d1-86a7-73eb64e7b904/files/74132b05-df3b-44ac-9278-6df357eecd39.jpg";

const QUIZ_STEPS = [
  {
    question: "Сколько человек планирует поездку?",
    type: "single" as const,
    options: [
      "2 взрослых",
      "2 взрослых + 1 ребёнок",
      "2 взрослых + 2 ребёнка",
      "1 взрослый + 1 ребёнок",
      "1 взрослый + 2 ребёнка",
      "Другое",
    ],
  },
  {
    question: "Какой бюджет рассматриваете?",
    type: "single" as const,
    options: ["200 000 – 300 000 ₽", "300 000 – 400 000 ₽", "400 000 ₽+"],
  },
  {
    question: "Когда планируете поездку?",
    type: "single" as const,
    options: ["В ближайший месяц", "Через 1–2 месяца", "Позже", "Гибкие даты"],
  },
  {
    question: "Что для вас важнее всего в отдыхе?",
    type: "multi" as const,
    hint: "Можно выбрать несколько",
    options: [
      "Комфорт и сервис",
      "Новый отель",
      "Отдых для детей (бассейны, клубы, аниматор)",
      "Хороший пляж",
      "Спокойствие / без шума",
    ],
  },
  {
    question: "Куда отправить подборку вариантов?",
    type: "single" as const,
    options: ["По телефону", "Max", "WhatsApp"],
  },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function QuizModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(string | string[] | null)[]>(Array(QUIZ_STEPS.length).fill(null));
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const current = QUIZ_STEPS[step];
  const answer = answers[step];

  function selectOption(opt: string) {
    if (current.type === "single") {
      const next = [...answers];
      next[step] = opt;
      setAnswers(next);
    } else {
      const prev = (answers[step] as string[]) || [];
      const next = [...answers];
      next[step] = prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt];
      setAnswers(next);
    }
  }

  function isSelected(opt: string) {
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.includes(opt);
    return answer === opt;
  }

  function canNext() {
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  }

  function handleNext() {
    if (step < QUIZ_STEPS.length - 1) setStep(step + 1);
    else setStep(QUIZ_STEPS.length);
  }

  const progress = (step / QUIZ_STEPS.length) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(30,40,60,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative"
        style={{ maxHeight: "90vh", overflowY: "auto", animation: "scale-in 0.3s ease-out" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"
        >
          <Icon name="X" size={22} />
        </button>

        <div className="p-7">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "hsl(var(--orange))" }}>
              Подбор тура
            </p>
            <h3 className="text-xl font-bold text-brand-navy font-golos">
              Семейный отдых в Турции: Всё включено
            </h3>
          </div>

          {step < QUIZ_STEPS.length && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Вопрос {step + 1} из {QUIZ_STEPS.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: "hsl(var(--orange))" }}
                />
              </div>
            </div>
          )}

          {step < QUIZ_STEPS.length && (
            <div>
              <h4 className="text-lg font-semibold text-brand-navy mb-1">{current.question}</h4>
              {current.hint && <p className="text-sm text-gray-400 mb-4">{current.hint}</p>}
              {!current.hint && <div className="mb-4" />}
              <div className="flex flex-col gap-2.5">
                {current.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => selectOption(opt)}
                    className={`quiz-option text-left text-sm ${isSelected(opt) ? "selected" : ""}`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all"
                        style={{
                          borderColor: isSelected(opt) ? "hsl(var(--orange))" : "#d1d5db",
                          background: isSelected(opt) ? "hsl(var(--orange))" : "transparent",
                        }}
                      />
                      {opt}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className="mt-6 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{
                  background: canNext() ? "hsl(var(--orange))" : "#e5e7eb",
                  color: canNext() ? "white" : "#9ca3af",
                  cursor: canNext() ? "pointer" : "not-allowed",
                }}
              >
                {step < QUIZ_STEPS.length - 1 ? "Следующий вопрос →" : "Готово, получить подборку →"}
              </button>
            </div>
          )}

          {step === QUIZ_STEPS.length && !submitted && (
            <div>
              <div className="rounded-xl p-4 mb-5" style={{ background: "hsl(var(--blue-light))" }}>
                <p className="font-semibold text-brand-navy text-sm">Мы уже подобрали для вас несколько вариантов</p>
                <p className="text-sm text-gray-500 mt-1">Оставьте контакт — отправим в течение 15–30 минут</p>
              </div>
              <label className="block text-sm font-semibold text-brand-navy mb-2">Ваш номер телефона</label>
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{ fontFamily: "Golos Text, sans-serif" }}
                onFocus={(e) => (e.target.style.borderColor = "hsl(var(--orange))")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
              <button
                onClick={() => setSubmitted(true)}
                disabled={phone.length < 5}
                className="mt-4 w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: phone.length >= 5 ? "hsl(var(--orange))" : "#e5e7eb",
                  color: phone.length >= 5 ? "white" : "#9ca3af",
                  cursor: phone.length >= 5 ? "pointer" : "not-allowed",
                }}
              >
                Отправить и получить подборку
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Нажимая кнопку, вы соглашаетесь на обработку данных
              </p>
            </div>
          )}

          {submitted && (
            <div className="text-center py-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "hsl(var(--green-light))" }}
              >
                <Icon name="Check" size={32} className="text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-brand-navy mb-2">Заявка принята!</h4>
              <p className="text-sm text-gray-500">Отправим подборку в течение 15–30 минут на указанный номер.</p>
              <button
                onClick={onClose}
                className="mt-5 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "hsl(var(--orange))" }}
              >
                Закрыть
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [quizOpen, setQuizOpen] = useState(false);
  useReveal();

  const benefits = [
    { icon: "Baby", text: "Только отели, где реально комфортно с детьми" },
    { icon: "Waves", text: "Знаем, где хороший заход в море и нормальный сервис" },
    { icon: "Users", text: "Учитываем возраст детей и формат отдыха" },
    { icon: "Clock", text: "Подбор за 15–30 минут после заявки" },
  ];

  const problems = [
    "Отзывы противоречат друг другу",
    "Фото красивые, а по факту отель «уставший»",
    "Вход на пляж не такой комфортный",
    "Непонятно, подойдёт ли детям",
    "Менеджеры везде предлагают разное",
  ];

  const steps = [
    { num: "01", title: "Оставляете заявку", desc: "Отвечаете на 5 коротких вопросов" },
    { num: "02", title: "Получаете подборку", desc: "3–5 реально подходящих отелей" },
    { num: "03", title: "Выбираете и бронируете", desc: "Оформляем всё за вас за 15–30 минут" },
  ];

  return (
    <div className="font-golos bg-white" style={{ color: "hsl(var(--navy))" }}>
      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}

      {/* SCREEN 1: HERO */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={BEACH_IMG} alt="Турецкий пляж" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="font-bold text-lg tracking-tight" style={{ color: "hsl(var(--navy))" }}>
              ТурСемьи
            </span>
          </div>
          <a
            href="tel:+74950000000"
            className="flex items-center gap-2 text-sm font-semibold transition-colors"
            style={{ color: "hsl(var(--navy))" }}
          >
            <Icon name="Phone" size={16} />
            Позвонить
          </a>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col justify-end pb-16 px-6 md:px-12 max-w-3xl">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: "hsl(var(--orange))", color: "white", width: "fit-content" }}
          >
            Вылет из Москвы · Всё включено
          </span>
          <h1
            className="text-3xl md:text-5xl font-bold leading-tight mb-4"
            style={{ letterSpacing: "-0.02em", color: "hsl(var(--navy))" }}
          >
            Подберём тур в Турцию<br />
            для семьи с детьми —<br />
            <span style={{ color: "hsl(var(--orange))" }}>от 7 ночей</span> в комфортных отелях
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
            3–5 проверенных вариантов под ваш бюджет и состав семьи с вылетом из Москвы — без переплат и «сюрпризов на месте»
          </p>
          <button
            onClick={() => setQuizOpen(true)}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold text-base text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "hsl(var(--orange))",
              boxShadow: "0 8px 30px hsl(24 95% 53% / 0.35)",
              width: "fit-content",
            }}
          >
            <Icon name="Search" size={18} />
            Подобрать тур
          </button>
        </div>

        <div className="relative z-10 bg-white border-t border-gray-100 px-6 md:px-12 py-5">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(var(--orange-light))" }}
                >
                  <Icon name={b.icon} size={16} style={{ color: "hsl(var(--orange))" }} />
                </div>
                <p className="text-xs text-gray-600 leading-snug">{b.text}</p>
              </div>
            ))}
          </div>
          <div className="max-w-5xl mx-auto mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <p className="text-sm text-gray-500">
              <span className="font-semibold" style={{ color: "hsl(var(--navy))" }}>
                Не знаете, какой бюджет нужен?
              </span>{" "}
              Подскажем честно — без попытки «впарить дороже»
            </p>
            <button
              onClick={() => setQuizOpen(true)}
              className="text-sm font-semibold hover:underline flex-shrink-0"
              style={{ color: "hsl(var(--orange))" }}
            >
              Спросить →
            </button>
          </div>
        </div>
      </section>

      {/* SCREEN 2: PROBLEMS */}
      <section className="py-0 overflow-hidden" style={{ background: "hsl(var(--sand))" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 min-h-[520px]">

            {/* Photo left */}
            <div className="md:col-span-2 relative hidden md:block">
              <img
                src="https://cdn.poehali.dev/projects/7b9861ff-88ff-41d1-86a7-73eb64e7b904/files/ff478e78-5c29-41a9-b8c5-a69312128436.jpg"
                alt="Стресс при выборе тура"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to right, transparent 60%, hsl(40 40% 96%) 100%)" }}
              />
            </div>

            {/* Text right */}
            <div className="md:col-span-3 flex flex-col justify-center px-8 md:px-14 py-16">
              <div className="reveal">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Знакомая ситуация?</p>
                <h2
                  className="text-2xl md:text-4xl font-bold mb-8 leading-tight"
                  style={{ color: "hsl(var(--navy))" }}
                >
                  Выбор тура легко может превратиться в потерю времени и риск испортить отпуск
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {problems.map((p, i) => (
                  <div
                    key={i}
                    className="reveal flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "#fee2e2" }}
                    >
                      <Icon name="X" size={12} className="text-red-500" />
                    </div>
                    <p className="text-sm text-gray-700">{p}</p>
                  </div>
                ))}
              </div>
              <div
                className="reveal bg-white rounded-2xl p-6 border-l-4 mb-8"
                style={{ borderLeftColor: "hsl(var(--orange))" }}
              >
                <p className="font-semibold text-lg mb-1" style={{ color: "hsl(var(--navy))" }}>
                  В итоге: или переплата, или отдых «на удачу»
                </p>
                <p className="text-gray-500 text-sm">Мы уже отобрали нормальные варианты — без мусора и риска</p>
              </div>
              <div className="reveal">
                <p className="text-sm text-gray-500 mb-4">Оставьте заявку на подбор за 15 мин!</p>
                <button
                  onClick={() => setQuizOpen(true)}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-white font-semibold shadow-md transition-all hover:scale-105"
                  style={{ background: "hsl(var(--orange))" }}
                >
                  <Icon name="Search" size={18} />
                  Подобрать тур
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SCREEN 3: HOW IT WORKS */}
      <section className="py-0 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">

          {/* Top photo banner */}
          <div className="relative w-full h-64 md:h-80 overflow-hidden">
            <img
              src="https://cdn.poehali.dev/projects/7b9861ff-88ff-41d1-86a7-73eb64e7b904/files/37e99f0c-4013-4f67-82c6-631b0423be23.jpg"
              alt="Подбор тура с менеджером"
              className="w-full h-full object-cover object-top"
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
              style={{ background: "rgba(26, 43, 60, 0.58)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-300 mb-3">Просто и быстро</p>
              <h2
                className="text-2xl md:text-4xl font-bold leading-tight text-white"
              >
                Подбор тура под семейный отдых<br />за 30 минут — без хаоса и сомнений
              </h2>
            </div>
          </div>

        <div className="px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="reveal mb-12" />

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {steps.map((s, i) => (
              <div key={i} className="reveal">
                <div
                  className="rounded-2xl p-6 h-full"
                  style={{
                    background: i === 1 ? "hsl(var(--orange))" : "hsl(var(--blue-light))",
                  }}
                >
                  <span
                    className="text-4xl font-bold"
                    style={{
                      opacity: 0.2,
                      color: i === 1 ? "white" : "hsl(var(--orange))",
                    }}
                  >
                    {s.num}
                  </span>
                  <h3
                    className="text-lg font-bold mt-3 mb-2"
                    style={{ color: i === 1 ? "white" : "hsl(var(--navy))" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: i === 1 ? "rgba(255,237,213,0.9)" : "#6b7280" }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal rounded-2xl p-8 mb-8" style={{ background: "hsl(var(--blue-light))" }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Актуальные цены из Москвы
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5">
                <p className="text-2xl font-bold" style={{ color: "hsl(var(--navy))" }}>от 200 000 ₽</p>
                <p className="text-sm text-gray-500 mt-1">2 взрослых · 7 ночей · перелёт + проживание</p>
              </div>
              <div className="bg-white rounded-xl p-5">
                <p className="text-2xl font-bold" style={{ color: "hsl(var(--navy))" }}>от 300 000 ₽</p>
                <p className="text-sm text-gray-500 mt-1">Семья с детьми · 7 ночей · всё включено</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {["Без скрытых доплат", "Цена уже с перелётом", "Только официальные туроператоры"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Icon name="CheckCircle2" size={15} className="text-green-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="reveal rounded-2xl p-6" style={{ background: "hsl(var(--green-light))" }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Почему нам стоит доверять?
            </p>
            <div className="flex flex-wrap gap-5">
              {[
                { icon: "Award", text: "Работаем от сети Слетать.ру" },
                { icon: "MapPin", text: "Офис в Москве — можно приехать лично" },
                { icon: "Shield", text: "Только официальные туроператоры" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <Icon name={item.icon} size={16} className="text-green-600" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="reveal text-center mt-10">
            <button
              onClick={() => setQuizOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold shadow-md transition-all hover:scale-105"
              style={{ background: "hsl(var(--orange))" }}
            >
              <Icon name="MapPin" size={18} />
              Получить подборку туров
            </button>
          </div>
        </div>
        </div>
        </div>
      </section>

      {/* SCREEN 4: DREAM */}
      <section className="py-0 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 min-h-[560px]">

            {/* LEFT: text block — 60% */}
            <div className="md:col-span-3 flex flex-col justify-center px-8 md:px-16 py-16">
              <div className="reveal">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-6">
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: "hsl(170 40% 90%)", color: "#2A9D8F" }}
                  >
                    Семейный отдых без стресса
                  </span>
                </div>

                {/* H1 */}
                <h2
                  className="text-3xl md:text-5xl font-bold leading-tight mb-6"
                  style={{ color: "#1A2B3C", letterSpacing: "-0.02em" }}
                >
                  Спокойный отпуск, где всё уже продумано за вас, который вам так хочется!
                </h2>

                {/* Sub */}
                <p className="text-lg mb-6" style={{ color: "#4A5568" }}>
                  Вы прилетаете и не разбираетесь «на месте», а отдыхаете:
                </p>

                {/* List */}
                <div className="flex flex-col gap-4 mb-8">
                  {[
                    { icon: "Baby", text: "детям есть чем заняться" },
                    { icon: "UtensilsCrossed", text: "хороший сервис и питание" },
                    { icon: "Umbrella", text: "комфортный пляж без сюрпризов" },
                    { icon: "Smile", text: "вы реально отдыхаете, а не решаете проблемы" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "hsl(170 40% 92%)" }}
                      >
                        <Icon name={item.icon} size={16} style={{ color: "#2A9D8F" }} />
                      </div>
                      <p className="text-lg" style={{ color: "#4A5568" }}>{item.text}</p>
                    </div>
                  ))}
                </div>

                {/* Social proof line */}
                <div
                  className="flex items-center gap-2 text-sm italic mb-8 px-4 py-3 rounded-xl"
                  style={{ background: "#F8F4F0", color: "#6B7280" }}
                >
                  <span className="text-base">⭐</span>
                  <span>
                    Большинство клиентов{" "}
                    <strong style={{ color: "#1A2B3C", fontStyle: "normal" }}>возвращаются снова</strong>{" "}
                    или приходят по рекомендациям
                  </span>
                </div>

                {/* CTA row */}
                <div className="flex flex-wrap items-center gap-5">
                  <button
                    onClick={() => setQuizOpen(true)}
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-white font-semibold text-base transition-all duration-200 hover:brightness-90 active:scale-95"
                    style={{
                      background: "#E67E22",
                      boxShadow: "0 4px 12px rgba(230, 126, 34, 0.3)",
                    }}
                  >
                    Подобрать тур для семьи
                    <Icon name="ArrowRight" size={18} />
                  </button>

                  {/* Trust badge */}
                  <div
                    className="flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{ background: "#F4EFE6", border: "1px solid #E5D9C8" }}
                  >
                    <span className="text-lg">🏅</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#1A2B3C" }}>92%</p>
                      <p className="text-xs" style={{ color: "#6B7280" }}>рекомендуют нас</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: photo — 40% */}
            <div className="md:col-span-2 relative hidden md:block">
              <img
                src="https://cdn.poehali.dev/projects/7b9861ff-88ff-41d1-86a7-73eb64e7b904/files/4fadb56e-6c92-4b32-abb4-a48eed626393.jpg"
                alt="Семья на пляже"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay for readability */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, rgba(255,255,255,0.18) 0%, rgba(248,244,240,0.05) 100%)",
                }}
              />
              {/* Bottom fade */}
              <div
                className="absolute bottom-0 left-0 right-0 h-32"
                style={{
                  background: "linear-gradient(to top, rgba(255,255,255,0.5) 0%, transparent 100%)",
                }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* SCREEN 5: CONTACTS */}
      <section className="py-20 px-6 md:px-12 bg-white" id="contacts">
        <div className="max-w-5xl mx-auto">
          <div className="reveal mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Контакты</p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "hsl(var(--navy))" }}>
              Свяжитесь с нами удобным способом
            </h2>
          </div>

          <div className="reveal grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden relative" style={{ minHeight: "280px" }}>
              <img
                src="https://cdn.poehali.dev/projects/7b9861ff-88ff-41d1-86a7-73eb64e7b904/files/6f9cbd2c-d6db-4de9-8c43-aebec3afac55.jpg"
                alt="Офис в Москве"
                className="w-full h-full object-cover"
                style={{ minHeight: "280px" }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-center gap-2"
                style={{ background: "rgba(26,43,60,0.72)" }}
              >
                <Icon name="MapPin" size={18} style={{ color: "hsl(var(--orange))" }} />
                <p className="text-sm font-semibold text-white">Офис в Москве</p>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Адрес</p>
                <p className="font-semibold text-sm" style={{ color: "hsl(var(--navy))" }}>
                  г. Москва, адрес офиса
                </p>
                <p className="text-xs text-gray-400 mt-1">ИП Иванов Иван Иванович</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Телефон</p>
                <a
                  href="tel:+74950000000"
                  className="flex items-center gap-2 font-semibold text-lg transition-colors"
                  style={{ color: "hsl(var(--navy))" }}
                >
                  <Icon name="Phone" size={18} style={{ color: "hsl(var(--orange))" }} />
                  +7 (495) 000-00-00
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Мессенджеры</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                    style={{ background: "hsl(var(--blue-light))", color: "hsl(var(--navy))" }}
                  >
                    <Icon name="Send" size={18} style={{ color: "#0088cc" }} />
                    Telegram
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                    style={{ background: "hsl(var(--blue-light))", color: "hsl(var(--navy))" }}
                  >
                    <Icon name="MessageSquare" size={18} style={{ color: "#5B5EA6" }} />
                    Max
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                    style={{ background: "hsl(var(--green-light))", color: "hsl(var(--navy))" }}
                    >
                    <Icon name="Phone" size={18} className="text-green-600" />
                    WhatsApp
                  </a>
                </div>
              </div>

              <button
                onClick={() => setQuizOpen(true)}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-semibold transition-all hover:scale-105"
                style={{ background: "hsl(var(--orange))" }}
              >
                <Icon name="Search" size={18} />
                Подобрать тур — бесплатно
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 md:px-12 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          © 2024 ТурСемьи · Работаем от сети Слетать.ру · ИП Иванов И.И.
        </p>
      </footer>
    </div>
  );
}