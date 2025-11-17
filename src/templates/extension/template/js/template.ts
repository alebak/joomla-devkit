/**
 * {{TEMPLATE_NAME}} - Main Template JavaScript
 *
 * @package     {{PACKAGE_NAME}}
 * @subpackage  {{TEMPLATE_NAME}}
 * @copyright   {{COPYRIGHT}}
 * @license     {{LICENSE}}
 */

/**
 * Template class for {{TEMPLATE_NAME}}
 */
class {{TEMPLATE_CLASS}}Template {
  private backTopButton: HTMLElement | null = null;

  /**
   * Initialize the template
   */
  public init(): void {
    this.initBackToTop();
    this.initMobileMenu();
    this.initSmoothScroll();
  }

  /**
   * Initialize back to top button
   */
  private initBackToTop(): void {
    this.backTopButton = document.getElementById('back-top');

    if (!this.backTopButton) {
      return;
    }

    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        this.backTopButton?.classList.add('show');
      } else {
        this.backTopButton?.classList.remove('show');
      }
    });

    // Scroll to top on click
    this.backTopButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Initialize mobile menu functionality
   */
  private initMobileMenu(): void {
    const menuToggle = document.querySelector('.navbar-toggler');
    const menuCollapse = document.querySelector('#navbar-menu');

    if (!menuToggle || !menuCollapse) {
      return;
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const isClickInside = menuToggle.contains(target) || menuCollapse.contains(target);

      if (!isClickInside && menuCollapse.classList.contains('show')) {
        menuToggle.dispatchEvent(new Event('click'));
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuCollapse.classList.contains('show')) {
        menuToggle.dispatchEvent(new Event('click'));
      }
    });
  }

  /**
   * Initialize smooth scroll for anchor links
   */
  private initSmoothScroll(): void {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener('click', (e: Event) => {
        const href = (link as HTMLAnchorElement).getAttribute('href');

        if (!href || href === '#' || href === '#top') {
          return;
        }

        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Add external link icons and attributes
   */
  private markExternalLinks(): void {
    const links = document.querySelectorAll('a[href^="http"]');

    links.forEach((link) => {
      const href = (link as HTMLAnchorElement).href;
      const currentDomain = window.location.hostname;

      if (!href.includes(currentDomain)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.classList.add('external-link');
      }
    });
  }

  /**
   * Initialize lazy loading for images
   */
  private initLazyLoading(): void {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }
  }
}

// Initialize template on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const template = new {{TEMPLATE_CLASS}}Template();
    template.init();
  });
} else {
  const template = new {{TEMPLATE_CLASS}}Template();
  template.init();
}

export default {{TEMPLATE_CLASS}}Template;
