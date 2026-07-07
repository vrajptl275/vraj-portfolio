/* ============================================================
   AI ENGINE — Pure JavaScript (No Backend Required)
   Uses TF-IDF-like scoring with bigrams for intent matching.
   Drop-in replacement for the Python FastAPI backend.
============================================================ */

const AIEngine = (() => {

  // ─── Knowledge Base ─────────────────────────────────────
  const KB = {
    greeting: {
      examples: ["hello","hi","hey","good morning","good evening","how are you","what's up","greetings","who are you","hello vraj","hi vraj","hey there","namaste","hii","hlo","howdy"],
      response: "Hello! I am the AI Agent for Vraj Gaurangkumar Patel. I can answer questions about his skills, education, projects, and hackathon experience. How can I help you today?"
    },
    summary: {
      examples: ["tell me about vraj","who is vraj","what does he do","what do you do","professional summary","about him","introduce yourself","profile","background","vraj summary","about vraj","introduce vraj","who is this","whose portfolio","describe vraj","overview","brief about vraj","who is vraj patel","tell me about yourself","about yourself"],
      response: "Vraj is a highly motivated B.Tech Information Technology student specializing in Python, Machine Learning, Computer Vision, and Full-Stack Web Development. He has independently built and deployed five end-to-end projects spanning AI-powered image restoration, driver monitoring, financial analytics, civic-tech, and attendance automation. He is actively seeking roles in Data Science, AI/ML, and Software Development."
    },
    contact: {
      examples: ["how do i contact you","how do i contact him","email address","phone number","reach out","linkedin","github","message","contact details","how to contact vraj","contact vraj","vraj email","vraj phone","email","phone","contact","call him","mail him","send message","get in touch","connect with vraj","vraj linkedin","vraj github"],
      response: "You can reach Vraj directly through the contact button. You can also connect with him on LinkedIn (linkedin.com/in/vraj-patel-56941a347) or view his code on GitHub (github.com/vrajptl275). Email: sp533013@gmail.com | Phone: +91 7698750331."
    },
    education: {
      examples: ["what is your education","what is his education","where did he study","where does he study","college","degree","university","cgpa","marks","where do you study","btech","sgpa","academic background","mbit","vraj education","where does vraj study","vraj college","vraj degree","gpa","grade","semester","which college","college name","education background","qualification","academic record","what did he study","information technology","graduation","graduation year","when will he graduate"],
      response: "Vraj is pursuing his B.Tech in Information Technology at MBIT Anand, Gujarat, with an expected graduation in May 2027. He has a stellar academic record with a cumulative CGPA of 8.61/10, maintaining strong SGPAs: S1: 8.83, S2: 8.17, S3: 8.48, S4: 8.30, S5: 8.75, and S6: 9.19."
    },
    skills_general: {
      examples: ["what are your skills","what are his skills","which skill he have","can you tell me his skill","tell me about his skills","tell me his skills","what skills does he have","technologies","tech stack","languages","what do you know","programming languages","technical expertise","what can you code","what can he code","skill","skills","what are vraj skills","vraj skills","tell me vraj skills","vraj tech stack","what languages does he know","coding languages","frameworks","tools","what tools does he use","python","javascript","html","css","flask","sql","database","backend"],
      response: "Vraj's core programming stack includes Python, SQL, HTML5, CSS3, and JavaScript (Basic). For backend and database management, he uses Flask, SQLite, and PostgreSQL. He is also highly proficient with Git, GitHub, Gradio, and Streamlit."
    },
    skills_ml: {
      examples: ["do you know machine learning","does he know machine learning","ai skills","computer vision","opencv","yolo","tensorflow","data science skills","pandas","numpy","scikit-learn","vraj ai skills","vraj machine learning","pytorch","deep learning","neural network","ml skills","artificial intelligence","machine learning skills","what ml tools","data science","model training","image processing","object detection","mediapipe","yolov11","face detection","classification","regression","xgboost","torch","pyTorch skills"],
      response: "Yes! Vraj specializes in AI/ML and Computer Vision. His toolkit includes PyTorch, TensorFlow, OpenCV, Scikit-learn, MediaPipe, NumPy, Pandas, Matplotlib, and Streamlit. He is highly experienced with custom-training YOLOv11 models for real-time object detection."
    },
    skills_soft: {
      examples: ["what are your soft skills","what are his soft skills","about his soft skill","soft skills","communication","teamwork","problem solving","vraj soft skills","tell me his soft skills","do you have soft skills","leadership","team player","collaborative","fast learner","logical thinking"],
      response: "Vraj is not just a technical developer; he has excellent soft skills! He excels in Teamwork, Communication, Problem Solving, Logical Thinking, and Fast Learning. This allows him to adapt quickly to new environments and collaborate effectively in fast-paced projects like 36-hour hackathons."
    },
    project_neuralrestore: {
      examples: ["neuralrestore","neural restore","image restoration","photo repair","lama","nafnet","esrgan","old photo","corrupted image","image repair","upscaling","super resolution","inpainting","denoising","deblurring","restore image","fix old photo","repair photo","ai image restoration","neuralrestore project","tell me about neuralrestore","what is neuralrestore","gradio project","image pipeline","efficientnet","unet","dncnn","photo restoration","damaged image","damage detection"],
      response: "'NeuralRestore' is Vraj's most advanced AI project — a 5-model deep learning pipeline that automatically detects and repairs damage in old/corrupted images without manual masking. It chains EfficientNet-B4 + UNet (damage/mask detection), LaMa FFC (inpainting), DnCNN (denoising), NAFNet (deblurring), and Real-ESRGAN 4x (super-resolution). It features test-time augmentation (4 flip variants), configurable mask thresholds, and a drag-and-drop Gradio UI that runs fully offline."
    },
    project_drowsiness: {
      examples: ["driver drowsiness","car sleep project","yolo face detection","distraction detection","mediapipe project","ear detection","computer vision project","driver monitoring","drowsy detection","phone detection while driving","driver safety","drowsiness","distraction","driver monitor","drowsy driver","sleepy driver","driving safety","tell me about driver project","yolo phone detection","head pose"],
      response: "The 'Driver Drowsiness & Distraction Detection System' is an advanced real-time computer vision project. It uses MediaPipe Face Mesh for EAR-based eye tracking and head pose estimation (with auto-calibration and 8-frame smoothing to cut false positives). A custom YOLOv11 model (trained on 2,004 images across 2 classes) detects phone usage. It integrates independent drowsy/distraction/phone alarms and uses CLAHE + gamma correction for low-light performance."
    },
    project_stock: {
      examples: ["stock project","stocksense ai","market","trading bot","finance app","stocks","xgboost","predict stocks","stock analysis","stock chatbot","stock prediction","financial analytics","rsi","macd","bollinger bands","buy sell recommendation","stock market","stocksense","tell me about stocksense","finance project","whatsapp chatbot","garch","stock indicator"],
      response: "'StockSense AI' is an AI-powered stock analysis chatbot with a WhatsApp-style UI. It answers natural-language queries on any global ticker, generates interactive Plotly charts (RSI, MACD, Bollinger Bands, SMA), and provides Buy/Sell recommendations using a hybrid RSI + MACD + SMA + GARCH + XGBoost model. It also supports multi-stock comparison and a financial concept explainer."
    },
    project_civic: {
      examples: ["tell me about the civic issue project","anand city app","government platform","reporting system","civic","jwt","complaint management","full stack project","civic issue","anand civic","complaint platform","citizen complaint","municipal","civic reporting","anand city","civic system","role based","tell me about civic project","government complaint","issue reporting","leaflet"],
      response: "The 'Anand Civic Issue Reporting System' is a full-stack, role-based (Citizen, Officer, Dept. Admin, Municipal Admin) complaint platform. It features GPS-based Anand city boundary validation, image uploads, optional Gemini AI image analysis, a 6-stage complaint workflow with JWT auth, bcrypt hashing, rate limiting, automated notifications, and Chart.js analytics."
    },
    project_attendance: {
      examples: ["smart attendance","face recognition attendance","school tracker","attendance system","student management","facial recognition","attendance","face recognition","attendance project","smart attendance system","tell me about attendance","biometric attendance","face based attendance","csv export","pdf report","gunicorn"],
      response: "The 'Smart Attendance System' is a web-based attendance system with face recognition, real-time tracking, and role-based dashboards for Admin, Teacher, and Student. It supports CSV/PDF report export, multi-role authentication, and a Gunicorn deployment pipeline with a custom build script for compiling the C++ face-recognition library."
    },
    projects_general: {
      examples: ["what projects have you built","what projects has he done","which project he done","show me your work","show me his work","apps","software","tell me about your projects","what has he built","can you tell me vraj projects","vraj projects","what projects has vraj done","vraj portfolio","list projects","all projects","how many projects","tell me projects","show projects","what did he build","his work","built","your work"],
      response: "Vraj has built 5 end-to-end projects: 1) 'NeuralRestore' — AI image restoration pipeline (2026), 2) 'Driver Drowsiness Detection' — real-time CV system (2026), 3) 'StockSense AI' — AI stock chatbot (2025), 4) 'Anand Civic Issue Reporting' — full-stack platform (2025), 5) 'Smart Attendance' — face recognition system (2024). Ask about any specific project for details!"
    },
    hackathons: {
      examples: ["hackathons","competitions","awards","sih","cvmu","did you win any prizes","achievements","smart india hackathon","vraj hackathons","hackathon","cvmu hackathon","competition","coding competition","36 hour","participated","hackathon experience","events","extracurricular","activities"],
      response: "Vraj thrives under pressure! He presented the Anand Civic Issue Reporting System at the 36-hour CVMU Hackathon 4.0, delivering a fully working prototype through rapid prototyping and agile teamwork. He also presented the Smart Attendance System in MBIT's internal Smart India Hackathon (SIH) selection round, collaborating in a team to build a socially impactful solution."
    },
    hire: {
      examples: ["i want to hire you","i want to hire him","job","internship","resume","cv","recruit","vacancy","open to work","interview","looking for job","hire vraj","vraj resume","career","opportunity","available","hiring","freelance","work with him","collaborate","download resume","get resume"],
      response: "Vraj is actively seeking internships and full-time roles in Data Science, AI/ML, and Software Development! You can download his resume from the portfolio or email him directly at sp533013@gmail.com to discuss opportunities."
    }
  };

  // ─── Stop Words (conversational filler to ignore) ───────
  const STOP_WORDS = new Set([
    "can","could","would","will","you","tell","me","about","a","an","the",
    "so","is","are","am","i","do","does","did","please","show","what","which",
    "how","where","why","to","for","with","on","in","at","of","and","or",
    "has","have","had","be","been","was","were","that","this","it","its",
    "but","not","no","if","then","than","them","they","their","there",
    "also","just","very","really","actually","basically"
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
  function score(userTokens, exampleText, rawUserMsg) {
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
    let baseScore = matches / union;

    // Bonus: if the full example text appears as a substring in user's raw message
    const normalUser = rawUserMsg.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    const normalExample = exampleText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    if (normalUser.includes(normalExample) || normalExample.includes(normalUser)) {
      baseScore += 0.15;
    }

    return baseScore;
  }

  // ─── Main Query Function ────────────────────────────────
  function query(userMsg) {
    const userTokens = getTokens(userMsg);

    let bestIntent = null;
    let bestScore  = 0;
    let bestResponse = "";

    for (const [intent, data] of Object.entries(KB)) {
      for (const example of data.examples) {
        const s = score(userTokens, example, userMsg);
        if (s > bestScore) {
          bestScore    = s;
          bestIntent   = intent;
          bestResponse = data.response;
        }
      }
    }

    const threshold = 0.12;
    if (bestScore < threshold) {
      return {
        reply: "My neural network couldn't confidently process that. Could you ask specifically about Vraj's education, skills, projects, hackathons, or how to contact him?",
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
