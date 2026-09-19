// Brand facts sourced from bmpclothings.com (Sept 2026). Edit here, not in components.
export const site = {
  name: 'BMP Clothings',
  url: 'https://zaddywebbuilds.github.io/bmpclothing',
  location: 'Lagos, Nigeria',
  currency: 'NGN',

  // Set to a message you can verify (e.g. a delivery promise) or null to hide the bar.
  announcement: 'New pieces in store  ·  Order easily on WhatsApp',

  whatsapp: {
    number: '2349019624520',
    display: '0901 962 4520',
  },
  facebook: 'https://www.facebook.com/share/1ExUoTYAtz/',
  // Leave null until verified; the UI hides empty channels.
  instagram: 'https://www.instagram.com/bmp_clothings/',
  tiktok: 'https://www.tiktok.com/@bmp_clothings',
  handle: '@bmp_clothings',
  email: null,

  // Base path without extension; expects .mp4 + .webm and a -poster image beside it. null shows the poster image only.
  heroVideo: 'assets/bmp/video/bmp-hero',

  // Optional form endpoint (e.g. Formspree). When null, forms hand off to WhatsApp instead.
  newsletterEndpoint: null,
  contactEndpoint: null,

  // Real recent orders only (from WhatsApp/checkout). Shown as the "recent order" popup.
  // Example: { name: 'Chidinma', city: 'Lekki, Lagos', slug: 'bmp-lg-10', when: '2026-09-18T14:00:00' }
  // While empty, the popup rotates genuine new-arrival notices instead.
  recentOrders: [],

  taglines: {
    quality: ['Quality You Can See.', 'Style You Can Feel.'],
    signature: ['If you see BMP Woman,', 'You go know.'],
    original: 'Shop stylish quality, elevate your class.',
  },
}

export const socials = () =>
  [['Instagram', site.instagram], ['TikTok', site.tiktok], ['Facebook', site.facebook]].filter(([, url]) => url)

export const waLink = (text) =>
  `https://wa.me/${site.whatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const testimonials = [
  {
    name: 'Jane',
    location: 'Lagos, Nigeria',
    quote: 'Delivered quality and I felt so comfortable and beautiful on my dress.',
    tag: 'Just BMP',
    image: 'customers/jane-lagos',
    imageAlt: 'Jane, a BMP customer in Lagos, wearing her BMP dress',
  },
]

export const about = [
  'Welcome to BMP Clothings, your destination for carefully selected fashion pieces designed to complement your style.',
  'We believe fashion should be beautiful, practical and accessible. Our collections are selected with attention to quality, detail and the needs of our customers.',
  'Whether you are shopping for an everyday piece, a special occasion or a thoughtful gift, our goal is to give you a pleasant and reliable shopping experience.',
]

export const philosophy =
  'For us at BMP, fashion is a form of self-expression. Every piece is chosen with care, so you can move through your day with confidence, comfort and a touch of glamour.'

export const pillars = [
  { title: 'Premium Quality', body: 'Carefully selected clothing and accessories made to give you quality you can trust.' },
  { title: 'Modern Style', body: 'Fashionable pieces that help you express your personality and elevate your everyday look.' },
  { title: 'Reliable Delivery', body: 'Orders are handled carefully and delivered safely to your doorstep.' },
  { title: 'Secure Shopping', body: 'Shop with confidence and a smooth, simple ordering experience.' },
]

export const shipping = [
  { title: 'Order processing', body: 'Orders are processed after payment has been confirmed. You will be contacted if additional information is required before your order can be dispatched.' },
  { title: 'Delivery time', body: 'Delivery time depends on your location and the delivery service available in your area. Estimated delivery information will be provided during checkout or after your order has been confirmed.' },
  { title: 'Delivery charges', body: 'Delivery charges are calculated according to your selected location and confirmed before payment.' },
  { title: 'Order tracking', body: 'When your order has been dispatched, we will provide the relevant delivery or tracking information where available.' },
]

export const returns = [
  { title: 'Return eligibility', body: 'If you receive an incorrect, damaged or defective item, please contact us as soon as possible after delivery.' },
  { title: 'Item condition', body: 'Returned items must be unused, unworn and in their original condition with their packaging, labels and accessories intact.' },
  { title: 'Requesting a return', body: 'Contact our customer service team with your order number, the reason for the return and clear photographs where the item is damaged or incorrect.' },
  { title: 'Approval', body: 'Please wait for return approval and instructions before sending an item back. Items returned without approval may not be accepted.' },
]

export const faqs = [
  {
    group: 'Orders',
    items: [
      { q: 'How do I place an order?', a: 'Browse our pieces, select the item and available options you want, add it to your bag and proceed to checkout. Checkout confirms your order with us directly on WhatsApp.' },
      { q: 'How do I know if my order was successful?', a: 'After your order is confirmed, you will receive confirmation through the contact information you provided.' },
      { q: 'Can I change or cancel my order?', a: 'Contact us immediately with your order details. We can only change or cancel an order if it has not already been processed or dispatched.' },
    ],
  },
  {
    group: 'Payments',
    items: [
      { q: 'How can I pay for my order?', a: 'The payment methods currently available will be shared when your order is confirmed. Follow the instructions provided to complete your payment securely.' },
      { q: 'Can I shop without creating an account?', a: 'Yes. No account is needed to shop BMP. Your bag and wishlist are saved on this device.' },
    ],
  },
  {
    group: 'Sizing',
    items: [
      { q: 'What sizes do BMP pieces come in?', a: 'BMP pieces come in UK sizes 8 to 22. Our size guide lists the bust, waist and hip measurements for each size in inches and centimetres.' },
      { q: 'How do I find my size?', a: 'Open the Size Guide, or tap "Find my size" on any piece, and enter your bust, waist and hip. We recommend your BMP size instantly and remember it for your next visit. If your measurements sit across two sizes, message us and we will advise.' },
    ],
  },
  {
    group: 'Delivery',
    items: [
      { q: 'How long will delivery take?', a: 'Delivery time depends on your location. You will receive an estimated delivery period after your order has been confirmed.' },
    ],
  },
  {
    group: 'Returns',
    items: [
      { q: 'What should I do if I receive the wrong or damaged item?', a: 'Contact us as soon as possible with your order number and clear photographs of the item so our customer service team can assist you.' },
    ],
  },
]
