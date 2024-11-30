import Message from './Message'

class SaveAndLoad {
    constructor(){
        this.id = null
    }

    async save(shapes, image, name){
        const newMssg = new Message("tester name", this.shapes);
        const url = 'http://localhost:8080/drawings/json';
        console.log("saving")
    
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

    load(){

    }

    setName(){

    }
}

export default SaveAndLoad;