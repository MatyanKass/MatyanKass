import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const logo = readFileSync(resolve(root, 'assets/yudui.png')).toString('base64');
const hero = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1120" height="448" viewBox="0 0 1120 448" role="img" aria-labelledby="title desc">
  <title id="title">MatyanKass — Small details. A better desktop.</title>
  <desc id="desc">A personal space inspired by YudUi: violet aurora, glass surfaces, a pixel angel and gentle orbital motion. Currently building YudUi.</desc>
  <defs>
    <linearGradient id="surface" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171026"/><stop offset=".52" stop-color="#0b0714"/><stop offset="1" stop-color="#130c20"/></linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c084fc" stop-opacity=".5"/><stop offset=".45" stop-color="#c084fc" stop-opacity=".1"/><stop offset="1" stop-color="#e879f9" stop-opacity=".4"/></linearGradient>
    <linearGradient id="pearl" x1="0" y1="0" x2="1" y2=".4"><stop stop-color="#f5f2fb"/><stop offset=".48" stop-color="#d9c8ef"/><stop offset="1" stop-color="#f0c9f6"/></linearGradient>
    <linearGradient id="neon" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#9333ea"/><stop offset=".45" stop-color="#a855f7"/><stop offset="1" stop-color="#d946ef"/></linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#bba7f2" stop-opacity=".09"/><stop offset=".55" stop-color="#ffffff" stop-opacity=".015"/><stop offset="1" stop-color="#e879f9" stop-opacity=".065"/></linearGradient>
    <linearGradient id="trace" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#c084fc" stop-opacity="0"/><stop offset=".48" stop-color="#c084fc" stop-opacity=".7"/><stop offset="1" stop-color="#e879f9" stop-opacity="0"/></linearGradient>
    <radialGradient id="violet"><stop stop-color="#9333ea" stop-opacity=".52"/><stop offset="1" stop-color="#9333ea" stop-opacity="0"/></radialGradient>
    <radialGradient id="pink"><stop stop-color="#d946ef" stop-opacity=".26"/><stop offset="1" stop-color="#d946ef" stop-opacity="0"/></radialGradient>
    <radialGradient id="blue"><stop stop-color="#5288ff" stop-opacity=".17"/><stop offset="1" stop-color="#5288ff" stop-opacity="0"/></radialGradient>
    <filter id="glow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="3"/></filter>
    <pattern id="brushed" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><path d="M0 0V8" stroke="#f5f2fb" stroke-opacity=".018"/></pattern>
    <clipPath id="canvas"><rect x="1" y="1" width="1118" height="446" rx="24"/></clipPath>
  </defs>
  <style>
    text { font-family: 'Segoe UI', Arial, sans-serif; }
    .mono { font-family: Consolas, 'Liberation Mono', monospace; }
    .aurora { animation: drift 18s ease-in-out infinite alternate; }
    .aurora-pink { animation: drift 22s ease-in-out -9s infinite alternate-reverse; }
    .float { animation: float 7s ease-in-out infinite; }
    .satellite { transform-origin: 888px 221px; animation: orbit 32s linear infinite; }
    .pulse { animation: pulse 5s ease-in-out infinite; }
    .spark { animation: twinkle 6s ease-in-out infinite; }
    .spark-late { animation-delay: -3s; }
    .scan { animation: scan 10s ease-in-out infinite; }
    @keyframes drift { to { transform: translate(28px, 16px); opacity: .7; } }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    @keyframes orbit { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { opacity:.55; } 50% { opacity:1; } }
    @keyframes twinkle { 0%,100% { opacity:.2; } 50% { opacity:.8; } }
    @keyframes scan { 0%,20% { transform:translateX(-260px); opacity:0; } 40% { opacity:.6; } 65%,100% { transform:translateX(1100px); opacity:0; } }
    @media (prefers-reduced-motion: reduce) { .aurora,.aurora-pink,.float,.satellite,.pulse,.spark,.scan { animation:none; } .scan { display:none; } }
  </style>
  <g clip-path="url(#canvas)">
    <rect width="1120" height="448" fill="url(#surface)"/>
    <ellipse class="aurora" cx="700" cy="40" rx="475" ry="275" fill="url(#violet)"/>
    <ellipse class="aurora-pink" cx="1050" cy="380" rx="400" ry="255" fill="url(#pink)"/>
    <ellipse cx="115" cy="390" rx="330" ry="220" fill="url(#blue)"/>
    <rect width="1120" height="448" fill="url(#brushed)"/>
    <g class="mono" fill="#c084fc" fill-opacity=".12" font-size="12">
      <text x="611" y="99">&gt;</text><text x="672" y="191">^</text><text x="1050" y="108">o</text><text x="1062" y="352">&lt;</text><text x="626" y="350">v</text><text x="966" y="432">+</text><text x="398" y="408">&lt;</text><text x="575" y="58">+</text>
    </g>
    <g fill="none" transform="rotate(-23 888 221)">
      <ellipse cx="888" cy="221" rx="314" ry="143" stroke="#c084fc" stroke-opacity=".12"/>
      <ellipse cx="888" cy="221" rx="337" ry="161" stroke="#c084fc" stroke-opacity=".055"/>
    </g>
    <g class="satellite">
      <circle cx="1100" cy="221" r="6" fill="#c084fc" opacity=".35" filter="url(#glow)"/>
      <circle cx="1100" cy="221" r="2" fill="#e9d5ff"/>
    </g>
    <g fill="#e9d5ff">
      <circle class="spark" cx="690" cy="88" r="1.5"/><circle class="spark spark-late" cx="1080" cy="294" r="1.2"/><circle class="spark" cx="692" cy="374" r="1.2"/>
      <path class="spark spark-late" d="M1042 51v8m-4-4h8" fill="none" stroke="#c084fc" stroke-width="1"/>
    </g>
    <path d="M32 64H1088" stroke="#d9c8ef" stroke-opacity=".1"/>
    <text x="64" y="41" class="mono" font-size="11" letter-spacing="2" fill="#b9b0d0">MATYANKASS / PERSONAL SPACE</text>
    <circle cx="1012" cy="37" r="4" fill="#e879f9" fill-opacity=".7"/><circle cx="1031" cy="37" r="4" fill="#c084fc" fill-opacity=".6"/><circle cx="1050" cy="37" r="4" fill="#a855f7" fill-opacity=".5"/>
    <text x="61" y="188" font-size="74" font-weight="600" letter-spacing="-3.7" fill="url(#pearl)">MatyanKass</text>
    <text x="64" y="233" font-size="25" fill="#b9b0d0">Small details. A better desktop.</text>
    <rect x="64" y="274" width="191" height="38" rx="19" fill="#a855f7" fill-opacity=".1" stroke="#c084fc" stroke-opacity=".27"/>
    <circle class="pulse" cx="84" cy="293" r="4" fill="#c084fc"/>
    <circle class="pulse" cx="84" cy="293" r="8" fill="#a855f7" opacity=".2" filter="url(#glow)"/>
    <text x="98" y="298" class="mono" font-size="12" letter-spacing=".65" fill="#e9d5ff">BUILDING YUDUI</text>
    <text x="65" y="351" font-size="15" fill="#847aa0">Interfaces with character. Motion with purpose.</text>
    <g class="float">
      <rect x="749" y="87" width="286" height="289" rx="24" fill="#0b0714" fill-opacity=".68"/>
      <rect x="749" y="87" width="286" height="289" rx="24" fill="url(#glass)" stroke="url(#edge)"/>
      <image x="773" y="99" width="238" height="238" xlink:href="data:image/png;base64,${logo}"/>
      <path d="M777 341H1007" stroke="#c084fc" stroke-opacity=".15"/>
      <text x="777" y="360" font-size="14" font-weight="600" fill="#f5f2fb">YudUi</text>
      <text x="1007" y="359" class="mono" font-size="9" letter-spacing="1.1" text-anchor="end" fill="#b9b0d0">DESKTOP / REIMAGINED</text>
    </g>
    <path d="M64 391H1056" stroke="#c084fc" stroke-opacity=".13"/>
    <path class="scan" d="M64 391H294" stroke="url(#trace)" stroke-width="1.5"/>
    <text x="64" y="420" class="mono" font-size="11" letter-spacing="1.5" fill="#b9b0d0">BUILD / EXPERIMENT / REPEAT</text>
    <text x="1056" y="420" class="mono" font-size="10" letter-spacing="1.4" text-anchor="end" fill="#847aa0">MADE OF IDEAS &amp; LITTLE DETAILS</text>
  </g>
  <rect x=".5" y=".5" width="1119" height="447" rx="24" fill="none" stroke="url(#edge)"/>
