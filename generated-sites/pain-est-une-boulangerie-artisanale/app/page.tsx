'use client'

import { useState } from 'react'

export default function PainBoulangerie() {
  const [activeSection, setActiveSection] = useState('accueil')

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pain</h1>
          <div className="space-x-6">
            <button 
              onClick={() => setActiveSection('accueil')}
              className={`hover:text-blue-200 ${activeSection === 'accueil' ? 'underline' : ''}`}
            >
              Accueil
            </button>
            <button 
              onClick={() => setActiveSection('services')}
              className={`hover:text-blue-200 ${activeSection === 'services' ? 'underline' : ''}`}
            >
              Services
            </button>
            <button 
              onClick={() => setActiveSection('contact')}
              className={`hover:text-blue-200 ${activeSection === 'contact' ? 'underline' : ''}`}
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      {activeSection === 'accueil' && (
        <div>
          {/* Hero Section */}
          <section className="bg-blue-50 py-20">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <h2 className="text-5xl font-bold text-blue-900 mb-6">
                Boulangerie Artisanale Pain
              </h2>
              <p className="text-xl text-blue-700 mb-8">
                Des pains frais et authentiques, préparés avec passion chaque jour
              </p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Découvrir nos produits
              </button>
            </div>
          </section>

          {/* About */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-blue-900 mb-6">
                    Notre Savoir-Faire
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Depuis trois générations, nous perpétuons la tradition boulangère française avec des méthodes artisanales et des ingrédients de qualité.
                  </p>
                  <p className="text-gray-700">
                    Chaque pain est pétri à la main et cuit dans notre four traditionnel pour vous offrir des saveurs authentiques.
                  </p>
                </div>
                <div className="bg-blue-100 h-64 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">Image boulangerie</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeSection === 'services' && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
              Nos Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Pains Traditionnels</h3>
                <p className="text-gray-700">Baguettes, pains de campagne, pains complets</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Viennoiseries</h3>
                <p className="text-gray-700">Croissants, pains au chocolat, brioches</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Commandes Spéciales</h3>
                <p className="text-gray-700">Pains personnalisés pour vos événements</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'contact' && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
              Nous Contacter
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-6">Informations</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-800">Adresse</h4>
                    <p className="text-gray-700">123 Rue de la Boulangerie<br />75001 Paris</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Téléphone</h4>
                    <p className="text-gray-700">01 23 45 67 89</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Horaires</h4>
                    <p className="text-gray-700">
                      Lun-Sam: 6h30 - 19h30<br />
                      Dimanche: 7h00 - 13h00
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-6">Message</h3>
                <form className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Nom" 
                    className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <textarea 
                    placeholder="Votre message" 
                    rows={4}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                  ></textarea>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Envoyer
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Boulangerie Pain. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}