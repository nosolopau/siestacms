'use strict';
const search = document.querySelector('#search');
if (search) {
    const cards = Array.from(document.querySelectorAll('[data-search]'));
    const empty = document.querySelector('.empty-state');
    const status = document.querySelector('#search-status');
    document.querySelector('.search-control').hidden = false;
    search.addEventListener('input', () => {
        const query = search.value.trim().toLowerCase();
        let visible = 0;
        cards.forEach(card => {
            card.hidden = !card.dataset.search.includes(query);
            if (!card.hidden) visible++;
        });
        empty.hidden = visible > 0;
        empty.textContent = query ? 'No stories match your search. Try a different word.' : 'No stories here yet. Every good thing starts with a blank page.';
        status.textContent = query ? `${visible} ${visible === 1 ? 'story' : 'stories'} found` : '';
    });
}
