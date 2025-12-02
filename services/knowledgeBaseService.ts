import { SkinConditionInfo, KnowledgeBaseCategory } from '../constants/types';

// Your comprehensive knowledge base data
const KNOWLEDGE_BASE_DATA = {
  "version": "1.0.0",
  "updated_at": "2025-10-12T00:00:00-04:00",
  "source": "ClearCare mock KB",
  "categories": [
    {
      "id": "inflammatory_allergic",
      "name": "Inflammatory & Allergic Skin Disorders",
      "description": "Immune- or irritant-driven inflammation of the skin.",
      "common_conditions": [
        {
          "name": "Eczema",
          "aliases": ["Atopic Dermatitis"],
          "keywords": ["itchy", "dry patches", "flexural areas", "flare", "redness"]
        },
        {
          "name": "Contact Dermatitis",
          "aliases": ["Allergic Contact Dermatitis", "Irritant Contact Dermatitis"],
          "keywords": ["allergen", "irritant", "rash", "exposure", "nickel", "detergent"]
        },
        {
          "name": "Psoriasis",
          "aliases": ["Plaque Psoriasis"],
          "keywords": ["plaques", "silvery scale", "extensor surfaces"]
        },
        {
          "name": "Rosacea",
          "aliases": [],
          "keywords": ["facial redness", "flushing", "telangiectasia", "papules"]
        },
        {
          "name": "Hives",
          "aliases": ["Urticaria"],
          "keywords": ["wheals", "itchy welts", "allergy", "transient"]
        },
        {
          "name": "Dermatitis",
          "aliases": ["Eczematous Dermatitis"],
          "keywords": ["inflammation", "rash", "itch"]
        }
      ],
      "mechanism": "Immune overreaction, allergens, irritants, barrier dysfunction, stress.",
      "precautions": [
        "Use fragrance-free cleansers and moisturizers.",
        "Avoid known triggers (soaps, detergents, fabrics, allergens).",
        "Maintain good skin hydration.",
        "Use prescribed topical anti-inflammatories as directed.",
        "Manage stress and maintain regular sleep."
      ],
      "example": {
        "sample_condition": "Eczema",
        "image": {
          "url": "https://cdn-ai.onspace.ai/onspace/project/image/dJfvxJhmPqcCZSbgPhiNiG/download.jpg",
          "alt": "Eczema—dry, red, scaly patches on leg (clinical reference).",
          "source": "clinical_reference"
        }
      },
      "tags": ["inflammatory", "allergic", "immune", "eczema", "hives", "psoriasis"]
    },
    {
      "id": "infectious",
      "name": "Infectious Skin Conditions",
      "description": "Bacterial, fungal, viral, or parasitic infections of the skin/hair follicles.",
      "common_conditions": [
        {
          "name": "Acne",
          "aliases": ["Acne Vulgaris"],
          "keywords": ["pimples", "papules", "pustules", "comedones", "oily skin"]
        },
        {
          "name": "Folliculitis",
          "aliases": [],
          "keywords": ["infected hair follicle", "pustule", "shaving"]
        },
        {
          "name": "Impetigo",
          "aliases": [],
          "keywords": ["honey-colored crust", "contagious", "children"]
        },
        {
          "name": "Ringworm",
          "aliases": ["Tinea Corporis"],
          "keywords": ["annular", "scaly rim", "fungal"]
        },
        {
          "name": "Warts",
          "aliases": ["Verruca", "HPV Warts"],
          "keywords": ["raised bump", "rough", "viral"]
        },
        {
          "name": "Herpes Simplex",
          "aliases": ["Cold Sores", "HSV"],
          "keywords": ["vesicles", "lips", "tingling", "recurrent"]
        },
        {
          "name": "Scabies",
          "aliases": [],
          "keywords": ["burrows", "intense itch", "mites"]
        }
      ],
      "mechanism": "Pathogens (bacterial, fungal, viral, or parasitic) infect skin or follicles.",
      "precautions": [
        "Keep skin clean and dry; bathe after sweating.",
        "Avoid sharing towels, razors, and cosmetics.",
        "Disinfect gym/sports equipment and clothing.",
        "Seek early treatment to limit spread.",
        "Avoid touching or picking lesions."
      ],
      "example": {
        "sample_condition": "Acne",
        "image": {
          "url": "https://cdn-ai.onspace.ai/onspace/project/image/4KbS6bjedKVPvirPYCyFVR/acne.jpg",
          "alt": "Acne vulgaris—multiple inflamed papules and pustules on facial skin (clinical reference).",
          "source": "clinical_reference"
        }
      },
      "tags": ["infection", "bacterial", "fungal", "viral", "acne", "folliculitis"]
    },
    {
      "id": "sebaceous_glandular",
      "name": "Sebaceous & Glandular Disorders",
      "description": "Conditions from oil and sweat gland dysfunction, pore blockage, or cysts.",
      "common_conditions": [
        {
          "name": "Pimples",
          "aliases": ["Zits", "Papules"],
          "keywords": ["localized inflammation", "clogged pore", "sebum"]
        },
        {
          "name": "Cystic Acne",
          "aliases": ["Nodulocystic Acne"],
          "keywords": ["deep nodules", "scarring risk", "painful"]
        },
        {
          "name": "Milia",
          "aliases": [],
          "keywords": ["small white cysts", "keratin", "eyelids", "cheeks"]
        },
        {
          "name": "Hyperhidrosis",
          "aliases": [],
          "keywords": ["excessive sweating", "palms", "axillae"]
        },
        {
          "name": "Sebaceous Cysts",
          "aliases": ["Epidermoid Cysts"],
          "keywords": ["lump", "cheesy keratin", "punctum"]
        }
      ],
      "mechanism": "Excess sebum, keratin plugging, sweat overproduction, or cyst formation.",
      "precautions": [
        "Cleanse twice daily with gentle, non-comedogenic products.",
        "Avoid pore-clogging cosmetics; look for 'non-comedogenic' labels.",
        "Do not squeeze lesions; reduce friction from helmets/masks.",
        "Balanced diet and stress management.",
        "Seek prescription therapy for severe or scarring acne."
      ],
      "example": {
        "sample_condition": "Pimples",
        "image": {
          "url": "https://cdn-ai.onspace.ai/onspace/project/image/AxaG2ebRNEMLGt7aZKMh2W/pimple2.jpg",
          "alt": "Pimples—inflamed papules and pustules on facial skin (clinical reference).",
          "source": "clinical_reference"
        }
      },
      "tags": ["sebaceous", "oil glands", "pimples", "cysts", "sweat"]
    },
    {
      "id": "autoimmune_systemic",
      "name": "Autoimmune & Systemic Skin Disorders",
      "description": "Skin signs of systemic autoimmune disease or localized autoimmune attack.",
      "common_conditions": [
        {
          "name": "Lupus",
          "aliases": ["Systemic Lupus Erythematosus", "Cutaneous Lupus"],
          "keywords": ["malar rash", "photosensitivity", "autoimmune"]
        },
        {
          "name": "Vitiligo",
          "aliases": [],
          "keywords": ["depigmented patches", "autoimmune", "melanocyte loss"]
        },
        {
          "name": "Scleroderma",
          "aliases": [],
          "keywords": ["skin tightening", "fibrosis"]
        },
        {
          "name": "Dermatomyositis",
          "aliases": [],
          "keywords": ["heliotrope rash", "Gottron papules", "muscle weakness"]
        }
      ],
      "mechanism": "Autoantibodies and dysregulated immune pathways target skin/vasculature.",
      "precautions": [
        "Daily broad-spectrum sunscreen (SPF 30+) and sun avoidance.",
        "Follow immunomodulatory treatments as prescribed.",
        "Avoid harsh products; maintain gentle skincare.",
        "Balanced diet and stress management.",
        "Regular dermatology and primary care follow-up."
      ],
      "example": {
        "sample_condition": "Vitiligo",
        "image": {
          "url": "",
          "alt": "",
          "source": ""
        }
      },
      "tags": ["autoimmune", "vitiligo", "lupus", "photosensitive"]
    },
    {
      "id": "traumatic_physical",
      "name": "Traumatic / Physical Skin Conditions",
      "description": "Findings from mechanical injury, friction, heat, chemicals, or radiation.",
      "common_conditions": [
        {
          "name": "Bruises",
          "aliases": ["Contusions"],
          "keywords": ["purple-blue discoloration", "trauma", "ecchymosis"]
        },
        {
          "name": "Burns",
          "aliases": ["Thermal Burns", "Chemical Burns", "Sunburn"],
          "keywords": ["erythema", "blister", "pain", "depth"]
        },
        {
          "name": "Abrasions",
          "aliases": ["Scrapes"],
          "keywords": ["superficial injury", "friction"]
        },
        {
          "name": "Pressure Sores",
          "aliases": ["Decubitus Ulcers", "Bedsores"],
          "keywords": ["immobility", "ischemia", "staging"]
        },
        {
          "name": "Blisters",
          "aliases": [],
          "keywords": ["friction", "fluid-filled vesicle"]
        }
      ],
      "mechanism": "Tissue injury from force, heat, chemicals, UV, or prolonged pressure.",
      "precautions": [
        "Use protective clothing and SPF; avoid extreme heat/chemicals.",
        "Reposition frequently to avoid pressure injuries.",
        "Keep wounds clean, covered, and monitor for infection.",
        "Use appropriate first-aid (cool water for burns, not ice).",
        "Seek medical care for deep or extensive injuries."
      ],
      "example": {
        "sample_condition": "Bruises",
        "image": {
          "url": "",
          "alt": "",
          "source": ""
        }
      },
      "tags": ["injury", "burns", "bruises", "blister", "trauma"]
    },
    {
      "id": "pigmentation_growth",
      "name": "Pigmentation & Growth Disorders",
      "description": "Alterations in melanin or benign proliferations of skin tissue.",
      "common_conditions": [
        {
          "name": "Melasma",
          "aliases": ["Chloasma"],
          "keywords": ["hyperpigmentation", "cheeks", "hormonal", "sun"]
        },
        {
          "name": "Freckles",
          "aliases": ["Ephelides"],
          "keywords": ["sun-exposed", "small brown macules"]
        },
        {
          "name": "Moles",
          "aliases": ["Nevi"],
          "keywords": ["pigmented", "benign", "ABCDE monitoring"]
        },
        {
          "name": "Skin Tags",
          "aliases": ["Acrochordons"],
          "keywords": ["pedunculated", "benign", "friction areas"]
        },
        {
          "name": "Keratosis Pilaris",
          "aliases": [],
          "keywords": ["rough bumps", "keratin plugs", "upper arms"]
        },
        {
          "name": "Alopecia Areata",
          "aliases": [],
          "keywords": ["autoimmune hair loss", "patchy"]
        }
      ],
      "mechanism": "Melanin imbalance, UV exposure, hormonal influences, or benign cell growth.",
      "precautions": [
        "Daily sunscreen and protective clothing.",
        "Avoid tanning and excessive sun exposure.",
        "Use dermatologist-approved brightening agents (e.g., vitamin C, niacinamide).",
        "Monitor moles with ABCDE and seek evaluation for changes.",
        "Professional review for new or rapidly growing lesions."
      ],
      "example": {
        "sample_condition": "Melasma",
        "image": {
          "url": "",
          "alt": "",
          "source": ""
        }
      },
      "tags": ["pigmentation", "melasma", "moles", "benign growth"]
    }
  ],
  "disclaimer": "This dataset is for educational and product prototyping purposes only and is not a substitute for professional medical advice, diagnosis, or treatment."
};

