newPic.addEventListener('change', sendImage, false);

function sendImage(dropDateItem) {
	repeatDownloadErr.classList.add('hidden');
	imageLoader.style.display = 'block';
	const formData = new FormData(); 
	const request = new XMLHttpRequest();
	const fileInput = $('.hidden_input');
	
	if (dropDateItem.name) {
		formData.append('title', dropDateItem.name); 
		formData.append('image', dropDateItem); 
	} else {
		if(fileInput.files.length === 0) {
			imageLoader.style.display = 'none';
		} else {
			formData.append('title', fileInput.files[0].name); 
			formData.append('image', fileInput.files[0]); 
		};   
	};	
	request.addEventListener('error', () => console.log(request.responseText));
	request.addEventListener('load', () => { 
		if (request.status === 200) {     
			image.style.display = ''; 
			imageLoader.style.display = 'none';
			const response = JSON.parse(request.responseText);
			console.log(response); 
			window.imageID = response.id;
			resetCanvas();
			resetComment();
			wsConnect();
			setTimeout(function() { 
				canvasImageDraw.width = picture.clientWidth;
        canvasImageDraw.height = picture.clientHeight;
        canvasMask.width = picture.clientWidth;
        canvasMask.height = picture.clientHeight;
			}, 2000);
		} else {
			formatError.classList.add('hidden');
			console.log(request.responseText);
		}
	});
	request.open('POST', 'https://neto-api.herokuapp.com/pic', true); 
	request.send(formData);
};
