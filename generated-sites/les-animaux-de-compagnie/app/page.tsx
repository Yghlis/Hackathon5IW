'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Heart, Shield, Clock, Users, Star, Facebook, Twitter, Instagram, Send } from 'lucide-react'

export default function PetBusinessWebsite() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Merci pour votre message! Nous vous contacterons bientôt.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600 mr-2" />
              <span className="text-2xl font-bold text-blue-900">PetCare Pro</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#hero" className="text-blue-900 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Accueil
                </a>
                <a href="#services" className="text-blue-900 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Services
                </a>
                <a href="#contact" className="text-blue-900 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Contact
                </a>
                <a href="tel:+33123456789" className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                  Appeler Maintenant
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-16 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
                Soins Professionnels pour vos
                <span className="text-red-600 block">Animaux de Compagnie</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Offrez à vos compagnons à quatre pattes les meilleurs soins avec notre équipe de professionnels expérimentés. 
                Toilettage, garde, soins vétérinaires et bien plus encore.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#contact" 
                  className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors text-center"
                >
                  Prendre Rendez-vous
                </a>
                <a 
                  href="#services" 
                  className="border-2 border-blue-900 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-900 hover:text-white transition-colors text-center"
                >
                  Nos Services
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-red-400 to-blue-600 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 text-center">
                  <Heart className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">+1000</h3>
                  <p className="text-gray-600">Animaux Heureux</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-4 shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Nos Services Professionnels</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une gamme complète de services pour répondre à tous les besoins de vos animaux de compagnie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
              <div className="bg-blue-600 rounded-full p-4 w-16 h-16 mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Soins Vétérinaires</h3>
              <p className="text-gray-600 mb-6">
                Consultations, vaccinations, examens de santé complets par nos vétérinaires qualifiés.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Consultations générales</li>
                <li>• Vaccinations et rappels</li>
                <li>• Examens préventifs</li>
                <li>• Urgences vétérinaires</li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-red-100">
              <div className="bg-red-600 rounded-full p-4 w-16 h-16 mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Toilettage Premium</h3>
              <p className="text-gray-600 mb-6">
                Services de toilettage complets pour maintenir vos animaux propres et beaux.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Bain et séchage</li>
                <li>• Coupe et stylisme</li>
                <li>• Soin des ongles</li>
                <li>• Nettoyage des oreilles</li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
              <div className="bg-blue-600 rounded-full p-4 w-16 h-16 mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Garde d'Animaux</h3>
              <p className="text-gray-600 mb-6">
                Service de garde professionnel pour vos absences, avec suivi personnalisé.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Garde à domicile</li>
                <li>• Pension sécurisée</li>
                <li>• Promenades quotidiennes</li>
                <li>• Suivi photo/vidéo</li>
              </ul>
            </div>

            {/* Service 4 */}
            <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-red-100">
              <div className="bg-red-600 rounded-full p-4 w-16 h-16 mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Éducation Canine</h3>
              <p className="text-gray-600 mb-6">
                Programmes d'éducation et de dressage adaptés à chaque animal.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Éducation de base</li>
                <li>• Correction comportementale</li>
                <li>• Socialisation</li>
                <li>• Cours collectifs</li>
              </ul>
            </div>

            {/* Service 5 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
              <div className="bg-blue-600 rounded-full p-4 w-16 h-16 mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Spa & Bien-être</h3>
              <p className="text-gray-600 mb-6">
                Traitements de bien-être et de relaxation pour le confort de vos animaux.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Massages thérapeutiques</li>
                <li>• Aromathérapie</li>
                <li>• Soins de la peau</li>
                <li>• Relaxation guidée</li>
              </ul>
            </div>

            {/* Service 6 */}
            <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-red-100">
              <div className="bg-red-600 rounded-full p-4 w-16 h-16 mb-6">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Urgences 24/7</h3>
              <p className="text-gray-600 mb-6">
                Service d'urgence disponible 24h/24 et 7j/7 pour vos animaux.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Ligne d'urgence</li>
                <li>• Intervention rapide</li>
                <li>• Transport sécurisé</li>
                <li>• Suivi post-urgence</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Ce que disent nos clients</h2>
            <p className="text-xl text-gray-600">Des témoignages authentiques de propriétaires satisfaits</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Service exceptionnel ! Mon chien Max adore venir ici. L'équipe est professionnelle et très attentionnée."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
                  M
                

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">les animaux de compagnie</h3>
            <p className="text-gray-400 mb-6">Votre partenaire de confiance</p>
            <div className="flex justify-center space-x-8 text-gray-400">
              <span>Service professionnel</span>
              <span>•</span>
              <span>Qualité garantie</span>
              <span>•</span>
              <span>Satisfaction client</span>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-500">© 2024 les animaux de compagnie. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
                <div className="ml-4">
                  <h4 className="font-bold text-
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>

}
