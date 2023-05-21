import { useRouter } from 'next/router'
import { useState } from 'react'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { getLandingPage, getNewCollection } from '../lib/contentful'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const CnewCollection = await getNewCollection()
  console.log(CnewCollection[0].fields.media.fields.file)

  const productsPromise = commerce.getAllProducts({
    variables: { first: 25 },
    config,
    preview,
    ...({ featured: true } as any),
  })

  const { products } = await productsPromise

  return {
    props: {
      products,
      CnewCollection,
    },
    revalidate: 60,
  }
}

const NewCollection = ({
  products,
  CnewCollection,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()
  const [displayedImages, setDisplayedImages] = useState(
    products.map((product) => product.images[0])
  )

  const handleVariantImageClick = (event, productIndex, variant) => {
    event.preventDefault()
    event.stopPropagation()
    const updatedDisplayedImages = [...displayedImages]
    updatedDisplayedImages[productIndex].url = variant.defaultImage.urlOriginal
    setDisplayedImages(updatedDisplayedImages)
  }

  return (
    <div>
      <div>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: '100vh',
            marginBottom: '150px',
          }}
        >
          <video
            autoPlay
            muted
            loop
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '100%',
              minHeight: '100%',
              zIndex: 0,
            }}
            src={CnewCollection[0].fields.media.fields.file.url} // Replace with your video URL
          />

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              padding: '30px',
              borderRadius: '10px',
            }}
          >
            <h1
              style={{
                fontSize: '3em',
                fontFamily:
                  'Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace',
                marginBottom: '20px',
              }}
            >
              {CnewCollection[0].fields.text}
            </h1>
          </div>
        </div>
      </div>

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
        {['Price', 'Color', 'Size'].map((filter, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              borderRadius: '5px',
              backgroundColor: 'white', // Change background color to white
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle box-shadow
              textAlign: 'center',
              border: '1px solid black', // Add black border
              width: '150px',
              height: '50px',
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
              {filter}
            </h3>
            <div
              style={{
                fontSize: '1.5em',
                marginLeft: '0.5rem',
              }}
            >
              &#x25BE;
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          marginTop: '20px',
        }}
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            onClick={() => router.push('product/' + product.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '1rem',
              cursor: 'pointer',
              width: '200px', // Fixed width for product cards
            }}
          >
            <img
              src={displayedImages[index].url}
              alt={displayedImages[index].alt}
              style={{
                width: '100%',
                height: '200px', // Fixed height for product card images
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                height: '3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h2 style={{ margin: 0 }}>{product.name}</h2>
            </div>
            <p>
              {product.price.value} {product.price.currencyCode}
            </p>{' '}
            {/* Added price */}
            <div
              style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '1rem',
                whiteSpace: 'nowrap',
                width: '100%', // Fixed width for variant images slider
              }}
            >
              {product.variants.map((variant) => (
                <img
                  key={variant.id}
                  src={variant.defaultImage.urlOriginal}
                  alt={variant.defaultImage.alt}
                  style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  onClick={(event) =>
                    handleVariantImageClick(event, index, variant)
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

NewCollection.Layout = Layout

export default NewCollection
