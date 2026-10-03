const app=document.getElementById("app");
const KEY="anatomiaStatsV1";
let state={topic:"Sistema locomotore",mode:"A · Identificazione libera",difficulty:2,count:5,custom:null,qIndex:0,results:[],questions:[],stats:loadStats()};
const synonymGroups={
"arco vertebrale":["arco vertebrale","arcus vertebrae","arco posteriore"],
"processo spinoso":["processo spinoso","processus spinosus","apofisi spinosa"],
"processo trasverso":["processo trasverso","processus transversus","apofisi trasversa"],
"forame vertebrale":["forame vertebrale","foramen vertebrale","foramen vertebrale"],
"corpo vertebrale":["corpo vertebrale","corpus vertebrae","corpo della vertebra"],
"processo articolare superiore":["processo articolare superiore","processus articularis superior","faccetta articolare superiore"],
"processo articolare inferiore":["processo articolare inferiore","processus articularis inferior","faccetta articolare inferiore"]
};
function norm(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim()}
function equivalent(a,b){const x=norm(a),y=norm(b);if(x===y)return true;for(const group of Object.values(synonymGroups)){if(group.some(v=>norm(v)===x)&&group.some(v=>norm(v)===y))return true}return false}
function loadStats(){try{return JSON.parse(localStorage.getItem(KEY))||{answered:0,correct:0,mistakes:{}}}catch{return{answered:0,correct:0,mistakes:{}}}}
function saveStats(){localStorage.setItem(KEY,JSON.stringify(state.stats))}
function layout(){
app.innerHTML=
'<section class="hero"><div class="eyebrow">Anatomia 1 · simulatore di esame pratico</div><h1>Apri una cartella.<br>Estrai una tavola casuale.</h1><p>Per ogni apparato trovi una <b>cartella indipendente</b>. Il quiz pesca solo da quella cartella e mostra una tavola non etichettata con frecce numerate da riconoscere.</p></section>'+
'<section class="grid" id="topics"></section>'+
'<section class="panel"><h2>Regole del quiz</h2><p class="muted">Risposta libera, niente risposta multipla. Puoi cancellare le risposte, generare un nuovo set casuale e vedere la correzione dopo ogni tavola.</p></section>';
renderChoices();
}
function renderChoices(){
document.getElementById("topics").innerHTML=topics.map((x,i)=>{
const colors=["🦴","🧠","❤️","🫁","🫃","🫘","♂️","♀️","◉","◎","✋","👁️"];
const subs=quizBank.filter(q=>q.system===x).map(q=>q.sub).filter((v,i,a)=>a.indexOf(v)===i);
return '<button class="option folderCard '+(x===state.topic?"active":"")+'" data-topic="'+x+'"><strong>'+colors[i]+' '+x+'</strong><span>'+subs.join(" · ")+'</span><em>'+quizBank.filter(q=>q.system===x).length+' tavole disponibili</em></button>';
}).join("");
document.querySelectorAll("[data-topic]").forEach(b=>b.onclick=()=>{state.topic=b.dataset.topic;renderChoices()});
}
function modeDesc(x){return x.startsWith("A")?"Nessun aiuto, risposta libera.":x.startsWith("B")?"Possibili risposte per orientarti.":x.startsWith("C")?"Simulazione d'esame: nessun aiuto.":x.startsWith("D")?"Fa ricomparire più spesso le strutture sbagliate.":"Selezione casuale di argomenti e strutture."}
function handleAtlas(e){const f=e.target.files[0];if(!f)return;const reader=new FileReader();reader.onload=()=>{state.custom={src:reader.result,name:f.name};alert("Immagine caricata. Nella prossima versione puoi anche costruire e salvare i punti direttamente sull'immagine.");};reader.readAsDataURL(f)}
function demoSvg(q){return `<svg viewBox="0 0 800 600" role="img" aria-label="Schema anatomico non etichettato"><rect x="0" y="0" width="800" height="600" rx="18" fill="#fbf8f4"/><g stroke="#4d3328" stroke-width="5" fill="#ead8c8"><path d="M300 115 C350 70 450 70 500 115 L470 175 C460 205 480 245 535 290 L585 340 C610 365 605 410 570 425 L505 452 C480 462 460 490 450 530 L350 530 C340 490 320 462 295 452 L230 425 C195 410 190 365 215 340 L265 290 C320 245 340 205 330 175 Z"/><ellipse cx="400" cy="255" rx="82" ry="55" fill="#fffdf9"/><path d="M318 185 L482 185 M290 325 L510 325 M255 390 L545 390" fill="none"/><path d="M400 110 L400 525" fill="none" stroke-width="3"/></g>${q.markers.map((m,i)=>`<line x1="${m.x}" y1="${m.y}" x2="${m.tx}" y2="${m.ty}" stroke="#9c342f" stroke-width="3"/><circle cx="${m.x}" cy="${m.y}" r="16" fill="#9c342f"/><text x="${m.x}" y="${m.y+6}" text-anchor="middle" font-size="16" font-weight="800" fill="white">${i+1}</text>`).join("")}<text x="400" y="570" text-anchor="middle" font-size="16" fill="#806e62">SCHEMA DIDATTICO · NON IN SCALA</text></svg>`}
const demoQuestions=[{topic:"Colonna vertebrale",title:"Vertebra cervicale — riconoscimento strutture",answers:["corpo vertebrale","forame vertebrale","processo spinoso","processo trasverso","arco vertebrale"],markers:[{x:280,y:165,tx:330,ty:205},{x:400,y:255,tx:400,ty:180},{x:535,y:290,tx:500,ty:340},{x:600,y:365,tx:530,ty:390},{x:330,y:455,tx:270,ty:430}]}];

