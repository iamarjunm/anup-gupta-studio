import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'celebrity',
  title: 'Celebrity Customer',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'string',
      description: 'A URL path starting with / (e.g. /collections/shirts)',
      validation: (Rule) => Rule.required().custom(link => {
        if (typeof link === 'string' && !link.startsWith('/')) {
          return 'Link must start with /'
        }
        return true
      })
    }),
  ],
})
