document.addEventListener('DOMContentLoaded', () => {
    const imageUploadInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const descriptionTextarea = document.getElementById('description');
    const addItemLink = document.querySelector('a[href="../my_items/my_items.html"]');
    const addItemImage = document.getElementById('add_item_image');

    let isImageUploaded = false;
    let isDescriptionFilled = false;

    function updateAddItemButtonState() {
        if (isImageUploaded && isDescriptionFilled) {
            addItemImage.classList.remove('disabled');
            addItemLink.removeEventListener('click', preventDefaultAction);
        } else {
            addItemImage.classList.add('disabled');
            addItemLink.addEventListener('click', preventDefaultAction);
        }
    }

    function preventDefaultAction(event) {
        event.preventDefault();
        console.log("Description:", descriptionTextarea.value);
        console.log("Image uploaded:", isImageUploaded);
    }

    imageUploadInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Uploaded Image" style="width: 100%; height: auto;">`;
                isImageUploaded = true;
                updateAddItemButtonState();
            }
            reader.readAsDataURL(file);
        } else {
            isImageUploaded = false;
            updateAddItemButtonState();
        }
    });

    descriptionTextarea.addEventListener('input', function() {
        isDescriptionFilled = this.value.trim() !== '';
        updateAddItemButtonState();
    });

    // Initially disable the add item link if the form is incomplete
    updateAddItemButtonState();
});
