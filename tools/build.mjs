import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE,
  shell,
  crumbs,
  ctaSection,
  faqSection,
  relatedLinks,
  localBusinessSchema,
} from "./site.mjs";
import { services, rooms, cities } from "./seo-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function write(name, html) {
  mkdirSync(dirname(join(root, name)), { recursive: true });
  writeFileSync(join(root, name), html, "utf8");
  console.log("✓", name);
}

const totalPages = [];

/* ------------------------------------------------------------------ */
/*  Отзывы с карточки организации                                      */
/* ------------------------------------------------------------------ */

const REVIEWS = [
  ["Мам А.", "10 ноября 2025", "Хочу выразить огромную благодарность Дмитрию и Максиму за выполненную работу! Получилось просто шик, блеск, красота. Работают быстро, чисто, со всем необходимым инструментом. Договорились быстро, сделали скидку, договор — всё как положено. Однозначно рекомендую!"],
  ["Ольга Чумаченко", "4 августа 2025", "Хочу поблагодарить Сергея за отличную работу по установке потолка в нашей квартире! Профессионал своего дела, учёл все наши пожелания и предложил полезные идеи. Работа выполнена в срок и с высоким качеством. Мы в восторге от результата! Рекомендую всем!"],
  ["FAT", "16 февраля 2026", "Отличная работа! Огромная отдельная благодарность Дмитрию! Всё сделали быстро и качественно: две комнаты, коридор и кухня — за два дня. Обязательно буду рекомендовать!"],
  ["Екатерина Вашурина", "5 декабря 2025", "Отличные потолки! Приехали, замеряли и на следующий день сделали. Максимально чисто, качественно и быстро. Спасибо, будем рекомендовать знакомым!"],
  ["Дмитрий Б.", "21 ноября 2023", "Небо и земля. Старый и затёртый потолок в тёмном помещении превратился в белоснежную гладь без невыносимых офисных панелей. Обратился по рекомендации друга и не пожалел. Чётко и быстро отработали, предложили надёжный вариант крепления, подсказали со световым решением."],
  ["Оксана Зайцева", "22 января 2026", "Огромная благодарность мастеру Дмитрию за быструю и качественную работу. Потолки супер! А главное — за чуткое отношение к людям."],
  ["Наталия Голенкова", "8 ноября 2024", "Качество, цена, сроки — всё отлично! Всегда на связи с клиентом и готовы ответить на все вопросы. Никаких непредвиденных доп. расходов. Попросила сделать потолок в спальне как можно скорее — выполнили на четыре дня раньше. Однозначно рекомендую!"],
  ["Виктория Иванова", "21 ноября 2023", "Спасибо ребятам за быструю и качественную работу! Дмитрий грамотно всё рассказал, помог выбрать оптимальный вариант для нестандартного помещения. Максим — мастер своего дела, работа выполнена идеально. Однозначно 10 из 10."],
  ["Ольга Гартман", "6 мая 2023", "Супер компания, да ещё и в нашем городе. Искала, чтобы было недорого, обзвонила много компаний. По телефону Дмитрий сделал предварительный расчёт, в этот же вечер произвели замер, заключили договор. Стоимость устроила, мастера приехали вовремя, всё аккуратно."],
  ["Александр", "23 сентября 2023", "Проект был непростой, с современными деталями, которые только появились на рынке. Рад, что обратился именно в эту компанию. Работа по потолкам и свету выполнена качественно, без дефектов. Также установили электрокарниз."],
  ["Natalia", "1 декабря 2025", "Результатом очень довольна! Отдельное спасибо за оперативность и соблюдение сроков на всех этапах."],
  ["Максим Максим", "15 мая 2023", "Первый потолок делали в другой компании: цена по телефону была заманчивой, а заплатили в полтора раза больше. Здесь ребята посчитали всё по факту, без скрытых наценок. Сделали быстро и качественно, инструмент серьёзный, подход тоже."],
  ["Олеся Егоршина", "20 мая 2025", "Всё супер! Быстро, качественно и недорого. Обращаемся уже не в первый раз, никаких претензий."],
  ["med", "26 марта 2026", "Ребята — молодцы. Все работы выполнены в срок. Доступные цены, не накрученные. Спасибо."],
  ["Николай Дроздов", "19 февраля 2025", "Очень оперативно сработали: позвонил в пятницу, в воскресенье замер, в понедельник монтаж. Давно не видел такой оперативной работы. Цена тоже отличная — уже начал собирать обратно кухню. Всем рекомендую!"],
  ["Павел Сафиуллин", "6 октября 2025", "Быстро и качественно натянули потолок. Два года — полёт нормальный."],
  ["СВ", "21 июля 2023", "Отличная команда. Устранили залив потолка очень быстро и аккуратно. Прекрасная работа и демократичная цена. Очень советую."],
  ["Марина З.", "13 марта 2025", "Очень хорошие мастера. Всё сделали быстро, аккуратно и качественно. Спасибо!"],
  ["Роман Сопин", "16 июня 2023", "Хорошая контора. Отзывчивые ребята, быстро, хорошо и качественно выполнили работу. Рекомендую!"],
  ["Ludmila Aleksandrova", "28 февраля 2023", "Ребята — профессионалы своего дела! Быстро, качественно! Объяснили что и как, предложили свои варианты. По ценам недорого."],
  ["1604", "11 марта 2023", "Спасибо за работу. Сделали всё быстро и качественно. Цены очень порадовали."],
  ["Светлана М.", "11 июня 2025", "Всё отлично, быстро, чётко и грамотно! Рекомендую."],
];

const initial = (name) => name.trim().charAt(0).toUpperCase();

/* ------------------------------------------------------------------ */
/*  Галерея                                                            */
/* ------------------------------------------------------------------ */

const TAGS = {
  "01": "gloss light hall",
  "02": "light shadow living",
  "03": "light matte living",
  "05": "gloss kitchen",
  "06": "light matte kitchen",
  "07": "matte bedroom",
  "08": "matte bedroom",
  "09": "light hall",
  "10": "gloss shadow hall",
  "11": "light hall",
  "12": "matte bedroom",
  "13": "light office",
  "14": "matte office",
  "15": "matte office",
  "16": "matte kids bedroom",
  "17": "light multi living",
  "18": "light living",
  "19": "light living",
  "20": "multi gloss hall",
  "21": "light multi kids",
  "22": "matte office",
  "23": "matte office",
  "24": "gloss living",
  "25": "light bedroom",
  "26": "matte bedroom",
  "27": "light kitchen",
  "28": "matte bedroom",
  "29": "shadow office",
  "30": "light track kitchen",
  "31": "light office",
  "32": "matte office",
  "33": "light hall",
  "34": "gloss bath",
  "35": "light office",
  "36": "light gloss office",
  "37": "light kitchen",
  "38": "light office",
  "39": "light office",
};

const ORDER = [
  "02", "03", "05", "06", "17", "18", "19", "21", "24", "30",
  "33", "36", "37", "16", "01", "20", "22", "23", "25", "26",
  "27", "28", "29", "31", "32", "34", "35", "38", "39",
  "07", "08", "09", "10", "11", "12", "13", "14", "15",
];

const WIDE = new Set(["02", "03", "05", "06", "17", "36", "38", "39"]);

const ROOM_LABEL = {
  living: "Гостиная",
  kitchen: "Кухня",
  bedroom: "Спальня",
  kids: "Детская",
  bath: "Ванная",
  hall: "Коридор",
  office: "Офис",
};

const TYPE_LABEL = {
  matte: "матовое полотно",
  gloss: "глянцевое полотно",
  satin: "сатиновое полотно",
  light: "световые линии",
  shadow: "теневой профиль",
  track: "трековый свет",
  multi: "многоуровневый потолок",
};

function shotHtml(n) {
  const tags = TAGS[n];
  const words = tags.split(" ");
  const room = words.find((word) => ROOM_LABEL[word]);
  const type = words.find((word) => TYPE_LABEL[word]);
  const label = [room ? ROOM_LABEL[room] : "", type ? TYPE_LABEL[type] : ""].filter(Boolean).join(" · ") || "Натяжной потолок";
  const filterTags = new Set(words.filter((word) => ["living", "kitchen", "bedroom", "kids", "bath", "hall", "office", "matte", "gloss", "light", "shadow", "multi"].includes(word)));
  if (tags.includes("track")) filterTags.add("light");
  filterTags.delete("detail");
  const alt = `Натяжной потолок — ${label.toLowerCase()}, фото ${Number(n)}`;
  const wide = WIDE.has(n) ? " shot--wide" : "";

  return `        <button class="shot${wide}" type="button" data-tags="${Array.from(filterTags).join(" ")}" data-caption="${label}" data-full="assets/gallery/full/${n}.jpg" aria-label="Открыть фото: ${label}">
          <img src="assets/gallery/thumb/${n}.jpg" alt="${alt}" loading="lazy" decoding="async" />
        </button>`;
}

