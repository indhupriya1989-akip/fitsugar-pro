const workouts = [
  {name:"Dumbbell Chest Press",group:"chest",level:"Beginner",time:"3 × 12 reps",cal:"85 kcal",desc:"A stable chest builder with easy-to-follow form cues.",img:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"},
  {name:"Goblet Squat",group:"legs",level:"Beginner",time:"4 × 10 reps",cal:"110 kcal",desc:"Build leg strength while keeping your torso upright.",img:"https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80"},
  {name:"Single-arm Row",group:"back",level:"Intermediate",time:"3 × 12 reps",cal:"90 kcal",desc:"Strong back and posture, one controlled pull at a time.",img:"https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=800&q=80"},
  {name:"Shoulder Press",group:"shoulders",level:"Intermediate",time:"3 × 10 reps",cal:"76 kcal",desc:"A seated press for strong, stable shoulders.",img:"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80"},
  {name:"Incline Walking",group:"full",level:"Beginner",time:"25 minutes",cal:"180 kcal",desc:"Low-impact cardio ideal for steady glucose support.",img:"https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80"},
  {name:"Battle Rope Flow",group:"arms",level:"Advanced",time:"8 × 30 sec",cal:"220 kcal",desc:"High-energy conditioning for arms, core and lungs.",img:"https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80"}
];
const meals = [
  {time:"BREAKFAST · 8:00",key:"meal1",cal:"340",protein:"18g"},
  {time:"MID-MORNING · 11:00",key:"meal2",cal:"190",protein:"10g"},
  {time:"LUNCH · 1:00",key:"meal3",cal:"480",protein:"24g"},
  {time:"EVENING · 4:30",key:"meal4",cal:"210",protein:"12g"},
  {time:"DINNER · 7:30",key:"meal5",cal:"410",protein:"22g"}
];
const proteins = [
  {key:"drink1",meta:"18g protein · low sugar",img:"https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=700&q=80"},
  {key:"drink2",meta:"26g protein · post-workout",img:"https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=700&q=80"},
  {key:"drink3",meta:"8g protein · glucose-friendly",img:"https://images.unsplash.com/photo-1626203050468-9308e709cb4e?auto=format&fit=crop&w=700&q=80"}
];
const members = [
  ["Meena S.","Pro Annual","Priya Raman","Today, 8:12 AM","Active"],
  ["Karthik R.","Quarterly","A. Joseph","Yesterday","Active"],
  ["Sanjana M.","Monthly","Priya Raman","2 Jul","Payment due"],
  ["Ravi Kumar","Pro Annual","Vikram S.","1 Jul","Active"],
  ["Lakshmi P.","Monthly","Priya Raman","29 Jun","Payment due"]
];
const savedRegion=localStorage.getItem("fitsugar-region");
let selectedRegion=FitSugarIndia.regions[savedRegion]?savedRegion:"Pan-India Mix";
const regionSelect=document.getElementById("regionSelect");
regionSelect.innerHTML=`<option value="Pan-India Mix">🇮🇳 Pan-India Mix</option>
  <optgroup label="28 States">${FitSugarIndia.states.map(region=>`<option value="${region}">${region}</option>`).join("")}</optgroup>
  <optgroup label="8 Union Territories">${FitSugarIndia.territories.map(region=>`<option value="${region}">${region}</option>`).join("")}</optgroup>`;
regionSelect.value=selectedRegion;

function regionFoods(){return FitSugarIndia.regions[selectedRegion]}
function regionMealName(index){
  if(selectedRegion==="Tamil Nadu"&&FitSugarI18n.code!=="en")return FitSugarI18n.t(`meal${index+1}`);
  return regionFoods()[index];
}
function regionMealDescription(index){
  if(selectedRegion==="Tamil Nadu"&&FitSugarI18n.code!=="en")return FitSugarI18n.t(`meal${index+1}d`);
  return `A portion-aware ${selectedRegion} option; pair with vegetables and a protein source.`;
}
function regionAlternatives(index){
  const foods=regionFoods();
  return [foods[(index+1)%foods.length],foods[(index+2)%foods.length],foods[(index+3)%foods.length]];
}
function syncHomeMeal(){
  document.querySelector(".meal-card h3").textContent=regionMealName(2);
  document.querySelector(".meal-card p").textContent=regionMealDescription(2);
}

function renderWorkouts(filter="all",query=""){
  const grid=document.getElementById("workoutGrid");
  const normalized=query.trim().toLowerCase();
  const results=workouts.filter(w=>(filter==="all"||w.group===filter)&&(!normalized||`${w.name} ${w.desc} ${w.group} ${w.level}`.toLowerCase().includes(normalized)));
  grid.innerHTML=results.map(w=>`
    <article class="workout-card">
      <div class="image-wrap"><img src="${w.img}" alt="${w.name}" loading="lazy"><span class="tag ${w.level==="Beginner"?"green":"coral"}">${w.level.toUpperCase()}</span></div>
      <div class="card-body"><h3>${w.name}</h3><p>${w.desc}</p><button class="speak-card" aria-label="Listen to ${w.name}">🔊 Listen</button><div class="meta"><span>◷ ${w.time}</span><span>⚡ ${w.cal}</span><button class="text-btn" data-exercise="${w.name}">View guide →</button></div></div>
    </article>`).join("")||`<div class="empty-state"><span>⌕</span><h3>No matching workouts</h3><p>Try a muscle group or a simpler exercise name.</p></div>`;
}
function alternativesMarkup(key,items){
  const choices=items||FitSugarI18n.t(`${key}a`).split("|");
  return choices.map(item=>`<button class="alternative-option" data-food-choice="${item}"><span>${item}</span><small>${FitSugarI18n.t("choose")} →</small></button>`).join("");
}
function renderMeals(){
  document.getElementById("mealTimeline").innerHTML=meals.map((m,index)=>`
    <article class="timeline-item">
      <span>${m.time}</span><h3>${regionMealName(index)}</h3><p>${regionMealDescription(index)}</p>
      <div class="meal-macros"><b>${m.cal} ${FitSugarI18n.t("kcal")}</b><span>${m.protein} ${FitSugarI18n.t("protein")}</span></div>
      <button class="speak-card" aria-label="Listen to meal guidance">🔊 Listen</button>
      <button class="alternatives-toggle" data-alternatives="${m.key}" aria-expanded="false">${FitSugarI18n.t("alternatives")} <i>＋</i></button>
      <div class="alternatives-panel" id="${m.key}-alternatives">${alternativesMarkup(m.key,regionAlternatives(index))}</div>
    </article>`).join("");
  document.querySelector(".nutrition-hero .tag").textContent=`${selectedRegion} · DIABETES-FRIENDLY`;
  syncHomeMeal();
}
function renderProteins(){
  document.getElementById("proteinGrid").innerHTML=proteins.map(p=>`
    <article class="protein-card">
      <img src="${p.img}" alt="${FitSugarI18n.t(p.key)}" loading="lazy">
      <div class="protein-copy"><h3>${FitSugarI18n.t(p.key)}</h3><span>${p.meta}</span>
        <button class="speak-card" aria-label="Listen to protein suggestion">🔊 Listen</button>
        <button class="protein-alternatives" data-alternatives="${p.key}">${FitSugarI18n.t("alternatives")} +</button>
      </div>
      <div class="protein-panel" id="${p.key}-alternatives"><button class="close-alternatives" data-alternatives="${p.key}" aria-label="${FitSugarI18n.t("hide")}">×</button><b>${FitSugarI18n.t("alternatives")}</b>${alternativesMarkup(p.key)}</div>
    </article>`).join("");
}
renderMeals();
renderProteins();
document.getElementById("memberRows").innerHTML=members.map(m=>`<tr><td>${m[0]}</td><td>${m[1]}</td><td>${m[2]}</td><td>${m[3]}</td><td><span class="status ${m[4]==="Active"?"":"due"}">${m[4]}</span></td><td>•••</td></tr>`).join("");
renderWorkouts();

const views=[...document.querySelectorAll(".view")];
const staticTranslations = [
  [".nav-label:nth-of-type(1)","myFitness"],[".nav-label:nth-of-type(2)","myGym"],
  [".nav-item[data-view='home']","home"],[".nav-item[data-view='workouts']","workouts"],
  [".nav-item[data-view='nutrition']","nutrition"],[".nav-item[data-view='progress']","progress"],
  [".nav-item[data-view='coach']","coach"],[".nav-item[data-view='membership']","membership"],
  [".nav-item[data-view='owner']","owner"],[".upgrade-card b","unlock"],[".upgrade-card p","unlockDesc"],
  [".upgrade-card .btn","explore"],[".welcome-row h1","greeting"],[".welcome-row p","greetingSub"],
  [".streak-pill b","streak"],[".streak-pill small","best"],[".hero-content .tag","todayWorkout"],
  [".hero-content h2","upper"],["[data-action='start-workout']","start"],[".glucose-card .eyebrow","glucose"],
  [".glucose-card h3","inRange"],[".status-dot","stable"],["[data-modal='glucose']","logReading"],
  ["#homeView > .section-block .section-title h2","weekly"],["#homeView > .section-block .section-title .text-btn","fullPlan"],
  [".meal-block .eyebrow","fuel"],[".meal-block h2","upNext"],[".meal-block .text-btn","fullMeal"],
  [".coach-teaser h2","askMind"],[".coach-teaser p","askDesc"],[".coach-teaser .btn","askCoach"],
  [".medical-note b","safety"],["#workoutsView .page-heading h1","workoutLibrary"],
  ["#workoutsView .page-heading p","workoutDesc"],["#workoutsView [data-modal='plan']","buildPlan"],
  ["#workoutFilters [data-filter='all']","all"],["#workoutFilters [data-filter='chest']","chest"],
  ["#workoutFilters [data-filter='back']","back"],["#workoutFilters [data-filter='legs']","legs"],
  ["#workoutFilters [data-filter='arms']","arms"],["#workoutFilters [data-filter='shoulders']","shoulders"],
  ["#workoutFilters [data-filter='full']","fullBody"],["#nutritionView .page-heading .eyebrow","rooted"],
  ["#nutritionView .page-heading h1","foodHome"],["#nutritionView .page-heading p","foodDesc"],
  [".nutrition-hero h2","smartPlate"],[".nutrition-hero p","smartDesc"],
  [".nutrition-hero [data-modal='mealplan']","viewToday"],["#swapMealBtn","swap"],
  ["#nutritionView > .section-title:not(.top-gap) .eyebrow","todayMenu"],
  ["#nutritionView > .section-title:not(.top-gap) h2","fiveMeals"],
  ["#nutritionView .top-gap .eyebrow","smartSips"],["#nutritionView .top-gap h2","proteinTitle"],
  ["#progressView .page-heading h1","progressTitle"],["#progressView .page-heading p","progressDesc"],
  ["#progressView [data-modal='checkin']","checkin"],["#membershipView .page-heading h1","membershipTitle"],
  ["#membershipView .page-heading p","membershipDesc"],["#ownerView .page-heading h1","business"],
  ["#ownerView [data-modal='member']","addMember"],[".coach-intro p","coachIntro"]
];
function replaceOwnText(element,text){
  if(!element)return;
  if(element.matches(".hero-content h2")){element.textContent=text;return}
  const own=[...element.childNodes].find(node=>node.nodeType===Node.TEXT_NODE&&node.textContent.trim());
  if(own) own.textContent=`${text} `; else element.textContent=text;
}
function translateStaticUI(){
  staticTranslations.forEach(([selector,key])=>document.querySelectorAll(selector).forEach(el=>replaceOwnText(el,FitSugarI18n.t(key))));
  document.getElementById("globalSearch").placeholder=FitSugarI18n.t("search");
  syncHomeMeal();
  document.getElementById("languageLabel").textContent=FitSugarI18n.languageName();
  document.querySelectorAll("#languageMenu button").forEach(button=>{
    const selected=FitSugarI18n.languages[button.dataset.lang].code===FitSugarI18n.code;
    button.classList.toggle("selected",selected);
    const old=button.querySelector("span"); if(old)old.remove();
    if(selected)button.insertAdjacentHTML("beforeend","<span>✓</span>");
  });
}
function showView(name){
  views.forEach(v=>v.classList.toggle("active",v.id===`${name}View`));
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===name));
  document.getElementById("sidebar").classList.remove("open");
  scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{
  const view=e.target.closest("[data-view]")?.dataset.view;
  if(view){e.preventDefault();showView(view)}
  const exercise=e.target.closest("[data-exercise]")?.dataset.exercise;
  if(exercise) openModal("exercise",exercise);
  const modal=e.target.closest("[data-modal]")?.dataset.modal;
  if(modal) openModal(modal);
  const alternativeToggle=e.target.closest("[data-alternatives]");
  if(alternativeToggle){
    const panel=document.getElementById(`${alternativeToggle.dataset.alternatives}-alternatives`);
    const isOpen=panel.classList.toggle("open");
    alternativeToggle.classList.toggle("open",isOpen);
    alternativeToggle.setAttribute("aria-expanded",String(isOpen));
    replaceOwnText(alternativeToggle,isOpen?FitSugarI18n.t("hide"):FitSugarI18n.t("alternatives"));
  }
  const foodChoice=e.target.closest("[data-food-choice]");
  if(foodChoice){
    document.querySelectorAll(".alternative-option.selected").forEach(item=>item.classList.remove("selected"));
    foodChoice.classList.add("selected");
    toast(`${FitSugarI18n.t("selected")}: ${foodChoice.dataset.foodChoice}`);
  }
});
document.getElementById("workoutFilters").addEventListener("click",e=>{
  if(!e.target.dataset.filter)return;
  document.querySelectorAll("#workoutFilters button").forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active"); renderWorkouts(e.target.dataset.filter);
});
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("themeBtn").onclick=()=>{
  document.body.classList.toggle("dark-mode");
  document.getElementById("themeBtn").textContent=document.body.classList.contains("dark-mode")?"☀":"☾";
};
const langMenu=document.getElementById("languageMenu");
document.getElementById("languageBtn").onclick=()=>langMenu.classList.toggle("open");
langMenu.onclick=e=>{
  const lang=e.target.closest("[data-lang]")?.dataset.lang;if(!lang)return;
  FitSugarI18n.setLanguage(FitSugarI18n.languages[lang].code);
  langMenu.classList.remove("open");toast(`${lang} ✓`);
};
window.addEventListener("fitsugar:language",()=>{
  translateStaticUI(); renderMeals(); renderProteins();
  const activeFilter=document.querySelector("#workoutFilters button.active")?.dataset.filter||"all";
  renderWorkouts(activeFilter);
});
regionSelect.addEventListener("change",()=>{
  selectedRegion=regionSelect.value;
  localStorage.setItem("fitsugar-region",selectedRegion);
  renderMeals();
  toast(`${selectedRegion} nutrition plan loaded`);
});
document.getElementById("notificationBtn").onclick=()=>toast("You're all caught up. Next reminder: lunch at 1:00 PM.");
document.getElementById("weekRow").onclick=e=>{const d=e.target.closest(".day");if(d){document.querySelectorAll(".day").forEach(x=>x.classList.remove("active"));d.classList.add("active");toast(`${d.querySelector("small").textContent}'s plan selected`)}};
document.querySelector("[data-action='start-workout']").onclick=()=>openModal("exercise","Upper Body Strength");

