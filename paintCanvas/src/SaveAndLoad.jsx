import Message from './Message'

class SaveAndLoad {
    constructor(){
        this.id = null
    }
    
    async save(shapes, canvas, name){
        console.log(shapes)
        if (this.id == null)
            await this.saveJsonWithoutID(name, shapes)
        else
            await this.saveJsonWithID(name, shapes)

        await this.sendCanvasImage(canvas)
    }

    load(){
        
    }

    setName(){

    }

    async sendCanvasImage(canvas) {
        // Step 1: Convert canvas to a base64 image string
        const dataUrl = canvas.toDataURL("image/png"); // You can use "image/jpeg" or another format if preferred
        
        // Step 2: Convert base64 string to Blob (so it can be sent as a file)
        const byteString = atob(dataUrl.split(',')[1]); // Get the raw binary data
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
    
        const blob = new Blob([arrayBuffer], { type: 'image/png' }); // Or 'image/jpeg' if using JPEG format
    
        // Step 3: Create FormData and append the file
        const formData = new FormData();
        formData.append("file", blob, "drawing.png"); // Name of the field should match the backend @RequestParam("file")
    
        // Step 4: Send the image as a POST request with the ID
        const url = 'http://localhost:8080/drawings/' + this.id + '/image' // Replace with your actual backend URL
        console.log("image sent to" + url)
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });
    
            // Handle the response
            if (response.ok) {
                const result = await response.json();
                console.log('Image sent successfully:', result);
            } else {
                console.error('Error sending image:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

    async saveJsonWithoutID(name, shapes){
        const newMssg = new Message("tester name", shapes)
        console.log(newMssg)
        const url = 'http://localhost:8080/drawings/json'
        console.log("saving to: " + url)
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newMssg.name,
                    shapes: newMssg.shapes
                }),
            });    
            if (response.ok) {
                const result = await response.json();
                this.id = result.id
                console.log(this.id)
                console.log('Message sent successfully:', result);
            } else {
                console.error('Error sending message:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

    async saveJsonWithID(name, shapes){
        const newMssg = new Message("tester name", shapes)
        const url = 'http://localhost:8080/drawings/' + this.id + '/json'
        console.log("saving to: " + url)
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newMssg.name,
                    shapes: newMssg.shapes
                }),
            });    
            if (response.ok) {
                const result = await response.json();
                console.log('Message sent successfully:', result);
            } else {
                console.error('Error sending message:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

}

export default SaveAndLoad;