const galleryShots = ORDER.map(shotHtml).join("\n");

/* ------------------------------------------------------------------ */
/*  Готовые блоки                                                      */
/* ------------------------------------------------------------------ */

const featureChips = `
              <span class="chip chip--green">Доставка</span>
              <span class="chip chip--green">Оплата картой</span>
              <span class="chip chip--green">Парковка</span>
              <span class="chip chip--green">Гарантия</span>
              <span class="chip chip--green">Подарочный сертификат</span>
              <span class="chip chip--green">Можно с животными</span>`;

const servicesGrid = `
        <div class="service-grid">
          <article class="service-card reveal">
            <span class="service-card__num">01</span>
            <div class="swatch swatch--matte" aria-hidden="true"></div>
            <h3>Матовые потолки</h3>
            <p>Ровная поверхность без бликов. Универсально для спальни, гостиной и детской.</p>
            <div class="service-card__foot"><span>После замера</span><a href="materialy.html#matte">Подробнее →</a></div>
          </article>
          <article class="service-card reveal">
            <span class="service-card__num">02</span>
            <div class="swatch swatch--gloss" aria-hidden="true"></div>
            <h3>Глянцевые потолки</h3>
            <p>Отражают свет и добавляют высоты. Хорошо работают в небольших комнатах.</p>
            <div class="service-card__foot"><span>После замера</span><a href="materialy.html#gloss">Подробнее →</a></div>
          </article>
          <article class="service-card reveal">
            <span class="service-card__num">03</span>
            <div class="swatch swatch--line" aria-hidden="true"></div>
            <h3>Световые линии</h3>
            <p>Свет по периметру и полосами, треки и встроенные светильники.</p>
            <div class="service-card__foot"><span>После замера</span><a href="svetovye-linii.html">Подробнее →</a></div>
          </article>
          <article class="service-card reveal">
            <span class="service-card__num">04</span>
            <div class="swatch swatch--shadow" aria-hidden="true"></div>
            <h3>Теневые профили</h3>
            <p>Тонкий зазор вместо широкого багета. Чистое минималистичное примыкание.</p>
            <div class="service-card__foot"><span>После замера</span><a href="tenevye-potolki.html">Подробнее →</a></div>
          </article>
          <article class="service-card reveal">
            <span class="service-card__num">05</span>
            <div class="swatch swatch--multi" aria-hidden="true"></div>
            <h3>Многоуровневые</h3>
            <p>Зонирование, ниши под подсветку и скрытые гардины по эскизу.</p>
            <div class="service-card__foot"><span>После замера</span><a href="mnogourovnevye-potolki.html">Подробнее →</a></div>
          </article>
          <article class="service-card reveal">
            <span class="service-card__num">06</span>
            <div class="swatch swatch--satin" aria-hidden="true"></div>
            <h3>Скрытые гардины и фотопечать</h3>
            <p>Ниша под карниз, печать на полотне и другие работы под интерьер.</p>
            <div class="service-card__foot"><span>После замера</span><a href="uslugi.html">Подробнее →</a></div>
          </article>
        </div>`;

/* ------------------------------------------------------------------ */
/*  Страницы                                                           */
/* ------------------------------------------------------------------ */

/* ---------- Галерея ---------- */
const galleryBody = `
    <section class="page-hero">
      <div class="wrap">
${crumbs([["index.html", "Главная"], ["", "Работы"]])}
        <h1>Работы</h1>
        <p class="lead">Матовые и глянцевые полотна, световые линии, теневые профили и трековый свет. В карточке организации — 39 фотографий, здесь — 38 работ с объектов.</p>
        <div class="page-hero__meta">
          <span class="chip chip--green">38 фото</span>
          <span class="chip">Гостиные и кухни</span>
          <span class="chip">Спальни и детские</span>
          <span class="chip">Свет и профили</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="filters" id="galleryFilters" role="group" aria-label="Фильтр работ">
          <button class="filter is-active" type="button" data-filter="all">Все</button>
          <button class="filter" type="button" data-filter="living">Гостиная</button>
          <button class="filter" type="button" data-filter="kitchen">Кухня</button>
          <button class="filter" type="button" data-filter="bedroom">Спальня</button>
          <button class="filter" type="button" data-filter="kids">Детская</button>
          <button class="filter" type="button" data-filter="bath">Ванная</button>
          <button class="filter" type="button" data-filter="hall">Коридор</button>
          <button class="filter" type="button" data-filter="office">Офис</button>
          <button class="filter" type="button" data-filter="light">Свет</button>
          <button class="filter" type="button" data-filter="shadow">Теневые</button>
          <button class="filter" type="button" data-filter="gloss">Глянец</button>
        </div>

        <div class="gallery-grid" id="galleryGrid">
${galleryShots}
        </div>

        <div class="gallery-more">
          <button class="btn btn--ghost" id="galleryMore" type="button">Показать ещё</button>
        </div>

        <p class="muted small" style="margin-top: 26px;">Фотографии показывают реализованные объекты и детали монтажа. Хотите похожий потолок — запишитесь на замер, обсудим материалы и свет.</p>
      </div>
    </section>

    <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фотографии" hidden>
      <button class="lightbox__close" type="button" data-lb-close aria-label="Закрыть">×</button>
      <button class="lightbox__btn lightbox__btn--prev" type="button" data-lb-prev aria-label="Предыдущее фото">‹</button>
      <img class="lightbox__img" src="" alt="Просмотр фотографии работы" />
      <button class="lightbox__btn lightbox__btn--next" type="button" data-lb-next aria-label="Следующее фото">›</button>
      <div class="lightbox__bar">
        <span class="lightbox__title"></span>
        <span class="lightbox__count"></span>
        <a class="link-arrow" href="zapis.html">Хочу такой же</a>
      </div>
    </div>

${ctaSection({ title: "Понравился потолок?", text: "Запишитесь на замер — подберём полотно, профиль и свет под вашу комнату.", formName: "Заявка со страницы работ" })}`;

write(
  "gallery.html",
  shell({
    path: "gallery.html",
    title: "Работы — натяжные потолки в Дзержинском | Потолки Про",
    description:
      "38 фотографий работ: матовые и глянцевые полотна, световые линии, теневые профили, трековый свет. Натяжные потолки в Дзержинском и Московской области.",
    body: galleryBody,
    scripts: ["gallery.js"],
    active: "gallery.html",
  })
);
totalPages.push("gallery.html");

/* ---------- Цены ---------- */
const priceRows = [
  ["Парящий натяжной потолок", "от 750 ₽", "цена из карточки организации"],
  ["Теневой профиль", "после замера", "полотно, профиль, монтаж"],
  ["Световые линии", "после замера", "лента, блок питания, профиль"],
  ["Трековые системы", "после замера", "трек, светильники, монтаж"],
  ["Скрытые гардины", "после замера", "ниша и карниз"],
  ["Фотопечать", "после замера", "макет и печать на полотне"],
  ["Обход труб и стояков", "в смете", "по факту на объекте"],
  ["Демонтаж старого потолка", "в смете", "если требуется"],
];

