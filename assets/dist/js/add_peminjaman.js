$(document).ready(function () {
  $('#dvd').DataTable();
});
let setItemDVD = (id,judul,harga,stok)=>{
  let tbody = document.querySelector(`#dvd_items`)
  let jumlah_item = document.querySelector(`#jumlah_${id}`)
  let item = document.querySelector(`#item${id}`)
  let harga_sewa=harga.split('.').join('')
  
  if(jumlah_item ){
    let total =(parseInt(jumlah_item.value)+1)*harga_sewa
    item.innerHTML=`
    <td scope="col">${judul}</td>
    <td scope="col">Rp ${harga}</td>
    <td scope="col">${parseInt(jumlah_item.value)+1}</td>
    <td scope="col">Rp ${total.toLocaleString('ID')}</td>
    <input type="hidden" name="judul_item[]" required value="${judul}">
    <input type="hidden" name="jumlah_item[]" id="jumlah_${id}" required value="${parseInt(jumlah_item.value)+1}">
    <input type="hidden" name="harga_item[]" required value="${total.toLocaleString('ID')}">
    <input type="hidden" name="stok[]" value="${stok}">
    <input type="hidden" name="id[]" value="${id}">
    <td scope="col"><button type="button" class="btn btn-danger btn-sm" onclick="removeItemDVD('${id}','${judul}','${harga}')">Remove</button></td>
    `
  }else{
    let total =1*harga_sewa
    tbody.innerHTML+=`
    <tr id="item${id}">
      <td scope="col">${judul}</td>
      <td scope="col">Rp ${harga}</td>
      <td scope="col">${1}</td>
      <td scope="col">Rp ${total.toLocaleString('ID')}</td>
      <input type="hidden" name="judul_item[]" required value="${judul}">
      <input type="hidden" name="jumlah_item[]" id="jumlah_${id}" required value="${1}">
      <input type="hidden" name="harga_item[]" required value="${harga}">
      <input type="hidden" name="stok[]" value="${stok}">
      <input type="hidden" name="id[]" value="${id}">
      <td scope="col"><button type="button" class="btn btn-danger btn-sm" onclick="removeItemDVD('${id}','${judul}','${harga}')">Remove</button></td>
    </tr>
    `
  }
  minStock(id)
}

let removeItemDVD = (id,judul,harga) =>{
  let item = document.querySelector(`#item${id}`)
  let jumlah_item = document.querySelector(`#jumlah_${id}`)
  if(parseInt(jumlah_item.value)==1){
    item.remove()
  }else{
    let harga_sewa=harga.split('.').join('')
    let total =(parseInt(jumlah_item.value)-1)*harga_sewa
    jumlah_item.setAttribute('value',parseInt(jumlah_item.value)-1)
    item.innerHTML=`
    <td scope="col">${judul}</td>
    <td scope="col">Rp ${harga}</td>
    <td scope="col">${parseInt(jumlah_item.value)}</td>
    <td scope="col">Rp ${total.toLocaleString('ID')}</td>
    <input type="hidden" name="judul_item[]" required value="${judul}">
    <input type="hidden" name="jumlah_item[]" id="jumlah_${id}" required value="${parseInt(jumlah_item.value)}">
    <input type="hidden" name="harga_item[]" required value="${total.toLocaleString('ID')}">
    <td scope="col"><button type="button" class="btn btn-danger btn-sm" onclick="removeItemDVD('${id}','${judul}','${harga}')">Remove</button></td>
    `
  }
  addStock(id,judul,harga)
}

let minStock = (id)=>{
  let sisa_stok = document.querySelector(`#stok_${id}`)
  if(sisa_stok.value-1==0){
    document.querySelector(`#add_${id}`).remove()
  }
  sisa_stok.setAttribute('value',sisa_stok.value-1)
}

let addStock = (id,judul,harga)=>{
  let sisa_stok = document.querySelector(`#stok_${id}`)
  let btn_stok = document.querySelector(`#btn_${id}`)
  sisa_stok.setAttribute("value",parseInt(sisa_stok.value)+1)
  if(sisa_stok.value>0){
    btn_stok.innerHTML=`
    <button class="btn btn-success btn-sm" id="add_${id}" onclick="setItemDVD('${id}','${judul}','${harga}')">Add</button>
    `
  }
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