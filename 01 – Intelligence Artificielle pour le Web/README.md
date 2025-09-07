# Générateur de Quiz IA

**Auteur :** Quentin Pacheu  
**Projet :** M1 Rattrapages  
**Technologies :** HTML5, CSS3, JavaScript ES6+, API Groq (Llama 3.1)  
**Démo en ligne :** https://m1-rattrapages-pacheu-quentin.vercel.app

## 📋 Description

Application web de génération automatique de quiz utilisant l'intelligence artificielle. Permet de créer instantanément des questionnaires à choix multiples sur n'importe quel domaine grâce à l'API Groq et au modèle Llama 3.1 8B Instant.

## ✨ Fonctionnalités

- **Génération automatique** de quiz sur tout sujet
- **Interface responsive** adaptée mobile/desktop  
- **Correction automatique** avec explications détaillées
- **Choix du nombre de questions** (5, 10 ou 15)


## 📖 Guide d'utilisation

### 1. Configuration du Quiz
- Entrez le domaine souhaité (ex: "Mathématiques", "Histoire de France", "Biologie cellulaire")
- Sélectionnez le nombre de questions (5, 10 ou 15)
- Cliquez sur "Générer Quiz"

### 2. Passage du Quiz
- Lisez chaque question attentivement
- Cliquez sur votre réponse (A, B, C ou D)
- La réponse sélectionnée se colore en jaune doré
- Cliquez sur "Question suivante"
- L'interface immersive avec fond violet facilite la concentration

### 3. Résultats
- Consultez votre score final avec pourcentage
- Lisez le récapitulatif détaillé :
  - Vos réponses vs réponses correctes
  - Explications pédagogiques pour chaque question
  - Bordures vertes/rouges pour identifier rapidement les erreurs
- Cliquez sur "Nouveau Quiz" pour recommencer

## 🏗️ Structure du Projet

```
01 – Intelligence Artificielle pour le Web/
├── index.html          # Interface utilisateur principale
├── script.js           # Logique JavaScript et appels API
├── style.css           # Design responsive et animations
└── config.js           # Configuration de la clé API (à créer)
```

### Fichiers détaillés

- **`index.html`** : Structure HTML5 sémantique avec sections (config, loading, quiz, résultats)
- **`script.js`** : Gestion des états, appels API Groq, parsing JSON robuste, interactions utilisateur
- **`style.css`** : Design moderne avec dégradés, responsive design, animations CSS3, interface immersive
- **`config.js`** : Stockage sécurisé de la clé API Groq (non inclus dans le repository)

## 🔧 Configuration Technique

### API Groq
- **Modèle :** `llama-3.1-8b-instant`
- **Endpoint :** `https://api.groq.com/openai/v1/chat/completions`
- **Format :** JSON avec authentification Bearer Token


### Parser JSON Robuste
Le système inclut un parser renforcé pour gérer :
- Marqueurs markdown (`json`, etc.)
- Texte supplémentaire avant/après le JSON
- Extraction sécurisée du contenu valide
- Gestion d'erreurs avec messages explicites

## 🎨 Design et UX

### Thématique par Section
- **Configuration :** Fond blanc/gris - Simplicité et clarté
- **Loading :** Dégradé jaune - Anticipation et énergie
- **Quiz :** Dégradé violet - Immersion et concentration
- **Résultats :** Fond blanc - Analyse claire des performances

### Interface Quiz Innovante
- **Sélection visuelle :** Clics directs sur les réponses (radio buttons cachés)
- **Lettres identificatrices :** A, B, C, D dans des cercles colorés
- **Feedback immédiat :** Changement de couleur à la sélection
- **Layout adaptatif :** 2 colonnes desktop, 1 colonne mobile

### Responsive Design
- **Desktop :** Layout 2 colonnes pour les réponses, animations hover
- **Tablette :** Adaptation automatique selon l'orientation
- **Mobile :** Layout 1 colonne, boutons pleine largeur, interactions tactiles


## 📱 Compatibilité

### Navigateurs supportés
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Appareils testés
- ✅ Desktop (1920x1080, 1366x768)
- ✅ Tablette (iPad, Android tablet)
- ✅ Mobile (iPhone, Android phone)


## 🌐 Déploiement

### Version en ligne
Une version fonctionnelle est déployée sur Vercel :
**https://m1-rattrapages-pacheu-quentin.vercel.app**


## 🔧 Développement

### Architecture
- **Frontend :** Vanilla JavaScript 
- **API :** REST avec Groq
- **Style :** CSS3 moderne avec Grid/Flexbox
- **State Management :** JavaScript natif avec objets globaux

### Extensibilité
- Facilement adaptable pour d'autres APIs d'IA
- Interface modulaire pour ajout de nouvelles fonctionnalités
