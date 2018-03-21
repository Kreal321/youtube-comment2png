$(document).ready(function(){

    var id = 1; // image id
    var zip = new JSZip(); // zip package
    var zipCheck = true; // zip package download
    var downloadNum = 0; // downloaded comment number
    var pageToken =""; // next page key
    var videoId ="";
    var key = "AIzaSyBg4vDgPr6uFZqwg2L6BvVovASTQGm7Nh4"; // youtube api key


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
                    next(i);
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
        // rendering next comment
        if(i < (id - 1)){
            i++;
            next(i);
        }
        // zip download
        else{
            zipDownload();
        }

    }

    // zip download
    function zipDownload(){
        zip.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content, "example.zip");
        });
        // debug message
        console.log(downloadNum + " comments packaged");
        console.log("zip downloaded");
    }


    // progress bar
    function process(i){
        var process = i / (id - 1) * 100;
        var width = process.toFixed(2) + "%";
        $("#loadProcess").css("width",width);
        $("#loadProcess").html(width);
    }

    // next canvas rendering
    function next(i){
        // check if comment exsit
        if(document.getElementById(i)){
            loadimage(document.getElementById(i),i);
            downloadNum++;
        }
        else{
            if(i < (id-1)){
                i++;
                next(i);
            }else if(zipCheck){
                zipDownload();
            }
        }
        // debug message
        console.log("Comment "+ i +" start rendering");
        // process bar
        process(i);

    }

    // time change
    function timeChange(cTime){
        // change date format
        var cDate = cTime.substring(0,19);
        cDate = cDate.replace(/-/g, "/");
        cDate = cDate.replace("T", " ");
        // get time difference
        var startDate = new Date(cDate);
        var endDate = new Date();
        var dateDiff = endDate.getTime() - startDate.getTime();
        if(dateDiff >= 63072e6){
            return Math.floor(dateDiff / 31536e6) + " years ago"; // x years ago
            console.log(time + " years ago");
        }
        else if(dateDiff >= 31536e6){
            return Math.floor(dateDiff / 31536e6) + " year ago";  // 1 year ago
            console.log(time + " years ago");
        }
        else if(dateDiff >= 5184e6){
            return Math.floor(dateDiff / 2592e6) + " months ago"; // x months ago
            console.log(time + " months ago");
        }
        else if(dateDiff >= 2592e6){
            return Math.floor(dateDiff / 2592e6) + " month ago"; // 1 month ago
            console.log(time + " months ago");
        }
        else if(dateDiff >= 12096e5){
            return Math.floor(dateDiff / 6048e5) + " weeks ago";  // x weeks ago
            console.log(time + " weeks ago");
        }
        else if(dateDiff >= 6048e5){
            return Math.floor(dateDiff / 6048e5) + " week ago";  // 1 week ago
            console.log(time + " weeks ago");
        }
        else if(dateDiff >= 1782e5){
            return Math.floor(dateDiff / 864e5) + " days ago"; // x days ago
            console.log(time + " days ago");
        }
        else if(dateDiff >= 864e5){
            return Math.floor(dateDiff / 864e5) + " day ago"; // 1 day ago
            console.log(time + " days ago");
        }
        else if(dateDiff >= 72e5){
            return Math.floor(dateDiff / 36e5) + " hours ago"; // x hours ago
            console.log(time + " hours ago");
        }
        else if(dateDiff >= 36e5){
            return Math.floor(dateDiff / 36e5) + " hour ago"; // 1 hour ago
            console.log(time + " hours ago");
        }
        else if(dateDiff >= 12e4){
            return Math.floor(dateDiff / 6e4) + " minutes ago"; // x minutes ago
            console.log(time + " minutes ago");
        }
        else if(dateDiff >= 6e4){
            return Math.floor(dateDiff / 6e4) + " minute ago"; // 1 minute ago
            console.log(time + " minutes ago");
        }
        else if(dateDiff >= 2e3){
            return Math.floor(dateDiff / 1e3) + " seconds ago"; // x seconds ago
            console.log(time + " seconds ago");
        }
        else if(dateDiff >= 1e3){
            return Math.floor(dateDiff / 1e3) + " second ago"; // 1 second ago
            console.log(time + " seconds ago");
        }

    }

    // append comments
    function appendComment(data,commentNum,order){
        var result = "";
        var i = 0; // number of data

        // debug message
        console.log(data);



        // append comments
        for(i = 0; i < data.items.length; i++){
            var dataTime = timeChange(data.items[i].snippet.topLevelComment.snippet.publishedAt);
            result = `

                <div class="comment position-relative" style="border-radius: 10px" id="${id}">
                    <a class="delete" onclick="removeComment(${id})" data-html2canvas-ignore ><img src="close.png" class="delete-img" /></a>     
                    <img src="${data.items[i].snippet.topLevelComment.snippet.authorProfileImageUrl}" class="img">
                    <div class="comment-text">
                        <div class="comment-header">
                            <span class="user">${data.items[i].snippet.topLevelComment.snippet.authorDisplayName}</span>
                            <span class="time">${dataTime}</span>
                        </div>
                        <div class="comment-detail" id="C${id}">${data.items[i].snippet.topLevelComment.snippet.textDisplay}</div>
                    </div>
                </div>    

            `;

            $("#result").append(result);
            id++;
        }
        // renew pageToken
        pageToken = data.nextPageToken;
        // debug message
        //console.log("pageToken: " + pageToken);
        console.log(i + " comments loaded.");

        if(i == data.items.length){
            // number of comments left
            commentNum = commentNum - 100;
            // load left comments
            if(commentNum > 0 && pageToken != null){
                loadComment(commentNum,order);
            }
        }
    }


    // load comments connect to google api
    function loadComment(commentNum,order){

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
        // connect to google api
        $.get(url,function(data){
            // append comment
            appendComment(data,commentNum,order)
        });

    }


    // Step 1: load comments
    $("#load").submit(function(event){

        event.preventDefault();

        videoId = $("#videoId").val();
        var commentNum = $("#commentNum").val();
        var order = $("#order").val();

        // load comment
        loadComment(commentNum,order);

        // hide button
        $("#loadSubmit").hide();

    })

    // Step2: comment style
    $("#commentSize").on('input propertychange', () => {
        var value = $("#fillet").val();
        $(".comment").css("border-radius",value+"px");
        $("#borderRadius").text("Border Radius: "+value+"px");

    });

    // Step 3: package and download
    $("#download").submit(function(event){

        event.preventDefault();

        zipCheck = $("#zipCheck").is(":checked");
        // debug message
        console.log("Download as zip: " + zipCheck);

        var i = 1;

        next(i);

    })






})