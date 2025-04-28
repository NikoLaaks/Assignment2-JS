# Quote generator with 3D galaxy visualization

This project integrates quote fetching, local storage, event-driven UI updates and a 3D interactive galaxy background.
## Quote generator
-	Fetches random quotes from two APIs (Quotable as primary, The Quotes Hub as secondary in case of failure)
-	Displays a new quote upon clicking the “New Quote” Button
-	Saves quotes to local storage upon clicking “Save To Storage” Button
-	Displays saved quotes in a list format under “Favorites”
-	Includes delete option for each saved quote
-	Uses localStorage to persist the favorite quotes across sessions
## UI and Event handling
-	Uses JavaScript to dynamically update the DOM for displaying quotes
-	Removes previous quote elements before inserting new one
-	Event listeners are set up to handle user interactions
    -	“New Quote” fetches and displays a fresh quote
    -	“Save to favorites” stores the displayed quote in localStorage
    -	“Delete” removes a saved quote for the favorites list
## 3D galaxy visualization (Three.js)
-	Implements a 3D animated galaxy using three.js
-	Galaxy consists of 2500 particles positioned randomly in a spherical pattern
-	Mouse interaction
    -	Mouse movement influences the rotation of the galaxy slightly
    -	Raycaster is used to determine the mouse position in 3D space
-	Animation & Rotation
    -	Galaxy rotates at an adjustable speed
    -	User can control the rotation speed using slider on the page
-	Resizes automatically when browser window size changes
