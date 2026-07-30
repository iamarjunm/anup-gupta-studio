import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
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
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Image to display in the navbar dropdown',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'displayOnHome',
      title: 'Display on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sizeChart',
      title: 'Size Chart',
      type: 'object',
      fields: [
        {
          name: 'headers',
          title: 'Columns (e.g., Size, Chest, Length)',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'cells',
                  title: 'Row Values (matching columns)',
                  type: 'array',
                  of: [{ type: 'string' }],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
})
