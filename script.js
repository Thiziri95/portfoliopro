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

  // ===== MODAL (projects) — FIX: tous les projets cliquables
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const modalOk = document.getElementById("modalOk");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  const MODALS = {
    // anciens
    tumeurs: {
      title: "Classification de tumeurs (Python)",
      body: `
        <p><strong>Mini présentation :</strong> Première approche de classification sur un jeu de données médical.</p>
        <div class="divider"></div>
        <ul>
          <li>Préparation des données (nettoyage, structuration)</li>
          <li>Choix/lecture des variables importantes</li>
          <li>Modélisation : régression logistique</li>
          <li>Interprétation des résultats (rigueur + logique)</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C4 Modéliser, C2 Analyser.</p>
      `
    },
    sondage: {
      title: "Estimation par sondage (R)",
      body: `
        <p><strong>Mini présentation :</strong> Comprendre la fiabilité d’un sondage via simulation et intervalles de confiance.</p>
        <div class="divider"></div>
        <ul>
          <li>Fonctions R : tirages aléatoires et estimations</li>
          <li>Estimation ponctuelle + intervalle de confiance</li>
          <li>Comparaison de précision selon la taille d’échantillon</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C2 Analyser, C1 Traiter.</p>
      `
    },
    sql: {
      title: "Projet Base de données (SQL + PostgreSQL + Metabase)",
      body: `
        <p><strong>Mini présentation :</strong> Structurer et exploiter des données dans un SGBD relationnel.</p>
        <div class="divider"></div>
        <ul>
          <li>Conception : schéma relationnel</li>
          <li>Requêtes : jointures, agrégations</li>
          <li>Exploitation + visualisation dans Metabase</li>
          <li>Commentaires orientés décision</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter, C3 Valoriser.</p>
      `
    },
    excel: {
      title: "Dashboard Excel (KPI + graphiques dynamiques)",
      body: `
        <p><strong>Mini présentation :</strong> Reporting clair et directement exploitable.</p>
        <div class="divider"></div>
        <ul>
          <li>TCD + segments</li>
          <li>Graphiques dynamiques + KPI</li>
          <li>Mise en forme “lecture rapide”</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C3 Valoriser.</p>
      `
    },

    // ajouts
    fichiers: {
      title: "Lecture / Écriture de fichiers (Python)",
      body: `
        <p><strong>Mini présentation :</strong> Manipulation de données brutes (CSV/texte) pour les rendre propres et utilisables.</p>
        <div class="divider"></div>
        <ul>
          <li>Lecture de fichiers (CSV, texte)</li>
          <li>Nettoyage : formats, valeurs manquantes, cohérence</li>
          <li>Extraction d’informations (si besoin : regex)</li>
          <li>Export en CSV propre pour analyse</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter.</p>
      `
    },

    sae201: {
      title: "SAÉ 2.01 — Commerce des technologies bas carbone (SQL)",
      body: `
        <p><strong>Mini présentation :</strong> Projet complet : modélisation + création + exploitation d’une base SQL à partir de données FMI.</p>
        <div class="divider"></div>
        <ul>
          <li>Modèle EA → schéma relationnel</li>
          <li>Création & peuplement en SQL</li>
          <li>Requêtes d’analyse (jointures, agrégats)</li>
          <li>Dataviz Metabase + interprétation</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter, C3 Valoriser.</p>
      `
    },

    sae206: {
      title: "SAÉ 2.06 — CO₂ & véhicules (Analyse + Dataviz)",
      body: `
        <p><strong>Mini présentation :</strong> Analyse d’un dataset ADEME : émissions CO₂ & consommation selon carburant/type/gamme.</p>
        <div class="divider"></div>
        <ul>
          <li>Nettoyage + structuration des données</li>
          <li>Stats descriptives + comparaisons</li>
          <li>Dataviz + commentaire scientifique</li>
          <li>Recommandations (approche “client”)</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C1 Traiter, C2 Analyser, C3 Valoriser.</p>
      `
    },

    sae203: {
      title: "SAÉ 2.03 — Régression sur données réelles",
      body: `
        <p><strong>Mini présentation :</strong> Construire un modèle de régression et justifier les choix.</p>
        <div class="divider"></div>
        <ul>
          <li>Choix du modèle (linéaire/non-linéaire)</li>
          <li>Estimation des paramètres</li>
          <li>Validation + limites</li>
          <li>Interprétation des résultats</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C2 Analyser, C4 Modéliser.</p>
      `
    },

    sae205: {
      title: "SAÉ 2.05 — Indicateurs de performance",
      body: `
        <p><strong>Mini présentation :</strong> Étude de performance d’une entreprise : SIG, BFR, ratios, synthèse.</p>
        <div class="divider"></div>
        <ul>
          <li>Analyse du secteur + contexte</li>
          <li>Compte de résultat + SIG</li>
          <li>BFR, bilan fonctionnel, ratios</li>
          <li>Restitution structurée (diagnostic)</li>
        </ul>
        <p class="muted small"><strong>Compétences :</strong> C2 Analyser, C3 Valoriser.</p>
      `
    }
  };

  const openModal = (key) => {
    if (!modal || !modalTitle || !modalBody) return;

    const data = MODALS[key];

    // fallback si un data-modal existe mais pas de contenu (au lieu de “rien”)
    if (!data) {
      modalTitle.textContent = "Détails du projet";
      modalBody.innerHTML = `
        <p class="muted">Ce projet n’a pas encore sa fiche détaillée.</p>
        <p>Tu peux me dire le nom exact et je te fais la fiche complète.</p>
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

  // ✅ FIX: délégation d’événement => même si tes cartes changent, ça marche
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

  // ===== FILTERS + SEARCH — FIX: fonctionne vraiment
  const filtersWrap = document.getElementById("projectFilters");
  const searchInput = document.getElementById("projectSearch");
  const grid = document.getElementById("projectsGrid");

  let activeFilter = "all";
  let searchQuery = "";

  const normalize = (s) =>
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const applyProjectsFilter = () => {
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll(".pCard"));
    const q = normalize(searchQuery);

    cards.forEach(card => {
      const tags = (card.getAttribute("data-tags") || "")
        .split(/\s+/)
        .filter(Boolean);

      const searchBlob =
        normalize(card.getAttribute("data-search")) + " " + normalize(card.textContent);

      const passFilter = (activeFilter === "all") || tags.includes(activeFilter);
      const passSearch = !q || searchBlob.includes(q);

      card.classList.toggle("is-hidden", !(passFilter && passSearch));
    });
  };

  // click sur filtre
  filtersWrap?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;

    activeFilter = btn.getAttribute("data-filter") || "all";

    filtersWrap.querySelectorAll(".chipFilter").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    applyProjectsFilter();
  });

  // recherche (pas besoin d’Entrée, filtre instant)
  searchInput?.addEventListener("input", () => {
    searchQuery = searchInput.value || "";
    applyProjectsFilter();
  });

  // si tu appuies Entrée, on force aussi
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyProjectsFilter();
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