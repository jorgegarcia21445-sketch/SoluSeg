document.addEventListener("DOMContentLoaded", () => {
  const EMAIL = "soluseg@gmail.com";

  /* ---------- Active link while scrolling ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));

  /* ---------- Header shadow on scroll ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("menu");

  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- "Cotizar" buttons preselect the service ---------- */
  const select = document.getElementById("servicio");
  document.querySelectorAll("[data-servicio]").forEach((btn) => {
    btn.addEventListener("click", () => { if (select) select.value = btn.dataset.servicio; });
  });

  /* ---------- Contact form -> validates, then opens email client ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const ok = field.value.trim() !== "" &&
          (field.type !== "email" || /^\S+@\S+\.\S+$/.test(field.value.trim()));
        field.parentElement.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        status.className = "c-status err";
        status.textContent = "Por favor escriba su nombre y un correo válido.";
        return;
      }

      const d = Object.fromEntries(new FormData(form));
      const subject = `Solicitud de cotización - ${d.servicio}`;
      const body = [
        `Nombre: ${d.nombre}`,
        `Empresa: ${d.empresa || "-"}`,
        `Correo: ${d.correo}`,
        `Teléfono: ${d.telefono || "-"}`,
        `Servicio de interés: ${d.servicio}`,
        "",
        "Proyecto:",
        d.mensaje || "-",
      ].join("\n");

      window.location.href =
        `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      status.className = "c-status ok";
      status.textContent = "¡Gracias! Se abrió su correo con la solicitud lista para enviar.";
      form.reset();
    });

    form.querySelectorAll("input, textarea").forEach((f) =>
      f.addEventListener("input", () => f.parentElement.classList.remove("invalid"))
    );
  }
});
