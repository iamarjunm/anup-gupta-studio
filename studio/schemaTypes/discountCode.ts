import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'discountCode',
  title: 'Discount Code',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage', value: 'percentage' },
          { title: 'Fixed Amount', value: 'fixed' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'percentageOff',
      title: 'Percentage Off',
      type: 'number',
    }),
    defineField({
      name: 'minimumPurchaseAmount',
      title: 'Minimum Purchase Amount',
      type: 'number',
    }),
    defineField({
      name: 'appliesTo',
      title: 'Applies To',
      type: 'string',
      options: {
        list: [
          { title: 'Entire Order', value: 'entireOrder' },
          { title: 'Specific Products', value: 'specificProducts' },
        ],
      },
      initialValue: 'entireOrder',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
    }),
    defineField({
      name: 'usageLimit',
      title: 'Usage Limit (Total)',
      type: 'number',
    }),
    defineField({
      name: 'usageLimitPerCustomer',
      title: 'Usage Limit Per Customer',
      type: 'number',
    }),
    defineField({
      name: 'timesUsed',
      title: 'Times Used',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
  ],
})
