import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
    }),
    defineField({
      name: 'shippingSettings',
      title: 'Shipping Settings',
      type: 'object',
      fields: [
        { name: 'shippingEnabled', type: 'boolean', title: 'Shipping Enabled' },
        { name: 'freeShippingThreshold', type: 'number', title: 'Free Shipping Threshold' },
        { name: 'standardShippingCost', type: 'number', title: 'Standard Shipping Cost' },
      ]
    }),
    defineField({
      name: 'productionAndShipping',
      title: 'Global Production & Shipping Info',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'disclaimer',
      title: 'Global Disclaimer',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'instagramLinks',
      title: 'Instagram Post Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'instagramPost',
          title: 'Instagram Post with Cover',
          fields: [
            { name: 'link', type: 'url', title: 'Instagram Link' },
            { name: 'coverImage', type: 'image', title: 'Cover Image (Upload)', description: 'Upload an image via Sanity Studio.' }
          ]
        }
      ],
      validation: (Rule) => Rule.max(10),
      description: 'Add up to 10 Instagram post or reel URLs to show in the footer.',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    }),
  ],
})
