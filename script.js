
const $ = (id) => document.getElementById(id);

const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[c]));

const safe = (url) =>
    /^https?:\/\//i.test(url) ? url : '#';

async function loadPortfolio() {
    try {
        const response = await fetch('profile.json');

        if (!response.ok) {
            throw new Error(`Profile request failed (${response.status})`);
        }

        const p = await response.json();

        document.title = `${p.name || 'Portfolio'} | Portfolio`;
        $('name').textContent = p.name || 'Portfolio';
        $('tagline').textContent = p.tagline || '';
        $('bio').textContent = p.bio || '';

        $('skills').innerHTML = (p.skills || [])
            .map((skill) => `<li>${esc(skill)}</li>`)
            .join('');

        $('projects').innerHTML = (p.projects || [])
            .map((project) =>
                `<article class="card">` +
                `<h3>${esc(project.title)}</h3>` +
                `<p>${esc(project.desc)}</p>` +
                `<a href="${safe(project.link)}" target="_blank" rel="noopener noreferrer">View project</a>` +
                `</article>`
            ).join('');

        $('links').innerHTML = Object.entries(p.links || {})
            .map(([label, url]) =>
                `<a href="${safe(url)}" target="_blank" rel="noopener noreferrer">` +
                `${esc(label)}</a>`
            ).join('');

        $('footer').textContent =
            `© ${new Date().getFullYear()} ${p.name || 'Portfolio'}`;
    } catch (error) {
        console.error('Unable to load portfolio:', error);
        $('bio').textContent =
            'Portfolio data could not be loaded. Please try again later.';
    }
}

loadPortfolio();
