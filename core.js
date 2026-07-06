(function(){
  const KEYS={
    account:"fitsugar-core-account",
    profile:"fitsugar-health-profile",
    glucose:"fitsugar-glucose-log",
    activity:"fitsugar-daily-activity",
    photos:"fitsugar-progress-photos"
  };
  const defaults={
    profile:{height:170,weight:74.2,age:32,goal:"loss"},
    activity:{water:1600,waterGoal:2500,steps:6842,stepGoal:8000,reminder:0}
  };
  let account=load(KEYS.account,null);
  let healthProfile={...defaults.profile,...load(KEYS.profile,{})};
  let glucoseLog=load(KEYS.glucose,[{id:"G-SEED",reading:112,context:"Before meal",date:new Date().toISOString()}]);
  let activity={...defaults.activity,...load(KEYS.activity,{})};
  let photos=load(KEYS.photos,[]);
  let waterTimer=null;
  let motionConnected=false;
  let lastMotionStep=0;

  function load(key,fallback){
    try{const value=JSON.parse(localStorage.getItem(key)||"null");return value??fallback}catch(error){return fallback}
  }
  function save(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));return true}catch(error){toast("This device has no more storage space.");return false}
  }
  function escapeHtml(value){
    return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  function bmi(){
    const metres=Number(healthProfile.height)/100;
    return metres>0?Number(healthProfile.weight)/(metres*metres):0;
  }
  function bmiCategory(value){
    if(value<18.5)return"Below the usual range";
    if(value<25)return"Within the usual range";
    if(value<30)return"Above the usual range";
    return"High range";
  }
  function goalName(goal){
    return{loss:"Weight loss",gain:"Weight gain",maintain:"Maintain weight",glucose:"Improve glucose control"}[goal]||"General fitness";
  }
  function goalPlan(){
    const plans={
      loss:{title:"Steady weight-loss plan",text:"3 full-body strength days, 2 brisk walking days, protein at each meal, and a modest calorie deficit.",workouts:["Goblet Squat","Dumbbell Chest Press","Incline Walking"]},
      gain:{title:"Healthy weight-gain plan",text:"3–4 progressive strength days, regular meals, adequate protein, and a small calorie surplus.",workouts:["Dumbbell Chest Press","Goblet Squat","Single-arm Row"]},
      maintain:{title:"Maintenance plan",text:"3 varied strength days, 2 cardio days, and consistent meals, sleep, and hydration.",workouts:["Goblet Squat","Single-arm Row","Incline Walking"]},
      glucose:{title:"Glucose-support plan",text:"Strength training 2–3 days, short walks after meals, steady carbohydrate portions, and clinician-agreed glucose targets.",workouts:["Incline Walking","Goblet Squat","Dumbbell Chest Press"]}
    };
    return plans[healthProfile.goal]||plans.maintain;
  }
  function renderAccount(mode){
    const card=document.getElementById("accountCard");
    if(account&&!mode){
      const contact=account.provider==="phone"?account.phone:account.email;
      card.innerHTML=`<div class="core-card-head"><span>✓</span><div><b>Registered profile</b><small>${escapeHtml(account.providerLabel)} · device-local</small></div></div><div class="registered-account"><span>${escapeHtml((account.name||"F").slice(0,1).toUpperCase())}</span><div><b>${escapeHtml(account.name)}</b><small>${escapeHtml(contact)}</small></div></div><p class="local-account-note">This prototype profile is saved only on this device. Cloud sync and verified Google/OTP login require authentication credentials.</p><button class="btn btn-ghost" data-account-action="change">Change registration</button>`;
      return;
    }
    if(mode){
      const isPhone=mode==="phone";
      const isGoogle=mode==="google";
      card.innerHTML=`<div class="core-card-head"><span>♙</span><div><b>${isGoogle?"Google profile":isPhone?"Phone registration":"Email registration"}</b><small>Private device profile</small></div></div>${isGoogle?'<p class="provider-notice">Google cloud authentication needs a Google/Firebase Client ID. This saves a clearly labelled device preview without requesting your Google password.</p>':isPhone?'<p class="provider-notice">Phone OTP verification needs an SMS authentication service. This saves the number locally without sending an OTP.</p>':""}<form class="core-form registration-form" id="coreRegistrationForm"><input type="hidden" name="provider" value="${mode}"><label>Name<input name="name" required maxlength="50"></label>${isPhone?'<label>Phone number<input name="phone" type="tel" pattern="[0-9+() -]{8,18}" required></label>':'<label>Email<input name="email" type="email" required></label>'}<button class="btn btn-primary" type="submit">Create device profile</button><button class="btn btn-ghost" type="button" data-account-action="cancel">Cancel</button></form>`;
      return;
    }
    card.innerHTML=`<div class="core-card-head"><span>♙</span><div><b>User registration</b><small>Email, phone or Google profile</small></div></div><p class="local-account-note">Create a private device profile. No password is stored.</p><div class="provider-buttons"><button data-register-provider="email"><span>@</span>Email</button><button data-register-provider="phone"><span>☎</span>Phone</button><button data-register-provider="google"><span>G</span>Google</button></div>`;
  }
  function saveAccount(form){
    const data=new FormData(form);
    const provider=data.get("provider");
    account={
      name:String(data.get("name")||"").trim(),
      email:String(data.get("email")||"").trim(),
      phone:String(data.get("phone")||"").trim(),
      provider,
      providerLabel:provider==="google"?"Google preview":provider==="phone"?"Phone":"Email",
      createdAt:new Date().toISOString()
    };
    save(KEYS.account,account);
    try{
      userProfile={...userProfile,name:account.name};
      localStorage.setItem("fitsugar-profile-v2",JSON.stringify(userProfile));
      renderUserProfile();
    }catch(error){}
    renderAccount();
    renderRecommendation();
    toast("Device profile created.");
  }
  function syncBodyForm(){
    const form=document.getElementById("bodyProfileForm");
    form.elements.height.value=healthProfile.height;
    form.elements.weight.value=healthProfile.weight;
    form.elements.age.value=healthProfile.age;
    form.elements.goal.value=healthProfile.goal;
    renderMetrics();
  }
  function renderMetrics(){
    const value=bmi();
    const plan=goalPlan();
    document.getElementById("bmiResult").innerHTML=`<div><span>BMI</span><b>${value.toFixed(1)}</b><small>${bmiCategory(value)}</small></div><div><span>GOAL PLAN</span><b>${plan.title}</b><small>${plan.text}</small></div>`;
    document.getElementById("progressWeightValue").textContent=Number(healthProfile.weight).toFixed(1);
    document.getElementById("progressWeightNote").textContent=goalName(healthProfile.goal);
    document.getElementById("progressBmiValue").textContent=value.toFixed(1);
    document.getElementById("progressBmiNote").textContent=bmiCategory(value);
  }
  function saveBodyProfile(form){
    const data=new FormData(form);
    healthProfile={height:Number(data.get("height")),weight:Number(data.get("weight")),age:Number(data.get("age")),goal:data.get("goal")};
    save(KEYS.profile,healthProfile);
    const group=healthProfile.age<18?"teen":healthProfile.age<40?"adult":healthProfile.age<60?"midlife":"senior";
    const ageSelect=document.getElementById("ageGroupSelect");
    if(ageSelect.value!==group){ageSelect.value=group;ageSelect.dispatchEvent(new Event("change",{bubbles:true}))}
    renderMetrics();
    renderRecommendation();
    toast("Body profile and goal plan saved.");
  }
  function glucoseStatus(reading){
    if(reading<70)return{label:"Below common target",className:"warning"};
    if(reading<=180)return{label:"Within common target",className:"positive"};
    return{label:"Above common target",className:"warning"};
  }
  function renderGlucose(){
    glucoseLog.sort((a,b)=>new Date(b.date)-new Date(a.date));
    const latest=glucoseLog[0];
    const average=glucoseLog.length?Math.round(glucoseLog.reduce((sum,item)=>sum+Number(item.reading),0)/glucoseLog.length):0;
    const status=latest?glucoseStatus(Number(latest.reading)):null;
    document.getElementById("glucoseSummary").innerHTML=latest?`<div><b>${latest.reading}</b><span>mg/dL<small>${escapeHtml(latest.context)}</small></span></div><em class="${status.className}">${status.label}</em>`:'<p>No readings yet.</p>';
    document.getElementById("glucoseHistory").innerHTML=glucoseLog.slice(0,5).map(item=>`<span><b>${item.reading}</b><small>${escapeHtml(item.context)} · ${new Date(item.date).toLocaleDateString()}</small></span>`).join("");
    if(latest){
      document.getElementById("homeGlucoseValue").textContent=latest.reading;
      document.getElementById("homeGlucoseContext").textContent=latest.context;
      document.getElementById("progressGlucoseValue").textContent=average;
      document.getElementById("progressGlucoseNote").textContent=`Average of ${glucoseLog.length} reading${glucoseLog.length===1?"":"s"}`;
      const homeStatus=document.querySelector(".glucose-card .status-dot");
      homeStatus.textContent=`● ${status.label}`;
    }
  }
  function saveGlucose(form){
    const data=new FormData(form);
    glucoseLog.unshift({id:`G-${Date.now()}`,reading:Number(data.get("reading")),context:data.get("context"),date:new Date().toISOString()});
    glucoseLog=glucoseLog.slice(0,100);
    save(KEYS.glucose,glucoseLog);
    form.reset();
    renderGlucose();
    renderRecommendation();
    toast("Glucose reading saved.");
  }
  function renderRecommendation(){
    const container=document.getElementById("smartRecommendation");
    const plan=goalPlan();
    const latest=glucoseLog[0];
    const restart=load("fitsugar-active-restart",null);
    const high=latest&&Number(latest.reading)>180;
    const ageNote=healthProfile.age>=60?"Use stable positions, balance work, and trainer support.":healthProfile.age<18?"Train with qualified adult supervision and focus on technique.":"Progress only while form stays controlled.";
    const safety=high?"Your latest glucose reading is above the common target shown in this app. Choose light walking or mobility and follow your clinician’s personalised advice.":restart?`${restart.level} is active, so prescriptions start around ${Math.round(restart.intensityFactor*100)}% effort.`:ageNote;
    container.innerHTML=`<span class="recommendation-label">AI WORKOUT RECOMMENDATION</span><h3>${plan.title}</h3><p>${plan.text}</p><div>${plan.workouts.map(name=>`<button data-exercise="${name}">${name} →</button>`).join("")}</div><small>♡ ${safety}</small>`;
  }
  function renderActivity(){
    activity.water=Math.max(0,Math.min(activity.waterGoal,Number(activity.water)||0));
    activity.steps=Math.max(0,Number(activity.steps)||0);
    document.getElementById("waterTrackerValue").textContent=`${activity.water} / ${activity.waterGoal} ml`;
    document.getElementById("stepTrackerValue").textContent=`${activity.steps.toLocaleString("en-IN")} / ${activity.stepGoal.toLocaleString("en-IN")}`;
    document.getElementById("waterReminderInterval").value=String(activity.reminder||0);
    document.getElementById("homeWaterValue").textContent=(activity.water/1000).toFixed(1);
    document.getElementById("homeWaterBar").style.width=`${Math.min(100,activity.water/activity.waterGoal*100)}%`;
    document.getElementById("homeStepsValue").textContent=activity.steps.toLocaleString("en-IN");
    document.getElementById("homeStepsBar").style.width=`${Math.min(100,activity.steps/activity.stepGoal*100)}%`;
  }
  function saveActivity(){
    save(KEYS.activity,activity);
    renderActivity();
  }
  function configureReminder(){
    clearInterval(waterTimer);
    waterTimer=null;
    if(!activity.reminder)return;
    waterTimer=setInterval(()=>{
      toast("Water reminder: take a few sips.");
      if("Notification" in window&&Notification.permission==="granted")new Notification("FitSugar Pro",{body:"Time to drink some water."});
    },activity.reminder*60000);
  }
  async function setReminder(minutes){
    activity.reminder=Number(minutes);
    if(activity.reminder&&"Notification" in window&&Notification.permission==="default"){
      try{await Notification.requestPermission()}catch(error){}
    }
    saveActivity();
    configureReminder();
    toast(activity.reminder?`Water reminder set for every ${activity.reminder} minutes.`:"Water reminder turned off.");
  }
  function motionStep(event){
    const acceleration=event.accelerationIncludingGravity;
    if(!acceleration)return;
    const magnitude=Math.sqrt((acceleration.x||0)**2+(acceleration.y||0)**2+(acceleration.z||0)**2);
    const now=Date.now();
    if(magnitude>12&&now-lastMotionStep>380){
      lastMotionStep=now;
      activity.steps+=1;
      saveActivity();
    }
  }
  async function connectMotion(){
    if(motionConnected)return;
    try{
      if(typeof DeviceMotionEvent!=="undefined"&&typeof DeviceMotionEvent.requestPermission==="function"){
        const permission=await DeviceMotionEvent.requestPermission();
        if(permission!=="granted")throw new Error("Motion permission denied");
      }
      if(!("DeviceMotionEvent" in window))throw new Error("Motion sensor unavailable");
      window.addEventListener("devicemotion",motionStep);
      motionConnected=true;
      document.getElementById("motionStatus").textContent="Phone motion connected · estimated steps";
      document.getElementById("connectMotionBtn").textContent="Motion connected";
      toast("Phone motion step estimate connected.");
    }catch(error){
      document.getElementById("motionStatus").textContent="Motion sensor unavailable · use manual entry";
      toast("Use manual steps on this device.");
    }
  }
  function renderPhotos(){
    const grid=document.getElementById("progressPhotoGrid");
    grid.innerHTML=photos.length?photos.map(photo=>`<article><img src="${photo.data}" alt="Progress photo from ${new Date(photo.date).toLocaleDateString()}"><div><small>${new Date(photo.date).toLocaleDateString()}</small><button data-delete-photo="${photo.id}" aria-label="Delete progress photo">×</button></div></article>`).join(""):'<p class="photo-empty">No progress photos yet.</p>';
  }
  function addPhoto(file){
    if(!file||!file.type.startsWith("image/"))return;
    const reader=new FileReader();
    reader.onload=()=>{
      const image=new Image();
      image.onload=()=>{
        const scale=Math.min(1,640/image.width);
        const canvas=document.createElement("canvas");
        canvas.width=Math.round(image.width*scale);
        canvas.height=Math.round(image.height*scale);
        canvas.getContext("2d").drawImage(image,0,0,canvas.width,canvas.height);
        const data=canvas.toDataURL("image/jpeg",.72);
        const next=[{id:`P-${Date.now()}`,date:new Date().toISOString(),data},...photos].slice(0,6);
        if(save(KEYS.photos,next)){photos=next;renderPhotos();toast("Progress photo saved privately on this device.")}
      };
      image.src=reader.result;
    };
    reader.readAsDataURL(file);
  }
  function renderVideos(){
    const videoItems=[
      {name:"Dumbbell Chest Press",image:"assets/workouts/dumbbell-chest-press.png",query:"dumbbell chest press proper form beginner"},
      {name:"Goblet Squat",image:"assets/workouts/goblet-squat.png",query:"goblet squat proper form beginner"},
      {name:"Incline Walking",image:"assets/workouts/incline-walking.png",query:"incline treadmill walking workout beginner"}
    ];
    document.getElementById("coreVideoGrid").innerHTML=videoItems.map(item=>`<a href="https://www.youtube.com/results?search_query=${encodeURIComponent(item.query)}" target="_blank" rel="noopener noreferrer"><img src="${item.image}" alt="${item.name}"><span>▶</span><b>${item.name}</b><small>Watch video demonstrations</small></a>`).join("");
  }
  document.getElementById("accountCard").addEventListener("click",event=>{
    const provider=event.target.closest("[data-register-provider]")?.dataset.registerProvider;
    const action=event.target.closest("[data-account-action]")?.dataset.accountAction;
    if(provider)renderAccount(provider);
    if(action==="cancel")renderAccount();
    if(action==="change"){account=null;localStorage.removeItem(KEYS.account);renderAccount()}
  });
  document.getElementById("accountCard").addEventListener("submit",event=>{
    if(event.target.id!=="coreRegistrationForm")return;
    event.preventDefault();
    saveAccount(event.target);
  });
  document.getElementById("bodyProfileForm").addEventListener("submit",event=>{event.preventDefault();saveBodyProfile(event.target)});
  document.getElementById("glucoseLogForm").addEventListener("submit",event=>{event.preventDefault();saveGlucose(event.target)});
  document.addEventListener("click",event=>{
    const water=event.target.closest("[data-water]")?.dataset.water;
    if(water){activity.water+=Number(water);saveActivity()}
    const photoId=event.target.closest("[data-delete-photo]")?.dataset.deletePhoto;
    if(photoId){photos=photos.filter(photo=>photo.id!==photoId);save(KEYS.photos,photos);renderPhotos();toast("Progress photo removed.")}
  });
  document.getElementById("waterReminderInterval").addEventListener("change",event=>setReminder(event.target.value));
  document.getElementById("manualStepsForm").addEventListener("submit",event=>{
    event.preventDefault();
    activity.steps+=Number(new FormData(event.target).get("steps"))||0;
    event.target.reset();
    saveActivity();
    toast("Steps added.");
  });
  document.getElementById("connectMotionBtn").addEventListener("click",connectMotion);
  document.getElementById("progressPhotoInput").addEventListener("change",event=>{addPhoto(event.target.files?.[0]);event.target.value=""});
  window.addEventListener("fitsugar:language",()=>renderAccount());
  renderAccount();
  syncBodyForm();
  renderGlucose();
  renderRecommendation();
  renderActivity();
  configureReminder();
  renderPhotos();
  renderVideos();
  window.FitSugarCore={bmi,goalPlan,renderRecommendation};
})();
