import {parksTypes,jamesGrades,renderClassifications} from './perianal-classifications.js';
// Educational diagrams only: no simulated pathology is painted on normal MRI.
const guide=document.querySelector('#perianalGuide'),button=document.createElement('button');button.className='perianalGuideButton';button.textContent='Свищи · памятка';button.onclick=()=>guide.showModal();document.querySelector('.viewerTop').append(button);
document.querySelector('#closePerianalGuide').onclick=()=>guide.close();guide.addEventListener('click',e=>{if(e.target===guide)guide.close()});
renderClassifications(document.querySelector('#parksDiagrams'),parksTypes,'Parks');
renderClassifications(document.querySelector('#jamesDiagrams'),jamesGrades,'St James');
