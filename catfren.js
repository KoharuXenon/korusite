function computeVelocity(Velocity, Acceleration, Drag, Max, Elapsed) {
    if (Acceleration != 0) {
        Velocity += Acceleration * Elapsed;
    }
    else if (Drag != 0) {
        var drag = Drag * Elapsed;
        if (Velocity - drag > 0) {
            Velocity -= drag;
        }
        else if (Velocity + drag < 0) {
            Velocity += drag;
        }
        else {
            Velocity = 0;
        }
    }
    if ((Velocity != 0) && (Max != 0)) {
        if (Velocity > Max) {
            Velocity = Max;
        }
        else if (Velocity < -Max) {
            Velocity = -Max;
        }
    }
    return Velocity;
}

const stand = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAABZklEQVRIS+2VMWoCQRSG3x7BwkMY04lBSG4gCAFbUwspE7C1DWjlDUwbsMoBAgqibBfMFdLlCIZ/8de345vZiQax8DW7O/Nmvvn/mXmbyIkiORFHLqCDnT4f6yrXtTVlfH2m5sJicoKKOEGtUZd0vhQLFJODhXpBegIkWqCYHLoRtAJKGABZwZzxXUOqg5Gp2qsIK9UQJL4O+1tO52n3jkZAEH8CuXZwdoJciFbp20dTkaUm9vKcNwirc/fJtcntP0jRuvcjyUvJ65rVHw1yL58+uiA+TOe5424pQoJ1sffuEWCr2btc3TYFT19Y/WjzlakcSNesEMSCA8KIUoRkDeTgVS/NXpPyY/asPO9sDAHYV/ibyKzcQDio89HN7RX3hQuMVqStIehtciPt+0XWpUH4Zh2k3dZeFSqilVtVrW+xyhBgR4Foh54EcOtos826T4U/Pg5GUYUloWpBy/8dpMsU333V4RdwvukbMKvTXgAAAABJRU5ErkJgggAA')";
const grab = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAABcklEQVRIS+2VMUpDQRCG9x3BwkMk2j2UgIIHsBJsYy1YKqS1DWhlY520gpUHEBSC8jqJx/AI0X/hTybjzLyNRUjhNm/Znd1v5t9/91VpTa1aEyf9g/6s9OZI19mtZyzj86MxEyuJCSviBnVvLzWT92SBSmKQqAuSGyDQApXEUI1QClTCBpDVGDM67KWdmzuzarciZCohCBzfXs85/ctFH4OAoK0E0nJwd4I0RFbpnaNZkVVN6eXZbBCy0+ekZdLz2jDyOvxyHaWbDb5SNdxyVbPmCZq+PuV13YPjuQuXQPrySeti4dnLZMnuUUWAuSDsAhiDmJlVFjbR8xjjK8I1lM+sCEERxANzXMJMEAPlI8mx6aDJ3Wr7In87VwsZJYB9bfWit258dJ8eHvfT6clb3qf/fB5eLZoidB3PCV8eNkBs3WFt2j6ydlbCSs18635gbRDvf7USiBl7lo4gIUhKp2UhzDoL7/BazaDvg3ZkWyVc/w1Z0eIbBlfNOgAAAABJRU5ErkJgggAA')";
const fall = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAABcElEQVRIS+2VsU4CQRCG9x7ChwDpLhISTXgAKhJarEkoNbG1NdGKxlpaEisfgEQTormO4OMo/5r/HIaZvZOCEOI03M0O8+0/OzuXhT1ZtidO+AftXOnDKV2jlX9RxueyMDdWJyapiAnyzlkoFh/BAtWJwUZdkEyAQAtUJ4bVSJYCSmgAWcaYp4tOOL2fmKpdRdiphCBw+nBbcoZXv89wAgL7E0iXg9kJ0hCp0jtHU5Glpu7lOU6QVC+vw1bXycunG0KfB96tzly9vcTQ5nmv7MINkL58TMSuunxdxARsdb0ReQUAc0FIApjcEZ+lGiTw/JwijGf5TEUIshKlug9wmoSZIAbKc6JvdVPEx+xkHH8b1z9llKbPK9kMGoY/T7uPYfbcDoP+e1wezkcpceUZVoL0dACI1rzLNzqNfj0L9aR3h+rWrFvDqiDe9yqW3KqBNYaqWjoFSYKwSFW6LNpfBXFBsavEJxzvTOb5k92xXvwGlzPZG/BHWEMAAAAASUVORK5CYIIA')";

