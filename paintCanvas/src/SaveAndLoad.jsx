import Message from './Message'

class SaveAndLoad {
    constructor(){
        this.id = null
    }

    async saveJsonWithoutID(){
        const newMssg = new Message("tester name", this.shapes)
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

    async saveJsonWithID(){
        const newMssg = new Message("tester name", this.shapes)
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

    async save(shapes, image, name){
        console.log(shapes)
        if (this.id == null)
            this.saveJsonWithoutID()
        else
            this.saveJsonWithID()

    }

    load(){

    }

    setName(){

    }
}

export default SaveAndLoad;