const {chromium,webkit}=require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs=require('fs');
(async()=>{
 const engine=process.argv[2]||'webkit',url=process.argv[3]||'http://127.0.0.1:5179/';
 const browser=await ({chromium,webkit}[engine]).launch({headless:true});
 const out=require('path').join(require('os').tmpdir(),'origin-hero-playback-'+engine);fs.mkdirSync(out,{recursive:true});
 for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:name==='mobile'?2:1});
  const errors=[],media=[];page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(r.url().includes('/media/'))media.push(r.url())});
  if(process.env.THROTTLE && engine==='chromium'){const cdp=await page.context().newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:80,downloadThroughput:1000000,uploadThroughput:250000});if(name==='mobile')await cdp.send('Emulation.setCPUThrottlingRate',{rate:4})}const began=Date.now();await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.hero-film.is-ready',{timeout:30000});
  const readyMs=Date.now()-began;
  await page.screenshot({path:out+'/'+name+'-opening.png'});
  const metrics=await page.evaluate(async()=>{
   const film=document.querySelector('.hero-film'),section=document.querySelector('.hero-story'),stage=document.querySelector('.hero-stage');
   const distance=section.offsetHeight-stage.offsetHeight;
   const seeks=[],gaps=[];let seekStart=0,lastFrame=0,active=true,seen=0;
   film.addEventListener('seeking',()=>{seekStart=performance.now()});film.addEventListener('seeked',()=>seeks.push(performance.now()-seekStart));
   function presented(now){if(lastFrame)gaps.push(now-lastFrame);lastFrame=now;seen++;if(active)film.requestVideoFrameCallback(presented)}
   film.requestVideoFrameCallback(presented);
   async function travel(from,to,ms){return new Promise(resolve=>{const start=performance.now();function step(now){const p=Math.min(1,(now-start)/ms);window.scrollTo({top:distance*(from+(to-from)*p),behavior:'instant'});if(p<1)requestAnimationFrame(step);else resolve()}requestAnimationFrame(step)})}
   await travel(0,1,8000);await new Promise(r=>setTimeout(r,500));
   const end={time:film.currentTime,presented:film.dataset.time,caption:document.querySelector('.film-caption')?.textContent};
   lastFrame=0;await travel(1,0,4000);await new Promise(r=>setTimeout(r,500));active=false;
   const percentile=(arr,p)=>arr.slice().sort((a,b)=>a-b)[Math.floor(arr.length*p)];
   return {duration:film.duration,seen,seekMedianMs:percentile(seeks,.5),seek95Ms:percentile(seeks,.95),frameGapMedianMs:percentile(gaps,.5),frameGap95Ms:percentile(gaps,.95),end,start:{time:film.currentTime,presented:film.dataset.time},dimensions:[film.videoWidth,film.videoHeight],quality:film.getVideoPlaybackQuality?.().droppedVideoFrames,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  for(const [i,p] of [0,.18,.4,.57,.76,.9,1].entries()){
   await page.evaluate(f=>{const s=document.querySelector('.hero-story'),st=document.querySelector('.hero-stage');window.scrollTo({top:(s.offsetHeight-st.offsetHeight)*f,behavior:'instant'})},p);await page.waitForTimeout(600);
   await page.screenshot({path:out+'/'+name+'-'+i+'.png'});
  }
  console.log(engine,name,JSON.stringify({readyMs,metrics,errors,mediaRequests:media.length,uniqueMedia:[...new Set(media)]}));if(errors.length || metrics.overflow || metrics.end.time<metrics.duration-.12 || metrics.start.time>.05 || metrics.seen<200 || metrics.frameGap95Ms>250)throw new Error('Playback regression: '+name);await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
