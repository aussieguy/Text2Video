// Given a certain model, duration, resolution, and whether the content is text or an image is provided, calculate the required credits for video generation.

function calculateVideoCost(model, duration, resolution, textOrImage){
    console.log("Parameters: ", model, duration, resolution, textOrImage);

    // Define the cost structure
    let cost = {
        "pollo-1.6": {
            "5": {
                "480p": {
                    "text": "3",
                    "image": "3"
                },
                "720p": {
                    "text": "4",
                    "image": "4"
                },
                "1080p": {
                    "text": "9",
                    "image": "9"
                }
            },
            "10": {
                "480p": {
                    "text": "5",
                    "image": "5"
                },
                "720p": {
                    "text": "7",
                    "image": "7"
                },
                "1080p": {
                    "text": "12",
                    "image": "12"
                }
            }
        },
        "kling-2-1-Master": {
            "5": {
                "480p": {}
                "image": "20",
                "text": "20"
            },
            "10": {
                "image": "40",
                "text": "40"
            },
        },
        "pixverse-V4-5": {
            "5": {
                "360p": {
                    "text": "2.5",
                    "image": "2.5"
                },
                "540p": {
                    "text": "2.5",
                    "image": "2.5"
                },
                "720p": {
                    "text": "3",
                    "image": "3"
                },
                "1080p": {  
                    "text": "6",
                    "image": "6"
                }   
            },
            "8": {
                "360p": {
                    "text": "5",
                    "image": "5"
                },
                "540p": {
                    "text": "5",
                    "image": "5"
                },
                "720p": {
                    "text": "6",
                    "image": "6"
                }
            }
        }
    };



    return cost[model][duration][resolution][textOrImage];
}