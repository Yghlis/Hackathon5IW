```tsx
'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Wrench, Users, Shield, CheckCircle, Menu, X, Star, ArrowRight } from 'lucide-react'

export default function DiabloConseil() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
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
    alert('Merci pour votre message ! Nous vous contacterons bientôt.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    })
  }

  const services = [
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Dépannage Technique",
      description: "Intervention rapide pour tous vos problèmes techniques, équipements et installations."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Conseil Particuliers",
      description: "Accompagnement personnalisé pour vos projets et besoins spécifiques."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Support Professionnel",
      description: "Solutions expertes pour les entreprises et professionnels."
    }
  ]

  const features = [
    "Intervention 7j/7",
    "Devis gratuit",
    "Équipe qualifiée",
    "Tarifs transparents"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-green-500 rounded-full flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Diablo est une</h1>
                <p className="text-sm text-green-600 font-medium">Conseil & Dépannage</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#accueil" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Accueil</a>
              <a href="#services" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Services</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Contact</a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg bg-amber-100 text-amber-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <a href="#accueil" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Accueil</a>
                <a href="#services" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Services</a>
                <a href="#contact" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Contact</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Votre Expert en
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-green-600"> Conseil & Dépannage</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Nous accompagnons particuliers et professionnels avec des solutions expertes et un service de dépannage réactif. Votre satisfaction est notre priorité.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Appeler Maintenant</span>
                </button>
                <button className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2">
                  <ArrowRight className="w-5 h-5" />
                  <span>Devis Gratuit</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-amber-400 to-green-500 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-green-500 rounded-full flex items-center justify-center">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Service Premium</h3>
                      <p className="text-gray-600">Excellence garantie</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Satisfaction client</span>
                      <span className="text-green-600 font-bold">98%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Interventions réussies</span>
                      <span className="text-green-600 font-bold">500+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Années d'expérience</span>
                      <span className="text-green-600 font-bold">10+</span>
                    </div>
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
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nos Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des solutions complètes adaptées à vos besoins, que vous soyez particulier ou professionnel
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-amber-50 to-green-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-200">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-green-500 rounded-xl flex items-center justify-center text-white mb-6">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-amber-500 to-green-500 rounded-3xl p-8 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Besoin d'une intervention urgente ?</h3>
            <p className="text-xl mb-6 opacity-90">Notre équipe est disponible 7j/7 pour vos urgences</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-xl px-6 py-3">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Intervention sous 2h</span>
              </div>
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-xl px-6 py-3">
                <Phone className="w-5 h-5" />
                <span className="font-semibold">01 23 45 67 89</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-amber-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Contactez-nous</h2>
            <p className="text-xl text-gray-600">
              Prêt à démarrer votre projet ? Contactez-nous pour un devis gratuit
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Informations de Contact</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-green-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Téléphone</h4>
                      <p className="text-gray-600">01 23 45 67 89</p>
                      <p className="text-sm text-green-600">Disponible 7j/7</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-green-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Email</h4>
                      <p className="text-gray-600">contact@diabloestune.fr</p>
                      <p className="text-sm text-green-600">Réponse sous 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-green-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Adresse</h4>
                      <p className="text-gray-600">123 Rue de l'Exemple, 75000 Paris</p>
                      <p className="text-sm text-green-600">France</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Formulaire de Contact</h3>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service</label>
                      <select
                        name="service"
                        id="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Sélectionnez un service</option>
                        <option value="Dépannage Technique">Dépannage Technique</option>
                        <option value="Conseil Particuliers">Conseil Particuliers</option>
                        <option value="Support Professionnel">Support Professionnel</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <textarea
                        name="message"
                        id="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-green-500 text-white py-3 rounded-md font-semibold hover:from-amber-600 hover:to-green-600 transition-all duration-300"
                      >
                        Envoyer
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-white">
            <p className="text-sm">&copy; 2023 Diablo Conseil. Tous droits réservés.</p>
            <div className="flex space-x-4">
              <a href="#accueil" className="text-sm hover:text-green-500">Accueil</a>
              <a href="#services" className="text-sm hover:text-green-500">Services</a>
              <a href="#contact" className="text-sm hover:text-green-500">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
```