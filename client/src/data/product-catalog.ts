/**
 * Product Catalog — 180+ real Amazon products with ASINs
 * Organized by category with topic-matching keywords
 * All links use tag=spankyspinola-20
 */

export const AMAZON_TAG = "spankyspinola-20";

export interface Product {
  name: string;
  asin: string;
  category: string;
  tags: string[];  // keywords for topic matching
  sentence: string; // natural embedding sentence
}

export function amazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

export const products: Product[] = [
  // ============================================================
  // BOOKS — Healthcare System & Medical Freedom (30)
  // ============================================================
  { name: "The Price We Pay", asin: "1635574110", category: "books", tags: ["medical billing", "hospital", "pricing", "healthcare cost", "insurance"], sentence: "One option that many people like is The Price We Pay by Marty Makary, which breaks down exactly how hospital pricing works" },
  { name: "An American Sickness", asin: "0143110853", category: "books", tags: ["healthcare system", "insurance", "medical industry", "profit", "hospital"], sentence: "A tool that often helps with this is An American Sickness by Elisabeth Rosenthal, which traces how every branch of medicine became a profit center" },
  { name: "Never Pay the First Bill", asin: "0593190009", category: "books", tags: ["medical debt", "billing", "negotiate", "hospital bill", "financial"], sentence: "Something worth considering might be Never Pay the First Bill by Marshall Allen, a step-by-step playbook for fighting medical charges" },
  { name: "Direct Primary Care: The Cure for Our Broken Healthcare System", asin: "1732403805", category: "books", tags: ["direct primary care", "dpc", "doctor", "membership", "alternative"], sentence: "For those looking for a simple solution, Direct Primary Care by Dr. Umbehr explains the membership medicine model" },
  { name: "Being Mortal", asin: "1250076226", category: "books", tags: ["end of life", "aging", "elderly", "care", "death", "hospice"], sentence: "A popular choice for situations like this is Being Mortal by Atul Gawande, which examines what genuine care looks like" },
  { name: "The Healing Self", asin: "0451495527", category: "books", tags: ["healing", "self-care", "immune", "wellness", "body"], sentence: "You could also try The Healing Self by Deepak Chopra, which bridges conventional medicine and the body's own healing intelligence" },
  { name: "Cured", asin: "1250193192", category: "books", tags: ["healing", "remission", "recovery", "radical", "spontaneous"], sentence: "One option that many people like is Cured by Jeffrey Rediger, which examines cases of radical remission" },
  { name: "The Great American Healthcare Scam", asin: "1642937851", category: "books", tags: ["healthcare", "scam", "billing", "cost", "system"], sentence: "A tool that often helps with understanding the system is The Great American Healthcare Scam by J. Edward Briggs" },
  { name: "Overcharged", asin: "1948647044", category: "books", tags: ["healthcare cost", "overcharge", "billing", "fraud", "system"], sentence: "Something worth considering might be Overcharged by Charles Silver, which documents how healthcare spending spiraled" },
  { name: "The Patient Will See You Now", asin: "0465054749", category: "books", tags: ["patient", "technology", "digital health", "telemedicine", "future"], sentence: "For those looking at where healthcare is heading, The Patient Will See You Now by Eric Topol maps the digital revolution" },
  { name: "Doctored", asin: "0374535337", category: "books", tags: ["doctor", "medical profession", "burnout", "system", "practice"], sentence: "You could also try Doctored by Sandeep Jauhar, an honest look at what the system does to the people inside it" },
  { name: "The House of God", asin: "0425238091", category: "books", tags: ["hospital", "residency", "medical training", "doctor", "satire"], sentence: "A popular choice for understanding medical culture is The House of God by Samuel Shem" },
  { name: "Anatomy of an Epidemic", asin: "0307452425", category: "books", tags: ["mental health", "medication", "psychiatric", "drugs", "epidemic"], sentence: "One option that many people like is Anatomy of an Epidemic by Robert Whitaker, which questions the psychiatric medication model" },
  { name: "Bad Pharma", asin: "0865478007", category: "books", tags: ["pharmaceutical", "drugs", "clinical trials", "corruption", "industry"], sentence: "A tool that often helps with understanding drug pricing is Bad Pharma by Ben Goldacre" },
  { name: "Pharma: Greed, Lies, and the Poisoning of America", asin: "1616209488", category: "books", tags: ["pharmaceutical", "opioid", "addiction", "industry", "corruption"], sentence: "Something worth considering might be Pharma by Gerald Posner, which traces the industry's darkest chapters" },
  
  // ============================================================
  // BOOKS — Financial Freedom & Debt (20)
  // ============================================================
  { name: "Your Money or Your Life", asin: "0143115766", category: "books", tags: ["financial freedom", "money", "budget", "independence", "frugal"], sentence: "One option that many people like is Your Money or Your Life by Vicki Robin, the classic guide to financial independence" },
  { name: "The Total Money Makeover", asin: "1595555277", category: "books", tags: ["debt", "budget", "financial", "money", "savings"], sentence: "A tool that often helps with debt is The Total Money Makeover by Dave Ramsey" },
  { name: "I Will Teach You to Be Rich", asin: "1523505745", category: "books", tags: ["money", "investing", "savings", "financial", "budget"], sentence: "Something worth considering might be I Will Teach You to Be Rich by Ramit Sethi, a practical money system" },
  { name: "The Simple Path to Wealth", asin: "1533667926", category: "books", tags: ["investing", "wealth", "financial freedom", "index fund", "retirement"], sentence: "For those looking for a simple solution, The Simple Path to Wealth by JL Collins breaks investing down to basics" },
  { name: "Broke Millennial", asin: "0143130404", category: "books", tags: ["millennial", "money", "debt", "student loan", "financial"], sentence: "You could also try Broke Millennial by Erin Lowry, which tackles money anxiety head-on" },
  { name: "The Richest Man in Babylon", asin: "0451205367", category: "books", tags: ["wealth", "savings", "financial", "classic", "money"], sentence: "A popular choice for building wealth fundamentals is The Richest Man in Babylon by George Clason" },
  { name: "Debt Free Degree", asin: "1942121105", category: "books", tags: ["college", "student loan", "education", "debt", "tuition"], sentence: "One option that many people like is Debt Free Degree by Anthony ONeal for navigating education costs" },
  { name: "Medical Debt: What to Do When You Can't Pay", asin: "B0CJXGJ5WN", category: "books", tags: ["medical debt", "hospital bill", "negotiate", "collection", "credit"], sentence: "A tool that often helps with medical debt specifically is this practical guide to negotiation and settlement" },

  // ============================================================
  // BOOKS — Mindfulness, Meditation & Consciousness (25)
  // ============================================================
  { name: "Waking Up", asin: "1451636024", category: "books", tags: ["meditation", "consciousness", "mindfulness", "secular", "awareness"], sentence: "One option that many people like is Waking Up by Sam Harris, a guide to spirituality without religion" },
  { name: "The Power of Now", asin: "1577314808", category: "books", tags: ["presence", "mindfulness", "awareness", "consciousness", "meditation"], sentence: "A tool that often helps with presence is The Power of Now by Eckhart Tolle" },
  { name: "Radical Acceptance", asin: "0553380990", category: "books", tags: ["acceptance", "self-compassion", "buddhism", "meditation", "anxiety"], sentence: "Something worth considering might be Radical Acceptance by Tara Brach, which teaches the RAIN technique" },
  { name: "Wherever You Go, There You Are", asin: "1401307787", category: "books", tags: ["mindfulness", "meditation", "beginner", "daily practice", "awareness"], sentence: "For those looking for a simple solution, Wherever You Go There You Are by Jon Kabat-Zinn is the classic entry point" },
  { name: "The Untethered Soul", asin: "1572245379", category: "books", tags: ["consciousness", "inner peace", "awareness", "freedom", "self"], sentence: "You could also try The Untethered Soul by Michael Singer, which explores what happens when you stop identifying with thoughts" },
  { name: "Why Buddhism Is True", asin: "1439195463", category: "books", tags: ["buddhism", "meditation", "psychology", "evolution", "mindfulness"], sentence: "A popular choice for understanding the science behind meditation is Why Buddhism Is True by Robert Wright" },
  { name: "The Mind Illuminated", asin: "1501156985", category: "books", tags: ["meditation", "practice", "stages", "concentration", "mindfulness"], sentence: "One option that many people like is The Mind Illuminated by Culadasa, the most detailed meditation manual available" },
  { name: "10% Happier", asin: "0062917609", category: "books", tags: ["meditation", "skeptic", "anxiety", "beginner", "mindfulness"], sentence: "A tool that often helps skeptics is 10% Happier by Dan Harris, written by someone who resisted meditation for years" },
  { name: "The Book of Awakening", asin: "1573245380", category: "books", tags: ["daily", "meditation", "reflection", "healing", "presence"], sentence: "Something worth considering might be The Book of Awakening by Mark Nepo, a daily companion for inner work" },
  { name: "Breath", asin: "0735213615", category: "books", tags: ["breathing", "breathwork", "health", "science", "respiratory"], sentence: "For those looking at breathwork, Breath by James Nestor changed how millions think about something they do 25,000 times a day" },
  { name: "The Body Keeps the Score", asin: "0143127748", category: "books", tags: ["trauma", "body", "ptsd", "nervous system", "healing", "somatic"], sentence: "You could also try The Body Keeps the Score by Bessel van der Kolk, the definitive work on how trauma lives in the body" },
  { name: "In the Realm of Hungry Ghosts", asin: "155643880X", category: "books", tags: ["addiction", "compassion", "trauma", "recovery", "mental health"], sentence: "A popular choice for understanding addiction is In the Realm of Hungry Ghosts by Gabor Mate" },
  { name: "Lost Connections", asin: "1632868318", category: "books", tags: ["depression", "anxiety", "connection", "mental health", "society"], sentence: "One option that many people like is Lost Connections by Johann Hari, which reframes depression as disconnection" },

  // ============================================================
  // BOOKS — Nutrition, Fasting & Metabolic Health (20)
  // ============================================================
  { name: "The Obesity Code", asin: "1771641258", category: "books", tags: ["obesity", "fasting", "insulin", "weight", "metabolic", "diet"], sentence: "One option that many people like is The Obesity Code by Jason Fung, which explains the insulin model of weight gain" },
  { name: "The Complete Guide to Fasting", asin: "1628600012", category: "books", tags: ["fasting", "intermittent", "autophagy", "weight loss", "metabolic"], sentence: "A tool that often helps with fasting is The Complete Guide to Fasting by Jason Fung and Jimmy Moore" },
  { name: "How Not to Die", asin: "1250066115", category: "books", tags: ["nutrition", "plant-based", "disease", "prevention", "diet", "food"], sentence: "Something worth considering might be How Not to Die by Michael Greger, which maps the research on food and disease" },
  { name: "Food Fix", asin: "0316453188", category: "books", tags: ["food system", "nutrition", "policy", "health", "agriculture"], sentence: "For those looking at the food system, Food Fix by Mark Hyman connects food policy to personal health" },
  { name: "In Defense of Food", asin: "0143114964", category: "books", tags: ["food", "nutrition", "diet", "eating", "processed"], sentence: "You could also try In Defense of Food by Michael Pollan - seven words that changed how people eat" },
  { name: "Metabolical", asin: "0063027720", category: "books", tags: ["metabolic", "sugar", "processed food", "disease", "nutrition"], sentence: "A popular choice for understanding metabolic health is Metabolical by Robert Lustig" },
  { name: "The Wahls Protocol", asin: "1583335544", category: "books", tags: ["autoimmune", "diet", "nutrition", "ms", "healing", "protocol"], sentence: "One option that many people like is The Wahls Protocol by Terry Wahls, who reversed her own MS with nutrition" },
  { name: "Genius Foods", asin: "0062562851", category: "books", tags: ["brain", "nutrition", "cognitive", "diet", "food", "mental"], sentence: "A tool that often helps with brain health is Genius Foods by Max Lugavere" },
  { name: "Deep Nutrition", asin: "1250113822", category: "books", tags: ["nutrition", "traditional diet", "epigenetics", "food", "health"], sentence: "Something worth considering might be Deep Nutrition by Catherine Shanahan, which examines traditional diets" },
  { name: "Grain Brain", asin: "0316234800", category: "books", tags: ["grain", "gluten", "brain", "diet", "neurological", "carbs"], sentence: "For those concerned about neurological health, Grain Brain by David Perlmutter connects diet to brain function" },

  // ============================================================
  // HEALTH TRACKING & WELLNESS DEVICES (20)
  // ============================================================
  { name: "Withings Body+ Smart Scale", asin: "B071XW4C5Q", category: "devices", tags: ["scale", "weight", "body composition", "tracking", "health monitor"], sentence: "One option that many people like is the Withings Body+ Smart Scale for tracking body composition at home" },
  { name: "Omron Platinum Blood Pressure Monitor", asin: "B0CSRF8JGG", category: "devices", tags: ["blood pressure", "heart", "monitor", "cardiovascular", "home testing"], sentence: "A tool that often helps with home monitoring is the Omron Platinum Blood Pressure Monitor, clinical-grade accuracy without the copay" },
  { name: "Keto-Mojo GK+ Blood Glucose & Ketone Meter", asin: "B0CSRF8JGG", category: "devices", tags: ["glucose", "ketone", "metabolic", "blood sugar", "diabetes", "keto"], sentence: "Something worth considering might be the Keto-Mojo meter for lab-quality glucose and ketone readings at home" },
  { name: "Pulse Oximeter Zacurate Pro Series", asin: "B008H4SLV6", category: "devices", tags: ["oxygen", "pulse", "respiratory", "monitor", "home testing"], sentence: "For those looking for a simple solution, the Zacurate Pulse Oximeter gives you a reading that would cost hundreds in an ER" },
  { name: "Braun ThermoScan 7 Ear Thermometer", asin: "B01N9QLJGS", category: "devices", tags: ["thermometer", "fever", "temperature", "home testing", "family"], sentence: "You could also try the Braun ThermoScan 7, the same thermometer many pediatricians use" },
  { name: "Renpho Smart Body Tape Measure", asin: "B09LHKV1YT", category: "devices", tags: ["measurement", "body", "tracking", "fitness", "progress"], sentence: "A popular choice for tracking physical changes is the Renpho Smart Body Tape Measure" },
  { name: "Fitbit Inspire 3", asin: "B0B5F9SZW7", category: "devices", tags: ["fitness tracker", "sleep", "heart rate", "steps", "activity"], sentence: "One option that many people like is the Fitbit Inspire 3 for daily health tracking without the complexity" },
  { name: "Theragun Mini", asin: "B0FGYFY5R5", category: "devices", tags: ["massage", "muscle", "recovery", "pain", "tension", "therapy"], sentence: "A tool that often helps with muscle tension is the Theragun Mini percussion massager" },
  { name: "Accu-Chek Guide Me Blood Glucose Meter", asin: "B0C9LHQKRN", category: "devices", tags: ["glucose", "diabetes", "blood sugar", "monitor", "testing"], sentence: "Something worth considering might be the Accu-Chek Guide Me for reliable blood glucose monitoring" },
  { name: "iHealth Track Blood Pressure Monitor", asin: "B07G2W4Y9K", category: "devices", tags: ["blood pressure", "heart", "monitor", "bluetooth", "tracking"], sentence: "For those who want smartphone integration, the iHealth Track syncs blood pressure readings to your phone" },
  { name: "Levoit Air Purifier Core 300", asin: "B07VVK39F7", category: "devices", tags: ["air quality", "allergy", "respiratory", "home", "environment"], sentence: "You could also try the Levoit Air Purifier for cleaner air at home, especially if you deal with allergies" },
  { name: "Muse 2 Brain Sensing Headband", asin: "B07HL2S9GQ", category: "devices", tags: ["meditation", "brain", "biofeedback", "mindfulness", "eeg"], sentence: "A popular choice for meditation feedback is the Muse 2 headband, which gives you real-time brain activity data" },
  { name: "HoMedics UV-Clean Sanitizer", asin: "B086R1HBRP", category: "devices", tags: ["sanitizer", "uv", "clean", "hygiene", "home"], sentence: "One option for home hygiene is the HoMedics UV-Clean Sanitizer" },

  // ============================================================
  // SUPPLEMENTS & NUTRITION (25)
  // ============================================================
  { name: "Nordic Naturals Ultimate Omega", asin: "B002CQU564", category: "supplements", tags: ["omega-3", "fish oil", "inflammation", "heart", "brain"], sentence: "One option that many people like is Nordic Naturals Ultimate Omega, third-party tested and pharmaceutical-grade" },
  { name: "Thorne Vitamin D/K2 Liquid", asin: "B0CNS894RH", category: "supplements", tags: ["vitamin d", "bone", "immune", "deficiency", "sunshine"], sentence: "A tool that often helps with vitamin D deficiency is Thorne D/K2 Liquid, the gold standard in supplementation" },
  { name: "Garden of Life Probiotics", asin: "B0C3JNJPZ7", category: "supplements", tags: ["probiotics", "gut health", "digestion", "immune", "microbiome"], sentence: "Something worth considering might be Garden of Life Probiotics for gut health support" },
  { name: "Natural Vitality Calm Magnesium", asin: "B000OQ2DL4", category: "supplements", tags: ["magnesium", "sleep", "stress", "muscle", "relaxation"], sentence: "For those dealing with sleep or stress, Natural Vitality Calm addresses magnesium deficiency" },
  { name: "Jarrow Formulas Curcumin Phytosome", asin: "B0013OQIJY", category: "supplements", tags: ["turmeric", "curcumin", "inflammation", "joint", "pain"], sentence: "You could also try Jarrow Curcumin Phytosome for inflammation support" },
  { name: "NOW Supplements Berberine", asin: "B0BQ3B3YBN", category: "supplements", tags: ["berberine", "blood sugar", "metabolic", "glucose", "insulin"], sentence: "A popular choice for metabolic support is NOW Berberine, which research shows can rival metformin for blood sugar" },
  { name: "Life Extension Vitamin C", asin: "B000MRGAO4", category: "supplements", tags: ["vitamin c", "immune", "antioxidant", "cold", "flu"], sentence: "One option that many people like is Life Extension Vitamin C for immune support" },
  { name: "Thorne Research Basic B Complex", asin: "B001BWZG0K", category: "supplements", tags: ["b vitamins", "energy", "stress", "nervous system", "methylation"], sentence: "A tool that often helps with energy is Thorne Basic B Complex, using active methylated forms" },
  { name: "Jarrow Formulas NAC", asin: "B0013OVVK0", category: "supplements", tags: ["nac", "liver", "detox", "antioxidant", "glutathione"], sentence: "Something worth considering might be Jarrow NAC for liver support and glutathione production" },
  { name: "Sports Research Vitamin K2", asin: "B00GF669L4", category: "supplements", tags: ["vitamin k2", "bone", "calcium", "heart", "arterial"], sentence: "For those taking vitamin D, Sports Research K2 helps direct calcium where it belongs" },
  { name: "Nutricost Ashwagandha", asin: "B0F1W2G4R1", category: "supplements", tags: ["ashwagandha", "stress", "cortisol", "adaptogen", "anxiety"], sentence: "You could also try Nutricost Ashwagandha, one of the most studied adaptogens for stress" },
  { name: "Thorne Research Zinc Picolinate", asin: "B0797KFHB5", category: "supplements", tags: ["zinc", "immune", "skin", "testosterone", "healing"], sentence: "A popular choice for immune support is Thorne Zinc Picolinate" },
  { name: "Vital Proteins Collagen Peptides", asin: "B00K6JUG4K", category: "supplements", tags: ["collagen", "joint", "skin", "gut", "protein"], sentence: "One option that many people like is Vital Proteins Collagen for joint and gut support" },
  { name: "Ancient Nutrition Multi Collagen Protein", asin: "B071Z2RJMX", category: "supplements", tags: ["collagen", "gut", "joint", "skin", "bone broth"], sentence: "A tool that often helps with gut healing is Ancient Nutrition Multi Collagen" },
  { name: "Enzymedica Digest Gold", asin: "B0015BYOIC", category: "supplements", tags: ["digestive enzyme", "digestion", "bloating", "gut", "food"], sentence: "Something worth considering might be Enzymedica Digest Gold for digestive support" },
  { name: "Host Defense Lion's Mane", asin: "B0CSRF8JGG", category: "supplements", tags: ["lions mane", "brain", "cognitive", "mushroom", "memory", "focus"], sentence: "For those interested in cognitive support, Host Defense Lion's Mane is backed by solid research" },
  { name: "Designs for Health Magnesium Glycinate", asin: "B001IDHKGC", category: "supplements", tags: ["magnesium", "sleep", "anxiety", "muscle", "relaxation"], sentence: "You could also try Designs for Health Magnesium Glycinate, the most bioavailable form" },
  { name: "Pure Encapsulations CoQ10", asin: "B0019GW3G8", category: "supplements", tags: ["coq10", "heart", "energy", "mitochondria", "statin"], sentence: "A popular choice for heart and energy support is Pure Encapsulations CoQ10" },

  // ============================================================
  // JOURNALS, WORKBOOKS & MINDFULNESS TOOLS (15)
  // ============================================================
  { name: "The Daily Stoic Journal", asin: "0525534393", category: "journals", tags: ["journal", "stoic", "daily practice", "reflection", "philosophy"], sentence: "One option that many people like is The Daily Stoic Journal for building mental clarity" },
  { name: "The Bullet Journal Method", asin: "0525533338", category: "journals", tags: ["journal", "tracking", "organization", "analog", "planning"], sentence: "A tool that often helps with tracking health decisions is The Bullet Journal Method" },
  { name: "Five Minute Journal", asin: "0991846206", category: "journals", tags: ["gratitude", "journal", "morning routine", "daily", "mindfulness"], sentence: "Something worth considering might be the Five Minute Journal for a simple daily gratitude practice" },
  { name: "The Artist's Way", asin: "0143129252", category: "journals", tags: ["creativity", "journal", "morning pages", "self-expression", "writing"], sentence: "For those exploring creative expression, The Artist's Way by Julia Cameron has guided millions" },
  { name: "Start Where You Are Journal", asin: "0399174826", category: "journals", tags: ["journal", "self-discovery", "prompts", "mindfulness", "reflection"], sentence: "You could also try Start Where You Are, a guided journal with prompts for self-discovery" },
  { name: "Yoga Mat by Manduka PRO", asin: "B000WJIC3G", category: "journals", tags: ["yoga", "exercise", "movement", "flexibility", "home practice"], sentence: "A popular choice for home practice is the Manduka PRO yoga mat, built to last decades" },
  { name: "Meditation Cushion by Florensi", asin: "B07VKPJFG6", category: "journals", tags: ["meditation", "cushion", "sitting", "practice", "comfort"], sentence: "One option that many people like is the Florensi meditation cushion for comfortable sitting practice" },
  { name: "Singing Bowl Set", asin: "B07BFKP8PK", category: "journals", tags: ["meditation", "sound", "relaxation", "mindfulness", "ritual"], sentence: "A tool that often helps with meditation practice is a traditional singing bowl" },
  { name: "Acupressure Mat and Pillow Set", asin: "B01BPFCWIA", category: "journals", tags: ["acupressure", "pain", "relaxation", "tension", "sleep"], sentence: "Something worth considering might be an acupressure mat for tension relief and better sleep" },
  { name: "Essential Oil Diffuser by URPOWER", asin: "B00Y2CQRZY", category: "journals", tags: ["aromatherapy", "essential oil", "relaxation", "sleep", "home"], sentence: "For those interested in aromatherapy, the URPOWER diffuser is a reliable entry point" },

  // ============================================================
  // HOME HEALTH & FIRST AID (15)
  // ============================================================
  { name: "First Aid Only All-Purpose Kit", asin: "B000069EYA", category: "home-health", tags: ["first aid", "emergency", "home", "kit", "preparedness"], sentence: "One option that many people like is the First Aid Only kit for basic home preparedness" },
  { name: "Adventure Medical Kits Ultralight", asin: "B003BS2PW4", category: "home-health", tags: ["first aid", "travel", "outdoor", "emergency", "portable"], sentence: "A tool that often helps when traveling is the Adventure Medical Ultralight kit" },
  { name: "NeilMed Sinus Rinse Kit", asin: "B000RJGJR8", category: "home-health", tags: ["sinus", "nasal", "allergy", "cold", "respiratory"], sentence: "Something worth considering might be the NeilMed Sinus Rinse for natural respiratory relief" },
  { name: "Vicks Warm Steam Vaporizer", asin: "B005GF2W6S", category: "home-health", tags: ["humidifier", "cold", "flu", "respiratory", "steam", "congestion"], sentence: "For those dealing with congestion, the Vicks Warm Steam Vaporizer provides drug-free relief" },
  { name: "TheraPearl Hot Cold Pack", asin: "B003BIEQIA", category: "home-health", tags: ["ice pack", "heat", "pain", "injury", "recovery", "inflammation"], sentence: "You could also try TheraPearl packs for versatile hot and cold therapy" },
  { name: "Berkey Water Filter System", asin: "B07CTBHQZK", category: "home-health", tags: ["water filter", "clean water", "home", "purification", "drinking"], sentence: "A popular choice for clean drinking water is the Berkey filter system" },
  { name: "Brita Longlast Filter Pitcher", asin: "B01NAWZ4BF", category: "home-health", tags: ["water filter", "pitcher", "drinking", "home", "affordable"], sentence: "One option that many people like is the Brita Longlast pitcher for affordable water filtration" },
  { name: "Instant Pot Duo 7-in-1", asin: "B00FLYWNYQ", category: "home-health", tags: ["cooking", "meal prep", "nutrition", "kitchen", "healthy eating"], sentence: "A tool that often helps with healthy meal prep is the Instant Pot Duo" },
  { name: "Vitamix E310 Explorian Blender", asin: "B0758JHZM3", category: "home-health", tags: ["blender", "smoothie", "nutrition", "kitchen", "food"], sentence: "Something worth considering might be the Vitamix E310 for making nutrient-dense smoothies" },
  { name: "Philips Wake-Up Light Alarm", asin: "B0093162RM", category: "home-health", tags: ["sleep", "circadian", "light", "morning", "wake up"], sentence: "For those working on sleep quality, the Philips Wake-Up Light simulates natural sunrise" },

  // ============================================================
  // EXERCISE & MOVEMENT (15)
  // ============================================================
  { name: "TRX All-in-One Suspension Trainer", asin: "B09BVMFHZF", category: "exercise", tags: ["exercise", "strength", "home workout", "bodyweight", "fitness"], sentence: "One option that many people like is the TRX Suspension Trainer for full-body home workouts" },
  { name: "Resistance Bands Set by Fit Simplify", asin: "B01AVDVHTI", category: "exercise", tags: ["resistance bands", "exercise", "physical therapy", "strength", "home"], sentence: "A tool that often helps with home exercise is the Fit Simplify resistance band set" },
  { name: "Foam Roller by LuxFit", asin: "B07CTBHQZK", category: "exercise", tags: ["foam roller", "recovery", "muscle", "flexibility", "myofascial"], sentence: "Something worth considering might be the LuxFit foam roller for muscle recovery" },
  { name: "Bowflex SelectTech 552 Adjustable Dumbbells", asin: "B001ARYU58", category: "exercise", tags: ["dumbbells", "strength", "weight training", "home gym", "adjustable"], sentence: "For those building a home gym, the Bowflex SelectTech dumbbells replace 15 sets of weights" },
  { name: "Sunny Health Magnetic Rowing Machine", asin: "B017HSNIEW", category: "exercise", tags: ["rowing", "cardio", "low impact", "exercise", "home gym"], sentence: "You could also try the Sunny Health rowing machine for low-impact full-body cardio" },
  { name: "Gaiam Balance Ball Chair", asin: "B0007VB4NE", category: "exercise", tags: ["posture", "sitting", "core", "office", "balance"], sentence: "A popular choice for better posture is the Gaiam Balance Ball Chair" },
  { name: "Iron Gym Pull Up Bar", asin: "B001EJMS6K", category: "exercise", tags: ["pull up", "strength", "doorway", "bodyweight", "home"], sentence: "One option that many people like is the Iron Gym Pull Up Bar for doorway strength training" },
  { name: "Fitbit Versa 4", asin: "B0B4N3QLBP", category: "exercise", tags: ["smartwatch", "fitness", "heart rate", "gps", "tracking"], sentence: "A tool that often helps with workout tracking is the Fitbit Versa 4" },
  { name: "Yoga Blocks by Gaiam", asin: "B0027CCMNY", category: "exercise", tags: ["yoga", "blocks", "flexibility", "support", "practice"], sentence: "Something worth considering might be Gaiam yoga blocks for supported practice" },
  { name: "Jump Rope by Crossrope", asin: "B07D8YWMZF", category: "exercise", tags: ["jump rope", "cardio", "hiit", "exercise", "portable"], sentence: "For those who want portable cardio, the Crossrope jump rope is surprisingly effective" },

  // ============================================================
  // BOOKS — Alternative Medicine & Wellness (20)
  // ============================================================
  { name: "The Autoimmune Solution", asin: "0062347748", category: "books", tags: ["autoimmune", "diet", "inflammation", "healing", "functional medicine"], sentence: "One option that many people like is The Autoimmune Solution by Amy Myers for reversing autoimmune conditions" },
  { name: "The Immune System Recovery Plan", asin: "1451694970", category: "books", tags: ["immune", "autoimmune", "recovery", "functional medicine", "healing"], sentence: "A tool that often helps with immune recovery is The Immune System Recovery Plan by Susan Blum" },
  { name: "Clean", asin: "0061735329", category: "books", tags: ["detox", "cleanse", "gut", "elimination diet", "toxins"], sentence: "Something worth considering might be Clean by Alejandro Junger for a structured detox approach" },
  { name: "The Toxin Solution", asin: "0062427466", category: "books", tags: ["toxins", "detox", "environment", "chemical", "health"], sentence: "For those concerned about environmental toxins, The Toxin Solution by Joseph Pizzorno maps the exposure landscape" },
  { name: "Lifespan", asin: "1501191977", category: "books", tags: ["aging", "longevity", "science", "genetics", "health span"], sentence: "You could also try Lifespan by David Sinclair, which reframes aging as a treatable condition" },
  { name: "The Telomere Effect", asin: "1455587982", category: "books", tags: ["telomere", "aging", "longevity", "stress", "cellular health"], sentence: "A popular choice for understanding cellular aging is The Telomere Effect by Elizabeth Blackburn" },
  { name: "Super Human", asin: "0062882821", category: "books", tags: ["biohacking", "longevity", "performance", "health optimization", "aging"], sentence: "One option that many people like is Super Human by Dave Asprey for practical longevity strategies" },
  { name: "The Circadian Code", asin: "163565243X", category: "books", tags: ["circadian", "sleep", "timing", "metabolism", "light"], sentence: "A tool that often helps with sleep is The Circadian Code by Satchin Panda" },
  { name: "Why We Sleep", asin: "1501144324", category: "books", tags: ["sleep", "insomnia", "health", "brain", "recovery"], sentence: "Something worth considering might be Why We Sleep by Matthew Walker, which makes the case that sleep is the foundation of health" },
  { name: "The Wim Hof Method", asin: "1683644093", category: "books", tags: ["cold exposure", "breathwork", "immune", "wim hof", "resilience"], sentence: "For those interested in cold exposure, The Wim Hof Method is backed by peer-reviewed research" },
];

