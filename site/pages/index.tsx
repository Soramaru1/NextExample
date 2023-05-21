import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Marquee, Hero } from '@components/ui'
import Link from 'next/link'
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { getLandingPage } from '../lib/contentful'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const landing = await getLandingPage()

  console.log(landing[0].fields.headervideo.fields.file.url)

  const productsPromise = commerce.getAllProducts({
    variables: { first: 6 },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })

  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  //console.log(products[0])

  return {
    props: {
      products,
      categories,
      brands,
      pages,
      landing,
    },
    revalidate: 60,
  }
}

export default function Home({
  products,
  landing,
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          padding: '1rem 0',
        }}
      >
        {categories.map((category: any, i: number) => (
          <div
            key={i}
            style={{
              padding: '1rem',
              borderRadius: '5px',
              backgroundColor: 'white', // Change background color to white
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle box-shadow
              textAlign: 'center',
              border: '1px solid black', // Add black border
            }}
          >
            <h3
              style={{
                margin: 0,
                fontFamily:
                  'Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace',
                fontWeight: 'bold',
              }}
            >
              {category.name}
            </h3>
          </div>
        ))}
      </div>

      <div>
        <img width="100%" src={landing[0].fields.headervideo.fields.file.url} />
      </div>
      <Link href="/new_collection">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            padding: '1rem 0',
            paddingTop: '40 px',
            marginTop: '100px',
          }}
        >
          <p
            style={{
              fontFamily:
                'Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace',
              fontWeight: 'bold',
              marginInlineEnd: '60px',
              fontSize: '30px',
            }}
          >
            Summer 2023 new collection
          </p>
          {landing[0].fields.headerbanner.content.map(
            (contentItem: any, i: number) => {
              if (
                contentItem.data &&
                contentItem.data.target &&
                contentItem.data.target.fields &&
                contentItem.data.target.fields.file
              ) {
                return (
                  <img
                    key={i}
                    src={contentItem.data.target.fields.file.url}
                    alt={
                      contentItem.data.target.fields.title ||
                      `Banner image ${i}`
                    }
                    style={{
                      maxHeight: '300px', // Adjust the max-height as needed
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                )
              }
            }
          )}
        </div>
      </Link>

      <Marquee>
        {products.slice(3).map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee>

      <Hero
        headline={
          landing[0].fields.hero.content[0].data.target.fields.title.content[0]
            .content[0].value
        }
        image={
          landing[0].fields.hero.content[0].data.target.fields.image.fields.file
            .url
        }
        description={
          landing[0].fields.hero.content[0].data.target.fields.title.content[1]
            .content[0].value
        }
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'white',
          border: '1px solid black',
        }}
      >
        <img
          src={landing[0].fields.footer.content[0].data.target.fields.file.url} // Replace with your image URL
          alt="Image"
          style={{
            height: '200px',
            objectFit: 'cover',
            borderRadius: '5px',
          }}
        />
        <blockquote
          style={{
            fontFamily:
              'Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace',
            fontStyle: 'italic',
            fontSize: '14px',
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          {landing[0].fields.footer.content[2].content[0].value}
        </blockquote>
      </div>

      {/* <Grid layout="B" variant="filled">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
            }}
          />
        ))}
      </Grid> */}

      {/* <HomeAllProductsGrid
        newestProducts={products}
        categories={categories}
        brands={brands}
      /> */}
    </>
  )
}

Home.Layout = Layout
