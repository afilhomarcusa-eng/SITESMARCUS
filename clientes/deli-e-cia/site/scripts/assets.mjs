import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
const input=path.resolve('../assets');
const output=path.resolve('public/images');
await fs.mkdir(output,{recursive:true});
const sources=[
 ['hero','hero-original.png',[640,1024,1536]],
 ['bread','bread-original.png',[640,1024,1536]],
 ['coffee','coffee-original.png',[480,800,1120]],
 ['grocery','grocery-original.png',[480,800,1120]],
 ['logo','logo-original.jpg',[255]],
 ['store','salvador-shopping-original.jpg',[255]]
];
const manifest={};
for(const [id,file,widths] of sources){
 const meta=await sharp(path.join(input,file)).metadata();
 for(const width of [...new Set(widths.map(w=>Math.min(w,meta.width)))]){
  const name=id+'-'+width+'.webp';
  await sharp(path.join(input,file)).resize({width,withoutEnlargement:true}).webp({quality:id==='logo'?95:84}).toFile(path.join(output,name));
  const actual=await sharp(path.join(output,name)).metadata();
  manifest['/images/'+name]={source:file,nativeWidth:meta.width,nativeHeight:meta.height,width:actual.width,height:actual.height};
 }
 console.log(id,meta.width,meta.height);
}
await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2));
await sharp(path.join(input,'hero-original.png')).resize({width:1200,height:630,fit:'cover',position:'south',withoutEnlargement:true}).webp({quality:85}).toFile(path.join(output,'og.webp'));
