(function(){
  "use strict";
  const state={lastError:null,online:navigator.onLine};

  function ensureBanner(){
    let el=document.getElementById("fsNetworkBanner");
    if(el)return el;
    el=document.createElement("div");
    el.id="fsNetworkBanner";
    el.className="fs-network-banner";
    el.hidden=true;
    el.setAttribute("role","status");
    el.setAttribute("aria-live","polite");
    el.innerHTML='<span id="fsNetworkMessage"></span><button type="button" id="fsRetryBtn">Retry</button>';
    document.body.appendChild(el);
    el.querySelector("#fsRetryBtn").addEventListener("click",()=>location.reload());
    return el;
  }

  function show(message,type="error",autoHide=false){
    const el=ensureBanner();
    const msg=el.querySelector("#fsNetworkMessage");
    if(msg)msg.textContent=message;
    el.className="fs-network-banner "+(type==="success"?"is-success":"is-error");
    el.hidden=false;
    const retry=el.querySelector("#fsRetryBtn");
    if(retry)retry.hidden=type==="success";
    if(autoHide)setTimeout(()=>{el.hidden=true},3500);
  }

  function hide(){ const el=document.getElementById("fsNetworkBanner"); if(el)el.hidden=true; }

  function friendlyError(error){
    const raw=String((error&&error.message)||error||"").toLowerCase();
    if(!navigator.onLine)return "You are offline. FitSugar Pro will use saved content where available. Reconnect to refresh.";
    if(raw.includes("failed to fetch")||raw.includes("networkerror")||raw.includes("load failed"))
      return "We could not reach the internet. Check your connection and try again.";
    if(raw.includes("quota")||raw.includes("storage"))
      return "Your browser storage is full or unavailable. Some changes may not be saved.";
    if(raw.includes("permission")||raw.includes("notallowed"))
      return "Permission was not granted. You can enable it in your browser or phone settings.";
    return "Something went wrong, but your FitSugar Pro data is still safe on this device. Please retry.";
  }

  window.FitSugarErrors={
    show,
    handle(error,context){
      state.lastError=error;
      console.error("[FitSugar Pro]",context||"App error",error);
      show(friendlyError(error));
    },
    async safeFetch(input,init){
      try{
        const response=await fetch(input,init);
        if(!response.ok)throw new Error("Request failed ("+response.status+")");
        return response;
      }catch(error){
        this.handle(error,"Network request");
        throw error;
      }
    },
    safeStorage:{
      get(key,fallback=null){
        try{const value=localStorage.getItem(key);return value===null?fallback:value}
        catch(error){window.FitSugarErrors.handle(error,"Read local storage");return fallback}
      },
      set(key,value){
        try{localStorage.setItem(key,value);return true}
        catch(error){window.FitSugarErrors.handle(error,"Save local storage");return false}
      },
      remove(key){
        try{localStorage.removeItem(key);return true}
        catch(error){window.FitSugarErrors.handle(error,"Remove local storage");return false}
      }
    }
  };

  window.addEventListener("offline",()=>{
    state.online=false;
    show("You are offline. Saved FitSugar Pro screens will keep working where available.");
  });
  window.addEventListener("online",()=>{
    state.online=true;
    show("Internet connection restored.","success",true);
  });
  window.addEventListener("error",event=>{
    const target=event.target;
    if(target&&target.tagName==="IMG"){
      target.classList.add("fs-img-failed");
      target.removeAttribute("src");
      target.alt=(target.alt?target.alt+" — ":"")+"Image unavailable offline";
      return;
    }
    if(event.error)window.FitSugarErrors.handle(event.error,"Unexpected app error");
  },true);
  window.addEventListener("unhandledrejection",event=>{
    window.FitSugarErrors.handle(event.reason||new Error("Unexpected request failure"),"Unhandled request");
  });

  document.addEventListener("DOMContentLoaded",()=>{
    ensureBanner();
    if(!navigator.onLine)show("You are offline. Saved FitSugar Pro screens will keep working where available.");
  });
})();