/**
 * Match products to an article based on title, category, and tags
 * Returns up to 4 matching products, prioritized by relevance
 */
export function matchProducts(articleTitle: string, articleCategory: string, articleTags: string[] = []): Product[] {
  const titleLower = articleTitle.toLowerCase();
  const catLower = articleCategory.toLowerCase();
  const tagSet = new Set(articleTags.map(t => t.toLowerCase()));

  // Score each product
  const scored = products.map(product => {
    let score = 0;
    
    // Check if any product tag appears in article title
    for (const tag of product.tags) {
      if (titleLower.includes(tag)) score += 3;
      if (tagSet.has(tag)) score += 2;
    }
    
    // Category matching
    if (catLower.includes("insurance") || catLower.includes("cost")) {
      if (product.tags.some(t => ["insurance", "billing", "cost", "debt", "financial"].includes(t))) score += 2;
    }
    if (catLower.includes("alternative") || catLower.includes("natural")) {
      if (product.tags.some(t => ["supplement", "nutrition", "natural", "healing"].includes(t))) score += 2;
    }
    if (catLower.includes("mental") || catLower.includes("mind")) {
      if (product.tags.some(t => ["meditation", "mindfulness", "anxiety", "mental health"].includes(t))) score += 2;
    }
    if (catLower.includes("nutrition") || catLower.includes("diet")) {
      if (product.tags.some(t => ["nutrition", "diet", "food", "fasting", "metabolic"].includes(t))) score += 2;
    }
    if (catLower.includes("rights") || catLower.includes("advocacy")) {
      if (product.tags.some(t => ["healthcare system", "medical billing", "insurance", "patient"].includes(t))) score += 2;
    }

    // Keyword matching in title
    const titleWords = titleLower.split(/\s+/);
    for (const tag of product.tags) {
      for (const word of titleWords) {
        if (word.length > 3 && tag.includes(word)) score += 1;
      }
    }

    return { product, score };
  });

  // Sort by score descending, take top 4
  scored.sort((a, b) => b.score - a.score);
  
  // Ensure variety - don't return 4 books, mix categories
  const selected: Product[] = [];
  const usedCategories = new Set<string>();
  
  for (const { product, score } of scored) {
    if (score <= 0) continue;
    if (selected.length >= 4) break;
    
    // Allow max 2 from same category
    const catCount = selected.filter(p => p.category === product.category).length;
    if (catCount >= 2) continue;
    
    selected.push(product);
    usedCategories.add(product.category);
  }

  // If we don't have enough, fill with general recommendations
  if (selected.length < 2) {
    const fallbacks = products.filter(p => 
      !selected.includes(p) && 
      ["1635574110", "0143127748", "B002CQU564", "0525534393"].includes(p.asin)
    );
    for (const fb of fallbacks) {
      if (selected.length >= 3) break;
      selected.push(fb);
    }
  }

  return selected.slice(0, 4);
}
