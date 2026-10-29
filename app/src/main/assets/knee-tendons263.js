// Additive review: retain every original point and the 1.49 overlays.
export function addKneeTendons(data){
 const id=149214,name='≈ Сухожилие большой приводящей мышцы',shortName='≈ Большая приводящая · сухожилие';
 data.structureNotes[id]='Дистальное сухожилие седалищно-мыщелковой части m. adductor magnus. Прикрепляется к области приводящего бугорка, проксимальнее и кзади от медиального надмыщелка бедра. На аксиальных кадрах проходит по заднемедиальной границе медиальной широкой мышцы. Не путать с началом медиальной головки икроножной мышцы, расположенным дистальнее и кзади, или с медиальной коллатеральной связкой. ≈ — ориентир топографии по JPEG, без сегментации волокон и оценки целости.';
 data.searchAliases={...data.searchAliases,[id]:'adductor magnus большая приводящая сухожилие приводящий бугорок седалищно-мыщелковая часть'};
 // Source pixels, individually reviewed at the posteromedial vastus margin.
 // Do not interpolate into frames where the distal tendon is not separable.
 const axial=[[17675,343,284],[17676,342,282],[17677,341,280],[17678,340,278],[17679,340,272]];
 for(const series of ['652-contraste_','652-contraste_dp']){
  data.seriesSlices[series]||={};
  for(const [annotation,x,y] of axial){
   const slice=data.seriesSlices[series][annotation]||={points:[],regions:[],suppress:[]};
   if(!slice.points.some(p=>p.structure===id))slice.points.push({id:263000000+annotation*2+(series.endsWith('_dp')?1:0),structure:id,name,shortName,filter:1222,category:'ligaments',x,y,approximate:true,provenance:'axial-tendon-review-2.63'});
  }
 }
 for(const slices of Object.values(data.seriesSlices))for(const slice of Object.values(slices))for(const p of slice.points||[])if(p.structure===id){p.name=name;p.shortName=shortName;}
 const notes={
  9473:'Общее сухожилие четырёхглавой мышцы прикрепляется к основанию надколенника. Компоненты широких и прямой мышц входят в его слоистое строение.',
  9507:'Сухожилие прямой мышцы бедра входит в поверхностный компонент общего сухожилия четырёхглавой мышцы.',
  9847:'Сухожильно-апоневротические волокна медиальной широкой мышцы входят в общий разгибательный аппарат и медиальный удерживатель надколенника. Это не сухожилие большой приводящей мышцы у приводящего бугорка.',
  9848:'Сухожильно-апоневротический компонент промежуточной широкой мышцы входит в глубокие слои общего сухожилия четырёхглавой мышцы.',
  9849:'Сухожильно-апоневротические волокна латеральной широкой мышцы входят в общий разгибательный аппарат и латеральный удерживатель надколенника.',
  9475:'Дистальное сухожилие полусухожильной мышцы идёт позади полуперепончатой мышцы и входит в поверхностную гусиную лапку на переднемедиальной поверхности проксимальной большеберцовой кости.',
  9474:'Сухожилие тонкой мышцы входит в поверхностную гусиную лапку; в типичном расположении лежит между портняжным и полусухожильным сухожилиями.',
  9478:'Портняжное сухожилие и апоневроз образуют поверхностный компонент гусиной лапки. Не путать с расположенными глубже сухожилиями тонкой и полусухожильной мышц.',
  9470:'Сухожилие полуперепончатой мышцы имеет прямое прикрепление к заднемедиальному отделу медиального мыщелка большеберцовой кости и дополнительные расширения. Не входит в поверхностную гусиную лапку.',
  9850:'Дистальное сухожилие двуглавой мышцы бедра прикрепляется преимущественно к головке малоберцовой кости. Не смешивать с малоберцовой коллатеральной связкой.',
 };
 for(const [key,note]of Object.entries(notes))data.structureNotes[key]=note+' Исходные точки сохранены; подпись хода не означает, что место прикрепления находится на каждом отмеченном срезе.';
 // The guide reads this object by reference; preserve its existing chapters.
 if(data.shoulderGuide){data.shoulderGuide.catalogNames[id]='Большая приводящая мышца · дистальное сухожилие';data.shoulderGuide.guideHint='Дополнительные ориентиры доступны на PD-SPIR; сухожилие большой приводящей также отмечено на аксиальных T1. ≈ — ориентировочная топография, не сегментация. Выберите структуру для пояснения и перехода к кадру.';data.shoulderGuide.structureNotes=data.structureNotes;data.shoulderGuide.searchAliases=data.searchAliases;
  data.shoulderGuide.sources.push({title:'Anatomical study of medial knee attachments (2022)',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC9365470/'},{title:'Distal adductor magnus tendon avulsion: MRI (2020)',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC7954158/'});
 }
}
