'use client'

import { useState } from 'react'
import { Menu, X, Phone, Mail, MapPin, Clock, Shield, Key, Lock, Wrench } from 'lucide-react'

export default function DedieeLocksmithWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 border-b border-red-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="h-8 w-8 text-red-600" />
              <h1 className="text-2xl font-bold text-stone-100">dédiée</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('accueil')}
                className="text-stone-300 hover:text-red-400 transition-colors font-medium"
              >
                Accueil
              </button>
              <button 
                onClick={() => scrollToSection('apropos')}
                className="text-stone-300 hover:text-red-400 transition-colors font-medium"
              >
                À propos
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-stone-300 hover:text-red-400 transition-colors font-medium"
              >
                Me contacter
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-stone-300 hover:text-red-400"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-red-800 pt-4">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('accueil')}
                  className="text-stone-300 hover:text-red-400 transition-colors font-medium text-left"
                >
                  Accueil
                </button>
                <button 
                  onClick={() => scrollToSection('apropos')}
                  className="text-stone-300 hover:text-red-400 transition-colors font-medium text-left"
                >
                  À propos
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-stone-300 hover:text-red-400 transition-colors font-medium text-left"
                >
                  Me contacter
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section - Accueil */}
      <section id="accueil" className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-stone-900 via-stone-800 to-black">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-bold text-stone-100 leading-tight">
                  Serrurier
                  <span className="text-red-600 block">Professionnel</span>
                </h2>
                <p className="text-xl text-stone-300 leading-relaxed">
                  Service fiable et rapide pour tous vos besoins de serrurerie. 
                  Urgences 24h/24 et installations planifiées.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-5 w-5" />
                  <span>Urgence 24h/24</span>
                </button>
                <button 
                  onClick={() => scrollToSection('apropos')}
                  className="border-2 border-stone-600 hover:border-red-600 text-stone-300 hover:text-red-400 px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                  En savoir plus
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-stone-800 rounded-2xl p-8 border border-stone-700">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center space-y-2">
                    <Shield className="h-12 w-12 text-red-600 mx-auto" />
                    <h3 className="font-semibold text-stone-100">Sécurité</h3>
                    <p className="text-sm text-stone-400">Installation & réparation</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Clock className="h-12 w-12 text-red-600 mx-auto" />
                    <h3 className="font-semibold text-stone-100">Rapidité</h3>
                    <p className="text-sm text-stone-400">Intervention rapide</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Lock className="h-12 w-12 text-red-600 mx-auto" />
                    <h3 className="font-semibold text-stone-100">Urgence</h3>
                    <p className="text-sm text-stone-400">Service 24h/24</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Wrench className="h-12 w-12 text-red-600 mx-auto" />
                    <h3 className="font-semibold text-stone-100">Expertise</h3>
                    <p className="text-sm text-stone-400">Professionnel qualifié</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-stone-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-100 mb-4">Nos Services</h2>
            <p className="text-xl text-stone-300 max-w-2xl mx-auto">
              Une gamme complète de services de serrurerie pour particuliers et professionnels
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-stone-900 p-8 rounded-xl border border-stone-700 hover:border-red-600 transition-colors">
              <Lock className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-stone-100 mb-3">Ouverture de porte</h3>
              <p className="text-stone-400">Intervention rapide pour ouverture de porte claquée ou fermée à clé</p>
            </div>
            
            <div className="bg-stone-900 p-8 rounded-xl border border-stone-700 hover:border-red-600 transition-colors">
              <Key className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-stone-100 mb-3">Changement de serrure</h3>
              <p className="text-stone-400">Remplacement et installation de serrures haute sécurité</p>
            </div>
            
            <div className="bg-stone-900 p-8 rounded-xl border border-stone-700 hover:border-red-600 transition-colors">
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-stone-100 mb-3">Blindage de porte</h3>
              <p className="text-stone-400">Renforcement de sécurité pour votre domicile ou bureau</p>
            </div>
            
            <div className="bg-stone-900 p-8 rounded-xl border border-stone-700 hover:border-red-600 transition-colors">
              <Wrench className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-stone-100 mb-3">Réparation</h3>
              <p className="text-stone-400">Réparation de serrures endommagées ou défectueuses</p>
            </div>
            
            <div className="bg-stone-900 p-8 rounded-xl border border-stone-700 hover:border-red-600 transition-colors">
              <Clock className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-stone-100 mb-3">Urgence 24h/24</h3>
              <p className="text-stone-400">Service d'urgence disponible jour et nuit, 7j/7</p>
            </div>
            
            <div className="bg-stone-900 p-8 rounded-xl border border-stone-700 hover:border-red-600 transition-colors">
              <Key className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-stone-100 mb-3">Reproduction de clés</h3>
              <p className="text-stone-400">Duplication de clés et création de passes</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="apropos" className="py-20 bg-gradient-to-br from-black to-stone-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-stone-100">À propos de dédiée</h2>
                <p className="text-lg text-stone-300 leading-relaxed">
                  Avec plus de 10 ans d'expérience dans le domaine de la serrurerie, 
                  dédiée s'est imposée comme une référence en matière de sécurité et de fiabilité.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-600 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-100 mb-2">Expertise Professionnelle</h3>
                    <p className="text-stone-400">
                      Formation continue et certification pour garantir un service de qualité supérieure.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-red-600 p-2 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-100 mb-2">Disponibilité 24h/24</h3>
                    <p className="text-stone-400">
                      Service d'urgence disponible à tout moment pour répondre à vos besoins.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-red-600 p-2 rounded-lg">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-100 mb-2">Équipement Moderne</h3>
                    <p className="text-stone-400">
                      Utilisation d'outils et techniques de pointe pour un travail efficace et propre.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-stone-800 rounded-2xl p-8 border border-stone-700">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">10+</div>
                    <p className="text-stone-300">Années d'expérience</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">100%</div>
                    <p className="text-stone-300">Satisfaction client</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
                    <p className="text-stone-300">Service d'urgence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-stone-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-100 mb-4">Me Contacter</h2>
            <p className="text-xl text-stone-300 max-w-2xl mx-auto">
              Besoin d'un serrurier ? Contactez-moi pour une intervention rapide et professionnelle
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-stone-900 p-8 rounded-xl border border-stone-700">
                <h3 className="text-2xl font-semibold text-stone-100 mb-6">Informations de contact</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-600 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-100">Téléphone</h4>
                      <p className="text-stone-300">06 12 34 56 78</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-600 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-100">Email</h4>
                      <p className="text-stone-300">contact@astrocool.fr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-600 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-100">Zone d'intervention</h4>
                      <p className="text-stone-300">Paris et Île-de-France</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-600 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-100">Horaires</h4>
                      <p className="text-stone-300">24h/24, 7j/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-stone-900 p-8 rounded-xl border border-stone-700">
              <h3 className="text-2xl font-semibold text-stone-100 mb-6">Demande d'intervention</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-stone-300 mb-2">Nom complet</label>
                  <input 
                    type="text" 
                    className="w-full bg-stone-800 border border-stone-600 rounded-lg px-4 py-3 text-stone-100 focus:border-red-600 focus:outline-none"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label className="block text-stone-300 mb-2">Téléphone</label>
                  <input 
                    type="tel" 
                    className="w-full bg-stone-800 border border-stone-600 rounded-lg px-4 py-3 text-stone-100 focus:border-red-600 focus:outline-none"
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
                
                <div>
                  <label className="block text-stone-300 mb-2">Type d'intervention</label>
                  <select className="w-full bg-stone-800 border border-stone-600 rounded-lg px-4 py-3 text-stone-100 focus:border-red-600 focus:outline-none">
                    <option>Ouverture de porte</option>
                    <option>Changement de serrure</option>
                    <option>Réparation</option>
                    <option>Blindage</option>
                    <option>Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-stone-300 mb-2">Description</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-stone-800 border border-stone-600 rounded-lg px-4 py-3 text-stone-100 focus:border-red-600 focus:outline-none"
                    placeholder="Décrivez votre problème"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-semibold transition-colors"
                >
                  Envoyer la demande
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Key className="h-8 w-8 text-red-600" />
              <h3 className="text-2xl font-bold text-stone-100">dédiée</h3>
            </div>
            <p className="text-stone-400 mb-6">Votre serrurier de confiance, disponible 24h/24</p>
            <div className="flex justify-center space-x-8 text-stone-400">
              <span>Service d'urgence</span>
              <span>•</span>
              <span>Intervention rapide</span>
              <span>•</span>
              <span>Devis gratuit</span>
            </div>
            <div className="mt-8 pt-8 border-t border-stone-800">
              <p className="text-stone-500">© 2024 dédiée. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}