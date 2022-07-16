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

let confirmForm = name=>{
  Swal.fire({
    title: 'Apakah anda yakin ?',
    text: "Pastikan data sudah benar !",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      document.forms[name].submit();
    }
  })
}