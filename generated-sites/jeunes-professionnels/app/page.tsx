'use client'

import { useState } from 'react'
import { Menu, X, Mail, Phone, MapPin, ArrowRight, Star } from 'lucide-react'

export default function JeunesProfessionnelsWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('accueil')

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-black">Jeunes Professionnels</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection('accueil')}
                className={`text-sm font-medium transition-colors hover:text-gray-600 ${
                  activeSection === 'accueil' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-700'
                }`}
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection('produits')}
                className={`text-sm font-medium transition-colors hover:text-gray-600 ${
                  activeSection === 'produits' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-700'
                }`}
              >
                Produits
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`text-sm font-medium transition-colors hover:text-gray-600 ${
                  activeSection === 'contact' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-700'
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-black hover:text-gray-600 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection('accueil')}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 w-full text-left"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection('produits')}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 w-full text-left"
              >
                Produits
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 w-full text-left"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="accueil" className="pt-16 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Excellence pour
                  <span className="block text-gray-600">Jeunes Professionnels</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Découvrez notre collection exclusive conçue pour les professionnels ambitieux qui recherchent l'excellence dans chaque détail.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection('produits')}
                  className="bg-black text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
                >
                  Découvrir nos produits
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="border-2 border-black text-black px-8 py-4 font-medium hover:bg-black hover:text-white transition-colors"
                >
                  Nous contacter
                </button>
              </div>

              <div className="flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-gray-600">Clients satisfaits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">5★</div>
                  <div className="text-sm text-gray-600">Note moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-sm text-gray-600">Ans d'expérience</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-lg font-medium">Image professionnelle</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-black rounded-lg flex items-center justify-center">
                <Star className="text-white" size={32} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produits" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Nos Produits</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une sélection rigoureuse de produits haut de gamme, pensés pour répondre aux exigences des jeunes professionnels d'aujourd'hui.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Collection Executive",
                description: "Accessoires professionnels de luxe pour les dirigeants en devenir.",
                price: "À partir de 299€"
              },
              {
                title: "Série Innovation",
                description: "Solutions modernes pour optimiser votre productivité quotidienne.",
                price: "À partir de 199€"
              },
              {
                title: "Gamme Prestige",
                description: "L'excellence française au service de votre image professionnelle.",
                price: "À partir de 399€"
              },
              {
                title: "Pack Entrepreneur",
                description: "Tout ce dont vous avez besoin pour lancer votre activité.",
                price: "À partir de 499€"
              },
              {
                title: "Collection Nomade",
                description: "Conçue pour les professionnels en déplacement constant.",
                price: "À partir de 249€"
              },
              {
                title: "Édition Limitée",
                description: "Pièces exclusives en quantité limitée pour les connaisseurs.",
                price: "Sur demande"
              }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">Image produit</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{product.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{product.price}</span>
                    <button className="text-black hover:text-gray-600 font-medium flex items-center gap-1 group">
                      En savoir plus
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">Contactez-nous</h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Notre équipe d'experts est à votre disposition pour vous accompagner dans vos projets professionnels.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-black text-white p-3 rounded-lg">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Téléphone</h3>
                    <p className="text-gray-600">+33 1 23 45 67 89</p>
                    <p className="text-sm text-gray-500">Lun-Ven 9h-18h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-black text-white p-3 rounded-lg">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">contact@jeunes-professionnels.fr</p>
                    <p className="text-sm text-gray-500">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-black text-white p-3 rounded-lg">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Adresse</h3>
                    <p className="text-gray-600">123 Avenue des Champs-Élysées</p>
                    <p className="text-gray-600">75008 Paris, France</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prénom</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-