export class KnowledgeBaseService {
  private static skinConditions: SkinConditionInfo[] = [];
  private static categories: KnowledgeBaseCategory[] = [];
  private static initialized = false;

  private static initialize() {
    if (this.initialized) return;

    this.categories = KNOWLEDGE_BASE_DATA.categories as KnowledgeBaseCategory[];
    this.skinConditions = this.generateConditionsFromCategories();
    this.initialized = true;
  }

  private static generateConditionsFromCategories(): SkinConditionInfo[] {
    const conditions: SkinConditionInfo[] = [];
    let conditionIdCounter = 1;

    this.categories.forEach(category => {
      category.common_conditions.forEach(condition => {
        const conditionInfo: SkinConditionInfo = {
          id: conditionIdCounter.toString(),
          name: condition.name,
          category: category.name,
          description: this.getConditionDescription(condition.name),
          symptoms: this.getConditionSymptoms(condition.name),
          causes: this.getConditionCauses(condition.name),
          treatments: this.getConditionTreatments(condition.name),
          prevention: category.precautions,
          severity: this.getConditionSeverity(condition.name),
          prevalence: this.getConditionPrevalence(condition.name),
          tags: [...condition.keywords, ...category.tags],
          whenToSeeDoctor: this.getWhenToSeeDoctor(condition.name),
          aliases: condition.aliases,
          keywords: condition.keywords,
          imageUrl: this.getConditionImageUrl(condition.name, category),
          imageAlt: this.getConditionImageAlt(condition.name)
        };
        conditions.push(conditionInfo);
        conditionIdCounter++;
      });
    });

    return conditions;
  }

