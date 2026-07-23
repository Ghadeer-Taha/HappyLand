/* Happy Land — product catalogue data, keyed by slug.
   Shared by category pages (card links) and product-detail.html.

   images: first entry is the main/hero photo. The 2nd/3rd entries are
     placeholder photos reused from the existing asset pool purely to show
     the gallery working — swap them for real per-product photography
     whenever it's available (real photos aren't confirmed for these yet).
   ingredients: optional array of composition items (e.g. "Pasteurised cow milk").
     Leave unset until real ingredient lists are provided — product-detail.html
     falls back to "available on request" copy rather than showing guessed data.
   titleAr / descriptionAr / nameAr: Arabic counterparts, read by product.js
     when document.documentElement.lang === "ar". */
var HL_CATEGORIES = {
  "butter-ghee": { name: "Natural Butter & Ghee", nameAr: "الزبدة والسمن الطبيعي", href: "category-butter-ghee.html" },
  "roomy": { name: "Premium Roomy Cheese", nameAr: "الجبن الرومي", href: "category-roomy.html" },
  "natural-cheese": { name: "Natural Cheese", nameAr: "الجبن الطبيعي", href: "category-natural-cheese.html" },
  "analogue": { name: "Analogue Cheese", nameAr: "الجبن الشبيه", href: "category-analogue.html" }
};

