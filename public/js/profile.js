const editProfileBtn = document.querySelector("#editProfileBtn");
const closeBtn = document.querySelector("#closeBtn");
const edit_profile = document.querySelector(".edit_profile");
const selectedImage = document.querySelector("#selectedImage");
const imageStatus = document.querySelector("#imageStatus");

editProfileBtn.addEventListener("click", ()=>{

    if (edit_profile.style.display == "flex") {
        edit_profile.style.display = "none";
    } else {
        edit_profile.style.display = "flex";
        edit_profile.style.justifyContent = "center";
        edit_profile.style.alignItems = "center";
    }
})

closeBtn.addEventListener("click", ()=>{
    edit_profile.style.display = "none";
});

//image uploading
const imageUpload = document.querySelector("#imageUpload").addEventListener("click", ()=>{
    let xHttp = new XMLHttpRequest();

    xHttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            imageStatus.innerHTML = this.responseText;
            selectedImage.value = "";
        }
    }

    xHttp.open("POST", "/profile/upload");
    let formData = new FormData();

    if(selectedImage.files.length > 0){

        formData.append("image", selectedImage.files[0]);
        xHttp.send(formData);
        imageStatus.classList.remove("bg-danger");
    }else{
        imageStatus.innerHTML = "ابتدا عکسی را انتخاب کنید";
        imageStatus.classList.add("bg-danger");
    }
});

/* 
function fileCheck() {
    const file_btn = document.querySelector("#fileToUpload");
    const myForm = document.querySelector("#myForm");
  
    if ("files" in file_btn) {
      if (file_btn.files.length == 0) {
        // upload_btn.disabled = true;
        // upload_btn.style.backgroundColor = "#8999cf";
        // upload_btn.style.color = "#d1cece";
      } else {
        // upload_btn.disabled = false;
        // upload_btn.style.backgroundColor = "#4169e1";
        // upload_btn.style.color = "#fff";
        // -- submit form and send name image to json
  
        myForm.submit();
        new GetProfileData(file_btn.files[0].name);
  
        file_btn.value = "";
      }
    }
}
 */