import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Описание фото (для Google и незрячих)',
      required: true,
      localized: true,
    },
  ],
  upload: true,
}
