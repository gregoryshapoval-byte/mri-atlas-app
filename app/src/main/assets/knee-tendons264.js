import {kneeTendons,tendonLandmarks,tendonSources} from './knee-tendons264-data.js';

export function addKneeTendonReview(data){
 if(data.kneeTendonAtlas)return;
 data.kneeTendonAtlas=kneeTendons;
 const noteFor=id=>kneeTendons.find(e=>e.structures.includes(+id));
 const describe=e=>`Начало: ${e.origin} Ход: ${e.course} Прикрепление: ${e.insertion} Не перепутать: ${e.pitfall} В этом наборе: ${e.coverage}`;
 for(const e of kneeTendons)for(const id of e.structures){
  data.structureNotes[id]=describe(e)+(+id>=149000?' ≈ — ориентировочная топография области; границы сухожилия и энтезы не сегментированы.':'');
  data.searchAliases[id]=[data.searchAliases[id]||'',e.title,e.origin,e.insertion,e.id.replaceAll('-',' ')].join(' ');
 }
 // Correct semantic overstatement in historical overlays, retaining coordinates.
 const renamed={
  149211:['≈ Медиальная икроножная · проксимальное сухожилие, ход','≈ Медиальная икроножная · сухожилие'],
  149212:['≈ Латеральная икроножная · проксимальное сухожилие, ход','≈ Латеральная икроножная · сухожилие'],
  149213:['≈ Подошвенная · область мышечно-сухожильного перехода','≈ Подошвенная · переход']
 };
 for(const slices of Object.values(data.seriesSlices))for(const slice of Object.values(slices))for(const p of slice.points||[])if(renamed[p.structure]){
  [p.name,p.shortName]=renamed[p.structure];
 }
 let markerId=264000000;
 for(const [id,m]of Object.entries(tendonLandmarks)){
  const e=noteFor(id);data.structureNotes[id]=describe(e)+' ≈ — ориентировочный топографический ориентир области по исходным JPEG; точные границы энтезы не сегментированы.';
  for(const [se,annotation,x,y]of m.rows)for(const suffix of ['_','_dp']){
   const sid=se+'-contraste'+suffix;
   data.seriesSlices[sid]||={};const slice=data.seriesSlices[sid][annotation]||={points:[],regions:[],suppress:[]};
   slice.points.push({id:markerId++,structure:+id,name:'≈ '+m.title,shortName:'≈ '+m.short,filter:1222,category:'ligaments',x,y,approximate:true,provenance:'knee-tendon-review-2.64'});
  }
 }
 // Avoid showing two names over the same small structure. Source points stay
 // selectable; the review layer only collapses known coincident presentations.
 data.pointReview||={};data.pointReview.coincident||={};
 const equivalents={264204:[2332],264205:[2308],264213:[2307]};
 for(const [sid,slices]of Object.entries(data.seriesSlices))for(const [an,slice]of Object.entries(slices))for(const p of slice.points||[]){
  if(!equivalents[p.structure])continue;
  for(const old of data.slices[an]?.points||[])if(equivalents[p.structure].includes(old.structure)&&Math.hypot(old.x-p.x,old.y-p.y)<=14){
   data.pointReview.coincident[sid]||={};data.pointReview.coincident[sid][an]||={};data.pointReview.coincident[sid][an][old.structure]=[p.structure];
  }
 }
 const guide=data.shoulderGuide;
 if(guide){
  for(const [id,m]of Object.entries(tendonLandmarks))guide.catalogNames[id]=m.title;
  guide.catalogNames[149211]='Медиальная икроножная · ход проксимального сухожилия';
  guide.catalogNames[149212]='Латеральная икроножная · ход проксимального сухожилия';
  guide.catalogNames[149213]='Подошвенная · область мышечно-сухожильного перехода';
  guide.guideChapters.push(['Добавленные места начала и прикрепления · ревизия 2.64',Object.keys(tendonLandmarks).map(Number)]);
  guide.structureNotes=data.structureNotes;guide.searchAliases=data.searchAliases;
  guide.guideHint='Полный разбор сухожилий расположен выше: начало, ход, прикрепление и переходы к кадрам разных плоскостей. ≈ — ориентир области; не точная граница энтезы.';
  for(const source of Object.values(tendonSources))if(!guide.sources.some(s=>s.url===source.url))guide.sources.push(source);
 }
}