var HL_PRODUCTS = {
  "natural-cow-butter": {
    title: "Natural Cow Butter",
    titleAr: "زبدة بقري طبيعية",
    category: "butter-ghee",
    brandtag: "Happy Land",
    images: ["img/3b50a2fc-3f6a-4a38-a136-a9267a3586ec.jpg", "img/54758c08-845f-4801-93b7-2843a30c47df.jpg", "img/610eb3bf-b4df-4e80-af57-b52de852510a.jpg"],
    description: "Churned from fresh cow cream — golden colour and the natural aroma of farm butter.",
    descriptionAr: "تُصنع من قشدة البقر الطازجة — بلون ذهبي ورائحة طبيعية أصيلة."
  },
  "natural-buffalo-butter": {
    title: "Natural Buffalo Butter",
    titleAr: "زبدة جاموسي طبيعية",
    category: "butter-ghee",
    brandtag: "Happy Land",
    images: ["img/f170b43b-f128-47bc-88dd-fef25aa17d8b.jpg", "img/63c74721-65ce-491c-91dd-04110fa2631d.jpg", "img/77fa3d6a-4cdc-4e62-b1d8-7323c5c756f5.jpg"],
    description: "Rich buffalo-milk butter — a staple for authentic Middle-Eastern cooking.",
    descriptionAr: "زبدة غنية من حليب الجاموس — عنصر أساسي في المطبخ الشرق أوسطي الأصيل."
  },
  "natural-cow-ghee": {
    title: "Natural Cow Ghee",
    titleAr: "سمن بقري طبيعي",
    category: "butter-ghee",
    brandtag: "JARAH",
    images: ["img/50b6b58c-2308-46e1-b055-51256eff5087.jpg", "img/a8c10e32-6fdb-43a6-bbc1-8e0e999756da.jpg", "img/a8ffccf1-e8eb-41e4-8662-5b6d5bac506a.jpg"],
    description: "Slow-clarified cow ghee under our JARAH brand — pure, fragrant and shelf-stable.",
    descriptionAr: "سمن بقري مُصفّى ببطء تحت علامة جَرّة — نقي وعطري وثابت الجودة."
  },
  "natural-buffalo-ghee": {
    title: "Natural Buffalo Ghee",
    titleAr: "سمن جاموسي طبيعي",
    category: "butter-ghee",
    brandtag: "JARAH",
    images: ["img/41f92348-8d3b-4dfd-be93-197a5ae21b0c.jpg", "img/abd455c2-576d-4a33-bc24-3e2baa1f5a72.jpg", "img/b7a583d8-b8ec-43da-ac63-2709eb14cbd3.jpg"],
    description: "Traditional buffalo ghee — the deep, authentic flavour of real home cooking.",
    descriptionAr: "سمن جاموسي تقليدي — بنكهة أصيلة عميقة تشبه طبخ المنزل."
  },
  "plain-roomy-cheese": {
    title: "Plain Roomy Cheese",
    titleAr: "جبن رومي سادة",
    category: "roomy",
    brandtag: "Cheese Land",
    images: ["img/77fa3d6a-4cdc-4e62-b1d8-7323c5c756f5.jpg", "img/bf2ee470-86d0-4332-8fa7-adf3a63ae172.jpg", "img/d1624e56-53c0-462b-957e-165242d2d689.jpg"],
    description: "Classic full-cream Roumy — rich, nutty and matured to a firm, sliceable finish.",
    descriptionAr: "جبن رومي كامل الدسم كلاسيكي — غني المذاق ومُعتّق لقوام متماسك قابل للتقطيع."
  },
  "roomy-with-cumin": {
    title: "Roomy with Cumin",
    titleAr: "رومي بالكمون",
    category: "roomy",
    brandtag: "Cheese Land",
    images: ["img/b7a583d8-b8ec-43da-ac63-2709eb14cbd3.jpg", "img/e9e52c18-055b-4815-b9c0-028b6417d314.jpg", "img/fa4ff283-d633-48e6-85d5-4b709a28ac25.jpg"],
    description: "Traditional Roumy blended with cumin for a warm, aromatic depth of flavour.",
    descriptionAr: "جبن رومي تقليدي ممزوج بالكمون لنكهة دافئة وعميقة."
  },
  "mature-roomy-cheese": {
    title: "Mature Roomy Cheese",
    titleAr: "رومي معتّق",
    category: "roomy",
    brandtag: "Cheese Land",
    images: ["img/d1624e56-53c0-462b-957e-165242d2d689.jpg", "img/fe77177b-7b98-4d2e-a024-e0cdf4d74fe7.jpg", "img/2f8654e9-84d3-4a1f-a016-7f6779cf0c31.jpg"],
    description: "Extended ageing delivers a sharper, more intense character for connoisseurs.",
    descriptionAr: "تعتيق ممتد يمنح طابعًا أقوى وأكثر حدة لعشاق الجبن الرومي."
  },
  "roomy-with-black-pepper": {
    title: "Roomy with Black Pepper",
    titleAr: "رومي بالفلفل الأسود",
    category: "roomy",
    brandtag: "Cheese Land",
    images: ["img/77fa3d6a-4cdc-4e62-b1d8-7323c5c756f5.jpg", "img/3b50a2fc-3f6a-4a38-a136-a9267a3586ec.jpg", "img/41f92348-8d3b-4dfd-be93-197a5ae21b0c.jpg"],
    description: "A bold twist on the classic — studded with cracked black pepper.",
    descriptionAr: "لمسة جريئة على الكلاسيكية — مرصّعة بحبوب الفلفل الأسود المجروش."
  },
  "white-cheese": {
    title: "White Cheese",
    titleAr: "جبن أبيض",
    category: "natural-cheese",
    brandtag: "Happy Land",
    images: ["img/2f8654e9-84d3-4a1f-a016-7f6779cf0c31.jpg", "img/50b6b58c-2308-46e1-b055-51256eff5087.jpg", "img/54758c08-845f-4801-93b7-2843a30c47df.jpg"],
    description: "Soft, creamy white cheese with a fresh, lightly salted flavour — a daily table favourite.",
    descriptionAr: "جبن أبيض طري وكريمي بنكهة مالحة خفيفة وطازجة — المفضل اليومي على المائدة."
  },
  "cottage-cheese": {
    title: "Cottage Cheese",
    titleAr: "جبن قريش",
    category: "natural-cheese",
    brandtag: "Happy Land",
    images: ["img/63c74721-65ce-491c-91dd-04110fa2631d.jpg", "img/610eb3bf-b4df-4e80-af57-b52de852510a.jpg", "img/77fa3d6a-4cdc-4e62-b1d8-7323c5c756f5.jpg"],
    description: "Light, mild and versatile — ideal for breakfasts, salads and everyday meals.",
    descriptionAr: "جبن خفيف ومعتدل ومتعدد الاستخدامات — مثالي للإفطار والسلطات والوجبات اليومية."
  },
  "istanbuli-cheese": {
    title: "Istanbuli Cheese",
    titleAr: "جبن إسطنبولي",
    category: "natural-cheese",
    brandtag: "Happy Land",
    images: ["img/2f8654e9-84d3-4a1f-a016-7f6779cf0c31.jpg", "img/a8c10e32-6fdb-43a6-bbc1-8e0e999756da.jpg", "img/a8ffccf1-e8eb-41e4-8662-5b6d5bac506a.jpg"],
    description: "Creamy, semi-soft cheese — available plain and with pepper, in export tubs.",
    descriptionAr: "جبن كريمي شبه طري — متوفر سادة وبالفلفل، في عبوات تصدير."
  },
  "cream": {
    title: "Cream",
    titleAr: "قشطة",
    category: "natural-cheese",
    brandtag: "Happy Land",
    images: ["img/50b6b58c-2308-46e1-b055-51256eff5087.jpg", "img/abd455c2-576d-4a33-bc24-3e2baa1f5a72.jpg", "img/b7a583d8-b8ec-43da-ac63-2709eb14cbd3.jpg"],
    description: "Smooth, rich dairy cream for cooking, desserts and traditional breakfasts.",
    descriptionAr: "قشطة ناعمة وغنية للطبخ والحلويات والإفطار التقليدي."
  },
  "slicing-cheese": {
    title: "Slicing Cheese",
    titleAr: "جبن شرائح",
    category: "analogue",
    brandtag: "Happy Land",
    images: ["img/63c74721-65ce-491c-91dd-04110fa2631d.jpg", "img/bf2ee470-86d0-4332-8fa7-adf3a63ae172.jpg", "img/d1624e56-53c0-462b-957e-165242d2d689.jpg"],
    description: "Clean, uniform slices with reliable performance for sandwiches and burgers.",
    descriptionAr: "شرائح نظيفة ومنتظمة بأداء موثوق للسندويتشات والبرغر."
  },
  "melting-cheese": {
    title: "Melting Cheese",
    titleAr: "جبن ذائب",
    category: "analogue",
    brandtag: "Happy Land",
    images: ["img/2f8654e9-84d3-4a1f-a016-7f6779cf0c31.jpg", "img/e9e52c18-055b-4815-b9c0-028b6417d314.jpg", "img/fa4ff283-d633-48e6-85d5-4b709a28ac25.jpg"],
    description: "Smooth, even melt — engineered for consistent results in hot dishes.",
    descriptionAr: "ذوبان ناعم ومتساوٍ — مصمم لنتائج ثابتة في الأطباق الساخنة."
  },
  "pizza-cheese": {
    title: "Pizza Cheese",
    titleAr: "جبن بيتزا",
    category: "analogue",
    brandtag: "Happy Land",
    images: ["img/63c74721-65ce-491c-91dd-04110fa2631d.jpg", "img/fe77177b-7b98-4d2e-a024-e0cdf4d74fe7.jpg", "img/f170b43b-f128-47bc-88dd-fef25aa17d8b.jpg"],
    description: "Excellent stretch and browning — a dependable choice for pizza chains.",
    descriptionAr: "تمدد ممتاز وتحمير مثالي — خيار موثوق لسلاسل البيتزا."
  },
  "food-service-packs": {
    title: "Food-Service Packs",
    titleAr: "عبوات الخدمات الغذائية",
    category: "analogue",
    brandtag: "Happy Land",
    images: ["img/2f8654e9-84d3-4a1f-a016-7f6779cf0c31.jpg", "img/3b50a2fc-3f6a-4a38-a136-a9267a3586ec.jpg", "img/41f92348-8d3b-4dfd-be93-197a5ae21b0c.jpg"],
    description: "Bulk formats and flexible specifications for manufacturers and caterers.",
    descriptionAr: "عبوات كبيرة ومواصفات مرنة للمصنعين ومقدمي خدمات التموين."
  }
};
