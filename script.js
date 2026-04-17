/**
 * Glam Hub — Main Script (Multipages)
 * Contiene animaciones GSAP, lógica del catálogo, portafolio y botón de reserva de WhatsApp.
 */

import gsap from "https://esm.sh/gsap@3.12.5";
import { ScrollTrigger } from "https://esm.sh/gsap@3.12.5/ScrollTrigger";

/** WhatsApp Colombia (57) + número sin + ni espacios */
const WHATSAPP_NUMERO = "573226624007";


let selectedCatalogService = null;
if (typeof localStorage !== "undefined") {
  selectedCatalogService = localStorage.getItem("glamHubSelectedService") || null;
}

/**
 * Inicializa y configura los eventos de la interfaz de usuario.
 * Se encarga de vincular los botones de la página de inicio (hero), 
 * el procesamiento del formulario de reservas en WhatsApp y los años del footer.
 */
function wireUi() {
  document.getElementById("hero-preview-btn")?.addEventListener("click", () => {
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
    if (gsap) {
      gsap.fromTo(
        "#side-panel",
        { boxShadow: "0 0 0 rgba(167,139,250,0)" },
        {
          boxShadow: "0 0 40px rgba(167,139,250,0.45)",
          duration: 0.6,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        }
      );
    }
  });

  document.getElementById("booking-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("form-msg");
    if (!msg) return;
    const fd = new FormData(e.target);
    const nombre = String(fd.get("name") || "").trim();
    const makeupSource = String(fd.get("makeup_source") || "catalogo");
    const fecha = String(fd.get("date") || "").trim();
    const hora = String(fd.get("time") || "").trim();

    if (!nombre || !fecha || !hora) {
      msg.textContent = "Completa nombre, fecha y hora.";
      msg.className = "form-msg err";
      return;
    }

    let detalleMaquillaje = "";
    if (makeupSource === "catalogo") {
      if (!selectedCatalogService) {
        msg.textContent = "Selecciona un servicio del catálogo.";
        msg.className = "form-msg err";
        return;
      }
      detalleMaquillaje = `Del catálogo: ${selectedCatalogService}`;
    }

    if (!WHATSAPP_NUMERO || !/^\d{10,15}$/.test(WHATSAPP_NUMERO)) {
      msg.textContent = "Número de WhatsApp no válido en script.js (WHATSAPP_NUMERO).";
      msg.className = "form-msg err";
      return;
    }

    const body = [
      "Hola linda, quisiera reservar un servicio de maquillaje:",
      `Nombre: ${nombre}`,
      `Tipo: ${detalleMaquillaje}`,
      `Fecha: ${fecha}`,
      `Hora: ${hora}`,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(body)}`;

    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      msg.textContent = "Permite ventanas emergentes para WhatsApp.";
      msg.className = "form-msg err";
      return;
    }

    msg.textContent = "Listo: se abrió WhatsApp. Puedes seguir navegando.";
    msg.className = "form-msg ok";
    e.target.reset();

    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("glamHubSelectedService");
    }
    selectedCatalogService = null;
    updateBookingPreview();
  });

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

// ---------------------------------------------------------------------------
// GSAP — animaciones de entrada y scroll
// ---------------------------------------------------------------------------

/**
 * Registra y activa las animaciones de entrada y de scroll 
 * utilizando GSAP y ScrollTrigger para darle interactividad a los elementos visuales.
 */
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero-inner > [data-animate]", {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.15,
  });

  gsap.utils.toArray("[data-animate='fade']").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
      y: 28,
      opacity: 0,
      duration: 0.85,
      ease: "power2.out",
    });
  });

  gsap.utils.toArray("[data-animate='fade-up']").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
      },
      y: 36,
      opacity: 0,
      duration: 0.75,
      ease: "power2.out",
    });
  });

  gsap.utils.toArray("[data-animate='scale-in']").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
      },
      scale: 0.92,
      opacity: 0,
      duration: 0.7,
      ease: "back.out(1.2)",
    });
  });
}

// ---------------------------------------------------------------------------
// Nuevas Funcionalidades: Catálogo, Portafolio, Guardar Look
// ---------------------------------------------------------------------------

const CATALOG_DATA = {
  social: [
    { title: "Glam Radiante", desc: "Piel luminosa, tonos neutros y labios gloss.", img: "https://images.unsplash.com/photo-1512496115841-a01baf15628e?auto=format&fit=crop&w=400&q=80" },
    { title: "Soft Matte", desc: "Acabado aterciopelado, larga duración ideal para fotos.", img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=400&q=80" },
    { title: "Fiesta de noche", desc: "Ojos ahumados o destellos sutiles para destacar.", img: "https://images.unsplash.com/photo-1516975080661-46bdcb3961bb?auto=format&fit=crop&w=400&q=80" }
  ],
  profesional: [
    { title: "Editorial Alta Costura", desc: "Propuesta vanguardista y texturas arriesgadas.", img: "https://images.unsplash.com/photo-1596704017254-9b121068fb21?auto=format&fit=crop&w=400&q=80" },
    { title: "Look Pasarela", desc: "Énfasis dramático ajustado a la dirección de arte.", img: "https://images.unsplash.com/photo-1503236823255-94609f592e73?auto=format&fit=crop&w=400&q=80" },
    { title: "Beauty Macro", desc: "Piel impecable HD y detalle minucioso.", img: "https://images.unsplash.com/photo-1599423653151-c0e86b24feea?auto=format&fit=crop&w=400&q=80" }
  ],
  artistico: [
    { title: "Neón Cyberpunk", desc: "Colores vibrantes UV y delineados gráficos.", img: "https://images.unsplash.com/photo-1616086708688-660c6d79e5ba?auto=format&fit=crop&w=400&q=80" },
    { title: "Fantasía & FX", desc: "Caracterización, pedrería y apliques creativos.", img: "https://images.unsplash.com/photo-1632168925203-b0e6bf3d2b27?auto=format&fit=crop&w=400&q=80" },
    { title: "Avant-Garde", desc: "Conceptos libres y expresiones fuera de lo común.", img: "https://images.unsplash.com/photo-1506085449019-3253baf6ab29?auto=format&fit=crop&w=400&q=80" }
  ]
};

/**
 * Muestra una notificación temporal tipo 'toast' en la parte inferior de la pantalla.
 * @param {string} msg - El texto o mensaje que se mostrará en la notificación.
 */
function showToast(msg) {
  const toast = document.getElementById("toast-notification");
  const msgEl = document.getElementById("toast-msg");
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

/**
 * Actualiza la vista previa visual (pequeña tarjeta) en el formulario de reservas, 
 * dependiendo de si se seleccionó un servicio especial del catálogo.
 */
function updateBookingPreview() {
  const previewContainer = document.querySelector("#booking-preview-container .booking-card");
  const previewText = document.getElementById("booking-preview-text");
  const source = document.querySelector('input[name="makeup_source"]:checked')?.value;

  if (!previewContainer || !previewText) return;

  previewContainer.innerHTML = '';
  previewContainer.className = 'booking-card';

  if (source === 'catalogo') {
    if (selectedCatalogService) {
      previewContainer.classList.add('has-data');
      previewContainer.innerHTML = `<div class="booking-info">
        <strong>Selección:</strong> <span style="margin-left:8px; color:var(--text);">${selectedCatalogService}</span>
      </div>`;
    } else {
      previewContainer.classList.add('empty');
      previewContainer.innerHTML = `<span id="booking-preview-text">Selecciona un servicio en el catálogo.</span>`;
    }
  }
}

/**
 * Carga y renderiza en pantalla los servicios del catálogo basándose en una categoría.
 * @param {string} category - Nombre de la categoría a mostrar (por ejemplo: 'social', 'profesional', 'artistico').
 */
function loadCatalog(category) {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;

  const items = CATALOG_DATA[category] || [];
  grid.innerHTML = items.map(item => `
    <article class="catalog-card glass">
      <img src="${item.img}" alt="${item.title}" class="catalog-card-img" loading="lazy" />
      <div class="catalog-card-content">
        <h3 class="catalog-card-title">${item.title}</h3>
        <p class="catalog-card-desc">${item.desc}</p>
        <button type="button" class="btn btn-primary btn-glow btn-select-service" data-title="${item.title}">Seleccionar estilo</button>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".btn-select-service").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedCatalogService = btn.dataset.title;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("glamHubSelectedService", selectedCatalogService);
      }

      const radio = document.querySelector('input[name="makeup_source"][value="catalogo"]');
      if (radio) radio.checked = true;

      updateBookingPreview();

      const reservasSeccion = document.getElementById("reservas");
      if (reservasSeccion) {
        showToast(`Estilo "${selectedCatalogService}" seleccionado para reservar.`);
        reservasSeccion.scrollIntoView({ behavior: "smooth" });
      } else {
        showToast(`Estilo "${selectedCatalogService}" seleccionado. Redirigiendo a reservas...`);
        setTimeout(() => {
          window.location.href = "reservas.html";
        }, 1200);
      }
    });
  });
}

