'use client'

1. 'use client' directive
'use client'

import { useState } from 'react'

export default function PizzeriaMarioBros() {
  const [currentPage, setCurrentPage] = useState('accueil')

  const renderPage = () => {
    switch (currentPage) {
      case 'accueil':
        return (
          <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-red-600 to-green-600 text-white py-20 px-4 rounded-lg">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif">
                  Pizzeria Mario Bros
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  Benvenuti nella famiglia! Découvrez l'authentique cuisine italienne
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => setCurrentPage('services')}
                    className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Voir nos Pizzas
                  </button>
                  <button 
                    onClick={() => setCurrentPage('contact')}
                    className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-colors"
                  >
                    Nous Contacter
                  </button>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="py-16 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6 font-serif">
                      Notre Histoire
                    </h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Depuis 1985, la famille Mario accueille les familles dans une atmosphère 
                      chaleureuse et authentique. Nos recettes traditionnelles, transmises de 
                      génération en génération, vous transportent directement en Italie.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Chaque pizza est préparée avec amour, des ingrédients frais importés 
                      d'Italie, et cuite dans notre four à bois traditionnel.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-green-50 p-8 rounded-lg">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🍕</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        Tradition Italienne
                      </h3>
                      <p className="text-gray-600">
                        Four à bois • Ingrédients authentiques • Recettes familiales
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="bg-gray-50 py-16 px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 font-serif">
                  Pourquoi Choisir Mario Bros?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <div className="text-4xl mb-4 text-red-600">👨‍👩‍👧‍👦</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Familial</h3>
                    <p className="text-gray-600">
                      Ambiance conviviale parfaite pour les familles avec enfants
                    </p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <div className="text-4xl mb-4 text-green-600">🇮🇹</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Authentique</h3>
                    <p className="text-gray-600">
                      Recettes traditionnelles italiennes et ingrédients importés
                    </p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <div className="text-4xl mb-4 text-red-600">🔥</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Four à Bois</h3>
                    <p className="text-gray-600">
                      Cuisson traditionnelle pour un goût incomparable
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )

      case 'services':
        return (
          <div className="space-y-16">
            <section className="py-16 px-4">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl font-bold text-center text-gray-800 mb-4 font-serif">
                  Nos Services
                </h1>
                <p className="text-xl text-center text-gray-600 mb-12">
                  Découvrez notre sélection de pizzas authentiques et nos services
                </p>

                {/* Pizza Menu */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Nos Pizzas Signature
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      { name: 'Margherita', price: '12€', desc: 'Tomate, mozzarella, basilic frais' },
                      { name: 'Mario Special', price: '16€', desc: 'Tomate, mozzarella, pepperoni, champignons, olives' },
                      { name: 'Quattro Stagioni', price: '15€', desc: 'Tomate, mozzarella, jambon, champignons, artichauts, olives' },
                      { name: 'Prosciutto', price: '14€', desc: 'Tomate, mozzarella, jambon de Parme, roquette' },
                      { name: 'Vegetariana', price: '13€', desc: 'Tomate, mozzarella, légumes grillés, basilic' },
                      { name: 'Calzone', price: '15€', desc: 'Pizza fermée, ricotta, mozzarella, jambon' }
                    ].map((pizza, index) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-800">{pizza.name}</h3>
                          <span className="text-2xl font-bold text-green-600">{pizza.price}</span>
                        </div>
                        <p className="text-gray-600">{pizza.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="bg-red-50 p-8 rounded-lg">
                    <h3 className="text-2xl font-bold text-red-600 mb-4">🚚 Livraison</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Livraison gratuite dès 25€</li>
                      <li>• Zone de livraison: 10km</li>
                      <li>• Délai: 30-45 minutes</li>
                      <li>• Commande en ligne ou par téléphone</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-8 rounded-lg">
                    <h3 className="text-2xl font-bold text-green-600 mb-4">🏪 À Emporter</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Commande par téléphone</li>
                      <li>• Prêt en 15-20 minutes</li>
                      <li>• Réduction de 10% sur commandes à emporter</li>
                      <li>• Parking gratuit devant le restaurant</li>
                    </ul>
                  </div>
                </div>

                {/* Events */}
                <div className="mt-16 bg-gradient-to-r from-red-600 to-green-600 text-white p-8 rounded-lg text-center">
                  <h3 className="text-3xl font-bold mb-4">Événements & Groupes</h3>
                  <p className="text-lg mb-6">
                    Organisez vos anniversaires, réunions de famille ou événements d'entreprise
                  </p>
                  <button 
                    onClick={() => setCurrentPage('contact')}
                    className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Réserver Maintenant
                  </button>
                </div>
              </div>
            </section>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-16">
            <section className="py-16 px-4">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl font-bold text-center text-gray-800 mb-4 font-serif">
                  Contactez-Nous
                </h1>
                <p className="text-xl text-center text-gray-600 mb-12">
                  Nous sommes là pour vous servir!
                </p>

                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Contact Info */}
                  <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
                        📍 Adresse
                      </h3>
                      <p className="text-gray-700 text-lg">
                        123 Rue de la Pizza<br />
                        75001 Paris, France
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center">
                        📞 Téléphone
                      </h3>
                      <p className="text-gray-700 text-lg">
                        01 23 45 67 89<br />
                        <span className="text-sm text-gray-500">Commandes et réservations</span>
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
                        🕒 Horaires
                      </h3>
                      <div className="text-gray-700">
                        <p><strong>Lundi - Jeudi:</strong> 11h30 - 14h30, 18h00 - 22h30</p>
                        <p><strong>Vendredi - Samedi:</strong> 11h30 - 14h30, 18h00 - 23h00</p>
                        <p><strong>Dimanche:</strong> 18h00 - 22h00</p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center">
                        ✉️ Email
                      </h3>
                      <p className="text-gray-700 text-lg">
                        contact@pizzeria-mariobros.fr
                      </p>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="bg-white p-8 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                      Envoyez-nous un message
                    </h3>
                    <form className="space-y-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Nom complet
                        </label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Email
                        </label>
                        <input 
                          type="email" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                          placeholder="votre@email.com"
                        />
                      </div>
                      <div>
                        <label className="
        </div>
        </div>
        </div>
        </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">qui cible principalement les familles</h3>
              <p className="text-gray-400">Votre partenaire de confiance pour tous vos besoins.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">📞 01 23 45 67 89</p>
              <p className="text-gray-400">✉️ contact@quicibleprincipalementlesfamilles.fr</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Horaires</h4>
              <p className="text-gray-400">Lun-Ven: 9h-18h</p>
              <p className="text-gray-400">Sam: 9h-12h</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 qui cible principalement les familles. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}