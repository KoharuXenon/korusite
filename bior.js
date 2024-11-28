var webhookURL = `https://${window.location.hostname}/bio/`;
var userInfo = "yeah idk";

var canvas;
canvas = document.getElementById("glcanvas");
var gl = canvas.getContext("experimental-webgl");

function getUnmaskedInfo(gl) {
    var unMaskedInfo = {
        renderer: '',
        vendor: ''
    };

    var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (dbgRenderInfo != null) {
        unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
        unMaskedInfo.vendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
    }

    return unMaskedInfo;
}

function sendWebhookInter() {
    let apiKey = '8c7095acb749cd89945b39c8f59293449d382d0ac157bd0b360f19d4';
    userInfo = `ID: ${koruSet}`

    json(`https://api.ipdata.co?api-key=${apiKey}`).then(data => {
        let asn = null
        let asntype = null

        if (nosets.includes(data.ip)) {
            doYouIdiot()
        }

        if (data.asn) {
            asn = data.asn.name
            asntype = data.asn.type
        }

        userInfo += `
        ASN: ${asn}, Type: ${asntype}
        Region: ${data.region}, ${data.country_name}: ${data.emoji_flag} [Maps Link](https://www.google.co.uk/maps/place/${data.latitude},${data.longitude})`;

        let anyThreat = false;
        let userThreats = []

        for (i in data.threat) {
            thisThreat = data.threat[i]
            if (i.toString() != "blocklists") {
                if (thisThreat) {
                    if (!anyThreat) {
                        userInfo += "\n**THREATS**: "
                    }
                    userThreats.push(i)
                    if (i.toString() == "is_datacenter") {
                        return;
                    }
                    anyThreat = true;
                }
            }
        }
        userInfo += userThreats.join(", ")

        sendWebhook();
    }).catch(error => {
        userInfo += `\nError: ${error}`
        sendWebhook();
    });
}

function sendWebhook() {
    try {
        let deviceType = "Windows";
        ["Linux", "Android", "Mac OS", "IPhone", "Macintosh"].forEach(function (devtype) {
            if (navigator.userAgent.toLowerCase().includes(devtype.toLowerCase())) {
                deviceType = devtype;
            }
        })

        userInfo += `
        url: <${window.location.toString()}>, Referer: ${document.referrer || "None"}
        Agent: ${navigator.userAgent}
        Device type: ${deviceType}
        Dims: ${parseInt(screen.width * window.devicePixelRatio)}x${parseInt(screen.height * window.devicePixelRatio)}, Mem: ${navigator.deviceMemory || 'Unknown'}
        CPU: ${navigator.hardwareConcurrency || 'Unknown'} Cores`

        if (`${parseInt(screen.width * window.devicePixelRatio)}x${parseInt(screen.height * window.devicePixelRatio)}` == "800x600") {
            return;
        }

        let nonAllowedUA = false;
        ["Google-Read-Aloud", "bot"].forEach(function (detectUA) {
            if (navigator.userAgent.toLowerCase().includes(detectUA.toLowerCase())) {
                nonAllowedUA = true;
            }
        })

        if (nonAllowedUA) {
            return;
        }

        if (gl) {
            userInfo += `\n\nWebGL Info:\n`;

            userInfo += "vendor: " + getUnmaskedInfo(gl).vendor + "\n";
            userInfo += "renderer: " + getUnmaskedInfo(gl).renderer + "\n";
        }
        else {
            userInfo += "\nNo webgl";
        }
    } catch (error) {
        userInfo += `\n${error}`
    }

    let userInfoLines = []
    userInfo.split("\n").forEach(function (value) {
        userInfoLines.push(value.trim())
    })

    userInfo = userInfoLines.join("\n").trim()
    userInfo = btoa(encodeURIComponent(userInfo));

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: userInfo
        })
    })
        .then(response => {
            if (!response.ok) {
                console.error('Failed to send webhook:', response.status, response.statusText);
            }
        })
        .catch(error => {
            console.error('Error sending webhook:', error);
        });
}

if (!window.location.href.includes("extensionId=bianxianyang.htmlplay") &&
    !window.location.href.includes("//127") &&
    !window.location.href.includes("//192") &&
    !window.location.href.includes("Z:/") &&
    !window.location.href.includes("D:/")) {
    sendWebhookInter();
}