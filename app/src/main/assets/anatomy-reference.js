// Anatomical reference categories. No inferred image coordinates are used.
(() => {
 const library = {
  'wrist-mri.html': [
   ['Кости и суставы', 'Лучевая кость','Локтевая кость','Ладьевидная кость','Полулунная кость','Трёхгранная кость','Гороховидная кость','Кость-трапеция','Трапециевидная кость','Головчатая кость','Крючковидная кость','Лучезапястный сустав','Среднезапястный сустав','Дистальный лучелоктевой сустав'],
   ['Связки и TFCC','Ладьевидно-полулунная связка','Полулунно-трёхгранная связка','Ладонные лучезапястные связки','Тыльные лучезапястные связки','Треугольный фиброзно-хрящевой комплекс (TFCC)','Диск TFCC','Лучелоктевые связки'],
   ['Сухожилия','Разгибатель пальцев','Длинный разгибатель большого пальца','Короткий разгибатель большого пальца','Длинная отводящая мышца большого пальца','Лучевой сгибатель запястья','Локтевой сгибатель запястья','Поверхностный сгибатель пальцев','Глубокий сгибатель пальцев'],
   ['Нервы и сосуды','Срединный нерв','Локтевой нерв','Лучевая артерия','Локтевая артерия','Запястный канал','Канал Гийона']],
  'elbow-mri.html': [
   ['Кости и суставы','Дистальный отдел плечевой кости','Блок плечевой кости','Головочка плечевой кости','Медиальный надмыщелок','Латеральный надмыщелок','Головка лучевой кости','Шейка лучевой кости','Локтевой отросток','Венечный отросток','Плечелоктевой сустав','Плечелучевой сустав','Проксимальный лучелоктевой сустав'],
   ['Связки и капсула','Локтевая коллатеральная связка','Передний пучок локтевой коллатеральной связки','Лучевая коллатеральная связка','Латеральная локтевая коллатеральная связка','Кольцевая связка лучевой кости','Суставная капсула'],
   ['Сухожилия и мышцы','Сухожилие двуглавой мышцы плеча','Сухожилие трёхглавой мышцы плеча','Общее сухожилие разгибателей','Общее сухожилие сгибателей','Плечевая мышца','Супинатор','Круглый пронатор','Плечелучевая мышца'],
   ['Нервы и сосуды','Локтевой нерв','Срединный нерв','Лучевой нерв','Плечевая артерия','Лучевая артерия','Локтевая артерия','Кубитальный канал']],
  'male-pelvis-mri.html': [
   ['Мочеполовая система','Мочевой пузырь','Шейка мочевого пузыря','Предстательная железа','Периферическая зона простаты','Переходная зона простаты','Семенные пузырьки','Семявыносящий проток','Уретра'],
   ['Кишечник и клетчатка','Прямая кишка','Мезоректум','Мезоректальная фасция','Анальный канал','Ишиоанальная ямка'],
   ['Мышцы и фасции','Мышца, поднимающая задний проход','Лобково-прямокишечная мышца','Запирательная внутренняя мышца','Грушевидная мышца','Фасция таза','Промежность'],
   ['Кости и суставы','Лобковый симфиз','Лобковая кость','Седалищная кость','Крестец','Копчик','Тазобедренный сустав'],
   ['Сосуды и нервы','Внутренняя подвздошная артерия','Наружная подвздошная артерия','Подвздошные вены','Крестцовое сплетение','Половой нерв']]
 };
 const name=location.pathname.split('/').pop();
 const groups=library[name]; if(!groups) return;
 const button=document.getElementById('anatomyGuide'); if(!button) return;
 const style=document.createElement('style');
 style.textContent=`
 .refBackdrop{position:fixed;inset:0;background:rgba(0,0,0,.62);z-index:1050;display:none}
 .refBackdrop.show{display:block}
 .refDrawer{position:absolute;right:0;top:0;bottom:0;width:min(90vw,440px);overflow:auto;background:#edf5f0;color:#1b4037;padding:18px;box-shadow:-10px 0 30px #0005}
 .refDrawer header{display:flex;align-items:center;justify-content:space-between;background:transparent;color:inherit;padding:0;margin:0 0 14px}
 .refDrawer h2{font-size:22px;margin:0;color:#183d32}
 .refDrawer button{min-height:40px;border-radius:10px;border:1px solid #b0d0c0;background:#d8ebe1;color:#204638;padding:8px 12px}
 .refDrawer input{width:100%;padding:13px;border:1px solid #b8cec3;border-radius:12px;margin:8px 0 12px;color:#173b31;background:#fff;font-size:15px;box-sizing:border-box}
 .refDrawer details{border-bottom:1px solid #bfd4ca;padding:10px 0}
 .refDrawer summary{font-weight:650;cursor:pointer;padding:8px 0}
 .refDrawer li{margin:8px 0;line-height:1.4}
 .refNote{font-size:13px;line-height:1.45;color:#526c61;margin:6px 0 12px}
 `;
 document.head.append(style);
 const backdrop=document.createElement('div');backdrop.className='refBackdrop';
 backdrop.innerHTML='<div class="refDrawer" role="dialog" aria-modal="true" aria-label="Анатомический справочник"><header><h2>Анатомия и вид</h2><button id="closeReference">✕</button></header><input id="referenceSearch" placeholder="Найти структуру…" aria-label="Поиск структур"><div class="refNote">Справочник анатомических разделов. Точные точки и цветные слои отключены, пока не подтверждена их привязка к срезам исходного атласа.</div><div id="referenceGroups"></div></div>';
 document.body.append(backdrop);
 const container=backdrop.querySelector('#referenceGroups');const search=backdrop.querySelector('#referenceSearch');
 function draw(){
   const q=search.value.toLocaleLowerCase('ru').trim();container.replaceChildren();
   let matched=0;
   for(const group of groups){
     const names=group.slice(1).filter(t=>!q||t.toLocaleLowerCase('ru').includes(q)||group[0].toLocaleLowerCase('ru').includes(q));
     if(!names.length)continue;matched+=names.length;
     const section=document.createElement('details');section.open=!!q;
     const summary=document.createElement('summary');summary.textContent=group[0]+' · '+names.length;section.append(summary);
     const ul=document.createElement('ul');
     for(const n of names){const li=document.createElement('li');li.textContent=n;ul.append(li)}
     section.append(ul);container.append(section);
   }
   if(!matched){const p=document.createElement('p');p.textContent='Ничего не найдено';container.append(p)}
 }
 draw();search.addEventListener('input',draw);
 const close=()=>{backdrop.classList.remove('show');document.body.style.overflow=''};
 button.addEventListener('click',()=>{backdrop.classList.add('show');document.body.style.overflow='hidden';search.focus()});
 backdrop.querySelector('#closeReference').addEventListener('click',close);
 backdrop.addEventListener('click',e=>{if(e.target===backdrop)close()});
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&backdrop.classList.contains('show')){e.stopPropagation();close()}},true);
})();
