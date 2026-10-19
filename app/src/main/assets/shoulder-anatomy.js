// Separate augmentation: original shoulder JSON, images and coordinates stay intact.
export async function addShoulderAnatomy(data){
 const res=await fetch('shoulder-pd-anatomy.json');if(!res.ok)throw Error('shoulder anatomy');const extra=await res.json();
 data.filters.shoulder.push(...extra.filters);data.structureNotes={...data.structureNotes,...extra.structureNotes};data.displayNames=extra.displayNames;data.seriesSlices=extra.seriesSlices;data.shoulderGuide=extra;
 try{const key=data.storageKey+':r143';if(!localStorage.getItem(key)){const saved=JSON.parse(localStorage.getItem(data.storageKey));if(saved?.groups?.shoulder){saved.groups.shoulder=[...new Set([...saved.groups.shoulder,14301])];localStorage.setItem(data.storageKey,JSON.stringify(saved))}localStorage.setItem(key,'1')}}catch{}
}
export function shoulderGuide(layer,box){
 if(!layer.data.shoulderGuide)return;
 const section=document.createElement('details');section.className='shoulderGuide';const summary=document.createElement('summary');summary.textContent=layer.data.shoulderGuide.guideTitle||'Связки, аксиллярный карман и сумки · подробнее';section.append(summary);
 const hint=document.createElement('p');hint.textContent='Дополнительные ориентиры доступны на PD-SPIR. ≈ и пунктир — ожидаемая топография, не сегментация. Нажми на название, чтобы прочитать описание и перейти к контрольному срезу.';section.append(hint);
 const chapters=layer.data.shoulderGuide.guideChapters||[['Связки плеча',[9863,9864,9865,1620,1596,1601,1604,1605,1597,1621]],['Аксиллярный карман',[143201,143202,143203,143204,143205,143206]],['Сумки и подсухожильная область',[143101,143102,143103]]];
 for(const [title,ids]of chapters){const sub=document.createElement('details'),head=document.createElement('summary');head.textContent=title;sub.append(head);
  for(const id of ids){let found;const candidates=[layer.v.series,...layer.data.seriesIndex.filter(s=>s!==layer.v.series&&/_dp(?:fs)?$/.test(s.id))];
   for(const s of candidates){const matches=[];s.frames.forEach((f,index)=>{const base=layer.data.slices[f.annotation]?.points||[],extra=layer.data.seriesSlices?.[s.id]?.[f.annotation];const p=[...base.filter(p=>!extra?.suppress?.includes(p.structure)),...(extra?.points||[]),...(extra?.regions||[])].find(p=>p.structure===id);if(p)matches.push({p,s,index})});if(matches.length){found=matches[Math.floor(matches.length/2)];break}}
   const row=document.createElement('details'),name=document.createElement('summary');name.textContent=layer.data.shoulderGuide.catalogNames?.[id]||layer.data.displayNames?.[id]||found?.p.name||String(id);row.append(name);const note=document.createElement('p');note.textContent=layer.data.structureNotes[id];row.append(note);
   if(found){const button=document.createElement('button');button.textContent='Показать · '+found.s.title+' · '+(found.index+1);button.onclick=()=>{layer.active().add(found.p.filter);layer.hiddenStructures.delete(id);layer.on=layer.names=layer.markers=layer.masks=true;layer.v.select.value=found.s.id;layer.v.select.onchange();layer.selected=id;layer.v.move(found.index);layer.syncSwitches();layer.controls.close()};row.append(button)}else{const missing=document.createElement('p');missing.textContent='Отдельная покадровая метка не добавлена.';row.append(missing)}sub.append(row);
  }section.append(sub);
 }
 const refs=document.createElement('details'),refTitle=document.createElement('summary');refTitle.textContent='Литература и ограничения';refs.append(refTitle);for(const source of layer.data.shoulderGuide.sources||[]){const p=document.createElement('p'),a=document.createElement('a');a.textContent=source.title;a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';p.append(a);refs.append(p)}section.append(refs);
 const limits=document.createElement('p');limits.textContent=layer.data.shoulderGuide.limitations.join(' ');refs.append(limits);box.append(section);
}