const pricesBody = `
    <section class="page-hero">
      <div class="wrap">
${crumbs([["index.html", "Главная"], ["", "Цены"]])}
        <h1>Цены и порядок расчёта</h1>
        <p class="lead">В карточке организации указана цена парящего потолка — от 750 ₽. Остальные работы считаем после замера: так в смету попадает только то, что действительно нужно.</p>
        <div class="page-hero__meta">
          <span class="chip chip--green">от 750 ₽ за парящий</span>
          <span class="chip">Смета после замера</span>
          <span class="chip">Договор и гарантия</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="section-head__num">01 — Стоимость</span>
            <h2>Что известно по ценам</h2>
          </div>
          <div class="section-head__desc"><p>Мы не публикуем «среднюю цену за метр»: она почти всегда не совпадает с реальной. Ниже — позиции из карточки и логика расчёта.</p></div>
        </div>

        <div class="price-table">
          <div class="price-row price-row--head">
            <span>Работа</span><span>Стоимость</span><span>Комментарий</span>
          </div>
${priceRows
  .map(
    ([name, value, note]) => `          <div class="price-row">
            <span class="price-row__name">${name}</span>
            <span class="price-row__value">${value}</span>
            <span class="price-row__note">${note}</span>
          </div>`
  )
  .join("\n")}
        </div>

        <div class="callout">
          <p><strong>Парящий потолок — от 750 ₽</strong> по данным карточки организации на Яндекс.Картах. Итоговая цена зависит от площади, полотна, профиля и света; точную сумму фиксируем в смете после замера.</p>
        </div>

        <div class="price-callout reveal" style="margin-top: 30px;">
          <div>
            <h3>Нужен точный расчёт?</h3>
            <p>Приедем на замер, покажем образцы и посчитаем стоимость на месте. Без навязывания и скрытых наценок.</p>
          </div>
          <div class="price-callout__value">
            <a class="btn btn--light" href="zapis.html">Записаться на замер</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--paper2">
      <div class="wrap">
        <div class="section-head">
          <div><span class="section-head__num">02 — Факторы</span><h2>Что влияет на цену</h2></div>
          <div class="section-head__desc"><p>Две квартиры одинаковой площади могут отличаться по стоимости в разы. Вот почему.</p></div>
        </div>
        <div class="cards-3">
          <div class="info-card"><span class="info-card__num">01</span><h3>Площадь и геометрия</h3><p>Количество комнат, углов, выступов и колонн. Сложная форма требует больше профиля и времени.</p></div>
          <div class="info-card"><span class="info-card__num">02</span><h3>Полотно</h3><p>Матовое, глянцевое, сатиновое или тканевое. От фактуры зависят цена и уход.</p></div>
          <div class="info-card"><span class="info-card__num">03</span><h3>Профиль</h3><p>Обычный с вставкой, теневой, парящий или контурный — разная стоимость и требования к монтажу.</p></div>
          <div class="info-card"><span class="info-card__num">04</span><h3>Свет</h3><p>Светильники, треки, ленты и блоки питания. Схема света влияет на сроки и смету.</p></div>
          <div class="info-card"><span class="info-card__num">05</span><h3>Дополнительные работы</h3><p>Демонтаж, обход труб, скрытые гардины, подготовка стен — всё, что нужно на объекте.</p></div>
          <div class="info-card"><span class="info-card__num">06</span><h3>Срочность</h3><p>Если нужен монтаж в короткий срок, обсуждаем возможность отдельно.</p></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div><span class="section-head__num">03 — Порядок</span><h2>Как мы считаем</h2></div>
          <div class="section-head__desc"><p>Сначала замер и смета, потом работа. Никаких доплат «по ходу».</p></div>
        </div>
        <ol class="steps">
          <li class="step reveal"><span class="step__num">01</span><h3>Заявка</h3><p>Уточняем комнаты, площадь и задачу. Отвечаем на вопросы.</p></li>
          <li class="step reveal"><span class="step__num">02</span><h3>Замер</h3><p>Измеряем, проверяем стены и коммуникации, показываем образцы.</p></li>
          <li class="step reveal"><span class="step__num">03</span><h3>Смета и договор</h3><p>Фиксируем материалы, работы и стоимость, согласуем дату.</p></li>
          <li class="step reveal"><span class="step__num">04</span><h3>Монтаж</h3><p>Устанавливаем потолок и свет, убираем за собой, сдаём работу.</p></li>
        </ol>
      </div>
    </section>

${faqSection(
  [
    ["Почему нет цены за квадратный метр?", "Цена за метр не учитывает профиль, свет, углы и дополнительные работы. Мы считаем по факту, чтобы смета совпала с итогом."],
    ["Замер платный?", "Условия замера согласуем при записи — позвоните, уточним по вашему объекту."],
    ["Можно ли узнать цену по телефону?", "Можем дать ориентир по площади и типу потолка. Точную сумму называем после замера."],
    ["Фиксируется ли цена в договоре?", "Да. Состав работ и стоимость фиксируются до начала монтажа."],
    ["Есть ли рассрочка?", "Возможность рассрочки или поэтапной оплаты уточняйте у менеджера — условия зависят от объекта."],
  ],
  { title: "Вопросы о стоимости", eyebrow: "04 — Вопросы" }
)}

${ctaSection({ title: "Посчитаем ваш потолок", text: "Оставьте заявку — согласуем замер и назовём стоимость после осмотра.", formName: "Заявка со страницы цен" })}`;

write(
  "prices.html",
  shell({
    path: "prices.html",
    title: "Цены на натяжные потолки в Дзержинском | Потолки Про",
    description:
      "Цены на натяжные потолки: парящий потолок от 750 ₽ по карточке организации, остальные работы — после замера. Смета и договор до начала монтажа.",
    body: pricesBody,
    active: "prices.html",
  })
);
totalPages.push("prices.html");

/* ---------- Услуги ---------- */
const uslugiBody = `
    <section class="page-hero">
      <div class="wrap">
${crumbs([["index.html", "Главная"], ["", "Услуги"]])}
        <h1>Услуги и комнаты</h1>
        <p class="lead">Натяжные потолки под ключ: замер, изготовление, монтаж, свет и профильные системы. Работаем в Дзержинском, Котельниках, Люберцах и Жуковском.</p>
        <div class="page-hero__meta">
          <span class="chip chip--green">Замер по записи</span>
          <span class="chip">Договор и гарантия</span>
          <span class="chip">Оплата картой</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div><span class="section-head__num">01 — Потолки</span><h2>Типы и системы</h2></div>
          <div class="section-head__desc"><p>От спокойного матового полотна до сложных конструкций со светом. Поможем выбрать под интерьер и бюджет.</p></div>
        </div>
${servicesGrid}
      </div>
    </section>

    <section class="section section--paper2">
      <div class="wrap">
        <div class="section-head">
          <div><span class="section-head__num">02 — Комнаты</span><h2>Потолок под каждую комнату</h2></div>
          <div class="section-head__desc"><p>У кухни, спальни и ванной разные требования к влаге, свету и уходу. Учитываем это на замере.</p></div>
        </div>
        <div class="cards-3">
          <a class="info-card" href="kuhnya.html"><span class="info-card__num">01</span><h3>Кухня</h3><p>Влагостойкое полотно, свет над рабочей зоной, скрытые гардины.</p></a>
          <a class="info-card" href="spalnya.html"><span class="info-card__num">02</span><h3>Спальня</h3><p>Матовые и сатиновые полотна, мягкий свет, теневой профиль.</p></a>
          <a class="info-card" href="detskaya.html"><span class="info-card__num">03</span><h3>Детская</h3><p>Безопасные материалы, свет без резких бликов, фотопечать.</p></a>
          <a class="info-card" href="vannaya.html"><span class="info-card__num">04</span><h3>Ванная</h3><p>Влагостойкость, светильники для влажных зон, обход труб.</p></a>
          <a class="info-card" href="gallery.html"><span class="info-card__num">05</span><h3>Гостиная и коридор</h3><p>Световые линии, парящие профили и многоуровневые конструкции.</p></a>
          <a class="info-card" href="o-kompanii.html"><span class="info-card__num">06</span><h3>Офисы</h3><p>Трековый свет, нейтральные фактуры, монтаж в удобное время.</p></a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div><span class="section-head__num">03 — География</span><h2>Где работаем</h2></div>
          <div class="section-head__desc"><p>Офис в Дзержинском. Выезжаем на замер и монтаж в соседние города.</p></div>
        </div>
        <div class="cards-3">
          <a class="info-card" href="kotelniki.html"><h3>Котельники</h3><p>Рядом с Дзержинским: квартиры, новостройки, офисы.</p></a>
          <a class="info-card" href="lyubertsy.html"><h3>Люберцы</h3><p>Квартиры, дома и коммерческие помещения.</p></a>
          <a class="info-card" href="zhukovsky.html"><h3>Жуковский</h3><p>Квартиры и частные дома, свет и профильные системы.</p></a>
        </div>
      </div>
    </section>

${faqSection(
  [
    ["Что входит в услугу «под ключ»?", "Замер, подбор материалов, изготовление полотна, монтаж, установка света и профилей. Состав работ фиксируется в смете."],
    ["Можно ли заказать только монтаж?", "Обычно мы делаем полный цикл: замер, изготовление и монтаж. Возможность частичных работ обсуждайте отдельно."],
    ["Работаете ли с дизайнерами?", "Да. Обсудим эскиз, свет и узлы, согласуем сроки с остальными работами."],
    ["Куда приезжаете?", "Дзержинский, Котельники, Люберцы, Жуковский и соседние районы. Уточните адрес — подтвердим выезд."],
  ],
  { title: "Об услугах", eyebrow: "04 — Вопросы" }
)}

${ctaSection({ title: "Обсудим ваш объект", text: "Оставьте заявку или позвоните — подскажем по материалам, свету и срокам.", formName: "Заявка со страницы услуг" })}`;

write(
  "uslugi.html",
  shell({
    path: "uslugi.html",
    title: "Услуги — натяжные потолки в Дзержинском | Потолки Про",
    description:
      "Натяжные потолки под ключ: парящие, теневые, световые линии, многоуровневые конструкции. Замер и монтаж в Дзержинском, Котельниках, Люберцах и Жуковском.",
    body: uslugiBody,
    active: "uslugi.html",
  })
);
totalPages.push("uslugi.html");

