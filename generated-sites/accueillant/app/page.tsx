```tsx
'use client'

import { useState } from 'react'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Utensils, 
  Coffee, 
  Wine, 
  Users, 
  Heart,
  ChefHat,
  Leaf,
  Award,
  Send
} from 'lucide-react'

export default function AccueillantRestaurant() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-red-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-yellow-400" />
              <h1 className="text-2xl md:text-3xl font-bold">Accueillant</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#accueil" className="hover:text-yellow-400 transition-colors">Accueil</a>
              <a href="#menu" className="hover:text-yellow-400 transition-colors">Menu</a>
              <a href="#services" className="hover:text-yellow-400 transition-colors">Services</a>
              <a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="relative bg-gradient-to-br from-red-700 via-red-600 to-amber-600 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Bienvenue chez <span className="text-yellow-400">Accueillant</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-amber-100">
              Une expérience culinaire authentique dans un cadre rustique et chaleureux
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold">Cuisine Traditionnelle</span>
              </div>
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <Heart className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold">Ambiance Familiale</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-red-900 font-bold py-3 px-8 rounded-full transition-colors transform hover:scale-105">
                Réserver une Table
              </button>
              <button className="border-2 border-white hover:bg-white hover:text-red-800 font-bold py-3 px-8 rounded-full transition-colors">
                Voir le Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">Notre Histoire</h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Depuis plus de 20 ans, Accueillant vous propose une cuisine authentique dans un cadre rustique 
              qui rappelle les traditions culinaires de nos régions. Chaque plat est préparé avec passion 
              et des ingrédients locaux de qualité.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-amber-50 rounded-lg border-2 border-yellow-400">
              <Leaf className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-red-800 mb-2">Ingrédients Locaux</h4>
              <p className="text-gray-700">
                Nous privilégions les producteurs locaux pour vous offrir des saveurs authentiques et fraîches.
              </p>
            </div>
            <div className="text-center p-6 bg-amber-50 rounded-lg border-2 border-yellow-400">
              <Award className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-red-800 mb-2">Savoir-Faire</h4>
              <p className="text-gray-700">
                Notre équipe de chefs expérimentés perpétue les traditions culinaires avec modernité.
              </p>
            </div>
            <div className="text-center p-6 bg-amber-50 rounded-lg border-2 border-yellow-400">
              <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-red-800 mb-2">Accueil Chaleureux</h4>
              <p className="text-gray-700">
                Une atmosphère conviviale où chaque client est accueilli comme un membre de la famille.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section id="menu" className="py-16 bg-gradient-to-br from-amber-100 to-yellow-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">Nos Spécialités</h3>
            <p className="text-lg text-gray-700">
              Découvrez nos plats signature qui font la réputation d'Accueillant
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-red-200 hover:border-yellow-400 transition-colors">
              <div className="h-48 bg-gradient-to-br from-red-400 to-amber-400 flex items-center justify-center">
                <Utensils className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-red-800 mb-2">Plats Traditionnels</h4>
                <p className="text-gray-700 mb-4">
                  Coq au vin, bœuf bourguignon, cassoulet... Nos grands classiques revisités.
                </p>
                <span className="text-yellow-600 font-bold text-lg">À partir de 18€</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-red-200 hover:border-yellow-400 transition-colors">
              <div className="h-48 bg-gradient-to-br from-red-400 to-amber-400 flex items-center justify-center">
                <Wine className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-red-800 mb-2">Cave à Vins</h4>
                <p className="text-gray-700 mb-4">
                  Une sélection de vins régionaux soigneusement choisis pour accompagner vos repas.
                </p>
                <span className="text-yellow-600 font-bold text-lg">À partir de 4€</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-red-200 hover:border-yellow-400 transition-colors">
              <div className="h-48 bg-gradient-to-br from-red-400 to-amber-400 flex items-center justify-center">
                <Coffee className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-red-800 mb-2">Desserts Maison</h4>
                <p className="text-gray-700 mb-4">
                  Tarte tatin, crème brûlée, mousse au chocolat... Tous préparés sur place.
                </p>
                <span className="text-yellow-600 font-bold text-lg">À partir de 7€</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-full transition-colors">
              Voir la Carte Complète
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">Nos Services</h3>
            <p className="text-lg text-gray-700">
              Accueillant s'adapte à tous vos événements et occasions spéciales
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4 p-6 bg-amber-50 rounded-lg">
              <div className="bg-red-600 p-3 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-red-800 mb-2">Événements Privés</h4>
                <p className="text-gray-700">
                  Anniversaires, réunions de famille, célébrations... Nous organisons vos événements 
                  dans notre salle privée pouvant accueillir jusqu'à 50 personnes.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-6 bg-amber-50 rounded-lg">
              <div className="bg-red-600 p-3 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-red-800 mb-2">Repas d'Affaires</h4>
                <p className="text-gray-700">
                  Un cadre professionnel et discret pour vos déjeuners et dîners d'affaires. 
                  Menus spéciaux et service adapté disponibles.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-6 bg-amber-50 rounded-lg">
              <div className="bg-red-600 p-3 rounded-full">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-red-800 mb-2">Traiteur</h4>
                <p className="text-gray-700">
                  Service traiteur pour vos événements extérieurs. Nos plats signature 
                  livrés chez vous ou sur votre lieu de réception.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-6 bg-amber-50 rounded-lg">
              <div className="bg-red-600 p-3 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-red-800 mb-2">Horaires Flexibles</h4>
                <p className="text-gray-700">
                  Ouvert 7j/7 avec des horaires étendus. Possibilité d'ouverture exceptionnelle 
                  pour vos événements spéciaux.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gradient-to-br from-red-700 via-red-600 to-amber-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Contactez-Nous</h3>
            <p className="text-lg">
              Pour toute réservation ou information, n'hésitez pas à nous contacter
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-2">Nom</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="p-3 rounded-lg border-2 border-yellow-400" required />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="mb-2">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="p-3 rounded-lg border-2 border-yellow-400" required />
              </div>
              <div className="flex flex-col">
                <label htmlFor="phone" className="mb-2">Téléphone</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="p-3 rounded-lg border-2 border-yellow-400" required />
              </div>
              <div className="flex flex-col">
                <label htmlFor="date" className="mb-2">Date</label>
                <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} className="p-3 rounded-lg border-2 border-yellow-400" required />
              </div>
              <div className="flex flex-col">
                <label htmlFor="guests" className="mb-2">Nombre de Convives</label>
                <input type="number" id="guests" name="guests" value={formData.guests} onChange={handleInputChange} className="p-3 rounded-lg border-2 border-yellow-400" required />
              </div>
              <div className="flex flex-col">
                <label htmlFor="message" className="mb-2">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} className="p-3 rounded-lg border-2 border-yellow-400" rows={4} required></textarea>
              </div>
              <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-red-900 font-bold py-3 px-8 rounded-full transition-colors transform hover:scale-105">
                Envoyer <Send className="inline-block ml-2" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ChefHat className="h-8 w-8 text-yellow-400" />
              <span className="text-xl font-bold">Accueillant</span>
            </div>
            <div className="flex space-x-6">
              <a href="#accueil" className="hover:text-yellow-400 transition-colors">Accueil</a>
              <a href="#menu" className="hover:text-yellow-400 transition-colors">Menu</a>
              <a href="#services" className="hover:text-yellow-400 transition-colors">Services</a>
              <a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center mt-4">
            <p>&copy; 2023 Accueillant. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
```