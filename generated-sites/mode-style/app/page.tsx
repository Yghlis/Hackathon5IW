'use client'

import React, { useState } from 'react';

interface NavigationItem {
  name: string;
  id: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

export default function ModeStyleBoutique() {
  const [currentPage, setCurrentPage] = useState<string>('accueil');

  const navigation: NavigationItem[] = [
    { name: 'Accueil', id: 'accueil' },
    { name: 'Boutique', id: 'boutique' },
    { name: 'Contact', id: 'contact' }
  ];

  const products: Product[] = [
    { id: 1, name: 'Robe Tendance', price: '45€', image: '/api/placeholder/300/400', category: 'Robes' },
    { id: 2, name: 'Top Moderne', price: '25€', image: '/api/placeholder/300/400', category: 'Hauts' },
    { id: 3, name: 'Jean Stylé', price: '55€', image: '/api/placeholder/300/400', category: 'Pantalons' },
    { id: 4, name: 'Veste Chic', price: '75€', image: '/api/placeholder/300/400', category: 'Vestes' },
    { id: 5, name: 'Jupe Élégante', price: '35€', image: '/api/placeholder/300/400', category: 'Jupes' },
    { id: 6, name: 'Chemise Mode', price: '40€', image: '/api/placeholder/300/400', category: 'Hauts' }
  ];

  const AccueilPage = () => (
    <div className="space-y-16">
      <section className="relative bg-gradient-to-r from-pink-100 to-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Mode<span className="text-pink-500">&</span>Style
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Découvrez les dernières tendances mode pour les jeunes. 
            Des styles modernes et abordables qui évoluent avec vous.
          </p>
          <button 
            onClick={() => setCurrentPage('boutique')}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Découvrir la Collection
          </button>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Nos <span className="text-pink-500">Coups de Cœur</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="aspect-square bg-pink-50 flex items-center justify-center">
                  <div className="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-semibold">IMG</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-pink-500 font-bold text-lg">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-pink-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Pourquoi Choisir <span className="text-pink-500">Mode&Style</span> ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Tendances Actuelles</h3>
              <p className="text-gray-600">Toujours à la pointe de la mode avec les dernières tendances</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Prix Abordables</h3>
              <p className="text-gray-600">Des styles modernes accessibles à tous les budgets</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Pour les Jeunes</h3>
              <p className="text-gray-600">Spécialement conçu pour la génération moderne</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const BoutiquePage = () => (
    <div className="space-y-12">
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Notre <span className="text-pink-500">Boutique</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explorez notre collection complète de vêtements tendance
        </p>
      </div>

      <div className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="aspect-square bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors duration-300">
                  <div className="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-pink-600 font-semibold">IMG</span>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-sm text-pink-500 font-medium">{product.category}</span>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-pink-500 font-bold text-lg">{product.price}</p>
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300">
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="space-y-12">
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          <span className="text-pink-500">Contactez</span> Nous
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Une question ? Une suggestion ? Nous sommes là pour vous écouter
        </p>
      </div>

      <div className="px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Envoyez-nous un message</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-300"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-300"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-300">
                    <option>Question générale</option>
                    <option>Commande</option>
                    <option>Retour/Échange</option>
                    <option>Suggestion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-300 resize-none"
                    placeholder="Votre message..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  Envoyer le message
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-pink-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Nos coordonnées</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Adresse</h3>
                      <p className="text-gray-600">123 Rue de la Mode, 75001 Paris</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white">📞</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Téléphone</h3>
                      <p className="text-gray-600">01 23 45 67 89</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-600">contact@modestyle.fr</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Horaires d'ouverture</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lundi - Vendredi</span>
                    <span className="font-semibold text-gray-800">10h - 19h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Samedi</span>
                    <span className="font-semibold text-gray-800">10h - 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimanche</span>
                    <span className="font-semibold text-gray-800">Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                <a href="#" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-800 text-lg">Mode&Style</span>
                </a>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`py-4 px-2 text-gray-800 font-semibold hover:text-pink-500 transition duration-300 ${
                      currentPage === item.id ? 'text-pink-500' : ''
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {currentPage === 'accueil' && <AccueilPage />}
        {currentPage === 'boutique' && <BoutiquePage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>
    </div>
  );
}