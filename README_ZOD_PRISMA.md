# 🔧 Système Zod/Prisma - Agent Design

## 📋 Vue d'ensemble

L'agent design utilise maintenant un système complet de validation **Zod** et un schéma **Prisma** pour garantir la collecte de toutes les informations obligatoires avant la génération de sites web.

## 🎯 Schéma Obligatoire

### Champs Principaux
```typescript
{
  nom: string,           // Nom du projet/entreprise
  description: string,   // Description complète de l'activité
  couleur: string,       // Couleur principale (nom ou hex)
  style: enum,          // Style parmi [modern, creative, professional, elegant, fun, natural]
  pages: Page[]         // Array détaillé des pages
}
```

### Structure des Pages
```typescript
Page {
  numero: number,       // Numéro de la page (1, 2, 3...)
  nom: string,         // Nom de la page (Accueil, Services...)
  description: string, // Description du contenu de la page
  sections?: string[]  // Sections optionnelles (hero, contact...)
}
```

## 🚀 Workflow de l'Agent

### 1. **Analyse Initiale**
```typescript
analyzeRequest({ userMessage })
```
- Analyse le message utilisateur
- Extrait les informations déjà fournies
- Identifie les informations manquantes
- Suggère les composants frontend appropriés

### 2. **Collecte via Composants**
L'agent utilise les composants frontend pour collecter :
- **Nom du projet** (composant conversationnel)
- **Description** (composant conversationnel) 
- **Nombre de pages** (composant interactif avec clic direct)
- **Couleur principale** (composant interactif avec clic direct)
- **Style de design** (composant interactif avec clic direct)

### 3. **Validation Zod Complète**
```typescript
smartCollectAndGenerate({ projectInfo: ProjectSchema })
```
- Validation stricte de tous les champs obligatoires
- Génération automatique de la structure des pages selon l'activité
- Création de la palette de couleurs
- Stockage des informations validées

### 4. **Génération de la Maquette**
```typescript
generateDesign({ sections, additionalFeatures })
```
- Génération du HTML/CSS complet
- Sauvegarde dans le dossier Downloads
- Utilisation des informations validées par Zod

## 🛠️ Outils Disponibles

### Core Tools
- **`analyzeRequest`** : Analyse intelligente du message utilisateur
- **`smartCollectAndGenerate`** : Validation Zod + génération structure
- **`generateDesign`** : Création de la maquette HTML/CSS

### Conversion Tools  
- **`convertComponentAnswers`** : Convertit réponses frontend → structure Zod
- **`collectProjectInfo`** : Collecte traditionnelle (compatibilité)
- **`collectCompleteProjectInfo`** : Collecte avec validation Zod directe

## 📊 Schéma Prisma

```prisma
model Project {
  id          Int      @id @default(autoincrement())
  nom         String   // Nom du projet
  description String   // Description complète
  couleur     String   // Couleur principale
  style       Style    // Style de design
  
  pages       Page[]   // Relation avec les pages
  generations Generation[] // Historique des générations
}

model Page {
  numero      Int      // Numéro de la page
  nom         String   // Nom de la page
  description String   // Description du contenu
  sections    String[] // Sections de la page
  
  projectId   Int
  project     Project  @relation(fields: [projectId], references: [id])
}

enum Style {
  modern | creative | professional | elegant | fun | natural
}
```

## 🎨 Génération Automatique des Pages

L'agent génère automatiquement la structure des pages selon l'activité :

### Restaurant/Café
1. **Accueil** - Présentation + hero
2. **Menu** - Cartes, spécialités, prix
3. **À propos** - Histoire, équipe
4. **Réservation** - Système de réservation
5. **Contact** - Coordonnées, localisation

### E-commerce/Boutique
1. **Accueil** - Présentation + produits phares
2. **Produits** - Catalogue, filtres, panier
3. **À propos** - Histoire de la marque
4. **Réalisations** - Témoignages clients
5. **Contact** - Support, livraison

### Portfolio/Créatif
1. **Accueil** - Présentation artistique
2. **Portfolio** - Galerie, projets récents
3. **À propos** - Parcours, vision
4. **Réalisations** - Études de cas
5. **Contact** - Collaboration

### Services/Corporate
1. **Accueil** - Présentation professionnelle
2. **Services** - Détails, processus, tarifs
3. **À propos** - Équipe, valeurs
4. **Réalisations** - Références, témoignages
5. **Contact** - Devis, coordonnées

## 🎯 Mapping des Couleurs

### Couleurs Prédéfinies
- **Bleu** → Palette Moderne (#2563EB)
- **Vert** → Palette Naturelle (#059669)
- **Rouge** → Palette Dynamique (#DC2626)
- **Orange** → Palette Énergique (#EA580C)
- **Violet** → Palette Élégante (#7C3AED)
- **Jaune** → Palette Lumineuse (#F59E0B)
- **Turquoise** → Palette Fraîche (#06B6D4)
- **Rose** → Palette Douce (#EC4899)
- **Gris** → Palette Neutre (#6B7280)
- **Noir** → Palette Élégante (#1F2937)

### Couleurs Personnalisées
L'agent accepte les codes hex (#RRGGBB) et génère automatiquement :
- **Primaire** : Couleur choisie
- **Secondaire** : +30% luminosité
- **Accent** : -30% luminosité

## 🔄 Mapping des Styles

### Frontend → Zod Enum
- "Moderne & Minimaliste" → `modern`
- "Créatif & Artistique" → `creative`
- "Professionnel & Corporate" → `professional`
- "Élégant & Luxe" → `elegant`
- "Ludique & Dynamique" → `fun`
- "Naturel & Organic" → `natural`

## ⚠️ Règles Critiques

1. **Validation Obligatoire** : Aucune génération sans validation Zod complète
2. **Schéma Respecté** : Tous les champs obligatoires doivent être présents
3. **Pages Structurées** : Chaque page doit avoir numero, nom, description
4. **Style Enum** : Le style doit être un des 6 valeurs autorisées
5. **Couleur Valide** : Nom de couleur ou code hex valide

## 🚀 Utilisation

```typescript
// 1. Analyser le message utilisateur
const analysis = await analyzeRequest({ userMessage: "Je veux un site pour mon restaurant..." });

// 2. Si infos manquantes → Composants frontend collectent les données

// 3. Validation et génération structure
const validation = await smartCollectAndGenerate({ 
  projectInfo: {
    nom: "Restaurant Le Gourmet",
    description: "Restaurant français traditionnel avec cuisine raffinée",
    couleur: "rouge",
    style: "elegant",
    pages: [
      { numero: 1, nom: "Accueil", description: "Présentation du restaurant..." },
      { numero: 2, nom: "Menu", description: "Carte complète des plats..." },
      // ...
    ]
  }
});

// 4. Génération de la maquette
const result = await generateDesign({ 
  sections: ["header", "hero", "menu", "contact"],
  additionalFeatures: ["reservation", "galerie"]
});
```

## ✅ Avantages du Système

- **🔒 Validation stricte** : Zod garantit la cohérence des données
- **📊 Structure claire** : Prisma documente le modèle de données
- **🎯 Génération intelligente** : Pages adaptées selon l'activité
- **🎨 Couleurs cohérentes** : Palettes automatiques ou personnalisées
- **🚀 Workflow optimisé** : Collecte → Validation → Génération
- **🔧 Maintenance facilitée** : Schéma centralisé et typé 