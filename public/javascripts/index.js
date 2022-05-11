/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInput');
const browseBtn = document.querySelector('#browseBtn');

const bgProgress = document.querySelector('.bg-progress');
const progressPercent = document.querySelector('#progressPercent');
const progressContainer = document.querySelector('.progress-container');
const progressBar = document.querySelector('.progress-bar');
const resStatus = document.querySelector('.status');

const sharingContainer = document.querySelector('.sharing-container');
const copyURLBtn = document.querySelector('#copyURLBtn');
const fileURL = document.querySelector('#fileURL');
const emailForm = document.querySelector('#emailForm');
const toast = document.querySelector('.toast');

const baseURL = 'http://localhost:8080';
const maxAllowedSize = 100 * 1024 * 1024; // 100mb

browseBtn.addEventListener('click', () => {
    fileInput.click();
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    //   console.log("dropped", e.dataTransfer.files[0].name);
    const { files } = e.dataTransfer;
    if (files.length === 1) {
        if (files[0].size < maxAllowedSize) {
            fileInput.files = files;
            uploadFile();
        } else {
            showToast('Max file size is 100MB');
        }
    } else if (files.length > 1) {
        showToast("You can't upload multiple files");
    }
    dropZone.classList.remove('dragged');
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragged');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragged');
    console.log('drag ended');
});

// file input change and uploader
fileInput.addEventListener('change', () => {
    if (fileInput.files[0].size > maxAllowedSize) {
        showToast('Max file size is 100MB');
        fileInput.value = ''; // reset the input
        return;
    }
    uploadFile();
});

// sharing container listeners
copyURLBtn.addEventListener('click', () => {
    fileURL.select();
    document.execCommand('copy');
    showToast('Copied to clipboard');
});

fileURL.addEventListener('click', () => {
    fileURL.select();
});

const uploadFile = () => {
    console.log('file added uploading');

    files = fileInput.files;
    const formData = new FormData();
    formData.append('share_file', files[0]);

    // show the uploader
    progressContainer.style.display = 'block';

    // upload file
    const xhr = new XMLHttpRequest();

    // listen for upload progress
    xhr.upload.onprogress = function (event) {
        // find the percentage of uploaded
        const percent = Math.round((100 * event.loaded) / event.total);
        progressPercent.innerText = percent;
        const scaleX = `scaleX(${percent / 100})`;
        bgProgress.style.transform = scaleX;
        progressBar.style.transform = scaleX;
    };

    // handle error
    xhr.upload.onerror = function () {
        showToast(`Error in upload: ${xhr.status}.`);
        fileInput.value = ''; // reset the input
    };

    // listen for response which will give the link
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            onFileUploadSuccess(xhr.responseText);
        }
    };

    xhr.open('POST', `${baseURL}/files`);
    xhr.send(formData);
};

const onFileUploadSuccess = (res) => {
    fileInput.value = ''; // reset the input
    resStatus.innerText = 'Uploaded';

    // remove the disabled attribute from form btn & make text send
    emailForm[2].removeAttribute('disabled');
    emailForm[2].innerText = 'Send';
    progressContainer.style.display = 'none'; // hide the box

    const result = JSON.parse(res);
    if (result.success) {
        sharingContainer.style.display = 'block';
        fileURL.value = result.link;
        showToast('File uploaded successfully');
    } else {
        showToast(result.message);
    }
};

emailForm.addEventListener('submit', (e) => {
    e.preventDefault(); // stop submission

    // disable the button
    emailForm[2].setAttribute('disabled', 'true');
    emailForm[2].innerText = 'Sending';
    const url = fileURL.value;
    const id = url.split('/').splice(-1, 1)[0];

    const formData = {
        emailTo: emailForm.elements['to-email'].value,
        emailFrom: emailForm.elements['from-email'].value,
    };

    fetch(`${baseURL}/files/${id}/email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                showToast(data.message);
                sharingContainer.style.display = 'none'; // hide the box
            } else {
                showToast(data.message);
            }
        })
        .catch(() => {
            showToast('Internal Server Error');
        });
});

let toastTimer;
// the toast function
const showToast = (msg) => {
    clearTimeout(toastTimer);
    toast.innerText = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
};