/* ---------- Материалы ---------- */
const materialsBody = `
    <section class="page-hero">
      <div class="wrap">
${crumbs([["index.html", "Главная"], ["", "Материалы"]])}
        <h1>Материалы и фактуры</h1>
        <p class="lead">Матовые, глянцевые, сатиновые и тканевые полотна, фотопечать. Сравним внешний вид, уход и сценарии применения — чтобы выбор был осознанным.</p>
        <div class="page-hero__meta">
          <span class="chip chip--green">Образцы на замер</span>
          <span class="chip">ПВХ и ткань</span>
          <span class="chip">Фотопечать</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap layout-aside">
        <div class="prose">
          <h2 id="matte">Матовые полотна</h2>
          <p>Самый универсальный вариант. Поверхность не отражает свет и выглядит как идеально окрашенный потолок. Не бликует от окон и люстр, не отвлекает внимание.</p>
          <p><strong>Кому подходит:</strong> спальня, детская, гостиная, кабинет. Хорошо сочетается с матовой мебелью, деревом и спокойными цветами.</p>
          <p><strong>Уход:</strong> сухая или слегка влажная салфетка. Без абразивов и растворителей.</p>

          <h2 id="gloss">Глянцевые полотна</h2>
          <p>Отражают свет и визуально добавляют высоты. В небольших комнатах создают ощущение пространства, но требуют аккуратности в освещении: блики могут быть заметны.</p>
          <p><strong>Кому подходит:</strong> кухня, ванная, небольшая гостиная, прихожая. Часто выбирают для помещений с хорошим естественным светом.</p>
          <p><strong>Уход:</strong> легко моется мягкой салфеткой; важно не тереть абразивами, чтобы не оставить матовые пятна.</p>

          <h2 id="satin">Сатиновые полотна</h2>
          <p>Мягкий перламутровый отблеск — компромисс между матом и глянцем. Поверхность выглядит благороднее мата, но не даёт зеркального эффекта.</p>
          <p><strong>Кому подходит:</strong> гостиная, спальня, кухня. Хорошо смотрится в интерьерах с тёплым светом.</p>
          <p><strong>Уход:</strong> как у ПВХ-полотен — мягкая салфетка и нейтральные средства.</p>

          <h2 id="fabric">Тканевые полотна</h2>
          <p>Ткань дышит и выглядит более «тёплой», без характерного пластикового блеска. Монтаж отличается от ПВХ: полотно натягивается иначе и требует аккуратной работы с углами.</p>
          <p><strong>Кому подходит:</strong> спальня, гостиная, интерьеры с натуральными материалами. Для влажных помещений подходит не всегда — обсуждаем отдельно.</p>
          <p><strong>Уход:</strong> сухая чистка, мягкая щётка. Не любит обильную влагу.</p>

          <h2 id="photo">Фотопечать</h2>
          <p>Рисунок наносится на полотно по макету. Можно сделать акцентную стену, небо в детской или абстракцию в гостиной. Важно учитывать освещение и масштаб: на потолке рисунок читается иначе, чем на экране.</p>
          <p><strong>Кому подходит:</strong> детская, гостиная, коммерческие помещения. Перед печатью согласуем макет и расположение.</p>
        </div>

        <aside class="aside-card">
          <h3>Поможем выбрать</h3>
          <p>Привезём образцы на замер и покажем, как фактура выглядит при вашем освещении.</p>
          <a class="btn btn--solid btn--block" href="zapis.html">Записаться на замер</a>
          <p class="small" style="margin-top: 14px;">Или позвоните: <a href="tel:+79017475202">+7 (901) 747-52-02</a></p>
        </aside>
      </div>
    </section>

    <section class="section section--paper2">
      <div class="wrap">
        <div class="section-head">
          <div><span class="section-head__num">Сравнение</span><h2>Что выбрать</h2></div>
          <div class="section-head__desc"><p>Короткая шпаргалка. Окончательный выбор лучше делать по образцам.</p></div>
        </div>
        <div class="prose" style="max-width: none;">
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>Фактура</th><th>Внешний вид</th><th>Влагостойкость</th><th>Уход</th><th>Куда чаще выбирают</th></tr>
              </thead>
              <tbody>
                <tr><td>Матовая</td><td>Ровный, без бликов</td><td>Высокая</td><td>Простой</td><td>Спальня, детская, гостиная</td></tr>
                <tr><td>Глянцевая</td><td>Отражения, больше света</td><td>Высокая</td><td>Простой</td><td>Кухня, ванная, небольшие комнаты</td></tr>
                <tr><td>Сатиновая</td><td>Мягкий перламутр</td><td>Высокая</td><td>Простой</td><td>Гостиная, спальня, кухня</td></tr>
                <tr><td>Тканевая</td><td>Тёплый матовый</td><td>Ниже</td><td>Сухая чистка</td><td>Спальня, гостиная</td></tr>
                <tr><td>Фотопечать</td><td>Рисунок по макету</td><td>Зависит от основы</td><td>По основе</td><td>Детская, акцентные зоны</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

${faqSection(
  [
    ["Чем мат отличается от сатина?", "Матовая поверхность совсем не отражает свет. Сатин даёт мягкий перламутровый отблеск и выглядит светлее."],
    ["Можно ли мыть глянец?", "Да, мягкой салфеткой с водой или нейтральным средством. Абразивы и жёсткие щётки оставляют следы."],
    ["Что лучше для ванной?", "Влагостойкое ПВХ-полотно: глянец или сатин. Важна вентиляция и светильники для влажных зон."],
    ["Можно ли напечатать своё фото?", "Да, обсудим макет, разрешение и расположение рисунка. Перед печатью согласуем образец."],
  ],
  { title: "Вопросы о материалах", eyebrow: "Вопросы" }
)}

${relatedLinks("Куда дальше", [
  ["prices.html", "Цены", "Что влияет на стоимость и как мы считаем смету."],
  ["svetovye-linii.html", "Световые линии", "Как свет меняет восприятие фактуры."],
  ["gallery.html", "Галерея", "Посмотреть фактуры на реальных объектах."],
])}

${ctaSection({ title: "Привезём образцы", text: "На замере покажем полотна и профили, чтобы выбрать фактуру при вашем освещении.", formName: "Заявка со страницы материалов" })}`;

write(
  "materialy.html",
  shell({
    path: "materialy.html",
    title: "Материалы натяжных потолков — мат, глянец, сатин, ткань | Потолки Про",
    description:
      "Сравнение материалов натяжных потолков: матовые, глянцевые, сатиновые и тканевые полотна, фотопечать. Уход, влагостойкость и применение по комнатам.",
    body: materialsBody,
    active: "materialy.html",
  })
);
totalPages.push("materialy.html");

