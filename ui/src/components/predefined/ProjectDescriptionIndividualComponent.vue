<template>
  <div class="predefined-component project-description-component">
   

    <div class="description-guidance">
      <div class="instruction-box">
        <p class="instruction-text">
          💬 <strong>Répondez directement dans l'input du chat</strong>
        </p>
        <p class="example-text">
          Décrivez votre activité, vos objectifs, votre public cible...
        </p>
      </div>
      
      <div class="input-help">
        <p><strong>💡 Exemples selon votre secteur :</strong></p>
        <ul>
          <li>🛒 <strong>E-commerce :</strong> "Boutique en ligne de montres haut de gamme pour hommes d'affaires, avec catalogue produits et paiement sécurisé"</li>
          <li>🏢 <strong>Entreprise :</strong> "Cabinet dentaire moderne à Paris, spécialisé en soins esthétiques, avec prise de RDV en ligne"</li>
          <li>🎨 <strong>Portfolio :</strong> "Portfolio créatif de photographe mariage, présentation de mes réalisations avec galerie photos"</li>
          <li>🍽️ <strong>Restaurant :</strong> "Restaurant italien traditionnel, spécialités pizzas et pâtes fraîches, avec système de réservation"</li>
          <li>💼 <strong>Service :</strong> "Agence de marketing digital spécialisée PME, services SEO, réseaux sociaux et création de sites"</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composant informatif seulement - pas d'input
// L'utilisateur répond directement dans le chat
</script>

<style scoped>
.predefined-component {
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.predefined-component:hover {
  border-color: #28a745;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.1);
}

.component-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.component-title {
  color: #333;
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.component-description {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
  line-height: 1.4;
}

.description-guidance {
  width: 100%;
}

.instruction-box {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.instruction-text {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.example-text {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
  font-style: italic;
}

.input-help {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.input-help p {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 0.9rem;
}

.input-help ul {
  margin: 0;
  padding-left: 1.2rem;
}

.input-help li {
  margin-bottom: 0.5rem;
  color: #6c757d;
  font-size: 0.85rem;
  line-height: 1.4;
}

/* Styles supprimés car plus d'input */

@media (max-width: 768px) {
  .predefined-component {
    padding: 1rem;
  }
  
  .instruction-box {
    padding: 1rem;
  }
  
  .input-help {
    padding: 0.75rem;
  }
}
</style> 