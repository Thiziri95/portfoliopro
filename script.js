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

  // ===== MODAL (projects)
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const modalOk = document.getElementById("modalOk");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  // ⚠️ IMPORTANT : clés = data-modal dans ton HTML
  const MODALS = {
    tumeurs: {
      title: "Prédire un diagnostic (dataset médical) — Python",
      body: `
        <p><strong>Objectif :</strong> Construire une première approche de classification sur un dataset médical réel (tumeurs du sein).</p>
        <div class="divider"></div>
        <ul>
          <li>Préparation du dataset (nettoyage, structuration, cohérence)</li>
          <li>Analyse des variables et identification des plus discriminantes</li>
          <li>Modélisation par <strong>régression logistique</strong> (classification)</li>
          <li>Interprétation des résultats et limites (rigueur + logique)</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C2 Analyser • C4 Modéliser.</p>
      `
    },

    sondage: {
      title: "Fiabilité d’un sondage — R (simulation)",
      body: `
        <p><strong>Objectif :</strong> Étudier la fiabilité d’un sondage via simulation et intervalles de confiance.</p>
        <div class="divider"></div>
        <ul>
          <li>Simulation d’une population d’individus</li>
          <li>Fonctions R : tirage d’échantillons, estimation ponctuelle</li>
          <li>Construction d’<strong>intervalles de confiance</strong></li>
          <li>Comparaison de la précision selon la taille d’échantillon</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter • C2 Analyser.</p>
      `
    },

    bascarbone: {
      title: "Commerce des technologies bas carbone — Projet SQL complet",
      body: `
        <p><strong>Objectif :</strong> Réaliser un projet base de données complet : modélisation → création/peuplement → requêtes → visualisation.</p>
        <div class="divider"></div>
        <ul>
          <li>Analyse du besoin + compréhension des datasets (Trade / Bilateral)</li>
          <li>Conception du <strong>modèle EA</strong> (entités, associations, cardinalités)</li>
          <li>Passage au <strong>schéma relationnel</strong> (clés, contraintes, normalisation)</li>
          <li>Création des tables en <strong>PostgreSQL</strong> + script de peuplement en SQL</li>
          <li>Requêtes d’analyse : jointures, agrégations, indicateurs</li>
          <li>Dataviz (ex : Metabase) + commentaires structurés</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter • C3 Valoriser.</p>
      `
    },

    excel: {
      title: "Dashboard de pilotage — Excel",
      body: `
        <p><strong>Objectif :</strong> Construire un tableau de bord clair et interactif pour suivre des KPI.</p>
        <div class="divider"></div>
        <ul>
          <li>Structuration des données + définition des KPI</li>
          <li><strong>TCD</strong>, segments, calculs, graphiques dynamiques</li>
          <li>Mise en forme orientée “lecture rapide”</li>
          <li>Résultat : un dashboard exploitable pour analyser et comparer</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C3 Valoriser.</p>
      `
    },

    iofiles: {
      title: "Automatiser l’extraction de données — Python (fichiers → CSV)",
      body: `
        <p><strong>Objectif :</strong> Transformer des données brutes issues de fichiers texte/CSV en données propres et exploitables.</p>
        <div class="divider"></div>
        <ul>
          <li>Lecture automatique de fichiers</li>
          <li>Extraction d’informations via <strong>regex</strong> (expressions régulières)</li>
          <li>Nettoyage / normalisation des champs</li>
          <li>Génération d’un tableau récapitulatif au format <strong>CSV</strong></li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter.</p>
      `
    },

    co2: {
      title: "CO₂ & consommation des véhicules — Analyse de A à Z",
      body: `
        <p><strong>Objectif :</strong> Analyser l’impact du carburant, du type de véhicule et d’autres caractéristiques sur les émissions et la consommation.</p>
        <div class="divider"></div>
        <ul>
          <li>Nettoyage + structuration (qualité, valeurs manquantes, cohérence)</li>
          <li>Analyses descriptives et comparatives (carburant, type, gamme…)</li>
          <li>Visualisations (ex : boxplots) + interprétation</li>
          <li>Compte rendu structuré + recommandations (approche “client”)</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter • C2 Analyser • C3 Valoriser.</p>
      `
    },

    regression: {
      title: "Régression sur données réelles — Statistiques & modélisation",
      body: `
        <p><strong>Objectif :</strong> Construire un modèle de régression, le justifier, et interpréter correctement les résultats.</p>
        <div class="divider"></div>
        <ul>
          <li>Choix des variables et préparation des données</li>
          <li>Construction du modèle (régression) + justification</li>
          <li>Interprétation des coefficients et sens du modèle</li>
          <li>Analyse critique : cohérence, limites, pistes d’amélioration</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C2 Analyser • C4 Modéliser.</p>
      `
    },

    performance: {
      title: "Indicateurs de performance — SIG, ratios, synthèse",
      body: `
        <p><strong>Objectif :</strong> Analyser la performance d’une entreprise via indicateurs, puis restituer une synthèse exploitable.</p>
        <div class="divider"></div>
        <ul>
          <li>Analyse d’indicateurs (SIG, ratios, éléments financiers)</li>
          <li>Interprétation : ce que racontent les chiffres</li>
          <li>Points forts / points de vigilance</li>
          <li>Restitution structurée (diagnostic + conclusion)</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C2 Analyser • C3 Valoriser.</p>
      `
    },

    enquete: {
      title: "Enquête alimentaire — Questionnaire, analyse, valorisation",
      body: `
        <p><strong>Objectif :</strong> Mener une enquête de bout en bout : conception → collecte → analyse → restitution.</p>
        <div class="divider"></div>
        <ul>
          <li>Conception d’un questionnaire (objectifs, logique, formulation)</li>
          <li>Collecte des réponses + mise au propre</li>
          <li>Analyse des résultats et interprétation</li>
          <li>Valorisation : conclusions claires et structurées</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C2 Analyser • C3 Valoriser.</p>
      `
    },

    dataviz: {
      title: "Analyse & dataviz sur données publiques — de A à Z",
      body: `
        <p><strong>Objectif :</strong> Réaliser une analyse complète : cadrage, nettoyage, analyse, visualisation et synthèse.</p>
        <div class="divider"></div>
        <ul>
          <li>Définition du cadre d’étude et formulation des questions</li>
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
        <p class="muted">Ce projet n’a pas encore sa fiche détaillée.</p>
        <p>Dis-moi ce que tu veux mettre dedans et je te le rédige proprement.</p>
      `;
    } else {
      modalTitle.textContent = data.title;
      modalBody.innerHTML = data.body;
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const hideModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  // ✅ Délégation => fonctionne pour toutes les cartes (même si tu modifies le HTML)
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

  // ===== PROJECTS FILTER + SEARCH (version qui match ton HTML)
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

  // First render
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