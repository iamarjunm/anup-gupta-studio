import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'subcategory',
  title: 'Subcategory',
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
      name: 'parentCategory',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Image to display in the navbar alongside the category image (only one subcategory image will be shown per category dropdown)',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featuredOnHome',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sizeChartRaw',
      title: 'Size Chart (Paste from Excel/Word)',
      type: 'text',
      description: 'Paste your size chart directly from Excel or Google Sheets. It will automatically be formatted into tables.',
    }),
  ],
})
