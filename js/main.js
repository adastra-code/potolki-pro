(() => {
  "use strict";

  const cfg = window.SITE_CONFIG || {};
  const phoneRaw = cfg.phoneRaw || "+79017475202";
  const waNumber = cfg.whatsapp || "79017475202";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Год в подвале ---------- */
  $$("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Шапка ---------- */
  const header = $(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Меню ---------- */
  const burger = $("#burger");
  const nav = $("#nav");

  if (burger && nav) {
    const close = () => {
      nav.classList.remove("is-open");
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Открыть меню");
      document.body.classList.remove("is-locked");
    };

    const open = () => {
      nav.classList.add("is-open");
      burger.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Закрыть меню");
      document.body.classList.add("is-locked");
    };

    burger.addEventListener("click", () => {
      nav.classList.contains("is-open") ? close() : open();
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) close();
    });
  }

  /* ---------- Активный пункт меню ---------- */
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav a").forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (href && !href.startsWith("#") && href === current) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- Появление блоков ---------- */
  const revealItems = $$(".reveal");
  if (revealItems.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((el) => el.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const siblings = Array.from(el.parentElement ? el.parentElement.children : []);
            const index = Math.min(siblings.indexOf(el), 5);
            el.style.transitionDelay = `${index * 70}ms`;
            el.classList.add("is-visible");
            observer.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealItems.forEach((el) => observer.observe(el));
    }
  }

  /* ---------- Маска телефона ---------- */
  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, "");
    if (!digits) return "";
    if (digits[0] === "8") digits = `7${digits.slice(1)}`;
    if (digits[0] !== "7") digits = `7${digits}`;
    digits = digits.slice(0, 11);

    let out = "+7";
    if (digits.length > 1) out += ` (${digits.slice(1, 4)}`;
    if (digits.length >= 5) out += `) ${digits.slice(4, 7)}`;
    if (digits.length >= 8) out += `-${digits.slice(7, 9)}`;
    if (digits.length >= 10) out += `-${digits.slice(9, 11)}`;
    return out;
  };

  const phoneDigits = (value) => (value || "").replace(/\D/g, "");

  $$('input[type="tel"]').forEach((input) => {
    input.addEventListener("input", () => {
      input.value = formatPhone(input.value);
    });
    input.addEventListener("focus", () => {
      if (!input.value) input.value = "+7 (";
    });
    input.addEventListener("blur", () => {
      if (phoneDigits(input.value).length <= 1) input.value = "";
    });
  });

  /* ---------- Заявки ---------- */
  const waLink = (text) => {
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  };

  const sendToWhatsApp = (text) => {
    const win = window.open(waLink(text), "_blank", "noopener");
    if (!win) window.location.href = waLink(text);
  };

  const setError = (field, message) => {
    const wrap = field.closest(".field");
    const error = wrap ? $(".field__error", wrap) : null;
    if (wrap) wrap.classList.toggle("is-invalid", Boolean(message));
    if (error) error.textContent = message || "";
  };

  $$("form[data-lead]").forEach((form) => {
    const consent = $('input[name="consent"]', form);
    const consentError = $(".consent__error", form);
    const success = $(".form__success", form);
    const submit = $('button[type="submit"]', form);

    if (consent) {
      consent.addEventListener("change", () => {
        if (consent.checked && consentError) consentError.hidden = true;
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = $('input[name="name"]', form);
      const phone = $('input[name="phone"]', form);
      let valid = true;

      if (name) {
        if (!name.value.trim() || name.value.trim().length < 2) {
          setError(name, "Укажите имя");
          valid = false;
        } else {
          setError(name, "");
        }
      }

      if (phone) {
        if (phoneDigits(phone.value).length !== 11) {
          setError(phone, "Введите телефон полностью");
          valid = false;
        } else {
          setError(phone, "");
        }
      }

      if (consent && !consent.checked) {
        if (consentError) consentError.hidden = false;
        valid = false;
      }

      if (!valid) {
        const firstInvalid = $(".is-invalid input, .field.is-invalid", form);
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const lines = [];
      const formName = form.dataset.formName || "Заявка с сайта";
      lines.push(formName);
      lines.push(`Имя: ${name ? name.value.trim() : "—"}`);
      lines.push(`Телефон: ${phone ? phone.value : "—"}`);

      $$("input, select, textarea", form).forEach((field) => {
        if (!field.name || ["name", "phone", "consent"].includes(field.name)) return;
        if (!field.value || !field.value.trim()) return;
        const label = field.closest(".field");
        const caption = label ? $("span", label) : null;
        lines.push(`${caption ? caption.textContent.trim() : field.name}: ${field.value.trim()}`);
      });

      lines.push("Согласие на обработку данных: да");
      sendToWhatsApp(lines.join("\n"));

      if (success) {
        success.hidden = false;
        success.textContent =
          "Заявка готова в WhatsApp — осталось нажать «Отправить» в чате. Или позвоните нам.";
      }
      if (submit) submit.textContent = "Открыть WhatsApp ещё раз";
    });
  });

  /* ---------- Калькулятор параметров ---------- */
  const calc = $("#calc");
  if (calc) {
    const roomsBox = $("#calcRooms", calc);
    const addBtn = $("[data-calc-add]", calc);
    const totalArea = $("[data-calc-area]", calc);
    const totalCount = $("[data-calc-count]", calc);
    const totalLights = $("[data-calc-lights]", calc);
    const sendBtn = $("[data-calc-send]", calc);
    let counter = 0;

    const types = [
      "Матовый",
      "Глянцевый",
      "Сатиновый",
      "Теневой",
      "Парящий",
      "Световые линии",
      "Многоуровневый",
      "Фотопечать",
    ];

    const roomMarkup = (index) => `
      <div class="calc-room">
        <div class="calc-room__head">
          <strong>Комната ${index}</strong>
          <button type="button" class="calc-room__remove" data-calc-remove aria-label="Удалить комнату">×</button>
        </div>
        <div class="form-row">
          <label class="field">
            <span>Площадь, м²</span>
            <input type="number" name="area" min="1" max="300" step="1" inputmode="numeric" placeholder="18" />
          </label>
          <label class="field">
            <span>Тип потолка</span>
            <select name="type">
              ${types.map((type) => `<option>${type}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="form-row">
          <label class="field">
            <span>Светильники, шт.</span>
            <input type="number" name="lights" min="0" max="40" step="1" inputmode="numeric" placeholder="4" />
          </label>
          <label class="field">
            <span>Люстра</span>
            <select name="chandelier">
              <option>Нужна</option>
              <option>Не нужна</option>
            </select>
          </label>
        </div>
      </div>
    `;

    const recalc = () => {
      const rooms = $$(".calc-room", roomsBox);
      let area = 0;
      let lights = 0;

      rooms.forEach((room) => {
        const a = Number($('input[name="area"]', room)?.value) || 0;
        const l = Number($('input[name="lights"]', room)?.value) || 0;
        area += a;
        lights += l;
      });

      if (totalArea) totalArea.textContent = area ? `${area} м²` : "—";
      if (totalCount) totalCount.textContent = String(rooms.length);
      if (totalLights) totalLights.textContent = String(lights);
    };

    const addRoom = () => {
      if ($$(".calc-room", roomsBox).length >= 6) return;
      counter += 1;
      roomsBox.insertAdjacentHTML("beforeend", roomMarkup(counter));
      recalc();
    };

    roomsBox.addEventListener("input", recalc);
    roomsBox.addEventListener("change", recalc);

    roomsBox.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-calc-remove]");
      if (!remove) return;
      if ($$(".calc-room", roomsBox).length <= 1) return;
      remove.closest(".calc-room").remove();
      recalc();
    });

    if (addBtn) {
      addBtn.addEventListener("click", addRoom);
    }

    if (sendBtn) {
      sendBtn.addEventListener("click", () => {
        const rooms = $$(".calc-room", roomsBox);
        const lines = ["Расчёт потолка (сайт)"];

        rooms.forEach((room, i) => {
          const area = $('input[name="area"]', room)?.value || "—";
          const type = $('select[name="type"]', room)?.value || "—";
          const lights = $('input[name="lights"]', room)?.value || "0";
          const chandelier = $('select[name="chandelier"]', room)?.value || "—";
          lines.push(
            `Комната ${i + 1}: ${area} м², ${type}, светильники: ${lights}, люстра: ${chandelier.toLowerCase()}`
          );
        });

        lines.push(`Итого площадь: ${totalArea ? totalArea.textContent : "—"}`);
        lines.push("Стоимость рассчитаем после замера.");
        sendToWhatsApp(lines.join("\n"));
      });
    }

    addRoom();
  }

  /* ---------- Быстрые ссылки на телефон ---------- */
  $$("[data-phone-link]").forEach((link) => {
    link.setAttribute("href", `tel:${phoneRaw.replace(/[^\d+]/g, "")}`);
  });
})();
