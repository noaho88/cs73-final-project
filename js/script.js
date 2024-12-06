let imagesLoaded = false;

function extractCentury(dateString) {
    let century = null;
    try {
        // Existing parsing rules
        if (/(\d+)(?:st|nd|rd|th) century BCE/.test(dateString)) {
            century = -parseInt(dateString.match(/(\d+)(?:st|nd|rd|th) century BCE/)[1], 10);
        } else if (/(\d+)(?:st|nd|rd|th) century CE/.test(dateString)) {
            century = parseInt(dateString.match(/(\d+)(?:st|nd|rd|th) century CE/)[1], 10);
        } else if (/(\d+)\s*BCE/.test(dateString)) {
            century = -Math.ceil(parseInt(dateString.match(/(\d+)\s*BCE/)[1], 10) / 100);
        } else if (/(\d+)\s*CE/.test(dateString)) {
            century = Math.ceil(parseInt(dateString.match(/(\d+)\s*CE/)[1], 10) / 100);
        } else if (/(\d{4})/.test(dateString)) {
            const year = parseInt(dateString.match(/(\d{4})/)[1], 10);
            century = Math.ceil(year / 100);
        }
        // Handle additional specific cases
        else if (/early (\d+)(?:st|nd|rd|th) century/.test(dateString)) {
            century = parseInt(dateString.match(/early (\d+)(?:st|nd|rd|th) century/)[1], 10);
        } else if (/late (\d+)(?:st|nd|rd|th) century/.test(dateString)) {
            century = parseInt(dateString.match(/late (\d+)(?:st|nd|rd|th) century/)[1], 10);
        } else if (/mid (\d+)(?:st|nd|rd|th) century/.test(dateString)) {
            century = parseInt(dateString.match(/mid (\d+)(?:st|nd|rd|th) century/)[1], 10);
        } else if (/(\d+)(?:st|nd|rd|th) century/.test(dateString)) {
            century = parseInt(dateString.match(/(\d+)(?:st|nd|rd|th) century/)[1], 10);
        } else if (/early (\d+)(?:th|st|nd|rd)–mid (\d+)(?:th|st|nd|rd) century/.test(dateString)) {
            century = parseInt(dateString.match(/early (\d+)(?:th|st|nd|rd)–mid (\d+)(?:th|st|nd|rd) century/)[1], 10);
        }
    } catch (error) {
        let z;
    }

    return century;
}

// Function to group data by centuries and count frequencies
function groupDataByCentury(data) {
    const centuryCounts = {};
    data.forEach(vase => {
        const century = extractCentury(vase.date);
        if (century !== null) {
            centuryCounts[century] = (centuryCounts[century] || 0) + 1;
        }
    });

    // Adjust specific values for centuries -4, -5, and -6
    if (centuryCounts[-4] !== undefined) centuryCounts[-4] = 2826;
    if (centuryCounts[-5] !== undefined) centuryCounts[-5] = 6332;
    if (centuryCounts[-6] !== undefined) centuryCounts[-6] = 6915;

    return centuryCounts;
}

// Function to create the frequency graph
// Function to group data by centuries and count frequencies
function groupDataByCentury(data) {
    const centuryCounts = {};
    data.forEach(vase => {
        const century = extractCentury(vase.date);
        if (century !== null) {
            centuryCounts[century] = (centuryCounts[century] || 0) + 1;
        }
    });

    // Adjust specific values for centuries -4, -5, and -6
    if (centuryCounts[-4] !== undefined) centuryCounts[-4] = 2826;
    if (centuryCounts[-5] !== undefined) centuryCounts[-5] = 6332;
    if (centuryCounts[-6] !== undefined) centuryCounts[-6] = 6915;


    return centuryCounts;
}

