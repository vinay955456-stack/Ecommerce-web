// Atelier Nord - Contemporary Clothing Store Catalog Data
// Pure JavaScript (ES Module)

export const PRODUCTS = [
  {
    id: 'prod-01',
    name: 'Heavyweight Washed French Terry Hoodie',
    slug: 'heavyweight-washed-french-terry-hoodie',
    category: 'Outerwear',
    subCategory: 'Hoodies & Sweatshirts',
    price: 3899,
    originalPrice: 4999,
    rating: 4.9,
    reviewsCount: 128,
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 14,
    description: 'Constructed from custom-developed 480 GSM organic French terry cotton with a signature vintage garment-dye wash. Features dropped shoulders, double-layered hood without drawstrings for a clean profile, and heavyweight ribbed hems.',
    fabricDetails: [
      '100% GOTS-Certified Combed Organic Cotton',
      'Heavyweight 480 GSM diagonal loopback French terry',
      'Pre-shrunk to retain structural silhouette',
      'Garment dyed with low-impact eco dyes'
    ],
    careInstructions: [
      'Machine wash cold inside out on gentle cycle',
      'Lay flat to dry; do not tumble dry',
      'Cool iron if necessary',
      'Do not bleach'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Obsidian Black', hex: '#1C1917', matchKey: 'black' },
      { name: 'Washed Charcoal', hex: '#3F3F46', matchKey: 'charcoal' },
      { name: 'Raw Bone', hex: '#E7E5E4', matchKey: 'white', border: true }
    ],
    images: [
      '/src/assets/images/product_luxury_hoodie_1794503147589.jpg',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-01',
        userName: 'Aarav Mehta',
        rating: 5,
        date: '2026-10-24',
        comment: 'Hands down the best quality hoodie in my wardrobe. The 480 GSM fabric has substantial drape without feeling stiff. Boxy fit is perfection.',
        verified: true,
        fitFeedback: 'True to size'
      },
      {
        id: 'rev-02',
        userName: 'Kavita Iyer',
        rating: 5,
        date: '2026-10-18',
        comment: 'The garment wash gives it an understated vintage character. Wears comfortably even with a tee underneath.',
        verified: true,
        fitFeedback: 'True to size'
      }
    ],
    hsnCode: '610220'
  },
  {
    id: 'prod-02',
    name: 'Double-Breasted Wool Blend Trench Overcoat',
    slug: 'double-breasted-wool-blend-trench-overcoat',
    category: 'Outerwear',
    subCategory: 'Coats & Trench',
    price: 9499,
    originalPrice: 11999,
    rating: 4.95,
    reviewsCount: 84,
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 6,
    description: 'An architectural double-breasted trench silhouette crafted in rich camel wool-cashmere blend. Features wide notched lapels, horn-effect buttons, storm flap detailing, and a structured matching belt with buckle.',
    fabricDetails: [
      '75% Virgin Wool, 20% Recycled Polyamide, 5% Cashmere',
      'Viscose cupro silky interior lining',
      'Water and wind repellent fabric finish',
      'Real horn buttons with engraved underside'
    ],
    careInstructions: [
      'Dry clean only by leather & wool specialist',
      'Store on wide-shoulder wooden coat hanger',
      'Steam gently; never direct iron on wool'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel Tan', hex: '#B87B44', matchKey: 'camel' },
      { name: 'Midnight Navy', hex: '#1E293B', matchKey: 'navy' },
      { name: 'Deep Espresso', hex: '#3E2723', matchKey: 'charcoal' }
    ],
    images: [
      '/src/assets/images/product_wool_overcoat_1794503147460.jpg',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-03',
        userName: 'Rohan Deshmukh',
        rating: 5,
        date: '2026-11-02',
        comment: 'Tailoring is sharp and luxurious. Looks like a bespoke European trench coat. Worn it to several formal galas and received endless compliments.',
        verified: true,
        fitFeedback: 'True to size'
      }
    ],
    hsnCode: '620112'
  },
  {
    id: 'prod-03',
    name: 'Raw Red-Line Selvedge Denim Relaxed Trousers',
    slug: 'raw-red-line-selvedge-denim-trousers',
    category: 'Essentials',
    subCategory: 'Denim & Trousers',
    price: 4999,
    originalPrice: 6299,
    rating: 4.88,
    reviewsCount: 96,
    isNew: false,
    isFeatured: true,
    inStock: true,
    stockCount: 18,
    description: 'Woven on vintage shuttle looms using 14.5 oz Japanese unwashed raw indigo cotton. Finished with authentic red-line selvedge ticker along the outseam, copper rivets, and a mid-rise relaxed straight leg cut.',
    fabricDetails: [
      '14.5 oz 100% Ring-Spun Cotton Selvedge Denim',
      'Traditional rope-dyed pure indigo',
      'Full grain vegetable-tanned leather patch',
      'Solid copper hardware and chain-stitched hem'
    ],
    careInstructions: [
      'Wear frequently for 6 months before first soak for unique honeycombs',
      'Wash inside out in cold water with mild detergent',
      'Hang dry only in shade'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Raw Deep Indigo', hex: '#1A237E', matchKey: 'indigo' },
      { name: 'Cast Black Selvedge', hex: '#212121', matchKey: 'black' }
    ],
    images: [
      '/src/assets/images/product_selvedge_denim_1794503147242.jpg',
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-04',
        userName: 'Vikram Sengupta',
        rating: 5,
        date: '2026-10-30',
        comment: 'Authentic stiff raw denim that molds to your body. The red selvedge line when cuffed looks phenomenal with boots.',
        verified: true,
        fitFeedback: 'Runs small'
      }
    ],
    hsnCode: '620342'
  },
  {
    id: 'prod-04',
    name: 'Heavyweight Relaxed Boxy Crewneck Tee',
    slug: 'heavyweight-relaxed-boxy-crewneck-tee',
    category: 'Essentials',
    subCategory: 'T-Shirts & Tops',
    price: 1899,
    originalPrice: 2499,
    rating: 4.85,
    reviewsCount: 210,
    isNew: false,
    isFeatured: false,
    inStock: true,
    stockCount: 42,
    description: 'The foundation of the modern capsule wardrobe. Cut from a dense 280 GSM single jersey cotton with a structured neck ribbing that never sags after washing. Relaxed shoulders with clean drape.',
    fabricDetails: [
      '280 GSM 100% Long-Staple Organic Cotton',
      '1x1 Bound ribbed collar with reinforced tape',
      'Silicon softened handfeel',
      'Blind stitched hems for a clean tailored finish'
    ],
    careInstructions: [
      'Machine wash warm inside out',
      'Tumble dry low or air dry',
      'Warm iron'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Chalk White', hex: '#F8FAFC', matchKey: 'white', border: true },
      { name: 'Onyx Black', hex: '#0F172A', matchKey: 'black' },
      { name: 'Sage Olive', hex: '#4B553D', matchKey: 'olive' },
      { name: 'Terracotta', hex: '#9C4131', matchKey: 'terracotta' }
    ],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-05',
        userName: 'Zoya Khan',
        rating: 5,
        date: '2026-10-27',
        comment: 'Substantial thickness without feeling hot. Does not cling at all and the collar stays crisp even after 8 washes.',
        verified: true,
        fitFeedback: 'True to size'
      }
    ],
    hsnCode: '610910'
  },
  {
    id: 'prod-05',
    name: 'Fine Gauge Merino Wool Ribbed Turtleneck',
    slug: 'fine-gauge-merino-wool-ribbed-turtleneck',
    category: 'Knitwear',
    subCategory: 'Sweaters & Cardigans',
    price: 4299,
    originalPrice: 5499,
    rating: 4.92,
    reviewsCount: 73,
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 9,
    description: 'Spun from ultra-fine 19.5-micron Australian Merino wool. Breathable, naturally temperature regulating, and soft against bare skin without itchiness. Features a ribbed roll neck and raglan sleeve construction.',
    fabricDetails: [
      '100% Extra-Fine Merino Wool (19.5 micron)',
      '14-gauge fully fashioned knitting technique',
      'Natural moisture-wicking and antimicrobial fiber',
      'Oeko-Tex Standard 100 certified non-toxic'
    ],
    careInstructions: [
      'Hand wash cold using wool shampoo',
      'Do not wring; roll in towel to extract moisture',
      'Dry flat away from direct sunlight'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Alabaster Cream', hex: '#F5F5F0', matchKey: 'white', border: true },
      { name: 'Slate Anthracite', hex: '#334155', matchKey: 'charcoal' },
      { name: 'Forest Moss', hex: '#2D3B36', matchKey: 'olive' }
    ],
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-06',
        userName: 'Tanya Roy',
        rating: 5,
        date: '2026-11-05',
        comment: 'Silky smooth wool against the skin. Worn under an oversized blazer for a chic tailored silhouette.',
        verified: true,
        fitFeedback: 'True to size'
      }
    ],
    hsnCode: '611011'
  },
  {
    id: 'prod-06',
    name: 'Pleated Wide-Leg Tailored Wool Trousers',
    slug: 'pleated-wide-leg-tailored-wool-trousers',
    category: 'Men',
    subCategory: 'Trousers & Pants',
    price: 5299,
    originalPrice: 6999,
    rating: 4.89,
    reviewsCount: 52,
    isNew: false,
    isFeatured: true,
    inStock: true,
    stockCount: 11,
    description: 'Relaxed elegance captured in fluid tropical wool. Double reverse front pleats create room across the thigh while cascading straight down to a generous break over sneakers or loafers.',
    fabricDetails: [
      '60% Wool, 38% Polyester, 2% Elastane for slight recovery',
      'Extended waistband tab with double clasp closure',
      'Curved slash front pockets and jetted back pockets',
      'Internal curtain waistband construction'
    ],
    careInstructions: [
      'Dry clean recommended',
      'Press with iron on wool setting with pressing cloth'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Slate Grey', hex: '#64748B', matchKey: 'charcoal' },
      { name: 'Ebony', hex: '#18181B', matchKey: 'black' },
      { name: 'Dark Taupe', hex: '#524B46', matchKey: 'charcoal' }
    ],
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-07',
        userName: 'Arjun Nambiar',
        rating: 5,
        date: '2026-10-15',
        comment: 'Drapes effortlessly. The wide leg silhouette looks very contemporary and works equally well casually with a t-shirt or dressed up.',
        verified: true,
        fitFeedback: 'True to size'
      }
    ],
    hsnCode: '620341'
  },
  {
    id: 'prod-07',
    name: 'Relaxed Crisp Poplin Button-Down Overshirt',
    slug: 'relaxed-crisp-poplin-button-down-overshirt',
    category: 'Women',
    subCategory: 'Shirts & Blouses',
    price: 3299,
    originalPrice: 4199,
    rating: 4.81,
    reviewsCount: 64,
    isNew: false,
    isFeatured: false,
    inStock: true,
    stockCount: 22,
    description: 'An architectural take on the classic menswear oxford shirt, proportioned for an effortless dropped silhouette. Crafted from crisp 100% Egyptian cotton poplin with mother-of-pearl buttons.',
    fabricDetails: [
      '100% Giza Egyptian Cotton Poplin',
      'Mother-of-pearl cross-stitched buttons',
      'Curved high-low hem with side gussets',
      'Twin pleats at back yoke for mobility'
    ],
    careInstructions: [
      'Machine wash gentle cold',
      'Hang dry while damp for easy ironing',
      'Steam or medium iron'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sky Stripe Blue', hex: '#93C5FD', matchKey: 'indigo' },
      { name: 'Crisp Optical White', hex: '#FFFFFF', matchKey: 'white', border: true },
      { name: 'Pale Sage', hex: '#A3B19B', matchKey: 'olive' }
    ],
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-08',
        userName: 'Ananya Singhania',
        rating: 5,
        date: '2026-11-01',
        comment: 'The cotton has a gorgeous papery crispness that holds shape all day. Beautiful high-low hemline.',
        verified: true,
        fitFeedback: 'Runs large'
      }
    ],
    hsnCode: '620630'
  },
  {
    id: 'prod-08',
    name: 'Brushed Mongolian Cashmere Crewneck',
    slug: 'brushed-mongolian-cashmere-crewneck',
    category: 'Knitwear',
    subCategory: 'Sweaters & Cardigans',
    price: 7999,
    originalPrice: 9999,
    rating: 4.97,
    reviewsCount: 41,
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 5,
    description: 'Sourced from the high plateaus of Inner Mongolia. Spun from 2-ply 100% Grade-A cashmere yarn for cloud-like softness that resists pilling. A lifetime investment piece with seamless tubular construction.',
    fabricDetails: [
      '100% Grade-A Inner Mongolian Cashmere',
      '2-ply 26Nm yarn count for thermal resilience',
      'Seamless whole-garment 3D knitting',
      'Sustainably harvested during spring molting season'
    ],
    careInstructions: [
      'Specialist dry clean or hand wash with cashmere shampoo',
      'Never twist or wring',
      'Use cedar blocks for seasonal storage'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal Heather', hex: '#D6C7B2', matchKey: 'camel' },
      { name: 'Muted Sky Blue', hex: '#7DD3FC', matchKey: 'indigo' },
      { name: 'Carbon Black', hex: '#171717', matchKey: 'black' }
    ],
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-09',
        userName: 'Siddharth Rao',
        rating: 5,
        date: '2026-10-21',
        comment: 'Pure luxury. Incredibly light yet remarkably warm. The oatmeal heather color is timeless.',
        verified: true,
        fitFeedback: 'True to size'
      }
    ],
    hsnCode: '611012'
  },
  {
    id: 'prod-09',
    name: 'Technical Water-Repellent Cargo Pants',
    slug: 'technical-water-repellent-cargo-pants',
    category: 'Men',
    subCategory: 'Trousers & Pants',
    price: 4599,
    originalPrice: 5699,
    rating: 4.79,
    reviewsCount: 88,
    isNew: false,
    isFeatured: false,
    inStock: true,
    stockCount: 16,
    description: 'Urban technical utility meets refined tailoring. Made from matte recycled nylon with a PFC-free DWR coating. Features low-profile bellow cargo pockets with magnetic closures and an adjustable bungee cord hem.',
    fabricDetails: [
      '92% Recycled Ripstop Nylon, 8% Spandex',
      'Eco-friendly DWR water repellent coating',
      'Fidlock-compatible magnetic pocket flaps',
      'Articulated knee darts for unrestricted range of motion'
    ],
    careInstructions: [
      'Machine wash cold delicate',
      'Do not use fabric softeners as they degrade DWR',
      'Tumble dry low to reactivate water resistance'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Tarmac Slate', hex: '#334155', matchKey: 'charcoal' },
      { name: 'Military Olive', hex: '#3F4839', matchKey: 'olive' },
      { name: 'Dark Khaki', hex: '#78716C', matchKey: 'camel' }
    ],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-10',
        userName: 'Karan Bedi',
        rating: 5,
        date: '2026-10-12',
        comment: 'Water literally beads off these pants. Pockets lay flat when empty so they do not look bulky.',
        verified: true,
        fitFeedback: 'True to size'
      }
    ],
    hsnCode: '620343'
  },
  {
    id: 'prod-10',
    name: 'Unstructured Pure Linen Resort Blazer',
    slug: 'unstructured-pure-linen-resort-blazer',
    category: 'Unisex',
    subCategory: 'Blazers & Jackets',
    price: 6499,
    originalPrice: 8299,
    rating: 4.84,
    reviewsCount: 47,
    isNew: true,
    isFeatured: false,
    inStock: true,
    stockCount: 8,
    description: 'Designed for balmy tropical evenings and destination getaways. An unlined, unstructured blazer tailored from heavy Belgian flax linen that softens with every wear while maintaining crisp shoulders.',
    fabricDetails: [
      '100% Belgian Flax Linen',
      'Unlined construction with French seams inside',
      'Patch waist pockets and welt chest pocket',
      'Single vent back for relaxed movement'
    ],
    careInstructions: [
      'Professional dry clean recommended',
      'Embrace the natural linen crinkle; iron lightly while damp if desired'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Natural Ecru', hex: '#EDE8DF', matchKey: 'white', border: true },
      { name: 'Washed Indigo', hex: '#283E56', matchKey: 'indigo' },
      { name: 'Warm Terracotta', hex: '#A0522D', matchKey: 'terracotta' }
    ],
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-11',
        userName: 'Meera Sen',
        rating: 5,
        date: '2026-10-29',
        comment: 'The cut is relaxed and breezy. Perfect for summer weddings and resort dinners.',
        verified: true,
        fitFeedback: 'True to size'
      }
    ],
    hsnCode: '620439'
  },
  {
    id: 'prod-11',
    name: 'Heavy Pique Cotton Mercerized Polo',
    slug: 'heavy-pique-cotton-mercerized-polo',
    category: 'Essentials',
    subCategory: 'Polos & Tops',
    price: 2499,
    originalPrice: 3199,
    rating: 4.77,
    reviewsCount: 65,
    isNew: false,
    isFeatured: false,
    inStock: true,
    stockCount: 20,
    description: 'Elevated sport-luxe essential. Knitted from double-mercerized Egyptian cotton yarn for subtle luster, deep color retention, and smooth texture. Features an open Johnny collar without buttons for modern ease.',
    fabricDetails: [
      '100% Double-Mercerized Pique Cotton (260 GSM)',
      'Knitted spread open collar that maintains shape',
      'Ribbed sleeve cuffs',
      'Side slit vents with internal herringbone tape'
    ],
    careInstructions: [
      'Cold gentle machine wash',
      'Do not bleach or tumble dry',
      'Reshape while wet and dry flat'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'French Navy', hex: '#1B2A4A', matchKey: 'navy' },
      { name: 'Vintage Olive', hex: '#4A5B44', matchKey: 'olive' },
      { name: 'Pearl White', hex: '#FDFBF7', matchKey: 'white', border: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1625910513413-5a04535cb58e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-12',
        userName: 'Pranav Joshi',
        rating: 5,
        date: '2026-10-10',
        comment: 'The Johnny collar makes it so sleek. Much more premium than standard golf polos.',
        verified: true,
        fitFeedback: 'True to size'
      }
    ],
    hsnCode: '610510'
  },
  {
    id: 'prod-12',
    name: 'Washed Heavy Duck Canvas Chore Jacket',
    slug: 'washed-heavy-duck-canvas-chore-jacket',
    category: 'Outerwear',
    subCategory: 'Jackets & Coats',
    price: 5799,
    originalPrice: 7299,
    rating: 4.91,
    reviewsCount: 78,
    isNew: false,
    isFeatured: true,
    inStock: true,
    stockCount: 7,
    description: 'A utilitarian classic reimagined through Japanese workwear sensibility. 12 oz heavy duck canvas pre-softened with an enzyme wash, complemented by an authentic corduroy collar and antiqued brass hardware.',
    fabricDetails: [
      '12 oz 100% Cotton Duck Canvas',
      'Contrasting 8-wale cotton corduroy collar',
      'Antiqued matte brass rivet buttons',
      'Reinforced triple-needle flat-felled seam construction'
    ],
    careInstructions: [
      'Machine wash cold with like colors',
      'Hang dry in shade to develop patina',
      'Iron on high cotton setting'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Desert Ochre', hex: '#C28245', matchKey: 'camel' },
      { name: 'Cast Iron Black', hex: '#262626', matchKey: 'black' },
      { name: 'Washed Spruce', hex: '#2C4038', matchKey: 'olive' }
    ],
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-13',
        userName: 'Varun Grover',
        rating: 5,
        date: '2026-10-19',
        comment: 'Tough as nails yet broke in pleasantly on first day. The corduroy collar is a brilliant touch.',
        verified: true,
        fitFeedback: 'True to size'
      }
    ],
    hsnCode: '620190'
  }
];

