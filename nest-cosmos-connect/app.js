const roles=["Super Admin","Apartment Admin","Accountant","Resident / Owner","Tenant","Security Guard","Maintenance Staff","Housekeeping","Electrician","Plumber","Auditor (Read Only)"];
const rolePermissions={
  "Super Admin":"All communities, setup, users, billing, reports, audit logs and exports.",
  "Apartment Admin":"Notices, complaints, visitor rules, facility approvals, staff and residents.",
  "Accountant":"Bills, payments, receipts, defaulters, expenses, statements and GST details.",
  "Resident / Owner":"Own flat payments, complaints, visitors, bookings, documents, polls and profile.",
  "Tenant":"Resident services with owner-visible account activity and limited document access.",
  "Security Guard":"Visitor entry, vehicle lookup, delivery logs, exit logs and emergency escalation.",
  "Maintenance Staff":"Assigned tickets, ETA updates, completion notes, photos and resident ratings.",
  "Housekeeping":"Daily tasks, attendance, area checklist and issue escalation.",
  "Electrician":"Electrical complaints, parts notes, ETA and closure evidence.",
  "Plumber":"Plumbing complaints, material usage, ETA and closure evidence.",
  "Auditor (Read Only)":"Read-only reports, receipts, expenses, meeting minutes and audit trail."
};
const state={
  role:localStorage.getItem("ncc-role")||"Super Admin",
  lang:localStorage.getItem("ncc-lang")||"en",
  pollYes:Number(localStorage.getItem("ncc-poll-yes")||74),
  pollNo:Number(localStorage.getItem("ncc-poll-no")||18)
};
state.payments=[
  {flat:"A-101",resident:"R. Narayanan",amount:4250,status:"Paid",method:"Razorpay UPI"},
  {flat:"A-203",resident:"Fathima S.",amount:4250,status:"Pending",method:"Reminder sent"},
  {flat:"B-704",resident:"Arjun Mehta",amount:4250,status:"Overdue",method:"Late fee applied"},
  {flat:"C-509",resident:"Meera Iyer",amount:4250,status:"Paid",method:"Cash recorded"},
  {flat:"D-1202",resident:"Victor Raj",amount:4250,status:"Pending",method:"Cashfree link"},
  {flat:"E-604",resident:"Kavya N.",amount:4250,status:"Paid",method:"Card"}
];
state.complaints=[
  {id:"CMP-1048",cat:"Plumbing",flat:"B-704",title:"Kitchen sink leakage",priority:"High",status:"Admin",eta:"Today 5:00 PM",staff:"Plumber Kumar"},
  {id:"CMP-1049",cat:"Lift",flat:"C-Block",title:"Lift 2 door sensor",priority:"High",status:"In Progress",eta:"45 min",staff:"Lift Technician"},
  {id:"CMP-1050",cat:"Housekeeping",flat:"Lobby",title:"Wet patch near mail room",priority:"Medium",status:"Assign Staff",eta:"2 hours",staff:"Housekeeping"},
  {id:"CMP-1051",cat:"Parking",flat:"A-203",title:"Unauthorized bike in slot",priority:"Low",status:"Resident",eta:"Tomorrow",staff:"Security"},
  {id:"CMP-1052",cat:"Electrical",flat:"D-1202",title:"Corridor light flicker",priority:"Medium",status:"Completed",eta:"Done",staff:"Electrician Bala"}
];
state.visitors=[
  {name:"Swiggy Delivery",flat:"B-704",type:"Delivery",vehicle:"TN 07 CD 1122",status:"Pending"},
  {name:"Priya Raman",flat:"A-101",type:"Guest",vehicle:"TN 14 AB 9910",status:"Approved"},
  {name:"Maid - Lakshmi",flat:"C-509",type:"Maid",vehicle:"Walk-in",status:"Approved"},
  {name:"Driver - Selvam",flat:"D-1202",type:"Driver",vehicle:"TN 10 K 8080",status:"Pending"}
];
const facilities=["Community Hall","Terrace","Club House","Gym","Play Area","Party Hall","Guest Parking"].map((name,i)=>({name,slots:8-i,booked:2+i,approval:i%2?"Admin approval":"Auto approval",fee:i===0?"Rs. 2,000":"Optional"}));
const notices=["Water shutdown on 12 July, 10 AM to 1 PM","Lift maintenance in B Block on Friday","AGM meeting minutes uploaded","Emergency contact drill scheduled Sunday","July maintenance reminders sent"];
const docs=["Association Rules.pdf","AGM 2026 Minutes.pdf","Audit Report FY 2025-26.pdf","Tenant Move-in Form.pdf","Emergency Contacts.xlsx","Parking Policy.pdf"];
const expenses=[["EB Bill",118000],["Water Tanker",68000],["Security Salary",152000],["Housekeeping Salary",97000],["Lift Maintenance",46000],["Generator Diesel",31000],["Garden",22000],["Repairs",39000]];
const staff=[["Security","8 present","Gate A, Gate B, night patrol"],["Housekeeping","12 present","Tower lobby and common area checklist"],["Electrician","3 assigned","4 open tickets"],["Plumber","2 assigned","2 high priority jobs"],["Lift Technician","On call","B Block Lift 2 sensor"],["Garden Staff","4 present","North lawn irrigation"]];
const reports=["Maintenance Collection","Pending Dues","Complaint Analytics","Visitor Reports","Expense Reports","Audit Reports","Monthly Summary","Yearly Summary","CSV / Excel / PDF Export"];
const arch=[
  ["Frontend","Next.js, React, TypeScript, Tailwind CSS and shared role-aware components."],
  ["Mobile","React Native or Capacitor app shells for Resident, Security, Staff and Admin apps with biometric login."],
  ["Backend","Node.js, Express/NestJS, OpenAPI, JWT, OTP, RBAC, audit logs and rate limiting."],
  ["Database","PostgreSQL with Prisma migrations, tenant-ready community schema and daily backups."],
  ["Payments","Razorpay, Cashfree and optional PhonePe gateway with signed webhooks and receipt PDFs."],
  ["Notifications","Firebase Cloud Messaging, email, SMS optional and WhatsApp API future channel."],
  ["Storage","S3 or Cloudinary for complaint media, documents and generated PDFs."],
  ["Deployment","Docker, Nginx, Ubuntu, HTTPS, GitHub Actions CI/CD and environment-based secrets."]
];
function $(s,root=document){return root.querySelector(s)}
function $$(s,root=document){return [...root.querySelectorAll(s)]}
function money(n){return "Rs. "+n.toLocaleString("en-IN")}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
function kpi(x){return `<article class="kpi"><small>${x[0]}</small><b>${x[1]}</b><span>${x[2]}</span></article>`}
function renderRole(){localStorage.setItem("ncc-role",state.role);$("#roleBanner").innerHTML=`Signed in as <b>${state.role}</b>. ${rolePermissions[state.role]}`}
function renderKpis(){
  const collected=state.payments.filter(p=>p.status==="Paid").reduce((s,p)=>s+p.amount,0);
  const pending=state.payments.filter(p=>p.status!=="Paid").reduce((s,p)=>s+p.amount,0);
  $("#overviewKpis").innerHTML=[["Flats configured","248","5 blocks, 14 floors"],["July collection",money(collected),money(pending)+" pending"],["Open complaints",state.complaints.filter(c=>c.status!=="Completed").length,"2 high priority"],["Visitors today","186","24 pre-approved"]].map(kpi).join("");
  $("#paymentKpis").innerHTML=[["Generated bills","248","Monthly flat-wise billing"],["Collected",money(collected),"Razorpay, Cashfree, cash"],["Pending",money(pending),"Auto reminders active"],["Defaulters","18","Late fee engine ready"]].map(kpi).join("");
}
function renderOverview(){
  const feed=[["Payment received","C-509 paid July maintenance by cash."],["Visitor waiting","Delivery request pending for B-704."],["Complaint escalated","Lift sensor issue marked high priority."],["Notice published","Water shutdown alert sent to all residents."],["Facility approved","Community Hall booking approved for Saturday."]];
  $("#activityFeed").innerHTML=feed.map(f=>`<article><i></i><div><b>${f[0]}</b><span>${f[1]}</span></div></article>`).join("");
  $("#roleCards").innerHTML=roles.map(r=>`<article class="role-card"><b>${r}</b><small>${rolePermissions[r]}</small></article>`).join("");
}
function renderResident(){
  const modules=["Maintenance dues and receipts","Raise complaints with photo/video","Approve and pre-approve visitors","Book common facilities","View notices and polls","Download documents","Manage family members","Register car, bike and bicycle","Emergency contacts and alerts"];
  $("#residentModules").innerHTML=modules.map(m=>`<article class="module-card"><b>${m}</b><small>Available in resident mobile app, web portal and installable PWA.</small></article>`).join("");
  $("#chatMessages").innerHTML='<div class="message">Admin: July receipt is ready for download.</div><div class="message user">Resident: Please confirm plumber ETA.</div><div class="message">Admin: Kumar is assigned for 5:00 PM today.</div>';
}
function renderPayments(){
  $("#paymentRows").innerHTML=state.payments.map(p=>`<tr><td>${p.flat}</td><td>${p.resident}</td><td>${money(p.amount)}</td><td><span class="status ${p.status}">${p.status}</span></td><td>${p.method}</td><td><button class="text-btn" data-receipt="${p.flat}">PDF receipt</button></td></tr>`).join("");
}
function renderComplaints(){
  const statuses=["Resident","Admin","Assign Staff","In Progress","Completed"];
  $("#complaintBoard").innerHTML=statuses.map(s=>`<section class="board-col"><h3>${s}</h3>${state.complaints.filter(c=>c.status===s).map(c=>`<article class="ticket"><span class="priority ${c.priority}">${c.priority}</span><b>${c.id} - ${c.cat}</b><p>${c.title}<br>${c.flat} - ${c.staff} - ETA ${c.eta}</p><button class="text-btn" data-ticket="${c.id}">Update</button></article>`).join("")||'<article class="ticket"><p>No tickets in this stage.</p></article>'}</section>`).join("");
}
function renderVisitors(){
  $("#visitorList").innerHTML=state.visitors.map((v,i)=>`<article class="visitor-card"><b>${v.name}</b><small>${v.type} - ${v.flat} - ${v.vehicle}</small><div><span class="status ${v.status}">${v.status}</span><span><button class="approve" data-visit="${i}" data-status="Approved">Approve</button> <button class="reject" data-visit="${i}" data-status="Rejected">Reject</button></span></div></article>`).join("");
}
function renderFacilities(){
  $("#facilityGrid").innerHTML=facilities.map(f=>{const pct=Math.round(f.booked/(f.booked+f.slots)*100);return `<article class="facility-card"><b>${f.name}</b><small>${f.approval} - Fee ${f.fee}</small><div class="meter"><i style="width:${pct}%"></i></div><small>${f.booked} bookings, ${f.slots} slots open</small></article>`}).join("");
}
function renderCommunity(){
  $("#noticeList").innerHTML=notices.map(n=>`<div class="list-row"><span class="status-dot"></span><div><b>${n}</b><span>Push notification, email and resident app feed.</span></div></div>`).join("");
  $("#documentList").innerHTML=docs.map(d=>`<div class="list-row"><span class="status-dot"></span><div><b>${d}</b><span>Searchable download with role-aware access.</span></div></div>`).join("");
  renderPoll();
}
function renderPoll(){const total=state.pollYes+state.pollNo;const pct=Math.round(state.pollYes/total*100);$("#pollFill").style.width=pct+"%";$("#pollText").textContent=`${pct}% approve from ${total} votes`}
function renderStaff(){$("#staffGrid").innerHTML=staff.map(s=>`<article class="staff-card"><b>${s[0]}</b><small>${s[1]} - ${s[2]}</small></article>`).join("")}
function renderFinance(){
  const max=Math.max(...expenses.map(e=>e[1]));
  $("#expenseBars").innerHTML=expenses.map(e=>`<div class="bar-row"><b>${e[0]}</b><div class="bar-track"><i style="width:${Math.round(e[1]/max*100)}%"></i></div><span>${money(e[1])}</span></div>`).join("");
  const total=expenses.reduce((s,e)=>s+e[1],0),income=934000;
  $("#statement").innerHTML=[["Maintenance income",money(income)],["Operating expenses",money(total)],["Net surplus",money(income-total)],["Cash on hand",money(1286000)],["Audit status","Ready for review"]].map(r=>`<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join("");
}
function renderReports(){
  $("#reportGrid").innerHTML=reports.map(r=>`<article class="report-card"><b>${r}</b><small>Generate as professional PDF, Excel or CSV with apartment branding.</small></article>`).join("");
  $("#architectureList").innerHTML=arch.map(a=>`<article class="arch-item"><b>${a[0]}</b><span>${a[1]}</span></article>`).join("");
}
function renderSettings(){
  const fields=[["Apartment name","Nest Cosmos Apartment"],["Address","Pondicherry Pattai Salai, Sholinganallur, Chennai"],["Blocks","5"],["Floors per block","14"],["Flat numbering","A-101 to E-1408"],["Maintenance amount","4250"],["Due date","15th of every month"],["Late fee","250"],["Bank account","Nest Cosmos Association - XXXX 4821"],["UPI ID","nestcosmos@upi"],["GST information","Not applicable"],["Notification channels","Push, Email, SMS optional"]];
  $("#settingsForm").innerHTML=fields.map((f,i)=>`<label class="${i===1||i>8?"wide":""}">${f[0]}<input value="${f[1]}" /></label>`).join("");
}
function showView(name){$$(".view").forEach(v=>v.classList.remove("active"));$(`#${name}View`)?.classList.add("active");$$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));history.replaceState(null,"","#"+name);if(innerWidth<1100)$("#sidebar").classList.remove("open")}
function modal(kind){
  const titles={profile:"Update resident profile",complaint:"Raise complaint",visitor:"Add expected visitor",booking:"Book facility",notice:"Publish notice",staff:"Assign staff task",expense:"Record expense"};
  $("#modalContent").innerHTML=`<h2>${titles[kind]||"Action"}</h2><form class="modal-form"><label>Title<input required value="${titles[kind]||"Action"}" /></label><label>Category<select><option>Maintenance</option><option>Visitor</option><option>Payment</option><option>Emergency</option></select></label><label class="wide">Details<textarea rows="4" placeholder="Enter notes, ETA, amount, flat number or instructions"></textarea></label><button>Save ${kind}</button></form>`;
  $("#modalBackdrop").classList.add("open");
}
function download(name,content,type="text/plain"){
  const blob=new Blob([content],{type});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=name;
  a.style.display="none";
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{URL.revokeObjectURL(url);a.remove()},0);
}
function renderAll(){renderRole();renderKpis();renderOverview();renderResident();renderPayments();renderComplaints();renderVisitors();renderFacilities();renderCommunity();renderStaff();renderFinance();renderReports();renderSettings()}
$("#roleSelect").innerHTML=roles.map(r=>`<option>${r}</option>`).join("");
$("#roleSelect").value=state.role;
$("#roleSelect").addEventListener("change",e=>{state.role=e.target.value;renderRole();toast("Workspace switched to "+state.role)});
$$("[data-view]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();showView(el.dataset.view)}));
$("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#themeToggle").addEventListener("click",()=>document.body.classList.toggle("dark"));
$("#languageToggle").addEventListener("click",()=>toast(state.lang==="en"?"Tamil labels enabled for production i18n catalogue.":"English labels enabled."));
$("#emergencyBtn").addEventListener("click",()=>toast("Emergency drill alert queued for push, email and SMS channels."));
$("#generateBillsBtn").addEventListener("click",()=>toast("248 July bills generated with due date and late fee rules."));
$("#saveSettingsBtn").addEventListener("click",()=>toast("Apartment setup saved locally for this prototype."));
$("#downloadReportBtn").addEventListener("click",()=>download("nest-cosmos-summary.txt","Nest Cosmos Connect summary\nMaintenance, complaints, visitors, facilities, finance and audit reports are configured."));
$("#chatForm").addEventListener("submit",e=>{e.preventDefault();$(".messages").insertAdjacentHTML("beforeend",`<div class="message user">${e.target[0].value}</div>`);e.target.reset();toast("Message sent to apartment admin.")});
$("#gateSearchForm").addEventListener("submit",e=>{e.preventDefault();$("#gateResult").textContent="Match found: vehicle/visitor can be linked to approved resident access or escalated for approval."});
document.body.addEventListener("click",e=>{
  const m=e.target.closest("[data-modal]");if(m)modal(m.dataset.modal);
  const pay=e.target.closest("[data-pay]");if(pay)toast(pay.dataset.pay+" payment link opened. Gateway integration ready.");
  const rec=e.target.closest("[data-receipt]");if(rec)download(`receipt-${rec.dataset.receipt}.txt`,`Nest Cosmos Apartment\nMaintenance receipt for ${rec.dataset.receipt}\nAmount: Rs. 4,250\nStatus: recorded`);
  const vote=e.target.closest("[data-vote]");if(vote){vote.dataset.vote==="yes"?state.pollYes++:state.pollNo++;localStorage.setItem("ncc-poll-yes",state.pollYes);localStorage.setItem("ncc-poll-no",state.pollNo);renderPoll();toast("Vote recorded.")}
  const visit=e.target.closest("[data-visit]");if(visit){state.visitors[visit.dataset.visit].status=visit.dataset.status;renderVisitors();toast("Visitor "+visit.dataset.status.toLowerCase()+".")}
  const exp=e.target.closest("[data-export]");if(exp)download(`${exp.dataset.export}.csv`,"module,status\n"+exp.dataset.export+",ready");
});
$("#modalClose").addEventListener("click",()=>$("#modalBackdrop").classList.remove("open"));
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")$("#modalBackdrop").classList.remove("open")});
$("#globalSearch").addEventListener("input",e=>{
  const q=e.target.value.trim().toLowerCase();
  if(q.length>1){
    const match=[...state.payments.map(p=>p.flat+" "+p.resident),...state.complaints.map(c=>c.id+" "+c.title),...state.visitors.map(v=>v.name+" "+v.flat),...docs].find(x=>x.toLowerCase().includes(q));
    if(match)toast("Search match: "+match);
  }
});
let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e});
$("#installBtn").addEventListener("click",async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null}else toast("Use browser install/Add to Home Screen after serving over HTTPS.")});
if("serviceWorker" in navigator){navigator.serviceWorker.register("service-worker.js").catch(()=>{})}
renderAll();
showView(location.hash.replace("#","")||"overview");
