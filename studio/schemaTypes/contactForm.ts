import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Unread', value: 'unread' },
          { title: 'Read', value: 'read' },
          { title: 'Resolved', value: 'resolved' },
        ],
      },
      initialValue: 'unread',
    }),
  ],
})
