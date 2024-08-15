document.addEventListener('DOMContentLoaded', () => {
    const imageUploadInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const descriptionTextarea = document.getElementById('description');
    const addItemLink = document.querySelector('a[href="../my_items"]');
    const addItemImage = document.getElementById('add_item_image');
    const categorySelect = document.getElementById('category');

    let isImageUploaded = false;
    let isDescriptionFilled = false;

    function updateAddItemButtonState() {
        if (isImageUploaded && isDescriptionFilled) {
            addItemImage.classList.remove('disabled');
            addItemImage.removeEventListener('click', preventDefaultAction);
        } else {
            addItemImage.classList.add('disabled');
            addItemImage.addEventListener('click', preventDefaultAction);
        }
    }

    function preventDefaultAction(event) {
        event.preventDefault();
        console.log("Description:", descriptionTextarea.value);
        console.log("Image uploaded:", isImageUploaded);
    }

    imageUploadInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
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

    descriptionTextarea.addEventListener('input', function () {
        isDescriptionFilled = this.value.trim() !== '';
        updateAddItemButtonState();
    });

    // Initially disable the add item link if the form is incomplete
    updateAddItemButtonState();

    addItemImage.addEventListener('click', function (event) {
        if (!isImageUploaded || !isDescriptionFilled) {
            event.preventDefault();
            alert('Please upload an image and fill out the description.');
            return;
        }

        const formData = new FormData();
        formData.append('Category', categorySelect.value);
        formData.append('Description', descriptionTextarea.value);
        formData.append('Image', imageUploadInput.files[0]);

        fetch('/add_new_item', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('הפריט נוסף בהצלחה!');
                window.location.href = '../my_items';
            } else {
                alert('הפריט לא נוסף: ' + data.error);
            }
        })
        .catch(error => {
            console.error('הפריט לא נוסף:', error);
            alert('An error occurred while adding the item. Please try again.');
        });
    });
});
