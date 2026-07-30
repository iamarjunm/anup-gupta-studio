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
      name: 'promotionalGames',
      title: 'Promotional Games Settings',
      type: 'object',
      fields: [
        { name: 'activeGame', type: 'string', title: 'Active Game' },
        { name: 'enabled', type: 'boolean', title: 'Enabled', initialValue: false },
        { name: 'autoOpenDelay', type: 'number', title: 'Auto Open Delay' },
        { name: 'offerCycleId', type: 'string', title: 'Offer Cycle ID' },
        { name: 'replayInterval', type: 'number', title: 'Replay Interval' },
        { name: 'showFloatingButton', type: 'boolean', title: 'Show Floating Button' },
        {
          name: 'crazySpinGameConfig',
          title: 'Crazy Spin Config',
          type: 'object',
          fields: [
            { name: 'bombProbability', type: 'number' },
            { name: 'comboMultiplierEnabled', type: 'boolean' },
            { name: 'enabled', type: 'boolean' },
            { name: 'maxComboSpins', type: 'number' },
            { name: 'numberOfSegments', type: 'number' },
            { name: 'spinDuration', type: 'number' },
          ]
        }
      ]
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
      of: [{ type: 'url' }],
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
