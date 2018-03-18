$(document).ready(function(){

    var id = 1; // image id
    var zip = new JSZip(); // zip package
    var zipCheck = true; // zip package download

    // load canvas
    function loadimage(id,i) {
        var width = id.offsetWidth; //dom width
        var height = id.offsetHeight; //dom height

        // fix blurred picture
        var scale = window.devicePixelRatio * 2; // 2x device pixel
        var canvas = document.createElement('canvas'); // create canvas
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        // fix picture offset
        //设置context位置，值为相对于视窗的偏移量负值，让图片复位(解决偏移的重点)
        var rect = id.getBoundingClientRect(); // get object position relative to the viewport

        canvas.getContext("2d").scale(scale, scale);
        canvas.getContext("2d").translate(-rect.left-8, -rect.top);

        var opts = {
            canvas: canvas,
            useCORS: true, // Open cross domain
            scrollY: 0, // Y offset = 0  Avoid deviation caused by rolling
        };

        // get png
        html2canvas(id, opts).then(function(canvas) {
            // append image to body (debug)
            // document.body.appendChild(canvas);

            // png file name
            var name = $("#C"+i).text();

            // zip download
            if(zipCheck){
                package(canvas.toDataURL(), name, i);
            }
            // Single download
            else{
                saveAs(canvas.toDataURL(), name);
                // debug message
                console.log("Comment " + i + " downloading");
                if(i != (id-1)){
                    i++;
                    idi(i);
                }
            }

        },1000);
    }

    // single download (not use)
    function saveAss(uri, filename) {

        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);
        } else {
            window.open(uri);
        }
    }


    // JS zip
    function package(url,filename,i){
        // package png file
        zip.file(filename+".png", url.split(';base64,')[1], {base64: true});
        // debug message
        console.log("Comment " + i + " start packaging");

        // zip download
        if(i == (id-1)){
            zip.generateAsync({type:"blob"}).then(function(content) {
                saveAs(content, "example.zip");
            });
            // debug message
            console.log((id -1) + " comments packaged");
            console.log("zip downloaded");
        }


        if(i != (id-1)){
            i++;
            idi(i);
        }

    }

    // progress bar
    function process(i){
        var process = i / (id - 1) * 100;
        var width = process.toFixed(2) + "%";
        $("#loadProcess").css("width",width);
        $("#loadProcess").html(width);
    }

    // canvas process
    function idi(i){
        loadimage(document.getElementById(i),i);
        // debug message
        console.log("Comment "+ i +" start rendering");
        // process bar
        process(i);

    }

    // Step 1: load comments
    $("#load").submit(function(event){

        event.preventDefault();

        var videoId = $("#videoId").val();
        var commentNum = $("#commentNum").val();
        var order = $("#order").val();
        var result = "";
        var key = "AIzaSyBg4vDgPr6uFZqwg2L6BvVovASTQGm7Nh4"; // youtube api key
        var pageToken =""; // next page key


        while(commentNum > 0){
            // get number of comments to take, max 100
            var number = 0;
            if(commentNum > 100){
                number = 100;
            }else{
                number = commentNum;
            }
            // connect to Youtube API
            if(pageToken.length == 0){
                var url = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=" + videoId + "&maxResults=" + number + "&order=" + order + "&key=" + key;
            }else{
                var url = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=" + videoId + "&maxResults=" + number + "&order=" + order + "&pageToken=" + pageToken + "&key=" + key;

            }
            $.get(url,function(data){
                // debug
                console.log(data);
                // load comments
                for(var i = 0; i < data.items.length; i++){
                    result = `

                        <div class="comment" style="border-radius: 10px" id="${id}">    
                            <img src="${data.items[i].snippet.topLevelComment.snippet.authorProfileImageUrl}" class="img">
                            <div class="comment-text">
                                <div class="comment-header">
                                    <span class="user">${data.items[i].snippet.topLevelComment.snippet.authorDisplayName}</span>
                                    <span class="time">${data.items[i].snippet.topLevelComment.snippet.publishedAt}</span>
                                </div>
                                <div class="comment-detail" id="C${id}">${data.items[i].snippet.topLevelComment.snippet.textDisplay}</div>
                            </div>
                        </div>    

                    `;

                    $("#result").append(result);
                    id++;
                }
                pageToken = data.nextPageToken;
                // debug message
                console.log(number + " comments loaded.");
                //console.log("pageToken: " + pageToken);

            })
            // number of comments left
            commentNum = commentNum - 100;
        }
        // hide button
        $("#loadSubmit").hide();

    })


    // Step 2: package and download
    $("#download").submit(function(event){

        event.preventDefault();

        zipCheck = $("#zipCheck").is(":checked");
        // debug message
        console.log("Download as zip: " + zipCheck);

        var i = 1;

        idi(i);


    })

    $("#commentSize").on('input propertychange', () => {
        var value = $("#fillet").val();
        $(".comment").css("border-radius",value+"px");
        console.log(value);

    });


})