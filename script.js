/* ═══════════════════════════════════════════════════════════
   FOR PAHAL — Light Pink Theme JS
   Canvas hearts · Typewriter · Timer · Reasons · Reveal
   ═══════════════════════════════════════════════════════════ */

/* ── MUSIC — auto-starts on first interaction ─────────── */
;(function(){
  var btn=document.getElementById('musicBtn'),
      audio=document.getElementById('bgMusic'), on=false;

  function startMusic(){
    audio.play().then(function(){
      on=true; btn.textContent='♫'; btn.classList.add('on');
    }).catch(function(){});
  }

  // Auto-play when "Enter ♥" button is clicked
  var enterBtn=document.querySelector('.hero-enter');
  if(enterBtn){
    var origClick=enterBtn.onclick;
    enterBtn.onclick=function(e){
      startMusic();
      if(origClick) origClick.call(this,e);
      enterBtn.onclick=origClick; // restore original, only trigger music once
    };
  }

  // Fallback: try auto-play on any first touch/click
  function firstTouch(){
    if(!on) startMusic();
    document.removeEventListener('click',firstTouch);
    document.removeEventListener('touchstart',firstTouch);
  }
  document.addEventListener('click',firstTouch);
  document.addEventListener('touchstart',firstTouch);

  // Toggle button still works
  btn.onclick=function(){
    if(on){audio.pause();btn.textContent='♪';btn.classList.remove('on');on=false;}
    else{startMusic();}
  };
})();

/* ── HERO CANVAS — pink hearts + shimmer dots ─────────── */
;(function(){
  var c=document.getElementById('heroCanvas'),
      ctx=c.getContext('2d'), W, H, t=0;
  function sz(){W=c.width=innerWidth;H=c.height=innerHeight;}
  sz(); addEventListener('resize',sz);

  // Pink shaded hearts
  var colors=['#e8577d','#f28da5','#ffd1dc','#d64068','#ffb6c8'];
  var hearts=[], dots=[], i;
  for(i=0;i<28;i++) hearts.push({
    x:Math.random()*3e3, y:Math.random()*3e3,
    s:Math.random()*16+6, sp:Math.random()*.25+.06,
    o:Math.random()*.25+.08, dr:(Math.random()-.5)*.4,
    ph:Math.random()*6.28, col:colors[i%colors.length]
  });
  for(i=0;i<50;i++) dots.push({
    x:Math.random()*3e3, y:Math.random()*3e3,
    s:Math.random()*3+1, sp:Math.random()*.15+.03,
    o:Math.random()*.3+.1, ph:Math.random()*6.28
  });

  function drawHeart(x,y,sz,op,col){
    ctx.save();ctx.globalAlpha=op;ctx.fillStyle=col;
    ctx.translate(x,y);ctx.beginPath();
    var k=sz/15;
    ctx.moveTo(0,-3*k);
    ctx.bezierCurveTo(-5*k,-9*k,-15*k,-5*k,-15*k,k);
    ctx.bezierCurveTo(-15*k,9*k,0,14*k,0,17*k);
    ctx.bezierCurveTo(0,14*k,15*k,9*k,15*k,k);
    ctx.bezierCurveTo(15*k,-5*k,5*k,-9*k,0,-3*k);
    ctx.fill();ctx.restore();
  }

  ;(function loop(){
    ctx.clearRect(0,0,W,H); t+=.006;
    // shimmer dots
    dots.forEach(function(d){
      d.y-=d.sp; d.x+=Math.sin(t*2+d.ph)*.1;
      if(d.y<-4){d.y=H+4;d.x=Math.random()*W;}
      var fl=.5+Math.sin(t*3+d.ph)*.5;
      ctx.beginPath();
      ctx.arc(d.x,d.y,d.s*fl,0,Math.PI*2);
      ctx.fillStyle='rgba(255,182,200,'+(d.o*fl)+')';
      ctx.fill();
    });
    // hearts
    hearts.forEach(function(h){
      h.y-=h.sp; h.x+=Math.sin(t+h.ph)*h.dr;
      if(h.y<-30){h.y=H+30;h.x=Math.random()*W;}
      var p=1+Math.sin(t*1.5+h.ph)*.06;
      drawHeart(h.x,h.y,h.s*p,h.o,h.col);
    });
    requestAnimationFrame(loop);
  })();
})();

