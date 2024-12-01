import Message from './Message'

class SaveAndLoad {
    constructor(){
        this.id = null
    }
    
    async save(shapes, canvas, jsonFlag){
        console.log(shapes)
        let flag = true
        if (this.id == null)
            flag = flag && await this.saveWithoutID(shapes, jsonFlag)
        else
            flag = flag && await this.saveWithID(shapes, jsonFlag)

        flag = flag && await this.sendCanvasImage(canvas)
        return flag
    }

    async loadDrawing(id){
        let url = 'http://localhost:8080/drawings/' + id
        console.log("loading from: " + url)
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });    
            if (response.ok) {
                const result = await response.json();
                console.log('Loaded successfully:', result);
                this.id = id
                return result
            } else {
                console.error('Error sending message:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
        return null
    }

    async loadImages(){
        let url = 'http://localhost:8080/drawings/images'
        console.log("getting images to: " + url)
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });    
            if (response.ok) {
                const result = await response.json();
                console.log('Message sent successfully:', result);
                return result
            } else {
                console.error('Error sending message:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
        return null
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
                return true
            } else {
                console.error('Error sending image:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
        return false
    }

    async saveWithoutID(shapes, jsonFlag){
        const newMssg = new Message("tester name", shapes)
        console.log(newMssg)
        let url = 'http://localhost:8080/drawings'
        if (jsonFlag)
            url += '/json'
        else url += '/xml'
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
                return true
            } else {
                console.error('Error sending message:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
        return false
    }

    async saveWithID(shapes, jsonFlag){
        const newMssg = new Message("tester name", shapes)
        let url = 'http://localhost:8080/drawings/' + this.id
        if (jsonFlag)
            url += '/json'
        else url += '/xml'
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
                return true
            } else {
                console.error('Error sending message:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
        return false
    }

}

export default SaveAndLoad;