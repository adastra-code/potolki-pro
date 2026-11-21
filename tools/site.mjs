export const SITE = {
  name: "Потолки Про",
  legal: "Потолки Про",
  url: "https://adastra-code.github.io/potolki-pro/",
  phone: "+7 (901) 747-52-02",
  phoneRaw: "+79017475202",
  whatsapp: "79017475202",
  city: "Дзержинский",
  region: "Московская область",
  addressShort: "Дзержинский, ул. Стройгородок, вл5, 2 этаж",
  addressFull: "Московская область, Дзержинский, ул. Стройгородок, вл5, 2 этаж",
  hours: "Ежедневно 08:00–21:00",
  hoursShort: "08:00–21:00",
  rating: "4,9",
  ratingValue: "4.9",
  ratingsCount: 25,
  reviewsCount: 22,
  photosCard: 39,
  photosGallery: 38,
  mapUrl: "https://yandex.ru/maps/org/natyazhnyye_potolki_pro/80477263472/",
  reviewsUrl: "https://yandex.ru/maps/org/natyazhnyye_potolki_pro/80477263472/reviews/",
};

const NAV = [
  ["uslugi.html", "Услуги"],
  ["prices.html", "Цены"],
  ["gallery.html", "Работы"],
  ["materialy.html", "Материалы"],
  ["otzyvy.html", "Отзывы"],
  ["o-kompanii.html", "О компании"],
  ["index.html#contacts", "Контакты"],
];

export const BRAND = `
      <a class="brand" href="index.html" aria-label="Потолки Про — на главную">
        <span class="brand__mark" aria-hidden="true">П</span>
        <span class="brand__text">
          <span class="brand__name">ПОТОЛКИ <em>ПРО</em></span>
          <span class="brand__city">Дзержинский · МО</span>
        </span>
      </a>`;

export function header(active = "") {
  const links = NAV.map(([href, label]) => {
    const isActive = active && href === active ? ' class="is-active" aria-current="page"' : "";
    return `        <a href="${href}"${isActive}>${label}</a>`;
  }).join("\n");

  return `
  <header class="site-header" id="header">
    <div class="wrap header-inner">
${BRAND}

      <nav class="nav" id="nav" aria-label="Основная навигация">
${links}
        <div class="nav__mobile-cta">
          <a class="btn btn--solid" href="zapis.html">Записаться на замер</a>
          <a class="nav__phone" href="tel:${SITE.phoneRaw}">${SITE.phone}</a>
        </div>
      </nav>

      <div class="header-actions">
        <a class="header-phone" href="tel:${SITE.phoneRaw}">
          <span>${SITE.hours}</span>
          <strong>${SITE.phone}</strong>
        </a>
        <a class="btn btn--solid btn--sm" href="zapis.html">Вызвать замерщика</a>
        <button class="burger" id="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="nav">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>`;
}

