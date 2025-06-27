'use client'

import { useState } from 'react'

export default function ElFouziWebsite() {
  const [currentPage, setCurrentPage] = useState('accueil')

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-red-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">El Fouzi</h1>
          <div className="space-x-6">
            <button 
              onClick={() => setCurrentPage('accueil')}
              className={`hover:text-green-300 ${currentPage === 'accueil' ? 'text-green-300' : ''}`}
            >
              Accueil
            </button>
            <button 
              onClick={() => setCurrentPage('apropos')}
              className={`hover:text-green-300 ${currentPage === 'apropos' ? 'text-green-300' : ''}`}
            >
              À Propos
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      {currentPage === 'accueil' && (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-red-500 to-green-600 text-white py-20">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <h2 className="text-5xl font-bold mb-6">El Fouzi Business</h2>
              <p className="text-xl mb-8">Solutions professionnelles modernes</p>
              <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Découvrir nos services
              </button>
            </div>
          </section>

          {/* Services */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Nos Services</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4"></div>
                  <h4 className="text-xl font-semibold mb-2">Conseil</h4>
                  <p className="text-gray-600">Expertise professionnelle</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4"></div>
                  <h4 className="text-xl font-semibold mb-2">Solutions</h4>
                  <p className="text-gray-600">Approches innovantes</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4"></div>
                  <h4 className="text-xl font-semibold mb-2">Support</h4>
                  <p className="text-gray-600">Accompagnement continu</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gray-50 py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold mb-8 text-gray-800">Contactez-nous</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-red-600">Informations</h4>
                  <p className="mb-2">📧 contact@elfouzi.com</p>
                  <p className="mb-2">📞 +33 1 23 45 67 89</p>
                  <p>📍 Paris, France</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-green-600">Horaires</h4>
                  <p className="mb-2">Lundi - Vendredi: 9h - 18h</p>
                  <p className="mb-2">Samedi: 9h - 12h</p>
                  <p>Dimanche: Fermé</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {currentPage === 'apropos' && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">À Propos d'El Fouzi</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-full h-64 bg-gradient-to-br from-red-500 to-green-600 rounded-lg"></div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-red-600">Notre Mission</h3>
                <p className="text-gray-600 mb-6">
                  El Fouzi Business accompagne les entreprises dans leur transformation digitale 
                  avec des solutions modernes et personnalisées.
                </p>
                <h3 className="text-2xl font-semibold mb-6 text-green-600">Notre Vision</h3>
                <p className="text-gray-600 mb-6">
                  Être le partenaire de confiance pour l'innovation et la croissance 
                  de nos clients à travers des services d'excellence.
                </p>
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">10+</div>
                    <div className="text-sm text-gray-600">Années d'expérience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">100+</div>
                    <div className="text-sm text-gray-600">Clients satisfaits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 El Fouzi Business. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}