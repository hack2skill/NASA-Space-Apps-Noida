<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Water Quality</title>
    <link rel="stylesheet" href="style.css">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
</head>
<body style="text-align center;">


<!-- <div class="preloader"></div> -->


<div class="header">

<!--Content before waves-->
<div class="inner-header flex">
<!--Just the logo.. Don't mind this-->
<svg version="1.1" class="logo" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 500 500" xml:space="preserve">
<path fill="#FFFFFF" stroke="#000000" stroke-width="10" stroke-miterlimit="10" d="M57,283" />
<g><path fill="#fff"
d="M250.4,0.8C112.7,0.8,1,112.4,1,250.2c0,137.7,111.7,249.4,249.4,249.4c137.7,0,249.4-111.7,249.4-249.4
C499.8,112.4,388.1,0.8,250.4,0.8z M383.8,326.3c-62,0-101.4-14.1-117.6-46.3c-17.1-34.1-2.3-75.4,13.2-104.1
c-22.4,3-38.4,9.2-47.8,18.3c-11.2,10.9-13.6,26.7-16.3,45c-3.1,20.8-6.6,44.4-25.3,62.4c-19.8,19.1-51.6,26.9-100.2,24.6l1.8-39.7		c35.9,1.6,59.7-2.9,70.8-13.6c8.9-8.6,11.1-22.9,13.5-39.6c6.3-42,14.8-99.4,141.4-99.4h41L333,166c-12.6,16-45.4,68.2-31.2,96.2	c9.2,18.3,41.5,25.6,91.2,24.2l1.1,39.8C390.5,326.2,387.1,326.3,383.8,326.3z" />
</g>
</svg>
<h1>Check Water Quality </h1>
</div>
<button id="Location" class="btn btn-info error">Get Location</button>
<!--Waves Container-->
<div>

<form action="" method="post">
<div class="entry" style="display:flex;padding:1rem;">

  <div class="input-group mb-3">
    <input type="text"style="color:black;margin:0 1rem;" name="Longitude"placeholder="Enter Your Latitude:" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" required>
  </div>
  <div class="input-group mb-3">
    <input type="text" style="color:black;margin:0 1rem;" name="Latitude"placeholder="Enter Your Latitude:" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" required>
  </div>
</div>
  <button type="sumbit" name="submit" class="btn btn-info">Check</button>
  
</form>
<div id="divo" style="display:none;">

  <div class="result" style="display: flex;
    text-align: center;
    background: #00000030;
    justify-content: center;
    padding: 2rem 0;
    border-radius: 20px;
    margin: 2rem 22rem;
    font-family: system-ui;">
  <div class="phi"style="display:flex;flex-direction:column;margin:0 2.5rem;">
    <h3 style="padding:0 0.5rem 0 0;color:#ffffff73">PHI</h3><h1>24.4646</h1>
  </div>
  <div class="phi"style="display:flex;flex-direction:column;margin:0 2.5rem;">
    <h3 style="padding:0 0.5rem 0 0;color:#ffffff73">Kappa</h3><h1>-34.45646</h1>
  </div>
  <div class="phi"style="display:flex;flex-direction:column;margin:0 2.5rem;">
    <h3 style="padding:0 0.5rem 0 0;color:#ffffff73">Omega</h3><h1>-190.34532</h1>
  </div>
</div>
<h1>Water is Pure</h1>
</div>

<?php
// Database connection information
$servername = "localhost";
$username = "root";
$password = "";
$database = "text";
// Create a connection
$conn = new mysqli($servername, $username, $password, $database);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Define the two columns you want to filter by
$column1 = "LAT";
$column2 = "LONG1";

 if (isset($_POST['submit'])) {
   $input1 = $_POST['Longitude'];
   $input2 = $_POST['Latitude'];



// SQL query to fetch data based on the two columns
$sql = "SELECT * FROM text WHERE LAT=$input1 AND LONG1 =$input2 ";

// Execute the query
$run = mysqli_query($conn,$sql);
$post=mysqli_num_rows($run);


if ($post) {
  // output data of each row
  while($row = mysqli_fetch_assoc($run)) {
?>

<div class="result" style="display: flex;
    text-align: center;
    background: #00000030;
    justify-content: center;
    padding: 2rem 0;
    border-radius: 20px;
    margin: 2rem 22rem;
    font-family: system-ui;">
  <div class="phi"style="display:flex;flex-direction:column;margin:0 2.5rem;">
    <h3 style="padding:0 0.5rem 0 0;color:#ffffff73">PHI</h3><h1><?php echo $row['PHI'] ?></h1>
  </div>
  <div class="phi"style="display:flex;flex-direction:column;margin:0 2.5rem;">
    <h3 style="padding:0 0.5rem 0 0;color:#ffffff73">Kappa</h3><h1><?php echo $row['KAPPA'] ?></h1>
  </div>
  <div class="phi"style="display:flex;flex-direction:column;margin:0 2.5rem;">
    <h3 style="padding:0 0.5rem 0 0;color:#ffffff73">Omega</h3><h1><?php echo $row['OMEGA'] ?></h1>
  </div>
</div>
<h1>Water is Pure</h1>
<?php
    // echo $row['PHI']."\n";
    // echo 'Kappa'.$row['OMEGA'];
    // echo $row['PHI'];
    // echo $row['PHI'];
  }
} else {
  echo "0 results";
}
 }
$conn->close();
?>

<!-- <script>
  const btn = document.getElementById("Location");
  btn.addEventListener('click',async()=>{
   
        // Function to handle the success case when getting the user's location
        function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
 
            // Display latitude and longitude in HTML
            document.getElementById("outputLat").textContent = latitude;
            document.getElementById("outputLong").textContent = longitude;
        }

        // Function to handle errors when getting the user's location
        function error() {
            alert("Unable to retrieve your location.");
        }

        // Check if the Geolocation API is available in the browser
        if ("geolocation" in navigator) {
            // If available, use the Geolocation API to get the user's location
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            alert("Geolocation is not supported by your browser.");
        } 
});
    </script> -->





<svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
<defs>
<path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
</defs>
<g class="parallax">
<use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
<use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
<use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
<use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
</g>
</svg>
</div>
<!--Waves end-->

</div>
<!--Header ends-->

<!--Content starts-->
<div class="content flex">
  <p>Team Stellars | Check Water </p>
</div>
<!--Content ends-->


</body>


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
<script src="script.js"></script>
</html>
