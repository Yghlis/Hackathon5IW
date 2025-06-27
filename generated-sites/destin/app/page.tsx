import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Destiné - Services Professionnels',
  description: 'Destiné offre des services professionnels de qualité pour répondre à tous vos besoins.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}


css file="app/globals.css"
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
}


tsx file="components/navigation.tsx"
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-yellow-400">
            destiné
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-yellow-400 transition-colors">
              Accueil
            </Link>
            <Link href="/a-propos" className="hover:text-yellow-400 transition-colors">
              À Propos
            </Link>
            <Link href="#contact" className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-3 py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/a-propos"
                className="block px-3 py-2 hover:text-yellow-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                À Propos
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}


tsx file="components/footer.tsx"
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">destiné</h3>
            <p className="text-gray-300">
              Votre partenaire de confiance pour tous vos besoins professionnels.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">Accueil</a></li>
              <li><a href="/a-propos" className="text-gray-300 hover:text-yellow-400 transition-colors">À Propos</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-yellow-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div id="contact">
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-yellow-400 mr-3" />
                <span className="text-gray-300">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-yellow-400 mr-3" />
                <span className="text-gray-300">contact@destine.fr</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-yellow-400 mr-3" />
                <span className="text-gray-300">Paris, France</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Destiné. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}


tsx file="app/page.tsx"
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { ArrowRight, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Votre <span className="text-yellow-400">destinée</span> professionnelle commence ici
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Destiné vous accompagne dans tous vos projets avec expertise, 
                professionnalisme et une approche personnalisée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#contact"
                  className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center justify-center"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/a-propos"
                  className="border border-yellow-400 text-yellow-400 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-colors inline-flex items-center justify-center"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-800 rounded-lg p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Star className="w-12 h-12 text-black" />
                  </div>
                  <p className="text-gray-400">Image professionnelle</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une gamme complète de services professionnels adaptés à vos besoins
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Conseil Stratégique",
                description: "Accompagnement personnalisé pour développer votre stratégie et atteindre vos objectifs."
              },
              {
                title: "Solutions Innovantes",
                description: "Des approches créatives et modernes pour résoudre vos défis professionnels."
              },
              {
                title: "Support Continu",
                description: "Un suivi régulier et un support technique pour garantir votre succès."
              }
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-yellow-400 rounded-lg mb-6 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Prêt à transformer votre avenir ?
          </h2>
          <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour découvrir comment nous pouvons vous aider à atteindre vos objectifs.
          </p>
          <Link
            href="#contact"
            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-flex items-center"
          >
            Nous contacter
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}


tsx file="app/a-propos/page.tsx"
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Users, Target, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              À Propos de <span className="text-yellow-400">Destiné</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez notre histoire, nos valeurs et notre engagement envers l'excellence professionnelle.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Notre Histoire
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Fondée avec la vision de transformer les défis en opportunités, 
                Destiné s'est établie comme un partenaire de confiance pour les 
                professionnels et les entreprises.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Notre approche unique combine expertise technique, créativité et 
                une compréhension profonde des besoins de nos clients pour 
                livrer des solutions exceptionnelles.
              </p>
              <p className="text-lg text-gray-600">
                Aujourd'hui, nous continuons d'innover et d'évoluer pour rester 
                à la pointe de notre secteur et offrir la meilleure expérience 
                possible à nos clients.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gray-100 rounded-lg p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h