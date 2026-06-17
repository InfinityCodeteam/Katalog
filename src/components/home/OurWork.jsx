import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ProjectCard from '../common/ProjectCard'
import LoadingSpinner from '../common/LoadingSpinner'

export default function OurWork() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setProjects(data || [])
        setLoading(false)
      })
  }, [])

  if (!loading && !projects.length) return null

  return (
    <section className="py-16 lg:py-24 bg-navy-950">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-gold-400 font-cairo font-semibold text-sm mb-3 tracking-wider uppercase">
            مشاريعنا المنجزة
          </span>
          <h2 className="font-cairo font-black text-3xl md:text-4xl text-white mb-3">
            أعمالنا
          </h2>
          <p className="font-cairo text-navy-300 text-base max-w-lg mx-auto">
            نماذج من مشاريعنا المنجزة لعملائنا الكرام
          </p>
          <div className="w-16 h-1 bg-gold-gradient mx-auto rounded-full mt-4" />
        </div>

        {loading ? (
          <LoadingSpinner size="lg" className="py-16" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
