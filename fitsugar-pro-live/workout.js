(function(){
  const guides={
    "Dumbbell Chest Press":{
      equipment:"Flat bench · pair of light dumbbells",
      steps:[
        {title:"Warm up",cue:"Walk or march for 5 minutes, then make 10 slow arm circles in each direction."},
        {title:"Set your position",cue:"Lie back with feet planted. Hold the dumbbells above your chest with wrists straight."},
        {title:"Lower with control",cue:"Bend your elbows slightly below shoulder level. Take about 2 seconds to lower."},
        {title:"Press and breathe",cue:"Breathe out as you press up. Stop before the elbows lock, then repeat."},
        {title:"Cool down",cue:"Place the dumbbells down safely, sit up slowly, and stretch the chest gently."}
      ]
    },
    "Goblet Squat":{
      equipment:"One light dumbbell · clear floor space",
      steps:[
        {title:"Warm up",cue:"March for 3 minutes, then complete 8 chair sit-to-stands without weight."},
        {title:"Set your stance",cue:"Hold one dumbbell at your chest. Stand with feet around shoulder width."},
        {title:"Sit between the hips",cue:"Keep the chest tall. Let the knees track in the same direction as the toes."},
        {title:"Stand smoothly",cue:"Push the floor away, breathe out, and finish tall without leaning back."},
        {title:"Cool down",cue:"Walk slowly for 2 minutes and stretch the calves and front of the thighs."}
      ]
    },
    "Single-arm Row":{
      equipment:"Bench · one light dumbbell",
      steps:[
        {title:"Warm up",cue:"Walk for 4 minutes, then complete 10 gentle shoulder-blade squeezes."},
        {title:"Build a stable base",cue:"Support one hand and knee on the bench. Keep your back long and level."},
        {title:"Pull toward the hip",cue:"Lead with the elbow and keep the shoulder away from the ear."},
        {title:"Lower slowly",cue:"Straighten the arm without twisting your body, then repeat on both sides."},
        {title:"Cool down",cue:"Set the weight down safely and take 5 slow breaths with relaxed shoulders."}
      ]
    },
    "Shoulder Press":{
      equipment:"Supported bench · pair of light dumbbells",
      steps:[
        {title:"Warm up",cue:"Walk for 5 minutes, then make 8 controlled wall slides."},
        {title:"Sit with support",cue:"Plant both feet and keep your upper back against the bench."},
        {title:"Press overhead",cue:"Start with wrists over elbows and press without arching the lower back."},
        {title:"Return with control",cue:"Lower to a comfortable depth. Stop if the shoulder pinches or hurts."},
        {title:"Cool down",cue:"Relax the arms and stretch each shoulder gently across the body."}
      ]
    },
    "Incline Walking":{
      equipment:"Treadmill · supportive footwear",
      steps:[
        {title:"Start level",cue:"Walk for 5 minutes at a comfortable pace with the incline at 0–1%."},
        {title:"Raise gradually",cue:"Increase the incline by 1% at a time while you can still talk comfortably."},
        {title:"Hold steady",cue:"Stand tall, look forward, and let the arms swing instead of gripping the rails."},
        {title:"Check your effort",cue:"Keep the effort light to moderate. Reduce incline for dizziness or unusual breathlessness."},
        {title:"Cool down",cue:"Return to a level walk for 3–5 minutes before stepping off."}
      ]
    },
    "Battle Rope Flow":{
      equipment:"Anchored battle ropes · clear training lane",
      steps:[
        {title:"Warm up",cue:"Walk for 5 minutes and complete 10 easy bodyweight squats."},
        {title:"Find a stable stance",cue:"Hold one rope in each hand with a soft squat and a neutral spine."},
        {title:"Create alternating waves",cue:"Move one hand up as the other moves down. Keep the shoulders relaxed."},
        {title:"Use short rounds",cue:"Work for 20–30 seconds, then recover fully before the next round."},
        {title:"Cool down",cue:"Walk slowly until breathing settles and stretch the forearms gently."}
      ]
    },
    "Upper Body Strength":{
      equipment:"Bench · light dumbbells",
      image:"assets/workouts/dumbbell-chest-press.png",
      time:"Adjusted upper-body circuit",
      guide:"A guided chest press, row, and supported shoulder press circuit.",
      steps:[
        {title:"Warm up",cue:"Walk for 5–10 minutes, then complete arm circles and shoulder-blade squeezes."},
        {title:"Dumbbell chest press",cue:"Complete the adjusted prescription with feet planted and wrists straight."},
        {title:"Supported single-arm row",cue:"Keep the back neutral and pull the dumbbell toward the hip on each side."},
        {title:"Supported shoulder press",cue:"Use a light load, brace the core, and avoid arching the lower back."},
        {title:"Cool down",cue:"Walk for 3 minutes and stretch the chest, upper back, and shoulders gently."}
      ]
    }
  };
  let currentSession=null;

  function restartPlan(){
    try{return JSON.parse(localStorage.getItem("fitsugar-active-restart")||"null")}catch(error){return null}
  }
  function workoutByName(name){
    const workout=workouts.find(item=>item.name===name);
    if(workout)return workout;
    const guide=guides[name];
    return{name,level:"Beginner",time:guide?.time||"30 minutes",cal:"",desc:guide?.guide||"A controlled guided workout.",guide:guide?.guide||"Move slowly and stop for pain.",img:guide?.image||"assets/workouts/dumbbell-chest-press.png"};
  }
  function prescription(workout){
    return typeof adjustedWorkoutTime==="function"?adjustedWorkoutTime(workout,restartPlan()):workout.time;
  }
  function savedSession(){
    try{return JSON.parse(localStorage.getItem("fitsugar-workout-session")||"null")}catch(error){return null}
  }
  function sessionSteps(name){
    return guides[name]?.steps||[
      {title:"Warm up",cue:"Walk or march for 5 minutes and move the working joints gently."},
      {title:"Set up",cue:"Choose a light load and build a stable starting position."},
      {title:"Complete the exercise",cue:"Move with control, breathe normally, and stop before form changes."},
      {title:"Cool down",cue:"Walk slowly and stretch gently until breathing returns to normal."}
    ];
  }
  function openWorkout(name){
    const workout=workoutByName(name);
    const saved=savedSession();
    currentSession=saved&&saved.name===name?{...saved,workout,steps:sessionSteps(name)}:{name,workout,steps:sessionSteps(name),currentStep:0,startedAt:null};
    renderIntro();
    document.getElementById("modalBackdrop").classList.add("open");
  }
  function renderIntro(){
    const plan=restartPlan();
    const resume=currentSession.startedAt&&currentSession.currentStep<currentSession.steps.length;
    document.getElementById("modalContent").innerHTML=`<div class="guided-workout">
      <img class="guided-workout-image" src="${currentSession.workout.img}" alt="${currentSession.name} form demonstration">
      <div class="guided-workout-copy"><span class="eyebrow">${plan?"SAFE RESTART WORKOUT":"GUIDED WORKOUT"}</span><h2>${currentSession.name}</h2>
      <div class="guided-meta"><span>◷ ${prescription(currentSession.workout)}</span><span>● ${currentSession.workout.level}</span></div>
      ${plan?`<div class="session-restart-note">↻ ${plan.level} · Start at ${Math.round(plan.intensityFactor*100)}% effort</div>`:""}
      <p>${currentSession.workout.guide}</p><div class="session-equipment"><b>Equipment</b><span>${guides[currentSession.name]?.equipment||"Comfortable training space"}</span></div>
      <div class="session-safety">♡ Stop for pain, chest discomfort, dizziness, or unusual breathlessness.</div>
      <button class="btn btn-primary session-main-action" data-workout-action="${resume?"resume":"start"}">${resume?"Resume workout":"Start guided workout"}</button></div>
    </div>`;
  }
  function renderActive(){
    const total=currentSession.steps.length;
    const index=Math.min(currentSession.currentStep,total-1);
    const step=currentSession.steps[index];
    const progress=Math.round((index/total)*100);
    const elapsed=Math.max(1,Math.round((Date.now()-currentSession.startedAt)/60000));
    document.getElementById("modalContent").innerHTML=`<div class="guided-session-active">
      <span class="eyebrow">STEP ${index+1} OF ${total}</span><div class="session-progress"><i style="width:${progress}%"></i></div>
      <div class="session-active-head"><div><h2>${currentSession.name}</h2><small>${elapsed} min elapsed · ${prescription(currentSession.workout)}</small></div><span>${progress}%</span></div>
      <div class="session-current-step"><span>${index+1}</span><div><h3>${step.title}</h3><p>${step.cue}</p></div></div>
      <div class="session-step-list">${currentSession.steps.map((item,itemIndex)=>`<span class="${itemIndex<index?"done":itemIndex===index?"current":""}">${itemIndex<index?"✓":itemIndex+1} ${item.title}</span>`).join("")}</div>
      <div class="session-actions"><button class="btn btn-ghost" data-workout-action="previous" ${index===0?"disabled":""}>← Previous</button><button class="btn btn-primary" data-workout-action="next">${index===total-1?"Finish workout":"Complete step →"}</button></div>
      <button class="session-stop" data-workout-action="stop">Pause and close</button>
    </div>`;
  }
  function startSession(){
    if(!currentSession.startedAt)currentSession.startedAt=Date.now();
    localStorage.setItem("fitsugar-workout-session",JSON.stringify({...currentSession,workout:undefined,steps:undefined}));
    renderActive();
  }
  function nextStep(){
    if(currentSession.currentStep>=currentSession.steps.length-1){completeWorkout();return}
    currentSession.currentStep+=1;
    localStorage.setItem("fitsugar-workout-session",JSON.stringify({...currentSession,workout:undefined,steps:undefined}));
    renderActive();
  }
  function previousStep(){
    currentSession.currentStep=Math.max(0,currentSession.currentStep-1);
    localStorage.setItem("fitsugar-workout-session",JSON.stringify({...currentSession,workout:undefined,steps:undefined}));
    renderActive();
  }
  function completeWorkout(){
    const duration=Math.max(1,Math.round((Date.now()-currentSession.startedAt)/60000));
    const history=JSON.parse(localStorage.getItem("fitsugar-workout-history")||"[]");
    history.unshift({id:`W-${Date.now()}`,name:currentSession.name,date:new Date().toISOString(),durationMinutes:duration,prescription:prescription(currentSession.workout),restartLevel:restartPlan()?.level||null});
    localStorage.setItem("fitsugar-workout-history",JSON.stringify(history.slice(0,100)));
    localStorage.removeItem("fitsugar-workout-session");
    const restart=restartPlan();
    if(restart){
      restart.completedSessions=(restart.completedSessions||0)+1;
      localStorage.setItem("fitsugar-active-restart",JSON.stringify(restart));
    }
    try{
      const restartProfile=JSON.parse(localStorage.getItem("fitsugar-restart-profile")||"{}");
      restartProfile.lastWorkoutDate=new Date().toISOString().slice(0,10);
      localStorage.setItem("fitsugar-restart-profile",JSON.stringify(restartProfile));
    }catch(error){}
    document.getElementById("modalContent").innerHTML=`<div class="workout-complete"><span>✓</span><h2>Workout complete</h2><p>${currentSession.name} was saved to your activity history.</p><div><b>${duration} min</b><small>${restart?`${restart.completedSessions} restart workouts completed`:"Consistency is building"}</small></div><button class="btn btn-primary" data-workout-action="close">Done</button></div>`;
    renderHistory();
    window.dispatchEvent(new CustomEvent("fitsugar:workout-completed",{detail:{name:currentSession.name,duration}}));
  }
  function renderHistory(){
    const list=document.getElementById("workoutHistoryList");
    if(!list)return;
    let history=[];
    try{history=JSON.parse(localStorage.getItem("fitsugar-workout-history")||"[]")}catch(error){}
    list.innerHTML=history.length?history.slice(0,6).map(item=>`<article><span>✓</span><div><b>${item.name}</b><small>${new Date(item.date).toLocaleDateString()} · ${item.prescription}</small></div><strong>${item.durationMinutes} min</strong></article>`).join(""):'<p class="history-empty">Complete a guided workout and it will appear here.</p>';
  }
  document.addEventListener("click",event=>{
    const exercise=event.target.closest("[data-exercise]");
    const hero=event.target.closest("[data-action='start-workout']");
    const action=event.target.closest("[data-workout-action]")?.dataset.workoutAction;
    if(exercise||hero){
      event.preventDefault();
      event.stopImmediatePropagation();
      openWorkout(exercise?.dataset.exercise||"Upper Body Strength");
      return;
    }
    if(!action)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if(action==="start"||action==="resume")startSession();
    if(action==="next")nextStep();
    if(action==="previous")previousStep();
    if(action==="stop"){
      localStorage.setItem("fitsugar-workout-session",JSON.stringify({...currentSession,workout:undefined,steps:undefined}));
      document.getElementById("modalBackdrop").classList.remove("open");
      toast("Workout paused. Open it again to resume.");
    }
    if(action==="close")document.getElementById("modalBackdrop").classList.remove("open");
  },true);
  window.FitSugarWorkouts={open:openWorkout};
  renderHistory();
  const workoutRequest=new URLSearchParams(location.search).get("workout");
  if(workoutRequest&&(guides[workoutRequest]||workouts.some(item=>item.name===workoutRequest))){
    openWorkout(workoutRequest);
    if(new URLSearchParams(location.search).get("autostart")==="1")startSession();
  }
})();
