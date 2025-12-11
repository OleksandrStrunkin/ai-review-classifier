export const DUMMY_RESULTS_WITH_ANALYSIS = {
  totalReviews: 20,

  sentimentData: [
    { label: "Позитивні", value: 8, color: "#10B981" },
    { label: "Негативні", value: 8, color: "#EF4444" },
    { label: "Нейтральні", value: 4, color: "#F59E0B" },
  ],
  topicData: [
    { topic: "Якість", count: 7 },
    { topic: "Доставка", count: 6 },
    { topic: "Ціна", count: 3 },
    { topic: "Підтримка", count: 2 },
    { topic: "Інше", count: 2 },
  ],

  sentimentTimeline: [
    { month: "2024-03", Positive: 2, Negative: 4, Neutral: 1 },
    { month: "2024-04", Positive: 3, Negative: 2, Neutral: 2 },
    { month: "2024-05", Positive: 3, Negative: 2, Neutral: 1 },
  ],

  analyzedReviews: [
    {
      review_id: "ID-001",
      review_date: "2024-03-01",
      original_text:
        "Новий дизайн сайту жахливий. Зручність нульова, замовлення оформляв дві години. Якість товару прекрасна, але процес покупки зіпсував усе враження.",
      sentiment: "Negative",
      topic: "Інше",
    },
    {
      review_id: "ID-002",
      review_date: "2024-03-05",
      original_text:
        "Доставка була дуже швидкою — наступного дня, але кур'єр був надто грубий. Це неприпустимо для вашого рівня.",
      sentiment: "Negative",
      topic: "Доставка",
    },
    {
      review_id: "ID-003",
      review_date: "2024-03-10",
      original_text:
        "Товар відповідає опису, але упаковка була пошкоджена, хоча вміст не постраждав. Нейтральна оцінка за пакування.",
      sentiment: "Neutral",
      topic: "Якість",
    },
    {
      review_id: "ID-004",
      review_date: "2024-03-14",
      original_text:
        "Якість товару виявилася відверто низькою, пластик крихкий, зламався за тиждень. Дуже розчарований, гроші на вітер.",
      sentiment: "Negative",
      topic: "Якість",
    },
    {
      review_id: "ID-005",
      review_date: "2024-03-20",
      original_text:
        "Швидкість обробки замовлення та якість консультації менеджера були на найвищому рівні. Обов'язково звернуся до вас знову!",
      sentiment: "Positive",
      topic: "Підтримка",
    },
    {
      review_id: "ID-006",
      review_date: "2024-03-25",
      original_text:
        "Не змогли відправити товар вчасно через відсутність на складі, про що повідомили лише через два дні після оплати.",
      sentiment: "Negative",
      topic: "Доставка",
    },
    {
      review_id: "ID-007",
      review_date: "2024-03-30",
      original_text:
        "Мені дуже сподобалася ціна і те, як швидко я отримав товар. Буду рекомендувати друзям!",
      sentiment: "Positive",
      topic: "Ціна",
    },
    {
      review_id: "ID-008",
      review_date: "2024-04-03",
      original_text:
        "Загалом товар нормальний. Працює, але відчувається, що він не прослужить довго. Якість середня, нічого особливого.",
      sentiment: "Neutral",
      topic: "Якість",
    },
    {
      review_id: "ID-009",
      review_date: "2024-04-08",
      original_text:
        "Продукт чудовий! Все ідеально підійшло, і ціна була найнижчою серед усіх пропозицій, які я знайшов. Молодці!",
      sentiment: "Positive",
      topic: "Ціна",
    },
    {
      review_id: "ID-010",
      review_date: "2024-04-12",
      original_text:
        "Вирішення мого питання зайняло 4 дні через постійні перенаправлення між відділами. Це занадто довго, підтримка потребує оптимізації.",
      sentiment: "Negative",
      topic: "Підтримка",
    },
    {
      review_id: "ID-011",
      review_date: "2024-04-15",
      original_text:
        "Дуже задоволена швидкістю доставки та якістю самого товару. Дякую за відмінний сервіс!",
      sentiment: "Positive",
      topic: "Доставка",
    },
    {
      review_id: "ID-012",
      review_date: "2024-04-18",
      original_text:
        "На сайті було зазначено, що є в наявності, але виявилося, що це неправда. Довелося чекати тиждень. Введіть актуальну інформацію!",
      sentiment: "Negative",
      topic: "Інше",
    },
    {
      review_id: "ID-013",
      review_date: "2024-04-22",
      original_text:
        "Це був позитивний досвід. Товар дійсно високої якості, і я вже замовив додаткові аксесуари.",
      sentiment: "Positive",
      topic: "Якість",
    },
    {
      review_id: "ID-014",
      review_date: "2024-04-28",
      original_text:
        "Замовляв доставку кур'єром. Привезли вчасно, без проблем, хоча трекінг був не дуже інформативний.",
      sentiment: "Neutral",
      topic: "Доставка",
    },
    {
      review_id: "ID-015",
      review_date: "2024-05-02",
      original_text:
        "Я не отримав підтвердження замовлення на пошту. Довелося дзвонити. Це дрібниця, але викликало занепокоєння.",
      sentiment: "Negative",
      topic: "Інше",
    },
    {
      review_id: "ID-016",
      review_date: "2024-05-05",
      original_text:
        "Просто ідеально! Якість збірки на висоті, працює тихо, як і очікувалося. Це дійсно преміальний продукт.",
      sentiment: "Positive",
      topic: "Якість",
    },
    {
      review_id: "ID-017",
      review_date: "2024-05-10",
      original_text:
        "Мені подобається. Трохи зависока ціна, але я купив, бо потрібен був цей функціонал. Загалом – задовільно.",
      sentiment: "Neutral",
      topic: "Ціна",
    },
    {
      review_id: "ID-018",
      review_date: "2024-05-15",
      original_text:
        "Товар виглядає добре, але є невеликий дефект фарбування. Я не буду повертати, але варто звернути увагу на контроль якості.",
      sentiment: "Negative",
      topic: "Якість",
    },
    {
      review_id: "ID-019",
      review_date: "2024-05-20",
      original_text:
        "Фантастично швидка доставка! Замовлено ввечері, отримано вранці. Ви перевершили всі очікування.",
      sentiment: "Positive",
      topic: "Доставка",
    },
    {
      review_id: "ID-020",
      review_date: "2024-05-25",
      original_text:
        "Відмінний продукт, який вирішив мою проблему. Завдяки за таку якість!",
      sentiment: "Positive",
      topic: "Якість",
    },
  ],
} as const;
