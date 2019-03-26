const sketches = [
    "Images",
    "Snake",
    "3D",
    "DrawingGame",
    "RainbowWave"
];

let currentlyLoaded = false;
const loadedSketches = {};

function load(name) {
    fetch(`sketches/${name}.js`)
        .then(result => result.text())
        .then(result => {
            if (currentlyLoaded) {
                loadedSketches[currentlyLoaded].stop();
            }

            currentlyLoaded = name;
            loadedSketches[name] = eval(`${result}`);
        })
}

function addSketches() {
    load(sketches[0]);
    let sketchSelect = document.querySelector("#sketches");
    sketches.forEach(sketch => {
        let sketchOption = document.createElement("option");
        sketchOption.innerHTML = sketch;
        sketchOption.value = sketch;
        sketchSelect.append(sketchOption);
    })

    sketchSelect.addEventListener("change", e => {
        load(e.target.value);
    });
}


addSketches();