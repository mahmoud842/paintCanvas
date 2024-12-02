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

    async saveFileToLocal(data) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'data.json',
                types: [
                    {
                        description: 'JSON Files',
                        accept: {
                            'application/json': ['.json']
                        }
                    },
                    {
                        description: 'XML Files',
                        accept: {
                            'application/xml': ['.xml']
                        }
                    }
                ]
            });
            const fileName = handle.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            let content = '';
            if (fileExtension === 'json') {
                content = JSON.stringify(data, null, 2);
            } else if (fileExtension === 'xml') {
                content = this.convertToXml(data);
            } else {
                alert('Unsupported file type selected!');
                return;
            }
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();
    
            console.log(`File saved as ${fileExtension.toUpperCase()}!`);
        } catch (err) {
            console.error('File save canceled or failed', err);
        }
    }
    
    convertToXml(data) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<data>';
    
        data.forEach(obj => {
            xml += '\n  <item>';
            for (const [key, value] of Object.entries(obj)) {
                xml += `\n    <${key}>`;
    
                if (Array.isArray(value)) {
                    if (Array.isArray(value[0])) {
                        // Handle 2D array
                        value.forEach(row => {
                            xml += '\n      <row>';
                            row.forEach(cell => {
                                xml += `\n        <cell>${this.escapeXmlValue(cell)}</cell>`;
                            });
                            xml += '\n      </row>';
                        });
                    } else {
                        // Handle 1D array
                        value.forEach(cell => {
                            xml += `\n      <cell>${this.escapeXmlValue(cell)}</cell>`;
                        });
                    }
                } else {
                    // Handle primitive values
                    xml += this.escapeXmlValue(value);
                }
    
                xml += `\n    </${key}>`;
            }
            xml += '\n  </item>';
        });
    
        xml += '\n</data>';
        return xml;
    }
    
    escapeXmlValue(value) {
        return value
            .toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    async loadFileFromLocal() {
        try {
            // Open the file picker
            const [handle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'JSON or XML Files',
                        accept: {
                            'application/json': ['.json'],
                            'application/xml': ['.xml']
                        }
                    }
                ]
            });
    
            // Get the file from the handle
            const file = await handle.getFile();
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
    
            // Read the file content
            const content = await file.text();
    
            let parsedData;
    
            if (fileExtension === 'json') {
                // Parse JSON content
                parsedData = JSON.parse(content);
                console.log('Loaded JSON data:', parsedData);
            } else if (fileExtension === 'xml') {
                // Parse XML content
                parsedData = this.parseXml(content);
                console.log('Loaded XML data:', parsedData);
            } else {
                alert('Unsupported file type!');
                return;
            }
    
            return parsedData; // Return the parsed data for further use
        } catch (err) {
            console.error('File load canceled or failed', err);
        }
    }
    
    // to parse XML string to a JavaScript object
    parseXml(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    
        // Check for parsing errors
        const parserError = xmlDoc.getElementsByTagName('parsererror');
        if (parserError.length) {
            throw new Error('Error parsing XML');
        }
    
        const data = [];
        const items = xmlDoc.getElementsByTagName('item');
    
        for (const item of items) {
            const obj = {};
    
            for (const child of item.children) {
                if (child.getElementsByTagName('row').length > 0) {
                    // Parse 2D array
                    const rows = [];
                    for (const row of child.getElementsByTagName('row')) {
                        const rowData = [];
                        for (const cell of row.getElementsByTagName('cell')) {
                            rowData.push(this.convertToNumber(cell.textContent.trim()));
                        }
                        rows.push(rowData);
                    }
                    obj[child.tagName] = rows;
                } else if (child.getElementsByTagName('cell').length > 0) {
                    // Parse 1D array
                    const cells = [];
                    for (const cell of child.getElementsByTagName('cell')) {
                        cells.push(this.convertToNumber(cell.textContent.trim()));
                    }
                    obj[child.tagName] = cells;
                } else {
                    // Parse primitive value
                    obj[child.tagName] = this.convertToNumber(child.textContent.trim());
                }
            }
    
            data.push(obj);
        }
    
        return data;
    }
    
    convertToNumber(value) {
        const num = parseFloat(value);
        return isNaN(num) ? value : num;  // If not a number, return the original value
    }

}

export default SaveAndLoad;