let mouseX = 0;
let mouseY = 0;

const catW = 52;
const catH = 52;

let catX = getRandomNumber(0, window.innerWidth-catW);
let catY = 0;

let catPX = 0;
let catPY = 0;
let catPX2 = 0;
let catPY2 = 0;
let catPX3 = 0;
let catPY3 = 0;

let catVX = getRandomNumber(-500, 500);
let catVY = 0;

let gravity = 800

let airdrag = gravity / 3;
let bottomdrag = gravity * 2;

let xdrag = airdrag;
let accel = gravity;

let tFPS = 60;
let tFTIM = 1 / tFPS;

let grabbed = false;

let graboX = 0;
let graboY = 0;

function gTime() {
    return Date.now() / 1000;
}

let startTime = gTime();
let prevtime = startTime - tFTIM;

function disableTextSelection() {
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
}

function enableTextSelection() {
    document.body.style.userSelect = 'auto';
    document.body.style.webkitUserSelect = 'auto';
    document.body.style.mozUserSelect = 'auto';
    document.body.style.msUserSelect = 'auto';
}

window.addEventListener('mouseup', function(event) {
    enableTextSelection();
});

(function catty() {
    const catFren = document.createElement("div");
    catFren.style.backgroundImage = fall;
    catFren.style.backgroundSize = "contain";
    catFren.style.imageRendering = "pixelated";
    catFren.style.width = `${catW}px`;
    catFren.style.height = `${catH}px`;
    catFren.style.position = "absolute";
    catFren.id = "catFren";

    catFren.style.left = catX + "px";
    catFren.style.top = catY + "px";

    document.body.appendChild(catFren);

    catFren.addEventListener('mousedown', function(event) {
        disableTextSelection();
        grabbed = true;
        graboX = catX - mouseX;
        graboY = catY - mouseY;

        catFren.style.backgroundImage = grab;

        catVX = 0;
        catVY = 0;
        accel = 0;
    });

    document.addEventListener("mousemove", function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    window.addEventListener('mouseup', function (event) {
        if (!grabbed)
            playAudio();
        grabbed = false;
        accel = gravity;
        xdrag = airdrag;

        catFren.style.backgroundImage = fall;

        catVX = (catX - catPX2)*8;
        catVY = (catY - catPY2)*8;

        console.log(catVX, catVY);
    });

    function frameUpdate() {
        startTime = gTime();
        let elapsed = startTime - prevtime;

        catPX3 = catPX2;
        catPY3 = catPY2;

        catPX2 = catPX;
        catPY2 = catPY;

        catPX = catX
        catPY = catY
        if (!grabbed) {
            let velocityDelta = 0.5 * (computeVelocity(catVX, 0, xdrag, 0, elapsed) - catVX)
            catVX += velocityDelta
            let delta = catVX * elapsed
            catVX += velocityDelta
            catX += delta

            velocityDelta = 0.5 * (computeVelocity(catVY, accel, 0, 0, elapsed) - catVY)
            catVY += velocityDelta
            delta = catVY * elapsed
            catVY += velocityDelta
            catY += delta
        }
        else {
            catX = mouseX + graboX;
            catY = mouseY + graboY;
        }

        if (catX < 0) {
            catVX *= -0.5
            catX = 0
            console.log("bounce left");
        }
        if (catX > window.innerWidth - catW) {
            catX = window.innerWidth - catW
            catVX *= -0.5
            console.log("bounce right");
        }
        if (catY < 0) {
            catVY *= -0.85
            catY = 0
            console.log("bounce top");
        }
        if (catY > window.innerHeight - catH) {
            if (catVY > 100) {
                catY = window.innerHeight - catH
                catVY *= -0.4
                console.log("bounce bottom");
            }
            else {
                catVY = 0;
                accel = 0;
                catY = window.innerHeight - catH;
                xdrag = bottomdrag;
                if (!grabbed)
                    catFren.style.backgroundImage = stand;
                //console.log("land");
            }
        }

        catFren.style.left = catX + "px";
        catFren.style.top = catY + "px";

        prevtime = gTime();
    }

    setInterval(frameUpdate, tFTIM * 1000);
})();