/* ---------- О компании ---------- */
const aboutBody = `
    <section class="page-hero">
      <div class="wrap">
${crumbs([["index.html", "Главная"], ["", "О компании"]])}
        <h1>О компании</h1>
        <p class="lead">Потолки Про — команда из Дзержинского. Делаем натяжные потолки, свет и профильные системы под ключ. Рейтинг 4,9 на Яндекс.Картах по 25 оценкам.</p>
        <div class="page-hero__meta">
          <span class="chip chip--green">4,9 ★</span>
          <span class="chip">22 отзыва</span>
          <span class="chip">39 фото в карточке</span>
          <span class="chip">Дзержинский · МО</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap split">
        <div class="split__media reveal">
          <img src="assets/img/about.jpg" alt="Потолок со световыми линиями и точечными светильниками" loading="lazy" decoding="async" />
        </div>
        <div class="split__body">
          <p class="eyebrow reveal">Кто мы</p>
          <h2 class="reveal">Небольшая команда, которая делает потолки сама</h2>
          <p class="reveal">Мы не продаём «потолок за 199 рублей за метр» и не перекладываем работу на случайных подрядчиков. Замеряем, считаем, монтируем и отвечаем за результат. В отзывах клиенты чаще всего благодарят Дмитрия, Максима и Сергея — это мастера, которые ведут объект от замера до сдачи.</p>
          <ul class="checklist reveal">
            <li>Офис и склад в Дзержинском, ул. Стройгородок, вл5</li>
            <li>Работаем ежедневно с 08:00 до 21:00</li>
            <li>Доставка, парковка, оплата картой</li>
            <li>Гарантия на работы и материалы по договору</li>
            <li>Световые линии, треки, гардины и фотопечать</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section section--tight section--paper2">
      <div class="wrap">
        <dl class="stats">
          <div class="stat"><dt>4,9 / 5</dt><dd>рейтинг организации на Яндекс.Картах</dd></div>
          <div class="stat"><dt>25</dt><dd>оценок клиентов</dd></div>
          <div class="stat"><dt>22</dt><dd>текстовых отзыва</dd></div>
          <div class="stat"><dt>39</dt><dd>фотографий в карточке</dd></div>
        </dl>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div><span class="section-head__num">Принципы</span><h2>Как мы работаем</h2></div>
          <div class="section-head__desc"><p>Три вещи, которые важны для нас больше всего.</p></div>
        </div>
        <div class="cards-3">
          <div class="info-card"><span class="info-card__num">01</span><h3>Смета без сюрпризов</h3><p>Считаем по факту, фиксируем состав работ и стоимость в договоре. Если что-то меняется — согласуем до начала работ.</p></div>
          <div class="info-card"><span class="info-card__num">02</span><h3>Аккуратный монтаж</h3><p>Накрываем мебель, работаем чисто, убираем за собой. В отзывах это отмечают чаще всего.</p></div>
          <div class="info-card"><span class="info-card__num">03</span><h3>Понятный свет</h3><p>Не просто «поставить светильники», а продумать сценарии: общий свет, рабочая зона, вечер.</p></div>
        </div>
      </div>
    </section>

    <section class="section section--surface">
      <div class="wrap split split--reverse">
        <div class="split__media">
          <img src="assets/img/about-2.jpg" alt="Многоуровневый потолок с подсветкой" loading="lazy" decoding="async" />
        </div>
        <div class="split__body">
          <p class="eyebrow">География</p>
          <h2>Дзержинский и соседние города</h2>
          <p>Основная работа — Дзержинский. Выезжаем в Котельники, Люберцы, Жуковский и соседние районы Московской области. Если объект дальше — уточните адрес, подтвердим возможность выезда.</p>
          <div class="hero__actions" style="margin-top: 24px; margin-bottom: 0;">
            <a class="btn btn--solid" href="zapis.html">Записаться на замер</a>
            <a class="btn btn--ghost" href="otzyvy.html">Читать отзывы</a>
          </div>
        </div>
      </div>
    </section>

${faqSection(
  [
    ["Как давно работает компания?", "Карточка организации на Яндекс.Картах содержит отзывы начиная с 2023 года. Актуальные детали уточняйте по телефону."],
    ["Кто приезжает на замер?", "Мастер, который будет вести объект. Он покажет образцы, объяснит варианты и составит смету."],
    ["Можно ли посмотреть работы вживую?", "Фотографии есть в галерее и карточке организации. Возможность посмотреть объект обсуждайте отдельно."],
    ["Работаете ли с юридическими лицами?", "Да, делаем потолки в офисах и коммерческих помещениях. Условия и документы согласуем заранее."],
  ],
  { title: "О компании: вопросы", eyebrow: "Вопросы" }
)}

${ctaSection({ title: "Познакомимся на замере", text: "Приедем, покажем образцы и посчитаем стоимость — без обязательств.", formName: "Заявка со страницы о компании" })}`;

write(
  "o-kompanii.html",
  shell({
    path: "o-kompanii.html",
    title: "О компании — Потолки Про, Дзержинский | Натяжные потолки",
    description:
      "Потолки Про — команда по натяжным потолкам в Дзержинском. Рейтинг 4,9 на Яндекс.Картах, 22 отзыва. Замер, монтаж, свет и профильные системы под ключ.",
    body: aboutBody,
    active: "o-kompanii.html",
  })
);
totalPages.push("o-kompanii.html");

/* ---------- Гарантии ---------- */
const garantiiBody = `
    <section class="page-hero">
      <div class="wrap">
${crumbs([["index.html", "Главная"], ["", "Гарантии"]])}
        <h1>Гарантии и документы</h1>
        <p class="lead">Работаем по договору: фиксируем состав работ, материалы и стоимость до монтажа. Гарантия на работы и материалы зависит от выбранного полотна и профиля.</p>
        <div class="page-hero__meta">
          <span class="chip chip--green">Договор</span>
          <span class="chip">Смета до работ</span>
          <span class="chip">Гарантия</span>
          <span class="chip">Оплата картой</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div><span class="section-head__num">01 — Документы</span><h2>Что получаете до начала работ</h2></div>
          <div class="section-head__desc"><p>Никаких «устных договорённостей»: всё, что влияет на цену и результат, фиксируется на бумаге.</p></div>
        </div>
        <div class="cards-3">
          <div class="info-card"><span class="info-card__num">01</span><h3>Смета</h3><p>Перечень работ и материалов: полотно, профиль, свет, дополнительные работы. Цена до монтажа.</p></div>
          <div class="info-card"><span class="info-card__num">02</span><h3>Договор</h3><p>Сроки, стоимость, гарантийные условия и порядок оплаты. Подписываем до начала монтажа.</p></div>
          <div class="info-card"><span class="info-card__num">03</span><h3>Гарантия</h3><p>Срок зависит от полотна и профиля, фиксируется в договоре. Условия обсуждаем на замере.</p></div>
          <div class="info-card"><span class="info-card__num">04</span><h3>Документы на материалы</h3><p>По запросу показываем документы на полотно и комплектующие.</p></div>
          <div class="info-card"><span class="info-card__num">05</span><h3>Оплата</h3><p>Картой, наличными или переводом. Порядок и этапы оплаты — в договоре.</p></div>
          <div class="info-card"><span class="info-card__num">06</span><h3>Чек</h3><p>Выдаём документ об оплате. Все условия прозрачны.</p></div>
        </div>
      </div>
    </section>

    <section class="section section--paper2">
      <div class="wrap layout-aside">
        <div class="prose">
          <h2>На что распространяется гарантия</h2>
          <p>Гарантия на работы касается монтажа: крепления, профиля, натяжки полотна, подключения света. Гарантия на материалы зависит от производителя полотна и профильной системы.</p>
          <p>Сроки и условия фиксируются в договоре. Если что-то пошло не так — свяжитесь с нами, опишите ситуацию и приложите фото. Мы предложим порядок действий.</p>

          <h2>Что не является гарантийным случаем</h2>
          <ul>
            <li>Механические повреждения полотна после сдачи работ</li>
            <li>Самостоятельный демонтаж или вмешательство в конструкцию</li>
            <li>Затопление, пожар и другие внешние события</li>
            <li>Использование агрессивных чистящих средств</li>
          </ul>

          <h2>Как оформить обращение</h2>
          <p>Позвоните по телефону <a href="tel:+79017475202">+7 (901) 747-52-02</a> или напишите в WhatsApp. Опишите проблему, укажите адрес и дату монтажа — согласуем осмотр.</p>
        </div>

        <aside class="aside-card">
          <h3>Есть вопрос по гарантии?</h3>
          <p>Позвоните — подскажем по вашему договору и условиям.</p>
          <a class="btn btn--solid btn--block" href="tel:+79017475202">${SITE.phone}</a>
          <a class="btn btn--ghost btn--block" style="margin-top: 8px;" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </aside>
      </div>
    </section>

${faqSection(
  [
    ["Какая гарантия на потолок?", "Срок зависит от полотна и профиля. Конкретные условия фиксируются в договоре до начала работ."],
    ["Что делать при провисании полотна?", "Свяжитесь с нами, опишите ситуацию и приложите фото. Согласуем осмотр и решение."],
    ["Сохраняется ли гарантия при самостоятельном ремонте?", "Вмешательство в конструкцию может повлиять на гарантию. Обсудите работы с нами заранее."],
    ["Даёте ли документы на материалы?", "Да, по запросу показываем документы на полотно и комплектующие."],
  ],
  { title: "Вопросы по гарантии", eyebrow: "Вопросы" }
)}

${ctaSection({ title: "Нужен потолок с гарантией?", text: "Запишитесь на замер — обсудим материалы, условия и сроки.", formName: "Заявка со страницы гарантий" })}`;

write(
  "garantii.html",
  shell({
    path: "garantii.html",
    title: "Гарантии и документы — Потолки Про, Дзержинский",
    description:
      "Гарантия на натяжные потолки и монтаж: договор, смета до начала работ, документы на материалы, порядок обращения. Работаем в Дзержинском и области.",
    body: garantiiBody,
  })
);
totalPages.push("garantii.html");

/* ---------- Отзывы ---------- */
const reviewCards = REVIEWS.map(
  ([name, date, text]) => `          <article class="review">
            <div class="review__head">
              <span class="avatar" aria-hidden="true">${initial(name)}</span>
              <div class="review__who"><strong>${name}</strong><span>${date}</span></div>
            </div>
            <div class="stars" aria-label="Оценка 5 из 5">★★★★★</div>
            <p class="review__text review--plain">${text}</p>
          </article>`
).join("\n");

