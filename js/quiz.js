(() => {
  "use strict";

  const quiz = document.getElementById("quiz");
  if (!quiz) return;

  const steps = Array.from(
    quiz.querySelectorAll('.quiz__step[data-step]:not([data-step="result"])')
  );
  const resultStep = quiz.querySelector('.quiz__step[data-step="result"]');
  const progress = Array.from(quiz.querySelectorAll(".quiz__progress i"));
  const answers = [];
  let current = 0;

  const recommendations = {
    matte: {
      title: "Матовое полотно",
      text: "Спокойная поверхность без бликов — универсальное решение для спальни, гостиной и детской. Не отвлекает внимание и выглядит как идеально окрашенный потолок.",
      href: "materialy.html#matte",
      link: "Подробнее о матовых полотнах",
    },
    gloss: {
      title: "Глянцевое полотно",
      text: "Отражает свет и визуально добавляет комнате высоты. Хорошо работает на кухне, в ванной и в небольших помещениях с хорошим освещением.",
      href: "materialy.html#gloss",
      link: "Подробнее о глянце",
    },
    satin: {
      title: "Сатиновое полотно",
      text: "Мягкий перламутровый отблеск — компромисс между матом и глянцем. Подходит для гостиной и спальни, где хочется света, но без зеркального эффекта.",
      href: "materialy.html#satin",
      link: "Подробнее о сатине",
    },
    light: {
      title: "Потолок со световыми линиями",
      text: "Свет по периметру или полосами даёт ровное освещение без люстры и делает комнату визуально больше. Чаще всего выбирают для гостиной и кухни.",
      href: "svetovye-linii.html",
      link: "Страница «Световые линии»",
    },
    shadow: {
      title: "Теневой потолок",
      text: "Полотно примыкает к стене через аккуратный зазор — без широкого багета. Минималистичный вариант для современного интерьера.",
      href: "tenevye-potolki.html",
      link: "Страница «Теневые потолки»",
    },
    floating: {
      title: "Парящий потолок",
      text: "Подсветка по периметру создаёт эффект парящего полотна. Выразительное решение для гостиной, спальни и зон отдыха.",
      href: "paryashchie-potolki.html",
      link: "Страница «Парящие потолки»",
    },
    multi: {
      title: "Многоуровневый потолок",
      text: "Уровни, ниши и скрытая подсветка помогают зонировать комнату и спрятать коммуникации. Обсудим эскиз на замере.",
      href: "mnogourovnevye-potolki.html",
      link: "Страница «Многоуровневые потолки»",
    },
  };

  const setProgress = () => {
    progress.forEach((bar, i) => {
      bar.classList.toggle("is-done", i <= current);
    });
  };

  const show = (index) => {
    steps.forEach((step, i) => step.classList.toggle("is-active", i === index));
    current = index;
    setProgress();
    const active = steps[index];
    if (active) {
      const heading = active.querySelector("h2");
      if (heading) heading.setAttribute("tabindex", "-1");
      if (heading) heading.focus({ preventScroll: true });
    }
  };

  const finish = () => {
    const scores = {};
    answers.forEach((answer) => {
      (answer.types || "").split(/\s+/).filter(Boolean).forEach((type) => {
        scores[type] = (scores[type] || 0) + 1;
      });
    });

    const order = ["light", "shadow", "floating", "multi", "gloss", "satin", "matte"];
    let best = "matte";
    order.forEach((type) => {
      if ((scores[type] || 0) > (scores[best] || 0)) best = type;
    });

    const rec = recommendations[best] || recommendations.matte;
    const title = resultStep.querySelector("[data-quiz-title]");
    const text = resultStep.querySelector("[data-quiz-text]");
    const link = resultStep.querySelector("[data-quiz-link]");
    const summary = resultStep.querySelector("[data-quiz-summary]");
    const wa = resultStep.querySelector("[data-quiz-wa]");

    if (title) title.textContent = rec.title;
    if (text) text.textContent = rec.text;
    if (link) {
      link.href = rec.href;
      link.textContent = rec.link;
    }

    if (summary) {
      summary.innerHTML = answers
        .map((answer) => `<li><span>${answer.question}</span><strong>${answer.label}</strong></li>`)
        .join("");
    }

    if (wa) {
      const lines = ["Подбор потолка (тест на сайте)"];
      answers.forEach((answer) => lines.push(`${answer.question}: ${answer.label}`));
      lines.push(`Рекомендация: ${rec.title}`);
      wa.href = `https://wa.me/${(window.SITE_CONFIG && window.SITE_CONFIG.whatsapp) || "79017475202"}?text=${encodeURIComponent(
        lines.join("\n")
      )}`;
    }

    steps.forEach((step) => step.classList.remove("is-active"));
    if (resultStep) resultStep.classList.add("is-active");
    current = steps.length;
    progress.forEach((bar) => bar.classList.add("is-done"));
    resultStep.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  steps.forEach((step, stepIndex) => {
    const options = Array.from(step.querySelectorAll(".quiz__option"));
    options.forEach((option) => {
      option.addEventListener("click", () => {
        options.forEach((item) => item.classList.remove("is-selected"));
        option.classList.add("is-selected");

        answers[stepIndex] = {
          question: step.dataset.question || `Вопрос ${stepIndex + 1}`,
          label: option.dataset.label || option.textContent.trim(),
          types: option.dataset.types || "",
        };

        window.setTimeout(() => {
          if (stepIndex + 1 < steps.length) {
            show(stepIndex + 1);
          } else {
            finish();
          }
        }, 180);
      });
    });

    const back = step.querySelector("[data-quiz-back]");
    if (back) {
      back.addEventListener("click", () => {
        if (stepIndex > 0) show(stepIndex - 1);
      });
    }
  });

  const restart = quiz.querySelector("[data-quiz-restart]");
  if (restart) {
    restart.addEventListener("click", () => {
      answers.length = 0;
      quiz.querySelectorAll(".quiz__option").forEach((option) => option.classList.remove("is-selected"));
      if (resultStep) resultStep.classList.remove("is-active");
      show(0);
    });
  }

  setProgress();
})();
