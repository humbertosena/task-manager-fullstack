/**
* Disponibiliza filtro para aplicação de máscara para informações à serem exibidas.
*
* @author Humberto Sena Santos
*/
window.app.filter( 'taskIdMask', TaskIdMask);

function TaskIdMask() {
  'use strict';

  return function(n, len) {
    var num = parseInt(n, 10);
    len = parseInt(len, 10);
    return ( isNaN(num) || isNaN(len) || ((''+num).length>len) ) ? n : ( 1e10 + '' + num ).slice(-len);
  };

}
