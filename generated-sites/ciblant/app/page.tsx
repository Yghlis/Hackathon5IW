```tsx
'use client'

import { useState } from 'react'
import { 
  Heart, 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star,
  Baby,
  Gamepad2,
  Coffee,
  Camera,
  Music,
  Palette,
  Send,
  CheckCircle
} from 'lucide-react'

export default function CiblantLanding() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                ciblant
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-red-500 transition-colors">Services</a>
              <a href="#about" className="text-gray-700 hover:text-red-500 transition-colors">À propos</a>
              <a href="#contact" className="text-gray-700 hover:text-red-500 transition-colors">Contact</a>
            </nav>
            <button className="bg-gradient-to-r from-red-500 to-blue-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">
              Réserver
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Un lieu magique pour 
                  <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent"> toute la famille</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Découvrez ciblant, l'espace familial où parents et enfants créent ensemble des souvenirs inoubliables. 
                  Activités, détente et moments de complicité vous attendent.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-red-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Découvrir nos activités
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-red-500 hover:text-red-500 transition-all duration-300">
                  Planifier une visite
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-red-400 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-sm text-gray-600">+500 familles satisfaites</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9/5</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-red-100 to-blue-100 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <Baby className="w-8 h-8 text-red-500 mb-3" />
                    <h3 className="font-semibold text-gray-900">Espace Enfants</h3>
                    <p className="text-sm text-gray-600">Activités adaptées à tous les âges</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <Coffee className="w-8 h-8 text-blue-500 mb-3" />
                    <h3 className="font-semibold text-gray-900">Détente Parents</h3>
                    <p className="text-sm text-gray-600">Moments de relaxation</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <Users className="w-8 h-8 text-red-500 mb-3" />
                    <h3 className="font-semibold text-gray-900">Activités Familiales</h3>
                    <p className="text-sm text-gray-600">Ensemble c'est mieux</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <Calendar className="w-8 h-8 text-blue-500 mb-3" />
                    <h3 className="font-semibold text-gray-900">Événements</h3>
                    <p className="text-sm text-gray-600">Animations spéciales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nos <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une gamme complète d'activités et de services pensés pour le bonheur de toute la famille
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-6">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Jeux & Activités</h3>
              <p className="text-gray-600 mb-6">
                Espace de jeux sécurisé avec des activités adaptées à chaque tranche d'âge. 
                Jeux éducatifs, créatifs et ludiques pour stimuler l'imagination.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-500 mr-2" />Jeux éducatifs 3-12 ans</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-500 mr-2" />Espace bébé sécurisé</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-500 mr-2" />Activités créatives</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ateliers Créatifs</h3>
              <p className="text-gray-600 mb-6">
                Ateliers artistiques et créatifs pour développer la créativité des enfants 
                avec l'accompagnement bienveillant des parents.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-blue-500 mr-2" />Peinture et dessin</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-blue-500 mr-2" />Modelage et sculpture</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-blue-500 mr-2" />Bricolage créatif</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Éveil Musical</h3>
              <p className="text-gray-600 mb-6">
                Séances d'éveil musical pour développer le sens du rythme et la sensibilité 
                artistique dans une ambiance conviviale.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-purple-500 mr-2" />Chansons et comptines</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-purple-500 mr-2" />Instruments adaptés</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-purple-500 mr-2" />Spectacles musicaux</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Espace Détente</h3>
              <p className="text-gray-600 mb-6">
                Un coin cosy pour les parents avec boissons chaudes et collations 
                pendant que les enfants s'amusent en toute sécurité.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Café et thé premium</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Collations saines</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Espace lecture</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Contactez <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Nous</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pour toute question ou réservation, n'hésitez pas à nous contacter via le formulaire ci-dessous.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  rows={4}
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-blue-500 text-white px-6 py-3 rounded-md shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  Envoyer
                </button>
              </div>
              {isSubmitted && (
                <div className="text-center text-green-500 mt-4">
                  Merci pour votre message! Nous vous répondrons bientôt.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                ciblant
              </h1>
            </div>
            <div className="text-sm">
              © 2023 Ciblant. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
```