const reviewsBody = `
    <section class="page-hero">
      <div class="wrap">
${crumbs([["index.html", "Главная"], ["", "Отзывы"]])}
        <h1>Отзывы клиентов</h1>
        <p class="lead">4,9 из 5 на Яндекс.Картах: 25 оценок и 22 текстовых отзыва. Ниже — отзывы из карточки организации, без правок.</p>
        <div class="page-hero__meta">
          <span class="chip chip--green">4,9 ★</span>
          <span class="chip">25 оценок</span>
          <span class="chip">22 отзыва</span>
          <a class="chip" href="${SITE.reviewsUrl}" target="_blank" rel="noopener noreferrer">Источник — Яндекс.Карты ↗</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="review-grid">
${reviewCards}
        </div>
        <div class="section-foot">
          <p class="muted mb-0">Все отзывы опубликованы в карточке организации на Яндекс.Картах.</p>
          <a class="btn btn--ghost" href="${SITE.reviewsUrl}" target="_blank" rel="noopener noreferrer">Смотреть на Яндекс.Картах</a>
        </div>
      </div>
    </section>

    <section class="section section--tight section--paper2">
      <div class="wrap">
        <div class="review-grid">
          <div class="review">
            <div class="review__head"><span class="avatar" aria-hidden="true">4,9</span><div class="review__who"><strong>Рейтинг организации</strong><span>Яндекс.Карты</span></div></div>
            <p class="review__text review--plain">25 оценок, 22 отзыва. Клиенты отмечают скорость, аккуратность и отсутствие скрытых доплат.</p>
          </div>
          <div class="review">
            <div class="review__head"><span class="avatar" aria-hidden="true">39</span><div class="review__who"><strong>Фотографий в карточке</strong><span>Работы и детали</span></div></div>
            <p class="review__text review--plain">В карточке — 39 фото объектов и процесса. В нашей галерее — 38 кадров: все работы с карточки, кроме фото двора.</p>
          </div>
          <div class="review">
            <div class="review__head"><span class="avatar" aria-hidden="true">4</span><div class="review__who"><strong>Года отзывов</strong><span>с 2023 года</span></div></div>
            <p class="review__text review--plain">Отзывы в карточке начинаются с 2023 года. Команда продолжает работать в Дзержинском.</p>
          </div>
        </div>
      </div>
    </section>

${ctaSection({ title: "Хотите так же?", text: "Запишитесь на замер — обсудим потолок, свет и сроки.", formName: "Заявка со страницы отзывов" })}`;

write(
  "otzyvy.html",
  shell({
    path: "otzyvy.html",
    title: "Отзывы клиентов — Потолки Про, Дзержинский | 4,9 ★",
    description:
      "Отзывы о натяжных потолках Потолки Про в Дзержинском: 22 отзыва и рейтинг 4,9 на Яндекс.Картах. Реальные истории клиентов.",
    body: reviewsBody,
    active: "otzyvy.html",
  })
);
totalPages.push("otzyvy.html");

/* ---------- Запись на замер ---------- */
const zapisBody = `
    <section class="page-hero">
      <div class="wrap">
${crumbs([["index.html", "Главная"], ["", "Запись на замер"]])}
        <h1>Запись на замер</h1>
        <p class="lead">Выберите удобный день и время — согласуем визит. На замере покажем образцы, обсудим свет и посчитаем стоимость.</p>
        <div class="page-hero__meta">
          <span class="chip chip--green">Ежедневно 08:00–21:00</span>
          <span class="chip">Дзержинский и рядом</span>
          <span class="chip">Заявка в WhatsApp</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap booking-grid" id="booking">
        <div>
          <h2>Выберите день</h2>
          <p class="muted" style="margin-bottom: 16px;">Доступны даты на две недели вперёд.</p>
          <div class="days" id="bookingDays" role="group" aria-label="Дата замера"></div>

          <h2 style="margin-top: 30px;">Удобное время</h2>
          <p class="muted" style="margin-bottom: 16px;">Время примерное — мастер подтвердит его по телефону.</p>
          <div class="slots" id="bookingSlots" role="group" aria-label="Время замера"></div>

          <p class="booking-note">Вы выбрали: <strong data-booking-selected>ещё не выбраны</strong></p>

          <ul class="checklist" style="margin-top: 24px;">
            <li>Замер по записи, без ожидания в очереди</li>
            <li>Образцы полотен и профилей на месте</li>
            <li>Смета после осмотра, без обязательств</li>
            <li>Оплата картой, наличными или переводом</li>
          </ul>
        </div>

        <div class="form-card form-card--green">
          <h3>Данные для записи</h3>
          <p class="form-card__intro">Заявка откроется в WhatsApp — останется нажать «Отправить».</p>
          <form class="form" data-booking novalidate>
            <div class="form-row">
              <label class="field">
                <span>Ваше имя</span>
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
              <span>Адрес объекта</span>
              <input type="text" name="address" placeholder="Город, улица, дом" />
            </label>
            <label class="field">
              <span>Комментарий</span>
              <textarea name="comment" rows="3" placeholder="Комнаты, площадь, пожелания"></textarea>
            </label>
            <label class="consent">
              <input type="checkbox" name="consent" />
              <span class="consent__box" aria-hidden="true"></span>
              <span class="consent__text">Согласен с <a href="privacy.html" target="_blank" rel="noopener">политикой конфиденциальности</a> и обработкой данных</span>
            </label>
            <p class="consent__error" role="alert" hidden>Отметьте согласие на обработку данных</p>
            <input type="hidden" name="date" />
            <input type="hidden" name="time" />
            <button class="btn btn--light btn--block" type="submit">Записаться на замер</button>
            <p class="form-note">Если удобнее звонок — ${SITE.phone}, ежедневно 08:00–21:00.</p>
            <p class="form__success" role="status" hidden></p>
          </form>
        </div>
      </div>
    </section>

${faqSection(
  [
    ["Что происходит после записи?", "Мы получаем заявку в WhatsApp, подтверждаем дату и время, уточняем адрес и детали."],
    ["Можно ли перенести замер?", "Да, позвоните или напишите в WhatsApp — подберём другое время."],
    ["Сколько длится замер?", "Обычно 30–60 минут в зависимости от количества комнат и вопросов."],
    ["Нужно ли готовить квартиру?", "Нет. Достаточно доступа к комнатам и возможности посмотреть узлы у стен."],
  ],
  { title: "Вопросы о записи", eyebrow: "Вопросы" }
)}`;

write(
  "zapis.html",
  shell({
    path: "zapis.html",
    title: "Запись на замер — натяжные потолки в Дзержинском | Потолки Про",
    description:
      "Запишитесь на замер натяжных потолков в Дзержинском: выберите день и время, оставьте контакты. Ежедневно 08:00–21:00, заявка в WhatsApp.",
    body: zapisBody,
    scripts: ["booking.js"],
  })
);
totalPages.push("zapis.html");

