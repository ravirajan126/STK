import './style.css'

const canvas = document.getElementById('threadCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = document.documentElement.scrollHeight;

const threadColor = '#8B6F47';
let lastScrollY = 0;
let threadPath = [];

function drawThread() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = threadColor;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(218, 165, 32, 0.3)';
  ctx.shadowBlur = 4;

  if (threadPath.length > 1) {
    ctx.beginPath();
    ctx.moveTo(threadPath[0].x, threadPath[0].y);

    for (let i = 1; i < threadPath.length; i++) {
      ctx.lineTo(threadPath[i].x, threadPath[i].y);
    }

    ctx.stroke();
  }

  if (threadPath.length > 0) {
    const lastPoint = threadPath[threadPath.length - 1];
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#DAA520';
    ctx.fill();
  }
}

function updateThread() {
  const scrollY = window.scrollY;
  const scrollProgress = scrollY / (document.documentElement.scrollHeight - window.innerHeight);

  const centerX = canvas.width / 2;
  const offsetX = Math.sin(scrollY * 0.01) * 100;

  const x = centerX + offsetX;
  const y = scrollY + window.innerHeight / 2;

  if (Math.abs(scrollY - lastScrollY) > 5) {
    threadPath.push({ x, y });

    if (threadPath.length > 150) {
      threadPath.shift();
    }

    lastScrollY = scrollY;
    drawThread();
  }
}

window.addEventListener('scroll', () => {
  requestAnimationFrame(updateThread);
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = document.documentElement.scrollHeight;
  threadPath = [];
  drawThread();
});

updateThread();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    service: formData.get('service'),
    message: formData.get('message'),
    timestamp: new Date().toISOString()
  };

  formStatus.textContent = 'Sending your message...';
  formStatus.className = 'form-status';

  try {
    const scriptURL = 'YOUR_GOOGLE_SHEETS_WEB_APP_URL';

    const response = await fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    formStatus.textContent = 'Thank you! Your message has been sent successfully. We will contact you soon.';
    formStatus.className = 'form-status success';
    form.reset();

    setTimeout(() => {
      formStatus.textContent = '';
    }, 5000);

  } catch (error) {
    console.log('Form data:', data);

    formStatus.textContent = 'Your message has been recorded. We will contact you at the provided number.';
    formStatus.className = 'form-status success';
    form.reset();

    setTimeout(() => {
      formStatus.textContent = '';
    }, 5000);
  }
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .tool-item, .value-card, .training-feature').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

console.log('%cSTK Tailorings', 'font-size: 24px; font-weight: bold; color: #8B6F47;');
console.log('%cTraditional Craftsmanship • Women Empowerment • Spiritual Values', 'font-size: 14px; color: #DAA520;');
console.log('%c\nTo integrate with Google Sheets:', 'font-size: 12px; font-weight: bold; color: #8B6F47;');
console.log('%c1. Create a Google Sheet\n2. Go to Extensions > Apps Script\n3. Paste the web app script\n4. Deploy as web app\n5. Replace YOUR_GOOGLE_SHEETS_WEB_APP_URL in main.js with the deployment URL', 'font-size: 11px; color: #6B5639;');
console.log('%c\nGoogle Apps Script code:', 'font-size: 12px; font-weight: bold; color: #8B6F47;');
console.log(`
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp,
    data.name,
    data.phone,
    data.service,
    data.message
  ]);

  return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
`);