/* ── SCROLL REVEAL ────────────────────────────────────── */
;(function(){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('show');
        if(e.target.id==='story') typewrite();
      }
    });
  },{threshold:.1, rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.rv').forEach(function(el){obs.observe(el);});
})();

/* ── IMAGE SLIDESHOW ──────────────────────────────────── */
;(function(){
  var slides=document.querySelectorAll('.slide'),
      dotsWrap=document.getElementById('slideDots'),
      prevBtn=document.getElementById('slidePrev'),
      nextBtn=document.getElementById('slideNext'),
      cur=0, timer;

  if(!slides.length) return;

  // Create dots
  slides.forEach(function(_,i){
    var dot=document.createElement('button');
    dot.className='slide-dot'+(i===0?' active':'');
    dot.onclick=function(){goTo(i);};
    dotsWrap.appendChild(dot);
  });

  // Show first slide
  slides[0].classList.add('active');

  function goTo(n){
    slides[cur].classList.remove('active');
    dotsWrap.children[cur].classList.remove('active');
    cur=(n+slides.length)%slides.length;
    slides[cur].classList.add('active');
    dotsWrap.children[cur].classList.add('active');
    resetTimer();
  }

  prevBtn.onclick=function(){goTo(cur-1);};
  nextBtn.onclick=function(){goTo(cur+1);};

  // Auto-play every 4 seconds
  function resetTimer(){
    clearInterval(timer);
    timer=setInterval(function(){goTo(cur+1);},4000);
  }
  resetTimer();
})();

/* ── TYPEWRITER ───────────────────────────────────────── */
var lines=[
  {t:"It started with a chemistry paper. That's it. That's how we happened.",h:0},
  {t:"You leaned over, asked me for help... and honestly? I didn't even think about it. I just said yes.",h:0},
  {t:"I had no idea I was saying yes to so much more than just an answer.",h:0},
  {t:"We became friends first. Not the \"hi-bye\" kind. The kind where you talk for hours about everything and absolutely nothing.",h:0},
  {t:"Then on 11th March 2024, you texted me... 'Hie bhul hi gaye app toh hame' ...and I swear, something inside me shifted.",h:1},
  {t:"We became besties after that. The real kind. The kind you don't find twice.",h:0},
  {t:"And then came the night of 15th May 2024...",h:0},
  {t:"You sent me one message: 'AJJ SE ME TERI GF AND TU MERA BF'",h:1},
  {t:"I stared at my screen. Read it twice. Smiled like an idiot.",h:0},
  {t:"And just like that... my whole world changed. For good. Forever.",h:1}
],twDone=false;

function typewrite(){
  if(twDone) return; twDone=true;
  var box=document.getElementById('letterText');
  box.innerHTML='';
  lines.forEach(function(l,i){
    var s=document.createElement('span');
    s.className='ln'+(l.h?' hl':'');
    s.textContent=l.t;
    box.appendChild(s);
    setTimeout(function(){s.classList.add('in');},i*650+250);
  });
  var cur=document.createElement('span');
  cur.className='letter-cursor'; box.appendChild(cur);
  setTimeout(function(){
    cur.style.transition='opacity .5s';cur.style.opacity='0';
    setTimeout(function(){cur.remove();},500);
  },lines.length*650+2500);
}

/* ── LIVE TIMER ───────────────────────────────────────── */
;(function(){
  var start=new Date('2024-05-15T00:00:00');
  function tick(){
    var now=new Date(), d=now-start;
    var y=now.getFullYear()-start.getFullYear(),
        m=now.getMonth()-start.getMonth(),
        dy=now.getDate()-start.getDate();
    if(dy<0){m--;dy+=new Date(now.getFullYear(),now.getMonth(),0).getDate();}
    if(m<0){y--;m+=12;}
    var ts=Math.floor(d/1e3),
        h=Math.floor((ts%86400)/3600),
        mi=Math.floor((ts%3600)/60),
        s=ts%60;
    document.getElementById('ty').textContent=y;
    document.getElementById('tmo').textContent=m;
    document.getElementById('td').textContent=dy;
    document.getElementById('th').textContent=('0'+h).slice(-2);
    document.getElementById('tmi').textContent=('0'+mi).slice(-2);
    document.getElementById('ts').textContent=('0'+s).slice(-2);
  }
  tick(); setInterval(tick,1000);
})();

