import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

// ...

export async function getLandingPage() {
  const entries = await client.getEntries({
    content_type: 'landingpage',
  })

  if (entries.items) {
    return entries.items
  }

  return []
}

export async function getNewCollection() {
  const entries = await client.getEntries({
    content_type: 'newCollection',
  })

  if (entries.items) {
    return entries.items
  }

  return []
}
