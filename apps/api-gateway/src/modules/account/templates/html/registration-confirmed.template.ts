export const getRegistrationConfirmedTemplate = (success: boolean): string => {
  if (success) {
    return `
    <!DOCTYPE html>
    <html lang="en" style="height: 100%;">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>

    <body style="
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(90deg, #5FB87E, #81D8A6);
        ">
        <div style="
                    display: flex;
                    justify-content: center; 
                    align-items: center;
                    font-size: 36px;
                    font-family: sans-serif;
                    font-weight: 800;
                    color: #EAE9ED;
                    ">
            <p style="margin: auto;">Registration successful!</p>
        </div>
    </body>

    </html>`;
  }

  return `
  <html lang="en" style="height: 100%;">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body style="
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, #5FB87E, #81D8A6);
    ">
    <div style="
                display: flex;
                justify-content: center; 
                align-items: center;
                font-size: 36px;
                font-family: sans-serif;
                font-weight: 800;
                color: #EAE9ED;
                ">
        <p style="margin: auto;">Registration error! Please try again.</p>
    </div>
</body>

</html>`;
};
