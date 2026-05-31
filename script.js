<script>
const MAP_WIDTH = 1920;
const MAP_HEIGHT = 1080;

const regions = [

{
    name: "Safe Shallows",
    weight: 50,
    points: [
        [400,300],
        [900,250],
        [1200,500],
        [1100,900],
        [700,1050],
        [350,800]
    ]
},

{
    name: "Thermal Zone",
    weight: 25,
    points: [
        [1300,250],
        [1700,250],
        [1800,600],
        [1500,750],
        [1250,500]
    ]
},

{
    name: "Deep Reef",
    weight: 10,
    points: [
        [200,850],
        [500,850],
        [600,1050],
        [250,1050]
    ]
}

];

drawRegions();

function update(){
    spawnRandomPoint();
}

function drawRegions(){

    const svg =
        document.getElementById("map-overlay");

    svg.innerHTML = "";

    svg.setAttribute(
        "viewBox",
        `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`
    );

    regions.forEach(region => {

        const polygon =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "polygon"
            );

        polygon.setAttribute(
            "points",
            region.points
                .map(p => `${p[0]},${p[1]}`)
                .join(" ")
        );

        polygon.setAttribute(
            "class",
            "debug-region"
        );

        svg.appendChild(polygon);

    });

}

function chooseWeightedRegion(){

    const totalWeight =
        regions.reduce(
            (sum,r) => sum + r.weight,
            0
        );

    let random =
        Math.random() * totalWeight;

    for(const region of regions){

        random -= region.weight;

        if(random <= 0){
            return region;
        }
    }

    return regions[0];
}

function pointInPolygon(x,y,poly){

    let inside = false;

    for(
        let i = 0, j = poly.length - 1;
        i < poly.length;
        j = i++
    ){

        const xi = poly[i][0];
        const yi = poly[i][1];

        const xj = poly[j][0];
        const yj = poly[j][1];

        const intersect =
            ((yi > y) !== (yj > y))
            &&
            (
                x <
                ((xj - xi) * (y - yi))
                /
                (yj - yi)
                +
                xi
            );

        if(intersect){
            inside = !inside;
        }
    }

    return inside;
}

function randomPointInPolygon(poly){

    const xs = poly.map(p => p[0]);
    const ys = poly.map(p => p[1]);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    while(true){

        const x =
            Math.random() *
            (maxX - minX) +
            minX;

        const y =
            Math.random() *
            (maxY - minY) +
            minY;

        if(pointInPolygon(x,y,poly)){
            return {x,y};
        }
    }

}

function spawnRandomPoint(){

    const svg =
        document.getElementById("map-overlay");

    svg
        .querySelectorAll(".spawn-dot")
        .forEach(dot => dot.remove());

    const chosenRegion =
        chooseWeightedRegion();

    const point =
        randomPointInPolygon(
            chosenRegion.points
        );

    const circle =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

    circle.setAttribute(
        "cx",
        point.x
    );

    circle.setAttribute(
        "cy",
        point.y
    );

    circle.setAttribute(
        "r",
        15
    );

    circle.setAttribute(
        "class",
        "spawn-dot"
    );

    svg.appendChild(circle);

    console.log(
        "Spawned in:",
        chosenRegion.name
    );

}

spawnRandomPoint();
</script>
