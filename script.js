(() => {
  const html = document.documentElement;

  // ===== YEAR
  const year = new Date().getFullYear();
  const y1 = document.getElementById("year");
  const y2 = document.getElementById("year2");
  if (y1) y1.textContent = String(year);
  if (y2) y2.textContent = String(year);

  // ===== THEME
  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = document.getElementById("themeIcon");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    html.setAttribute("data-theme", savedTheme);
  }

  function syncThemeIcon() {
    const t = html.getAttribute("data-theme") || "dark";
    if (themeIcon) themeIcon.textContent = (t === "light") ? "☀️" : "🌙";
  }
  syncThemeIcon();

  themeBtn?.addEventListener("click", () => {
    const current = html.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    syncThemeIcon();
  });

  // ===== DRAWER (mobile)
  const burger = document.getElementById("burger");
  const drawer = document.getElementById("drawer");
  const closeDrawer = document.getElementById("closeDrawer");

  const openDrawer = () => {
    if (!drawer || !burger) return;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };
  const hideDrawer = () => {
    if (!drawer || !burger) return;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  burger?.addEventListener("click", openDrawer);
  closeDrawer?.addEventListener("click", hideDrawer);
  drawer?.addEventListener("click", (e) => { if (e.target === drawer) hideDrawer(); });
  drawer?.querySelectorAll("a")?.forEach(a => a.addEventListener("click", hideDrawer));

  // ===== ACTIVE NAV
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = Array.from(document.querySelectorAll("section[id], main[id]"));

  const setActive = (id) => {
    navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
  };

  const navObs = new IntersectionObserver((entries) => {
    const top = entries
      .filter(e => e.isIntersecting)
      .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if (!top) return;
    const id = top.target.getAttribute("id");
    if (id) setActive(id);
  }, { threshold: [0.35, 0.55, 0.70] });

  sections.forEach(s => navObs.observe(s));

  // ===== REVEAL
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObs.observe(el));

  // ===== SCROLL PROGRESS + BACK TO TOP
  const progressBar = document.getElementById("progressBar");
  const toTop = document.getElementById("toTop");

  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const p = docH > 0 ? (scrollTop / docH) * 100 : 0;
    if (progressBar) progressBar.style.width = `${p}%`;

    if (toTop) {
      if (scrollTop > 600) toTop.classList.add("show");
      else toTop.classList.remove("show");
    }
  };
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ===== COPY EMAIL + TOAST
  const copyBtn = document.getElementById("copyEmail");
  const toast = document.getElementById("toast");
  const showToast = () => {
    if (!toast) return;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1100);
  };

  copyBtn?.addEventListener("click", async () => {
    const email = "thizirihamlaoui@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      showToast();
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast();
    }
  });

  // ===== MODAL (projects) AVEC IMAGES INTÉGRÉES
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const modalOk = document.getElementById("modalOk");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  const MODALS = {
    bascarbone: {
      title: "Conception Base de données (FMI) — SQL",
      body: `
        <h4 style="color:var(--text); margin-bottom:8px;">Contexte</h4>
        <p>Dans cette SAÉ, nous devions travailler à partir de données du FMI sur le commerce des technologies à faible empreinte carbone. L’objectif était de créer une base de données relationnelle complète : modélisation entité-association, transformation en schéma relationnel, création des tables en SQL, insertion des données, puis exploitation avec des requêtes et des visualisations sur Metabase.</p>
        
        <img src="entité-association.png" alt="Modèle Entité-Association" style="width:100%; border-radius:12px; margin:12px 0; border:1px solid var(--border);">

        <div class="divider"></div>
        <h4 style="color:var(--c1); margin-bottom:8px;">Points positifs</h4>
        <p>Cette SAÉ m’a permis de vraiment comprendre la logique d’une base de données. Avant, je savais écrire des requêtes simples, mais je ne comprenais pas toujours la structure globale. Ici, j’ai appris à réfléchir en termes de relations entre tables et de cohérence des données. J’ai aussi progressé en SQL (jointures complexes, nettoyage de données, indicateurs de flux commerciaux).</p>
        <div class="divider"></div>
        <h4 style="color:var(--c3); margin-bottom:8px;">Difficultés rencontrées</h4>
        <p>Au début, j’avais du mal à bien structurer le modèle entité-association. Certaines relations n’étaient pas claires et mes premières requêtes étaient longues et peu efficaces.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c2); margin-bottom:8px;">Ce que j'ai réussi à rattraper</h4>
        <p>J’ai pris le temps de revoir la modélisation et de tester mes requêtes étape par étape. En simplifiant et en organisant mieux mon code, j’ai réussi à rendre mon travail plus propre et plus logique. Cette expérience m’a rendue plus rigoureuse.</p>
      `
    },
    co2: {
      title: "Analyse environnementale (CO₂) — Statistiques",
      body: `
        <h4 style="color:var(--text); margin-bottom:8px;">Contexte</h4>
        <p>Cette SAÉ portait sur l’analyse de données réelles concernant les émissions de CO₂ des véhicules. Nous devions nettoyer les données, réaliser une analyse statistique descriptive, produire des graphiques pertinents et rédiger un rapport clair.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c1); margin-bottom:8px;">Points positifs</h4>
        <p>J’ai réussi à structurer mon travail du début à la fin : nettoyage des données, analyse, visualisation et interprétation. J’ai compris que l’objectif n’était pas seulement de produire des graphiques, mais d’expliquer ce qu’ils signifient. J'ai aussi progressé en travail de groupe.</p>
        
        <img src="graphique-emission-co2.png" alt="Graphique Émission CO2" style="width:100%; border-radius:12px; margin:12px 0; border:1px solid var(--border);">
        <img src="graphique1-emission-co2.png" alt="Analyse détaillée CO2" style="width:100%; border-radius:12px; margin:12px 0; border:1px solid var(--border);">

        <div class="divider"></div>
        <h4 style="color:var(--c3); margin-bottom:8px;">Difficultés rencontrées</h4>
        <p>Au départ, je me concentrais surtout sur les calculs et les graphiques, sans aller assez loin dans l’interprétation. J’avais parfois du mal à formuler des conclusions claires.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c2); margin-bottom:8px;">Ce que j'ai réussi à rattraper</h4>
        <p>En retravaillant mes analyses et en prenant du recul, j’ai appris à relier les résultats aux enjeux environnementaux. J’ai aussi amélioré ma façon de rédiger pour que mes conclusions soient plus compréhensibles.</p>
      `
    },
    tumeurs: {
      title: "Prédiction de tumeur (Régression Logistique) — Python",
      body: `
        <h4 style="color:var(--text); margin-bottom:8px;">Contexte</h4>
        <p>Le but de cette SAÉ était d’utiliser un jeu de données médical pour construire un modèle de régression logistique capable de prédire si une tumeur est bénigne ou maligne.</p>
        
        <img src="régression-logistique.png" alt="Modèle de Régression Logistique" style="width:100%; border-radius:12px; margin:12px 0; border:1px solid var(--border);">
        <img src="nuage-regression.png" alt="Nuage de régression" style="width:100%; border-radius:12px; margin:12px 0; border:1px solid var(--border);">

        <div class="divider"></div>
        <h4 style="color:var(--c1); margin-bottom:8px;">Points positifs</h4>
        <p>Cette SAÉ m’a permis de mieux comprendre comment fonctionne un modèle prédictif. J’ai appris à analyser les variables, à repérer celles qui étaient les plus importantes et à interpréter les résultats. J’ai développé un esprit plus critique : j’ai compris qu’un modèle ne donne pas “la vérité”, mais une estimation qu’il faut savoir analyser.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c3); margin-bottom:8px;">Difficultés rencontrées</h4>
        <p>La partie théorique était difficile au début, notamment la compréhension des coefficients et de la probabilité associée à la régression logistique.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c2); margin-bottom:8px;">Ce que j'ai réussi à rattraper</h4>
        <p>J’ai revu les bases et relu mes cours pour mieux comprendre la logique mathématique. Cela m’a permis d’expliquer le modèle avec plus d’assurance et de ne plus l’utiliser de manière automatique.</p>
      `
    },
    ia: {
      title: "Analyse de données (Usage de l'IA) — R",
      body: `
        <h4 style="color:var(--text); margin-bottom:8px;">Contexte</h4>
        <p>Dans le cadre de cette SAÉ (réalisée sous R), nous devions analyser l'impact de l'intelligence artificielle sur la préparation des étudiants au monde professionnel. Nous n'avons pas créé le sondage : un jeu de données brut de <strong>1050 réponses et 61 variables</strong> nous a été fourni. Mon rôle a été de nettoyer cette base et d'en extraire des analyses statistiques fiables.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c1); margin-bottom:8px;">Points positifs</h4>
        <p>J’ai pu mener une véritable démarche de recherche statistique en testant des hypothèses précises. Par exemple, nous avons pu valider que l'IA était perçue comme un booster de productivité (H40), mais nous avons rejeté l'idée qu'elle faisait baisser la créativité (H32). Cela m'a appris à transformer des données d'opinion en conclusions chiffrées.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c3); margin-bottom:8px;">Difficultés rencontrées</h4>
        <p>Notre échantillon n'était pas parfait : il présentait de gros biais de représentativité (ex: surreprésentation des étudiants en début de cycle). De plus, nous n'avions pas de données officielles sur la structure réelle du campus, ce qui a rendu l'étape de <strong>redressement statistique</strong> très complexe au départ.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c2); margin-bottom:8px;">Ce que j'ai réussi à rattraper</h4>
        <p>J'ai appris à formuler et appliquer des hypothèses de redressement pour corriger ces biais de représentativité. Surtout, j'ai développé mon esprit critique : j'ai compris qu'il faut toujours interpréter un sondage avec prudence et honnêteté, en mentionnant clairement les limites de l'échantillon analysé.</p>
      `
    },
    performance: {
      title: "Évaluation performance d'entreprise — Analyse financière",
      body: `
        <h4 style="color:var(--text); margin-bottom:8px;">Contexte</h4>
        <p>Cette SAÉ consistait à analyser la performance d’une entreprise bio locale à partir de ses documents comptables et de son environnement économique.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c1); margin-bottom:8px;">Points positifs</h4>
        <p>J’ai appris à lire un compte de résultat et à calculer des indicateurs comme la marge ou l’autonomie financière. J’ai compris comment relier des chiffres à une situation réelle d’entreprise. Cette SAÉ m’a également permis de développer ma capacité à rédiger une synthèse claire et argumentée.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c3); margin-bottom:8px;">Difficultés rencontrées</h4>
        <p>Au début, certains indicateurs financiers étaient difficiles à interpréter et je manquais de recul pour analyser la situation globale.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c2); margin-bottom:8px;">Ce que j'ai réussi à rattraper</h4>
        <p>En approfondissant les notions et en prenant le temps de relire mes analyses, j’ai réussi à produire un diagnostic plus cohérent et structuré.</p>
      `
    },
    excel: {
      title: "Tableau de bord (Service Com IUT) — Excel",
      body: `
        <h4 style="color:var(--text); margin-bottom:8px;">Contexte</h4>
        <p>Nous devions créer un tableau de bord pour le service communication de l’IUT afin d’analyser le profil des étudiants à partir d’un fichier Excel. L’objectif était de transformer un simple tableau de données en un outil clair, interactif et utile pour la décision.</p>
        
        <img src="dashboard-excel.jpeg" alt="Dashboard Excel Interactif" style="width:100%; border-radius:12px; margin:12px 0; border:1px solid var(--border);">

        <div class="divider"></div>
        <h4 style="color:var(--c1); margin-bottom:8px;">Points positifs</h4>
        <p>J’ai appris à utiliser les tableaux croisés dynamiques, les segments et les graphiques interactifs. J’ai aussi compris l’importance de l’ergonomie : un bon tableau de bord doit être simple et compréhensible pour quelqu’un qui ne travaille pas dans la data.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c3); margin-bottom:8px;">Difficultés rencontrées</h4>
        <p>Au début, mes tableaux étaient trop chargés et pas assez synthétiques. J’avais du mal à sélectionner les indicateurs vraiment utiles.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c2); margin-bottom:8px;">Ce que j'ai réussi à rattraper</h4>
        <p>En retravaillant la mise en forme et en simplifiant les informations affichées, j’ai réussi à produire un tableau de bord plus professionnel et plus efficace.</p>
      `
    },
    enquete: {
      title: "Enquête alimentaire — Questionnaire Sphinx",
      body: `
        <h4 style="color:var(--text); margin-bottom:8px;">Contexte</h4>
        <p>Concevoir et administrer une enquête sur les habitudes alimentaires des étudiants de l’université. Nous devions construire le questionnaire, collecter les réponses, analyser les données et présenter les résultats.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c1); margin-bottom:8px;">Points positifs</h4>
        <p>J’ai appris à construire un questionnaire logique. J’ai aussi développé mes compétences en analyse descriptive. Travailler sur de vraies données terrain rendait l'analyse très concrète.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c3); margin-bottom:8px;">Difficultés rencontrées</h4>
        <p>Certaines questions auraient pu être formulées plus clairement. Nous avons aussi rencontré quelques incohérences dans les réponses collectées.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c2); margin-bottom:8px;">Ce que j'ai réussi à rattraper</h4>
        <p>Nous avons retravaillé certaines catégories lors du nettoyage des données pour rendre l’analyse plus cohérente. Cela m’a appris l’importance de la précision dès la phase de conception.</p>
      `
    },
    iofiles: {
      title: "Automatisation traitement fichiers — Python",
      body: `
        <h4 style="color:var(--text); margin-bottom:8px;">Contexte</h4>
        <p>L’objectif était de lire automatiquement plusieurs fichiers clients bruts, extraire les informations utiles, nettoyer les données et générer un fichier CSV structuré.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c1); margin-bottom:8px;">Points positifs</h4>
        <p>J’ai progressé en programmation Python (lecture/écriture de fichiers). J’ai appris à automatiser un traitement qui aurait été très long manuellement. J’ai développé ma logique algorithmique pour structurer un script propre.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c3); margin-bottom:8px;">Difficultés rencontrées</h4>
        <p>Les fichiers avaient des formats différents et certaines données étaient incomplètes. La gestion des erreurs dans le code m’a posé des difficultés au début.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c2); margin-bottom:8px;">Ce que j'ai réussi à rattraper</h4>
        <p>En ajoutant des conditions et en testant plusieurs cas, j’ai réussi à rendre mon script plus robuste et plus fiable, produisant un résultat propre et réutilisable.</p>
      `
    },
    metabase: {
      title: "Reporting catastrophes climatiques — SQL & Metabase",
      body: `
        <h4 style="color:var(--text); margin-bottom:8px;">Contexte</h4>
        <p>Nous devions mettre en place un environnement PostgreSQL, intégrer un jeu de données mondial sur les catastrophes climatiques et produire des analyses via SQL et Metabase.</p>
        
        <img src="carte_metabase.png" alt="Visualisation sur Metabase" style="width:100%; border-radius:12px; margin:12px 0; border:1px solid var(--border);">

        <div class="divider"></div>
        <h4 style="color:var(--c1); margin-bottom:8px;">Points positifs</h4>
        <p>J’ai appris à travailler dans un environnement complet de base de données. J’ai amélioré ma maîtrise de SQL et compris comment produire des indicateurs pertinents. Relier la technique à un enjeu mondial concret était très motivant.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c3); margin-bottom:8px;">Difficultés rencontrées</h4>
        <p>La mise en place de l’environnement technique et certaines jointures SQL complexes ont été difficiles au début.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c2); margin-bottom:8px;">Ce que j'ai réussi à rattraper</h4>
        <p>En pratiquant davantage et en testant les requêtes progressivement, j’ai gagné en autonomie et en confiance dans l’utilisation de SQL.</p>
      `
    },
    series: {
      title: "Séries chronologiques (Tourisme) — Modélisation",
      body: `
        <h4 style="color:var(--text); margin-bottom:8px;">Contexte</h4>
        <p>L’objectif de cette SAÉ était d’analyser une série mensuelle sur les nuitées touristiques en France et de construire des prévisions à l’aide de différentes méthodes (moyenne mobile, lissage exponentiel, ARIMA).</p>
        
        <img src="prevision.png" alt="Prévisions sur séries chronologiques" style="width:100%; border-radius:12px; margin:12px 0; border:1px solid var(--border);">

        <div class="divider"></div>
        <h4 style="color:var(--c1); margin-bottom:8px;">Points positifs</h4>
        <p>J’ai appris à identifier la tendance et la saisonnalité d’une série temporelle, et à comparer différentes méthodes de prévision. Ça m'a aidé à comprendre comment un phénomène évolue dans le temps.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c3); margin-bottom:8px;">Difficultés rencontrées</h4>
        <p>Les notions mathématiques comme la stationnarité, les graphes ACF/PACF et le choix des paramètres ARIMA étaient très abstraites au début.</p>
        <div class="divider"></div>
        <h4 style="color:var(--c2); margin-bottom:8px;">Ce que j'ai réussi à rattraper</h4>
        <p>En pratiquant directement sur les données et en comparant les modèles visuellement, j’ai progressivement compris la logique derrière ces outils et gagné en confiance.</p>
      `
    },
    gym: {
      title: "Analyse et Investigation d'un Dataset (Gym) — Python",
      body: `
        <h4 style="color:var(--text); margin-bottom:8px;">Contexte</h4>
        <p>Ce très gros projet portait sur un dataset de Kaggle (973 membres de gym, 15 variables). En Phase 1, nous avons mené une exploration statistique classique (distributions, corrélations de Pearson, CAH). Cependant, la propreté du dataset (zéro valeur manquante) et les distributions trop régulières nous ont alertés.</p>
        
        <div class="divider"></div>
        <h4 style="color:var(--c1); margin-bottom:8px;">La Phase 1 : Exploration classique</h4>
        <p>L'étude initiale a révélé des liens évidents, confirmés par la matrice de corrélation, comme la forte dépendance entre la durée de la séance et les calories brûlées (r=0.908). Une Classification Ascendante Hiérarchique (CAH) après standardisation nous a permis d'isoler des profils d'intensité d'entraînement.</p>
        
        <img src="matrice_corrélation.png" alt="Matrice de corrélation" style="width:100%; border-radius:12px; margin:12px 0; border:1px solid var(--border);">
        <img src="cluster.png" alt="Dendrogramme de la CAH" style="width:100%; border-radius:12px; margin:12px 0; border:1px solid var(--border);">

        <div class="divider"></div>
        <h4 style="color:var(--c1); margin-bottom:8px;">La Phase 2 : Le déclic et l'investigation</h4>
        <p>Trouvant les données "trop parfaites", nous avons formulé une nouvelle problématique : ce dataset est-il issu du terrain ou généré informatiquement ? Grâce à des tests statistiques rigoureux (Kolmogorov-Smirnov, Chi²), nous avons démontré que plusieurs variables (Âge, Max_BPM) suivaient des lois uniformes discrètes sans aucune logique démographique ou physiologique (ex: corrélation Age/Max_BPM quasi nulle, biologiquement impossible).</p>
        
        <p>Le point d'orgue fut une régression linéaire multiple sur les <em>Calories_Burned</em> : le modèle obtenu (R² = 93.79%) prouve que cette variable est issue d'une équation mathématique exacte à laquelle a été ajouté un bruit aléatoire gaussien, là où un dataset réel plafonnerait à 65%.</p>
        
        <p>Enfin, une Analyse en Composantes Principales (ACP) a dévoilé une structure trop nette des composantes, confirmant la séparation artificielle des populations.</p>
        
        <img src="plan-factoriel.png" alt="Plan factoriel de l'ACP" style="width:100%; border-radius:12px; margin:12px 0; border:1px solid var(--border);">

        <div class="divider"></div>
        <h4 style="color:var(--c2); margin-bottom:8px;">Conclusion</h4>
        <p>Nous avons pu démontrer de manière irréfutable la "recette" mathématique du générateur (mélange de lois uniformes par genre et niveau d'expérience, équation de calories, etc.). Cette SAÉ m'a permis d'utiliser l'analyse de données non pas pour décrire un phénomène, mais pour agir comme une véritable détective et prouver la falsification de la donnée.</p>
      `
    },
    sondage: {
      title: "Fiabilité d'un sondage — R (simulation)",
      body: `
        <p><strong>Objectif :</strong> Étudier la fiabilité d'un sondage via simulation et intervalles de confiance.</p>
        <div class="divider"></div>
        <ul>
          <li>Simulation d'une population d'individus</li>
          <li>Fonctions R : tirage d'échantillons, estimation ponctuelle</li>
          <li>Construction d'<strong>intervalles de confiance</strong></li>
          <li>Comparaison de la précision selon la taille d'échantillon</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter • C2 Analyser.</p>
      `
    },
    dataviz: {
      title: "Analyse & dataviz sur données publiques — de A à Z",
      body: `
        <p><strong>Objectif :</strong> Réaliser une analyse complète : cadrage, nettoyage, analyse, visualisation et synthèse.</p>
        <div class="divider"></div>
        <ul>
          <li>Définition du cadre d'étude et formulation des questions</li>
          <li>Recherche + nettoyage de données publiques</li>
          <li>Analyse statistique descriptive</li>
          <li>Dataviz + rapport de synthèse structuré</li>
          <li>Organisation du projet (tâches, étapes, méthode)</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter • C2 Analyser • C3 Valoriser.</p>
      `
    }
  };

  const openModal = (key) => {
    if (!modal || !modalTitle || !modalBody) return;

    const data = MODALS[key];

    if (!data) {
      modalTitle.textContent = "Détails du projet";
      modalBody.innerHTML = `
        <p class="muted">Ce projet n'a pas encore sa fiche détaillée.</p>
      `;
    } else {
      modalTitle.textContent = data.title;
      modalBody.innerHTML = data.body;
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Indicateur de scroll
    const existingHint = modal.querySelector(".modal__scroll-hint");
    if (existingHint) existingHint.remove();

    window.setTimeout(() => {
      const body = document.getElementById("modalBody");
      if (!body) return;
      const hasScroll = body.scrollHeight > body.clientHeight + 20;
      if (!hasScroll) return;

      const hint = document.createElement("div");
      hint.className = "modal__scroll-hint";
      hint.textContent = "↓ Défiler pour voir la suite";
      modal.querySelector(".modal__panel").style.position = "relative";
      modal.querySelector(".modal__panel").appendChild(hint);

      body.addEventListener("scroll", function onScroll() {
        const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 20;
        if (atBottom) {
          hint.classList.add("hidden");
          body.removeEventListener("scroll", onScroll);
        }
      });
    }, 100);
  };

  const hideModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-modal]");
    if (!btn) return;
    const key = btn.getAttribute("data-modal");
    if (key) openModal(key);
  });

  closeModal?.addEventListener("click", hideModal);
  modalOk?.addEventListener("click", hideModal);
  modal?.addEventListener("click", (e) => { if (e.target === modal) hideModal(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

  // ===== PROJECTS FILTER + SEARCH
  const projectsGrid = document.getElementById("projectsGrid");
  const cards = Array.from(document.querySelectorAll("#projectsGrid .pCard"));
  const searchInput = document.getElementById("projectSearch");
  const clearBtn = document.getElementById("projectClear");
  const emptyState = document.getElementById("projectsEmpty");
  const filterBtns = Array.from(document.querySelectorAll(".filterBtn"));

  let activeFilter = "all";
  let query = "";

  const normalize = (s) =>
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const applyProjectsFilter = () => {
    if (!projectsGrid) return;

    const q = normalize(query);
    let visibleCount = 0;

    cards.forEach((card) => {
      const tags = (card.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
      const keywords = normalize(card.getAttribute("data-keywords") || "");
      const title = normalize(card.querySelector(".pTitle")?.textContent || "");
      const meta = normalize(card.querySelector(".pMeta")?.textContent || "");
      const desc = normalize(card.querySelector("p.muted")?.textContent || "");

      const matchesFilter = (activeFilter === "all") || tags.includes(activeFilter);
      const matchesQuery =
        !q ||
        keywords.includes(q) ||
        title.includes(q) ||
        meta.includes(q) ||
        desc.includes(q);

      const show = matchesFilter && matchesQuery;

      card.style.display = show ? "" : "none";
      if (show) visibleCount++;
    });

    if (emptyState) emptyState.style.display = visibleCount === 0 ? "" : "none";
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });

      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");

      activeFilter = btn.getAttribute("data-filter") || "all";
      applyProjectsFilter();
    });
  });

  searchInput?.addEventListener("input", (e) => {
    query = e.target.value || "";
    applyProjectsFilter();
  });

  clearBtn?.addEventListener("click", () => {
    if (!searchInput) return;
    searchInput.value = "";
    query = "";
    applyProjectsFilter();
    searchInput.focus();
  });

  applyProjectsFilter();

  // ===== PARTICLES (soft)
  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h;
    const dots = [];
    const DOTS = 50;

    const resize = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
    };

    const rand = (a,b) => a + Math.random()*(b-a);

    const init = () => {
      dots.length = 0;
      for (let i=0;i<DOTS;i++){
        dots.push({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(1.2, 2.6) * devicePixelRatio,
          vx: rand(-0.25, 0.25) * devicePixelRatio,
          vy: rand(-0.25, 0.25) * devicePixelRatio,
          a: rand(0.12, 0.35)
        });
      }
    };

    const step = () => {
      ctx.clearRect(0,0,w,h);

      for (const d of dots){
        d.x += d.vx; d.y += d.vy;
        if (d.x < -50) d.x = w + 50;
        if (d.x > w + 50) d.x = -50;
        if (d.y < -50) d.y = h + 50;
        if (d.y > h + 50) d.y = -50;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(124,235,255,${d.a})`;
        ctx.fill();
      }

      for (let i=0;i<dots.length;i++){
        for (let j=i+1;j<dots.length;j++){
          const a = dots[i], b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const max = 140 * devicePixelRatio;
          if (dist < max){
            const alpha = (1 - dist/max) * 0.18;
            ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
            ctx.lineWidth = 1 * devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y);
            ctx.lineTo(b.x,b.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(step);
    };

    resize();
    init();
    step();
    window.addEventListener("resize", () => { resize(); init(); });
  }
})();