/**
 * Descarga una imagen alojada temporalmente (Data URL) al dispositivo o equipo del usuario.
 * @param {string} uri - Los datos de la imagen codificada devuelta por el navegador.
 * @param {string} name - Nombre sugerido con el cual se guardará el archivo en el sistema.
 */
function downloadURI(uri, name) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Configura funcionalidades interactivas secundarias: botones y filtros del catálogo, 
 * modal de exploración del portafolio en pantalla completa y cambios en las opciones de reservas.
 */
function initNewFeatures() {
  // Catálogo Filtros
  const filters = document.querySelectorAll(".catalog-filter");
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(f => f.classList.remove("active"));
      btn.classList.add("active");
      loadCatalog(btn.dataset.category);
    });
  });

  loadCatalog("social");

  // Portafolio Modal
  const modal = document.getElementById("portfolio-modal");
  const modalImg = document.getElementById("portfolio-modal-img");
  const closeBtn = document.getElementById("portfolio-close");

  const openModal = (src) => {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".portfolio-item").forEach(item => {
    item.addEventListener("click", () => {
      const src = item.dataset.image;
      if (src) openModal(src);
    });
  });

  closeBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Radio forms
  const radios = document.querySelectorAll('input[name="makeup_source"]');
  radios.forEach(radio => {
    radio.addEventListener("change", updateBookingPreview);
  });

  updateBookingPreview();
}

/**
 * Función principal y punto de entrada. Orquesta y manda a llamar la configuración 
 * de la UI, las nuevas funciones por componentes y las librerías de animaciones.
 */
function init() {
  wireUi();
  initNewFeatures();
  initAnimations();
}

init();
