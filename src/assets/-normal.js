import { jsPDF } from "jspdf"
var font = 'undefined';
var callAddFont = function () {
this.addFileToVFS('-normal.ttf', font);
this.addFont('-normal.ttf', '', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])
