import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'marquee',
  title: 'Marquee Section',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
