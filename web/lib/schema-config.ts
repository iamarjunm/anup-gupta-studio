export type FieldType = 'string' | 'text' | 'number' | 'boolean' | 'image' | 'block' | 'reference' | 'slug' | 'array_string' | 'datetime' | 'object' | 'sizes_array' | 'styles_array' | 'image_array';

export interface FieldConfig {
  name: string;
  title: string;
  type: FieldType;
  referenceTo?: string; // For reference fields
  options?: any;
}

export interface SchemaConfig {
  name: string;
  title: string;
  fields: FieldConfig[];
}

export const cmsSchemas: SchemaConfig[] = [
  {
    name: 'category',
    title: 'Category',
    fields: [
      { name: 'title', title: 'Title', type: 'string' },
      { name: 'slug', title: 'Slug', type: 'slug' },
      { name: 'image', title: 'Image', type: 'image' },
      { name: 'order', title: 'Order', type: 'number' },
      { name: 'featuredOnHome', title: 'Featured on Homepage', type: 'boolean' },
      { name: 'sizeChartRaw', title: 'Size Chart (Paste from Excel/Word)', type: 'text' },
    ]
  },
  {
    name: 'subcategory',
    title: 'Subcategory',
    fields: [
      { name: 'title', title: 'Title', type: 'string' },
      { name: 'slug', title: 'Slug', type: 'slug' },
      { name: 'parentCategory', title: 'Parent Category', type: 'reference', referenceTo: 'category' },
      { name: 'image', title: 'Image', type: 'image' },
      { name: 'featuredOnHome', title: 'Featured on Homepage', type: 'boolean' },
      { name: 'sizeChartRaw', title: 'Size Chart (Paste from Excel/Word)', type: 'text' },
    ]
  },
  {
    name: 'collection',
    title: 'Collection',
    fields: [
      { name: 'title', title: 'Title', type: 'string' },
      { name: 'slug', title: 'Slug', type: 'slug' },
      { name: 'description', title: 'Description', type: 'text' },
      { name: 'image', title: 'Image', type: 'image' },
    ]
  },
  {
    name: 'product',
    title: 'Product',
    fields: [
      { name: 'title', title: 'Title', type: 'string' },
      { name: 'slug', title: 'Slug', type: 'slug' },
      { name: 'price', title: 'Price', type: 'number' },
      { name: 'compareAtPrice', title: 'Compare At Price', type: 'number' },
      { name: 'mainImage', title: 'Main Image', type: 'image' },
      { name: 'gallery', title: 'Additional Images (Gallery)', type: 'image_array' },
      { name: 'categories', title: 'Categories', type: 'reference', referenceTo: 'category' },
      { name: 'subcategories', title: 'Subcategories', type: 'reference', referenceTo: 'subcategory' },
      { name: 'collections', title: 'Collections', type: 'reference', referenceTo: 'collection' },
      { name: 'sizes', title: 'Sizes & Stock', type: 'sizes_array' },
      { name: 'color', title: 'Color', type: 'string' },
      { name: 'styles', title: 'Styles & Pricing', type: 'styles_array' },
      { name: 'newArrival', title: 'New Arrival', type: 'boolean' },
      { name: 'bestseller', title: 'Bestseller', type: 'boolean' },
      { name: 'featured', title: 'Featured', type: 'boolean' },
      { name: 'description', title: 'Description', type: 'block' },
      { name: 'fabric', title: 'Fabric Details', type: 'block' },
      { name: 'lookAfterMe', title: 'Look After Me', type: 'block' },
    ]
  },
  {
    name: 'marquee',
    title: 'Marquee Text',
    fields: [
      { name: 'text', title: 'Text', type: 'string' },
      { name: 'backgroundImage', title: 'Background Image', type: 'image' },
    ]
  },
  {
    name: 'announcementBar',
    title: 'Announcement Bar',
    fields: [
      { name: 'text', title: 'Text', type: 'string' },
      { name: 'code', title: 'Discount Code (Optional)', type: 'string' },
      { name: 'codeColor', title: 'Code Color (e.g., text-yellow-600)', type: 'string' },
      { name: 'active', title: 'Is Active', type: 'boolean' },
      { name: 'order', title: 'Order', type: 'number' },
    ]
  },
  {
    name: 'discountCode',
    title: 'Discount Code',
    fields: [
      { name: 'code', title: 'Code', type: 'string' },
      { name: 'description', title: 'Description', type: 'text' },
      { name: 'discountType', title: 'Discount Type', type: 'string', options: [{title: 'Percentage', value: 'percentage'}, {title: 'Fixed Amount', value: 'fixed'}] },
      { name: 'percentageOff', title: 'Amount/Percentage Off', type: 'number' },
      { name: 'minimumPurchaseAmount', title: 'Minimum Purchase Amount', type: 'number' },
      { name: 'appliesTo', title: 'Applies To', type: 'string', options: [{title: 'Entire Order', value: 'entireOrder'}, {title: 'Specific Products', value: 'specificProducts'}] },
      { name: 'isActive', title: 'Is Active', type: 'boolean' },
      { name: 'startDate', title: 'Start Date', type: 'datetime' },
      { name: 'endDate', title: 'End Date', type: 'datetime' },
      { name: 'usageLimit', title: 'Usage Limit (Total)', type: 'number' },
      { name: 'usageLimitPerCustomer', title: 'Usage Limit Per Customer', type: 'number' },
      { name: 'timesUsed', title: 'Times Used (Read Only)', type: 'number' },
    ]
  },
  {
    name: 'celebrity',
    title: 'Celebrity Style',
    fields: [
      { name: 'name', title: 'Name', type: 'string' },
      { name: 'image', title: 'Image', type: 'image' },
      { name: 'product', title: 'Product Link', type: 'reference', referenceTo: 'product' },
    ]
  },
  {
    name: 'siteSettings',
    title: 'Site Settings',
    fields: [
      { name: 'siteName', title: 'Site Name', type: 'string' },
      { name: 'tagline', title: 'Tagline', type: 'string' },
      { name: 'contactEmail', title: 'Contact Email', type: 'string' },
      { name: 'contactPhone', title: 'Contact Phone', type: 'string' },
      { name: 'address', title: 'Address', type: 'string' },
      { name: 'currency', title: 'Currency (e.g. INR)', type: 'string' },
      { name: 'shippingSettings', title: 'Shipping Settings (JSON)', type: 'object' },
      { name: 'promotionalGames', title: 'Promotional Games (JSON)', type: 'object' },
      { name: 'instagramLinks', title: 'Instagram Links (Comma separated)', type: 'array_string' },
      { name: 'productionAndShipping', title: 'Global Production Info', type: 'block' },
      { name: 'disclaimer', title: 'Global Disclaimer', type: 'block' },
    ]
  },
  {
    name: 'heroSection',
    title: 'Hero Section',
    fields: [
      { name: 'heading1', title: 'Heading 1', type: 'string' },
      { name: 'heading2', title: 'Heading 2', type: 'string' },
      { name: 'description', title: 'Description', type: 'text' },
      { name: 'backgroundImage', title: 'Background Image', type: 'image' },
      { name: 'link', title: 'Link', type: 'string' },
    ]
  },
  {
    name: 'promoCountdown',
    title: 'Promo Countdown',
    fields: [
      { name: 'title', title: 'Title', type: 'string' },
      { name: 'subtitle', title: 'Subtitle', type: 'string' },
      { name: 'description', title: 'Description', type: 'text' },
      { name: 'code', title: 'Discount Code', type: 'string' },
      { name: 'discountPercentage', title: 'Discount Percentage', type: 'number' },
      { name: 'endDate', title: 'End Date', type: 'datetime' },
      { name: 'active', title: 'Active', type: 'boolean' },
      { name: 'backgroundImage', title: 'Background Image', type: 'image' },
    ]
  },
  {
    name: 'contactForm',
    title: 'Contact Form',
    fields: [
      { name: 'email', title: 'Email', type: 'string' },
      { name: 'message', title: 'Message', type: 'text' },
      { name: 'status', title: 'Status', type: 'string', options: [{title: 'Unread', value: 'unread'}, {title: 'Read', value: 'read'}, {title: 'Resolved', value: 'resolved'}] },
    ]
  },
  {
    name: 'newsletterSubscriber',
    title: 'Newsletter Subscribers',
    fields: [
      { name: 'email', title: 'Email', type: 'string' },
      { name: 'subscribedAt', title: 'Subscribed At', type: 'datetime' },
    ]
  }
];