  private static getConditionDescription(name: string): string {
    const descriptions: { [key: string]: string } = {
      'Eczema': 'A chronic inflammatory skin condition characterized by dry, itchy, red patches. Often appears in flexural areas like elbows and knees.',
      'Contact Dermatitis': 'An inflammatory reaction caused by direct contact with an irritating substance or allergen, resulting in red, itchy, and sometimes blistered skin.',
      'Psoriasis': 'An autoimmune condition causing rapid skin cell turnover, leading to thick, red patches with silvery scales, commonly on elbows, knees, and scalp.',
      'Rosacea': 'A chronic facial skin condition causing persistent redness, visible blood vessels, and sometimes papules, primarily affecting the central face.',
      'Hives': 'Raised, itchy welts on the skin that appear suddenly and can vary in size. Often caused by allergic reactions or stress.',
      'Dermatitis': 'General term for skin inflammation that can result from various causes including allergies, irritants, or genetic factors.',
      'Acne': 'A common skin condition occurring when hair follicles become clogged with oil and dead skin cells, leading to pimples, blackheads, and whiteheads.',
      'Folliculitis': 'Inflammation or infection of hair follicles, appearing as small red bumps or pustules around hair roots.',
      'Impetigo': 'A highly contagious bacterial skin infection causing red sores that quickly rupture and form honey-colored crusts.',
      'Ringworm': 'A fungal infection causing circular, scaly patches with raised borders and clear centers, despite its name having nothing to do with worms.',
      'Warts': 'Benign skin growths caused by human papillomavirus (HPV), appearing as rough, raised bumps on the skin.',
      'Herpes Simplex': 'A viral infection causing painful blisters or sores, commonly around the mouth (cold sores) or genital area.',
      'Scabies': 'A highly contagious skin infestation caused by microscopic mites that burrow into the skin, causing intense itching.',
      'Lupus': 'An autoimmune disease that can cause a distinctive butterfly-shaped rash across the cheeks and nose bridge.',
      'Vitiligo': 'An autoimmune condition causing loss of skin pigmentation, resulting in white patches on various parts of the body.',
      'Scleroderma': 'An autoimmune condition causing hardening and tightening of the skin and connective tissues.',
      'Dermatomyositis': 'An inflammatory disease causing muscle weakness and distinctive skin rashes.',
      'Bruises': 'Areas of skin discoloration caused by blood pooling under the skin following injury or trauma.',
      'Burns': 'Tissue damage caused by heat, chemicals, electricity, or radiation, varying in severity from first to third degree.',
      'Abrasions': 'Superficial wounds where the top layer of skin is scraped away, commonly called scrapes.',
      'Pressure Sores': 'Areas of damaged skin and tissue caused by prolonged pressure, commonly affecting bedridden patients.',
      'Blisters': 'Fluid-filled sacs that form between layers of skin, often caused by friction, burns, or infections.',
      'Melasma': 'Patches of brown or gray-brown discoloration on the face, often triggered by hormonal changes or sun exposure.',
      'Freckles': 'Small brown spots on sun-exposed areas, more common in fair-skinned individuals.',
      'Moles': 'Common skin growths made up of pigment-producing cells, usually brown or black in color.',
      'Skin Tags': 'Small, soft, benign growths that hang from the skin, commonly found in areas where skin rubs against skin.',
      'Keratosis Pilaris': 'A harmless condition causing small, rough bumps on the skin, often called "chicken skin."',
      'Alopecia Areata': 'An autoimmune condition causing patchy hair loss, usually starting with small, round bald spots.',
      'Pimples': 'Inflamed lesions caused by clogged pores and bacterial growth, appearing as red bumps often with pus.',
      'Cystic Acne': 'Severe form of acne causing deep, painful nodules and cysts that can lead to scarring.',
      'Milia': 'Small, white bumps caused by trapped keratin under the skin, commonly around the eyes.',
      'Hyperhidrosis': 'Excessive sweating that goes beyond normal body temperature regulation.',
      'Sebaceous Cysts': 'Benign lumps beneath the skin filled with keratin and other skin proteins.'
    };
    return descriptions[name] || `A skin condition affecting various aspects of skin health and appearance.`;
  }

