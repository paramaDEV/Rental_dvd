$(document).ready(function () {
  $('#admin').DataTable();
});

let setUpdate = (id,nama,username,password)=>{
  let u_id = document.querySelector('#u_id');
  let u_nama = document.querySelector('#u_nama');
  let u_username = document.querySelector('#u_username');
  let u_password = document.querySelector('#u_password');
  u_id.value=id;
  u_nama.value=nama;
  u_username.value=username;
  u_password.value =password;
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