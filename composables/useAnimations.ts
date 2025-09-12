// composables/useAnimations.ts
import { ref, onMounted, onUnmounted } from "vue";

export const useAnimations = () => {
  const isVisible = ref(false);
  const observer = ref<IntersectionObserver | null>(null);

  // Animation d'apparition au scroll
  const observeElement = (element: HTMLElement, callback?: () => void) => {
    if (!observer.value) {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
              if (callback) callback();
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        }
      );
    }
    observer.value.observe(element);
  };

  // Animation de parallaxe
  const parallaxEffect = (element: HTMLElement, speed: number = 0.5) => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      element.style.transform = `translateY(${rate}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  };

  // Animation de typing
  const typeWriter = (
    element: HTMLElement,
    text: string,
    speed: number = 50
  ) => {
    let i = 0;
    element.innerHTML = "";

    const timer = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  };

  // Animation de compteur
  const animateCounter = (
    element: HTMLElement,
    target: number,
    duration: number = 2000
  ) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toString();
    }, 16);

    return () => clearInterval(timer);
  };

  // Animation de hover pour les cartes
  const addCardHoverEffect = (element: HTMLElement) => {
    element.addEventListener("mouseenter", () => {
      element.style.transform = "translateY(-8px) scale(1.02)";
      element.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)";
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "translateY(0) scale(1)";
      element.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
    });
  };

  // Animation de loading avec skeleton
  const createSkeletonLoader = (element: HTMLElement) => {
    element.classList.add("skeleton-loader");
    const shimmer = document.createElement("div");
    shimmer.classList.add("skeleton-shimmer");
    element.appendChild(shimmer);
  };

  // Animation de notification toast
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => toast.classList.add("toast-show"), 100);

    // Animation de sortie
    setTimeout(() => {
      toast.classList.remove("toast-show");
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  // Animation de page transition
  const pageTransition = (direction: "in" | "out" = "in") => {
    const overlay = document.createElement("div");
    overlay.className = `page-transition page-transition-${direction}`;
    document.body.appendChild(overlay);

    if (direction === "in") {
      setTimeout(() => {
        overlay.classList.add("page-transition-complete");
        setTimeout(() => document.body.removeChild(overlay), 500);
      }, 100);
    } else {
      overlay.classList.add("page-transition-complete");
      setTimeout(() => document.body.removeChild(overlay), 500);
    }
  };

  // Animation de particles flottantes
  const createFloatingParticles = (
    container: HTMLElement,
    count: number = 20
  ) => {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className = "floating-particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 3 + "s";
      particle.style.animationDuration = Math.random() * 3 + 2 + "s";
      container.appendChild(particle);
    }
  };

  // Animation de gradient animé
  const animateGradient = (element: HTMLElement) => {
    let hue = 0;
    const timer = setInterval(() => {
      hue = (hue + 1) % 360;
      element.style.background = `linear-gradient(${hue}deg, #667eea 0%, #764ba2 100%)`;
    }, 50);

    return () => clearInterval(timer);
  };

  // Animation de morphing de forme
  const morphShape = (
    element: HTMLElement,
    shapes: string[],
    duration: number = 2000
  ) => {
    let currentShape = 0;
    const timer = setInterval(() => {
      element.style.clipPath = shapes[currentShape];
      currentShape = (currentShape + 1) % shapes.length;
    }, duration);

    return () => clearInterval(timer);
  };

  // Nettoyage des observers
  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect();
    }
  });

  return {
    isVisible,
    observeElement,
    parallaxEffect,
    typeWriter,
    animateCounter,
    addCardHoverEffect,
    createSkeletonLoader,
    showToast,
    pageTransition,
    createFloatingParticles,
    animateGradient,
    morphShape,
  };
};
