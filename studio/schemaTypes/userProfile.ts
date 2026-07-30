import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'userProfile',
  title: 'User Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'displayName',
      title: 'Display Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'firebaseUid',
      title: 'Firebase UID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'authProvider',
      title: 'Auth Provider',
      type: 'string',
      description: 'e.g., google, email',
    }),
    defineField({
      name: 'addresses',
      title: 'Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'street', type: 'string', title: 'Street' },
            { name: 'city', type: 'string', title: 'City' },
            { name: 'state', type: 'string', title: 'State' },
            { name: 'postalCode', type: 'string', title: 'Postal Code' },
            { name: 'country', type: 'string', title: 'Country' },
          ],
        },
      ],
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    }),
  ],
})
