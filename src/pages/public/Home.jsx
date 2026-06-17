import Hero from '../../components/home/Hero'
import CategoriesSection from '../../components/home/CategoriesSection'
import FeaturedModels from '../../components/home/FeaturedModels'
import OurWork from '../../components/home/OurWork'
import ReviewsSection from '../../components/home/ReviewsSection'

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoriesSection />
      <FeaturedModels />
      <OurWork />
      <ReviewsSection />
    </main>
  )
}
