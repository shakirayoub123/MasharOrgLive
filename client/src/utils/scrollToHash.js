// Shared scroll utility — use this in every page that has hash sections
// Accounts for sticky navbar height so sections aren't hidden behind it
export const scrollToHash = (hash, delay = 80) => {
    if (!hash) return;
    const id = hash.replace('#', '');
    let attempts = 0;

    const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
            const navEl = document.querySelector('[class*="sticky"]');
            const navHeight = navEl?.offsetHeight || 80;
            const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 12;
            window.scrollTo({ top, behavior: 'smooth' });
        } else if (attempts < 15) {
            attempts++;
            setTimeout(tryScroll, 100);
        }
    };
    setTimeout(tryScroll, delay);
};
