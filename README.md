<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1c735b1c-58cf-47fd-92b0-15a2662c715f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

### Authentification Supabase — développement

L'inscription et la connexion utilisent Supabase Auth lorsque `VITE_AUTH_MODE=supabase` ; `.env` contient uniquement l'URL du projet et sa clé **publishable**, publique. Ne jamais ajouter une clé `service_role` ou `secret` au code ou à une variable `VITE_`. Les comptes du prototype local ne sont pas automatiquement migrés. Le profil créé à l'inscription est privé dans Supabase ; ses modifications ultérieures et les autres fonctionnalités demeurent locales et non synchronisées. Les abonnements restent fictifs.

L'adresse e-mail doit être confirmée. Le serveur e-mail Supabase par défaut est réservé aux membres de l'organisation et limité ; pour les autres utilisateurs, configurer un fournisseur SMTP personnalisé dans Supabase. L'URL de confirmation de l'environnement de prévisualisation est temporaire ; renseigner l'URL stable du site dans les paramètres Auth (Site URL et Redirect URLs) avant un déploiement. La confirmation PKCE doit être ouverte dans le même navigateur que l'inscription. La récupération de mot de passe et le téléchargement de CV ne sont pas encore raccordés.

Pour isoler les anciens parcours de démonstration en développement uniquement, définir `VITE_AUTH_MODE=local` dans `.env.local` et redémarrer Vite. Ce mode n'a aucune sécurité serveur. Les tests simulent Supabase côté navigateur ; ils ne remplacent pas un test réel de réception et confirmation d'e-mail.