const modalData={
  upgrade:["FitSugar Pro membership","Unlock adaptive weekly plans, full nutrition guidance, progress insights, and unlimited Coach chats.","Start 7-day free trial"],
  glucose:["Log glucose reading","Track a pre- or post-meal reading. Your fitness plan will adapt to keep movement safe and sensible.","Save reading"],
  plan:["Build your weekly plan","Choose a goal and available days. FitSugar Coach will create a balanced plan with recovery built in.","Create my plan"],
  meal:["Today’s balanced lunch","Millet rice, moong dal, beans poriyal and unsweetened curd. Estimated 480 kcal, 24g protein and 12g fibre.","Mark as eaten"],
  mealplan:["Today’s meal plan","A steady-energy day based on Tamil Nadu staples, your vegetarian preference, and your weight-loss goal.","Save plan"],
  checkin:["Weekly check-in","Add your latest weight and tell us how your energy felt this week.","Save check-in"],
  invoice:["Invoice ready","Your annual membership invoice is ready to export as a PDF.","Download invoice"],
  member:["Add a new member","Create a profile, assign a trainer, and start a membership plan.","Add member"]
};
function openModal(type,custom){
  let d=modalData[type]||["Exercise guide",`Step-by-step guidance for ${custom}. Keep your core braced, move with control, and stop if you feel pain.`,"Start exercise"];
  if(type==="exercise")d=["Ready to move?",`${custom} · Keep the weight controlled and breathe through every rep. Avoid locking your joints. Rest 60–90 seconds between sets.`,"Start guided session"];
  if(type==="meal")d=[`${selectedRegion} lunch alternatives`,`Choose another familiar regional meal. Calories and macros are estimates; portions should match your personal plan.`,"Save meal"];
  if(type==="mealplan")d=[`${selectedRegion} meal plan`,`A portion-aware regional plan with vegetables, fibre and practical protein choices. Adjust it for allergies, medical needs and your clinician’s advice.`,"Save plan"];
  const mealAlternatives=type==="meal"?`<div class="modal-alternatives"><b>${FitSugarI18n.t("alternatives")}</b>${alternativesMarkup("meal3",regionAlternatives(2))}</div>`:"";
  document.getElementById("modalContent").innerHTML=`<span class="eyebrow">FITSUGAR PRO</span><h2>${d[0]}</h2><p>${d[1]}</p><button class="speak-card modal-listen" aria-label="Listen to this guidance">🔊 Listen</button>${mealAlternatives}<form class="modal-form"><label>${type==="glucose"?"READING (MG/DL)":"YOUR GOAL"}</label><input required placeholder="${type==="glucose"?"e.g. 112":"Tell us what you want to achieve"}"><button class="btn btn-primary" type="submit">${d[2]}</button></form>`;
  document.getElementById("modalBackdrop").classList.add("open");
}
document.getElementById("modalClose").onclick=()=>document.getElementById("modalBackdrop").classList.remove("open");
document.getElementById("modalBackdrop").onclick=e=>{if(e.target.id==="modalBackdrop")e.currentTarget.classList.remove("open")};
document.getElementById("modalContent").addEventListener("submit",e=>{e.preventDefault();document.getElementById("modalBackdrop").classList.remove("open");toast("Done — your plan has been updated.")});
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2600)}