// Function to create the frequency graph
function createFrequencyGraph(centuryCounts) {
    // Manually create a sequence of centuries from 8 BC to 21st century
    const bcLabels = [-8, -7, -6, -5, -4, -3, -2, -1]; // Representing 8 BC to 1 BC
    const ceLabels = Array.from({ length: 21 }, (_, i) => i + 1); // Representing 1st to 21st century CE
    const allLabels = [...bcLabels, ...ceLabels]; // Concatenate BC and CE labels

    // Map labels to display values and prepare the sorted data values
    const sortedLabels = allLabels.map(value => {
        if (value < 0) {
            return `${Math.abs(value)} BC`;
        } else {
            return `${value}${getOrdinalSuffix(value)}`;
        }
    });

    // Extract sorted values from centuryCounts based on the label sequence
    const sortedValues = allLabels.map(value => {
        return centuryCounts[value] || 0; // Extract the value, default to 0 if not found
    });

    // Function to get the ordinal suffix (e.g., "1st", "2nd", "3rd")
    function getOrdinalSuffix(num) {
        const lastDigit = num % 10;
        if (num === 11 || num === 12 || num === 13) {
            return 'th';
        }
        switch (lastDigit) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }

    // Render the graph using Chart.js
    const ctx = document.getElementById('pottery-graph').getContext('2d');
    window.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedLabels,
            datasets: [{
                label: 'Number of Vases by Century',
                data: sortedValues,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // Allows the chart to resize properly
            plugins: {
                legend: {
                    display: false // Hide the default legend to keep the manual key outside the graph
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Century',
                        font: {
                            family: 'Lato', // Keep the font as Lato for x-axis
                            size: 16  // Font size for better readability
                        }
                    },
                    ticks: {
                        autoSkip: false // Ensure all labels are shown on the x-axis
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency',
                        font: {
                            family: 'Lato', // Keep the font as Lato for y-axis
                            size: 16  // Font size for better readability
                        }
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function displayImages(data) {
    // Check if images have already been loaded to avoid reloading them
    if (imagesLoaded) return;

    const grid = document.querySelector('.image-grid');
    if (!grid) return;

    data.forEach(vase => {
        if (vase.image_url) {
            const img = document.createElement('img');
            img.src = vase.image_url;
            img.alt = vase.title || 'Vase';
            img.className = 'vase-image';
            grid.appendChild(img);
        }
    });

    // Set the flag to true so that this function is not executed again
    imagesLoaded = true;
}

// Function to display selected images for the 6th century BCE below the graph
function displaySelectedSixthCenturyImages(data) {
    const grid = document.querySelector('.sixth-century-grid');
    grid.innerHTML = ''; // Clear any existing content

    // Filter the vases for the 6th century BCE and select a few examples
    const sixthCenturyVases = data.filter(vase => extractCentury(vase.date) === -6);
    const selectedVases = sixthCenturyVases.slice(0, 5); // Select the first 5 examples

    selectedVases.forEach(vase => {
        if (vase.image_url) {
            const img = document.createElement('img');
            img.src = vase.image_url;
            img.alt = vase.title || 'Vase';
            img.classList.add('sixth-century-image'); // Add a specific class for styling
            grid.appendChild(img);
        }
    });
}

// Function to add interactivity for the SPACE key
// Define an array of text content for each stage of the journey
const journeyStages = [
    {
        text: `
            Ceramic vases have been crafted for over 2,000 years, from the 1st century to the present, and remain a part of our daily lives. Let me take you on a journey. Press SPACE to move through time.
        `,
        vaseCentury: null, // No vase for the first stage
    },
    {
        text: `
            The Met's largest and oldest collection of vases comes from Ancient Greece. To potters, this period is known as the golden age of pottery, marked by the rise of the famous black-figure technique. While today we think of vases as holders of bouquets, the Greeks used vases as canvases for myth and storytelling. These vases were crafted from terracotta clay, distinctive reddish color, which was abundant throughout Greece and offered ideal properties for pottery.
        `,
        vaseCentury: -6, // Show 6th century BCE vase
    },
    {
        text: `
            After the Greeks came the Romans, who took pottery in a new direction—utility over intricacy. They perfected terra sigillata, a glossy red clay similar to the terracotta used by the Greeks, crafting pottery that was elegant yet easy to mass-produce. Unlike the delicate Greek vases, Roman pottery focused on efficiency, meeting the needs of a vast empire. Though much was lost or destroyed, the remaining pieces reflect a culture that valued practicality and beauty.
        `,
        vaseCentury: 1, // No vase image for Romans in this stage
    },
    {
        text: `
            A world away, the Chinese Empire was flourishing. In this society, vases became symbols of sophistication and cultural pride. The Jiangxi province, rich in kaolin clay, gave rise to porcelain that would become iconic around the world. The deep blue we often see, delicately painted onto these vases, came from cobalt imported from Persia (modern-day Iran!). Transformed by skilled artisans, these intricate designs were symbols of high status, far from common everyday use.
        `,
        vaseCentury: 17, // No vase image for Chinese in this stage
    },
    {
        text: `
            The British vases from the 18th century were largely influenced by their fascination with Chinese porcelain (ever wonder why we call it 'china'?). As symbols of luxury, these vases sparked a movement called "Chinoiserie," where British artisans recreated the elegance of Chinese ceramics. Decorated with intricate floral patterns and pastoral scenes, these vases were more than ornamental—they combined utility with status, holding exotic flowers or serving as symbols of refined taste.
        `,
        vaseCentury: 18, // No vase image for British in this stage
    }
];

// Define a variable to track the current stage of the journey
let currentStage = 0;

// Function to add interactivity for the SPACE key
function addSpaceKeyInteraction(data) {
    window.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault(); // Prevent the default spacebar scroll behavior

            // Get the current stage content
            const stage = journeyStages[currentStage];

            // Update the text in the text box
            const textBox = document.querySelector('.text-box');
            if (textBox && stage) {
                textBox.querySelector('p').innerHTML = stage.text;
            }
            const vaseImageContainer = document.getElementById('vase-image-container');
            vaseImageContainer.innerHTML = '';
            // If a vase century is specified, display an example vase
            if (stage.vaseCentury !== null) {
                if (vaseImageContainer) {
                    // Find an example vase for the specified century
                    let vasesFromCentury;
                    if (stage.vaseCentury == 18){
                        vasesFromCentury = data.filter(vase => extractCentury(vase.date) === stage.vaseCentury && vase.medium.toLowerCase().includes('porcelain'));
                    } else {
                        vasesFromCentury = data.filter(vase => extractCentury(vase.date) === stage.vaseCentury);
                    }
                    if (vasesFromCentury.length > 0) {
                        for (let i = 0; i < 5; i++) {
                            // Create an image element for the vase
                            const vaseImage = document.createElement('img');
                            vaseImage.src = vasesFromCentury[i].image_url;
                            vaseImage.alt = vasesFromCentury[i].title || `${Math.abs(stage.vaseCentury)}th Century BCE Vase`;
                            //vaseImage.style.maxWidth = '20%';
                            vaseImage.style.maxHeight = '150px';
                            vaseImage.style.padding = '30px';

                            // Append the image to the container
                            vaseImageContainer.appendChild(vaseImage);
                        }
                    }
                }
                console.log(vaseImageContainer)
            }

            // Move to the next stage
            currentStage = (currentStage + 1) % journeyStages.length;
        }
    });
}

// Fetch vase data, populate the image grid, and create the frequency graph
fetch('ceramic_vases_metadata_final.json')
    .then(response => response.json())
    .then(data => {
        // Group data by century and create a frequency graph
        const centuryCounts = groupDataByCentury(data);
        createFrequencyGraph(centuryCounts);

        // Populate the image grid
        displayImages(data);

        // Now that everything is loaded, add the event listener for interactivity
        addSpaceKeyInteraction(data);
    })
    .catch(error => console.error('Error loading data:', error));


// Fade-out title on scroll
window.addEventListener('scroll', function () {
    const titleOverlay = document.querySelector('.title-overlay');
    const scrollY = window.scrollY;

    // Fade out the title overlay as we scroll down by a certain amount
    if (scrollY > window.innerHeight * 0.3) {
        titleOverlay.classList.add('fade-out');
    } else {
        titleOverlay.classList.remove('fade-out');
    }
});


// Function to create clustering scatter plot
function createClusteringPlot(data) {
    // Group the data by clusters using 'kmeans_labels'
    const clusters = {};
    data.forEach(vase => {
        if (vase.kmeans_labels !== undefined) {
            if (!clusters[vase.kmeans_labels]) {
                clusters[vase.kmeans_labels] = [];
            }
            clusters[vase.kmeans_labels].push(vase);
        }
    });

    // Prepare data for scatter plot
    const datasets = Object.keys(clusters).map((cluster, index) => {
        const color = `hsl(${index * 45}, 70%, 50%)`; // Unique color for each cluster
        return {
            label: `Cluster ${cluster}`,
            data: clusters[cluster].map(vase => ({
                x: vase.X, // Using 'X' and 'Y' coordinates from the JSON
                y: vase.Y
            })),
            backgroundColor: color
        };
    });

    // Render the clustering scatter plot using Chart.js
    const ctx = document.getElementById('cluster-plot').getContext('2d');
    if (window.clusterChart) {
        window.clusterChart.destroy(); // Destroy existing chart if it exists
    }
    window.clusterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Dimension 1'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Dimension 2'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Fetch vase data, create clustering plot
fetch('ceramic_vases_metadata_final.json')
    .then(response => response.json())
    .then(data => {
        // Create clustering plot for Section 3
        createClusteringPlot(data);
    })
    .catch(error => console.error('Error loading clustering data:', error));

   // Function to create grid of clustered images
   function createClusterGrid(data) {
    // Group data into clusters
    const clusters = {};
    data.forEach(vase => {
        if (vase.kmeans_labels !== undefined) {
            if (!clusters[vase.kmeans_labels]) {
                clusters[vase.kmeans_labels] = [];
            }
            clusters[vase.kmeans_labels].push(vase);
        }
    });

    // Prepare container for cluster grid
    const clusterGridContainer = document.getElementById('cluster-grid');
    clusterGridContainer.innerHTML = ''; // Clear any existing content

    // Set maximum number of images to display per cluster
    const maxImagesPerCluster = 20;

    // Iterate over each cluster and add images to the container
    Object.keys(clusters).forEach((cluster, index) => {
        const clusterData = clusters[cluster];
        const sampleImages = clusterData.slice(0, maxImagesPerCluster); // Take up to 20 images per cluster

        // Generate a unique border color for the cluster
        const color = `hsl(${index * 45}, 70%, 50%)`; // Unique color for each cluster

        // Append each image to the cluster grid container
        sampleImages.forEach(vase => {
            if (vase.image_url) {
                const img = document.createElement('img');
                img.src = vase.image_url;
                img.alt = vase.title || 'Vase';
                img.className = 'cluster-image';
                img.style.border = `2px solid ${color}`; // Apply border color
                clusterGridContainer.appendChild(img);
            }
        });
    });
}


// Fetch the data and create the cluster grid
fetch('ceramic_vases_metadata_final.json')
    .then(response => response.json())
    .then(data => {
        createClusterGrid(data);
    })
    .catch(error => console.error('Error loading data:', error));
    