/* ---------- Тест ---------- */
const quizBody = `
    <section class="page-hero">
      <div class="wrap">
${crumbs([["index.html", "Главная"], ["", "Тест подбора"]])}
        <h1>Какой потолок вам подойдёт</h1>
        <p class="lead">Пять коротких вопросов — и мы предложим тип потолка, профиль и сценарий света. Без регистрации и звонков.</p>
        <div class="page-hero__meta">
          <span class="chip chip--green">5 вопросов</span>
          <span class="chip">≈ 1 минута</span>
          <span class="chip">Рекомендация сразу</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="quiz" id="quiz">
          <div class="quiz__progress" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>

          <div class="quiz__step is-active" data-step="0" data-question="Комната">
            <h2>Где планируете потолок?</h2>
            <p>От комнаты зависят влагостойкость, свет и фактура.</p>
            <div class="quiz__options">
              <button class="quiz__option" type="button" data-label="Гостиная" data-types="light multi">Гостиная</button>
              <button class="quiz__option" type="button" data-label="Кухня" data-types="gloss light">Кухня</button>
              <button class="quiz__option" type="button" data-label="Спальня" data-types="matte satin">Спальня</button>
              <button class="quiz__option" type="button" data-label="Детская" data-types="matte">Детская</button>
              <button class="quiz__option" type="button" data-label="Ванная" data-types="gloss">Ванная</button>
              <button class="quiz__option" type="button" data-label="Офис" data-types="light matte">Офис</button>
            </div>
          </div>

          <div class="quiz__step" data-step="1" data-question="Площадь">
            <h2>Какая площадь комнаты?</h2>
            <p>Площадь влияет на количество света и стоимость.</p>
            <div class="quiz__options">
              <button class="quiz__option" type="button" data-label="До 15 м²" data-types="gloss">До 15 м²</button>
              <button class="quiz__option" type="button" data-label="15–25 м²" data-types="matte satin">15–25 м²</button>
              <button class="quiz__option" type="button" data-label="25–40 м²" data-types="light">25–40 м²</button>
              <button class="quiz__option" type="button" data-label="Больше 40 м²" data-types="multi">Больше 40 м²</button>
            </div>
          </div>

          <div class="quiz__step" data-step="2" data-question="Свет">
            <h2>Какой свет хочется?</h2>
            <p>Можно выбрать то, что ближе — детали обсудим на замере.</p>
            <div class="quiz__options">
              <button class="quiz__option" type="button" data-label="Световые линии" data-types="light">Световые линии или трек</button>
              <button class="quiz__option" type="button" data-label="Подсветка по периметру" data-types="floating light">Подсветка по периметру</button>
              <button class="quiz__option" type="button" data-label="Теневой зазор" data-types="shadow">Теневой зазор</button>
              <button class="quiz__option" type="button" data-label="Обычные светильники" data-types="matte">Обычные светильники и люстра</button>
            </div>
          </div>

          <div class="quiz__step" data-step="3" data-question="Стиль">
            <h2>Какой стиль ближе?</h2>
            <p>Подскажем, какая фактура поддержит интерьер.</p>
            <div class="quiz__options">
              <button class="quiz__option" type="button" data-label="Минимализм" data-types="shadow matte">Минимализм</button>
              <button class="quiz__option" type="button" data-label="Современный" data-types="light">Современный</button>
              <button class="quiz__option" type="button" data-label="Классика" data-types="satin">Классика</button>
              <button class="quiz__option" type="button" data-label="Яркий, необычный" data-types="multi gloss">Яркий, необычный</button>
            </div>
          </div>

          <div class="quiz__step" data-step="4" data-question="Приоритет">
            <h2>Что важнее всего?</h2>
            <p>Последний вопрос — и покажем рекомендацию.</p>
            <div class="quiz__options">
              <button class="quiz__option" type="button" data-label="Практичность" data-types="matte">Практичность и уход</button>
              <button class="quiz__option" type="button" data-label="Визуальная высота" data-types="gloss">Визуально выше потолок</button>
              <button class="quiz__option" type="button" data-label="Мягкий свет" data-types="floating">Мягкий свет для отдыха</button>
              <button class="quiz__option" type="button" data-label="Необычный дизайн" data-types="multi light">Необычный дизайн</button>
            </div>
            <div class="quiz__nav"><span></span><span class="small muted">Далее — результат</span></div>
          </div>

          <div class="quiz__step quiz__result" data-step="result">
            <p class="eyebrow">Рекомендация</p>
            <h2 data-quiz-title>Матовое полотно</h2>
            <p data-quiz-text></p>
            <ul class="quiz__summary" data-quiz-summary></ul>
            <a class="link-arrow" data-quiz-link href="materialy.html#matte">Подробнее</a>
            <div class="hero__actions" style="margin: 18px 0 0;">
              <a class="btn btn--solid" data-quiz-wa href="#" target="_blank" rel="noopener noreferrer">Отправить в WhatsApp</a>
              <a class="btn btn--ghost" href="zapis.html">Записаться на замер</a>
              <button class="btn btn--ghost" type="button" data-quiz-restart>Пройти заново</button>
            </div>
          </div>
        </div>

        <p class="muted small center" style="margin-top: 30px;">Тест носит рекомендательный характер. Точный выбор — после замера и осмотра образцов.</p>
      </div>
    </section>`;

write(
  "quiz.html",
  shell({
    path: "quiz.html",
    title: "Тест: какой натяжной потолок выбрать — Потолки Про",
    description:
      "Пройдите тест из 5 вопросов и получите рекомендацию по натяжному потолку: фактура, профиль и свет. Потолки Про, Дзержинский.",
    body: quizBody,
    scripts: ["quiz.js"],
  })
);
totalPages.push("quiz.html");

/* ---------- Политика ---------- */
const privacyBody = `
    <section class="page-hero">
      <div class="wrap">
${crumbs([["index.html", "Главная"], ["", "Политика конфиденциальности"]])}
        <h1>Политика конфиденциальности</h1>
        <p class="lead">Как обрабатываются персональные данные, которые вы оставляете на сайте «Потолки Про».</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap--narrow prose">
        <h2>1. Общие положения</h2>
        <p>Настоящая политика описывает порядок обработки персональных данных пользователей сайта. Оставляя заявку, вы соглашаетесь с условиями этой политики.</p>

        <h2>2. Какие данные собираем</h2>
        <ul>
          <li>Имя — для обращения;</li>
          <li>Телефон — для связи и подтверждения замера;</li>
          <li>Адрес объекта и комментарий — если вы указали их добровольно;</li>
          <li>Параметры потолка, которые вы заполнили в калькуляторе.</li>
        </ul>

        <h2>3. Зачем нужны данные</h2>
        <p>Только для обработки заявки: связаться с вами, уточнить задачу, согласовать замер и подготовить расчёт. Мы не используем данные для массовых рассылок и не передаём их третьим лицам, кроме случаев, предусмотренных законом.</p>

        <h2>4. Как передаются данные</h2>
        <p>Формы на сайте не отправляют данные на сервер. После нажатия кнопки открывается WhatsApp с подготовленным текстом заявки — вы сами отправляете сообщение. Дальнейшая обработка происходит в переписке.</p>

        <h2>5. Сроки и отзыв согласия</h2>
        <p>Данные хранятся столько, сколько нужно для обработки обращения и выполнения договора. Вы можете отозвать согласие, позвонив по телефону <a href="tel:+79017475202">+7 (901) 747-52-02</a>.</p>

        <h2>6. Cookies и аналитика</h2>
        <p>Сайт не использует формы авторизации и не собирает платёжные данные. Если в будущем появится аналитика, политика будет обновлена.</p>

        <h2>7. Контакты</h2>
        <p>По вопросам обработки данных: ${SITE.phone}, ${SITE.addressFull}.</p>

        <p class="small muted">Дата последнего обновления: ноябрь 2026.</p>
      </div>
    </section>`;

write(
  "privacy.html",
  shell({
    path: "privacy.html",
    title: "Политика конфиденциальности — Потолки Про",
    description:
      "Политика обработки персональных данных сайта Потолки Про: какие данные собираем, зачем и как отозвать согласие.",
    body: privacyBody,
  })
);
totalPages.push("privacy.html");

/* ---------- 404 ---------- */
const notFoundBody = `
    <section class="error-page">
      <div class="wrap">
        <p class="error-page__code">404</p>
        <h1>Страница не найдена</h1>
        <p class="lead">Возможно, ссылка устарела или в адресе опечатка. Вернитесь на главную или посмотрите работы.</p>
        <div class="error-page__links">
          <a class="btn btn--solid" href="index.html">На главную</a>
          <a class="btn btn--ghost" href="gallery.html">Работы</a>
          <a class="btn btn--ghost" href="prices.html">Цены</a>
          <a class="btn btn--ghost" href="zapis.html">Записаться на замер</a>
        </div>
      </div>
    </section>`;

write(
  "404.html",
  shell({
    path: "404.html",
    title: "Страница не найдена — Потолки Про",
    description: "Страница не существует или была перемещена. Вернитесь на главную сайт «Потолки Про» или посмотрите работы и цены на натяжные потолки.",
    body: notFoundBody,
    robots: "noindex, follow",
  })
);
totalPages.push("404.html");

/* ------------------------------------------------------------------ */
/*  SEO-страницы                                                       */
/* ------------------------------------------------------------------ */

