(function () {
    function initExpandableNav() {
        const nav = document.querySelector('.app-nav');
        if (!nav) return;
        const toggle = nav.querySelector('.app-nav-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });

        document.addEventListener('click', (event) => {
            if (!nav.contains(event.target)) {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function initPageTransitions() {
        document.documentElement.classList.add('page-ready');
        document.querySelectorAll('a[href$=".html"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                if (link.target === '_blank') return;
                const href = link.getAttribute('href');
                if (!href) return;
                event.preventDefault();
                document.documentElement.classList.add('page-leave');
                window.setTimeout(() => { window.location.href = href; }, 150);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initExpandableNav();
            initPageTransitions();
        });
    } else {
        initExpandableNav();
        initPageTransitions();
    }
})();
