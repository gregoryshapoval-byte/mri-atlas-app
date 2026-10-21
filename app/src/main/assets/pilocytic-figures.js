import {figures as hb} from './hemangioblastoma-figures.js';
import {frame,mark,base} from './craniopharyngioma-figures.js';
export const figures={
 cyst:hb.cyst.replaceAll('AX · киста и пристеночный узел','AX · мозжечковый кистозно-солидный паттерн').replace('L78 196','L210 144'),
 solid:hb.solid,
 optic:frame('Зрительный путь · схема отношений',base+`<path d="M142 124Q164 90 195 96Q210 86 225 96Q257 90 279 124" fill="none" stroke="#ffd2a5" stroke-width="16" stroke-linecap="round"/><ellipse cx="210" cy="103" rx="27" ry="17" fill="#e8b17c" stroke="#ffd2a5" stroke-width="2"/>`+mark(1,67,144,183,102)+mark(2,341,62,246,72,'#9bafc1')+mark(3,340,231,211,194,'#9bdfc4')),
 brainstem:frame('Ствол · фокальный / экзофитный паттерн',`<text x="56" y="58" text-anchor="middle">Перед</text><text x="350" y="58" text-anchor="middle">Зад</text><path d="M132 70C130 99 149 111 151 139C157 164 143 187 145 205L160 246H133L116 204C110 181 87 170 91 142C95 115 114 104 117 70Z" fill="#36526a" stroke="#9bafc1" stroke-width="2"/><path d="M198 91C251 73 328 94 350 143C372 195 332 243 275 241Q210 249 172 214L212 150Z" fill="#36526a" stroke="#9bafc1" stroke-width="2"/><path d="M155 106L211 151L165 217Z" fill="#193e54" stroke="#82b6cb" stroke-width="2"/><path d="M122 128C104 140 111 161 127 169Q151 177 166 162Q180 145 165 133Q145 117 122 128Z" fill="#e8b17c" stroke="#ffd2a5" stroke-width="2"/>`+mark(1,57,96,129,145)+mark(2,248,76,162,144)+mark(3,304,225,185,167,'#82b6cb'))
};