  private static getConditionSymptoms(name: string): string[] {
    const symptoms: { [key: string]: string[] } = {
      'Eczema': ['Dry, scaly skin', 'Intense itching', 'Red or inflamed patches', 'Skin thickening from scratching', 'Small bumps that may leak fluid'],
      'Contact Dermatitis': ['Red, inflamed skin', 'Itching or burning', 'Swelling', 'Blisters or bumps', 'Dry, scaly, or cracked skin'],
      'Psoriasis': ['Thick, red patches with silvery scales', 'Dry, cracked skin that may bleed', 'Itching or burning', 'Thick, ridged nails', 'Swollen, stiff joints'],
      'Rosacea': ['Persistent facial redness', 'Visible blood vessels', 'Bumps and pimples', 'Eye irritation', 'Enlarged nose (in severe cases)'],
      'Hives': ['Raised, itchy welts', 'Red or pale bumps', 'Blanching when pressed', 'Burning or stinging sensation', 'Swelling of lips, eyelids, or throat'],
      'Acne': ['Blackheads and whiteheads', 'Pimples with pus', 'Large, painful lumps under skin', 'Red, inflamed bumps', 'Scarring from severe lesions'],
      'Melasma': ['Brown or gray-brown patches', 'Symmetrical facial discoloration', 'Patches that darken with sun exposure', 'Usually painless', 'More noticeable during pregnancy'],
      'Vitiligo': ['White patches of skin', 'Premature graying of hair', 'Loss of color in mucous membranes', 'Changes in eye color', 'Hearing loss (rare)'],
      'Bruises': ['Purple, blue, or black discoloration', 'Tenderness to touch', 'Swelling', 'Pain that gradually subsides', 'Color changes as healing progresses'],
      'Burns': ['Red, painful skin', 'Blisters', 'Swelling', 'White or charred skin (severe burns)', 'Shock (in severe cases)']
    };
    return symptoms[name] || ['Varies depending on individual case', 'May include changes in skin appearance', 'Possible itching or discomfort'];
  }

