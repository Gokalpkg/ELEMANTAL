const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace the invalid closing tag
const target = `            applyEffect(en, 'shock', 1.0);
            burst(en.x, en.y, '#fde047', 4, 1.8);
          }
        }
      }
    });`;

const replacement = `            applyEffect(en, 'shock', 1.0);
            burst(en.x, en.y, '#fde047', 4, 1.8);
          }
        }
      }
    }`;

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully fixed syntax error in index.html!');
} else {
  // Try CRLF normalized
  const normHtml = html.replace(/\r\n/g, '\n');
  const normTarget = target.replace(/\r\n/g, '\n');
  const normReplacement = replacement.replace(/\r\n/g, '\n');
  if (normHtml.includes(normTarget)) {
    const fixed = normHtml.replace(normTarget, normReplacement);
    fs.writeFileSync('index.html', fixed, 'utf8');
    console.log('Successfully fixed syntax error (normalized) in index.html!');
  } else {
    console.error('Target not found in index.html!');
  }
}
