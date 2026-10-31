(() => {
    const root = document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const sharedDomain = location.hostname === 'j4d.dev' || location.hostname.endsWith('.j4d.dev');

    function readCookie() {
        try {
            const value = document.cookie.split('; ').find((item) => item.startsWith('j4d-theme='))?.split('=')[1];
            return value === 'light' || value === 'dark' ? value : undefined;
        } catch {
            return undefined;
        }
    }

    function savePreference(theme) {
        try {
            document.cookie = `j4d-theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax${sharedDomain ? '; Domain=j4d.dev' : ''}${location.protocol === 'https:' ? '; Secure' : ''}`;
        } catch {
        }
        try {
            localStorage.setItem('j4d-theme', theme);
        } catch {
        }
    }

    let preference = readCookie();
    if (!preference) {
        try {
            preference = localStorage.getItem('j4d-theme');
        } catch {
        }
        if (preference === 'light' || preference === 'dark') savePreference(preference);
    }
    let hasPreference = preference === 'light' || preference === 'dark';
    root.dataset.colorScheme = hasPreference ? preference : (systemTheme.matches ? 'dark' : 'light');

    document.addEventListener('DOMContentLoaded', () => {
        const toggle = document.getElementById('theme-toggle');

        function applyTheme(theme, animate = false) {
            if (animate) root.classList.add('theme-transition');
            root.dataset.colorScheme = theme;
            toggle.setAttribute('aria-pressed', String(theme === 'dark'));
            toggle.title = theme === 'dark' ? 'Bytt til lys modus' : 'Bytt til mørk modus';
        }

        applyTheme(root.dataset.colorScheme);
        toggle.hidden = false;
        toggle.addEventListener('click', () => {
            const theme = root.dataset.colorScheme === 'dark' ? 'light' : 'dark';
            applyTheme(theme, true);
            hasPreference = true;
            savePreference(theme);
        });

        function syncPreference() {
            const theme = readCookie();
            if (theme) {
                hasPreference = true;
                if (theme !== root.dataset.colorScheme) applyTheme(theme, true);
            }
        }

        window.addEventListener('focus', syncPreference);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) syncPreference();
        });
        systemTheme.addEventListener('change', (event) => {
            if (!hasPreference) applyTheme(event.matches ? 'dark' : 'light', true);
        });
    });
})();