function seoPage(item, type) {
  const isService = type === "service";
  const imageUrl = `${SITE.url}${item.image}`;
  const intro = item.intro.map((p) => `          <p>${p}</p>`).join("\n");
  const sections = item.sections
    .map(
      (section) => `          <h2>${section.h2}</h2>
${section.paragraphs.map((p) => `          <p>${p}</p>`).join("\n")}`
    )
    .join("\n\n");
  const metaChips = item.meta.map((chip) => `          <span class="chip chip--green">${chip}</span>`).join("\n");
  const faq = item.faq;

  const body = `
    <section class="page-hero">
      <div class="wrap">
${crumbs([["index.html", "Главная"], ["uslugi.html", isService ? "Услуги" : "Услуги и комнаты"], ["", item.nav]])}
        <h1>${item.h1}</h1>
        <p class="lead">${item.lead}</p>
        <div class="page-hero__meta">
${metaChips}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap layout-aside">
        <div class="prose">
${intro}

${sections}

          <div class="callout">
            <p><strong>Стоимость:</strong> парящий потолок по карточке организации — от 750 ₽. Остальные работы считаем после замера и фиксируем в договоре.</p>
          </div>

          <div class="hero__actions" style="margin-bottom: 0;">
            <a class="btn btn--solid" href="zapis.html">Записаться на замер</a>
            <a class="btn btn--ghost" href="prices.html">Цены и расчёт</a>
          </div>
        </div>

        <aside class="aside-card">
          <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" decoding="async" style="border-radius: 6px; margin-bottom: 18px;" />
          <h3>Нужен такой потолок?</h3>
          <p>Приедем на замер, покажем образцы и посчитаем стоимость.</p>
          <a class="btn btn--solid btn--block" href="zapis.html">Вызвать замерщика</a>
          <a class="btn btn--ghost btn--block" style="margin-top: 8px;" href="tel:${SITE.phoneRaw}">${SITE.phone}</a>
        </aside>
      </div>
    </section>

${faqSection(faq, { title: "Частые вопросы", eyebrow: "Вопросы" })}

${relatedLinks("Смотрите также", item.related)}

${ctaSection({
  title: "Обсудим ваш объект",
  text: "Оставьте заявку — перезвоним, уточним детали и согласуем замер.",
  formName: `Заявка: ${item.h1}`,
})}`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE.url },
        { "@type": "ListItem", position: 2, name: isService ? "Услуги" : "Услуги и комнаты", item: `${SITE.url}uslugi.html` },
        { "@type": "ListItem", position: 3, name: item.nav, item: `${SITE.url}${item.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ];

  if (isService) {
    schema.push({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: item.h1,
      provider: { "@type": "LocalBusiness", name: SITE.name, telephone: SITE.phone, address: SITE.addressFull },
      areaServed: ["Дзержинский", "Котельники", "Люберцы", "Жуковский"],
      image: imageUrl,
      description: item.description,
    });
  }

  return shell({
    path: item.slug,
    title: item.title,
    description: item.description,
    body,
    schema,
    ogImage: item.image,
  });
}

services.forEach((item) => {
  write(item.slug, seoPage(item, "service"));
  totalPages.push(item.slug);
});

rooms.forEach((item) => {
  write(item.slug, seoPage(item, "room"));
  totalPages.push(item.slug);
});

cities.forEach((item) => {
  write(item.slug, seoPage(item, "city"));
  totalPages.push(item.slug);
});

/* ------------------------------------------------------------------ */
/*  sitemap, robots, служебные файлы                                   */
/* ------------------------------------------------------------------ */

const allPages = ["index.html", ...totalPages];
const priority = (page) => {
  if (page === "index.html") return ["1.0", "weekly"];
  if (["uslugi.html", "prices.html", "gallery.html", "zapis.html"].includes(page)) return ["0.9", "monthly"];
  if (page === "privacy.html" || page === "404.html") return ["0.2", "yearly"];
  return ["0.8", "monthly"];
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .filter((page) => page !== "404.html")
  .map((page) => {
    const [prio, freq] = priority(page);
    const loc = page === "index.html" ? SITE.url : `${SITE.url}${page}`;
    return `  <url>
    <loc>${loc}</loc>
    <changefreq>${freq}</changefreq>
    <priority>${prio}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;

write("robots.txt", `User-agent: *\nDisallow: /\n`);

write(
  "README.md",
  `# Потолки Про — сайт компании по натяжным потолкам

Статический сайт компании «Натяжные потолки Про» (Дзержинский, Московская область).
Данные компании взяты из карточки организации на Яндекс.Картах:
<${SITE.mapUrl}>

## Запуск

Нужен Node.js 18+:

\`\`\`bash
npm run dev
\`\`\`

Сайт откроется на <http://localhost:4321>. Сборка не нужна — можно открыть \`index.html\`.

## Структура

\`\`\`
index.html            — главная
uslugi.html           — хаб услуг и комнат
prices.html           — цены и порядок расчёта
gallery.html          — 38 работ, фильтры и лайтбокс
materialy.html        — материалы и фактуры
o-kompanii.html       — о компании
garantii.html         — гарантии и документы
otzyvy.html           — 22 отзыва с Яндекс.Карт
zapis.html            — онлайн-запись на замер
quiz.html             — тест подбора потолка
privacy.html          — политика конфиденциальности
404.html              — страница «не найдено»
paryashchie-potolki.html, tenevye-potolki.html, svetovye-linii.html, mnogourovnevye-potolki.html — услуги
kuhnya.html, spalnya.html, detskaya.html, vannaya.html — комнаты
kotelniki.html, lyubertsy.html, zhukovsky.html — города
css/style.css         — вся тема (светлая, редакционная)
js/config.js          — телефон, WhatsApp, адрес
js/main.js            — меню, формы, калькулятор, анимации
js/gallery.js         — галерея и лайтбокс
js/quiz.js            — тест подбора
js/booking.js         — запись на замер
tools/site.mjs        — общий макет страниц
tools/seo-data.mjs    — контент SEO-страниц
tools/build.mjs       — генератор страниц
tools/download-card.mjs — исходники фото с карточки Яндекса
tools/build-images.ps1  — миниатюры и обложки
assets/               — фотографии работ
server.mjs            — локальный сервер без зависимостей
\`\`\`

## Пересборка страниц

\`\`\`bash
npm run build
\`\`\`

Генератор перезаписывает все страницы, кроме \`index.html\` (главная написана вручную).
SEO-страницы собираются из \`tools/seo-data.mjs\`.

## Индексация

Сайт **закрыт от индексации**: \`robots.txt\` запрещает обход, а на всех страницах
стоит \`<meta name="robots" content="noindex, nofollow">\`. Sitemap не публикуется.
Чтобы открыть сайт для поисковиков, уберите meta-тег и разрешите обход в robots.txt.

## Проверки

\`\`\`bash
npm run check
\`\`\`

Скрипты проверяют битые внутренние ссылки, alt у изображений, canonical,
длину title/description, один H1 на страницу и валидность JSON-LD.

## Данные компании

| Поле | Значение |
| --- | --- |
| Название | Натяжные потолки Про |
| Город | Дзержинский, Московская область |
| Адрес | ул. Стройгородок, вл5, 2 этаж |
| Телефон | +7 (901) 747-52-02 |
| Часы работы | Ежедневно 08:00–21:00 |
| Рейтинг | 4,9 из 5 |
| Оценок / отзывов | 25 / 22 |
| Фото в карточке | 39 |
| Цена | парящий потолок от 750 ₽ |
| Услуги | замер, изготовление, монтаж, световые линии, треки, теневой и парящий профили, скрытые гардины, фотопечать |

## Что заменить перед публикацией

- **Домен** — сейчас canonical и OG указывают на \`https://adastra-code.github.io/potolki-pro/\`.
- **Фотографии** — 38 из 39 фото взяты из карточки организации; фото двора (04) не включено.
  Права на фотографии проверьте у владельца карточки. Исходники лежат в \`assets/card/\`.
- **Телефон и WhatsApp** — \`js/config.js\`, а также поиском по \`+7 (901) 747-52-02\`.
- **Условия** — гарантии, оплата и замер уточнены по карточке; юридические формулировки проверьте перед публикацией.

## Особенности

- Светлая тема, крупная антиква, глубокий зелёный и терракота — дизайн не повторяет предыдущий проект.
- Формы не отправляют данные на сервер: заявка открывается в WhatsApp.
- Адаптив, мобильная панель «Позвонить / WhatsApp / Замер», доступная навигация.
- Schema.org: LocalBusiness, Service, FAQPage, BreadcrumbList.
`
);

write(
  "package.json",
  JSON.stringify(
    {
      name: "potolki-pro",
      version: "1.0.0",
      private: true,
      description: "Сайт компании по натяжным потолкам «Потолки Про», Дзержинский",
      type: "module",
      scripts: {
        dev: "node server.mjs",
        start: "node server.mjs",
        build: "node tools/build.mjs",
        check: "node tools/check-links.mjs && node tools/check-pages.mjs && node tools/check-seo.mjs",
      },
      engines: { node: ">=18" },
    },
    null,
    2
  ) + "\n"
);

write(
  "server.mjs",
  `import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT) || 4321;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url || "/").split("?")[0]);
    let file = normalize(join(root, url));
    if (!file.startsWith(root)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) {
      file = join(file, "index.html");
      info = await stat(file).catch(() => null);
    }

    if (!info) {
      const notFound = await readFile(join(root, "404.html")).catch(() => Buffer.from("404"));
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }).end(notFound);
      return;
    }

    const data = await readFile(file);
    res.writeHead(200, {
      "Content-Type": types[extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  } catch {
    res.writeHead(500).end("Server error");
  }
}).listen(port, () => {
  console.log(\`Потолки Про: http://localhost:\${port}\`);
});
`
);

write(".nojekyll", "");

console.log("\nГотово. Страниц:", allPages.length);

