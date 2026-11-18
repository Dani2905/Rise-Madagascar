# Rise Madagascar

Application web React, TypeScript et Vite pour les étudiants, entreprises et particuliers à Madagascar.

## Développement

Le projet utilise Node.js et les dépendances définies dans `package-lock.json`. Les scripts disponibles sont `npm install`, `npm run dev`, `npm test` et `npm run build`. Aucune clé Gemini n'est nécessaire.

## Supabase — raccordement en cours

L'inscription et la connexion utilisent Supabase Auth quand `VITE_AUTH_MODE=supabase`. Le fichier `.env` contient seulement l'URL du projet et une clé **publishable**, conçue pour être publique. Ne jamais ajouter une clé `service_role` ou `secret` dans le code ou dans une variable `VITE_`.

Les champs des profils étudiant, entreprise et particulier sont privés dans Supabase et synchronisés après enregistrement du formulaire. Les modifications locales antérieures ne sont pas automatiquement envoyées : il faut vérifier les informations et enregistrer le formulaire. Les comptes du prototype local ne sont pas migrés automatiquement.

Les photos des profils publics, la visibilité publique des profils, les offres, projets, candidatures, évaluations, messages et abonnements restent des simulations locales non synchronisées. Les abonnements et paiements ne sont pas réels. Les migrations SQL de la base sont conservées dans `supabase/migrations` ; elles ont déjà été appliquées au projet Supabase de développement.

L'adresse e-mail doit être confirmée. Le serveur e-mail Supabase par défaut est réservé aux membres de l'organisation et limité ; pour les autres utilisateurs, configurer un fournisseur SMTP personnalisé dans Supabase. L'URL de confirmation de l'environnement de prévisualisation est temporaire ; renseigner l'URL stable du site dans les paramètres Auth (Site URL et Redirect URLs) avant un déploiement. La confirmation PKCE doit être ouverte dans le même navigateur que l'inscription. La récupération de mot de passe et le téléchargement de CV ne sont pas encore raccordés.

Pour isoler les anciens parcours de démonstration en développement uniquement, définir `VITE_AUTH_MODE=local` dans `.env.local` et redémarrer Vite. Ce mode n'a aucune sécurité serveur. Les tests simulent Supabase côté navigateur ; ils ne remplacent pas un test réel de réception et confirmation d'e-mail.

## CRM administrateur

En mode Supabase, `/admin` est un CRM dont chaque requête est autorisée côté base. Aucun administrateur initial n'est créé automatiquement : après création et confirmation du premier compte Rise, son propriétaire doit le désigner explicitement ; un administrateur autorisé pourra ensuite ajouter ou retirer des collègues avec les mêmes droits. Les comptes non autorisés et les visiteurs ne peuvent pas lire le CRM.

Les comptes visibles respectent les consentements et les blocages enregistrés dans Supabase. La recherche n'expose ni e-mails ni téléphones et les messages privés ne sont pas accessibles. Les étapes, notes et dates de relance CRM sont synchronisées, avec une liste de relances ; leurs modifications et celles de l'équipe sont journalisées. Les notes ne doivent pas contenir de données sensibles. Les changements concurrents sur une fiche sont détectés.

Les chiffres proviennent uniquement de Supabase. Les offres, projets, candidatures, signalements, préférences de visibilité et abonnements du prototype local ne sont pas encore synchronisés : les totaux du CRM peuvent être incomplets. Les candidatures, abonnements et signalements sont pour l'instant présentés sous forme de synthèses ; aucun revenu réel n'est calculé. Le mode `local` conserve uniquement l'ancien tableau de bord de démonstration, sans accès aux données CRM.

Les comptes strictement administratifs (`admin`) ne sont pas des membres publics : ils sont exclus des listes et statistiques de comptes, ne disposent pas de profil de particulier et conservent l’accès au CRM uniquement si leur autorisation serveur est active. L’inscription publique ne peut pas créer ce type de compte. Déployer la version compatible avant de convertir un compte existant ; la migration de schéma seule ne convertit et ne supprime aucune donnée. Les éventuels miroirs locaux anciens sont retirés du navigateur lors de la prochaine connexion avec cette version.

Dans le CRM, « Mon profil admin » permet de définir un prénom privé affiché dans l’en-tête, de définir ou supprimer une photo privée synchronisée (image recadrée et réencodée côté navigateur, limitée à 5 Mo à la sélection) et de modifier son mot de passe Supabase après vérification du mot de passe actuel. La photo est accessible uniquement au membre CRM concerné ; elle ne constitue pas un profil public. La récupération du mot de passe oublié n’est pas encore raccordée. Le menu CRM reste visible lors du défilement sur ordinateur et conserve sa navigation horizontale sur mobile.
