import { useState } from 'react'
import { X } from 'lucide-react'

export default function ProjectCard({ project }) {
  const [lightbox, setLightbox] = useState(false)

  return (
    <>
      <div
        className="group relative overflow-hidden rounded-2xl cursor-pointer bg-gray-100 aspect-square shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-1"
        onClick={() => setLightbox(true)}
      >
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-50 to-navy-50">
            <span className="text-4xl">🏠</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 right-0 left-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-cairo font-bold text-white text-base">{project.title}</h3>
          {project.description && (
            <p className="text-white/80 text-sm font-cairo mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)}
            className="absolute top-4 left-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img src={project.image_url} alt={project.title}
              className="w-full rounded-xl object-contain max-h-[80vh]" />
            <div className="mt-4 text-center">
              <h3 className="text-white font-cairo font-bold text-xl">{project.title}</h3>
              {project.description && (
                <p className="text-white/70 font-cairo mt-2">{project.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
