/**
 * Floys Beauty — Main Script (Multipages)
 * Contiene animaciones GSAP, lógica del catálogo, portafolio y botón de reserva de WhatsApp.
 */

import gsap from "https://esm.sh/gsap@3.12.5";
import { ScrollTrigger } from "https://esm.sh/gsap@3.12.5/ScrollTrigger";

/** WhatsApp Colombia (57) + número sin + ni espacios */
const WHATSAPP_NUMERO = "573226968900";


let selectedServices = [];
if (typeof sessionStorage !== "undefined") {
  try {
    const saved = sessionStorage.getItem("floysBeautySelectedServices");
    if (saved) selectedServices = JSON.parse(saved);
  } catch(e) { selectedServices = []; }
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
      if (!selectedServices || selectedServices.length === 0) {
        msg.textContent = "Selecciona al menos un servicio del catálogo.";
        msg.className = "form-msg err";
        return;
      }
      detalleMaquillaje = "Del catálogo:\n" + selectedServices.map(s => `- ${s.title}`).join("\n");
    }

    if (!WHATSAPP_NUMERO || !/^\d{10,15}$/.test(WHATSAPP_NUMERO)) {
      msg.textContent = "Número de WhatsApp no válido en script.js (WHATSAPP_NUMERO).";
      msg.className = "form-msg err";
      return;
    }

    const body = [
      "Hola linda, quisiera reservar:",
      `Nombre: ${nombre}`,
      `Servicios:\n${detalleMaquillaje}`,
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

    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem("floysBeautySelectedServices");
    }
    selectedServices = [];
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
const PORTFOLIO_DATA = {
  social: [
    "https://images.unsplash.com/photo-1512496115841-a01baf15628e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1599423653151-c0e86b24feea?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80"
  ],
  novia: [
    "novia_civil.png",
    "https://images.unsplash.com/photo-1506085449019-3253baf6ab29?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549424750-1c05d76d4db7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582649033355-6b5cf0bfb6af?auto=format&fit=crop&w=800&q=80"
  ],
  quinceanera: [
    "https://images.unsplash.com/photo-1516975080661-46bdcb3961bb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1505027429184-bba91b2bf1d1?auto=format&fit=crop&w=800&q=80"
  ],
  glam_noche: [
    "https://images.unsplash.com/photo-1503236823255-94609f592e73?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516975080661-46bdcb3961bb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80"
  ],
  social_dia_noche: [
    "https://images.unsplash.com/photo-1596704017254-9b121068fb21?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512496115841-a01baf15628e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506085449019-3253baf6ab29?auto=format&fit=crop&w=800&q=80"
  ],
  fotos_pasarela: [
    "https://images.unsplash.com/photo-1616086708688-660c6d79e5ba?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1632168925203-b0e6bf3d2b27?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503236823255-94609f592e73?auto=format&fit=crop&w=800&q=80"
  ],
  cejas: [
    "https://images.unsplash.com/photo-1620067081745-f0ea996ea354?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1599423653151-c0e86b24feea?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512496115841-a01baf15628e?auto=format&fit=crop&w=800&q=80"
  ],
  pestanas: [
    "https://images.unsplash.com/photo-1620067081745-f0ea996ea354?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596704017254-9b121068fb21?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503236823255-94609f592e73?auto=format&fit=crop&w=800&q=80"
  ]
};