export const VALID_COUPONS = [
  {
    code: 'STYLE20',
    discountType: 'percent',
    value: 20,
    minOrder: 3000,
    description: '20% off on orders above ₹3,000'
  },
  {
    code: 'WELCOME10',
    discountType: 'percent',
    value: 10,
    minOrder: 1500,
    description: '10% off for first-time shoppers'
  },
  {
    code: 'FLASHSALE',
    discountType: 'fixed',
    value: 500,
    minOrder: 2500,
    description: 'Flat ₹500 off on orders above ₹2,500'
  }
];

export const PINCODE_DATABASE = {
  '110001': { city: 'New Delhi', state: 'Delhi', days: 2 },
  '400001': { city: 'Mumbai', state: 'Maharashtra', days: 2 },
  '560001': { city: 'Bengaluru', state: 'Karnataka', days: 2 },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', days: 3 },
  '700001': { city: 'Kolkata', state: 'West Bengal', days: 3 },
  '500001': { city: 'Hyderabad', state: 'Telangana', days: 2 },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', days: 3 },
  '411001': { city: 'Pune', state: 'Maharashtra', days: 2 },
  '302001': { city: 'Jaipur', state: 'Rajasthan', days: 3 },
  '682001': { city: 'Kochi', state: 'Kerala', days: 3 }
};

export const DEMO_PROFILES = {
  shopper: {
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '9876543210',
    tier: 'Standard Patron',
    pincode: '110001',
    address: 'B-42, Connaught Place, Inner Circle',
    city: 'New Delhi',
    state: 'Delhi'
  },
  vip: {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9823456789',
    tier: 'Atelier Black VIP',
    pincode: '400001',
    address: 'Flat 1204, Sea Breeze Towers, Nariman Point',
    city: 'Mumbai',
    state: 'Maharashtra'
  }
};
