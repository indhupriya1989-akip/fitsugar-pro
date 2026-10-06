(function(){
  const steps=[
    {title:"Welcome to FitSugar Pro",text:"This quick tour shows the member experience and the gym-owner tools. You can skip it anytime.",target:".brand",label:"1-minute product tour"},
    {title:"Member fitness dashboard",text:"Track workouts, water, steps, meals, glucose and progress from one place.",target:".workout-hero",label:"Member experience"},
    {title:"Health + personalized guidance",text:"Use the Health Hub for BMI, glucose logs, activity tracking and goal-aware recommendations.",target:'[data-view="health"]',label:"Health Hub"},
    {title:"FitSugar Coach",text:"Members can ask for simpler workouts, food guidance and explanations in a conversational experience.",target:'[data-view="coach"]',label:"Coach experience"},
    {title:"Gym owner business tools",text:"Switch to Members, Sales and Owner Console to see CRM, invoices, renewals, revenue and reports.",target:'[data-view="owner"]',label:"Business dashboard"}
  ];
  let index=0,highlight=null;
  function removeHighlight(){if(highlight){highlight.classList.remove("fs-tour-highlight");highlight=null}}
  function ensure(){let el=document.getElementById("fsTour");if(el)return el;el=document.createElement("div");el.id="fsTour";el.className="fs-tour-backdrop";el.hidden=true;el.innerHTML='<section class="fs-tour-card" role="dialog" aria-modal="true" aria-labelledby="fsTourTitle"><span class="fs-tour-kicker">FITSUGAR PRO DEMO</span><h2 id="fsTourTitle"></h2><p id="fsTourText"></p><span class="fs-tour-label" id="fsTourLabel"></span><div class="fs-tour-progress" id="fsTourProgress"></div><div class="fs-tour-actions"><button class="fs-tour-skip" id="fsTourSkip">Skip tour</button><button class="fs-tour-next" id="fsTourNext">Next</button></div></section>';document.body.appendChild(el);el.querySelector("#fsTourSkip").onclick=close;el.querySelector("#fsTourNext").onclick=next;return el}
  function render(){const el=ensure(),step=steps[index];removeHighlight();el.querySelector("#fsTourTitle").textContent=step.title;el.querySelector("#fsTourText").textContent=step.text;el.querySelector("#fsTourLabel").textContent=step.label;el.querySelector("#fsTourProgress").innerHTML=steps.map((_,i)=>'<i class="'+(i<=index?"active":"")+'"></i>').join("");el.querySelector("#fsTourNext").textContent=index===steps.length-1?"Start exploring":"Next";const target=document.querySelector(step.target);if(target){highlight=target;highlight.classList.add("fs-tour-highlight");if(index>0&&target.scrollIntoView)target.scrollIntoView({behavior:"smooth",block:"center"})}}
  function next(){if(index<steps.length-1){index++;render()}else close()}
  function close(){removeHighlight();const el=ensure();el.hidden=true;document.documentElement.style.overflow=""}
  function open(){index=0;const el=ensure();el.hidden=false;document.documentElement.style.overflow="hidden";render()}
  document.addEventListener("DOMContentLoaded",()=>setTimeout(open,650));
  window.FitSugarTour={open,close};
})();