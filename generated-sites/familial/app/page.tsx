'use client'

- 'use client' directive
'use client'

import { useState } from 'react'

export default function ElFuegoHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-600">El Fuego</h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#accueil" className="text-red-600 hover:text-red-800 px-3 py-2 text-sm font-medium">Accueil</a>
                <a href="#menu" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">Menu</a>
                <a href="#apropos" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">À Propos</a>
                <a href="#contact" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">Contact</a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-red-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              <a href="#accueil" className="text-red-600 block px-3 py-2 text-base font-medium">Accueil</a>
              <a href="#menu" className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium">Menu</a>
              <a href="#apropos" className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium">À Propos</a>
              <a href="#contact" className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="accueil" className="pt-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">El Fuego</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Restaurant familial offrant une expérience culinaire unique avec des plats savoureux dans un cadre chaleureux et accueillant
            </p>
            <div className="space-x-4">
              <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                Voir le Menu
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition duration-300">
                Réserver
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="apropos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
              <p className="text-lg text-gray-700 mb-6">
                Depuis plus de 20 ans, El Fuego accueille les familles dans une atmosphère chaleureuse et conviviale. 
                Notre passion pour la cuisine authentique et les saveurs exceptionnelles nous guide dans chaque plat que nous servons.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Nous utilisons uniquement des ingrédients frais et de qualité, préparés avec amour par notre équipe de chefs expérimentés.
              </p>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-red-600">20+</div>
                  <div className="text-sm text-gray-600">Années d'expérience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">1000+</div>
                  <div className="text-sm text-gray-600">Clients satisfaits</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">50+</div>
                  <div className="text-sm text-gray-600">Plats au menu</div>
                </div>
              </div>
            </div>
            <div className="bg-red-100 rounded-lg p-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Qualité Garantie</h3>
                <p className="text-gray-700">
                  Chaque plat est préparé avec soin et attention pour vous offrir une expérience culinaire inoubliable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section id="menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nos Spécialités</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez quelques-uns de nos plats les plus appréciés, préparés avec passion et servis avec le sourire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Paella Valenciana",
                description: "Riz saffrané aux fruits de mer et poulet, cuit dans notre paellera traditionnelle",
                price: "28€"
              },
              {
                name: "Tapas Mixtes",
                description: "Sélection de nos meilleures tapas : jambon ibérique, fromages, olives marinées",
                price: "18€"
              },
              {
                name: "Grillades El Fuego",
                description: "Viandes grillées au feu de bois, accompagnées de légumes de saison",
                price: "32€"
              }
            ].map((dish, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{dish.name}</h3>
                  <span className="text-2xl font-bold text-red-600">{dish.price}</span>
                </div>
                <p className="text-gray-700">{dish.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300">
              Voir le Menu Complet
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nous Contacter</h2>
            <p className="text-xl">Venez nous rendre visite ou contactez-nous pour réserver votre table</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Adresse</h3>
              <p>123 Rue de la Gastronomie<br/>75001 Paris, France</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Téléphone</h3>
              <p>+33 1 23 45 67 89</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Horaires</h3>
              <p>Mar-Dim: 12h-14h30<br/>19h-22h30<br/>Fermé le lundi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-red-400 mb-4">El Fuego</h3>
            <p className="text-gray-400 mb-4">Restaurant familial - Cuisine authentique</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-red-400 transition duration-300">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition duration-300">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition duration-300">TripAdvisor</a>
            </div>
            <div className="mt-8 pt-8 border-t