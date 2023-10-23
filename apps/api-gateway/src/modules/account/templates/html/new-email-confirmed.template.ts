export const getNewEmailConfirmedTemplate = (url: string): string => {
  return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta content="text/html">
        <title>Document</title>
    </head>
    
    <body style="
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        text-decoration: none;
        font-family: sans-serif;
        font-size: 30px;
    ">
        <div style="
            display: flex;
            height: 100vh;
            width: 100vw;
            align-items: center;
            color: white;
            justify-content: center;
            flex-direction: column;
            font-size: 36px;
            font-family: sans-serif;
            font-weight: 800;
            background: linear-gradient(90deg, #5FB87E, #81D8A6);
        ">
            <p id="prompt" hidden="true">No token found.</p>
        </div>
    </body>
    
    <script>
        let token;
    
        let httpRequest;
    
        (() => {
            const currentUrlPlain = window.location.href;
    
            const currentURL = new URL(currentUrlPlain);
    
            token = currentURL.searchParams.get('token');
    
            if (!token) {
                const message = document.getElementById('prompt');
    
                message.removeAttribute('hidden');
                return;
            }
    
            httpRequest = new XMLHttpRequest();
    
            httpRequest.onreadystatechange = onFinishedRequest;
            httpRequest.open('PATCH', ${url} + token, true);
            httpRequest.setRequestHeader('Content-type', 'application/json');
            httpRequest.send(JSON.stringify({}));
        })()
    
        function onFinishedRequest() {
            if (httpRequest.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
                return;
            }
            if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status !== 200) {
                const parsedResponse = JSON.parse(httpRequest.response);
    
                setErrorMessage(parsedResponse.error[0]);
    
                return;
            }
        }
  
        function setErrorMessage(message) {
            const warning = document.getElementById('prompt');
    
            warning.innerText = message;
            warning.removeAttribute('hidden');
        }
    </script>
    
    </html>`;
};
