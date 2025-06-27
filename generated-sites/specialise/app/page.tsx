'use client'

import React from 'react'
import { useState } from 'react'

export default function RestaurantHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Restaurant Spécialisé
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Une expérience culinaire exceptionnelle
          </p>
          <button className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Réserver une table
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Contact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-red-600 mb-4">Adresse</h3>
              <p className="text-gray-700">
                123 Rue de la Gastronomie<br />
                75001 Paris, France
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-600 mb-4">Téléphone</h3>
              <p className="text-gray-700">+33 1 23 45 67 89</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-600 mb-4">Horaires</h3>
              <p className="text-gray-700">
                Mar - Dim: 18h00 - 23h00<br />
                Fermé le lundi
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">spécialisé</h3>
              <p className="text-gray-400">Votre partenaire de confiance pour tous vos besoins.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">📞 01 23 45 67 89</p>
              <p className="text-gray-400">✉️ contact@spécialisé.fr</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Horaires</h4>
              <p className="text-gray-400">Lun-Ven: 9h-18h</p>
              <p className="text-gray-400">Sam: 9h-12h</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 spécialisé. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}