    // ===== MOBILE NAV =====
    function toggleMobileNav() {
      const nav = document.getElementById('mobileNav');
      const btn = document.getElementById('hamburger');
      const isOpen = nav.classList.toggle('open');
      btn.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function mobileNavGo(section) {
      toggleMobileNav();
      setTimeout(() => smoothScroll(section), 200);
    }

    // Close mobile nav on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        const nav = document.getElementById('mobileNav');
        const btn = document.getElementById('hamburger');
        nav.classList.remove('open');
        btn.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    /* ============ DATA STREAM ACCORDION LOGIC ============ */
    const nodeData = {
      'cvmu': {
        mission: "[ TARGET PROJECT ]\nCivic Issue Reporting System\n\n[ OBJECTIVE ]\nDevelop a streamlined platform for citizens to report local civic issues. Focus on rapid prototyping and user-centric design without getting bogged down in complex overhead.",
        outcome: "[ STATUS: SUCCESS ]\n\nDelivered a working prototype before the 36-hour deadline. Validated the core reporting loop and demonstrated agile teamwork under pressure.",
        tech: "[ CORE_TECHNOLOGIES ]\n\n> HTML / CSS / JS (Frontend UI)\n> Python / Flask (Backend API)\n> SQLite (Database)\n> Leaflet.js (Map Integration)\n> Claude & Cursor (AI-Assisted Dev)"
      },
      'sih': {
        mission: "[ TARGET PROJECT ]\nSmart Attendance System\n\n[ OBJECTIVE ]\nIdeate and build an automated, frictionless attendance solution for the Smart India Hackathon qualifier round. Emphasized accuracy, speed, and real-world applicability.",
        outcome: "[ STATUS: QUALIFIED ]\n\nSuccessfully presented the smart attendance concept to the judging panel. Secured high scores for innovation and validated our core logic for deployment.",
        tech: "[ CORE_TECHNOLOGIES ]\n\n> Python & OpenCV (Core Vision)\n> MediaPipe & YOLO (ML Models)\n> Flask (Backend API)\n> HTML / CSS / JS (Frontend UI)\n> PostgreSQL (Relational Database)"
      }
    };

    let currentNodeView = {
      'cvmu': 'mission',
      'sih': 'mission'
    };

    let typeIntervals = {
      'cvmu': null,
      'sih': null
    };

    function toggleNode(nodeId) {
      const node = document.getElementById(`node-${nodeId}`);
      const isActive = node.classList.contains('active');

      // Close all nodes
      document.querySelectorAll('.data-node').forEach(n => n.classList.remove('active'));

      if (!isActive) {
        node.classList.add('active');
        triggerNodeLaserAndRender(nodeId);
      }
    }

    function switchNodeView(nodeId, view, event) {
      event.stopPropagation();
      currentNodeView[nodeId] = view;

      const node = document.getElementById(`node-${nodeId}`);
      node.querySelectorAll('.node-btn').forEach(btn => btn.classList.remove('active'));
      event.currentTarget.classList.add('active');

      triggerNodeLaserAndRender(nodeId);
    }

    function triggerNodeLaserAndRender(nodeId) {
      const node = document.getElementById(`node-${nodeId}`);
      const laser = node.querySelector('.node-scanning-laser');

      laser.classList.remove('scan');
      void laser.offsetWidth; // trigger reflow
      laser.classList.add('scan');

      renderNodeText(nodeId);
    }

    function renderNodeText(nodeId) {
      clearInterval(typeIntervals[nodeId]);

      const textContainer = document.getElementById(`text-${nodeId}`);
      textContainer.innerHTML = '';

      const view = currentNodeView[nodeId];
      const text = nodeData[nodeId][view];

      let i = 0;
      typeIntervals[nodeId] = setInterval(() => {
        if (i < text.length) {
          if (text.charAt(i) === '\n') {
            textContainer.innerHTML += '<br>';
          } else {
            textContainer.innerHTML += text.charAt(i);
          }
          i++;
        } else {
          clearInterval(typeIntervals[nodeId]);
        }
      }, 10);
    }

    document.addEventListener('DOMContentLoaded', () => {
      renderNodeText('cvmu');
      renderNodeText('sih');
    });

    /* ============ CONTACT MAIL SENDER ============ */
    function sendContactMail() {
      const name = document.getElementById('cf-name').value.trim();
      const subject = document.getElementById('cf-subject').value.trim();
      const message = document.getElementById('cf-message').value.trim();

      if (!name || !subject || !message) {
        alert('DATA_CORRUPT: Please fill in all fields before initializing upload.');
        return;
      }

      const body = `Hi Vraj,\n\nName: ${name}\n\n${message}\n\n— Transmitted via SECURE_PORT`;
      const mailto = `mailto:sp533013@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    }
