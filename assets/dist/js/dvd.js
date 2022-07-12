$(document).ready(function () {
  $('#dvd').DataTable();
});
let setUpdate = (id,judul,harga,stok)=>{
    let u_id = document.querySelector('#u_id');
    let u_judul = document.querySelector('#u_judul');
    let u_harga = document.querySelector('#u_harga');
    let u_stok = document.querySelector('#u_stok');
    u_id.value=id;
    u_judul.value=judul;
    u_harga.value=harga;
    u_stok.value =stok;
  }