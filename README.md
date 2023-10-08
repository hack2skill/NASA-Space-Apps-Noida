#### Team Name - Team Stellars
#### Problem Statement - What’s Up With This Water?
#### Team Leader Email - bhatnagarkartik6@gmail.com

#### Client Side Explanation

#### Prototype Website URL:- https://whater989.000webhostapp.com/

![ezgif com-video-to-gif](https://github.com/mediachain/mediachain-website/assets/72219613/2b06670b-55a9-43c3-a06a-2f6f16d3d4fd)


## Our Prototype "HYDRA HEALTH" Front Page


 ![WhatsApp Image 2023-10-08 at 4 59 30 AM](https://github.com/mediachain/mediachain-website/assets/72219613/8863abdf-d0c3-4a27-be7f-8394876d8191)
### Our app first takes user's location using geoloaction module of js.

 ## Then Fetches Longitude and Latitude of the User. And finds water bodies under the radius of 5km. 



![WhatsApp Image 2023-10-08 at 4 59 30 AM1](https://github.com/mediachain/mediachain-website/assets/72219613/df64cbf9-ef84-45c5-9879-2838c5836c16)
 We can add custom Latitude and longitude and get the water quality of a desired place.
 ![WhatsApp Image 2023-10-08 at 4 59 30 AM2](https://github.com/mediachain/mediachain-website/assets/72219613/54962da9-99b3-4635-ab6c-b5c1dfb3161a)
 Then finds the water quality based on user's location using database and displayes in the format of PHI(ph index), KAPPA(specific conductivity of water), OMEGA(Dissolved oxygen in water). The database is taken from NASA resource provided in the problem statement. 
 
#### Server side Explanation

Output.sql -> Define the database we got from NASA resources and it can be updated in every 5 hours using dataformat.py
DataFormat.py -> Used to refine, insert and update data present in output.sql
Index.php -> It is the main file which is used to display the water quality on the web page 
Style.css -> It is used for styling our web page
Script.js -> It is used to get the current location of the user using geolocation module
HTML,CSS -> It is used to create and style the web page

### Tech Stack: 
   Python -> It is used to refine and update the sql file
   MySQL -> It is used to store of water phi, kappa and omega based on latitude and longitude
   PHP -> It is used to intract our web page with database
   JavaScript -> It is used to get user's current location in the format of latitude and longitude
  
#### Our Working Flow
![Screenshot 2023-10-08 060751](https://github.com/mediachain/mediachain-website/assets/72219613/0cc4d8c8-0f5b-4d21-a955-ce657d205012)

### Future Scope:
   To make our webapp more interacting and amazing, we are going to implement 3d models using three.js where we can interact 3d elements and find endangered water  
   species based on water bodies near the user. We can also add a GEOLOCATION Machine Learning model to show the water quality of region which is under rainfall and fluctuating pollution level.
   pollution level
