
window.addEventListener('load', () => { 
    document.getElementById('loader').style.display = 'none'; 
});


const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => { 
    cursor.style.top = e.clientY + 'px'; 
    cursor.style.left = e.clientX + 'px'; 
});


const texts = ["Étudiante en Bachelor Informatique"];
let i = 0, currentText = '', isDeleting = false;
const typingElement = document.getElementById('typing');

function type() {
    const fullText = texts[i];
    currentText = isDeleting ? fullText.substring(0, currentText.length - 1) : fullText.substring(0, currentText.length + 1);
    typingElement.textContent = currentText;
    let speed = 150;
    if (isDeleting) speed /= 2;
    if (!isDeleting && currentText === fullText) { isDeleting = true; speed = 1000; }
    else if (isDeleting && currentText === '') { isDeleting = false; i = (i + 1) % texts.length; speed = 500; }
    setTimeout(type, speed);
}
type();


const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
const baseColors = [{ start: "#F8C8DC", end: "#FFD6E8" }, { start: "#FFF4B8", end: "#FFFAD1" }, { start: "#EDE0F8", end: "#F4ECFF" }];
const shapes = [];

for (let k = 0; k < 35; k++) {
    const color = baseColors[Math.floor(Math.random() * baseColors.length)];
    shapes.push({ x: Math.random() * w, y: Math.random() * h, radius: 60 + Math.random() * 80, angle: Math.random() * Math.PI * 2, speed: 0.002 + Math.random() * 0.004, dx: (Math.random() - 0.5) * 0.2, dy: (Math.random() - 0.5) * 0.2, colorStart: color.start, colorEnd: color.end, colorShift: Math.random() * Math.PI * 2 });
}

function animateHero() {
    ctx.clearRect(0, 0, w, h);
    shapes.forEach(shape => {
        shape.x += shape.dx; shape.y += shape.dy; shape.angle += shape.speed; shape.colorShift += 0.01;
        const grad = ctx.createRadialGradient(shape.x, shape.y, shape.radius * 0.3, shape.x, shape.y, shape.radius);
        grad.addColorStop(0, shape.colorStart); grad.addColorStop(1, shape.colorEnd);
        ctx.beginPath();
        const r = shape.radius + Math.sin(shape.angle) * 20;
        ctx.arc(shape.x, shape.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.globalAlpha = 0.3; ctx.fill();
    });
    requestAnimationFrame(animateHero);
}
animateHero();

window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });


gsap.registerPlugin(ScrollTrigger);
gsap.from("#hero .hero__content h1", { opacity: 0, y: 50, duration: 1 });
gsap.from("#hero .hero__content h2", { opacity: 0, y: 50, duration: 1, delay: 0.3 });
gsap.from(".btn-hero", { opacity: 0, y: 50, duration: 1, delay: 0.6 });
gsap.from(".about__photo", { scrollTrigger: { trigger: "#about", start: "top 80%" }, opacity: 0, x: -50, duration: 1 });
gsap.from(".about__text", { scrollTrigger: { trigger: "#about", start: "top 80%" }, opacity: 0, x: 50, duration: 1, stagger: 0.3 });
gsap.utils.toArray(".skill-card").forEach(card => { gsap.from(card, { scrollTrigger: { trigger: card, start: "top 80%" }, opacity: 0, y: 50, duration: 1 }); });
gsap.utils.toArray(".project-card").forEach(card => { gsap.from(card, { scrollTrigger: { trigger: card, start: "top 80%" }, opacity: 0, y: 50, duration: 1, stagger: 0.2 }); });
gsap.utils.toArray(".timeline-item").forEach(item => { gsap.from(item, { scrollTrigger: { trigger: item, start: "top 90%" }, opacity: 0, x: item.classList.contains('even') ? 50 : -50, duration: 1 }); });
gsap.from("#contact form", { scrollTrigger: { trigger: "#contact", start: "top 80%" }, opacity: 0, y: 50, duration: 1 });


const burger = document.querySelector('.burger');
const navList = document.querySelector('.nav__list');
if(burger) {
    burger.addEventListener('click', () => { navList.classList.toggle('nav-active'); burger.classList.toggle('toggle'); });
}


const contactForm = document.getElementById('contactForm');
const formStatusMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

       
        const email = contactForm.email.value.trim();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            formStatusMessage.textContent = "Adresse email invalide.";
            formStatusMessage.style.color = "red";
            return;
        }

        formStatusMessage.textContent = "Envoi en cours...";
        formStatusMessage.style.color = "#444";

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            if (response.status == 200) {
                formStatusMessage.textContent = "Message envoyé avec succès ! ✨";
                formStatusMessage.style.color = "green";
                contactForm.reset(); 
            } else {
                formStatusMessage.textContent = "Erreur lors de l'envoi. Réessayez.";
                formStatusMessage.style.color = "red";
            }
        })
        .catch(error => {
            formStatusMessage.textContent = "Un problème est survenu.";
            formStatusMessage.style.color = "red";
        });
    });
}


const aboutTimelineItems = document.querySelectorAll('.about-timeline .timeline-item');
const revealAboutTimeline = () => {
    aboutTimelineItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            item.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealAboutTimeline);
window.addEventListener('load', revealAboutTimeline);