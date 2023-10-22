export const getChangePasswordTemplate = (url: string): string => {
  return `
  <!DOCTYPE html>
  <html lang="en" style="height: 100%;">
  
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
        justify-content: center;
        flex-direction: column;
        background: linear-gradient(90deg, #5FB87E, #81D8A6);
    ">
        <p id="no-token-prompt" hidden="true">No token found.</p>
        <div class="form-container" style="
            min-width: 15%;
        ">
            <form id="change-password-form" style="
            display: flex;
            flex-direction: column;
            visibility: hidden;
            ">
                <label for="password" style="
                    padding-bottom: 0.5rem;
                    color: #EAE9ED;
                    font-weight: 800;
                ">
                    New password
                </label>
                <input type="password" name="password" id="password" placeholder="new password" minlength="8"
                    maxlength="64" style="
                    border: 2px solid #5FB87E;
                    background-color: #EAE9ED;
                    border-radius: 0.35rem;
                    box-shadow: none;
                    outline: none;
                    font-size: 16px;
                    padding: 10px;
                    " onFocus="
                        this.style.transition = 'all 0.2s linear';
                        this.style.borderColor='#3C8A56';
                        this.style.backgroundColor='rgba(95, 184, 156, 0.05)';
                        this.style.outline = 'none';
                    " onBlur="
                        this.style.borderColor='#5FB87E';
                        this.style.backgroundColor='#EAE9ED';
                        this.style.outline = 'none';
                    ">
                <label for="repeat-password" style="
                    padding-bottom: 0.5rem; 
                    padding-top: 0.5rem;
                    color: #EAE9ED;
                    font-weight: 800;
                ">Repeat password
                </label>
                <input type="password" name="repeat-password" id="repeat-password" placeholder="Repeated new password"
                    maxlength="64" minlength="8" style="
                    border: 2px solid #5FB87E;
                    background-color: #EAE9ED;
                    border-radius: 0.35rem;
                    box-shadow: none;
                    outline: none;
                    font-size: 16px;
                    padding: 10px;
                    " onFocus="
                        this.style.transition = 'all 0.2s linear';
                        this.style.borderColor='#3C8A56';
                        this.style.backgroundColor='rgba(95, 184, 156, 0.05)';
                    " onBlur="
                        this.style.borderColor='#5FB87E';
                        this.style.backgroundColor='#EAE9ED';
                    ">
                <div style="padding-top: 0.5rem; width: 100%;">
                    <button type="button" id="submit-request-button" style="
                        color: #EAE9ED;
                        background-color: #5FB87E;
                        margin-top: 20px;
                        padding: 8px 48px;
                        border: none;
                        border-radius: 0.35rem;
                        font-weight: 800;
                        font-size: 24px;
                        " onmousedown="
                            this.style.transition = 'all 0.2s linear';
                            this.style.boxShadow = '0px 0px 40px -7px #3C8A56';
                            this.style.backgroundColor = '#3C8A56';
                        "
                        onmouseup="
                            this.style.transition = 'all 0.2s linear';
                            this.style.boxShadow = 'none';
                            this.style.backgroundColor = '#5FB87E';
                        "
                        >Submit</button>
                </div>
            </form>
        </div>
    </div>
    <p hidden="true" id="warning" style="color: #BD1600; font-weight: 800;"></p>
    </body>

  <script>
      let token;
  
      (() => {
          const currentUrlPlain = window.location.href;
  
          const currentURL = new URL(currentUrlPlain);
  
          token = currentURL.searchParams.get('token');
  
          if (!token) {
              const message = document.getElementById('no-token-prompt');
  
              message.removeAttribute('hidden');
              return;
          }
  
          const form = document.getElementById('change-password-form');
  
          form.style.visibility = 'visible';
  
          const button = document.getElementById('submit-request-button');
  
          button.addEventListener('click', () => {
              sendPasswordChangeRequest();
          })
      })()
  
      let httpRequest;
  
      function sendPasswordChangeRequest() {
          httpRequest = new XMLHttpRequest();
  
          const password = document.getElementById('password').value;
  
          const repeatedPassword = document.getElementById('repeat-password').value;
  
          const isPasswordValid = verifyPassword(password, repeatedPassword);
  
          if (!isPasswordValid) {
              return;
          }
  
          httpRequest.onreadystatechange = onFinishedRequest;
          httpRequest.open('POST', 'http://localhost:50010/api/v1/accounts/change-password?token=' + token, true);
          httpRequest.setRequestHeader('Content-type', 'application/json');
          httpRequest.send(JSON.stringify({
              password,
              repeatedPassword,
          }));
      }
  
      function onFinishedRequest() {
          if (httpRequest.readyState !== XMLHttpRequest.DONE) {
              return;
          }
          if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
              hideFormAndDisplayMessage();
  
              return;
          }
          if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status !== 200) {
              const parsedResponse = JSON.parse(httpRequest.response);
  
              setErrorMessage(parsedResponse.error[0]);
  
              return;
          }
      }
  
      function verifyPassword(password, repeatedPassword) {
          if (typeof password !== "string" || typeof repeatedPassword !== "string") {
              setErrorMessage('Password has invalid type!');
  
              return false;
          }
  
          if (password.length < 8 || repeatedPassword.length < 8) {
              setErrorMessage('Password is too short. It should have at least 8 characters.');
  
              return false;
          }
  
          if (password !== repeatedPassword) {
              setErrorMessage('Passwords are not identical.');
  
              return false;
          }
  
          return true;
      }
  
      function setErrorMessage(message) {
          const warning = document.getElementById('warning');
  
          warning.innerText = message;
          warning.removeAttribute('hidden');
      }
  
      function hideFormAndDisplayMessage() {
          const form = document.getElementById('change-password-form');
  
          form.style.visibility = 'hidden';
  
          const info = document.getElementById('no-token-prompt');
  
          info.removeAttribute('hidden');
  
          info.innerText = 'Password changed successfully!'
      }
  
  </script>
  
  </html>
  `;
};
