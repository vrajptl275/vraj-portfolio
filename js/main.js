    /* ===== LOADER ===== */
    (function () {
      const logsContainer = document.getElementById('logs');
      const progressBar = document.getElementById('progressBar');
      const progressPct = document.getElementById('progressPct');
      const loader = document.getElementById('loader');

      const lines = [
        "Initializing AI Core...",
        "Loading Neural Network Modules...",
        "Connecting to Data Stream...",
        "Optimizing Models...",
        "System Ready ✔"
      ];

      const totalDuration = 2500; // 2.5 seconds total
      const lineInterval = totalDuration / lines.length;

      function typeLine(text, isLast) {
        return new Promise(resolve => {
          const lineEl = document.createElement('div');
          lineEl.className = 'log-line';
          if (isLast) lineEl.classList.add('success');

          const textSpan = document.createElement('span');
          const cursor = document.createElement('span');
          cursor.className = 'cursor';

          lineEl.appendChild(textSpan);
          lineEl.appendChild(cursor);
          logsContainer.appendChild(lineEl);

          let charIndex = 0;
          const typingSpeed = (lineInterval * 0.7) / text.length;

          function typeChar() {
            if (charIndex < text.length) {
              textSpan.textContent += text.charAt(charIndex);
              charIndex++;
              setTimeout(typeChar, typingSpeed);
            } else {
              setTimeout(() => {
                if (!isLast) cursor.remove();
                resolve();
              }, lineInterval * 0.3);
            }
          }

          typeChar();
        });
      }

      async function runBootSequence() {
        document.body.style.overflow = 'hidden';

        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 1;
          if (progress >= 100) progress = 100;
          progressBar.style.width = `${progress}%`;
          progressPct.textContent = `${progress}%`;
          if (progress === 100) clearInterval(progressInterval);
        }, totalDuration / 100);

        for (let i = 0; i < lines.length; i++) {
          await typeLine(lines[i], i === lines.length - 1);
        }

        setTimeout(() => {
          loader.classList.add('exit-animation');
          setTimeout(() => {
            loader.style.display = 'none';
            document.body.style.overflow = 'auto';
          }, 800);
        }, 400);
      }

      runBootSequence();
    })();

    /* ===== CUSTOM CURSOR ===== */
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    function animateCursor() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /* ===== PARTICLES ===== */
    (function () {
      const canvas = document.getElementById('particles-canvas');
      const ctx = canvas.getContext('2d');
      let W, H, particles = [];

      function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resize);
      resize();

      const colors = ['rgba(0,245,255,', 'rgba(191,0,255,', 'rgba(255,0,128,'];

      class Particle {
        constructor() { this.reset(); }
        reset() {
          this.x = Math.random() * W;
          this.y = Math.random() * H;
          this.vx = (Math.random() - 0.5) * 0.4;
          this.vy = (Math.random() - 0.5) * 0.4;
          this.size = Math.random() * 1.5 + 0.5;
          this.color = colors[Math.floor(Math.random() * colors.length)];
          this.alpha = Math.random() * 0.4 + 0.1;
          this.life = 0;
          this.maxLife = Math.random() * 200 + 100;
        }
        update() {
          this.x += this.vx; this.y += this.vy; this.life++;
          if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
          const a = this.alpha * Math.sin(Math.PI * this.life / this.maxLife);
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color + a + ')';
          ctx.fill();
        }
      }

      for (let i = 0; i < 120; i++) particles.push(new Particle());

      function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(0,245,255,${0.04 * (1 - dist / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      function animate() {
        ctx.clearRect(0, 0, W, H);
        drawConnections();
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
      }
      animate();
    })();

    /* ===== NAV SCROLL & 3D BUTTONS ===== */
    const nav = document.getElementById('mainNav');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      nav.classList.toggle('scrolled', scrollY > 60);

      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
          link.classList.add('active');
        }
      });
    });

    navLinks.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const tiltX = (y / (rect.height / 2)) * -15;
        const tiltY = (x / (rect.width / 2)) * 15;

        btn.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05) translateY(-2px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = `perspective(700px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0)`;
      });

      btn.addEventListener('mousedown', () => {
        btn.style.transform = `perspective(700px) rotateX(0deg) rotateY(0deg) scale(0.95) translateY(2px)`;
      });

      btn.addEventListener('mouseup', () => {
        btn.style.transform = `perspective(700px) rotateX(0deg) rotateY(0deg) scale(1.05) translateY(-2px)`;
      });
    });

    /* ===== NEURAL NETWORK CANVAS ===== */
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let width, height;
      let particles = [];

      let mouse = { x: null, y: null, radius: 180 };

      const heroSection = document.getElementById('hero');
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });

      heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });

      // Add a scatter effect on click
      heroSection.addEventListener('mousedown', () => {
        if (mouse.x == null) return;
        for (let i = 0; i < particles.length; i++) {
          let p = particles[i];
          let dx = p.x - mouse.x;
          let dy = p.y - mouse.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            p.vx = (dx / distance) * 8; // Explosion speed
            p.vy = (dy / distance) * 8;
          }
        }
      });

      const colors = [
        'rgba(0, 245, 255, 0.8)', // Cyan
        'rgba(191, 0, 255, 0.8)', // Purple
        'rgba(255, 0, 128, 0.8)'  // Pink
      ];

      function initCanvas() {
        width = canvas.width = heroSection.clientWidth;
        height = canvas.height = heroSection.clientHeight;
        particles = [];
        // Increased density for a richer network
        const numParticles = Math.min((width * height) / 9000, 200);

        for (let i = 0; i < numParticles; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1.0,
            vy: (Math.random() - 0.5) * 1.0,
            size: Math.random() * 2 + 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            baseVx: (Math.random() - 0.5) * 1.0,
            baseVy: (Math.random() - 0.5) * 1.0
          });
        }
      }

      function animateCanvas() {
        requestAnimationFrame(animateCanvas);
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          let p = particles[i];

          // Friction to slow down from explosions back to base speed
          p.vx += (p.baseVx - p.vx) * 0.05;
          p.vy += (p.baseVy - p.vy) * 0.05;

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) { p.vx *= -1; p.baseVx *= -1; }
          if (p.y < 0 || p.y > height) { p.vy *= -1; p.baseVy *= -1; }

          // Glowing effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Reset shadow for lines to save performance
          ctx.shadowBlur = 0;

          if (mouse.x != null) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0, 245, 255, ${0.8 * (1 - distance / mouse.radius)})`;
              ctx.lineWidth = 1;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();

              // Soft magnetic pull
              p.x += dx * 0.005;
              p.y += dy * 0.005;
            }
          }

          for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 130) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(191, 0, 255, ${0.3 * (1 - distance / 130)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      initCanvas();
      animateCanvas();
      window.addEventListener('resize', initCanvas);
    }

    const heroCardsElement = document.querySelectorAll('.hero-card');
    heroCardsElement.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
      });
    });

    /* ===== IDE SCRIPTS ===== */
    (function () {
      const files = ['stocksense.py', 'civic_system.py', 'smart_attendance.py', 'driver_monitor.py'];
      function activate(id) {
        document.querySelectorAll('.ide-sidebar-item').forEach(el => {
          el.classList.toggle('ide-active', el.dataset.target === id);
        });
        document.querySelectorAll('.ide-tab').forEach(el => {
          el.classList.toggle('ide-tab-active', el.dataset.target === id);
        });
        document.querySelectorAll('.ide-pane').forEach(el => {
          el.classList.toggle('ide-pane-active', el.id === 'pane-' + id);
        });

        // Update breadcrumb
        const idx = Array.from(document.querySelectorAll('.ide-tab')).findIndex(el => el.dataset.target === id);
        const bc = document.querySelector('.ide-bc-active');
        if (bc && idx >= 0) bc.textContent = files[idx];
      }

      document.querySelectorAll('.ide-sidebar-item, .ide-tab').forEach(el => {
        el.addEventListener('click', () => activate(el.dataset.target));
      });
    })();

    /* ===== SMOOTH SCROLL ===== */
    function smoothScroll(id) {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ===== SCROLL REVEAL ===== */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    /* ===== 3D LOGO CLOUD ===== */
    (function initGlobe() {
      var orbit = document.getElementById('globeOrbit');
      var wrapper = document.querySelector('.globe-wrapper');
      if (!orbit || !wrapper) return;

      var items = [
        { n: 'Python', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', s: 38 },
        { n: 'HTML5', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', s: 32 },
        { n: 'CSS3', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', s: 32 },
        { n: 'JavaScript', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', s: 42 },
        { n: 'TensorFlow', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', s: 36 },
        { n: 'OpenCV', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg', s: 30 },
        { n: 'NumPy', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg', s: 28 },
        { n: 'Pandas', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', s: 30 },
        { n: 'Flask', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg', s: 28 },
        { n: 'Git', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', s: 34 },
        { n: 'GitHub', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', s: 36 },
        { n: 'PostgreSQL', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', s: 32 },
        { n: 'SQLite', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg', s: 28 },
        { n: 'Streamlit', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/streamlit/streamlit-original.svg', s: 30 },
        { n: 'Matplotlib', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg', s: 30 },
        { n: 'Scikit-learn', img: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg', s: 34 },
        { n: 'MediaPipe', e: '🎯', s: 32 },
        { n: 'YOLO', e: '👁️', s: 30 },
        { n: 'Copilot', e: '🤖', s: 28 },
        { n: 'Claude', e: '🧠', s: 30 },
        { n: 'Cursor', e: '⚡', s: 28 },
        { n: 'Problem Solving', e: '🧩', s: 32 },
        { n: 'Teamwork', e: '🤝', s: 28 },
        { n: 'Fast Learner', e: '🚀', s: 30 },
      ];

      var N = items.length;
      var points = []; // {x,y,z,el,s}

      // Create elements and initial 3D positions (Fibonacci sphere)
      items.forEach(function (t, i) {
        t.s = Math.round(t.s * 1.35); // Increase all logo sizes by 35%
        var phi = Math.acos(1 - 2 * (i + 0.5) / N);
        var theta = Math.PI * (1 + Math.sqrt(5)) * i;
        var el = document.createElement('div');
        el.className = 'globe-icon';
        el.title = t.n;
        el.style.width = t.s + 'px';
        el.style.height = t.s + 'px';
        if (t.img) {
          el.innerHTML = '<img src="' + t.img + '" alt="' + t.n + '" loading="lazy">';
        } else {
          el.innerHTML = '<div class="soft-ball" style="width:' + t.s + 'px;height:' + t.s + 'px;font-size:' + (t.s * 0.5) + 'px">' + t.e + '</div>';
        }
        orbit.appendChild(el);
        points.push({
          x: Math.sin(phi) * Math.cos(theta),
          y: Math.sin(phi) * Math.sin(theta),
          z: Math.cos(phi),
          el: el, s: t.s
        });
      });

      // Rotation state
      var angleX = -0.3, angleY = 0.4;
      var speedX = 0.002, speedY = 0.008;

      // Rotate a point around Y axis
      function rotY(p, a) {
        var cos = Math.cos(a), sin = Math.sin(a);
        return { x: p.x * cos - p.z * sin, y: p.y, z: p.x * sin + p.z * cos };
      }
      // Rotate a point around X axis
      function rotX(p, a) {
        var cos = Math.cos(a), sin = Math.sin(a);
        return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
      }

      function render() {
        var cw = orbit.clientWidth || 380;
        var R = (cw / 2) * 0.81;
        var cx = cw / 2;
        var cy = cw / 2;
        points.forEach(function (pt) {
          var px3d = pt.x * R;
          var py3d = pt.y * R;
          var pz3d = pt.z * R;
          // Apply rotations
          var r = rotY({ x: px3d, y: py3d, z: pz3d }, angleY);
          r = rotX(r, angleX);
          // Project to 2D (perspective)
          var perspective = 500;
          var scale = perspective / (perspective + r.z);
          var px = cx + r.x * scale - pt.s / 2;
          var py = cy + r.y * scale - pt.s / 2;
          // Depth-based opacity and scale
          var depthNorm = (r.z + R) / (2 * R); // 0 = far, 1 = near
          var opacity = 0.35 + 0.65 * depthNorm;
          var sz = 0.6 + 0.5 * depthNorm;
          pt.el.style.transform = 'translate(' + px + 'px,' + py + 'px) scale(' + sz.toFixed(3) + ')';
          pt.el.style.opacity = opacity.toFixed(2);
          pt.el.style.zIndex = Math.round(depthNorm * 100);
        });
      }

      function animate() {
        if (!dragging) {
          angleY += speedY;
          angleX += speedX;
        }
        render();
        requestAnimationFrame(animate);
      }
      animate();

      // Drag to rotate
      var dragging = false, lastMX = 0, lastMY = 0;
      wrapper.addEventListener('mousedown', function (e) {
        dragging = true; lastMX = e.clientX; lastMY = e.clientY;
        e.preventDefault();
      });
      window.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        var dx = e.clientX - lastMX, dy = e.clientY - lastMY;
        angleY += dx * 0.01;
        angleX += dy * 0.01;
        lastMX = e.clientX; lastMY = e.clientY;
        // Update auto-rotation direction based on drag
        speedY = dx * 0.002 || speedY;
        speedX = dy * 0.001 || speedX;
      });
      window.addEventListener('mouseup', function () { dragging = false; });

      // Scroll over globe changes rotation direction
      wrapper.addEventListener('wheel', function (e) {
        e.preventDefault();
        speedY += e.deltaX * 0.0001 || e.deltaY * 0.0002;
        speedX += e.deltaY * 0.0001;
        // Clamp speeds
        speedY = Math.max(-0.03, Math.min(0.03, speedY));
        speedX = Math.max(-0.02, Math.min(0.02, speedX));
      }, { passive: false });
    })();

    /* ===== DATA STREAM NODES ===== */
    const nodeObs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 150);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.data-node').forEach(el => nodeObs.observe(el));

    /* ===== SGPA BARS ===== */
    const sgpas = [
      { sem: 'S1', val: 8.83 },
      { sem: 'S2', val: 8.17 },
      { sem: 'S3', val: 8.48 },
      { sem: 'S4', val: 8.30 },
      { sem: 'S5', val: 8.75 },
    ];
    const colors_sgpa = ['#00f5ff', '#ff0080', '#bf00ff', '#00ff88', '#ffee00'];
    const container = document.getElementById('sgpa-bars');

    sgpas.forEach((s, i) => {
      const pct = ((s.val - 7) / 3) * 100;
      container.innerHTML += `
    <div class="sgpa-item">
      <div class="sgpa-sem">${s.sem}</div>
      <div class="sgpa-bar-wrap">
        <div class="sgpa-bar" data-pct="${pct}" style="background: linear-gradient(90deg, ${colors_sgpa[i]}, ${colors_sgpa[(i + 1) % 5]});"></div>
      </div>
      <div class="sgpa-num">${s.val}</div>
    </div>`;
    });

    const sgpaObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('.sgpa-bar').forEach(bar => {
            setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, 300);
          });
          sgpaObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    sgpaObs.observe(container);

    /* ===== COUNTER ANIMATION ===== */
    function animateCounter(el, target, decimals = 0) {
      const duration = 1500;
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = ease * target;
        el.textContent = decimals ? val.toFixed(decimals) : Math.floor(val);
        if (p < 1) requestAnimationFrame(tick);
      };
      tick();
    }

    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target.querySelector('.stat-num[data-target]');
          if (el) {
            const t = parseFloat(el.dataset.target);
            animateCounter(el, t, t % 1 !== 0 ? 2 : 0);
          }
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-card').forEach(c => counterObs.observe(c));

    /* ===== PROJECT CARD MOUSE SPOTLIGHT ===== */
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });

    /* ===== AI CHAT ===== */
    function toggleChat() {
      document.getElementById('chatPanel').classList.toggle('open');
    }

    function quickAsk(q) {
      document.getElementById('chatInput').value = q;
      sendMsg();
    }

    const RESUME_CONTEXT = `
  Name: Patel Vraj Gaurangkumar
  Education: B.Tech Information Technology, MBIT Anand Gujarat, CGPA 8.50/10, Expected May 2027.
  Semester SGPAs: S1:8.83, S2:8.17, S3:8.48, S4:8.30, S5:8.75
  Skills: Python, SQL, HTML5, CSS3, JavaScript, NumPy, Pandas, Matplotlib, Streamlit, Scikit-learn, MediaPipe, TensorFlow, OpenCV, Flask, Git, GitHub, SQLite, PostgreSQL, YOLOv11, XGBoost, GARCH, Plotly
  Projects:
  1. Driver Drowsiness & Distraction Detection System (March 2026) - Real-time dual-phase system using Face Mesh for EAR-based drowsiness detection, head pose estimation, auto-calibration, 8-frame smoothing. Custom YOLOv11 trained on 2004 images for phone detection.
  2. StockSense AI (2025) - AI stock chatbot with WhatsApp-style UI, natural language queries, RSI/MACD/Bollinger Bands. Deployed on Render.com.
  3. Anand Civic Issue Reporting System (2025) - Role-based platform (4 roles) with GPS boundary validation, Gemini AI image analysis, JWT auth. Deployed on Render.com.
  4. Smart Attendance System (2024) - Face recognition web-based attendance with role-based dashboards, CSV/PDF export.
  Hackathons: CVMU Hackathon 4.0 (36-hour, 2026), Internal SIH Selection Round (2025)
  Contact: sp533013@gmail.com, +91 7698750331, github.com/vrajptl275
  Looking for: Data Science, AI/ML, or Software Development roles
`;

    async function sendMsg() {
      const input = document.getElementById('chatInput');
      const msg = input.value.trim();
      if (!msg) return;
      input.value = '';

      const messages = document.getElementById('chatMessages');
      const userDiv = document.createElement('div');
      userDiv.className = 'msg user';
      userDiv.textContent = msg;
      messages.appendChild(userDiv);

      const typingDiv = document.createElement('div');
      typingDiv.className = 'msg ai typing';
      typingDiv.textContent = '// processing query...';
      messages.appendChild(typingDiv);
      messages.scrollTop = messages.scrollHeight;

      // Small delay for natural feel
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));

      const result = AIEngine.query(msg);
      typingDiv.className = 'msg ai';
      typingDiv.textContent = "System: " + result.reply;
      messages.scrollTop = messages.scrollHeight;
    }

