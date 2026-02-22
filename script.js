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
    const top = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
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
  const modalFoot = document.getElementById("modalFoot");

  const MODALS = {
    "dashboard-iut": {
      title: "Tableau de bord IUT (Excel)",
      body: `
        <p class="muted"><strong>Mini présentation :</strong> Dashboard interactif Excel (KPI + filtres) pour analyser profils/candidatures/mentions/lycées/boursiers.</p>
        <div class="divider"></div>
        <p><strong>Objectif :</strong> rendre la donnée lisible et exploitable rapidement.</p>
        <ul>
          <li>KPI + graphiques cohérents</li>
          <li>Segments/filtres pour explorer</li>
          <li>Mise en page “lecture rapide”</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C3 Valoriser, C1 Traiter.</p>
      `
    },

    "excel-dashboard": {
      title: "Dashboard Excel (KPI)",
      body: `
        <p class="muted"><strong>Mini présentation :</strong> Reporting Excel centré KPI : TCD + graphiques dynamiques.</p>
        <div class="divider"></div>
        <p><strong>Objectif :</strong> produire un tableau de bord clair et professionnel.</p>
        <ul>
          <li>TCD (tableaux croisés) + segments</li>
          <li>Graphiques dynamiques</li>
          <li>Indicateurs clés + synthèse</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C3 Valoriser.</p>
      `
    },

    "fichiers-python": {
      title: "Lecture / Écriture de fichiers (Python)",
      body: `
        <p class="muted"><strong>Mini présentation :</strong> Manipulation de fichiers (CSV / texte) : extraction, nettoyage, structuration et export.</p>
        <div class="divider"></div>
        <p><strong>Objectif :</strong> rendre des données exploitables pour l’analyse.</p>
        <ul>
          <li>Lecture/écriture CSV</li>
          <li>Nettoyage + mise en forme</li>
          <li>Structuration pour analyse</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter.</p>
      `
    },

    "enquete": {
      title: "Enquête (Questionnaire)",
      body: `
        <p class="muted"><strong>Mini présentation :</strong> Projet “enquête” : construire un questionnaire, analyser les réponses, restituer clairement.</p>
        <div class="divider"></div>
        <p><strong>Objectif :</strong> obtenir une information fiable et exploitable.</p>
        <ul>
          <li>Conception des questions</li>
          <li>Analyse des réponses</li>
          <li>Restitution (synthèse / rapport)</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C2 Analyser, C3 Valoriser.</p>
      `
    },

    "sondage": {
      title: "Estimation par sondage (R)",
      body: `
        <p class="muted"><strong>Mini présentation :</strong> Simulation pour comprendre la précision d’un sondage (estimation + intervalle de confiance).</p>
        <div class="divider"></div>
        <p><strong>Objectif :</strong> comparer la précision selon la taille d’échantillon.</p>
        <ul>
          <li>Fonctions R : tirages aléatoires</li>
          <li>Estimations ponctuelles + IC</li>
          <li>Comparaison selon n</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C2 Analyser, C1 Traiter.</p>
      `
    },

    "regression": {
      title: "Régression sur données réelles (SAÉ 2.03)",
      body: `
        <p class="muted"><strong>Mini présentation :</strong> Modélisation par régression : estimer des paramètres et vérifier si le modèle est justifié.</p>
        <div class="divider"></div>
        <p><strong>Objectif :</strong> construire un modèle interprétable et argumenter son choix.</p>
        <ul>
          <li>Choix du type de modèle</li>
          <li>Estimation des paramètres (ex : a, b)</li>
          <li>Interprétation + limites</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C2 Analyser, C4 Modéliser.</p>
      `
    },

    "tumeurs": {
      title: "Classification de tumeurs (Python)",
      body: `
        <p class="muted"><strong>Mini présentation :</strong> Première approche de classification sur un dataset médical.</p>
        <div class="divider"></div>
        <p><strong>Objectif :</strong> comprendre la logique d’un modèle de classification simple.</p>
        <ul>
          <li>Nettoyage + structuration</li>
          <li>Choix de variables importantes</li>
          <li>Régression logistique</li>
          <li>Interprétation des résultats</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C4 Modéliser, C2 Analyser.</p>
      `
    },

    "sae201": {
      title: "SAÉ 2.01 — Commerce des technologies bas carbone (SQL)",
      body: `
        <p class="muted"><strong>Mini présentation :</strong> Projet complet de base de données relationnelle (données FMI) + requêtes + visualisations.</p>
        <div class="divider"></div>
        <p><strong>Objectif :</strong> modéliser, créer et exploiter une base PostgreSQL à partir de jeux de données réels.</p>
        <ul>
          <li>Modèle EA → schéma relationnel</li>
          <li>Création + peuplement + intégrité</li>
          <li>Requêtes d’analyse (jointures, agrégats)</li>
          <li>Dataviz dans Metabase + commentaires</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter, C3 Valoriser.</p>
      `
    },

    "sae206": {
      title: "SAÉ 2.06 — CO₂ & véhicules (Analyse + Dataviz)",
      body: `
        <p class="muted"><strong>Mini présentation :</strong> Analyse d’un dataset ADEME sur les émissions de CO₂ et la consommation des véhicules.</p>
        <div class="divider"></div>
        <p><strong>Objectif :</strong> comprendre l’impact du carburant, de la gamme et du type sur CO₂ et conso.</p>
        <ul>
          <li>Nettoyage + structuration des données</li>
          <li>Stats descriptives + comparaisons</li>
          <li>Visualisations et interprétation</li>
          <li>Rapport + recommandations</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter, C2 Analyser, C3 Valoriser.</p>
      `
    },

    "sae205": {
      title: "SAÉ 2.05 — Indicateurs de performance (Analyse financière)",
      body: `
        <p class="muted"><strong>Mini présentation :</strong> Étude d’une entreprise : compte de résultat, SIG, BFR, bilan fonctionnel, ratios.</p>
        <div class="divider"></div>
        <p><strong>Objectif :</strong> analyser la performance et la structure financière de l’entreprise.</p>
        <ul>
          <li>Analyse du secteur + contexte</li>
          <li>Compte de résultat, SIG (EBE...)</li>
          <li>BFR, bilan fonctionnel, ratios</li>
          <li>Synthèse argumentée</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C2 Analyser, C3 Valoriser.</p>
      `
    },

    "metabase": {
      title: "Dataviz Metabase (SQL → Dashboard)",
      body: `
        <p class="muted"><strong>Mini présentation :</strong> Création de visualisations à partir de requêtes SQL et restitution “décision”.</p>
        <div class="divider"></div>
        <p><strong>Objectif :</strong> transformer une requête en dashboard compréhensible.</p>
        <ul>
          <li>Graphiques adaptés (barres, courbes...)</li>
          <li>Filtres + segmentation</li>
          <li>Commentaires orientés conclusion</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C3 Valoriser, C1 Traiter.</p>
      `
    }
  };

  const openModal = (key) => {
    if (!modal || !modalTitle || !modalBody || !modalFoot) return;
    const data = MODALS[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.body;

    // Reset footer (keeps OK button)
    modalFoot.querySelectorAll("a[data-modal-link]")?.forEach(a => a.remove());

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

  document.querySelectorAll("[data-modal]")?.forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-modal")));
  });

  closeModal?.addEventListener("click", hideModal);
  modalOk?.addEventListener("click", hideModal);
  modal?.addEventListener("click", (e) => { if (e.target === modal) hideModal(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

  // ===== PROJECT FILTERS + SEARCH
  const filtersWrap = document.getElementById("projectFilters");
  const searchInput = document.getElementById("projectSearch");
  const cards = Array.from(document.querySelectorAll("#projectsGrid .pCard"));

  let activeFilter = "all";
  let searchQuery = "";

  const normalize = (s) =>
    (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

  const applyProjectsFilter = () => {
    const q = normalize(searchQuery);

    cards.forEach(card => {
      const tags = (card.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
      const hay = normalize(card.getAttribute("data-search") || "") + " " + normalize(card.innerText);

      const passFilter = (activeFilter === "all") || tags.includes(activeFilter);
      const passSearch = !q || hay.includes(q);

      card.classList.toggle("is-hidden", !(passFilter && passSearch));
    });
  };

  filtersWrap?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;

    activeFilter = btn.getAttribute("data-filter") || "all";

    filtersWrap.querySelectorAll(".chipFilter").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    applyProjectsFilter();
  });

  searchInput?.addEventListener("input", () => {
    searchQuery = searchInput.value || "";
    applyProjectsFilter();
  });

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