</svg>`;
writeFileSync(resolve(root, 'assets/hero.svg'), hero);
console.log(`Built hero.svg (${Buffer.byteLength(hero).toLocaleString()} bytes)`);

const mobileDefs = hero.match(/<defs>[\s\S]*?<\/defs>/)[0]
  .replace('width="1118" height="446" rx="24"', 'width="558" height="618" rx="24"');
const mobileStyles = hero.match(/<style>[\s\S]*?<\/style>/)[0]
  .replace('transform-origin: 888px 221px', 'transform-origin: 280px 350px');
const mobile = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="560" height="620" viewBox="0 0 560 620" role="img" aria-labelledby="title desc">
  <title id="title">MatyanKass — Small details. A better desktop.</title>
  <desc id="desc">A violet personal space inspired by YudUi. An animated pixel angel card, gentle aurora, and orbital particles. Building YudUi.</desc>
  ${mobileDefs}${mobileStyles}
  <g clip-path="url(#canvas)">
    <rect width="560" height="620" fill="url(#surface)"/>
    <ellipse class="aurora" cx="360" cy="85" rx="320" ry="250" fill="url(#violet)"/>
    <ellipse class="aurora-pink" cx="510" cy="480" rx="300" ry="245" fill="url(#pink)"/>
    <ellipse cx="30" cy="550" rx="300" ry="270" fill="url(#blue)"/>
    <rect width="560" height="620" fill="url(#brushed)"/>
    <text x="28" y="40" class="mono" font-size="11" letter-spacing="2" fill="#b9b0d0">PERSONAL SPACE</text>
    <circle cx="478" cy="36" r="4" fill="#e879f9" fill-opacity=".7"/><circle cx="497" cy="36" r="4" fill="#c084fc" fill-opacity=".6"/><circle cx="516" cy="36" r="4" fill="#a855f7" fill-opacity=".5"/>
    <path d="M28 60H532" stroke="#d9c8ef" stroke-opacity=".1"/>
    <text x="280" y="132" text-anchor="middle" font-size="60" font-weight="600" letter-spacing="-3" fill="url(#pearl)">MatyanKass</text>
    <text x="280" y="172" text-anchor="middle" font-size="22" fill="#b9b0d0">Small details. A better desktop.</text>
    <text x="280" y="201" text-anchor="middle" font-size="15" fill="#847aa0">Interfaces with character.</text>
    <g fill="none" transform="rotate(-25 280 350)">
      <ellipse cx="280" cy="350" rx="247" ry="128" stroke="#c084fc" stroke-opacity=".14"/>
      <ellipse cx="280" cy="350" rx="267" ry="148" stroke="#c084fc" stroke-opacity=".06"/>
    </g>
    <g class="satellite"><circle cx="525" cy="350" r="6" fill="#c084fc" opacity=".35" filter="url(#glow)"/><circle cx="525" cy="350" r="2" fill="#e9d5ff"/></g>
    <g class="mono" fill="#c084fc" fill-opacity=".18" font-size="14"><text x="82" y="275">&gt;</text><text x="459" y="303">^</text><text x="82" y="445">+</text><text x="450" y="455">o</text></g>
    <g class="float">
      <rect x="148" y="227" width="264" height="267" rx="24" fill="#0b0714" fill-opacity=".68"/>
      <rect x="148" y="227" width="264" height="267" rx="24" fill="url(#glass)" stroke="url(#edge)"/>
      <image x="170" y="239" width="220" height="220" xlink:href="data:image/png;base64,${logo}"/>
      <path d="M171 459H389" stroke="#c084fc" stroke-opacity=".15"/>
      <text x="280" y="482" text-anchor="middle" font-size="16" font-weight="600" fill="#f5f2fb">YudUi</text>
    </g>
    <rect x="177" y="523" width="206" height="40" rx="20" fill="#a855f7" fill-opacity=".1" stroke="#c084fc" stroke-opacity=".27"/>
    <circle class="pulse" cx="198" cy="543" r="4" fill="#c084fc"/>
    <circle class="pulse" cx="198" cy="543" r="8" fill="#a855f7" opacity=".2" filter="url(#glow)"/>
    <text x="213" y="548" class="mono" font-size="13" letter-spacing=".7" fill="#e9d5ff">BUILDING YUDUI</text>
    <text x="280" y="597" text-anchor="middle" class="mono" font-size="12" letter-spacing="1.5" fill="#b9b0d0">BUILD / EXPERIMENT / REPEAT</text>
    <path class="spark spark-late" d="M95 342v8m-4-4h8" fill="none" stroke="#c084fc" stroke-width="1"/>
  </g>
  <rect x=".5" y=".5" width="559" height="619" rx="24" fill="none" stroke="url(#edge)"/>
</svg>`;
writeFileSync(resolve(root, 'assets/hero-mobile.svg'), mobile);
console.log(`Built hero-mobile.svg (${Buffer.byteLength(mobile).toLocaleString()} bytes)`);
