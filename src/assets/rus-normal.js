import { jsPDF } from "jspdf"
var font = 'undefined';
var callAddFont = function () {
this.addFileToVFS('rus-normal.ttf', font);
this.addFont('rus-normal.ttf', 'rus', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])
