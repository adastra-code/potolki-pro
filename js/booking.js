(() => {
  "use strict";

  const root = document.getElementById("booking");
  if (!root) return;

  const daysBox = document.getElementById("bookingDays");
  const slotsBox = document.getElementById("bookingSlots");
  const form = root.querySelector("form[data-booking]");
  if (!daysBox || !slotsBox || !form) return;

  const dateInput = form.querySelector('input[name="date"]');
  const timeInput = form.querySelector('input[name="time"]');
  const selectedLabel = root.querySelector("[data-booking-selected]");
  const waNumber = (window.SITE_CONFIG && window.SITE_CONFIG.whatsapp) || "79017475202";

  const weekdays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const slots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  let selectedDate = "";
  let selectedTime = "";

  const pad = (n) => String(n).padStart(2, "0");
  const iso = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const humanDate = (date) => `${date.getDate()} ${months[date.getMonth()]}, ${weekdays[date.getDay()]}`;

  const syncLabel = () => {
    if (!selectedLabel) return;
    selectedLabel.textContent = selectedDate
      ? `${selectedDate}${selectedTime ? `, ${selectedTime}` : ""}`
      : "ещё не выбраны";
  };

  const buildDays = () => {
    const today = new Date();
    daysBox.innerHTML = "";

    for (let i = 1; i <= 14; i += 1) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "day";
      button.dataset.date = humanDate(date);
      button.dataset.iso = iso(date);
      button.innerHTML = `<span>${weekdays[date.getDay()]}</span><strong>${date.getDate()}</strong>`;
      button.setAttribute("aria-label", `${humanDate(date)}, выбрать день`);

      button.addEventListener("click", () => {
        daysBox.querySelectorAll(".day").forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        selectedDate = button.dataset.date;
        if (dateInput) dateInput.value = selectedDate;
        syncLabel();
      });

      daysBox.appendChild(button);
    }

    const first = daysBox.querySelector(".day");
    if (first) first.click();
  };

  const buildSlots = () => {
    slotsBox.innerHTML = "";
    slots.forEach((time) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "slot";
      button.textContent = time;
      button.dataset.time = time;
      button.setAttribute("aria-label", `Выбрать время ${time}`);

      button.addEventListener("click", () => {
        slotsBox.querySelectorAll(".slot").forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        selectedTime = time;
        if (timeInput) timeInput.value = time;
        syncLabel();
      });

      slotsBox.appendChild(button);
    });

    const first = slotsBox.querySelector(".slot");
    if (first) first.click();
  };

  const digits = (value) => (value || "").replace(/\D/g, "");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.querySelector('input[name="name"]');
    const phone = form.querySelector('input[name="phone"]');
    const address = form.querySelector('input[name="address"]');
    const comment = form.querySelector('textarea[name="comment"]');
    const consent = form.querySelector('input[name="consent"]');
    const consentError = form.querySelector(".consent__error");
    const success = form.querySelector(".form__success");
    let valid = true;

    const mark = (field, message) => {
      const wrap = field.closest(".field");
      const error = wrap ? wrap.querySelector(".field__error") : null;
      if (wrap) wrap.classList.toggle("is-invalid", Boolean(message));
      if (error) error.textContent = message || "";
      if (message) valid = false;
    };

    mark(name, name.value.trim().length >= 2 ? "" : "Укажите имя");
    mark(phone, digits(phone.value).length === 11 ? "" : "Введите телефон полностью");

    if (!selectedDate || !selectedTime) {
      valid = false;
      if (success) {
        success.hidden = false;
        success.textContent = "Выберите удобный день и время для замера.";
      }
      return;
    }

    if (consent && !consent.checked) {
      if (consentError) consentError.hidden = false;
      valid = false;
    }

    if (!valid) return;

    const lines = [
      "Запись на замер (сайт)",
      `Имя: ${name.value.trim()}`,
      `Телефон: ${phone.value}`,
      `Дата: ${selectedDate}`,
      `Время: ${selectedTime}`,
    ];
    if (address && address.value.trim()) lines.push(`Адрес: ${address.value.trim()}`);
    if (comment && comment.value.trim()) lines.push(`Комментарий: ${comment.value.trim()}`);
    lines.push("Согласие на обработку данных: да");

    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
    const win = window.open(url, "_blank", "noopener");
    if (!win) window.location.href = url;

    if (success) {
      success.hidden = false;
      success.textContent = "Запись готова в WhatsApp — нажмите «Отправить» в чате, и мы подтвердим время.";
    }
  });

  buildDays();
  buildSlots();
  syncLabel();
})();
