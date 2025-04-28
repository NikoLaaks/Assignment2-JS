// Curried function to save any data to localStorage under a given storage key
function saveToStorage(storageKey) {
    return function (data) {
        let currentData = JSON.parse(localStorage.getItem(storageKey)) || [];
        currentData.push(data);
        localStorage.setItem(storageKey, JSON.stringify(currentData));
    };
}

// Create a specific version of the saveToStorage function for saving quotes
const saveQuote = saveToStorage('savedQuotes');

// for displaying saved quotes
const favoriteQuotes = {
    quotes: JSON.parse(localStorage.getItem('savedQuotes')) || []
};

class Quote {
    constructor(author, content) {
        this.author = author;
        this.content = content;
    }
}

async function getRandomQuote() {
    const primaryAPI = 'https://thequoteshub.com/api/random';
    const secondaryAPI = 'http://api.quotable.io/quotes/random';

    try {
        let response = await fetch(primaryAPI);
        if (!response.ok) {
            throw new Error('primaryAPI request failed');
        }
        let data = await response.json();
        console.log('primary api data: ', data);

        return {
            author: data.author,
            content: data.text
        };
    } catch (error) {
        console.warn('primaryAPI failed:', error);
        try {
            let response = await fetch(secondaryAPI);
            if (!response.ok) {
                throw new Error('secondaryAPI request failed');
            }
            let data = await response.json();
            console.log('secondary api data: ', data);

            return {
                author: data.author,
                content: data.content
            };

        } catch (secondError) {
            console.error('secondaryAPI failed:', secondError);
        }
    }
}

async function displayNewQuote() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block'; // Show loading indicator
    
    try {
        let quote = await getRandomQuote();
        
        if (document.getElementById("author")) {
            document.getElementById("author").remove();
        }
        if (document.getElementById("content")) {
            document.getElementById("content").remove();
        }
        
        // create author element
        const author = document.createElement("h3");
        author.setAttribute("id", "author");
        author.innerText = quote.author;
        document.getElementById("quoteBox").appendChild(author);

        // create content element
        const para = document.createElement("p");
        para.setAttribute("id", "content");
        para.innerText = quote.content;
        document.getElementById("quoteBox").appendChild(para);
    } catch (error) {
        console.error("Error fetching quote: ", error);
    } finally {
        loadingElement.style.display = 'none'; // Hide loading indicator
    }
}

function saveToFavorites() {
    let author = document.getElementById("author").innerText;
    let content = document.getElementById("content").innerText;
    console.log(author);
    console.log(content);
    let quote = new Quote(author, content);
    console.log("quote object: " + quote.author);
    addQuoteToJSON(quote);
}

function addQuoteToJSON(quote) {
    // Use the curried saveQuote function to store the quote in localStorage
    saveQuote({
        author: quote.author,
        content: quote.content
    });
    displayFavorites(); // Update the displayed list of saved quotes
}

