async function extractAndSendData(backendUrl) {
    // Select the form
    const form = document.querySelector('form');

    if (!form) {
        console.error("Form not found.");
        return;
    }

    // Create an object to store the form data
    const formData = {
        features: [] // Initialize as an empty array to store features
    };

    // Iterate over all input fields in the form
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        const value = input.value.trim(); // Get value and remove extra spaces
        
        if (value === "") {
            input.style.border = '1px solid red'; // Highlight empty fields
            setTimeout(() => { input.style.border = '1px solid var(--primary-color-three)'; }, 3000);
        } else {
            // Convert value to float and add to features array
            if(value === 'M')
                formData.features.push(parseFloat(1));
            else if(value === 'F')
                formData.features.push(parseFloat(0));
            else
                formData.features.push(parseFloat(value));
        }
    });

    // Send the data to the backend
    try {
        const response = await axios.post(backendUrl, formData, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        localStorage.setItem('responseData', JSON.stringify(response.data));
        
        let result = JSON.stringify(response.data.result)
        let message = JSON.stringify(response.data.message)
        

        if (response.status === 200) { 
            // Make sure to check if the response data contains the expected message or prediction
            message = message.substring(1, message.length - 1)
            result = result.substring(1, result.length - 1)

            if(result === 'yes'){
                Swal.fire({
                    title: "Urgent!",
                    text: message.substring(8, message.length),
                    imageUrl: "../static/assets/images/anxious-emoji.png",
                    imageWidth: 200,
                    imageHeight: 200,
                    imageAlt: "Custom image"
                });
            }
            else if(result == 'no'){
                Swal.fire({
                    title: "Great News!",
                    text: message.substring(11, message.length),
                    imageUrl: "../static/assets/images/appreciate.png",
                    imageWidth: 200,
                    imageHeight: 200,
                    imageAlt: "Custom image"
                });
            }
        } 
        else {
            // If something goes wrong, log the response data
            Swal.fire({
                title: "Error!",
                text: "Something is wrong with the input.",
                icon: "error"
            });
        }
    } catch (error) {
        Swal.fire({
            title: "Error!",
            text: "Something is wrong with the input.",
            icon: "error"
        });
    }
}

// Add event listener to the 'predict' button
document.getElementById('predict_result').addEventListener('click', () => {
    const backendUrl = 'http://127.0.0.1:5000/submit-data'; // Backend URL
    extractAndSendData(backendUrl);  // Call the function to send data
});