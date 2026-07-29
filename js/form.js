function initForm(){

    const situasi=document.getElementById("situasi");

    const deskripsi=document.getElementById("deskripsi");

    situasi.addEventListener("change",()=>{

        if(situasi.value=="K10"){

            deskripsi.disabled=true;

            deskripsi.value="";

        }else{

            deskripsi.disabled=false;

        }

    });

}