const quizBank=[
{system:"Sistema locomotore",sub:"Colonna vertebrale",title:"Vertebra cervicale tipica",diagram:"cervical",answers:["corpo vertebrale","forame vertebrale","processo spinoso","processo trasverso","faccetta articolare superiore"]},
{system:"Sistema locomotore",sub:"Colonna vertebrale",title:"Vertebra toracica",diagram:"thoracic",answers:["corpo vertebrale","processo spinoso","faccetta costale trasversa","forame vertebrale","processo articolare superiore"]},
{system:"Sistema locomotore",sub:"Colonna vertebrale",title:"Vertebra lombare",diagram:"lumbar",answers:["corpo vertebrale","forame vertebrale","processo spinoso","processo trasverso","processo articolare superiore"]},
{system:"Sistema locomotore",sub:"Arto superiore",title:"Scapola",diagram:"scapula",answers:["spina della scapola","acromion","processo coracoideo","cavità glenoidea","angolo inferiore"]},
{system:"Sistema locomotore",sub:"Arto superiore",title:"Omero — estremità prossimale",diagram:"humerus",answers:["testa dell'omero","collo anatomico","tubercolo maggiore","tubercolo minore","solco intertubercolare"]},
{system:"Sistema locomotore",sub:"Arto superiore",title:"Radio e ulna",diagram:"forearm",answers:["testa del radio","ulna","incisura trocleare","olecrano","processo stiloideo del radio"]},
{system:"Sistema locomotore",sub:"Bacino e arto inferiore",title:"Osso dell'anca",diagram:"hip",answers:["ileo","acetabolo","pube","ischio","grande incisura ischiatica"]},
{system:"Sistema locomotore",sub:"Bacino e arto inferiore",title:"Femore — estremità prossimale",diagram:"femur",answers:["testa del femore","collo del femore","grande trocantere","piccolo trocantere","linea intertrocanterica"]},
{system:"Sistema locomotore",sub:"Articolazioni",title:"Ginocchio — strutture principali",diagram:"knee",answers:["rotula","menisco mediale","menisco laterale","legamento crociato anteriore","legamento collaterale tibiale"]},

{system:"Sistema nervoso",sub:"Encefalo",title:"Emisfero cerebrale — vista laterale",diagram:"brain",answers:["lobo frontale","lobo parietale","lobo temporale","lobo occipitale","solco centrale"]},
{system:"Sistema nervoso",sub:"Encefalo",title:"Vista mediale dell'emisfero",diagram:"brainMed",answers:["corpo calloso","talamo","ipotalamo","corteccia cingolata","fornice"]},
{system:"Sistema nervoso",sub:"Tronco encefalico",title:"Tronco encefalico e cervelletto",diagram:"brainstem",answers:["mesencefalo","ponte","midollo allungato","cervelletto","peduncolo cerebrale"]},
{system:"Sistema nervoso",sub:"Midollo spinale",title:"Midollo spinale — sezione trasversale",diagram:"cord",answers:["sostanza grigia","corno posteriore","corno anteriore","sostanza bianca","canale centrale"]},
{system:"Sistema nervoso",sub:"Ventricoli e meningi",title:"Ventricoli cerebrali",diagram:"ventricles",answers:["ventricolo laterale","forame interventricolare","terzo ventricolo","acquedotto cerebrale","quarto ventricolo"]},

{system:"Apparato cardiovascolare",sub:"Cuore",title:"Cuore — faccia anteriore",diagram:"heart",answers:["atrio destro","ventricolo destro","ventricolo sinistro","aorta","tronco polmonare"]},
{system:"Apparato cardiovascolare",sub:"Cuore",title:"Cuore — sezione",diagram:"heartSec",answers:["valvola tricuspide","valvola mitrale","setto interventricolare","ventricolo sinistro","apice"]},
{system:"Apparato cardiovascolare",sub:"Arterie",title:"Arco dell'aorta",diagram:"aorta",answers:["tronco brachiocefalico","arteria carotide comune sinistra","arteria succlavia sinistra","arco dell'aorta","aorta discendente"]},
{system:"Apparato cardiovascolare",sub:"Vene",title:"Sistema delle vene cave",diagram:"veins",answers:["vena cava superiore","vena cava inferiore","atrio destro","vene brachiocefaliche","seno coronario"]},

{system:"Apparato respiratorio",sub:"Laringe e trachea",title:"Laringe — vista anteriore",diagram:"larynx",answers:["epiglottide","cartilagine tiroidea","cartilagine cricoide","trachea","cartilagine aritenoide"]},
{system:"Apparato respiratorio",sub:"Bronchi",title:"Albero bronchiale",diagram:"bronchi",answers:["trachea","bronco principale destro","bronco principale sinistro","bronchioli","alveoli"]},
{system:"Apparato respiratorio",sub:"Polmoni",title:"Polmoni — lobi e scissure",diagram:"lungs",answers:["lobo superiore destro","lobo medio destro","lobo inferiore destro","lingula","scissura obliqua"]},
{system:"Apparato respiratorio",sub:"Pleure",title:"Pleura e cavità pleurica",diagram:"pleura",answers:["pleura viscerale","pleura parietale","cavità pleurica","polmone","diaframma"]},

{system:"Apparato digerente",sub:"Bocca ed esofago",title:"Canale alimentare — tratto superiore",diagram:"upperGI",answers:["cavità orale","faringe","epiglottide","esofago","cardias"]},
{system:"Apparato digerente",sub:"Stomaco",title:"Stomaco",diagram:"stomach",answers:["cardias","fondo","corpo","antro pilorico","piloro"]},
{system:"Apparato digerente",sub:"Intestino tenue",title:"Duodeno e intestino tenue",diagram:"smallIntestine",answers:["duodeno","digiuno","ileo","valvola ileocecale","mesentere"]},
{system:"Apparato digerente",sub:"Colon",title:"Intestino crasso",diagram:"colon",answers:["cieco","colon ascendente","colon trasverso","colon discendente","sigma"]},
{system:"Apparato digerente",sub:"Fegato e pancreas",title:"Fegato e vie biliari",diagram:"liver",answers:["lobo destro","lobo sinistro","colecisti","coledoco","vena porta"]},
{system:"Apparato digerente",sub:"Fegato e pancreas",title:"Pancreas",diagram:"pancreas",answers:["testa","collo","corpo","coda","dotto pancreatico principale"]},

{system:"Apparato urinario",sub:"Rene",title:"Rene — faccia anteriore",diagram:"kidney",answers:["polo superiore","polo inferiore","margine laterale","ilo renale","uretere"]},
{system:"Apparato urinario",sub:"Rene",title:"Rene — sezione frontale",diagram:"kidneySec",answers:["corticale","midollare","piramide renale","calice minore","pelvi renale"]},
{system:"Apparato urinario",sub:"Nefrone",title:"Nefrone — schema",diagram:"nephron",answers:["corpuscolo renale","glomerulo","tubulo contorto prossimale","ansa di Henle","dotto collettore"]},
{system:"Apparato urinario",sub:"Vie urinarie",title:"Uretere e vescica",diagram:"urinary",answers:["uretere","vescica urinaria","trigono vescicale","uretra","ostio ureterale"]},

{system:"Apparato genitale maschile",sub:"Testicolo",title:"Testicolo — sezione",diagram:"testis",answers:["tunica albuginea","lobulo testicolare","tubulo seminifero","rete testis","epididimo"]},
{system:"Apparato genitale maschile",sub:"Vie genitali",title:"Vie genitali maschili",diagram:"maleTract",answers:["epididimo","dotto deferente","vescicola seminale","dotto eiaculatore","prostata"]},
{system:"Apparato genitale maschile",sub:"Prostata",title:"Prostata e strutture circostanti",diagram:"prostate",answers:["vescica urinaria","prostata","uretra prostatica","vescicola seminale","retto"]},

{system:"Apparato genitale femminile",sub:"Ovaio",title:"Ovaio — sezione",diagram:"ovary",answers:["corticale","midollare","follicolo ovarico","corpo luteo","ilo ovarico"]},
{system:"Apparato genitale femminile",sub:"Utero",title:"Utero — sezione sagittale",diagram:"uterus",answers:["fondo uterino","corpo dell'utero","cervice","cavità uterina","canale cervicale"]},
{system:"Apparato genitale femminile",sub:"Tuba uterina",title:"Tuba uterina",diagram:"tube",answers:["infundibolo","fimbrie","ampolla","istmo","porzione uterina"]},

{system:"Sistema endocrino",sub:"Ipotalamo-ipofisi",title:"Regione ipotalamo-ipofisaria",diagram:"pituitary",answers:["ipotalamo","adenoipofisi","neuroipofisi","infundibolo","chiasma ottico"]},
{system:"Sistema endocrino",sub:"Tiroide",title:"Tiroide",diagram:"thyroid",answers:["lobo destro","lobo sinistro","istmo","polo superiore","polo inferiore"]},
{system:"Sistema endocrino",sub:"Surrene",title:"Ghiandola surrenale — sezione",diagram:"adrenal",answers:["corticale","midollare","capsula","zona glomerulare","vena centrale"]},

{system:"Sistema linfatico",sub:"Linfonodo",title:"Linfonodo — sezione",diagram:"node",answers:["capsula","corteccia","midollare","ilo","seno sottocapsulare"]},
{system:"Sistema linfatico",sub:"Milza",title:"Milza — schema",diagram:"spleen",answers:["capsula","polpa bianca","polpa rossa","ilo","arteria splenica"]},
{system:"Sistema linfatico",sub:"Timo",title:"Timo",diagram:"thymus",answers:["capsula","corticale","midollare","lobulo timico","corpuscolo di Hassall"]},

{system:"Apparato tegumentario",sub:"Cute",title:"Cute — sezione",diagram:"skin",answers:["epidermide","derma","ipoderma","ghiandola sudoripara","follicolo pilifero"]},
{system:"Apparato tegumentario",sub:"Pelo",title:"Follicolo pilifero",diagram:"hair",answers:["fusto del pelo","bulbo pilifero","papilla dermica","ghiandola sebacea","muscolo erettore del pelo"]},
{system:"Apparato tegumentario",sub:"Unghia",title:"Apparato ungueale",diagram:"nail",answers:["lamina ungueale","matrice","letto ungueale","lunula","eponichio"]},

{system:"Organi di senso",sub:"Occhio",title:"Bulbo oculare — sezione",diagram:"eye",answers:["cornea","iride","cristallino","retina","nervo ottico"]},
{system:"Organi di senso",sub:"Orecchio esterno e medio",title:"Orecchio — tratto esterno e medio",diagram:"ear",answers:["padiglione auricolare","condotto uditivo esterno","membrana timpanica","martello","tuba uditiva"]},
{system:"Organi di senso",sub:"Orecchio interno",title:"Orecchio interno",diagram:"innerEar",answers:["coclea","vestibolo","canali semicircolari","nervo vestibolococleare","stapes"]}
];
function buildQuestions(){let pool=quizBank.filter(q=>q.system===state.topic||state.topic==="Sistema locomotore"&&q.system==="Sistema locomotore");if(state.mode.startsWith("E"))pool=quizBank;return shuffle(pool).slice(0,state.count);
}
function startExam(){state.qIndex=0;state.results=[];state.questions=buildQuestions();renderQuestion()}
function renderQuestion(){
const q=state.questions[state.qIndex], p=Math.round((state.qIndex/state.questions.length)*100);
app.innerHTML='<div class="exam-head"><div><div class="eyebrow">'+state.topic+' · '+q.sub+'</div><h2>'+q.title+'</h2></div><div><b>'+(state.qIndex+1)+'/'+state.questions.length+'</b></div></div><div class="progress"><i style="width:'+p+'%"></i></div><div class="exam-grid"><div class="image-card"><div class="plate-title">TAVOLA ANATOMICA · NON ETICHETTATA · SCHEMA DIDATTICO</div>'+demoSvg(q)+'</div><div class="answer-card"><h3>Completa i nomi delle strutture</h3><p class="muted">Il numero nella tavola corrisponde alla casella con lo stesso numero. Scrivi il nome anatomico in forma libera.</p>'+q.answers.map((a,i)=>'<div class="answer"><label><span class="answer-number">'+(i+1)+'</span> Struttura indicata</label><input autocomplete="off" data-answer="'+i+'" placeholder="Scrivi il nome..."></div>').join("")+'<div class="actions"><button class="btn light" id="clear">CANCELLA RISPOSTE</button><button class="btn outline" id="new">NUOVO QUIZ</button><button class="btn gold" id="submit">CORREGGI →</button><button class="btn light" id="home">CARTELLA</button></div><p class="tiny-note">Le tavole sono schematiche per allenare il riconoscimento. Confrontale sempre con il tuo atlante Anastasi.</p></div></div>';
document.getElementById("clear").onclick=()=>document.querySelectorAll("[data-answer]").forEach(x=>x.value="");
document.getElementById("new").onclick=()=>{state.qIndex=0;state.results=[];state.questions=buildQuestions();renderQuestion()};
document.getElementById("submit").onclick=()=>grade(q);
document.getElementById("home").onclick=layout;
}
function grade(q){const inputs=[...document.querySelectorAll("[data-answer]")];const res=inputs.map((el,i)=>({answer:el.value.trim(),correct:equivalent(el.value,q.answers[i]),expected:q.answers[i]}));state.results.push(res);state.stats.answered+=res.length;res.forEach(r=>{if(r.correct)state.stats.correct++;else state.stats.mistakes[r.expected]=(state.stats.mistakes[r.expected]||0)+1});saveStats();renderCorrection(q,res)}
function renderCorrection(q,res){const score=res.filter(x=>x.correct).length;app.innerHTML=`<div class="panel"><div class="eyebrow">Correzione</div><div class="score">${score}/${res.length}</div><p class="muted">Ogni struttura è valutata separatamente.</p>${res.map((r,i)=>`<div class="result ${r.correct?"ok":"bad"}"><b>${r.correct?"✓":"✗"} ${i+1}. ${r.expected}</b><br>${r.correct?"Risposta riconosciuta corretta.":"Hai scritto: <em>"+(r.answer||"nessuna risposta")+"</em> · risposta corretta: <strong>"+r.expected+"</strong>"}</div>`).join("")}<div class="actions"><button class="btn gold" id="next">${state.qIndex+1<state.questions.length?"PROSSIMA DOMANDA →":"VEDI RISULTATI"}</button><button class="btn light" id="home">Torna al menu</button></div></div>`;document.getElementById("next").onclick=()=>{state.qIndex++;if(state.qIndex<state.questions.length)renderQuestion();else renderFinal()};document.getElementById("home").onclick=layout}
function renderFinal(){const total=state.results.flat().length,good=state.results.flat().filter(x=>x.correct).length;app.innerHTML=`<div class="panel"><div class="eyebrow">Simulazione terminata</div><h1>${good}/${total}</h1><p>Hai completato la sessione. Gli errori sono stati registrati localmente per la modalità revisione.</p><div class="actions"><button class="btn gold" id="again">Nuova simulazione</button><button class="btn light" id="stats">Statistiche</button></div></div>`;document.getElementById("again").onclick=layout;document.getElementById("stats").onclick=renderStats}
function renderStats(){const s=state.stats,acc=s.answered?Math.round(s.correct/s.answered*100):0;const mistakes=Object.entries(s.mistakes).sort((a,b)=>b[1]-a[1]);app.innerHTML=`<div class="panel"><div class="eyebrow">Progressi personali</div><h1>Statistiche</h1><div class="stats-row"><div class="stat"><span>Risposte</span><b>${s.answered}</b></div><div class="stat"><span>Corrette</span><b>${s.correct}</b></div><div class="stat"><span>Accuratezza</span><b>${acc}%</b></div><div class="stat"><span>Errori registrati</span><b>${Object.values(s.mistakes).reduce((a,b)=>a+b,0)}</b></div></div><h2 class="section-title">Strutture da ripassare</h2>${mistakes.length?mistakes.map(([k,v])=>`<div class="result bad"><b>${k}</b> · sbagliata ${v} volta/e</div>`).join(""):"<p class='muted'>Nessun errore registrato.</p>"}<div class="actions"><button class="btn gold" id="home">Torna al simulatore</button></div></div>`;document.getElementById("home").onclick=layout}
document.getElementById("statsBtn").onclick=renderStats;document.getElementById("resetBtn").onclick=()=>{if(confirm("Azzerare tutte le statistiche locali?")){localStorage.removeItem(KEY);state.stats=loadStats();layout()}};layout();
