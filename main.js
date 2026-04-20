document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header Header logic
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Reveal Animations on Scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .step, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // 4. Form Submission (Telegram Integration)
    const quoteForm = document.getElementById('quoteForm');
    
    const TELEGRAM_BOT_TOKEN = '8602319567:AAG8VPaq0Ia0DsRAPe5fyCKXo6yzA40kSm0'; 
    const TELEGRAM_CHAT_ID = '8781562240';

    quoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = quoteForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        
        submitBtn.disabled = true;
        submitBtn.innerText = '전송 중...';

        const formData = new FormData(quoteForm);
        const data = Object.fromEntries(formData.entries());

        const message = `
🔔 [폐차마스터 새로운 폐차 신청]
🚗 차량번호: ${data.car_number}
📱 연락처: ${data.phone}
🌐 출처: pecha.shop
        `;

        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message
                })
            });

            if (!response.ok) throw new Error('Telegram API error');

            alert('감사합니다! 폐차 신청이 완료되었습니다.\n상담사가 곧 연락드리겠습니다.');
            quoteForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('인터넷 연결이 불안정하거나 오류가 발생했습니다. 잠시 후 다시 시도해주시거나 전화로 직접 문의주세요.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });

    // 5. Stat Counter Animation
    const stats = document.querySelectorAll('.counter');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            obj.innerHTML = value.toLocaleString() + (obj.innerHTML.includes('%') ? '%' : (obj.innerHTML.includes('H') ? 'H' : '+'));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // 6. Privacy Modal Logic
    const modal = document.getElementById('privacyModal');
    const openBtn = document.getElementById('openPrivacy');
    const closeBtn = document.querySelector('.close-modal');

    const openModal = () => {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    };

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});