function displayFavorites() {
    document.getElementById("favorites").innerHTML = "";
    let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes'));
    
    if (savedQuotes) {
        for (let i = 0; i < savedQuotes.length; i++) {
            const quote = savedQuotes[i];

            // Create list item
            let listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${quote.author}</strong> - <i>${quote.content}</i>`;

            // Styling for borders and spacing
            listItem.style.padding = '10px';
            listItem.style.marginBottom = '10px';
            listItem.style.borderBottom = '1px solid #ccc';

            // Create delete button
            let deleteLink = document.createElement('a');
            deleteLink.innerText = " Delete";
            deleteLink.href = "#";
            deleteLink.style.color = "red";
            deleteLink.style.textDecoration = "none";
            deleteLink.style.transition = "all 0.3s ease";

            deleteLink.addEventListener('click', (event) => {
                event.preventDefault();
                deleteFavorite(i);
            });

            // Hover effects
            deleteLink.addEventListener('mouseover', () => {
                deleteLink.style.textDecoration = "underline";
                deleteLink.style.fontWeight = "bold";
                deleteLink.style.color = "darkred";
            });

            deleteLink.addEventListener('mouseout', () => {
                deleteLink.style.textDecoration = "none";
                deleteLink.style.fontWeight = "normal";
                deleteLink.style.color = "red";
            });

            listItem.appendChild(deleteLink);
            document.getElementById('favorites').appendChild(listItem);
        }
    }
}

function deleteFavorite(index) {
    let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes'));
    savedQuotes.splice(index, 1);
    localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
    displayFavorites(); // Refresh the favorites list after deletion
}

document.getElementById("newQuote").addEventListener("click", displayNewQuote);
document.getElementById("saveToFavorites").addEventListener("click", saveToFavorites);
addEventListener("DOMContentLoaded", displayFavorites());

// Slider for galaxy rotation speed
const sliderLabel = document.createElement('label');
sliderLabel.style.verticalAlign = 'center';
sliderLabel.innerText = 'Rotation Speed: ';
sliderLabel.style.marginRight = '10px';

const slider = document.createElement('input');
slider.type = 'range';
slider.min = 0;
slider.max = 0.01;
slider.step = 0.0005;
slider.value = 0.0005;
slider.style.width = '200px';
slider.style.margin = '10px';

let sliderbox = document.getElementById('slider');
sliderbox.style.display = 'flex';
sliderbox.style.flexDirection = 'column';
sliderbox.style.alignItems = 'center';
sliderbox.style.justifyContent = 'center';
sliderbox.appendChild(sliderLabel);
sliderbox.appendChild(slider);
//----------------------------------------------------------------------------------------

// THREE.JS
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const galaxyGeometry = new THREE.BufferGeometry();
const galaxyMaterial = new THREE.PointsMaterial({
    color: 0x79cffc,
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.5,
});

const galaxyParticles = 2500;
const positions = [];
for (let i = 0; i < galaxyParticles; i++) {
    const radius = Math.random() * 5;
    const angle1 = Math.random() * Math.PI * 2;
    const angle2 = Math.random() * Math.PI;

    const x = radius * Math.sin(angle2) * Math.cos(angle1);
    const y = radius * Math.sin(angle2) * Math.sin(angle1);
    const z = radius * Math.cos(angle2);

    positions.push(x, y, z);
}

galaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
scene.add(galaxy);

camera.position.z = 5;

let mouseX = 0;
let mouseY = 0;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // make plane for raycasting
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Normal vector (0, 0, 1), distance = 0
    const intersection = new THREE.Vector3();

    // Find the intersection point of the ray with the plane
    raycaster.ray.intersectPlane(plane, intersection);

    // Update mouse coordinates
    mouseX = intersection.x;
    mouseY = intersection.y;
});

slider.addEventListener('input', () => {
    rotationSpeed = parseFloat(slider.value);
});

let rotationSpeed = 0.001;
let mouseInfluence = 0.01;

function animate() {
    requestAnimationFrame(animate);

    galaxy.rotation.y += rotationSpeed;

    galaxy.rotation.x += (mouseY * mouseInfluence - galaxy.rotation.x) * 0.05;
    galaxy.rotation.z += (mouseX * mouseInfluence - galaxy.rotation.z) * 0.05;

    renderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

//----------------------------------------------------------------------------------------
// React component
function QuoteOfTheDay() {
    console.log("QuoteOfTheDay component is rendering");
    const [quote, setQuote] = React.useState(null);

    React.useEffect(() => {
        const storedQuote = localStorage.getItem('quoteOfTheDay');
        const storedDate = localStorage.getItem('quoteDate');
        const today = new Date().toDateString();

        if (storedQuote && storedDate === today) {
            setQuote(JSON.parse(storedQuote));
        } else {
            fetch('https://thequoteshub.com/api/random')
                .then(response => response.json())
                .then(data => {
                    console.log("fetch data: ", data);
                    let newQuote = { author: data.author, content: data.text };
                    setQuote(newQuote);
                    localStorage.setItem('quoteOfTheDay', JSON.stringify(newQuote));
                    localStorage.setItem('quoteDate', today);
                })
                .catch(error => console.error('Error fetching quote:', error));
        }
    }, []);

    return (
        <div style={{ padding: "20px", border: "1px solid #ffffff", borderRadius: "10px", background: "#000000", maxWidth: "400px", textAlign: "center", margin: "20px auto" }}>
            <h3>Quote of the Day</h3>
            {quote ? (
                <div>
                    <p style={{ fontStyle: "italic" }}>"{quote.content}"</p>
                    <p><strong>- {quote.author}</strong></p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
// Render the QuoteOfTheDay component
setTimeout(() => {
    console.log("Delayed React rendering!");

    const element = document.getElementById('quoteOfTheDay');
    if (element) {
        ReactDOM.createRoot(element).render(<QuoteOfTheDay />);
    } else {
        console.error('Element with id "quoteOfTheDay" not found!');
    }
}, 1000);