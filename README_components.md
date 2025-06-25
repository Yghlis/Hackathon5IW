# 🧩 Système de Composants Prédéfinis

## Vue d'ensemble

Au lieu de générer des questions dynamiques, l'agent IA peut maintenant **appeler des composants prédéfinis** spécialisés pour chaque type d'information nécessaire.

## 🎯 Fonctionnement

**Avant :**
```json
{
  "type": "questions",
  "groups": [
    {
      "title": "Couleur",
      "questions": [
        {
          "id": "color",
          "label": "Quelle couleur voulez-vous ?",
          "type": "color",
          "required": true
        }
      ]
    }
  ]
}
```

**Maintenant :**
```json
{
  "type": "need_info",
  "message": "Pour créer votre design, j'ai besoin de :",
  "components": ["color-picker", "site-type", "page-count"],
  "submitText": "🚀 Générer mon design"
}
```

## 📦 Composants Disponibles

| ID | Composant | Description |
|---|---|---|
| `project-details` | **🚀 Détails projet complet** | Formulaire unifié : nom, description, pages, couleur, style |
| `color-picker` | **🎨 Couleur principale** | Sélecteur couleur avec presets marque |
| `site-type` | **🏢 Type de site** | Site vitrine, e-commerce, portfolio, blog, etc. |
| `page-count` | **📄 Nombre de pages** | 1 page, 3-5 pages, 6-10 pages, 10+ pages |
| `design-style` | **🎨 Style de design** | Moderne, créatif, professionnel, élégant, etc. |
| `budget-range` | **💰 Budget estimé** | Gammes de prix avec fonctionnalités incluses |

## 🔧 Utilisation pour l'Agent IA

### Format Simple
```json
{
  "type": "need_info",
  "components": ["color-picker", "site-type"]
}
```

### Format Complet
```json
{
  "type": "need_info",
  "message": "Message personnalisé pour l'utilisateur",
  "components": ["color-picker", "site-type", "budget-range"],
  "submitText": "Texte du bouton personnalisé"
}
```

## 💡 Exemples d'Usage

### Formulaire Complet (RECOMMANDÉ)
```json
{
  "type": "need_info",
  "message": "Pour créer votre site parfait :",
  "components": ["project-details"],
  "submitText": "🚀 Créer mon site"
}
```

### Site E-commerce
```json
{
  "type": "need_info",
  "message": "Pour votre boutique en ligne :",
  "components": ["color-picker", "page-count", "budget-range"],
  "submitText": "🛒 Créer ma boutique"
}
```

### Portfolio Créatif
```json
{
  "type": "need_info",
  "message": "Pour votre portfolio :",
  "components": ["color-picker", "design-style"],
  "submitText": "🎨 Créer mon portfolio"
}
```

## ✅ Avantages

- **Simple** : L'agent dit juste "j'ai besoin du composant X, Y, Z"
- **Consistant** : Interface uniforme pour chaque type d'information
- **Optimisé** : Pas de génération JSON complexe
- **Maintenable** : Composants réutilisables et modifiables
- **UX** : Interface utilisateur optimisée pour chaque type de données

## 🚀 Test

Utilisez le bouton **"🎨 Test Composants"** dans l'interface pour voir tous les composants en action ! 