const CATALOG_DATA = {
  social: [
    { title: "Maquillaje Social Clásico", desc: "Piel luminosa, tonos neutros y labios gloss.", img: "https://images.unsplash.com/photo-1512496115841-a01baf15628e?auto=format&fit=crop&w=400&q=80" }
  ],
  novia: [
    { title: "Novia Civil", desc: "Maquillaje de novia clásico, mate y sencillo, ideal para juzgado.", img: "novia_civil.png" }
  ],
  quinceanera: [
    { title: "Quinceañera Princesa", desc: "Toques sutiles y luminosos para un look juvenil y elegante.", img: "https://images.unsplash.com/photo-1516975080661-46bdcb3961bb?auto=format&fit=crop&w=400&q=80" }
  ],
  glam_noche: [
    { title: "Glam de Noche Intensivo", desc: "Ojos ahumados o destellos vibrantes para destacar bajo la luna.", img: "https://images.unsplash.com/photo-1503236823255-94609f592e73?auto=format&fit=crop&w=400&q=80" }
  ],
  social_dia_noche: [
    { title: "Look Transición", desc: "Maquillaje versátil que dura todo el día y destaca en la noche.", img: "https://images.unsplash.com/photo-1599423653151-c0e86b24feea?auto=format&fit=crop&w=400&q=80" }
  ],
  fotos_pasarela: [
    { title: "Editorial HD", desc: "Piel impecable, contrastes dramáticos aptos para cámaras profesionales.", img: "https://images.unsplash.com/photo-1596704017254-9b121068fb21?auto=format&fit=crop&w=400&q=80" }
  ],
  cejas: [
    { title: "Diseño de Cejas HD", desc: "Perfilado, laminado o henna para un marco perfecto en tu rostro.", img: "https://images.unsplash.com/photo-1616086708688-660c6d79e5ba?auto=format&fit=crop&w=400&q=80" }
  ],
  pestanas: [
    { title: "Lifting y Extensiones", desc: "Pestañas con volumen, curva y un efecto de mirada impactante.", img: "https://images.unsplash.com/photo-1632168925203-b0e6bf3d2b27?auto=format&fit=crop&w=400&q=80" }
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

window.removeService = function(index) {
  selectedServices.splice(index, 1);
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("floysBeautySelectedServices", JSON.stringify(selectedServices));
  }
  updateBookingPreview();
};

function updateBookingPreview() {
  const previewContainer = document.querySelector("#booking-preview-container .booking-card");
  const source = document.querySelector('input[name="makeup_source"]:checked')?.value;

  if (!previewContainer) return;

  previewContainer.innerHTML = '';
  previewContainer.className = 'booking-card';

  if (source === 'catalogo') {
    if (selectedServices && selectedServices.length > 0) {
      previewContainer.classList.add('has-data');
      
      let html = `<div style="margin-bottom: 12px;"><strong style="color:var(--primary); font-size: 0.85rem; text-transform: uppercase;">Servicios agendados:</strong></div>`;
      html += `<div style="display:flex; flex-direction:column; gap: 12px;">`;
      
      selectedServices.forEach((serv, index) => {
        html += `<div class="booking-info" style="display:flex; align-items:center; justify-content:space-between; gap: 1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 8px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${serv.img}" alt="Preview" style="width: 45px; height: 45px; border-radius: 8px; object-fit: cover; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />
            <span style="color:var(--text); font-weight:600; font-size: 0.95rem;">${serv.title}</span>
          </div>
          <button type="button" onclick="removeService(${index})" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold; font-size:1.4rem; padding: 0 8px; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">&times;</button>
        </div>`;
      });
      
      html += `</div>`;
      previewContainer.innerHTML = html;
    } else {
      previewContainer.classList.add('empty');
      previewContainer.innerHTML = `<span id="booking-preview-text">Selecciona uno o más servicios en el catálogo.</span>`;
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
        <button type="button" class="btn btn-primary btn-glow btn-select-service" data-title="${item.title}" data-img="${item.img}">Seleccionar estilo</button>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".btn-select-service").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedServices.push({ title: btn.dataset.title, img: btn.dataset.img });
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem("floysBeautySelectedServices", JSON.stringify(selectedServices));
      }

      const radio = document.querySelector('input[name="makeup_source"][value="catalogo"]');
      if (radio) radio.checked = true;

      updateBookingPreview();

      showToast(`Añadido: "${btn.dataset.title}". Revisa tu reserva al final.`);
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

  // Portafolio Modal Galeria
  const modal = document.getElementById("portfolio-modal");
  const modalGrid = document.getElementById("portfolio-gallery-grid");
  const modalTitle = document.getElementById("portfolio-modal-title");
  const closeBtn = document.getElementById("portfolio-close");

  const openModal = (categoryName, imageUrls) => {
    if (!modal || !modalGrid) return;
    if (modalTitle) modalTitle.textContent = categoryName;
    modalGrid.innerHTML = imageUrls.map(url => `<img src="${url}" alt="${categoryName}" loading="lazy" class="lightbox-trigger" style="cursor: zoom-in;" />`).join("");
    
    // Bind Lightbox clicks
    const lbModal = document.getElementById("lightbox-modal");
    const lbImg = document.getElementById("lightbox-img");
    modalGrid.querySelectorAll(".lightbox-trigger").forEach(img => {
      img.addEventListener("click", () => {
        if (lbModal && lbImg) {
          lbImg.src = img.src;
          lbModal.classList.add("active");
        }
      });
    });

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
    if (modalGrid) modalGrid.innerHTML = "";
  };

  // Close Lightbox
  const lbModal = document.getElementById("lightbox-modal");
  const lbCloseBtn = document.getElementById("lightbox-close");
  const closeLb = () => {
    if (lbModal) lbModal.classList.remove("active");
  };
  lbCloseBtn?.addEventListener("click", closeLb);
  lbModal?.addEventListener("click", (e) => {
    if (e.target === lbModal || e.target.tagName.toLowerCase() !== 'img') closeLb();
  });

  document.querySelectorAll(".portfolio-item").forEach(item => {
    item.addEventListener("click", () => {
      const catId = item.dataset.category;
      if (catId && PORTFOLIO_DATA[catId]) {
        const catName = item.querySelector("figcaption")?.textContent || "Portafolio";
        openModal(catName, PORTFOLIO_DATA[catId]);
      }
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
