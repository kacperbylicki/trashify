export const getRegistrationConfirmedTemplate = (success: boolean): string => {
  if (success) {
    return `<html lang="en" style="height: 100%;">

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
        ">
        <div style="
                    display: flex;
                    justify-content: center; 
                    align-items: center;
                    font-size: xx-large;
                    color: chartreuse;
                    ">
            <p style="font-weight: bold; margin: auto;">Registration successful!</p>
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
    ">
    <div style="
                display: flex;
                justify-content: center; 
                align-items: center;
                font-size: xx-large;
                color: chartreuse;
                ">
        <p style="font-weight: bold; margin: auto;">Registration error. Please try again.</p>
    </div>
</body>

</html>`;
};
