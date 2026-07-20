(function(){
  const DAY=86400000;
  const isoDaysAgo=days=>new Date(Date.now()-(days*DAY)).toISOString().slice(0,10);
  const seedMembers=[
    {id:"M001",name:"Meena S.",plan:"Pro Annual",trainer:"Priya Raman",lastWorkout:isoDaysAgo(1),status:"Active",goal:"Build strength"},
    {id:"M002",name:"Karthik R.",plan:"Quarterly",trainer:"A. Joseph",lastWorkout:isoDaysAgo(8),status:"Active",goal:"General fitness"},
    {id:"M003",name:"Sanjana M.",plan:"Monthly",trainer:"Priya Raman",lastWorkout:isoDaysAgo(35),status:"Payment due",goal:"Weight loss"},
    {id:"M004",name:"Ravi Kumar",plan:"Pro Annual",trainer:"Vikram S.",lastWorkout:isoDaysAgo(100),status:"Inactive",goal:"Improve glucose control"},
    {id:"M005",name:"Lakshmi P.",plan:"Monthly",trainer:"Priya Raman",lastWorkout:isoDaysAgo(205),status:"Inactive",goal:"Mobility and balance"}
  ];
  const seedSales=[
    {id:"INV-260701",memberId:"M001",date:isoDaysAgo(2),amount:12999,method:"UPI",status:"Paid"},
    {id:"INV-260702",memberId:"M002",date:isoDaysAgo(5),amount:4999,method:"Card",status:"Paid"},
    {id:"INV-260703",memberId:"M003",date:isoDaysAgo(12),amount:1999,method:"UPI",status:"Pending"},
    {id:"INV-260704",memberId:"M004",date:isoDaysAgo(34),amount:12999,method:"Bank transfer",status:"Paid"}
  ];
  let memberData=load("fitsugar-members-v1",seedMembers);
  let salesData=load("fitsugar-sales-v1",seedSales);
  function load(key,fallback){
    try{const value=JSON.parse(localStorage.getItem(key)||"null");return Array.isArray(value)&&value.length?value:fallback}catch(error){return fallback}
  }
  function save(){
    localStorage.setItem("fitsugar-members-v1",JSON.stringify(memberData));
    localStorage.setItem("fitsugar-sales-v1",JSON.stringify(salesData));
  }
  function escapeHtml(value){
    return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  function memberById(id){return memberData.find(member=>member.id===id)}
  function inactivity(member){return window.FitSugarRestart.breakDays(member.lastWorkout)}
  function effectiveStatus(member){
    const days=inactivity(member);
    if(days>=30)return"Restart due";
    if(days>=7)return"Follow up";
    return member.status;
  }
  function formatMoney(value){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(value)||0)}
  function renderMembers(query=""){
    const normalized=query.trim().toLowerCase();
    const filtered=memberData.filter(member=>`${member.name} ${member.id} ${member.plan} ${member.trainer}`.toLowerCase().includes(normalized));
    document.getElementById("manageMemberRows").innerHTML=filtered.map(member=>{
      const status=effectiveStatus(member);
      return `<tr><td><b>${escapeHtml(member.name)}</b><small class="member-id">${member.id}</small></td><td>${escapeHtml(member.plan)}</td><td>${escapeHtml(member.trainer)}</td><td>${new Date(`${member.lastWorkout}T00:00:00`).toLocaleDateString()}<small class="member-id">${window.FitSugarRestart.breakLabel(inactivity(member))} ago</small></td><td><span class="status ${status==="Active"?"":status==="Follow up"?"follow-up":"due"}">${status}</span></td><td><div class="row-actions"><button data-restart-member="${member.id}">↻ Restart</button><button data-invoice-member="${member.id}">Invoice</button></div></td></tr>`;
    }).join("")||'<tr><td colspan="6">No members match this search.</td></tr>';
    const alerts=JSON.parse(localStorage.getItem("fitsugar-trainer-alerts")||"[]");
    const restartDue=memberData.filter(member=>inactivity(member)>=30).length;
    document.getElementById("memberKpis").innerHTML=kpis([
      ["TOTAL MEMBERS",memberData.length,"Profiles in this device"],
      ["ACTIVE THIS WEEK",memberData.filter(member=>inactivity(member)<7).length,"Workout in last 7 days"],
      ["RESTART DUE",restartDue,"Inactive 30+ days"],
      ["TRAINER ALERTS",alerts.length,"Long-break follow-ups"]
    ]);
    const ownerRows=document.getElementById("memberRows");
    if(ownerRows)ownerRows.innerHTML=memberData.slice(0,5).map(member=>`<tr><td>${escapeHtml(member.name)}</td><td>${escapeHtml(member.plan)}</td><td>${escapeHtml(member.trainer)}</td><td>${new Date(`${member.lastWorkout}T00:00:00`).toLocaleDateString()}</td><td><span class="status ${effectiveStatus(member)==="Active"?"":"due"}">${effectiveStatus(member)}</span></td><td><button class="text-btn" data-restart-member="${member.id}">Restart</button></td></tr>`).join("");
    fillMemberOptions();
  }
  function kpis(items){
    return items.map(item=>`<article><span>${item[0]}</span><b>${item[1]}</b><small>${item[2]}</small></article>`).join("");
  }
  function fillMemberOptions(){
    const select=document.getElementById("saleMember");
    const selected=select.value;
    select.innerHTML=memberData.map(member=>`<option value="${member.id}">${escapeHtml(member.name)} · ${member.id}</option>`).join("");
    if(memberData.some(member=>member.id===selected))select.value=selected;
  }
  function monthKey(date){return String(date).slice(0,7)}
  function renderMonthOptions(){
    const months=[...new Set(salesData.map(sale=>monthKey(sale.date)))].sort().reverse();
    const select=document.getElementById("salesMonthFilter");
    const current=select.value;
    select.innerHTML='<option value="all">All months</option>'+months.map(month=>`<option value="${month}">${new Date(`${month}-01T00:00:00`).toLocaleDateString("en-IN",{month:"long",year:"numeric"})}</option>`).join("");
    select.value=months.includes(current)||current==="all"?current:"all";
  }
  function renderSales(){
    renderMonthOptions();
    const filter=document.getElementById("salesMonthFilter").value||"all";
    const filtered=salesData.filter(sale=>filter==="all"||monthKey(sale.date)===filter).sort((a,b)=>b.date.localeCompare(a.date));
    document.getElementById("salesRows").innerHTML=filtered.map(sale=>{
      const member=memberById(sale.memberId);
      return `<tr><td>${sale.id}</td><td>${new Date(`${sale.date}T00:00:00`).toLocaleDateString()}</td><td>${escapeHtml(member?.name||"Member")}</td><td>${escapeHtml(sale.method)}</td><td><span class="status ${sale.status==="Paid"?"":sale.status==="Pending"?"due":"follow-up"}">${sale.status}</span></td><td><b>${formatMoney(sale.amount)}</b></td><td><button class="text-btn" data-invoice-sale="${sale.id}">Invoice</button></td></tr>`;
    }).join("")||'<tr><td colspan="7">No sales in this period.</td></tr>';
    const paid=filtered.filter(sale=>sale.status==="Paid").reduce((sum,sale)=>sum+Number(sale.amount),0);
    const pending=filtered.filter(sale=>sale.status==="Pending").reduce((sum,sale)=>sum+Number(sale.amount),0);
    const refunded=filtered.filter(sale=>sale.status==="Refunded").reduce((sum,sale)=>sum+Number(sale.amount),0);
    document.getElementById("salesKpis").innerHTML=kpis([
      ["COLLECTED",formatMoney(paid),"Paid sales"],
      ["PENDING",formatMoney(pending),"Needs follow-up"],
      ["REFUNDED",formatMoney(refunded),"Returned payments"],
      ["TRANSACTIONS",filtered.length,filter==="all"?"All recorded sales":"Selected month"]
    ]);
  }
  function openMemberModal(){
    document.getElementById("modalContent").innerHTML=`<span class="eyebrow">MEMBER CRM</span><h2>Add a new member</h2><p>Create the member profile and optionally record the joining payment.</p><form class="modal-form" id="addMemberForm"><label>FULL NAME</label><input name="name" required maxlength="50"><label>MEMBERSHIP PLAN</label><select name="plan"><option>Monthly</option><option>Quarterly</option><option>Pro Annual</option></select><label>TRAINER</label><input name="trainer" required value="Priya Raman"><label>LAST WORKOUT / JOINING DATE</label><input name="lastWorkout" type="date" required value="${new Date().toISOString().slice(0,10)}"><label>CURRENT GOAL</label><select name="goal"><option>Build strength</option><option>Weight loss</option><option>Improve glucose control</option><option>General fitness</option><option>Mobility and balance</option></select><label>JOINING PAYMENT (₹, OPTIONAL)</label><input name="amount" type="number" min="0" step="1" value="0"><button class="btn btn-primary" type="submit">Add member</button></form>`;
    document.getElementById("modalBackdrop").classList.add("open");
  }
  function addMember(form){
    const data=new FormData(form);
    const id=`M${String(Math.max(0,...memberData.map(member=>Number(member.id.slice(1))||0))+1).padStart(3,"0")}`;
    const member={id,name:String(data.get("name")).trim(),plan:data.get("plan"),trainer:String(data.get("trainer")).trim(),lastWorkout:data.get("lastWorkout"),status:"Active",goal:data.get("goal")};
    memberData.unshift(member);
    const amount=Number(data.get("amount"));
    if(amount>0)salesData.unshift({id:nextInvoiceId(),memberId:id,date:new Date().toISOString().slice(0,10),amount,method:"UPI",status:"Paid"});
    save();renderMembers();renderSales();
    document.getElementById("modalBackdrop").classList.remove("open");
    toast(`${member.name} added successfully.`);
  }
  function nextInvoiceId(){return `INV-${new Date().toISOString().slice(2,10).replaceAll("-","")}-${String(salesData.length+1).padStart(3,"0")}`}
  function csvCell(value){
    let text=String(value??"");
    if(/^[=+\-@]/.test(text))text=`'${text}`;
    return `"${text.replaceAll('"','""')}"`;
  }
  function downloadFile(filename,content,type){
    const blob=new Blob([content],{type});
    const url=URL.createObjectURL(blob);
    const anchor=document.createElement("a");
    anchor.href=url;anchor.download=filename;document.body.appendChild(anchor);anchor.click();anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function exportMembers(){
    const rows=[["Member ID","Name","Plan","Trainer","Last workout","Status","Goal"],...memberData.map(member=>[member.id,member.name,member.plan,member.trainer,member.lastWorkout,effectiveStatus(member),member.goal])];
    downloadFile("fitsugar-members.csv",rows.map(row=>row.map(csvCell).join(",")).join("\r\n"),"text/csv;charset=utf-8");
    toast("Member report exported.");
  }
  function exportSales(){
    const rows=[["Invoice","Date","Member ID","Member","Method","Status","Amount INR"],...salesData.map(sale=>[sale.id,sale.date,sale.memberId,memberById(sale.memberId)?.name||"",sale.method,sale.status,sale.amount])];
    downloadFile("fitsugar-sales-report.csv",rows.map(row=>row.map(csvCell).join(",")).join("\r\n"),"text/csv;charset=utf-8");
    toast("Sales report exported.");
  }
  function invoiceHtml(sale,member){
    const safeMember=member||{id:"MEMBER",name:document.getElementById("profileName").textContent,plan:"Pro Annual",trainer:"Priya Raman"};
    const invoice=sale||{id:`INV-${new Date().toISOString().slice(0,10).replaceAll("-","")}`,date:new Date().toISOString().slice(0,10),amount:12999,method:"UPI",status:"Paid"};
    return `<!doctype html><html><head><meta charset="utf-8"><title>${invoice.id}</title><style>body{font-family:Arial,sans-serif;color:#20231f;margin:0;padding:40px;background:#f5f5f1}.invoice{max-width:760px;margin:auto;background:#fff;padding:45px;border-radius:20px}.head{display:flex;justify-content:space-between;border-bottom:3px solid #ff654d;padding-bottom:20px}.brand{font-size:25px;font-weight:800}.brand span{color:#ff654d}.meta{text-align:right}.bill{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin:32px 0}.bill small,th{color:#777;font-size:11px}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:14px;border-bottom:1px solid #ddd}.total{text-align:right;font-size:24px;font-weight:800;margin-top:25px}.note{margin-top:35px;font-size:11px;color:#666}</style></head><body><main class="invoice"><div class="head"><div class="brand">FitSugar <span>PRO</span></div><div class="meta"><b>TAX INVOICE</b><br>${invoice.id}<br>${new Date(`${invoice.date}T00:00:00`).toLocaleDateString("en-IN")}</div></div><div class="bill"><div><small>BILLED TO</small><h3>${escapeHtml(safeMember.name)}</h3><p>Member ID: ${safeMember.id}</p></div><div><small>FITNESS CENTRE</small><h3>Pulse Fitness, Adyar</h3><p>Trainer: ${escapeHtml(safeMember.trainer||"Assigned trainer")}</p></div></div><table><thead><tr><th>Description</th><th>Method</th><th>Status</th><th>Amount</th></tr></thead><tbody><tr><td>${escapeHtml(safeMember.plan)} Membership</td><td>${escapeHtml(invoice.method)}</td><td>${escapeHtml(invoice.status)}</td><td>${formatMoney(invoice.amount)}</td></tr></tbody></table><div class="total">Total: ${formatMoney(invoice.amount)}</div><p class="note">Computer-generated invoice from FitSugar Pro. Please retain it for your records.</p></main></body></html>`;
  }
  function downloadInvoice(sale,member){
    const id=sale?.id||`INV-${Date.now()}`;
    downloadFile(`${id}.html`,invoiceHtml(sale,member),"text/html;charset=utf-8");
    toast(`Invoice ${id} downloaded.`);
  }
  document.getElementById("memberSearch").addEventListener("input",event=>renderMembers(event.target.value));
  document.getElementById("salesMonthFilter").addEventListener("change",renderSales);
  document.getElementById("salesEntryForm").addEventListener("submit",event=>{
    event.preventDefault();
    const data=new FormData(event.target);
    salesData.unshift({id:nextInvoiceId(),memberId:data.get("memberId"),date:data.get("date"),amount:Number(data.get("amount")),method:data.get("method"),status:data.get("status")});
    save();renderSales();event.target.reset();document.getElementById("saleDate").value=new Date().toISOString().slice(0,10);fillMemberOptions();toast("Payment added to the sales report.");
  });
  document.getElementById("modalContent").addEventListener("submit",event=>{
    if(event.target.id!=="addMemberForm")return;
    event.preventDefault();event.stopImmediatePropagation();addMember(event.target);
  },true);
  document.addEventListener("click",event=>{
    if(event.target.closest("[data-business-action='add-member']"))openMemberModal();
    const restartId=event.target.closest("[data-restart-member]")?.dataset.restartMember;
    if(restartId)window.FitSugarRestart.openForMember(memberById(restartId));
    const memberId=event.target.closest("[data-invoice-member]")?.dataset.invoiceMember;
    if(memberId){
      const sale=salesData.find(item=>item.memberId===memberId);
      downloadInvoice(sale,memberById(memberId));
    }
    const invoiceId=event.target.closest("[data-invoice-sale]")?.dataset.invoiceSale;
    if(invoiceId){
      const sale=salesData.find(item=>item.id===invoiceId);
      downloadInvoice(sale,memberById(sale?.memberId));
    }
    const exportType=event.target.closest("[data-export]")?.dataset.export;
    if(exportType==="members")exportMembers();
    if(exportType==="sales")exportSales();
  });
  document.getElementById("membershipInvoiceBtn").addEventListener("click",()=>downloadInvoice());
  window.addEventListener("fitsugar:trainer-alert",()=>renderMembers(document.getElementById("memberSearch").value));
  document.getElementById("saleDate").value=new Date().toISOString().slice(0,10);
  renderMembers();
  renderSales();
})();
