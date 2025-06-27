'use client'

import { useState } from 'react'
import { 
  Croissant, 
  Coffee, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  ChefHat,
  Wheat,
  Heart,
  Award,
  Users,
  Send
} from 'lucide-react'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

export default function BoulangerieLesDelicesDores() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Croissant className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-800">Les Délices Dorés</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#accueil" className="text-gray-700 hover:text-blue-600 transition-colors">Accueil</a>
              <a href="#produits" className="text-gray-700 hover:text-blue-600 transition-colors">Produits</a>
              <a href="#apropos" className="text-gray-700 hover:text-blue-600 transition-colors">À Propos</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="relative bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-blue-800 mb-6">
                L'Art de la 
                <span className="text-blue-600"> Boulangerie</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Découvrez nos créations artisanales préparées chaque jour avec passion. 
                Du pain traditionnel aux pâtisseries raffinées, nous sublisons les saveurs authentiques.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Coffee className="h-5 w-5" />
                  <span>Découvrir nos produits</span>
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                  Nous contacter
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-blue-100 rounded-2xl p-8 transform rotate-3">
                <div className="bg-white rounded-xl p-6 transform -rotate-6 shadow-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <ChefHat className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-blue-800">Artisanal</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <Wheat className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-blue-800">Tradition</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-blue-800">Passion</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-blue-800">Qualité</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
              Nos Spécialités
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque jour, nous préparons avec soin une sélection de produits frais 
              qui ravira vos papilles et celles de vos proches.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pain Artisanal */}
            <div className="bg-blue-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Wheat className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-blue-800 mb-4">Pain Artisanal</h4>
              <p className="text-gray-600 mb-6">
                Baguettes traditionnelles, pains de campagne, céréales et spécialités régionales 
                préparés selon les méthodes ancestrales.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Baguette tradition</li>
                <li>• Pain de campagne</li>
                <li>• Pain aux céréales</li>
                <li>• Pain complet bio</li>
              </ul>
            </div>

            {/* Viennoiseries */}
            <div className="bg-blue-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Croissant className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-blue-800 mb-4">Viennoiseries</h4>
              <p className="text-gray-600 mb-6">
                Croissants dorés, pains au chocolat fondants et autres délices 
                pour commencer la journée en beauté.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Croissants au beurre</li>
                <li>• Pains au chocolat</li>
                <li>• Chaussons aux pommes</li>
                <li>• Brioches maison</li>
              </ul>
            </div>

            {/* Pâtisseries */}
            <div className="bg-blue-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-blue-800 mb-4">Pâtisseries</h4>
              <p className="text-gray-600 mb-6">
                Créations sucrées raffinées pour vos moments de plaisir et 
                occasions spéciales, préparées par nos maîtres pâtissiers.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Éclairs et religieuses</li>
                <li>• Tartes aux fruits</li>
                <li>• Gâteaux personnalisés</li>
                <li>• Macarons artisanaux</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="apropos" className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">
                Notre Histoire
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Depuis plus de 20 ans, la boulangerie Les Délices Dorés perpétue 
                la tradition boulangère française avec passion et savoir-faire. 
                Notre équipe d'artisans boulangers-pâtissiers s'engage chaque jour 
                à vous offrir des produits d'exception.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Nous sélectionnons rigoureusement nos matières premières et 
                privilégions les circuits courts pour vous garantir fraîcheur 
                et authenticité dans chacune de nos créations.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-blue-800">500+</p>
                  <p className="text-sm text-gray-600">Clients satisfaits</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-blue-800">20+</p>
                  <p className="text-sm text-gray-600">Années d'expérience</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <h4 className="text-xl font-bold text-blue-800">Horaires d'ouverture</h4>
                </div>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span className="font-semibold">6h30 - 19h30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span className="font-semibold">6h30 - 19h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="font-semibold">7h00 - 13h00</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <Star className="h-8 w-8 text-blue-600" />
                  <h4 className="text-xl font-bold text-blue-800">Avis clients</h4>
                </div>
                <p className="text-gray-600">
                  "Les meilleurs croissants de la ville! Toujours frais et délicieux."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
              Contactez-nous
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pour toute question ou commande spéciale, n'hésitez pas à nous contacter.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Envoyer</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Croissant className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold">Les Délices Dorés</h1>
            </div>
            <div className="text-center md:text-right">
              <p>&copy; 2023 Les Délices Dorés. Tous droits réservés.</p>
              <p>123 Rue de la Boulangerie, 75000 Paris</p>
              <p>
                <Phone className="inline h-5 w-5" /> +33 1 23 45 67 89
              </p>
              <p>
                <Mail className="inline h-5 w-5" /> contact@lesdelicesdores.fr
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}