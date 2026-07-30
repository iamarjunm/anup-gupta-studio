import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'announcementBar',
  title: 'Announcement Bar',
  type: 'document',
  fields: [
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'code',
      title: 'Discount Code',
      type: 'string',
    }),
    defineField({
      name: 'codeColor',
      title: 'Code Color (Tailwind class)',
      type: 'string',
      description: 'e.g., text-yellow-600',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
})
