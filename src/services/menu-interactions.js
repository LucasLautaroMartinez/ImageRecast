import gsap from "gsap";
import Flip from "gsap/flip";

gsap.registerPlugin(Flip);

/*===========================================-----↓ DESKTOP MENU ↓-----==========================================*/

export function initDesktopMenu(root) {
  let isAnimating = false;
  const panels = gsap.utils.toArray(root.querySelectorAll(".menu-panel"));
  const navbar = root.querySelector(".navbar");
  const megaMenu = root.querySelector(".mega-menu");
  const menu = root.querySelector("#menu-desktop");

  if (!navbar || !megaMenu) return;

  let activePanel = null;
  let activeItem = null;
  let lastIndex = null;
  let closeTimer = null;

  // Utilidades
  function resetPanel(panel) {
    panel.style.opacity = 1;
    panel.style.filter = "none";
    panel.style.pointerEvents = "auto";
    panel.style.transform = "none";
  }

  function hidePanel(panel) {
    panel.style.opacity = 0;
    panel.style.filter = "blur(16px)";
    panel.style.pointerEvents = "none";
    panel.style.transform = "none";
  }

  function clearCloseTimer() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  // Apertura
  function playOpen(panel) {
    clearCloseTimer();
    if (panel === activePanel) return;

    panels.forEach(p => {
      if (p !== panel) {
        p._tl?.kill();
        hidePanel(p);
        p.classList.remove("active");
      }
    });

    panel._tl?.kill();
    resetPanel(panel);

    const state = Flip.getState(panels);
    panel.classList.add("active");
    activePanel = panel;

    const direction = Number(panel.dataset.direction || 0);
    const offset = direction === 0 ? 0 : (direction === 1 ? 40 : -40);

    panel._tl = gsap.timeline();

    panel._tl.add(
      Flip.from(state, {
        duration: 0.22,
        ease: "power2.out",
        absolute: true
      })
    );

    panel._tl.fromTo(
      panel,
      { opacity: 0, filter: "blur(16px)", x: offset * -1 },
      { opacity: 1, filter: "blur(0px)", x: 0, duration: 0.22, ease: "power2.out" },
      "<"
    );

    panel._tl.to(
      megaMenu,
      {
        height: panel.scrollHeight,
        duration: 0.35,
        ease: "power2.out"
      },
      "<"
    );
  }

  // Cierre
  function playClose(panel) {
    panel._tl?.kill();

    const state = Flip.getState(panels);
    panel.classList.remove("active");

    panel._tl = gsap.timeline({
      onComplete: () => hidePanel(panel)
    });

    panel._tl.add(
      Flip.from(state, {
        duration: 0.22,
        ease: "power2.out",
        absolute: true
      })
    );

    panel._tl.to(
      panel,
      {
        opacity: 0,
        filter: "blur(16px)",
        duration: 0.18,
        ease: "power2.out"
      },
      "<"
    );

    panel._tl.to(
      megaMenu,
      {
        height: 0,
        duration: 0.30,
        ease: "power2.out"
      },
      "<"
    );
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer = setTimeout(() => {
      if (activePanel) {
        playClose(activePanel);
        activePanel = null;
      }
      if (activeItem) {
        activeItem.classList.remove("item-active");
        activeItem = null;
      }
    }, 120);
  }

  function attemptClose() {
    if (navbar.matches(":hover")) return;
    if (megaMenu.matches(":hover")) return;
    scheduleClose();
  }

  // Eventos
  const items = Array.from(root.querySelectorAll(".nav-items li"));

  items.forEach(item => {
    item.addEventListener("mouseenter", () => {
      clearCloseTimer();

      const menuKey = item.dataset.menu;
      if (!menuKey) {
        scheduleClose();
        return;
      }

      const target = root.querySelector(`.menu-panel[data-panel="${menuKey}"]`);
      if (!target) return;

      const index = items.indexOf(item);
      const direction = lastIndex === null ? 0 : (index > lastIndex ? 1 : -1);
      lastIndex = index;

      target.dataset.direction = direction;

      if (activeItem) activeItem.classList.remove("item-active");
      item.classList.add("item-active");
      activeItem = item;

      playOpen(target);
    });
  });

  navbar.addEventListener("mouseleave", attemptClose);
  megaMenu.addEventListener("mouseleave", attemptClose);
  navbar.addEventListener("mouseenter", clearCloseTimer);
  megaMenu.addEventListener("mouseenter", clearCloseTimer);

  // Mostrar/ocultar navbar durante scroll
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    clearCloseTimer();

    if (activePanel) {
      playClose(activePanel);
      activePanel = null;
    }

    if (activeItem) {
      activeItem.classList.remove("item-active");
      activeItem = null;
    }

    const currentScroll = window.scrollY;

    if (currentScroll > lastScrollY) {
      menu.classList.remove("show-fast");
      menu.classList.add("hidden");
    } else {
      menu.classList.add("show-fast");
      menu.classList.remove("hidden");
    }

    lastScrollY = currentScroll;
  };

  window.addEventListener("scroll", handleScroll);

  // Cleanup
  return () => {
    window.removeEventListener("scroll", handleScroll);
    clearCloseTimer();
    panels.forEach(p => p._tl?.kill());
  };
}
/*===========================================-----↑ DESKTOP MENU ↑-----==========================================*/


