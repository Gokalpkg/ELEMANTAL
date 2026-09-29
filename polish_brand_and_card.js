const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// 1. Change <h1 class="menu-brand-title"> to <div class="menu-brand-title"> so body.in-menu h1 doesn't hide it
c = c.replace('<h1 class="menu-brand-title">ELEMENTER</h1>', '<div class="menu-brand-title">ELEMENTER</div>');

// 2. Add explicit display rule for .menu-brand-title
if (!c.includes('.menu-brand-title { display: block !important;')) {
  c = c.replace('.menu-brand-title {', '.menu-brand-title {\n  display: block !important;');
}

// 3. Make .hero-dossier-card comfortably fit within screen width
c = c.replace('.hero-dossier-card {', `.hero-dossier-card {
  width: 100% !important;
  max-width: 376px !important;`);

// 4. Style .hero-quote-inline to not clip
c = c.replace('.hero-quote-inline {', `.hero-quote-inline {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;`);

fs.writeFileSync('index.html', c, 'utf8');
console.log('✓ Brand title and dossier card margins polished.');
