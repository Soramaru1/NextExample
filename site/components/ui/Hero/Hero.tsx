import React, { FC } from 'react'
import { Container } from '@components/ui'
import { ArrowRight } from '@components/icons'
import s from './Hero.module.css'
import Link from 'next/link'
interface HeroProps {
  className?: string
  headline: string
  description: string
  image: string
}

const Hero: FC<HeroProps> = ({ headline, description, image }) => {
  return (
    <div className="bg-accent-5 border-b border-t border-accent-2">
      <Container>
        <div className={s.root}>
          {/* <h2 className={s.title}>{headline}</h2> */}
          <img
            src={image}
            alt="Hero image"
            style={{
              width: '100%',
              maxWidth: '300px', // Adjust as needed for max image size
              height: 'auto',
              aspectRatio: '1/1', // Force a square aspect ratio
              objectFit: 'cover',
              display: 'block',
              margin: '0 auto',
            }}
          />
          <div className={s.description}>
            <p
              className="text-accent-1"
              style={{
                fontFamily:
                  'Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace',
                fontWeight: 'bold',
              }}
            >
              {headline}
            </p>
            <p
              className="text-accent-1"
              style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
              }}
            >
              {description}
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Hero
