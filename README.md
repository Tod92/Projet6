# Openclassrooms - Développez une interface utilisateur pour une application web Python

Cette page web importe les données de films souhaités depuis une API et les affiche sur une page navigable type "Netflix".
Developpée en HTML, CSS et JavaScript (vanilla), la grande majorité du contenu HTML final de la page va etre généré par la partie JavaScript.



## Installation

Cette version de la page web néçessite l'installation et l'activation de l'api locale "OCMovies" :

https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR

Verifier le bon fonctionnement de l'api en tentant d'afficher la page APi
http://localhost:8000/api/v1/titles/
avant de lancer le site via index.html

## Vues

Le site presente un film en vedette, meilleur film par note imdb, première réponse de la requete api GET : "?sort_by=-imdb_score&imdb_score_min=9"

Le site presente ensuite 3 bandeaux de films, chacun contenant 4 pages de 7 films pouvant defiler via des boutons flèches gauches et droites.
Les bandeaux de films presentent les résultats aux requetes API suivantes :
* "Meilleurs scores ImDb" : "?sort_by=-imdb_score&imdb_score_min=9"
 (en evitant le premier résultat qui a été isolé pour la vignette meilleur film)
* "Meilleurs films d'animation": "?sort_by=-imdb_score&genre_contains=Animation"
* "Meilleurs films de Tarantino" : "?sort_by=imdb_score&writer_contains=tarantino&director_contains=tarantino"



## Historique

* 24/02/2023 : Finalisation v1 projet et documentation
* 23/02/2023 : Ajout fenetre modale
* 20/02/2023 : Ajout flèches et fonctions clic
* 18/02/2023 : Vues rows de films avec css
* 17/02/2023 : Lien Js <> Api fonctionnel
* 10/02/2023 : Démarrage du projet

## Credits
Projet réalisé par Thomas DERUERE\
Assisté par Idriss BEN GELOUNE (Mentor Openclassrooms)
