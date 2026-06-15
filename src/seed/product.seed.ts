import { db } from "../db/config";
import { products, productVariants } from "../db/schema";


interface CategoryDef {
  key: string;
  label: string;
  weightUnit: "g" | "ml";
  variantWeights: [number, number]; // two variants per product
  priceRange: [number, number];     // price for the SMALLER variant
  expiryDays: [number, number];     // shelf life range
  descriptionTemplate: (name: string) => string;
  items: string[];
}

const CATEGORIES: CategoryDef[] = [
  {
    key: "vegetables",
    label: "Vegetables",
    weightUnit: "g",
    variantWeights: [500, 1000],
    priceRange: [0.5, 2.5],
    expiryDays: [5, 14],
    descriptionTemplate: (n) =>
      `Fresh organic ${n.toLowerCase()}, grown without synthetic pesticides or chemical fertilizers. Harvested at peak ripeness for maximum flavor and nutrition.`,
    items: [
      "Potato", "Tomato", "Onion", "Carrot", "Cabbage",
      "Cauliflower", "Spinach", "Broccoli", "Bell Pepper", "Cucumber",
      "Beetroot", "Radish", "Pumpkin", "Bottle Gourd", "Bitter Gourd",
      "Eggplant", "Okra", "Green Peas", "Sweet Corn", "Garlic",
      "Ginger", "Lettuce", "Zucchini", "Sweet Potato", "Turnip",
      "Button Mushroom", "Celery", "Asparagus", "Kale", "Leek",
    ],
  },
  {
    key: "fruits",
    label: "Fruits",
    weightUnit: "g",
    variantWeights: [500, 1000],
    priceRange: [1.0, 4.0],
    expiryDays: [4, 10],
    descriptionTemplate: (n) =>
      `Naturally ripened organic ${n.toLowerCase()}, packed with vitamins and antioxidants. Grown on certified organic orchards and harvested by hand.`,
    items: [
      "Apple", "Banana", "Mango", "Orange", "Grapes",
      "Watermelon", "Papaya", "Pineapple", "Pomegranate", "Strawberry",
      "Kiwi", "Pear", "Peach", "Plum", "Guava",
      "Lychee", "Cherry", "Blueberry", "Raspberry", "Avocado",
      "Lemon", "Lime", "Coconut", "Dragon Fruit", "Fig",
      "Apricot", "Custard Apple", "Jackfruit", "Mulberry", "Persimmon",
    ],
  },
  {
    key: "dairy-eggs",
    label: "Dairy & Eggs",
    weightUnit: "ml",
    variantWeights: [250, 500],
    priceRange: [1.0, 4.0],
    expiryDays: [3, 10],
    descriptionTemplate: (n) =>
      `Organic ${n.toLowerCase()} sourced from grass-fed, free-range farms. No hormones, antibiotics, or artificial additives — just pure, wholesome goodness.`,
    items: [
      "Cow Milk", "Buffalo Milk", "Paneer", "Curd", "Greek Yogurt",
      "Butter", "Ghee", "Cheese Slices", "Cottage Cheese", "Fresh Cream",
      "Buttermilk", "Free-Range Eggs", "Duck Eggs", "Goat Milk", "Whey Protein Powder",
      "Mozzarella Cheese", "Cheddar Cheese", "Skimmed Milk", "Flavored Yogurt", "Khoa",
      "Condensed Milk", "Milk Powder", "Probiotic Yogurt", "Sweet Lassi", "Cream Cheese",
      "Sour Cream", "Tofu", "Quark Cheese", "Ricotta Cheese", "Soy Milk",
    ],
  },
  {
    key: "grains-cereals",
    label: "Grains & Cereals",
    weightUnit: "g",
    variantWeights: [500, 1000],
    priceRange: [1.5, 4.0],
    expiryDays: [180, 365],
    descriptionTemplate: (n) =>
      `Stone-ground organic ${n.toLowerCase()}, cultivated using traditional farming methods. A wholesome staple rich in fiber and natural nutrients.`,
    items: [
      "Brown Rice", "White Rice", "Basmati Rice", "Wheat Flour", "Rolled Oats",
      "Quinoa", "Barley", "Foxtail Millet", "Finger Millet (Ragi)", "Sorghum (Jowar)",
      "Pearl Millet (Bajra)", "Corn Flour", "Semolina", "Vermicelli", "Rice Flakes (Poha)",
      "Multigrain Flour", "Buckwheat", "Whole Wheat Bread Flour", "Couscous", "Rye Flour",
      "Amaranth Grain", "Wild Rice", "Cornmeal", "Sago (Sabudana)", "Maize Flour",
      "Spelt Flour", "Brown Rice Flour", "Rice Bran", "Steel-Cut Oats", "Red Rice",
    ],
  },
  {
    key: "pulses-lentils",
    label: "Pulses & Lentils",
    weightUnit: "g",
    variantWeights: [500, 1000],
    priceRange: [1.2, 3.5],
    expiryDays: [180, 365],
    descriptionTemplate: (n) =>
      `Premium organic ${n.toLowerCase()}, sun-dried and naturally processed. A protein-rich staple grown without chemical inputs.`,
    items: [
      "Toor Dal", "Moong Dal", "Masoor Dal", "Chana Dal", "Urad Dal",
      "Rajma (Kidney Beans)", "White Chickpeas", "Black-Eyed Peas", "Dried Green Peas", "Soybean",
      "Whole Black Urad", "Brown Chickpeas", "Horse Gram", "Split Pigeon Peas", "Yellow Split Peas",
      "Lima Beans", "Black Gram", "Bengal Gram", "Field Beans", "Adzuki Beans",
      "Whole Green Moong", "Cowpeas", "Pinto Beans", "Navy Beans", "Fava Beans",
      "Mixed Lentil Pack", "Red Lentils", "Green Lentils", "Sprouted Moong", "Whole Masoor",
    ],
  },
  {
    key: "spices-herbs",
    label: "Spices & Herbs",
    weightUnit: "g",
    variantWeights: [50, 100],
    priceRange: [1.0, 5.0],
    expiryDays: [180, 365],
    descriptionTemplate: (n) =>
      `Aromatic organic ${n.toLowerCase()}, sourced from small farms and naturally dried to preserve essential oils and flavor.`,
    items: [
      "Turmeric Powder", "Red Chilli Powder", "Coriander Powder", "Cumin Seeds", "Mustard Seeds",
      "Black Pepper", "Green Cardamom", "Cloves", "Cinnamon Sticks", "Bay Leaves",
      "Fennel Seeds", "Fenugreek Seeds", "Garam Masala", "Asafoetida", "Star Anise",
      "Nutmeg", "Mace", "Dried Curry Leaves", "Dried Mint Leaves", "Dried Basil",
      "Oregano", "Dried Thyme", "Dried Rosemary", "Dry Ginger Powder", "Vanilla Pods",
      "Saffron Threads", "Tamarind", "Carom Seeds (Ajwain)", "Poppy Seeds", "Sesame Seeds",
    ],
  },
  {
    key: "nuts-seeds",
    label: "Nuts & Seeds",
    weightUnit: "g",
    variantWeights: [100, 250],
    priceRange: [2.0, 8.0],
    expiryDays: [90, 180],
    descriptionTemplate: (n) =>
      `Organic ${n.toLowerCase()}, naturally dried and free from preservatives. A nutrient-dense snack packed with healthy fats and protein.`,
    items: [
      "Almonds", "Cashew Nuts", "Walnuts", "Pistachios", "Peanuts",
      "Raisins", "Dates", "Dried Figs", "Dried Apricots", "Pumpkin Seeds",
      "Sunflower Seeds", "Chia Seeds", "Flax Seeds", "Watermelon Seeds", "Hazelnuts",
      "Pine Nuts", "Brazil Nuts", "Macadamia Nuts", "Dried Cranberries", "Dried Mango Slices",
      "Mixed Dry Fruits", "Trail Mix", "Pecans", "Dried Mulberries", "Banana Chips",
      "Dried Coconut Flakes", "Tiger Nuts", "Roasted Soy Nuts", "Roasted Chickpeas", "Energy Seed Mix",
    ],
  },
  {
    key: "oils-ghee",
    label: "Oils & Ghee",
    weightUnit: "ml",
    variantWeights: [500, 1000],
    priceRange: [3.0, 10.0],
    expiryDays: [180, 365],
    descriptionTemplate: (n) =>
      `Cold-pressed organic ${n.toLowerCase()}, extracted using traditional methods to retain natural aroma, flavor, and nutrients.`,
    items: [
      "Cold-Pressed Mustard Oil", "Virgin Coconut Oil", "Sesame Oil", "Groundnut Oil", "Sunflower Oil",
      "Extra Virgin Olive Oil", "Pure Cow Ghee", "Buffalo Ghee", "Cold-Pressed Almond Oil", "Rice Bran Oil",
      "Soybean Oil", "Flaxseed Oil", "Avocado Oil", "Walnut Oil", "Safflower Oil",
      "Corn Oil", "Canola Oil", "A2 Cow Ghee", "Cold-Pressed Groundnut Oil", "Black Sesame Oil",
      "Hemp Seed Oil", "Wheatgerm Oil", "Mahua Oil", "Niger Seed Oil", "Pumpkin Seed Oil",
      "Grapeseed Oil", "Cold-Pressed Sunflower Oil", "Desi Ghee", "Castor Oil", "Blended Cooking Oil",
    ],
  },
  {
    key: "beverages",
    label: "Beverages",
    weightUnit: "ml",
    variantWeights: [250, 500],
    priceRange: [1.0, 4.0],
    expiryDays: [60, 180],
    descriptionTemplate: (n) =>
      `Organic ${n.toLowerCase()}, crafted from naturally grown ingredients with no artificial flavors, colors, or preservatives.`,
    items: [
      "Green Tea", "Black Tea", "Herbal Tea Mix", "Coffee Beans", "Instant Coffee",
      "Turmeric Latte Mix", "Coconut Water", "Orange Juice", "Apple Juice", "Aloe Vera Juice",
      "Kombucha", "Apple Cider Vinegar", "Spiced Buttermilk", "Lemon Iced Tea", "Ginger Tea",
      "Tulsi Tea", "Chamomile Tea", "Hibiscus Tea", "Natural Cola", "Natural Energy Drink",
      "Almond Milk", "Oat Milk", "Soy Milk Drink", "Rose Syrup", "Sugarcane Juice",
      "Mixed Berry Smoothie", "Wheatgrass Juice", "Beetroot Juice", "Carrot Juice", "Mango Juice",
    ],
  },
  {
    key: "snacks-bakery",
    label: "Snacks & Bakery",
    weightUnit: "g",
    variantWeights: [200, 400],
    priceRange: [1.0, 4.0],
    expiryDays: [30, 90],
    descriptionTemplate: (n) =>
      `Wholesome organic ${n.toLowerCase()}, baked using traditional recipes with whole-grain, organically sourced ingredients.`,
    items: [
      "Whole Wheat Bread", "Multigrain Bread", "Brown Bread", "Oat Cookies", "Ragi Cookies",
      "Granola Bars", "Banana Chips Snack", "Roasted Makhana", "Multigrain Crackers", "Millet Cookies",
      "Quinoa Puffs", "Sprouted Wheat Bread", "Veggie Chips", "Sourdough Bread", "Whole Grain Bagels",
      "Banana Muffins", "Blueberry Muffins", "Energy Bars", "Protein Bars", "Trail Mix Bars",
      "Rice Cakes", "Corn Puffs", "Almond Cookies", "Coconut Cookies", "Honey Oat Bars",
      "Whole Grain Pasta", "Buckwheat Noodles", "Millet Flakes", "Jaggery Sweets", "Date Energy Bars",
    ],
  },
];

