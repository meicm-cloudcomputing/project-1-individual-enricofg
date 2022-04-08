(() => {

    // CHANGE THIS FOR PRODUCTION DEPLOYMENT
    // Note: in an actual project this should be done
    //       by some build tool not directly in code

    // #### CHANGE-ME #####
    const API_URL = 'http://localhost:8081'
                    //'https://us-central1-fiery-catwalk-338017.cloudfunctions.net/functions-app'
                    //'https://meicm-cloudcomputing.azurewebsites.net/api' 
                    //'https://llu1uqku72.execute-api.us-east-1.amazonaws.com/cc-project'
    // #### CHANGE-ME #####

    $name = $('#name');
    $email = $('#email');
    $message = $('#message');
    $successModal = $('#successModal');

    $('#contact-form').on('submit', (event) => {
        event.preventDefault()
        const data = {
            name: $name.val(),
            email: $email.val(),
            message: $message.val()
        }

        axios.post(`${API_URL}/message`, data) 
            .then(response => {
                $successModal.modal('show');
            })
            .catch(error => {
                console.error(error)
                alert("Error Sending Message - Check Console")
            })
    })

})()