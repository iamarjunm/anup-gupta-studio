import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading1',
      title: 'Heading 1',
      type: 'string',
    }),
    defineField({
      name: 'heading2',
      title: 'Heading 2',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'string',
      description: 'The URL path this hero section should link to (e.g., /shop/collections)',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