export function footer() {
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="brand" href="index.html" aria-label="Потолки Про — на главную">
            <span class="brand__mark" aria-hidden="true">П</span>
            <span class="brand__text">
              <span class="brand__name">ПОТОЛКИ <em>ПРО</em></span>
              <span class="brand__city">Дзержинский · МО</span>
            </span>
          </a>
          <p>Натяжные потолки под ключ в Дзержинском и соседних городах: замер, изготовление, монтаж, световые линии и профильные системы.</p>
        </div>
        <div class="footer-col">
          <h3>Услуги</h3>
          <ul>
            <li><a href="paryashchie-potolki.html">Парящие потолки</a></li>
            <li><a href="tenevye-potolki.html">Теневые потолки</a></li>
            <li><a href="svetovye-linii.html">Световые линии</a></li>
            <li><a href="mnogourovnevye-potolki.html">Многоуровневые</a></li>
            <li><a href="uslugi.html">Все услуги</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Комнаты</h3>
          <ul>
            <li><a href="kuhnya.html">Кухня</a></li>
            <li><a href="spalnya.html">Спальня</a></li>
            <li><a href="detskaya.html">Детская</a></li>
            <li><a href="vannaya.html">Ванная</a></li>
            <li><a href="gallery.html">Галерея работ</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Контакты</h3>
          <ul>
            <li><a href="tel:${SITE.phoneRaw}">${SITE.phone}</a></li>
            <li><a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li>${SITE.addressShort}</li>
            <li>${SITE.hours}</li>
            <li><a href="garantii.html">Гарантии и документы</a></li>
            <li><a href="zapis.html">Записаться на замер</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span data-year>2026</span> Потолки Про · Дзержинский</span>
        <span><a href="privacy.html">Политика конфиденциальности</a></span>
        <span>Информация на сайте не является публичной офертой</span>
      </div>
      <div class="footer-wordmark" aria-hidden="true">ПОТОЛКИ ПРО</div>
    </div>
  </footer>

  <div class="mobile-bar">
    <a href="tel:${SITE.phoneRaw}">Позвонить</a>
    <a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
    <a href="zapis.html">Замер</a>
  </div>`;
}

export function favicon() {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%231f5c49'/%3E%3Ctext x='32' y='45' font-family='Georgia,serif' font-size='38' fill='%23f7f4ed' text-anchor='middle'%3EП%3C/text%3E%3C/svg%3E`;
}

