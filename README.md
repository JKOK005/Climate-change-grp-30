Grow app
-------------

This project was for the CLimate Innovation Challenge 2016.

Today, people in offices exhibit behaviour which is sub-par: for example, they may take up a meeting room to work by themselves, wasting electricity or print lots of paper that they do not need to.

This is an app to reward good behaviour by growing a virtual plant whose health depends on the user's good (or bad) behavior. At the end of the week, the user gets a tree which has grown based on how well the user has followed green practices - and it can be placed on the department garden. By adding in the department garden concept we hope to build healthy competition between departments and encourage intra-department cohesion.

One of the features we implemented was checking if a user is in a meeting room with enough users (based on room capacity) by passively associating with a bluetooth AP placed in each room.

This repository consists of:
- iOS app
- NodeJS backend server for processing tree growth and AP association
- Flask backend for rendering dashboard for department garden