  private static getConditionCauses(name: string): string[] {
    const causes: { [key: string]: string[] } = {
      'Eczema': ['Genetic predisposition', 'Immune system dysfunction', 'Environmental triggers', 'Dry skin', 'Stress', 'Allergens'],
      'Contact Dermatitis': ['Direct contact with irritants', 'Allergic reactions', 'Chemicals in soaps or cosmetics', 'Plants like poison ivy', 'Metals like nickel'],
      'Psoriasis': ['Autoimmune response', 'Genetic factors', 'Stress', 'Infections', 'Certain medications', 'Injury to skin'],
      'Rosacea': ['Unknown exact cause', 'Genetic predisposition', 'Environmental triggers', 'Blood vessel abnormalities', 'Demodex mites', 'H. pylori bacteria'],
      'Hives': ['Allergic reactions to food or medication', 'Insect stings', 'Infections', 'Stress', 'Temperature changes', 'Autoimmune conditions'],
      'Acne': ['Clogged hair follicles', 'Excess oil production', 'Bacteria (P. acnes)', 'Hormonal changes', 'Genetics', 'Certain medications'],
      'Melasma': ['Hormonal changes (pregnancy, birth control)', 'Sun exposure', 'Genetic predisposition', 'Certain cosmetics', 'Hormone replacement therapy'],
      'Vitiligo': ['Autoimmune destruction of melanocytes', 'Genetic factors', 'Neurogenic factors', 'Oxidative stress', 'Viral infections (potential trigger)'],
      'Bruises': ['Trauma or injury', 'Blood vessel fragility', 'Blood clotting disorders', 'Certain medications', 'Aging', 'Excessive exercise'],
      'Burns': ['Heat exposure', 'Chemical contact', 'Electrical current', 'Radiation', 'Friction', 'Cold temperatures (frostbite)']
    };
    return causes[name] || ['Multiple factors may contribute', 'Genetic predisposition', 'Environmental triggers'];
  }

