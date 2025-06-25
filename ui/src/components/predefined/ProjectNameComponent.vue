<template>
  <div class="predefined-component project-name-component">
    <div class="component-header">
      <h4 class="component-title">📝 Nom de votre projet</h4>
      <p class="component-description">
        Tapez le nom de votre site web dans le chat ci-dessous
      </p>
    </div>

    <div class="name-guidance">
   
      
      <div class="input-help">
        <p><strong>💡 Quelques idées selon votre secteur :</strong></p>
        <ul>
          <li>🏢 <strong>Entreprise :</strong> "Cabinet Dentaire Sourire"</li>
          <li>🛒 <strong>E-commerce :</strong> "Boutique Mode Parisienne"</li>
          <li>🎨 <strong>Portfolio :</strong> "Marie Dubois - Photographe"</li>
          <li>🍽️ <strong>Restaurant :</strong> "Pizzeria Bella Vista"</li>
          <li>💼 <strong>Service :</strong> "Agence Marketing Digital+"</li>
          <li>🏠 <strong>Immobilier :</strong> "Immobilier Premium Paris"</li>
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
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
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

.name-guidance {
  width: 100%;
}

.instruction-box {
  background: linear-gradient(135deg, #007bff, #0056b3);
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
  border-left: 4px solid #007bff;
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