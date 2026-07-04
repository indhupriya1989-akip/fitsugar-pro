(function(){
  const DAY=86400000;
  const coachMessage="Welcome back! Since you took a break, we will restart safely with a light plan and gradually increase intensity.";
  const defaultRestart={
    lastWorkoutDate:new Date(Date.now()-(32*DAY)).toISOString().slice(0,10),
    weight:"74.2",
    goal:"Build strength",
    healthChanges:"",
    injuryStatus:"none",
    medicalStatus:"none"
  };
  let restartData=defaultRestart;
  try{restartData={...defaultRestart,...JSON.parse(localStorage.getItem("fitsugar-restart-profile")||"{}")}}catch(error){localStorage.removeItem("fitsugar-restart-profile")}

  function escapeHtml(value){
    return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  function daysSince(dateValue){
    const date=new Date(`${dateValue}T00:00:00`);
    if(Number.isNaN(date.getTime()))return 0;
    return Math.max(0,Math.floor((Date.now()-date.getTime())/DAY));
  }
  function breakLabel(days){
    if(days<7)return `${days} day${days===1?"":"s"}`;
    if(days<30){const weeks=Math.floor(days/7);return `${weeks} week${weeks===1?"":"s"}`}
    if(days<365){const months=Math.floor(days/30);return `${months} month${months===1?"":"s"}`}
    const years=Math.floor(days/365);return `${years} year${years===1?"":"s"}`;
  }
  function restartRule(days){
    if(days<=3)return{key:"days",level:"Light continuation",title:"Continue your plan safely",summary:"Continue the same plan with a longer, light warm-up.",intensity:"90–100% of prior working level",needsHealth:false,days:["Day 1 · 10-minute mobility warm-up + usual plan","Day 2 · Easy walk or recovery","Day 3 · Usual plan with controlled effort"]};
    if(days<14)return{key:"week",level:"Reduced intensity",title:"Return at 80% intensity",summary:"Reduce workout intensity by 20% for the first week.",intensity:"80% of prior working level",needsHealth:false,days:["Day 1 · Full-body strength at 80%","Day 2 · 25-minute easy walk","Day 3 · Mobility and recovery","Day 4 · Strength at 80%","Day 5 · Easy cardio"]};
    if(days<60)return{key:"month",level:"Beginner reset",title:"One-week beginner reset",summary:"Use beginner-friendly workouts for one week before progressing.",intensity:"Light · 2 sets per exercise",needsHealth:false,days:["Day 1 · Goblet squat + chest press","Day 2 · 20-minute walk + stretch","Day 3 · Rest","Day 4 · Row + supported shoulder press","Day 5 · Incline walk","Weekend · Mobility or rest"]};
    if(days<150)return{key:"threeMonths",level:"Foundation restart",title:"Rebuild movement first",summary:"Restart with mobility, walking, stretching, and light strength training.",intensity:"Very light · conversational pace",needsHealth:false,days:["Day 1 · Mobility + 15-minute walk","Day 2 · Light full-body strength","Day 3 · Stretching and balance","Day 4 · 20-minute walk","Day 5 · Light strength","Weekend · Gentle activity or rest"]};
    if(days<365)return{key:"sixMonths",level:"Health-reviewed restart",title:"Health update before progression",summary:"Review weight, injuries, diabetes/BP status, and other health changes before training.",intensity:"Assessment first · very light",needsHealth:true,days:["Day 1 · Health check + mobility","Day 2 · 15-minute easy walk","Day 3 · Rest or stretching","Day 4 · Trainer-supervised light strength","Day 5 · Balance + mobility","Weekend · Recovery"]};
    return{key:"year",level:"Fresh beginner",title:"Start as a fresh beginner",summary:"Begin again with fundamentals and medical clearance when health risks apply.",intensity:"Beginner · supervised where possible",needsHealth:true,days:["Day 1 · Health and movement assessment","Day 2 · 10–15 minute walk","Day 3 · Mobility and balance","Day 4 · Trainer-supervised beginner strength","Day 5 · Rest","Weekend · Gentle walk and stretching"]};
  }
  function doctorAdvice(days){
    const text=restartData.healthChanges.toLowerCase();
    const risk=restartData.medicalStatus!=="none"||restartData.injuryStatus!=="none"||text.includes("pregnan")||(typeof selectedAgeGroup!=="undefined"&&selectedAgeGroup==="senior");
    return days>=365&&risk?"Doctor consultation recommended before restarting because a health risk or special condition was reported.":"Stop and seek qualified medical advice for chest pain, dizziness, unusual breathlessness, or worsening pain.";
  }
  function renderPlan(){
    const days=daysSince(restartData.lastWorkoutDate);
    const rule=restartRule(days);
    const output=document.getElementById("restartPlanOutput");
    output.innerHTML=`<span class="restart-welcome">↻ Welcome back</span><h2>${rule.title}</h2><p class="restart-coach">${coachMessage}</p><div class="restart-summary-grid"><span><small>LAST WORKOUT</small><b>${new Date(`${restartData.lastWorkoutDate}T00:00:00`).toLocaleDateString()}</b></span><span><small>BREAK DURATION</small><b>${breakLabel(days)}</b></span><span><small>CURRENT WEIGHT</small><b>${escapeHtml(restartData.weight)} kg</b></span><span><small>CURRENT GOAL</small><b>${escapeHtml(restartData.goal)}</b></span><span><small>RESTART LEVEL</small><b>${rule.level}</b></span><span><small>INTENSITY</small><b>${rule.intensity}</b></span></div><div class="health-summary"><b>Health changes</b><p>${escapeHtml(restartData.healthChanges||"No new health changes reported.")}</p></div><div class="safe-week"><b>Safe weekly plan</b>${rule.days.map(item=>`<span>✓ ${item}</span>`).join("")}</div><p class="restart-medical-note">♡ ${doctorAdvice(days)}</p>${days>=90?'<span class="trainer-alert-state" id="trainerAlertState">Trainer alert will be created when this plan is saved.</span>':""}`;
    renderHomeBanner(days,rule);
  }
  function renderHomeBanner(days,rule){
    const banner=document.getElementById("restartHomeBanner");
    if(days<1){banner.hidden=true;return}
    banner.hidden=false;
    banner.innerHTML=`<div><span>↻</span><div><b>Welcome back · ${breakLabel(days)} away</b><small>${rule.summary}</small></div></div><button class="btn btn-light btn-small" data-open-restart>View safe restart plan →</button>`;
  }
  function syncForm(){
    document.getElementById("lastWorkoutDate").value=restartData.lastWorkoutDate;
    document.getElementById("lastWorkoutDate").max=new Date().toISOString().slice(0,10);
    document.getElementById("restartWeight").value=restartData.weight;
    document.getElementById("restartGoal").value=restartData.goal;
    document.getElementById("healthChanges").value=restartData.healthChanges;
    document.getElementById("injuryStatus").value=restartData.injuryStatus;
    document.getElementById("medicalStatus").value=restartData.medicalStatus;
  }
  function readForm(){
    restartData={
      lastWorkoutDate:document.getElementById("lastWorkoutDate").value,
      weight:document.getElementById("restartWeight").value,
      goal:document.getElementById("restartGoal").value,
      healthChanges:document.getElementById("healthChanges").value.trim(),
      injuryStatus:document.getElementById("injuryStatus").value,
      medicalStatus:document.getElementById("medicalStatus").value
    };
  }
  function createTrainerAlert(days){
    const alerts=JSON.parse(localStorage.getItem("fitsugar-trainer-alerts")||"[]");
    alerts.unshift({id:`ALT-${Date.now()}`,member:document.getElementById("profileName").textContent,date:new Date().toISOString(),breakDuration:breakLabel(days),status:"New"});
    localStorage.setItem("fitsugar-trainer-alerts",JSON.stringify(alerts.slice(0,50)));
    const state=document.getElementById("trainerAlertState");
    if(state){state.textContent="✓ In-app trainer alert created";state.classList.add("sent")}
    window.dispatchEvent(new CustomEvent("fitsugar:trainer-alert"));
  }
  document.getElementById("restartForm").addEventListener("input",event=>{
    readForm();
    const healthField=document.getElementById("healthChanges");
    healthField.required=restartRule(daysSince(restartData.lastWorkoutDate)).needsHealth;
    renderPlan();
  });
  document.getElementById("restartForm").addEventListener("submit",event=>{
    event.preventDefault();
    readForm();
    const days=daysSince(restartData.lastWorkoutDate);
    const rule=restartRule(days);
    if(rule.needsHealth&&!restartData.healthChanges){
      const field=document.getElementById("healthChanges");
      field.setCustomValidity("Please enter a health update or type “No changes” after a break of six months or more.");
      field.reportValidity();
      field.addEventListener("input",()=>field.setCustomValidity(""),{once:true});
      return;
    }
    localStorage.setItem("fitsugar-restart-profile",JSON.stringify(restartData));
    renderPlan();
    if(days>=90&&document.getElementById("trainerAlertConsent").checked)createTrainerAlert(days);
    document.getElementById("coachWelcome").textContent=coachMessage;
    toast("Safe restart plan saved.");
  });
  document.addEventListener("click",event=>{
    if(event.target.closest("[data-open-restart]"))showView("restart");
  });
  window.FitSugarRestart={
    openForMember(member){
      restartData={...restartData,lastWorkoutDate:member.lastWorkout||restartData.lastWorkoutDate,goal:member.goal||restartData.goal};
      syncForm();renderPlan();showView("restart");
    },
    breakDays:daysSince,
    breakLabel,
    rule:restartRule
  };
  syncForm();
  renderPlan();
})();
