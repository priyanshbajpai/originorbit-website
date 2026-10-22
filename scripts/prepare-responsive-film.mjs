// Build sharp scroll stills from 2560px frames extracted from the supplied 4K movie.
// SHARP_PATH can point to Codex's bundled sharp module on this workstation.
import { createRequire } from 'node:module';
import { mkdir, readdir, copyFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH || 'sharp');
const source = process.argv[2] || '/tmp/origin-final-v2-stills';
const output = 'public/media/final-v2';
const frames = (await readdir(source)).filter(name => /\d{3}\.jpg$/.test(name)).sort();
if (frames.length !== 239) throw new Error(`Expected 239 frames, found ${frames.length}`);
const duration = 19.834;
const camera = [
  [0,.72,.43],[2.8,.72,.43],[4.8,.59,.55],[7.2,.57,.68],
  [10,.54,.66],[12.8,.53,.62],[13.5,.52,.51],[17.6,.55,.54],[duration,.61,.54],
];
function at(time) {
  let right = camera.findIndex(([when]) => when >= time);
  if (right < 1) return camera[Math.max(0,right)].slice(1);
  const a=camera[right-1],b=camera[right],t=(time-a[0])/(b[0]-a[0]),e=t*t*(3-2*t);
  return [a[1]+(b[1]-a[1])*e,a[2]+(b[2]-a[2])*e];
}
const grade = { brightness:.84, saturation:.93 };
for (const variant of ['desktop','mobile']) await mkdir(join(output,variant),{recursive:true});
for(let n=0;n<frames.length;n+=4){
  await Promise.all(frames.slice(n,n+4).map(async(name,offset)=>{
    const index=n+offset,input=join(source,name),out=name.replace('.jpg','.webp');
    await sharp(input).resize({width:1800}).modulate(grade).webp({quality:82,effort:4}).toFile(join(output,'desktop',out));
    const metadata=await sharp(input).metadata(),[focus,fraction]=at(index/(frames.length-1)*duration);
    const width=Math.round(metadata.width*fraction),left=Math.max(0,Math.min(metadata.width-width,Math.round(metadata.width*focus-width/2)));
    await sharp(input).extract({left,top:0,width,height:metadata.height}).resize({width:960}).modulate(grade).webp({quality:80,effort:4}).toFile(join(output,'mobile',out));
  }));
  if(n%40===0) console.log(`Prepared ${n}/${frames.length}`);
}
await copyFile(join(output,'desktop','000.webp'),join(output,'poster-desktop.webp'));
const phone=sharp(join(output,'mobile','000.webp'));
const meta=await phone.metadata(),canvasHeight=2078,pictureHeight=Math.min(Math.round(canvasHeight*.54),meta.height);
const cropTop=Math.max(0,Math.round((meta.height-pictureHeight)*.36));
const image=await phone.extract({left:0,top:cropTop,width:960,height:pictureHeight}).toBuffer();
await sharp({create:{width:960,height:canvasHeight,channels:3,background:'#030405'}})
  .composite([{input:image,left:0,top:canvasHeight-pictureHeight}])
  .webp({quality:82,effort:4}).toFile(join(output,'poster-mobile.webp'));
await sharp(join(source,'222.jpg')).resize({width:1800}).modulate(grade).webp({quality:84,effort:4}).toFile('public/media/studio-film-v2.webp');
for(const film of ['film-desktop.mp4','film-mobile.mp4']) await copyFile(join('public/media/final-v1',film),join(output,film));
await writeFile(join(output,'manifest.json'),JSON.stringify({duration,frameCount:frames.length,framesPerSecond:12,desktopWidth:1800,mobileWidth:960,source:'4K final film'},null,2));
