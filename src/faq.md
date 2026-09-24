---
layout: base.njk
title: FAQ
seoTitle: "Tempeh : questions fréquentes — conservation, goût, cuisson · Zyfe"
description: "Tout sur le tempeh Zyfe : conservation, emballage, goût, allergènes et façons de le cuisiner — la foire aux questions."
faq:
  - q: "Comment se conserve le tempeh ?"
    a: "En rentrant chez vous, mettez-le au frais (entre 0 et 4°C) et, si vous avez acheté plusieurs blocs, ne les empilez pas, ne les laissez pas au contact les uns des autres (cela pourrait relancer la fermentation). Après fabrication, le tempeh se conserve une semaine au frigo (vérifiez la DLC)."
  - q: "Puis-je congeler le tempeh ?"
    a: "Oui si vous le congelez avant la date limite de consommation indiquée sur l'emballage. Conservez jusqu'à 3 mois au congélateur, et décongelez-le le jour de sa consommation."
  - q: "Pourquoi le tempeh Zyfe est-il emballé ainsi ?"
    a: "Une technique propre au tempeh est de le fermenter dans des sachets plastiques alimentaires perforés (ce qui permet notamment de réguler l'humidité). Nous avons décidé de ne pas remplacer ces sachets afin d'éviter les manipulations et de diminuer l'utilisation du plastique. C'est pourquoi une feuille de papier est utilisée pour recouvrir les zones perforées du sachet."
  - q: "Des taches noires sont apparues sur le tempeh, puis-je le manger ?"
    a: "Oui si la date limite de consommation indiquée sur l'emballage est respectée. Ces petites taches noires sont dues à la sporulation du champignon (à la manière des veines bleues du roquefort) et n'altèrent ni le goût ni la comestibilité du tempeh. Au bout de quelques jours, le goût du tempeh est plus prononcé, indépendamment de l'apparition ou non de ces petites taches."
  - q: "Quel goût a le tempeh et quelle est sa texture ?"
    a: "Le tempeh a un goût subtil (touches de noisette, champignon blanc, levure) qui se révèle à la cuisson. Sa texture est à la fois ferme et fondante : il se tranche, se poêle, se grille et se marine très facilement."
  - q: "Puis-je le manger en salade ?"
    a: "Il est recommandé de cuire le tempeh, pour le manger froid en salade il est donc possible de : le pré-cuire quelques minutes (dans l'eau, à la vapeur), le laisser refroidir avant d'ajouter une marinade et de le mettre au frigo."
  - q: "Quels sont les bénéfices du tempeh ?"
    a: "Le tempeh est 100 % végétal et constitue une excellente source de protéine complète (dans le cas du soja), de fibres, de minéraux et acide gras insaturés, pour un indice glycémique faible. La fermentation améliore aussi la digestibilité des légumineuses. En tant que protéine végétale, son impact environnemental est beaucoup plus faible que les protéines animales."
  - q: "Le tempeh contient-il des allergènes ?"
    a: "Le tempeh peut être fait à partir de différentes légumineuses ou céréales dont certaines contiennent des allergènes (soja, gluten ou sésame selon la recette). Ils sont indiqués en gras sur nos emballages."
---

<h1 class="lead">Le tempeh en pratique</h1>

<div class="faq">
{%- for item in faq %}
<details>
<summary>{{ item.q }}</summary>
<p>{{ item.a | safe }}</p>
</details>
{%- endfor %}
</div>