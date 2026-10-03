// Public data only. Neither private repository names nor account credentials are saved.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const login = 'MatyanKass';
const out = resolve(root, 'assets');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const api = endpoint => JSON.parse(execFileSync('gh', ['api', endpoint], {encoding:'utf8', maxBuffer:8_000_000}));
const shortDate = date => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',timeZone:'Europe/Kiev'}).toUpperCase();
const cached = process.argv.includes('--cached');
let data;
if (cached) {
  data = JSON.parse(readFileSync(resolve(out,'github-data.json'),'utf8'));
} else {
  const account = api(`users/${login}`);
  const repos=[];
  for(let page=1;;page++) {
    const batch=api(`users/${login}/repos?type=owner&per_page=100&page=${page}`);
    if(batch.some(r=>r.private)) throw new Error('Private repositories must never enter the public dataset.');
    repos.push(...batch);
    if(batch.length<100) break;
  }
  const response=await fetch(`https://github.com/users/${login}/contributions`,{headers:{'User-Agent':`${login}-public-profile`}});
  if(!response.ok) throw new Error(`Public calendar: HTTP ${response.status}`);
  const html=await response.text();
  const cells=[];
  for(const match of html.matchAll(/<td\b[^>]*data-date="([\d-]+)"[^>]*id="([^"]+)"[^>]*>/g)) cells.push({date:match[1],id:match[2]});
  const tips=new Map();
  for(const match of html.matchAll(/<tool-tip\b[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g)) {
    const text=match[2].replace(/<[^>]*>/g,'').trim();
    const count=text.match(/^(No|[\d,]+) contributions? on /);
    if(count) tips.set(match[1],count[1]==='No'?0:Number(count[1].replaceAll(',','')));
  }
  if(cells.length<350 || cells.some(c=>!tips.has(c.id))) throw new Error('Unexpected public calendar markup; preserving the previous widgets.');
  const days=cells.map(c=>({date:c.date,count:tips.get(c.id)})).sort((a,b)=>a.date.localeCompare(b.date));
  const totalText=html.replace(/<[^>]*>/g,' ').match(/([\d,]+)\s+contributions?\s+in the last year/);
  if(!totalText) throw new Error('Missing verified calendar total.');
  const total=Number(totalText[1].replaceAll(',',''));
  const lastYear=days.slice(-365);
  if(lastYear.reduce((s,d)=>s+d.count,0)!==total) throw new Error('Public calendar total does not match daily contributions.');
  const query=`query { user(login: "${login}") { contributionsCollection { commitContributionsByRepository(maxRepositories: 100) { repository { isPrivate } contributions(first: 1) { totalCount } } } } }`;
  const graphql=JSON.parse(execFileSync('gh',['api','graphql','-f',`query=${query}`],{encoding:'utf8',maxBuffer:8_000_000}));
  if(graphql.errors) throw new Error('Unable to verify public commit contributions.');
  const publicCommits=graphql.data.user.contributionsCollection.commitContributionsByRepository.filter(r=>!r.repository.isPrivate).reduce((s,r)=>s+r.contributions.totalCount,0);
  const languages={};
  for(const repo of repos.filter(r=>!r.fork)) {
    const bytes=api(`repos/${login}/${repo.name}/languages`);
    for(const [name,size] of Object.entries(bytes)) languages[name]=(languages[name]||0)+size;
  }
  const sum=Object.values(languages).reduce((s,v)=>s+v,0);
  const active=lastYear.filter(d=>d.count>0);
  let longest=0,run=0;
  for(const day of lastYear) { run=day.count?run+1:0;longest=Math.max(longest,run); }
  const history=lastYear.slice(-28);
  const weekly=Array.from({length:12},(_,i)=>lastYear.slice(-84+i*7,-84+(i+1)*7||undefined).reduce((s,d)=>s+d.count,0));
  data={schemaVersion:1,login,scope:'public',syncedAt:new Date().toISOString(),calendarThrough:lastYear.at(-1).date,
    publicRepositories:account.public_repos,followers:account.followers,stars:repos.reduce((s,r)=>s+r.stargazers_count,0),
    contributions:total,publicCommits,activeDays:active.length,longestStreak:longest,days:lastYear,history,weekly,
    languages:Object.entries(languages).sort((a,b)=>b[1]-a[1]).map(([name,bytes])=>({name,bytes,percentage:Number((bytes/sum*100).toFixed(3))})),
    projects:repos.filter(r=>r.name!==login&&!r.fork&&!r.archived).sort((a,b)=>b.pushed_at.localeCompare(a.pushed_at)).slice(0,3).map(r=>({name:r.name,url:r.html_url,description:r.description||'',language:r.language,pushedAt:r.pushed_at})),
    sourceUrls:[`https://github.com/users/${login}/contributions`,`https://api.github.com/users/${login}`,`https://api.github.com/users/${login}/repos`]
  };
}
mkdirSync(out,{recursive:true});
writeFileSync(resolve(out,'github-data.json'),JSON.stringify(data,null,2)+'\n');
mkdirSync(resolve(root,'docs'),{recursive:true});
writeFileSync(resolve(root,'docs/github-data.json'),JSON.stringify(data,null,2)+'\n');
const updateLabel=new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Europe/Kiev'}).format(new Date(data.syncedAt)).toUpperCase();
const colors=['#a855f7','#e879f9','#7dd3fc','#c084fc','#f9a8d4','#8b8fa9'];
const defs=`<defs>
<linearGradient id="bg" x2="1" y2="1"><stop stop-color="#141021"/><stop offset="1" stop-color="#080710"/></linearGradient>
<linearGradient id="glass" x2="1" y2="1"><stop stop-color="#ffffff" stop-opacity=".06"/><stop offset="1" stop-color="#c084fc" stop-opacity=".025"/></linearGradient>
<linearGradient id="accent" x2="1" y2="1"><stop stop-color="#9333ea"/><stop offset=".5" stop-color="#c084fc"/><stop offset="1" stop-color="#e879f9"/></linearGradient>
<linearGradient id="bar" y1="1" y2="0" x2="0"><stop stop-color="#6d28d9"/><stop offset=".65" stop-color="#c084fc"/><stop offset="1" stop-color="#f0abfc"/></linearGradient>
<radialGradient id="disc"><stop stop-color="#161025"/><stop offset=".3" stop-color="#100c1c"/><stop offset="1" stop-color="#06050c"/></radialGradient>
<radialGradient id="cloud"><stop stop-color="#9333ea" stop-opacity=".23"/><stop offset="1" stop-color="#9333ea" stop-opacity="0"/></radialGradient>
<filter id="glow"><feGaussianBlur stdDeviation="3"/></filter>
</defs>`;
const text=(x,y,value,size=14,color='#b9b0d0',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${esc(value)}</text>`;
const rect=(x,y,w,h,r=14,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#glass)" stroke="#c084fc" stroke-opacity=".17" ${extra}/>`;
function frame(w,h,title,body,styles='') {
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">Public GitHub data for ${login}, updated ${esc(updateLabel)} Kyiv time. ${data.contributions} contributions and ${data.activeDays} active days in the last year. ${data.publicRepositories} public repositories, ${data.stars} stars and ${data.followers} followers.</desc>${defs}<style>text{font-family:'Segoe UI',Arial,sans-serif}.mono{font-family:Consolas,'Liberation Mono',monospace}.spin{animation:spin 18s linear infinite;transform-box:fill-box;transform-origin:center}.beat{animation:beat 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center bottom}.orbit{animation:beat 4s ease-in-out infinite}.ship{animation:ship 12s ease-in-out infinite}.enemy{animation:enemy 4s ease-in-out infinite}.shot{animation:shot 4s linear infinite;transform-box:fill-box;transform-origin:center}${styles}@keyframes spin{to{transform:rotate(360deg)}}@keyframes beat{0%,100%{opacity:.6}50%{opacity:1}}@keyframes ship{0%,100%{transform:translateX(-60px)}50%{transform:translateX(60px)}}@keyframes enemy{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}@keyframes shot{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}70%,100%{transform:translateY(-115px);opacity:0}}@media(prefers-reduced-motion:reduce){.spin,.beat,.orbit,.ship,.enemy,.shot{animation:none}.shot{display:none}}</style><rect x=".5" y=".5" width="${w-1}" height="${h-1}" rx="22" fill="url(#bg)" stroke="#c084fc" stroke-opacity=".3"/><ellipse cx="${w*.8}" cy="30" rx="${w*.5}" ry="220" fill="url(#cloud)"/>${body}</svg>`;
}
function deck(cx,cy,r,value,label,sub) {
 let s=`<g><circle cx="${cx}" cy="${cy}" r="${r+12}" fill="none" stroke="#c084fc" stroke-opacity=".16"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#disc)" stroke="#c084fc" stroke-opacity=".3"/>`;
 for(let a=r-9;a>r*.4;a-=8) s+=`<circle cx="${cx}" cy="${cy}" r="${a}" fill="none" stroke="#c084fc" stroke-opacity=".045"/>`;
 s+=`<g class="spin"><circle cx="${cx}" cy="${cy}" r="${r-4}" fill="none" stroke="url(#accent)" stroke-width="2" stroke-dasharray="${r*.72} ${r*.35} ${r*.24} ${r*4.97}"/><circle cx="${cx}" cy="${cy-r+4}" r="3" fill="#e879f9"/></g>`;
 s+=text(cx,cy+13,value,r*.47,'#f5f2fb','font-weight="600" text-anchor="middle"')+text(cx,cy+r*.46,label,10,'#c084fc','class="mono" letter-spacing="1" text-anchor="middle"')+text(cx,cy+r+42,sub,13,'#b9b0d0','text-anchor="middle"')+'</g>';
 return s;
}
function meter(x,y,w,h) {
 const counts=data.history,max=Math.max(1,...counts.map(d=>d.count)),step=w/counts.length;
 let s='';
 counts.forEach((d,i)=>{const bh=d.count?14+(h-14)*d.count/max:3,bx=x+i*step;
 s+=`<rect x="${bx.toFixed(2)}" y="${y-h}" width="${(step-5).toFixed(2)}" height="${h}" rx="3" fill="#c084fc" fill-opacity=".045"/>`;
 s+=`<rect ${d.count?'class="beat"':''} style="animation-delay:${-(i%5)*.35}s" x="${bx.toFixed(2)}" y="${y-bh}" width="${(step-5).toFixed(2)}" height="${bh}" rx="3" fill="${d.count?'url(#bar)':'#31233e'}"><title>${d.date}: ${d.count} contributions</title></rect>`;
 });
 return s+text(x,y+24,shortDate(counts[0].date),10,'#847aa0','class="mono"')+text(x+w,y+24,shortDate(counts.at(-1).date),10,'#847aa0','class="mono" text-anchor="end"');
}
function metric(x,y,w,value,label,sub) {return rect(x,y,w,86)+text(x+18,y+34,value,27,'#f5f2fb','font-weight="600"')+text(x+18,y+56,label,11,'#c084fc','class="mono" letter-spacing=".6"')+text(x+18,y+74,sub,10,'#847aa0');}
function languageBar(x,y,w,mobile) {
 const langs=data.languages,total=langs.reduce((s,l)=>s+l.bytes,0);let start=x,s='';
 langs.forEach((l,i)=>{const width=l.bytes/total*w;s+=`<rect x="${start}" y="${y}" width="${width}" height="7" fill="${colors[i%colors.length]}"><title>${esc(l.name)}: ${l.percentage}%</title></rect>`;start+=width;});
 langs.slice(0,6).forEach((l,i)=>{const tx=x+(mobile?(i%2)*250:i%3*w/3),ty=y+28+Math.floor(i/(mobile?2:3))*26;
 const percentage=l.percentage<.1?'\u003c0.1':l.percentage.toFixed(1);
 s+=`<circle cx="${tx+4}" cy="${ty-5}" r="3" fill="${colors[i]}"/>`+text(tx+16,ty,`${l.name} ${percentage}%`,12,'#b9b0d0');});
 return s;
}
function mixer(mobile=false) {
 const w=mobile?560:1120,h=mobile?910:594;let s=text(32,39,'GITHUB // MIXER',14,'#f5f2fb','class="mono" letter-spacing="1.6"');
 s+=text(w-32,39,'PUBLIC DATA',10,'#c084fc','class="mono" text-anchor="end" letter-spacing="1"')+`<path d="M32 58H${w-32}" stroke="#c084fc" stroke-opacity=".15"/>`;
 if(mobile) {
 s+=deck(147,169,78,data.contributions,'CONTRIBUTIONS','LAST YEAR')+deck(413,169,78,data.activeDays,'ACTIVE DAYS','LAST YEAR');
 s+=text(32,308,'ACTIVITY CHANNEL / 28 DAYS',11,'#c084fc','class="mono" letter-spacing="1"')+meter(32,419,496,82);
 s+=metric(32,469,240,data.publicRepositories,'PUBLIC REPOS','owned by this account')+metric(288,469,240,data.stars,'STARS RECEIVED','public repositories');
 s+=metric(32,571,240,data.publicCommits,'PUBLIC COMMITS','last year')+metric(288,571,240,data.longestStreak,'BEST STREAK','consecutive days / last year');
 s+=text(32,702,'LANGUAGE MIX / PUBLIC CODE BYTES',11,'#c084fc','class="mono"')+languageBar(32,723,496,true);
 s+=text(32,851,`SYNC ${updateLabel} / KYIV`,11,'#b9b0d0','class="mono"')+text(32,876,'Bars reflect daily counts. Glow is decorative motion.',10,'#847aa0');
 } else {
 s+=deck(171,174,83,data.contributions,'CONTRIBUTIONS','LAST YEAR')+deck(949,174,83,data.activeDays,'ACTIVE DAYS','LAST YEAR');
 s+=rect(317,86,486,204)+text(340,117,'ACTIVITY CHANNEL / 28 DAYS',11,'#c084fc','class="mono" letter-spacing="1"')+meter(341,239,438,89);
 const metrics=[[data.publicRepositories,'PUBLIC REPOS','owned by this account'],[data.stars,'STARS RECEIVED','public repositories'],[data.publicCommits,'PUBLIC COMMITS','last year'],[data.longestStreak,'BEST STREAK','consecutive days / last year']];
 metrics.forEach((m,i)=>s+=metric(32+i*268,329,252,...m));
 s+=text(32,455,'LANGUAGE MIX / PUBLIC CODE BYTES',11,'#c084fc','class="mono" letter-spacing=".7"')+languageBar(32,475,1056,false);
 s+=text(32,566,`SYNC ${updateLabel} / KYIV`,11,'#b9b0d0','class="mono"')+text(1088,566,'Daily counts · animated glow · updates every 6h',10,'#847aa0','text-anchor="end"');
 }
 return frame(w,h,'MatyanKass: real GitHub statistics in a DJ mixer',s);
}
function alien(cx,y,size=5) {
 const pixels=['00100100','00011000','00111100','01111110','11011011','11111111','10100101','00100100'];
 let s='';pixels.forEach((row,dy)=>[...row].forEach((bit,dx)=>{if(bit==='1')s+=`<rect x="${cx-4*size+dx*size}" y="${y+dy*size}" width="${size}" height="${size}" rx=".7"/>`;}));return s;
}
function arcade(mobile=false) {
 const w=mobile?560:1120,h=mobile?416:344,active=data.days.filter(d=>d.count>0).slice(-7);let s=text(32,39,'CONTRIBUTION INVADERS',14,'#f5f2fb','class="mono" letter-spacing="1"');
 s+=text(w-32,39,'ACTIVITY REPLAY',10,'#c084fc','class="mono" text-anchor="end"');
 s+=text(32,73,`${data.activeDays} active days / ${data.contributions} contributions in the last year`,mobile?13:14,'#b9b0d0');
 const boardY=mobile?97:95,boardH=mobile?228:159;s+=rect(32,boardY,w-64,boardH,14);
 for(let i=0;i<29;i++)s+=`<circle cx="${52+((i*131)%(w-100))}" cy="${boardY+14+(i*43)%(boardH-28)}" r="${i%3===0?1.2:.7}" fill="#c084fc" opacity="${i%4*.1+.08}"/>`;
 active.forEach((day,i)=>{const cx=64+(w-128)*(i+.5)/Math.max(1,active.length),ay=boardY+24;
 s+=`<g class="enemy" style="animation-delay:${-i*.7}s" fill="${colors[i%colors.length]}">${alien(cx,ay,mobile?5:4)}</g>`;
 s+=text(cx,ay+61,shortDate(day.date),10,'#b9b0d0','class="mono" text-anchor="middle"')+text(cx,ay+80,`HP ${day.count}`,11,'#c084fc','class="mono" text-anchor="middle"');
 });
 const sy=boardY+boardH-23;
 s+=`<g class="ship"><path d="M${w/2-18} ${sy+8}v-7h8v-8h6v-8h8v8h6v8h8v7z" fill="url(#accent)"/><rect class="shot" x="${w/2-1.5}" y="${sy-18}" width="3" height="13" rx="1.5" fill="#f0abfc"/></g>`;
 s+=text(32,boardY+boardH+31,'Each invader = one active day. HP = contributions.',12,'#b9b0d0');
 s+=text(32,h-28,'ARROWS / WASD · SPACE · TOUCH',11,'#847aa0','class="mono"')+text(w-32,h-28,'PLAY ARCADE ↗',12,'#e9d5ff','class="mono" text-anchor="end"');
 return frame(w,h,'Contribution Invaders: an arcade replay of real public contribution days',s);
}
writeFileSync(resolve(out,'github-mixer.svg'),mixer());
writeFileSync(resolve(out,'github-mixer-mobile.svg'),mixer(true));
writeFileSync(resolve(out,'contribution-invaders.svg'),arcade());
writeFileSync(resolve(out,'contribution-invaders-mobile.svg'),arcade(true));
const readmePath=resolve(root,'README.md');
const recent=data.projects.map(r=>`  <a href="${esc(r.url)}">${esc(r.name)}</a> — ${esc(r.description.slice(0,180)||r.language||'Public project')}<br />`).join('\n');
const block=`<!-- RECENT-WORK:START -->\n<p align="center">\n  <b>Recent public work</b><br />\n${recent||'  New public projects will appear here.'}\n</p>\n<!-- RECENT-WORK:END -->`;
const readme=readFileSync(readmePath,'utf8');
if(!readme.includes('<!-- RECENT-WORK:START -->')||!readme.includes('<!-- RECENT-WORK:END -->')) throw new Error('README recent-work markers are missing.');
writeFileSync(readmePath,readme.replace(/<!-- RECENT-WORK:START -->[\s\S]*?<!-- RECENT-WORK:END -->/,block));
console.log(JSON.stringify({scope:data.scope,repositories:data.publicRepositories,contributions:data.contributions,activeDays:data.activeDays,languages:data.languages.map(l=>l.name),updated:data.syncedAt}));
