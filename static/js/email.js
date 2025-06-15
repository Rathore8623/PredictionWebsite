let sender_name = document.getElementById('sender_name') ;
let sender_email = document.getElementById('sender_email') ;
let message_subject = document.getElementById('message_subject') ;
let message_body = document.getElementById('message_body') ;

const backendURL = 'http://127.0.0.1:5000/send-email' ;

document.getElementById('send_message').addEventListener('click', async function send_email() {
    //e.preventDefault();

    if (!validateInputs()){ 
        return;
    }

    const formData = {
        name: sender_name.value,
        email: sender_email.value,
        subject: message_subject.value,
        message: message_body.value 
    };

    try {
        const response = await axios.post(backendURL, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        if (response.data.success === true) { 
            Swal.fire({
                title: "Thank You!",
                text: "We appreciate you reaching out!\nYour message has been successfully sent, and we'll get back to you shortly.",
                icon: "success"
            });
            document.getElementById('contact_form').reset();
        } 
        else {
            Swal.fire({
                title: "Sorry!",
                text: "Couldn't send the message!",
                icon: "error"
            });
        }
    } 
    catch (error) {
        console.error(error); // Log the error for debugging purposes
        Swal.fire({
            title: "{404}",
            text: "Some error occurred, Couldn't send the message!",
            icon: "error"
        });
    }    
}) ;

function validateInputs() {
    if (!sender_name.value || !sender_email.value || !message_subject.value || !message_body.value) {
        Swal.fire({
            title: "Advisory",
            text: "Please! fill the form correctly before sending the message.",
            icon: "warning"
        });
        return false;
    }
    return true;
}

// function send_email() {
//     if (!validateInputs()) return;

//     email_body = `Name: ${sender.value}<br>Email: ${email.value}<br>Subject: ${subject.value}<br>Message: ${body.value}`

//     console.log(email_body)

//     Email.send({
//         Host : "smtp.gmail.com",
//         Username: "nikunjrathore8623@gmail.com", // Replace with a placeholder or secure it
//         Password: "mtjt ekgf tpnj ggdx",  // ecure storage password
//         To: 'nikunjrathore8623@gmail.com',
//         From: email.value,
//         Subject: subject.value,
//         Body: email_body
//     }).then(message => {
//         console.log(message)
//         if (message == "OK") {
//             Swal.fire({
//                 title: "Thank You!",
//                 text: "We appreciate you reaching out! Your message has been successfully sent, and we'll get back to you shortly.",
//                 icon: "success"
//             });
//         } else {
//             Swal.fire({
//                 title: "Sorry!",
//                 text: "Couldn't send the message!",
//                 icon: "error"
//             });
//         }
//     }).catch(error => {
//         console.error("Error sending email:", error);
//         Swal.fire({
//             title: "Error!",
//             text: "An error occurred. Check console for details.",
//             icon: "error"
//         });
//     });
//     setTimeout(()=>{sender.value = email.value = subject.value = body.value = ''}, 5000) ;
// }

// document.getElementById('send_message').addEventListener('click', send_email);
