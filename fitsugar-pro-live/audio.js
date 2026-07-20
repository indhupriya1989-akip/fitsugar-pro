(function () {
  const panel = document.getElementById("audioPanel");
  const trigger = document.getElementById("audioBtn");
  const close = document.getElementById("audioClose");
  const readPage = document.getElementById("readPageBtn");
  const pause = document.getElementById("pauseAudioBtn");
  const stop = document.getElementById("stopAudioBtn");
  const speed = document.getElementById("audioSpeed");
  const speedOutput = document.getElementById("speedOutput");
  const status = document.getElementById("audioStatus");
  const pulse = document.getElementById("audioPulse");
  const localeLabel = document.getElementById("audioLocale");
  let synthesis = null;
  let utterance = null;
  let fallbackAudio = null;

  const locales = {
    en: ["en-IN", "English"], ta: ["ta-IN", "தமிழ்"], hi: ["hi-IN", "हिन्दी"],
    te: ["te-IN", "తెలుగు"], ml: ["ml-IN", "മലയാളം"], kn: ["kn-IN", "ಕನ್ನಡ"],
    bn: ["bn-IN", "বাংলা"], mr: ["mr-IN", "मराठी"], gu: ["gu-IN", "ગુજરાતી"]
  };
  const builtInAudio = {
    hi: {
      home:"assets/audio/hi/home.mp3", workouts:"assets/audio/hi/workouts.mp3",
      nutrition:"assets/audio/hi/nutrition.mp3", progress:"assets/audio/hi/progress.mp3",
      health:"assets/audio/hi/health.mp3", coach:"assets/audio/hi/coach.mp3",
      restart:"assets/audio/hi/restart.mp3", business:"assets/audio/hi/business.mp3",
      "card-workout":"assets/audio/hi/card-workout.mp3", "card-meal":"assets/audio/hi/card-meal.mp3",
      "card-protein":"assets/audio/hi/card-protein.mp3", "card-coach":"assets/audio/hi/card-coach.mp3",
      "card-modal":"assets/audio/hi/card-modal.mp3", generic:"assets/audio/hi/generic.mp3"
    }
  };

  const copy = {
    en: {
      title:"Voice Guide", audio:"English audio", ready:"Ready to listen", languageReady:"Ready in English",
      read:"Read this screen", hear:"Hear the visible content", pause:"Pause", resume:"Resume", stop:"Stop",
      speed:"Reading speed", help:"Voice availability depends on your device. FitSugar uses the closest installed voice for English.",
      unsupported:"Audio is not supported in this browser", unavailable:"Voice Guide is unavailable on this device.",
      nothing:"Nothing to read on this screen", playing:"Playing audio…", finished:"Finished. Ready to listen.",
      starting:"Starting audio…", stopped:"Audio stopped", paused:"Audio paused", none:"No audio is playing",
      failed:"This voice could not be played",
      screens:{
        home:"FitSugar Pro home. Review today’s workout, glucose, water, steps and meal plan.",
        workouts:"Workout library. Choose an age-appropriate exercise and open its guided steps.",
        nutrition:"Nutrition. Choose any Indian state or union territory to view regional meals and food alternatives.",
        progress:"Progress. Review your weight, body mass index, glucose and exercise activity.",
        health:"Health Hub. Record height, weight, age, body mass index, glucose, water, steps and progress photos.",
        coach:"FitSugar Coach. Ask about workouts, nutrition and safe health habits.",
        restart:"Restart Fitness Plan. Create a safer weekly plan based on the length of your break.",
        business:"Gym management. Review membership, members, payments, sales and business reports."
      },
      cards:{
        workout:"Workout guidance. Review the exercise steps, repetitions and safety notes before starting.",
        meal:"Meal guidance. Review the meal time, calories, protein and alternative foods.",
        protein:"Protein suggestion. Review the serving and choose an available alternative if needed.",
        coach:"FitSugar Coach guidance. Follow this advice together with your health status and trainer guidance.",
        modal:"Review this guidance and the available action before continuing."
      }
    },
    ta: {
      title:"குரல் வழிகாட்டி", audio:"தமிழ் ஒலி", ready:"கேட்கத் தயார்", languageReady:"தமிழில் கேட்கத் தயார்",
      read:"இந்தத் திரையைப் படிக்கவும்", hear:"திரையில் உள்ள தகவலைக் கேளுங்கள்", pause:"இடைநிறுத்து", resume:"தொடரவும்", stop:"நிறுத்து",
      speed:"வாசிப்பு வேகம்", help:"உங்கள் சாதனத்தில் உள்ள தமிழ் குரலை FitSugar தானாகத் தேர்ந்தெடுக்கும்.",
      unsupported:"இந்த உலாவியில் ஒலி வசதி இல்லை", unavailable:"இந்தச் சாதனத்தில் குரல் வழிகாட்டி கிடைக்கவில்லை.",
      nothing:"இந்தத் திரையில் படிக்க தகவல் இல்லை", playing:"ஒலி இயக்கப்படுகிறது…", finished:"முடிந்தது. மீண்டும் கேட்கத் தயார்.",
      starting:"ஒலி தொடங்குகிறது…", stopped:"ஒலி நிறுத்தப்பட்டது", paused:"ஒலி இடைநிறுத்தப்பட்டது", none:"இப்போது ஒலி இயங்கவில்லை",
      failed:"தமிழ் குரலை இயக்க முடியவில்லை",
      screens:{
        home:"FitSugar Pro முகப்பு. இன்றைய உடற்பயிற்சி, குளுக்கோஸ், தண்ணீர், அடிகள் மற்றும் உணவுத் திட்டத்தைப் பாருங்கள்.",
        workouts:"உடற்பயிற்சி நூலகம். உங்கள் வயதிற்கு ஏற்ற பயிற்சியைத் தேர்ந்தெடுத்து வழிகாட்டியைத் தொடங்குங்கள்.",
        nutrition:"ஊட்டச்சத்து. இந்திய மாநிலம் அல்லது யூனியன் பிரதேசத்தைத் தேர்ந்தெடுத்து உணவுத் திட்டம் மற்றும் மாற்று உணவுகளைப் பாருங்கள்.",
        progress:"முன்னேற்றம். எடை, உடல் நிறை குறியீடு, குளுக்கோஸ் மற்றும் உடற்பயிற்சி பதிவைப் பாருங்கள்.",
        health:"ஆரோக்கிய மையம். உயரம், எடை, வயது, உடல் நிறை குறியீடு, குளுக்கோஸ், தண்ணீர், அடிகள் மற்றும் புகைப்படங்களைப் பதிவு செய்யுங்கள்.",
        coach:"FitSugar பயிற்சியாளரிடம் உடற்பயிற்சி, உணவு மற்றும் பாதுகாப்பான ஆரோக்கிய பழக்கங்கள் பற்றிக் கேளுங்கள்.",
        restart:"மீண்டும் தொடங்கும் உடற்பயிற்சி திட்டம். இடைவேளைக்கு ஏற்ப பாதுகாப்பான வாரத் திட்டத்தை உருவாக்குங்கள்.",
        business:"ஜிம் நிர்வாகம். உறுப்பினர்கள், கட்டணங்கள், விற்பனை மற்றும் வணிக அறிக்கைகளைப் பாருங்கள்."
      },
      cards:{
        workout:"உடற்பயிற்சி வழிகாட்டி. தொடங்கும் முன் பயிற்சி படிகள், எண்ணிக்கை மற்றும் பாதுகாப்பு குறிப்புகளைப் பாருங்கள்.",
        meal:"உணவு வழிகாட்டி. உணவு நேரம், கலோரி, புரதம் மற்றும் மாற்று உணவுகளைப் பாருங்கள்.",
        protein:"புரத பரிந்துரை. அளவைப் பார்த்து தேவையான மாற்றைத் தேர்ந்தெடுக்கவும்.",
        coach:"FitSugar பயிற்சியாளர் வழிகாட்டல். உங்கள் உடல்நிலை மற்றும் பயிற்சியாளர் ஆலோசனையுடன் இதைப் பின்பற்றுங்கள்.",
        modal:"தொடர்வதற்கு முன் இந்த வழிகாட்டலையும் செயல் விருப்பத்தையும் பாருங்கள்."
      }
    },
    hi: {
      title:"आवाज़ मार्गदर्शिका", audio:"हिन्दी ऑडियो", ready:"सुनने के लिए तैयार", languageReady:"हिन्दी में सुनने के लिए तैयार",
      read:"यह स्क्रीन पढ़ें", hear:"स्क्रीन की जानकारी सुनें", pause:"रोकें", resume:"जारी रखें", stop:"बंद करें",
      speed:"पढ़ने की गति", help:"हिन्दी आवाज़ FitSugar में शामिल है और बिना अलग वॉइस इंस्टॉल किए चलेगी।",
      unsupported:"इस ब्राउज़र में ऑडियो उपलब्ध नहीं है", unavailable:"इस डिवाइस पर आवाज़ मार्गदर्शिका उपलब्ध नहीं है।",
      nothing:"इस स्क्रीन पर पढ़ने के लिए कुछ नहीं है", playing:"ऑडियो चल रहा है…", finished:"पूरा हुआ। फिर से सुनने के लिए तैयार।",
      starting:"ऑडियो शुरू हो रहा है…", stopped:"ऑडियो बंद हुआ", paused:"ऑडियो रुका हुआ है", none:"कोई ऑडियो नहीं चल रहा",
      failed:"हिन्दी आवाज़ नहीं चलाई जा सकी",
      screens:{
        home:"FitSugar Pro होम। आज का वर्कआउट, ग्लूकोज़, पानी, कदम और भोजन योजना देखें।",
        workouts:"वर्कआउट लाइब्रेरी। अपनी उम्र के अनुसार व्यायाम चुनें और निर्देशित चरण शुरू करें।",
        nutrition:"पोषण। भारतीय राज्य या केंद्र शासित प्रदेश चुनकर क्षेत्रीय भोजन और विकल्प देखें।",
        progress:"प्रगति। वजन, बी एम आई, ग्लूकोज़ और व्यायाम गतिविधि देखें।",
        health:"स्वास्थ्य केंद्र। ऊंचाई, वजन, उम्र, बी एम आई, ग्लूकोज़, पानी, कदम और प्रगति फोटो दर्ज करें।",
        coach:"FitSugar कोच से वर्कआउट, पोषण और सुरक्षित स्वास्थ्य आदतों के बारे में पूछें।",
        restart:"फिटनेस पुनः आरंभ योजना। अपने विराम के अनुसार सुरक्षित साप्ताहिक योजना बनाएं।",
        business:"जिम प्रबंधन। सदस्यता, सदस्य, भुगतान, बिक्री और व्यवसाय रिपोर्ट देखें।"
      },
      cards:{
        workout:"वर्कआउट मार्गदर्शन। शुरू करने से पहले चरण, दोहराव और सुरक्षा निर्देश देखें।",
        meal:"भोजन मार्गदर्शन। समय, कैलोरी, प्रोटीन और वैकल्पिक भोजन देखें।",
        protein:"प्रोटीन सुझाव। मात्रा देखें और जरूरत होने पर विकल्प चुनें।",
        coach:"FitSugar कोच मार्गदर्शन। इसे अपनी स्वास्थ्य स्थिति और ट्रेनर की सलाह के साथ अपनाएं।",
        modal:"आगे बढ़ने से पहले इस मार्गदर्शन और उपलब्ध विकल्प को देखें।"
      }
    },
    te: {
      title:"వాయిస్ గైడ్", audio:"తెలుగు ఆడియో", ready:"వినడానికి సిద్ధం", languageReady:"తెలుగులో వినడానికి సిద్ధం",
      read:"ఈ స్క్రీన్ చదవండి", hear:"స్క్రీన్ సమాచారం వినండి", pause:"విరామం", resume:"కొనసాగించండి", stop:"ఆపండి",
      speed:"చదివే వేగం", help:"మీ పరికరంలో అందుబాటులో ఉన్న సరైన తెలుగు వాయిస్‌ను FitSugar ఎంచుకుంటుంది.",
      unsupported:"ఈ బ్రౌజర్‌లో ఆడియో అందుబాటులో లేదు", unavailable:"ఈ పరికరంలో వాయిస్ గైడ్ అందుబాటులో లేదు.",
      nothing:"ఈ స్క్రీన్‌లో చదవడానికి సమాచారం లేదు", playing:"ఆడియో ప్లే అవుతోంది…", finished:"పూర్తయింది. మళ్లీ వినడానికి సిద్ధం.",
      starting:"ఆడియో ప్రారంభమవుతోంది…", stopped:"ఆడియో ఆపబడింది", paused:"ఆడియో విరామంలో ఉంది", none:"ఆడియో ప్లే కావడం లేదు",
      failed:"తెలుగు వాయిస్‌ను ప్లే చేయలేకపోయాం",
      screens:{
        home:"FitSugar Pro హోమ్. ఈరోజు వ్యాయామం, గ్లూకోజ్, నీరు, అడుగులు మరియు భోజన ప్రణాళికను చూడండి.",
        workouts:"వ్యాయామ లైబ్రరీ. మీ వయస్సుకు తగిన వ్యాయామాన్ని ఎంచుకొని గైడ్‌ను ప్రారంభించండి.",
        nutrition:"పోషణ. భారత రాష్ట్రం లేదా కేంద్ర పాలిత ప్రాంతాన్ని ఎంచుకొని ప్రాంతీయ భోజనాలు మరియు ప్రత్యామ్నాయాలను చూడండి.",
        progress:"పురోగతి. బరువు, బి ఎం ఐ, గ్లూకోజ్ మరియు వ్యాయామ చరిత్రను చూడండి.",
        health:"ఆరోగ్య కేంద్రం. ఎత్తు, బరువు, వయస్సు, బి ఎం ఐ, గ్లూకోజ్, నీరు, అడుగులు మరియు ఫోటోలను నమోదు చేయండి.",
        coach:"వ్యాయామం, పోషణ మరియు సురక్షిత ఆరోగ్య అలవాట్ల గురించి FitSugar కోచ్‌ను అడగండి.",
        restart:"ఫిట్‌నెస్ పునఃప్రారంభ ప్రణాళిక. మీ విరామానికి తగిన సురక్షిత వార ప్రణాళికను రూపొందించండి.",
        business:"జిమ్ నిర్వహణ. సభ్యత్వాలు, చెల్లింపులు, అమ్మకాలు మరియు వ్యాపార నివేదికలను చూడండి."
      },
      cards:{
        workout:"వ్యాయామ మార్గదర్శకం. ప్రారంభించే ముందు దశలు, పునరావృతాలు మరియు భద్రతా సూచనలు చూడండి.",
        meal:"భోజన మార్గదర్శకం. సమయం, కేలరీలు, ప్రోటీన్ మరియు ప్రత్యామ్నాయ ఆహారాలను చూడండి.",
        protein:"ప్రోటీన్ సూచన. పరిమాణాన్ని చూసి అవసరమైతే ప్రత్యామ్నాయం ఎంచుకోండి.",
        coach:"FitSugar కోచ్ మార్గదర్శకం. మీ ఆరోగ్య స్థితి మరియు ట్రైనర్ సలహాతో పాటించండి.",
        modal:"కొనసాగించే ముందు ఈ సూచన మరియు అందుబాటులో ఉన్న చర్యను చూడండి."
      }
    },
    ml: {
      title:"വോയ്സ് ഗൈഡ്", audio:"മലയാളം ഓഡിയോ", ready:"കേൾക്കാൻ തയ്യാറാണ്", languageReady:"മലയാളത്തിൽ കേൾക്കാൻ തയ്യാറാണ്",
      read:"ഈ സ്ക്രീൻ വായിക്കുക", hear:"സ്ക്രീനിലെ വിവരം കേൾക്കുക", pause:"താൽക്കാലികമായി നിർത്തുക", resume:"തുടരുക", stop:"നിർത്തുക",
      speed:"വായന വേഗം", help:"നിങ്ങളുടെ ഉപകരണത്തിൽ ലഭ്യമായ അനുയോജ്യമായ മലയാളം ശബ്ദം FitSugar തിരഞ്ഞെടുക്കും.",
      unsupported:"ഈ ബ്രൗസറിൽ ഓഡിയോ ലഭ്യമല്ല", unavailable:"ഈ ഉപകരണത്തിൽ വോയ്സ് ഗൈഡ് ലഭ്യമല്ല.",
      nothing:"ഈ സ്ക്രീനിൽ വായിക്കാൻ വിവരമില്ല", playing:"ഓഡിയോ പ്ലേ ചെയ്യുന്നു…", finished:"പൂർത്തിയായി. വീണ്ടും കേൾക്കാൻ തയ്യാറാണ്.",
      starting:"ഓഡിയോ ആരംഭിക്കുന്നു…", stopped:"ഓഡിയോ നിർത്തി", paused:"ഓഡിയോ താൽക്കാലികമായി നിർത്തി", none:"ഓഡിയോ പ്ലേ ചെയ്യുന്നില്ല",
      failed:"മലയാളം ശബ്ദം പ്ലേ ചെയ്യാനായില്ല",
      screens:{
        home:"FitSugar Pro ഹോം. ഇന്നത്തെ വ്യായാമം, ഗ്ലൂക്കോസ്, വെള്ളം, ചുവടുകൾ, ഭക്ഷണ പദ്ധതി എന്നിവ കാണുക.",
        workouts:"വ്യായാമ ലൈബ്രറി. നിങ്ങളുടെ പ്രായത്തിന് അനുയോജ്യമായ വ്യായാമം തിരഞ്ഞെടുത്ത് ഗൈഡ് ആരംഭിക്കുക.",
        nutrition:"പോഷണം. ഇന്ത്യൻ സംസ്ഥാനം അല്ലെങ്കിൽ കേന്ദ്രഭരണ പ്രദേശം തിരഞ്ഞെടുത്ത് പ്രാദേശിക ഭക്ഷണവും പകരങ്ങളും കാണുക.",
        progress:"പുരോഗതി. ഭാരം, ബി എം ഐ, ഗ്ലൂക്കോസ്, വ്യായാമ പ്രവർത്തനം എന്നിവ കാണുക.",
        health:"ആരോഗ്യ കേന്ദ്രം. ഉയരം, ഭാരം, പ്രായം, ബി എം ഐ, ഗ്ലൂക്കോസ്, വെള്ളം, ചുവടുകൾ, ചിത്രങ്ങൾ എന്നിവ രേഖപ്പെടുത്തുക.",
        coach:"വ്യായാമം, പോഷണം, സുരക്ഷിത ആരോഗ്യ ശീലങ്ങൾ എന്നിവയെക്കുറിച്ച് FitSugar കോച്ചിനോട് ചോദിക്കുക.",
        restart:"ഫിറ്റ്നസ് പുനരാരംഭ പദ്ധതി. ഇടവേളയ്ക്ക് അനുയോജ്യമായ സുരക്ഷിത ആഴ്ച പദ്ധതി തയ്യാറാക്കുക.",
        business:"ജിം മാനേജ്മെന്റ്. അംഗത്വം, അംഗങ്ങൾ, പേയ്മെന്റ്, വിൽപ്പന, ബിസിനസ് റിപ്പോർട്ടുകൾ എന്നിവ കാണുക."
      },
      cards:{
        workout:"വ്യായാമ മാർഗ്ഗനിർദ്ദേശം. ആരംഭിക്കുന്നതിന് മുമ്പ് ഘട്ടങ്ങളും ആവർത്തനങ്ങളും സുരക്ഷാ നിർദ്ദേശങ്ങളും കാണുക.",
        meal:"ഭക്ഷണ മാർഗ്ഗനിർദ്ദേശം. സമയം, കലോറി, പ്രോട്ടീൻ, പകരം ഭക്ഷണം എന്നിവ കാണുക.",
        protein:"പ്രോട്ടീൻ നിർദ്ദേശം. അളവ് പരിശോധിച്ച് ആവശ്യമെങ്കിൽ പകരം തിരഞ്ഞെടുക്കുക.",
        coach:"FitSugar കോച്ച് മാർഗ്ഗനിർദ്ദേശം. നിങ്ങളുടെ ആരോഗ്യ നിലയും പരിശീലകന്റെ ഉപദേശവും ചേർത്ത് പാലിക്കുക.",
        modal:"തുടരുന്നതിന് മുമ്പ് ഈ മാർഗ്ഗനിർദ്ദേശവും ലഭ്യമായ പ്രവർത്തനവും പരിശോധിക്കുക."
      }
    },
    kn: {
      title:"ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ", audio:"ಕನ್ನಡ ಆಡಿಯೋ", ready:"ಕೇಳಲು ಸಿದ್ಧ", languageReady:"ಕನ್ನಡದಲ್ಲಿ ಕೇಳಲು ಸಿದ್ಧ",
      read:"ಈ ಪರದೆಯನ್ನು ಓದಿ", hear:"ಪರದೆಯ ಮಾಹಿತಿಯನ್ನು ಕೇಳಿ", pause:"ವಿರಾಮ", resume:"ಮುಂದುವರಿಸಿ", stop:"ನಿಲ್ಲಿಸಿ",
      speed:"ಓದುವ ವೇಗ", help:"ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಲಭ್ಯವಿರುವ ಸೂಕ್ತ ಕನ್ನಡ ಧ್ವನಿಯನ್ನು FitSugar ಆಯ್ಕೆ ಮಾಡುತ್ತದೆ.",
      unsupported:"ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಆಡಿಯೋ ಲಭ್ಯವಿಲ್ಲ", unavailable:"ಈ ಸಾಧನದಲ್ಲಿ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ ಲಭ್ಯವಿಲ್ಲ.",
      nothing:"ಈ ಪರದೆಯಲ್ಲಿ ಓದಲು ಮಾಹಿತಿ ಇಲ್ಲ", playing:"ಆಡಿಯೋ ಪ್ಲೇ ಆಗುತ್ತಿದೆ…", finished:"ಪೂರ್ಣವಾಗಿದೆ. ಮತ್ತೆ ಕೇಳಲು ಸಿದ್ಧ.",
      starting:"ಆಡಿಯೋ ಆರಂಭವಾಗುತ್ತಿದೆ…", stopped:"ಆಡಿಯೋ ನಿಲ್ಲಿಸಲಾಗಿದೆ", paused:"ಆಡಿಯೋ ವಿರಾಮದಲ್ಲಿದೆ", none:"ಯಾವುದೇ ಆಡಿಯೋ ಪ್ಲೇ ಆಗುತ್ತಿಲ್ಲ",
      failed:"ಕನ್ನಡ ಧ್ವನಿಯನ್ನು ಪ್ಲೇ ಮಾಡಲಾಗಲಿಲ್ಲ",
      screens:{
        home:"FitSugar Pro ಮುಖಪುಟ. ಇಂದಿನ ವ್ಯಾಯಾಮ, ಗ್ಲೂಕೋಸ್, ನೀರು, ಹೆಜ್ಜೆಗಳು ಮತ್ತು ಆಹಾರ ಯೋಜನೆಯನ್ನು ನೋಡಿ.",
        workouts:"ವ್ಯಾಯಾಮ ಗ್ರಂಥಾಲಯ. ನಿಮ್ಮ ವಯಸ್ಸಿಗೆ ತಕ್ಕ ವ್ಯಾಯಾಮವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಪ್ರಾರಂಭಿಸಿ.",
        nutrition:"ಪೌಷ್ಟಿಕತೆ. ಭಾರತೀಯ ರಾಜ್ಯ ಅಥವಾ ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಪ್ರಾದೇಶಿಕ ಆಹಾರ ಮತ್ತು ಪರ್ಯಾಯಗಳನ್ನು ನೋಡಿ.",
        progress:"ಪ್ರಗತಿ. ತೂಕ, ಬಿ ಎಂ ಐ, ಗ್ಲೂಕೋಸ್ ಮತ್ತು ವ್ಯಾಯಾಮ ಚಟುವಟಿಕೆಯನ್ನು ನೋಡಿ.",
        health:"ಆರೋಗ್ಯ ಕೇಂದ್ರ. ಎತ್ತರ, ತೂಕ, ವಯಸ್ಸು, ಬಿ ಎಂ ಐ, ಗ್ಲೂಕೋಸ್, ನೀರು, ಹೆಜ್ಜೆಗಳು ಮತ್ತು ಚಿತ್ರಗಳನ್ನು ದಾಖಲಿಸಿ.",
        coach:"ವ್ಯಾಯಾಮ, ಪೌಷ್ಟಿಕತೆ ಮತ್ತು ಸುರಕ್ಷಿತ ಆರೋಗ್ಯ ಅಭ್ಯಾಸಗಳ ಬಗ್ಗೆ FitSugar ಕೋಚ್ ಅನ್ನು ಕೇಳಿ.",
        restart:"ಫಿಟ್ನೆಸ್ ಮರುಪ್ರಾರಂಭ ಯೋಜನೆ. ನಿಮ್ಮ ವಿರಾಮಕ್ಕೆ ತಕ್ಕ ಸುರಕ್ಷಿತ ವಾರದ ಯೋಜನೆಯನ್ನು ರಚಿಸಿ.",
        business:"ಜಿಮ್ ನಿರ್ವಹಣೆ. ಸದಸ್ಯತ್ವ, ಸದಸ್ಯರು, ಪಾವತಿ, ಮಾರಾಟ ಮತ್ತು ವ್ಯವಹಾರ ವರದಿಗಳನ್ನು ನೋಡಿ."
      },
      cards:{
        workout:"ವ್ಯಾಯಾಮ ಮಾರ್ಗದರ್ಶನ. ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ಹಂತಗಳು, ಪುನರಾವರ್ತನೆಗಳು ಮತ್ತು ಸುರಕ್ಷತಾ ಸೂಚನೆಗಳನ್ನು ನೋಡಿ.",
        meal:"ಆಹಾರ ಮಾರ್ಗದರ್ಶನ. ಸಮಯ, ಕ್ಯಾಲೊರಿ, ಪ್ರೋಟೀನ್ ಮತ್ತು ಪರ್ಯಾಯ ಆಹಾರಗಳನ್ನು ನೋಡಿ.",
        protein:"ಪ್ರೋಟೀನ್ ಸಲಹೆ. ಪ್ರಮಾಣವನ್ನು ನೋಡಿ ಅಗತ್ಯವಿದ್ದರೆ ಪರ್ಯಾಯವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
        coach:"FitSugar ಕೋಚ್ ಮಾರ್ಗದರ್ಶನ. ನಿಮ್ಮ ಆರೋಗ್ಯ ಸ್ಥಿತಿ ಮತ್ತು ತರಬೇತುದಾರರ ಸಲಹೆಯೊಂದಿಗೆ ಪಾಲಿಸಿ.",
        modal:"ಮುಂದುವರಿಸುವ ಮೊದಲು ಈ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಲಭ್ಯವಿರುವ ಕ್ರಮವನ್ನು ನೋಡಿ."
      }
    },
    bn: {
      title:"ভয়েস গাইড", audio:"বাংলা অডিও", ready:"শোনার জন্য প্রস্তুত", languageReady:"বাংলায় শোনার জন্য প্রস্তুত",
      read:"এই স্ক্রিন পড়ুন", hear:"স্ক্রিনের তথ্য শুনুন", pause:"বিরতি", resume:"চালিয়ে যান", stop:"বন্ধ করুন",
      speed:"পড়ার গতি", help:"FitSugar আপনার ডিভাইসে থাকা সবচেয়ে উপযুক্ত বাংলা কণ্ঠ নির্বাচন করে।",
      unsupported:"এই ব্রাউজারে অডিও নেই", unavailable:"এই ডিভাইসে ভয়েস গাইড নেই।",
      nothing:"এই স্ক্রিনে পড়ার মতো তথ্য নেই", playing:"অডিও চলছে…", finished:"শেষ হয়েছে। আবার শোনার জন্য প্রস্তুত।",
      starting:"অডিও শুরু হচ্ছে…", stopped:"অডিও বন্ধ হয়েছে", paused:"অডিও বিরতিতে আছে", none:"কোনো অডিও চলছে না",
      failed:"বাংলা কণ্ঠ চালানো যায়নি",
      screens:{
        home:"FitSugar Pro হোম। আজকের ব্যায়াম, গ্লুকোজ, পানি, পদক্ষেপ এবং খাবারের পরিকল্পনা দেখুন।",
        workouts:"ব্যায়াম লাইব্রেরি। বয়স অনুযায়ী ব্যায়াম বেছে নিয়ে নির্দেশিকা শুরু করুন।",
        nutrition:"পুষ্টি। ভারতীয় রাজ্য বা কেন্দ্রশাসিত অঞ্চল বেছে নিয়ে আঞ্চলিক খাবার ও বিকল্প দেখুন।",
        progress:"অগ্রগতি। ওজন, বি এম আই, গ্লুকোজ এবং ব্যায়ামের কার্যক্রম দেখুন।",
        health:"স্বাস্থ্য কেন্দ্র। উচ্চতা, ওজন, বয়স, বি এম আই, গ্লুকোজ, পানি, পদক্ষেপ এবং ছবি নথিভুক্ত করুন।",
        coach:"ব্যায়াম, পুষ্টি এবং নিরাপদ স্বাস্থ্য অভ্যাস সম্পর্কে FitSugar কোচকে জিজ্ঞাসা করুন।",
        restart:"ফিটনেস পুনরায় শুরু পরিকল্পনা। বিরতির সময় অনুযায়ী নিরাপদ সাপ্তাহিক পরিকল্পনা তৈরি করুন।",
        business:"জিম ব্যবস্থাপনা। সদস্যপদ, সদস্য, পেমেন্ট, বিক্রয় এবং ব্যবসার প্রতিবেদন দেখুন।"
      },
      cards:{
        workout:"ব্যায়াম নির্দেশিকা। শুরু করার আগে ধাপ, পুনরাবৃত্তি এবং নিরাপত্তা নির্দেশ দেখুন।",
        meal:"খাবার নির্দেশিকা। সময়, ক্যালোরি, প্রোটিন এবং বিকল্প খাবার দেখুন।",
        protein:"প্রোটিন পরামর্শ। পরিমাণ দেখুন এবং প্রয়োজন হলে বিকল্প বেছে নিন।",
        coach:"FitSugar কোচের নির্দেশনা। আপনার স্বাস্থ্য অবস্থা এবং প্রশিক্ষকের পরামর্শের সঙ্গে অনুসরণ করুন।",
        modal:"এগিয়ে যাওয়ার আগে এই নির্দেশনা এবং উপলব্ধ কাজটি দেখুন।"
      }
    },
    mr: {
      title:"आवाज मार्गदर्शक", audio:"मराठी ऑडिओ", ready:"ऐकण्यासाठी तयार", languageReady:"मराठीत ऐकण्यासाठी तयार",
      read:"ही स्क्रीन वाचा", hear:"स्क्रीनवरील माहिती ऐका", pause:"विराम", resume:"पुढे सुरू करा", stop:"थांबवा",
      speed:"वाचनाचा वेग", help:"FitSugar तुमच्या उपकरणावर उपलब्ध असलेला योग्य मराठी आवाज निवडते.",
      unsupported:"या ब्राउझरमध्ये ऑडिओ उपलब्ध नाही", unavailable:"या उपकरणावर आवाज मार्गदर्शक उपलब्ध नाही.",
      nothing:"या स्क्रीनवर वाचण्यासाठी माहिती नाही", playing:"ऑडिओ सुरू आहे…", finished:"पूर्ण झाले. पुन्हा ऐकण्यासाठी तयार.",
      starting:"ऑडिओ सुरू होत आहे…", stopped:"ऑडिओ थांबवला", paused:"ऑडिओ विरामावर आहे", none:"कोणताही ऑडिओ सुरू नाही",
      failed:"मराठी आवाज चालवता आला नाही",
      screens:{
        home:"FitSugar Pro मुख्यपृष्ठ. आजचा व्यायाम, ग्लुकोज, पाणी, पावले आणि आहार योजना पहा.",
        workouts:"व्यायाम संग्रह. तुमच्या वयानुसार व्यायाम निवडा आणि मार्गदर्शक सुरू करा.",
        nutrition:"पोषण. भारतीय राज्य किंवा केंद्रशासित प्रदेश निवडून प्रादेशिक आहार आणि पर्याय पहा.",
        progress:"प्रगती. वजन, बी एम आय, ग्लुकोज आणि व्यायाम क्रिया पहा.",
        health:"आरोग्य केंद्र. उंची, वजन, वय, बी एम आय, ग्लुकोज, पाणी, पावले आणि फोटो नोंदवा.",
        coach:"व्यायाम, पोषण आणि सुरक्षित आरोग्य सवयींबद्दल FitSugar कोचला विचारा.",
        restart:"फिटनेस पुन्हा सुरू करण्याची योजना. तुमच्या विश्रांतीनुसार सुरक्षित साप्ताहिक योजना तयार करा.",
        business:"जिम व्यवस्थापन. सदस्यत्व, सदस्य, देयके, विक्री आणि व्यवसाय अहवाल पहा."
      },
      cards:{
        workout:"व्यायाम मार्गदर्शन. सुरू करण्यापूर्वी टप्पे, पुनरावृत्ती आणि सुरक्षा सूचना पहा.",
        meal:"आहार मार्गदर्शन. वेळ, कॅलरी, प्रथिने आणि पर्यायी पदार्थ पहा.",
        protein:"प्रथिनांची सूचना. प्रमाण पहा आणि गरज असल्यास पर्याय निवडा.",
        coach:"FitSugar कोच मार्गदर्शन. तुमची आरोग्य स्थिती आणि प्रशिक्षकाच्या सल्ल्यासह पालन करा.",
        modal:"पुढे जाण्यापूर्वी हे मार्गदर्शन आणि उपलब्ध कृती पहा."
      }
    },
    gu: {
      title:"વૉઇસ માર્ગદર્શિકા", audio:"ગુજરાતી ઑડિયો", ready:"સાંભળવા તૈયાર", languageReady:"ગુજરાતીમાં સાંભળવા તૈયાર",
      read:"આ સ્ક્રીન વાંચો", hear:"સ્ક્રીનની માહિતી સાંભળો", pause:"વિરામ", resume:"ચાલુ રાખો", stop:"બંધ કરો",
      speed:"વાંચવાની ઝડપ", help:"FitSugar તમારા ઉપકરણમાં ઉપલબ્ધ યોગ્ય ગુજરાતી અવાજ પસંદ કરે છે.",
      unsupported:"આ બ્રાઉઝરમાં ઑડિયો ઉપલબ્ધ નથી", unavailable:"આ ઉપકરણમાં વૉઇસ માર્ગદર્શિકા ઉપલબ્ધ નથી.",
      nothing:"આ સ્ક્રીનમાં વાંચવા માટે માહિતી નથી", playing:"ઑડિયો ચાલી રહ્યો છે…", finished:"પૂર્ણ થયું. ફરી સાંભળવા તૈયાર.",
      starting:"ઑડિયો શરૂ થઈ રહ્યો છે…", stopped:"ઑડિયો બંધ થયો", paused:"ઑડિયો વિરામ પર છે", none:"કોઈ ઑડિયો ચાલી રહ્યો નથી",
      failed:"ગુજરાતી અવાજ ચલાવી શકાયો નથી",
      screens:{
        home:"FitSugar Pro હોમ. આજની કસરત, ગ્લુકોઝ, પાણી, પગલાં અને ભોજન યોજના જુઓ.",
        workouts:"કસરત લાઇબ્રેરી. તમારી ઉંમર પ્રમાણે કસરત પસંદ કરીને માર્ગદર્શિકા શરૂ કરો.",
        nutrition:"પોષણ. ભારતીય રાજ્ય અથવા કેન્દ્રશાસિત પ્રદેશ પસંદ કરીને પ્રાદેશિક ભોજન અને વિકલ્પો જુઓ.",
        progress:"પ્રગતિ. વજન, બી એમ આઈ, ગ્લુકોઝ અને કસરત પ્રવૃત્તિ જુઓ.",
        health:"આરોગ્ય કેન્દ્ર. ઊંચાઈ, વજન, ઉંમર, બી એમ આઈ, ગ્લુકોઝ, પાણી, પગલાં અને ફોટા નોંધો.",
        coach:"કસરત, પોષણ અને સલામત આરોગ્ય આદતો વિશે FitSugar કોચને પૂછો.",
        restart:"ફિટનેસ ફરી શરૂ કરવાની યોજના. તમારા વિરામ પ્રમાણે સલામત સાપ્તાહિક યોજના બનાવો.",
        business:"જિમ વ્યવસ્થાપન. સભ્યપદ, સભ્યો, ચુકવણી, વેચાણ અને વ્યવસાય અહેવાલ જુઓ."
      },
      cards:{
        workout:"કસરત માર્ગદર્શન. શરૂ કરતાં પહેલાં પગલાં, પુનરાવર્તન અને સલામતી સૂચનાઓ જુઓ.",
        meal:"ભોજન માર્ગદર્શન. સમય, કેલરી, પ્રોટીન અને વૈકલ્પિક ખોરાક જુઓ.",
        protein:"પ્રોટીન સૂચન. માત્રા જુઓ અને જરૂર હોય તો વિકલ્પ પસંદ કરો.",
        coach:"FitSugar કોચ માર્ગદર્શન. તમારી આરોગ્ય સ્થિતિ અને ટ્રેનરની સલાહ સાથે અનુસરો.",
        modal:"આગળ વધતાં પહેલાં આ માર્ગદર્શન અને ઉપલબ્ધ ક્રિયા જુઓ."
      }
    }
  };

  function code() { return copy[FitSugarI18n.code] ? FitSugarI18n.code : "en"; }
  function locale() { return locales[code()] || locales.en; }
  function words() { return copy[code()] || copy.en; }
  function engine() { return synthesis || (synthesis = window.speechSynthesis); }
  function setStatus(message, playing = false) {
    status.textContent = message;
    pulse.classList.toggle("playing", playing);
    trigger.classList.toggle("playing", playing);
    document.documentElement.dataset.audioState = playing ? "playing" : "ready";
  }
  function updateLocale() {
    const text = words();
    localeLabel.textContent = text.audio;
    panel.querySelector(".audio-panel-head b").textContent = text.title;
    readPage.querySelector("b").textContent = text.read;
    readPage.querySelector("small").textContent = text.hear;
    pause.querySelector("small").textContent = text.pause;
    stop.querySelector("small").textContent = text.stop;
    panel.querySelector(".audio-speed span").textContent = text.speed;
    panel.querySelector(".audio-help").textContent = text.help;
    panel.setAttribute("aria-label", text.title);
    trigger.setAttribute("aria-label", text.title);
    document.documentElement.dataset.audioLanguage = code();
    document.documentElement.dataset.audioLocale = locale()[0];
  }
  function cleanText(text) {
    return String(text || "").replace(/[◷⚡●✓⌁◇♙✦→＋■Ⅱ]/g, " ").replace(/\s+/g, " ").trim();
  }
  function closestVoice() {
    const voices = engine()?.getVoices?.() || [];
    const selectedLocale = locale()[0].toLowerCase();
    const base = selectedLocale.split("-")[0];
    return voices.find(voice => voice.lang.toLowerCase() === selectedLocale)
      || voices.find(voice => voice.lang.toLowerCase().split("-")[0] === base);
  }
  function updateVoiceDiagnostic() {
    if (builtInAudio[code()]) {
      document.documentElement.dataset.audioVoice = `built-in|${locale()[0]}`;
      return;
    }
    const voice = closestVoice();
    document.documentElement.dataset.audioVoice = voice ? `${voice.name}|${voice.lang}` : `system|${locale()[0]}`;
  }
  function audioSupported() {
    return Boolean(builtInAudio[code()] ? "Audio" in window : "speechSynthesis" in window && window.SpeechSynthesisUtterance);
  }
  function syncSupport() {
    const supported = audioSupported();
    trigger.disabled = !supported;
    trigger.title = supported ? words().title : words().unavailable;
    return supported;
  }
  function stopBuiltIn(reset = true) {
    if (!fallbackAudio) return;
    fallbackAudio.pause();
    if (reset) {
      try { fallbackAudio.currentTime = 0; } catch (error) {}
    }
    fallbackAudio = null;
  }
  function playBuiltIn(assetKey, textPack) {
    const source = builtInAudio[code()]?.[assetKey || "generic"];
    if (!source || !("Audio" in window)) return false;
    if (synthesis) synthesis.cancel();
    stopBuiltIn();
    fallbackAudio = new Audio(source);
    fallbackAudio.preload = "auto";
    fallbackAudio.playbackRate = Number(speed.value);
    fallbackAudio.onplay = () => setStatus(textPack.playing, true);
    fallbackAudio.onended = () => { fallbackAudio = null; setStatus(textPack.finished); };
    fallbackAudio.onerror = () => { fallbackAudio = null; setStatus(textPack.failed); };
    setStatus(textPack.starting, true);
    fallbackAudio.play().catch(() => {
      fallbackAudio = null;
      setStatus(textPack.failed);
    });
    return true;
  }
  function speak(text, assetKey) {
    const textPack = words();
    const content = cleanText(text).slice(0, 2600);
    if (playBuiltIn(assetKey, textPack)) return;
    if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
      setStatus(textPack.unsupported);
      toast(textPack.unavailable);
      return;
    }
    if (!content) {
      setStatus(textPack.nothing);
      return;
    }
    const activeEngine = engine();
    stopBuiltIn();
    activeEngine.cancel();
    utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = locale()[0];
    utterance.rate = Number(speed.value);
    utterance.pitch = 1;
    const voice = closestVoice();
    if (voice) utterance.voice = voice;
    updateVoiceDiagnostic();
    utterance.onstart = () => setStatus(textPack.playing, true);
    utterance.onend = () => setStatus(textPack.finished);
    utterance.onerror = event => {
      if (event.error !== "canceled" && event.error !== "interrupted") setStatus(textPack.failed);
      else setStatus(textPack.stopped);
    };
    setStatus(textPack.starting, true);
    activeEngine.speak(utterance);
  }
  function visibleScreenText() {
    const active = document.querySelector(".view.active");
    if (!active) return "";
    if (code() !== "en") {
      const view = active.id.replace(/View$/, "");
      return words().screens[view] || words().screens.business;
    }
    const items = active.querySelectorAll("h1,h2,h3,p,.tag,.eyebrow,.timeline-item>span,.meal-macros");
    return [...items].filter(element => element.offsetParent !== null && !element.closest(".alternatives-panel,.protein-panel"))
      .map(element => element.textContent.trim()).filter(Boolean).join(". ");
  }
  function activeScreenKey() {
    const view = document.querySelector(".view.active")?.id.replace(/View$/, "") || "home";
    return words().screens[view] ? view : "business";
  }
  function cardAssetKey(button) {
    const container = button.closest(".modal,.message,article");
    if (!container) return "generic";
    if (container.classList.contains("workout-card")) return "card-workout";
    if (container.classList.contains("timeline-item")) return "card-meal";
    if (container.classList.contains("protein-card")) return "card-protein";
    if (container.classList.contains("message")) return "card-coach";
    return "card-modal";
  }
  function cardText(button) {
    const container = button.closest(".modal,.message,article");
    if (!container) return "";
    if (code() !== "en") {
      const cards = words().cards;
      if (container.classList.contains("workout-card")) return cards.workout;
      if (container.classList.contains("timeline-item")) return cards.meal;
      if (container.classList.contains("protein-card")) return cards.protein;
      if (container.classList.contains("message")) return cards.coach;
      return cards.modal;
    }
    return [...container.querySelectorAll("h1,h2,h3,p,.tag,.meal-macros")]
      .filter(element => element.offsetParent !== null && !element.closest(".alternatives-panel,.protein-panel"))
      .map(element => element.textContent.trim()).filter(Boolean).join(". ");
  }
  function togglePanel() {
    const open = panel.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(open));
    return open;
  }

  trigger.onclick = togglePanel;
  close.addEventListener("click", () => {
    panel.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  });
  readPage.addEventListener("click", () => speak(visibleScreenText(), activeScreenKey()));
  pause.addEventListener("click", () => {
    const text = words();
    if (fallbackAudio) {
      if (fallbackAudio.paused) {
        fallbackAudio.play();
        pause.querySelector("small").textContent = text.pause;
        setStatus(text.playing, true);
      } else {
        fallbackAudio.pause();
        pause.querySelector("small").textContent = text.resume;
        setStatus(text.paused);
      }
      return;
    }
    const activeEngine = engine();
    if (!activeEngine?.speaking && !activeEngine?.paused) return setStatus(text.none);
    if (activeEngine.paused) {
      activeEngine.resume();
      pause.querySelector("small").textContent = text.pause;
      setStatus(text.playing, true);
    } else {
      activeEngine.pause();
      pause.querySelector("small").textContent = text.resume;
      setStatus(text.paused);
    }
  });
  stop.addEventListener("click", () => {
    if (synthesis) synthesis.cancel();
    stopBuiltIn();
    pause.querySelector("small").textContent = words().pause;
    setStatus(words().stopped);
  });
  speed.addEventListener("input", () => {
    speedOutput.value = `${speed.value}×`;
    if (fallbackAudio) fallbackAudio.playbackRate = Number(speed.value);
  });
  document.addEventListener("click", event => {
    const cardButton = event.target.closest(".speak-card");
    if (cardButton) speak(cardText(cardButton), cardAssetKey(cardButton));
    const nearby = event.target.closest(".speak-nearby");
    if (nearby) speak(code() === "en" ? nearby.closest(".message")?.querySelector("p")?.textContent || "" : words().cards.coach, "card-coach");
  });
  window.addEventListener("fitsugar:language", () => {
    if (synthesis) synthesis.cancel();
    stopBuiltIn();
    updateLocale();
    updateVoiceDiagnostic();
    setStatus(syncSupport() ? words().languageReady : words().unsupported);
  });

  updateLocale();
  setStatus(words().ready);
  window.FitSugarAudio = {
    speak,
    stop: () => { if (synthesis) synthesis.cancel(); stopBuiltIn(); setStatus(words().stopped); },
    readScreen: () => speak(visibleScreenText(), activeScreenKey()),
    toggle: togglePanel,
    get language(){ return code(); },
    get locale(){ return locale()[0]; },
    get voice(){ return closestVoice()?.name || null; },
    get supported(){ return audioSupported(); }
  };
  document.documentElement.dataset.audioReady = "true";
  if ("speechSynthesis" in window) engine().addEventListener?.("voiceschanged", updateVoiceDiagnostic);
  updateVoiceDiagnostic();
  if (!syncSupport()) {
    setStatus(words().unsupported);
  }
})();