  private static getConditionTreatments(name: string): string[] {
    const treatments: { [key: string]: string[] } = {
      'Eczema': ['Moisturizers and emollients', 'Topical corticosteroids', 'Calcineurin inhibitors', 'Antihistamines', 'Phototherapy', 'Avoiding triggers'],
      'Contact Dermatitis': ['Avoiding the trigger substance', 'Topical corticosteroids', 'Oral corticosteroids (severe cases)', 'Cool compresses', 'Moisturizers'],
      'Psoriasis': ['Topical treatments (corticosteroids, vitamin D analogs)', 'Phototherapy', 'Systemic medications', 'Biologic drugs', 'Moisturizers'],
      'Rosacea': ['Topical antibiotics', 'Oral antibiotics', 'Topical anti-inflammatories', 'Laser therapy', 'Avoiding triggers', 'Gentle skincare'],
      'Hives': ['Antihistamines', 'Avoiding known triggers', 'Cool compresses', 'Topical anti-itch creams', 'Corticosteroids (severe cases)', 'Epinephrine (severe allergic reactions)'],
      'Acne': ['Topical retinoids', 'Benzoyl peroxide', 'Topical or oral antibiotics', 'Hormonal therapy', 'Isotretinoin (severe cases)', 'Chemical peels'],
      'Melasma': ['Topical lightening agents (hydroquinone)', 'Tretinoin', 'Chemical peels', 'Laser therapy', 'Broad-spectrum sunscreen', 'Avoiding triggers'],
      'Vitiligo': ['Topical corticosteroids', 'Calcineurin inhibitors', 'Phototherapy', 'Excimer laser', 'Surgical treatments', 'Cosmetic camouflage'],
      'Bruises': ['Rest and elevation', 'Ice application', 'Compression', 'Pain relievers', 'Topical arnica', 'Time for natural healing'],
      'Burns': ['Cool water irrigation', 'Pain management', 'Antibiotic ointments', 'Sterile dressings', 'Skin grafts (severe burns)', 'Burn center care']
    };
    return treatments[name] || ['Consult healthcare provider for appropriate treatment', 'May require prescription medications', 'Treatment varies by severity'];
  }

  private static getConditionSeverity(name: string): 'mild' | 'moderate' | 'severe' {
    const severityMap: { [key: string]: 'mild' | 'moderate' | 'severe' } = {
      'Eczema': 'moderate',
      'Contact Dermatitis': 'mild',
      'Psoriasis': 'severe',
      'Rosacea': 'moderate',
      'Hives': 'moderate',
      'Dermatitis': 'mild',
      'Acne': 'moderate',
      'Folliculitis': 'mild',
      'Impetigo': 'moderate',
      'Ringworm': 'mild',
      'Warts': 'mild',
      'Herpes Simplex': 'moderate',
      'Scabies': 'moderate',
      'Lupus': 'severe',
      'Vitiligo': 'moderate',
      'Scleroderma': 'severe',
      'Dermatomyositis': 'severe',
      'Bruises': 'mild',
      'Burns': 'moderate',
      'Abrasions': 'mild',
      'Pressure Sores': 'severe',
      'Blisters': 'mild',
      'Melasma': 'mild',
      'Freckles': 'mild',
      'Moles': 'mild',
      'Skin Tags': 'mild',
      'Keratosis Pilaris': 'mild',
      'Alopecia Areata': 'moderate',
      'Pimples': 'mild',
      'Cystic Acne': 'severe',
      'Milia': 'mild',
      'Hyperhidrosis': 'moderate',
      'Sebaceous Cysts': 'mild'
    };
    return severityMap[name] || 'moderate';
  }

