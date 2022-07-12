$(document).ready(function () {
  $('#dvd').DataTable();
});

let index = 1

let setItemDVD = (id,judul,harga)=>{
  let tbody = document.querySelector(`#dvd_items`)
  let harga_sewa=harga.split('.').join('')
  let total =1*harga_sewa
  tbody.innerHTML+=`
  <tr id="item${id}_${index}">
    <td scope="col">${judul}</td>
    <td scope="col">Rp ${harga}</td>
    <td scope="col">${1}</td>
    <td scope="col">Rp ${total.toLocaleString('ID')}</td>
    <input type="hidden" name="judul_item[]" required value="${judul}">
    <input type="hidden" name="jumlah_item[]" required value="${1}">
    <input type="hidden" name="harga_item[]" required value="${harga}">
    <td scope="col"><button type="button" class="btn btn-danger btn-sm" onclick="removeItemDVD('${id}','${index}','${judul}','${harga}')">Remove</button></td>
  </tr>
  `
  index++
  minStock(id)
}

let removeItemDVD = (id,index,judul,harga) =>{
  document.querySelector(`#item${id}_${index}`).remove()
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

let submitFom = name =>{
    document.forms[name].submit();
}