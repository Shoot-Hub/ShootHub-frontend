import { motion } from 'framer-motion';
import {
  ArrowRight,
  Baby,
  Briefcase,
  Camera,
  Crop,
  Drone,
  Gift,
  Mountain,
  HeartHandshake,
  Shirt,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { CategoryCard } from './CategoryCard';

import weddingImg from '@/assets/landing/categories/wedding.jpg';
import preWeddingImg from '@/assets/landing/hero-wedding.png';
import birthdayImg from '@/assets/landing/categories/birthday.jpg';
import corporateImg from '@/assets/landing/categories/corporate.jpg';
import fashionImg from '@/assets/landing/categories/fashion.jpg';
import droneImg from '@/assets/landing/categories/drone.jpg';
import foodImg from '@/assets/landing/categories/food.jpg';
import travelImg from '@/assets/landing/categories/travel.jpg';
import babyShootImg from '@/assets/landing/categories/baby-shoot.jpg';
import portraitImg from '@/assets/landing/categories/portrait.jpg';

const categories = [
  {
    title: 'Wedding',
    description: 'Magical moments beautifully captured',
    image: weddingImg,
    icon: HeartHandshake,
    alt: 'Indian wedding couple',
  },
  {
    title: 'Pre-Wedding',
    description: 'Your story, your perfect frame',
    image: preWeddingImg,
    icon: Crop,
    alt: 'Pre-wedding couple shoot',
  },
  {
    title: 'Birthday',
    description: 'Celebrate every special day',
    image: birthdayImg,
    icon: Gift,
    alt: 'Birthday celebration with cake',
  },
  {
    title: 'Corporate',
    description: 'Professional. Polished. Powerful.',
    image: corporateImg,
    icon: Briefcase,
    alt: 'Corporate business meeting',
  },
  {
    title: 'Fashion',
    description: 'Style, attitude, and perfection',
    image: fashionImg,
    icon: Shirt,
    alt: 'Fashion portrait shoot',
  },
  {
    title: 'Drone',
    description: 'Aerial views that leave an impact',
    image: droneImg,
    icon: Drone,
    alt: 'Drone aerial photography',
  },
  {
    title: 'Food',
    description: 'Delicious moments captured in style',
    image: foodImg,
    icon: UtensilsCrossed,
    alt: 'Food photography burger and fries',
  },
  {
    title: 'Travel',
    description: 'Explore. Capture. Remember.',
    image: travelImg,
    icon: Mountain,
    alt: 'Travel photography mountain landscape',
  },
  {
    title: 'Baby Shoot',
    description: 'Tiny smiles, timeless memories',
    image: babyShootImg,
    icon: Baby,
    alt: 'Baby photoshoot',
  },
  {
    title: 'Portrait',
    description: "It's not just a photo, it's you",
    image: portraitImg,
    icon: Camera,
    alt: 'Portrait photography',
  },
] as const;

export function Categories() {
  return (
    <Section id="categories" padding="lg" className="bg-white">
      <Container size="wide" padding="tight">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div variants={fadeInUp} className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-primary-600">
              <Camera className="h-3.5 w-3.5 text-primary-500" strokeWidth={2.5} />
              Explore Categories
            </span>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative mt-4 inline-flex items-center justify-center gap-3">
            <Sparkles
              className="absolute -left-8 top-1/2 hidden h-5 w-5 -translate-y-1/2 fill-primary-300 text-primary-300 sm:block"
              aria-hidden="true"
            />
            <h2 className="text-[44px] font-extrabold leading-tight tracking-tight text-ink sm:text-[52px] md:text-[58px]">
              Shoot by{' '}
              <span className="text-primary-500">Category</span>
            </h2>
            <Sparkles
              className="absolute -right-8 top-1/2 hidden h-5 w-5 -translate-y-1/2 fill-primary-300 text-primary-300 sm:block"
              aria-hidden="true"
            />
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-base"
          >
            From intimate ceremonies to full-scale campaigns, find creators who specialise in your moment.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-5"
        >
          {categories.map((category) => (
            <motion.div key={category.title} variants={fadeInUp}>
              <CategoryCard {...category} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-10 flex justify-center"
        >
          <Button
            variant="secondary"
            size="lg"
            pill
            className="border-primary-200 bg-white px-8 text-primary-600 hover:border-primary-300 hover:bg-primary-50"
            rightIcon={<ArrowRight className="h-4 w-4 text-primary-500" strokeWidth={2.5} />}
          >
            View All Categories
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
}