// ─────────────────────────────────────────────
// Supporting data
// ─────────────────────────────────────────────
const FARM_NAMES = [
  "Himalayan Organic Farms",
  "Green Valley Organics",
  "Sunrise Farm Co-op",
  "Terai Fresh Farms",
  "Mountain Harvest Co.",
  "Pure Earth Organics",
  "Kathmandu Valley Growers",
  "Annapurna Organic Estate",
  "Riverside Organic Farms",
  "Golden Field Farms",
];

const ORIGIN_COUNTRIES = ["Nepal", "India", "Bhutan", "Sri Lanka"];

const FRESHNESS_TAGS = ["fresh", "farm-fresh", "premium", "mid-fresh", "newly-harvested"];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// deterministic pseudo-random in [min, max] — same seed always gives same value
function seededValue(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 999.123) * 10000;
  const frac = x - Math.floor(x);
  return min + frac * (max - min);
}

// ─────────────────────────────────────────────
// Generation
// ─────────────────────────────────────────────
async function seed() {
  const productRows: (typeof products.$inferInsert)[] = [];
  const variantRows: (typeof productVariants.$inferInsert)[] = [];


  const now = new Date();
  let globalIndex = 0;

  for (const cat of CATEGORIES) {
    cat.items.forEach((name, i) => {
      const id = `prod_${cat.key}_${String(i + 1).padStart(2, "0")}`;
      const slug = slugify(`${name}-${cat.key}`);

      // ── flags ──
      const isMostPopular = globalIndex % 6 === 0;
      const isFeatured = globalIndex % 8 === 0;
      const isOffered = globalIndex % 5 === 0;
      const discount = isOffered ? [10, 15, 20, 25][globalIndex % 4] : 0;

      const offerStartDate = isOffered ? now.toISOString() : null;
      const offerEndDate = isOffered
        ? new Date(now.getTime() + 7 * 86400000).toISOString()
        : null;

      // ── expiry ──
      const expiryDays = Math.round(
        seededValue(globalIndex, cat.expiryDays[0], cat.expiryDays[1])
      );
      const expireAt = new Date(now.getTime() + expiryDays * 86400000).toISOString();

      // ── freshness tags (1 or 2) ──
      const freshnessCount = 1 + (globalIndex % 2);
      const freshnessTags = Array.from(
        { length: freshnessCount },
        (_, k) => FRESHNESS_TAGS[(globalIndex + k) % FRESHNESS_TAGS.length]
      );

      const farmName = FARM_NAMES[globalIndex % FARM_NAMES.length];
      const originCountry = ORIGIN_COUNTRIES[globalIndex % ORIGIN_COUNTRIES.length];

      // ── status — most active, occasional out_of_stock ──
      const status = globalIndex % 27 === 0 ? "out_of_stock" : "active";

      productRows.push({
        id,
        name,
        slug,
        category: cat.label,
        keywords: `${name.toLowerCase()},${cat.label.toLowerCase()},organic ${name.toLowerCase()}`,
        description: cat.descriptionTemplate(name),

        // 16:9 — card header / detail hero
        thumbnail: `https://picsum.photos/seed/${id}/800/450`,
        images: [
          `https://picsum.photos/seed/${id}-1/800/450`,
          `https://picsum.photos/seed/${id}-2/800/450`,
          `https://picsum.photos/seed/${id}-3/800/450`,
        ],
        // 1:1 — small UI icon
        icon: `https://picsum.photos/seed/${id}-icon/200/200`,

        isMostPopular,
        isFeatured,
        isOffered,
        discount,
        offerStartDate,
        offerEndDate,

        originCountry,
        farmName,
        freshnessTags,

        // wide banner only for featured products
        featuredBanner: isFeatured
          ? [`https://picsum.photos/seed/${id}-banner/1200/450`]
          : [],

        status,
        expireAt,
      });

      // ── variants — 2 per product ──
      const [w1, w2] = cat.variantWeights;
      const unitPrice = seededValue(globalIndex, cat.priceRange[0], cat.priceRange[1]);

      [w1, w2].forEach((weight, vi) => {
        const ratio = weight / w1;
        const bulkDiscount = vi === 0 ? 1 : 0.92; // small discount on larger size
        const price = Math.round(unitPrice * ratio * bulkDiscount * 100) / 100;
        const stock = Math.round(seededValue(globalIndex * 3 + vi, 10, 200));

        variantRows.push({
          id: `${id}_v${vi + 1}`,
          productId: id,
          weightValue: weight,
          weightUnit: cat.weightUnit,
          price,
          stock,
        });
      });

      globalIndex++;
    });
  }

  console.log(`Generated ${productRows.length} products, ${variantRows.length} variants`);
  console.log(
    `  featured: ${productRows.filter((p) => p.isFeatured).length}, ` +
    `most popular: ${productRows.filter((p) => p.isMostPopular).length}, ` +
    `offered: ${productRows.filter((p) => p.isOffered).length}, ` +
    `out of stock: ${productRows.filter((p) => p.status === "out_of_stock").length}`
  );

  // ── insert in batches (stay under SQLite bind-variable limits) ──
  for (const batch of chunk(productRows, 25)) {
    await db.insert(products).values(batch).onConflictDoNothing();
  }

  for (const batch of chunk(variantRows, 50)) {
    await db.insert(productVariants).values(batch).onConflictDoNothing();
  }

  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});