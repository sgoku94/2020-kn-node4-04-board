function onDelete(id){
  confirm('정말로 삭제하시겠습니다?') ? location.href='/board/delete/'+id : "";
};