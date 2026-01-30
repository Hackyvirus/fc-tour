import React from 'react'
import Link from 'next/link'
import Header from '@/app/componets/Header'
import { Play, MapPin, Users, BookOpen, Award, Building, GraduationCap } from 'lucide-react'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "360° Campus Views",
      description: "Explore every corner of our beautiful campus with immersive panoramic views"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Academic Facilities",
      description: "Tour our state-of-the-art laboratories, libraries, and classrooms"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Student Life",
      description: "Discover hostels, sports facilities, and cultural spaces"
    }
  ]

  const stats = [
    {
      icon: <Award className="w-6 h-6" />,
      number: "150+",
      label: "Years of Excellence"
    },
    {
      icon: <Building className="w-6 h-6" />,
      number: "20+",
      label: "Campus Locations"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      number: "5000+",
      label: "Students"
    },
    {
      icon: <Users className="w-6 h-6" />,
      number: "100+",
      label: "Faculty Members"
    }
  ]

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome to{' '}
            <span className="block text-yellow-300 mt-2">
              Fergusson College
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Experience our historic campus through an interactive virtual tour.
            Explore academic buildings, libraries, laboratories, and student facilities
            from anywhere in the world.
          </p>
          <Link
            href="/tour"
            className="group inline-flex items-center bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-4 px-8 rounded-full text-lg btn-hover shadow-lg"
          >
            <Play className="w-6 h-6 mr-3 group-hover:animate-pulse" />
            Start Virtual Tour
          </Link>
        </div>
      </section>

<section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Explore Our Campus
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass rounded-xl p-6 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

<section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Legacy
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass rounded-lg p-6 text-center hover:bg-white/15 transition-all group"
              >
                <div className="text-yellow-400 mb-3 flex justify-center group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

<section className="glass rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            About Fergusson College
          </h2>
          <p className="text-white/90 max-w-3xl mx-auto leading-relaxed">
            Established in 1885, Fergusson College is one of India&apos;s premier educational institutions.
            Our historic campus combines colonial architecture with modern facilities, providing
            an ideal environment for learning and growth. Join thousands of alumni who have
            walked these halls and made their mark on the world.
          </p>
        </section>
      </main>
    </>
  )
}

export default HomePage