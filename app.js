function rng(seed){let s=seed%2147483647;if(s<=0)s+=2147483646;return()=> (s=s*16807%2147483647)/2147483647}
const realms=[
 {name:'練氣',max:100,years:1,life:100},
 {name:'築基',max:1000,years:2,life:220},
 {name:'金丹',max:3000,years:5,life:460},
 {name:'元嬰',max:10000,years:10,life:950},
 {name:'化神',max:30000,years:20,life:2000}
];
let state={realm:0,qi:10,age:16,life:100,brk:0,rng:rng(42)};
const storyTemplates={
  qiGain:["你閉關數月，靈氣如江海奔湧，修為精進 (+{v} 氣)","忽遇仙緣，一枚靈丹入口，霞光繚繞 (+{v} 氣)"],
  qiLoss:["心魔入體，口吐鮮血，修為大損 ({v} 氣)","真元逆行，經脈受損，修為跌落 ({v} 氣)"],
  lifeLoss:["為強行煉器燃燒精血，壽元折損 ({v})","渡劫受創，元氣大傷，壽元削減 ({v})"],
  brkGain:["頓悟天道一隅，心境突破 (+{v}% 突破率)","古碑前參悟，領悟大道之理 (+{v}% 突破率)"]
};
function story(type,v){let arr=storyTemplates[type];if(!arr)return"";let t=arr[Math.floor(state.rng()*arr.length)];return t.replace('{v}',v)}
function log(msg){const li=document.createElement('li');li.textContent=msg;document.getElementById('logList').appendChild(li)}
function updateUI(){const r=realms[state.realm];document.getElementById('realmName').textContent=r.name;document.getElementById('age').textContent=state.age;document.getElementById('life').textContent=state.life;document.getElementById('brk').textContent=state.brk;document.getElementById('qiText').textContent='靈氣:'+state.qi+' / '+r.max;document.getElementById('qiBar').style.width=Math.min(100,(state.qi/r.max*100))+'%';document.getElementById('breakBtn').disabled=state.qi<r.max}
function applyCard(c){if(c.qi){state.qi+=c.qi;log(c.qi>0?story('qiGain',c.qi):story('qiLoss',c.qi))}if(c.life){state.life+=c.life;log(story('lifeLoss',c.life))}if(c.brk){state.brk+=c.brk;log(story('brkGain',c.brk))}state.age+=realms[state.realm].years;checkEnding();document.getElementById('choicesArea').innerHTML='';updateUI()}
const cards=[
 {title:'閉關修煉',qi:50},
 {title:'走火入魔',qi:-30},
 {title:'遇到仙緣',qi:100},
 {title:'壽命消耗',life:-5},
 {title:'心境突破',brk:10}
];
function drawCards(){const area=document.getElementById('choicesArea');area.innerHTML='';let chosen=[];while(chosen.length<3){let c=cards[Math.floor(state.rng()*cards.length)];if(!chosen.includes(c))chosen.push(c)}chosen.forEach((c,idx)=>{const wrap=document.createElement('div');wrap.className='flipwrap';const flip=document.createElement('div');flip.className='flip';const back=document.createElement('div');back.className='back';back.textContent='神秘卡 '+String.fromCharCode(65+idx);const front=document.createElement('div');front.className='front';front.textContent=c.title;flip.appendChild(back);flip.appendChild(front);wrap.appendChild(flip);flip.onclick=()=>{flip.classList.add('flipped');setTimeout(()=>applyCard(c),600)};area.appendChild(wrap)})}
function tryBreak(){const r=realms[state.realm];if(state.qi<r.max)return;let chance=Math.min(95,55+state.brk);if(state.rng()*100<chance){state.realm=Math.min(realms.length-1,state.realm+1);state.qi=10;state.brk=0;state.life=realms[state.realm].life;log('雷劫轟落，你卻以無上心境渡過，踏入【'+realms[state.realm].name+'】！');if(state.realm===realms.length-1){checkEnding(true)}}else{state.qi=Math.floor(state.qi*0.7);state.age+=5;log('雷雲翻滾，真元逆流，你重傷吐血，修為跌落，壽元又折。')}updateUI();checkEnding()}
function checkEnding(forceAscend=false){if(state.qi<=0){showEnding('身死道消','靈力耗盡，道途至此結束 💀');return}if(state.age>=state.life){showEnding('壽元耗盡','油盡燈枯，壽命走到盡頭 ⏳');return}if(forceAscend){showEnding('成仙成功','天劫散盡，靈身飛升，恭喜踏入仙途 🕊️')}}
function showEnding(title,desc){document.getElementById('endingTitle').textContent=title;document.getElementById('endingDesc').textContent=desc;document.getElementById('ending').classList.remove('hidden')}
function restart(){state={realm:0,qi:10,age:16,life:realms[0].life,brk:0,rng:rng(42)};document.getElementById('logList').innerHTML='';document.getElementById('choicesArea').innerHTML='';document.getElementById('ending').classList.add('hidden');updateUI()}
function closeEnding(){document.getElementById('ending').classList.add('hidden')}
document.getElementById('drawBtn').onclick=drawCards;document.getElementById('breakBtn').onclick=tryBreak;document.getElementById('resetBtn').onclick=restart;updateUI();