/*===========================================-----↓ MOBILE MENU ↓-----===========================================*/

export function initMobileMenu(root) {
  const hamburger = root.querySelector(".hamburger");
  const sidebar = root.querySelector(".mobile-sidebar");
  const overlay = root.querySelector(".mobile-overlay");
  const topbar = root.querySelector("#menu-mobile");

  if (!hamburger || !sidebar || !overlay) return;

  let isOpen = false;
  let openSubmenu = null;
  let activeItem = null;

  // Función para cerrar todos los submenús
  function closeAllSubmenus() {
    const allSubmenus = root.querySelectorAll(".sidebar-submenu");
    allSubmenus.forEach(sub => {
      gsap.to(sub, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut"
      });
    });

    const allItems = root.querySelectorAll(".sidebar-item[data-submenu]");
    allItems.forEach(item => item.classList.remove("active"));

    openSubmenu = null;
    activeItem = null;
  }

  // Abrir sidebar
  function openSidebar() {
    if (isOpen) return;
    isOpen = true;

    hamburger.classList.add("active");

    gsap.to(overlay, {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.3,
      ease: "power2.out"
    });

    gsap.to(sidebar, {
      x: 0,
      duration: 0.4,
      ease: "power3.out"
    });
  }

  // Cerrar sidebar
  function closeSidebar() {
    if (!isOpen) return;
    isOpen = false;

    hamburger.classList.remove("active");

    gsap.to(overlay, {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.3,
      ease: "power2.in"
    });

    gsap.to(sidebar, {
      x: "-100%",
      duration: 0.4,
      ease: "power3.in",
      onComplete: () => {
        closeAllSubmenus();
      }
    });
  }

  // Toggle submenu
  function toggleSubmenu(item) {
    const submenuId = item.dataset.submenu;
    if (!submenuId) return;

    const submenu = root.querySelector(`.sidebar-submenu[data-submenu-content="${submenuId}"]`);
    if (!submenu) return;

    const isActive = item.classList.contains("active");

    if (isActive) {
      // Cerrar
      item.classList.remove("active");

      gsap.to(submenu, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut"
      });

      openSubmenu = null;
      activeItem = null;
    } else {
      // Cerrar el anterior si existe
      if (openSubmenu && openSubmenu !== submenu) {
        const prevItem = root.querySelector(`.sidebar-item[data-submenu="${openSubmenu.dataset.submenuContent}"]`);
        if (prevItem) prevItem.classList.remove("active");

        gsap.to(openSubmenu, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut"
        });
      }

      // Abrir el nuevo
      item.classList.add("active");

      const inner = submenu.querySelector(".submenu-inner");
      const targetHeight = inner ? inner.scrollHeight : 0;

      gsap.to(submenu, {
        height: targetHeight,
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut"
      });

      openSubmenu = submenu;
      activeItem = item;
    }
  }

  // Eventos
  hamburger.addEventListener("click", () => {
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
  
  overlay.addEventListener("click", closeSidebar);

  const sidebarItems = root.querySelectorAll(".sidebar-item[data-submenu]");
  const toggleHandlers = [];
  
  sidebarItems.forEach(item => {
    const handler = () => toggleSubmenu(item);
    toggleHandlers.push({ item, handler });
    item.addEventListener("click", handler);
  });

  // Manejar clicks en links directos (sin submenú)
  const sidebarLinks = root.querySelectorAll(".sidebar-item-link");
  const linkHandlers = [];

  sidebarLinks.forEach(link => {
    const handler = () => {
      closeAllSubmenus();
    };
    linkHandlers.push({ link, handler });
    link.addEventListener("click", handler);
  });

  // Mostrar/ocultar mobile topbar durante scroll
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScrollY) {
      topbar.classList.remove("show-fast");
      topbar.classList.add("hidden");
    } else {
      topbar.classList.add("show-fast");
      topbar.classList.remove("hidden");
    }

    lastScrollY = currentScroll;
  };

  window.addEventListener("scroll", handleScroll);

  // Cleanup
  return () => {
    window.removeEventListener("scroll", handleScroll);
    overlay.removeEventListener("click", closeSidebar);

    toggleHandlers.forEach(({ item, handler }) => {
      item.removeEventListener("click", handler);
    });

    linkHandlers.forEach(({ link, handler }) => {
      link.removeEventListener("click", handler);
    });
  };
}
/*===========================================-----↑ MOBILE MENU ↑-----===========================================*/