export function shell({
  path = "index.html",
  title,
  description,
  body = "",
  scripts = [],
  schema = [],
  ogImage = "assets/img/og.jpg",
  robots = "noindex, nofollow",
  active = "",
}) {
  const canonical = `${SITE.url}${path === "index.html" ? "" : path}`;
  const ogImageUrl = `${SITE.url}${ogImage}`;
  const scriptTags = ["config.js", "main.js", ...scripts]
    .map((src) => `  <script src="js/${src}"></script>`)
    .join("\n");
  const schemaTags = schema
    .map(
      (item) =>
        `  <script type="application/ld+json">\n${JSON.stringify(item, null, 2)
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n")}\n  </script>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script>
    (function () {
      var root = document.documentElement;
      if (window.location.search.indexOf("noanim") !== -1) {
        root.classList.remove("js");
        return;
      }
      root.classList.add("js");
      setTimeout(function () {
        if (document.visibilityState !== "visible" || !document.querySelector(".reveal.is-visible")) {
          root.classList.remove("js");
        }
      }, 2200);
    })();
  </script>
  <title>${title}</title>
  <meta name="description" content="${description}" />
  ${robots ? `<meta name="robots" content="${robots}" />` : ""}
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ru_RU" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:site_name" content="${SITE.name}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="#f7f4ed" />
  <link rel="icon" href="${favicon()}" />
  <link rel="stylesheet" href="css/style.css?v=20261121" />
${schemaTags}
</head>
<body>
  <a class="skip-link" href="#main">Перейти к содержимому</a>
${header(active)}

  <main id="main">
${body}
  </main>
${footer()}

${scriptTags}
</body>
</html>
`;
}

export function crumbs(items) {
  const list = items
    .map(([href, label], index) => {
      if (!href) return `        <span aria-current="page">${label}</span>`;
      return `        <a href="${href}">${label}</a>${index < items.length - 1 ? '<span aria-hidden="true">/</span>' : ""}`;
    })
    .join("\n");
  return `      <nav class="crumbs" aria-label="Хлебные крошки">
${list}
      </nav>`;
}

export function pageHero({ title, lead, crumbsHtml = "", meta = "", h1 }) {
  return `
    <section class="page-hero">
      <div class="wrap">
${crumbsHtml}
        <h1${h1 ? "" : ""}>${h1 || title}</h1>
        <p class="lead">${lead}</p>
${meta ? `        <div class="page-hero__meta">${meta}</div>` : ""}
      </div>
    </section>`;
}

export function ctaSection({ title = "Запишитесь на замер", text = "Приедем в удобное время, покажем образцы и посчитаем стоимость на месте.", formName = "Заявка со страницы" }) {
  return `
    <section class="section section--surface" id="zayavka">
      <div class="wrap contact-grid">
        <div>
          <p class="eyebrow">Замер и расчёт</p>
          <h2>${title}</h2>
          <p class="lead">${text}</p>
          <ul class="contact-list">
            <li><span class="label">Телефон</span><a href="tel:${SITE.phoneRaw}">${SITE.phone}</a></li>
            <li><span class="label">WhatsApp</span><a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">Написать в WhatsApp</a></li>
            <li><span class="label">Адрес офиса</span><span>${SITE.addressFull}</span></li>
            <li><span class="label">Часы работы</span><span>${SITE.hours}</span></li>
          </ul>
        </div>
        <div class="form-card">
          <h3>Оставьте заявку</h3>
          <p class="form-card__intro">Перезвоним, уточним детали и согласуем время замера.</p>
          <form class="form" data-lead data-form-name="${formName}" novalidate>
            <div class="form-row">
              <label class="field">
                <span>Имя</span>
                <input type="text" name="name" autocomplete="name" placeholder="Как к вам обращаться" required />
                <small class="field__error"></small>
              </label>
              <label class="field">
                <span>Телефон</span>
                <input type="tel" name="phone" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required />
                <small class="field__error"></small>
              </label>
            </div>
            <label class="field">
              <span>Комментарий</span>
              <textarea name="message" rows="3" placeholder="Что планируете сделать"></textarea>
            </label>
            <label class="consent">
              <input type="checkbox" name="consent" />
              <span class="consent__box" aria-hidden="true"></span>
              <span class="consent__text">Согласен с <a href="privacy.html" target="_blank" rel="noopener">политикой конфиденциальности</a> и обработкой данных</span>
            </label>
            <p class="consent__error" role="alert" hidden>Отметьте согласие на обработку данных</p>
            <button class="btn btn--solid btn--block" type="submit">Отправить заявку</button>
            <p class="form-note">Заявка откроется в WhatsApp. Или позвоните: ${SITE.phone}.</p>
            <p class="form__success" role="status" hidden></p>
          </form>
        </div>
      </div>
    </section>`;
}

export function faqSection(items, { title = "Частые вопросы", eyebrow = "Вопросы" } = {}) {
  const list = items
    .map(
      ([question, answer], index) =>
        `          <details${index === 0 ? " open" : ""}>
            <summary>${question}</summary>
            <p>${answer}</p>
          </details>`
    )
    .join("\n");

  return `
    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="section-head__num">${eyebrow}</span>
            <h2>${title}</h2>
          </div>
          <div class="section-head__desc"><p>Не нашли ответ — позвоните, подскажем по вашему объекту.</p></div>
        </div>
        <div class="faq">
${list}
        </div>
      </div>
    </section>`;
}

export function relatedLinks(title, items) {
  const cards = items
    .map(
      ([href, heading, text]) => `          <a class="info-card" href="${href}">
            <h3>${heading}</h3>
            <p>${text}</p>
          </a>`
    )
    .join("\n");
  return `
    <section class="section section--tight section--paper2">
      <div class="wrap">
        <div class="section-head">
          <div><span class="section-head__num">Смотрите также</span><h2>${title}</h2></div>
        </div>
        <div class="cards-3">
${cards}
        </div>
      </div>
    </section>`;
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "Натяжные потолки Про",
  description: "Натяжные потолки под ключ: замер, изготовление, монтаж, световые линии, теневые и парящие профили.",
  telephone: "+7-901-747-52-02",
  url: SITE.url,
  image: `${SITE.url}assets/img/og.jpg`,
  priceRange: "от 750 ₽",
  sameAs: [SITE.mapUrl],
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Стройгородок, вл5, этаж 2",
    addressLocality: "Дзержинский",
    addressRegion: "Московская область",
    addressCountry: "RU",
  },
  areaServed: ["Дзержинский", "Котельники", "Люберцы", "Жуковский", "Москва"],
  openingHours: "Mo-Su 08:00-21:00",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "25",
    reviewCount: "22",
  },
};