/* ── COMPATIBILITY SCORE ──────────────────────────────── */
;(function(){
  var btn=document.getElementById('compatBtn'),
      loader=document.getElementById('compatLoader'),
      bar=document.getElementById('compatBar'),
      status=document.getElementById('compatStatus'),
      result=document.getElementById('compatResult');

  var steps=[
    {pct:12, msg:'Scanning hearts... 💕'},
    {pct:28, msg:'Measuring bakchodi levels... 🤪'},
    {pct:41, msg:'Counting late-night calls... 📱'},
    {pct:55, msg:'Analyzing fight recovery speed... ⚡'},
    {pct:68, msg:'Evaluating "I\'m fine" translations... 😤'},
    {pct:79, msg:'Calculating hug frequency... 🤗'},
    {pct:88, msg:'Processing jealousy data... 👀'},
    {pct:95, msg:'Almost there... 💛'},
    {pct:100, msg:'Result ready! 🎉'}
  ];

  btn.onclick=function(){
    btn.disabled=true;
    btn.textContent='Calculating...';
    loader.style.display='block';
    status.style.display='block';
    bar.style.width='0%';

    var i=0;
    function nextStep(){
      if(i<steps.length){
        bar.style.width=steps[i].pct+'%';
        status.textContent=steps[i].msg;
        i++;
        setTimeout(nextStep, 400+Math.random()*300);
      } else {
        // Done — show result
        setTimeout(function(){
          loader.style.display='none';
          status.style.display='none';
          btn.style.display='none';
          result.style.display='block';
        },500);
      }
    }
    setTimeout(nextStep,600);
  };
})();

/* ── 30 REASONS ───────────────────────────────────────── */
var R=[
  "I love the way you understand me even when I can't explain myself.",
  "I love how you make ordinary days feel special.",
  "I love your kindness toward people, even when they don't deserve it.",
  "I love how you listen to me without judging.",
  "I love the comfort I feel just knowing you're there.",
  "I love how you believe in me, even when I doubt myself.",
  "I love your silly side and all the bakchodi we do together.",
  "I love the way you make me laugh at the worst times.",
  "I love how safe I feel when I talk to you.",
  "I love how you care about the little things.",
  "I love how you remember small details about me.",
  "I love how you make me want to be a better person.",
  "I love how you stay strong even during tough times.",
  "I love how real and honest you are.",
  "I love how you handle situations with maturity.",
  "I love how you respect my feelings.",
  "I love how you forgive, even when it's not easy.",
  "I love the way you support me in everything I do.",
  "I love how you bring peace into my life.",
  "I love how you make me feel important.",
  "I love how you express your emotions so genuinely.",
  "I love how we can talk for hours and never get bored.",
  "I love how you make me feel like I truly belong.",
  "I love how you stand by me no matter what.",
  "I love how you turn small moments into memories.",
  "I love how you trust me.",
  "I love how you handle my flaws with patience.",
  "I love how you make me smile without even trying.",
  "I love how you've become such an important part of my life.",
  "I love you simply because you are you, and that's more than enough for me."
], ri=0;

document.getElementById('rText').textContent=R[0];

document.getElementById('rBtn').onclick=function(){
  var txt=document.getElementById('rText'),
      num=document.getElementById('rNum'),
      bar=document.getElementById('rBar'),
      box=document.getElementById('rBox');
  txt.classList.add('out');
  for(var i=0;i<8;i++){
    var sp=document.createElement('div');
    sp.className='spk';
    sp.style.left=(Math.random()*80+10)+'%';
    sp.style.top=(Math.random()*50+25)+'%';
    sp.style.setProperty('--dx',(Math.random()*40-20)+'px');
    sp.style.setProperty('--dy',(Math.random()*-30-10)+'px');
    var sz=(Math.random()*5+2)+'px';
    sp.style.width=sz;sp.style.height=sz;
    box.appendChild(sp);
    setTimeout((function(el){return function(){el.remove()};})(sp),700);
  }
  setTimeout(function(){
    ri=(ri+1)%R.length;
    txt.textContent=R[ri];
    num.textContent='Reason '+(ri+1)+' of 30';
    bar.style.width=((ri+1)/30*100)+'%';
    txt.classList.remove('out');
  },420);
};
