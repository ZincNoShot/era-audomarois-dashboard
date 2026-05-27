# ERA Audomarois — Tableau de Bord ERP

Application interne de gestion immobilière pour l'**ERA L'Agence de l'Audomarois**, Saint-Omer.

## Stack

- **Next.js 14** (App Router)
- **React 18** + TypeScript
- **Tailwind CSS**
- **Lucide React** icons
- **Geist** (police Vercel)

## Lancement rapide

### 1. Installer les dépendances

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 2. Démarrer en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

### 3. Build de production

```bash
npm run build
npm start
```

## Structure du projet

```
src/
├── app/
│   ├── globals.css          # Styles globaux + animations
│   ├── layout.tsx           # Layout racine (police Geist)
│   └── page.tsx             # Page principale (routing interne)
├── components/
│   ├── Avatar.tsx            # Avatar initiales coloré
│   ├── DashboardSection.tsx  # Contenu tableau de bord (stats + état)
│   ├── LeadsPanel.tsx        # Liste leads + formulaire ajout
│   ├── PerformanceChart.tsx  # Barres de performance équipe
│   ├── PropertiesTable.tsx   # Table mandats avec filtres
│   ├── Sidebar.tsx           # Navigation latérale
│   ├── StatCard.tsx          # Carte métrique KPI
│   ├── StatusBadge.tsx       # Badge statut cliquable
│   └── Topbar.tsx            # Barre supérieure + recherche
└── lib/
    └── data.ts               # Types, données initiales, helpers
```

## Fonctionnalités interactives

| Fonctionnalité | Description |
|---|---|
| **Badges de statut** | Cliquer sur un badge cycle : Estimation → Actif → Compromis → Vendu |
| **Cartes KPI** | Se recalculent en temps réel à chaque changement de statut |
| **Filtre propriétés** | Recherche texte + filtre par statut sur la table |
| **Ajout de lead** | Formulaire inline, le lead s'ajoute instantanément en tête de liste |
| **Cloche notifs** | Cliquer supprime l'indicateur rouge |
| **Navigation** | Sidebar entièrement fonctionnelle |

## Personnalisation

- **Agents** : modifier le tableau `AGENTS` dans `src/lib/data.ts`
- **Propriétés initiales** : modifier `INITIAL_PROPERTIES`
- **Leads initiaux** : modifier `INITIAL_LEADS`
- **Performance** : modifier `TEAM_PERF`
- **Couleurs** : variables CSS dans `globals.css` ou inline styles dans chaque composant

## Notes

- Application entièrement en **état local React** (aucune base de données). Pour une version production, brancher une API REST ou Supabase.
- Toutes les données sont réinitialisées au rechargement de la page. Pour la persistance, ajouter `localStorage` ou une couche backend.
