import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare At Price',
      type: 'number',
      description: 'Original price before discount',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'subcategories',
      title: 'Subcategories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'subcategory' }] }],
    }),
    defineField({
      name: 'collections',
      title: 'Collections',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'collection' }] }],
      description: 'Optional collections this product belongs to (e.g., Summer 2026)',
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes & Stock',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'size', type: 'string', title: 'Size (e.g. S, M, L)' },
            { name: 'stock', type: 'number', title: 'Stock Quantity', initialValue: 0 }
          ]
        }
      ],
      description: 'Define available sizes and their corresponding stock quantities.'
    }),
    defineField({
      name: 'newArrival',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'bestseller',
      title: 'Bestseller',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'fabric',
      title: 'Fabric',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'lookAfterMe',
      title: 'Look After Me',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'sizeGuide',
      title: 'Size Guide',
      type: 'text',
    }),
    defineField({
      name: 'weight',
      title: 'Weight',
      type: 'number',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        { name: 'metaTitle', type: 'string', title: 'Meta Title' },
        { name: 'metaDescription', type: 'text', title: 'Meta Description' },
      ],
    }),
    defineField({
      name: 'variants',
      title: 'Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'colorName', title: 'Color Name', type: 'string' },
            { name: 'variantSize', title: 'Variant Size', type: 'string' },
            { name: 'priceAdjustment', title: 'Price Adjustment', type: 'number', initialValue: 0 },
          ],
        },
      ],
    }),
  ],
})