const coachReplies={
  snack:"Try a small bowl of sundal or half a banana with one tablespoon of peanut butter 45–60 minutes before training. It gives steady energy without a heavy sugar load.",
  easier:"Absolutely. I’ll swap the final superset for 10 minutes of incline walking and reduce each strength movement to two sets. You’ll still get a useful session.",
  workout:"Today is upper-body strength: chest press, single-arm row, shoulder press, and supported curls. Use a weight that leaves 2–3 comfortable reps in reserve.",
  week:"I’d suggest three strength days, two 25-minute walks, one mobility day, and a full rest day. That supports fat loss without crowding your recovery."
};
function sendChat(text){
  if(!text.trim())return;const box=document.getElementById("messages");
  box.insertAdjacentHTML("beforeend",`<div class="message user"><p>${text.replace(/[<>]/g,"")}</p></div>`);
  box.scrollTop=box.scrollHeight;
  setTimeout(()=>{const lower=text.toLowerCase();let reply=lower.includes("snack")||lower.includes("eat")?coachReplies.snack:lower.includes("easy")?coachReplies.easier:lower.includes("week")||lower.includes("plan")?coachReplies.week:coachReplies.workout;box.insertAdjacentHTML("beforeend",`<div class="message coach"><span>✦</span><p>${reply}</p><button class="speak-nearby" aria-label="Listen to Coach reply">🔊</button></div>`);box.scrollTop=box.scrollHeight},450);
}
document.getElementById("chatForm").onsubmit=e=>{e.preventDefault();const i=document.getElementById("chatInput");sendChat(i.value);i.value=""};
document.querySelector(".suggestions").onclick=e=>{if(e.target.tagName==="BUTTON")sendChat(e.target.textContent)};
document.querySelector(".prompt-chips").onclick=e=>{if(e.target.tagName==="BUTTON"){showView("coach");setTimeout(()=>sendChat(e.target.textContent),200)}};
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="k"){e.preventDefault();document.getElementById("globalSearch").focus()}if(e.key==="Escape"){langMenu.classList.remove("open");document.getElementById("modalBackdrop").classList.remove("open")}});
document.getElementById("globalSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){
  const query=e.target.value.trim();
  if(/food|meal|diet|protein|drink|nutrition/i.test(query)){showView("nutrition");toast(`Showing nutrition for “${query}”`)}
  else{showView("workouts");document.querySelectorAll("#workoutFilters button").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"));renderWorkouts("all",query);toast(`Showing results for “${query}”`)}
}});
document.getElementById("swapMealBtn").onclick=()=>openModal("meal","meal3");
translateStaticUI();
const requestedView=location.hash.replace("#","");
if(["home","workouts","nutrition","progress","coach","membership","owner"].includes(requestedView))showView(requestedView);
