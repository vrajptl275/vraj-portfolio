/* ============================================================
   AI ENGINE — Pure JavaScript (No Backend Required)
   Uses TF-IDF-like scoring with bigrams for intent matching.
   Drop-in replacement for the Python FastAPI backend.
============================================================ */

const AIEngine = (() => {

  // ─── Knowledge Base ─────────────────────────────────────
  const KB = {
    greeting: {
      examples: ["hello","hi","hey","good morning","how are you","what's up","greetings","who are you","hello vraj","hi vraj"],
      response: "Hello! I am the AI Agent for Vraj Gaurangkumar Patel. I can answer questions about his skills, education, projects, and hackathon experience. How can I help you today?"
    },
    summary: {
      examples: ["tell me about vraj","who is vraj","what does he do","what do you do","professional summary","about him","introduce yourself","profile","background","vraj summary","about vraj"],
      response: "Vraj is a highly motivated B.Tech Information Technology student specializing in Python, Machine Learning, Computer Vision, and Full-Stack Web Development. He builds complex end-to-end systems, from AI driver monitoring to civic-tech platforms, and is actively seeking roles in Data Science and AI/ML."
    },
    contact: {
      examples: ["how do i contact you","how do i contact him","email address","phone number","reach out","linkedin","github","message","contact details","how to contact vraj","contact vraj","vraj email","vraj phone"],
      response: "You can reach Vraj directly through contact button. You can also connect with him on LinkedIn (linkedin.com/in/vraj-patel-56941a347) or view his code on GitHub (github.com/vrajptl275)!"
    },
    education: {
      examples: ["what is your education","what is his education","where did he study","where does he study","college","degree","university","cgpa","marks","where do you study","btech","sgpa","academic background","mbit","vraj education","where does vraj study","vraj college","vraj degree"],
      response: "Vraj is pursuing his B.Tech in Information Technology at MBIT Anand, Gujarat, with an expected graduation in May 2027. He has a stellar academic record with a cumulative CGPA of 8.50/10, maintaining strong SGPAs like 8.83 in S1 and 8.75 in S5."
    },
    skills_general: {
      examples: ["what are your skills","what are his skills","which skill he have","can you tell me his skill","tell me about his skills","tell me his skills","what skills does he have","technologies","tech stack","languages","what do you know","programming languages","technical expertise","what can you code","what can he code","skill","skills","what are vraj skills","vraj skills","tell me vraj skills","vraj tech stack"],
      response: "Vraj's core programming stack includes Python, SQL, HTML5, CSS3, and JavaScript. For backend and database management, he uses Flask, SQLite, and PostgreSQL. He is also highly proficient with Git and GitHub."
    },
    skills_ml: {
      examples: ["do you know machine learning","does he know machine learning","ai skills","computer vision","opencv","yolo","tensorflow","data science skills","pandas","numpy","scikit-learn","vraj ai skills","vraj machine learning"],
      response: "Yes! Vraj specializes in AI/ML and Computer Vision. His toolkit includes NumPy, Pandas, Scikit-learn, TensorFlow, and MediaPipe. He is highly experienced with OpenCV and custom-training YOLOv11 models for real-time object detection."
    },
    skills_soft: {
      examples: ["what are your soft skills","what are his soft skills","about his soft skill","soft skills","communication","teamwork","problem solving","vraj soft skills","tell me his soft skills","do you have soft skills"],
      response: "Vraj is not just a technical developer; he has excellent soft skills! He excels in Teamwork, Communication, Problem Solving, and Fast Learning. This allows him to adapt quickly to new environments and collaborate effectively in fast-paced projects like 36-hour hackathons."
    },
    project_drowsiness: {
      examples: ["driver drowsiness","car sleep project","yolo face detection","distraction detection","mediapipe project","ear detection","computer vision project"],
      response: "His 'Driver Drowsiness & Distraction Detection System' is an advanced real-time computer vision project. It uses MediaPipe Face Mesh for EAR-based eye tracking, and a custom YOLOv11 model (trained on 2,004 images) to detect phone usage while driving. It even utilizes CLAHE+Gamma correction for low-light performance!"
    },
    project_stock: {
      examples: ["stock project","stocksense ai","market","trading bot","finance app","stocks","xgboost","predict stocks"],
      response: "'StockSense AI' is an AI-powered stock chatbot with a WhatsApp-style UI. It answers natural-language queries, generates interactive Plotly charts (RSI, MACD, Bollinger Bands), and provides Buy/Sell recommendations using a hybrid GARCH + XGBoost ML model. It is fully deployed on Render!"
    },
    project_civic: {
      examples: ["tell me about the civic issue project","anand city app","government platform","reporting system","civic","jwt","complaint management","full stack project"],
      response: "The 'Anand Civic Issue Reporting System' is a massive full-stack platform for citizen complaints. It features 4 user roles, GPS city-boundary validation, JWT authentication, bcrypt hashing, and Chart.js dashboards. It even integrates Gemini AI for automated image analysis of the reported issues!"
    },
    project_attendance: {
      examples: ["smart attendance","face recognition attendance","school tracker","attendance system","student management","facial recognition"],
      response: "The 'Smart Attendance System' is a robust web application built with Python's face recognition library. It tracks attendance in real-time, provides distinct dashboards for Admins, Teachers, and Students, and allows users to export data as CSV or PDF reports."
    },
    projects_general: {
      examples: ["what projects have you built","what projects has he done","which project he done","show me your work","show me his work","portfolio","apps","software","tell me about your projects","what has he built","can you tell me vraj projects","vraj projects","what projects has vraj done","vraj portfolio","project","projects"],
      response: "Vraj has built some incredible systems! For example, the 'Driver Drowsiness Detection System', 'StockSense AI', 'Civic Issue Reporting System', and a 'Smart Attendance System'. Which one interests you?"
    },
    hackathons: {
      examples: ["hackathons","competitions","awards","sih","cvmu","did you win any prizes","achievements","smart india hackathon","vraj hackathons"],
      response: "Vraj thrives under pressure! He successfully built a fully working prototype in just 36 hours at the CVMU Hackathon 4.0. He also collaborated in a team to design a socially impactful solution for the Smart India Hackathon (SIH) internal selection round at his college."
    },
    hire: {
      examples: ["i want to hire you","i want to hire him","job","internship","resume","cv","recruit","vacancy","open to work","interview","looking for job","hire vraj","vraj resume"],
      response: "Vraj is actively seeking internships and full-time roles in Data Science, AI/ML, and Software Development! You can email him directly at sp533013@gmail.com to discuss opportunities."
    }
  };

  // ─── Stop Words (conversational filler to ignore) ───────
  const STOP_WORDS = new Set([
    "can","could","would","will","you","tell","me","about","a","an","the",
    "so","is","are","am","i","do","does","did","please","show","what","which",
    "how","where","why","to","for","with","on","in","at","of","and","or",
    "has","have","had","be","been","was","were","that","this","it","its",
    "but","not","no","if","then","than","them","they","their","there",
    "also","just","very","really","actually","basically","know","like","want"
  ]);

  // ─── Tokenizer ──────────────────────────────────────────
  function tokenize(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s'-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0);
  }

  function getTokens(text) {
    const words = tokenize(text);
    const filtered = words.filter(w => !STOP_WORDS.has(w));
    // Generate unigrams + bigrams
    const tokens = [...filtered];
    for (let i = 0; i < filtered.length - 1; i++) {
      tokens.push(filtered[i] + ' ' + filtered[i + 1]);
    }
    // Also include raw bigrams (before stop-word removal) for phrases
    for (let i = 0; i < words.length - 1; i++) {
      tokens.push(words[i] + ' ' + words[i + 1]);
    }
    return tokens;
  }

  // ─── Scoring Engine ─────────────────────────────────────
  function score(userTokens, exampleText) {
    const exTokens = getTokens(exampleText);
    let matches = 0;
    for (const ut of userTokens) {
      for (const et of exTokens) {
        if (ut === et) { matches++; break; }
      }
    }
    if (userTokens.length === 0) return 0;
    // Jaccard-like similarity
    const union = new Set([...userTokens, ...exTokens]).size;
    return matches / union;
  }

  // ─── Main Query Function ────────────────────────────────
  function query(userMsg) {
    const userTokens = getTokens(userMsg);

    let bestIntent = null;
    let bestScore  = 0;
    let bestResponse = "";

    for (const [intent, data] of Object.entries(KB)) {
      for (const example of data.examples) {
        const s = score(userTokens, example);
        if (s > bestScore) {
          bestScore    = s;
          bestIntent   = intent;
          bestResponse = data.response;
        }
      }
    }

    const threshold = 0.08;
    if (bestScore < threshold) {
      return {
        reply: "My neural network couldn't confidently process that. Could you ask specifically about Vraj's education, skills, projects, or how to contact him?",
        intent: "unknown",
        confidence: Math.round(bestScore * 1000) / 1000
      };
    }

    console.log(`[AI] Intent: "${bestIntent}" | Score: ${bestScore.toFixed(3)} | Query: "${userMsg}"`);

    return {
      reply: bestResponse,
      intent: bestIntent,
      confidence: Math.round(bestScore * 1000) / 1000
    };
  }

  return { query };

})();