  private static getConditionPrevalence(name: string): string {
    const prevalenceMap: { [key: string]: string } = {
      'Eczema': '10-20% of children, 3% of adults',
      'Contact Dermatitis': '15-20% of population',
      'Psoriasis': '2-3% of global population',
      'Rosacea': '5-10% of adults',
      'Hives': '15-25% of people experience at least once',
      'Acne': '85% of people aged 12-24',
      'Melasma': '10-15% of pregnant women',
      'Vitiligo': '0.5-2% of population',
      'Bruises': 'Nearly everyone experiences occasionally',
      'Burns': 'Common injury, varies by severity'
    };
    return prevalenceMap[name] || 'Varies by population and age group';
  }

  private static getWhenToSeeDoctor(name: string): string[] {
    return [
      'Symptoms persist or worsen despite home treatment',
      'Signs of infection (increased redness, warmth, pus, fever)',
      'Severe pain or discomfort',
      'Condition affects daily activities or quality of life',
      'Unusual changes in appearance or characteristics',
      'If you have concerns about proper diagnosis'
    ];
  }

  private static getConditionImageUrl(name: string, category: KnowledgeBaseCategory): string {
    // Provide specific URLs for conditions with medical reference images
    const imageMap: { [key: string]: string } = {
      'Eczema': 'https://cdn-ai.onspace.ai/onspace/project/image/dJfvxJhmPqcCZSbgPhiNiG/download.jpg',
      'Acne': 'https://cdn-ai.onspace.ai/onspace/project/image/4KbS6bjedKVPvirPYCyFVR/acne.jpg',
      'Pimples': 'https://cdn-ai.onspace.ai/onspace/project/image/AxaG2ebRNEMLGt7aZKMh2W/pimple2.jpg'
    };
    
    return imageMap[name] || '';
  }

  private static getConditionImageAlt(name: string): string {
    return `Clinical reference image showing typical presentation of ${name}`;
  }

  // Public API methods
  static getAllConditions(): SkinConditionInfo[] {
    this.initialize();
    return this.skinConditions;
  }

  static searchConditions(query: string, conditionsSubset?: SkinConditionInfo[]): SkinConditionInfo[] {
    this.initialize();
    
    const searchPool = conditionsSubset || this.skinConditions;
    
    if (!query.trim()) {
      return searchPool;
    }

    const lowercaseQuery = query.toLowerCase();
    return searchPool.filter(condition => 
      condition.name.toLowerCase().includes(lowercaseQuery) ||
      condition.category.toLowerCase().includes(lowercaseQuery) ||
      condition.description.toLowerCase().includes(lowercaseQuery) ||
      condition.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      condition.symptoms.some(symptom => symptom.toLowerCase().includes(lowercaseQuery)) ||
      (condition.aliases && condition.aliases.some(alias => alias.toLowerCase().includes(lowercaseQuery))) ||
      (condition.keywords && condition.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery)))
    );
  }

  static getConditionById(id: string): SkinConditionInfo | null {
    this.initialize();
    return this.skinConditions.find(condition => condition.id === id) || null;
  }

  static getConditionsByCategory(category: string): SkinConditionInfo[] {
    this.initialize();
    return this.skinConditions.filter(condition => condition.category === category);
  }

  static getCategories(): string[] {
    this.initialize();
    const categories = new Set(this.skinConditions.map(condition => condition.category));
    return Array.from(categories);
  }

  static getCategoriesDetailed(): KnowledgeBaseCategory[] {
    this.initialize();
    return this.categories;
  }

  static getPopularConditions(): SkinConditionInfo[] {
    this.initialize();
    // Return most commonly searched conditions
    const popularNames = ['Acne', 'Eczema', 'Rosacea', 'Melasma', 'Psoriasis'];
    return this.skinConditions.filter(condition => 
      popularNames.includes(condition.name)
    ).slice(0, 5);
  }

  static getDisclaimer(): string {
    return KNOWLEDGE_BASE_DATA.disclaimer;
  }
}