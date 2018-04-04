$(document).ready(function(){
    
    var id = 1; // image id
    var zip = new JSZip(); // zip package
    var zipCheck = true; // zip package download
    var downloadNum = 0; // downloaded comment number
    var pageToken =""; // next page key
    var videoId =""; // videoId
    var videoTitle =""; // video title
    var order ="" // comment order
    var key = "AIzaSyBg4vDgPr6uFZqwg2L6BvVovASTQGm7Nh4"; // youtube api key


    // load comment canvas 
    function loadimage(element,i) {
		var width = element.offsetWidth; //dom width
		var height = element.offsetHeight; //dom height
        
        // fix blurred picture
		var scale = window.devicePixelRatio * 2; // 2x device pixel
        var canvas = document.createElement('canvas'); // create canvas
		canvas.width = width * scale;
		canvas.height = height * scale;
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';

        // fix picture offset
        //设置context位置，值为相对于视窗的偏移量负值，让图片复位(解决偏移的重点)
        var rect = element.getBoundingClientRect(); // get object position relative to the viewport
                
        canvas.getContext("2d").scale(scale, scale); 
        canvas.getContext("2d").translate(-rect.left-8, -rect.top);
 
		var opts = {
			canvas: canvas,
			useCORS: true, // Open cross domain
            scrollY: 0, // Y offset = 0  Avoid deviation caused by rolling
        };
        
        // get png
		html2canvas(element, opts).then(function(canvas) {
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
                //console.log("Comment " + i + " downloading");

                // package message
                $("#packageMessage").append("Comment " + i + " downloading...<br>");
                document.getElementById('packageMessage').scrollTop = document.getElementById('packageMessage').scrollHeight;

                if(i < (id-1)){
                    i++;
                    next(i);
                }else{
                    // package message
                    $("#packageMessage").append("Comment download complete.<br>");
                    document.getElementById('packageMessage').scrollTop = document.getElementById('packageMessage').scrollHeight;
                    swal({
                        title: "Comments downloaded!",
                        text: "How is your experience?",
                        icon: "success",
                        buttons: {
                            cancel: "Not Good",
                            defeat: "Great",
                        }
                    })
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
        //console.log("Comment " + i + " start packaging");

        // pacakage message
        $("#packageMessage").append("Comment " + i + " packaging...<br>");
        document.getElementById('packageMessage').scrollTop = document.getElementById('packageMessage').scrollHeight;
        
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
            saveAs(content, videoTitle +" Comments.zip");
        });
        // debug message
        //console.log(downloadNum + " comments packaged");
        //console.log("zip downloading");

        // package message
        $("#packageMessage").append(downloadNum + " comments packaged<br>");
        $("#packageMessage").append("zip downloading...<br>");
        document.getElementById('packageMessage').scrollTop = document.getElementById('packageMessage').scrollHeight;
        swal({
            title: "Comments downloaded!",
            text: "How is your experience?",
            icon: "success",
            buttons: {
                cancel: "Not Good",
                defeat: "Great",
            }
        })
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
            // package message
            $("#packageMessage").append("Comment "+ i +" rendering...<br>");
            document.getElementById('packageMessage').scrollTop = document.getElementById('packageMessage').scrollHeight;
        }
        else{
            if(i < (id-1)){
                i++;
                next(i);
            }else if(zipCheck && (downloadNum>0)){
                zipDownload();
            }else if(downloadNum == 0){
                // package message
                $("#packageMessage").append("No comments found!<br>");
                $("#packageMessage").removeClass("alert-success");
                $("#packageMessage").addClass("alert-danger");
                $("#loadProcess").removeClass("bg-success");
                $("#loadProcess").addClass("bg-danger");
                document.getElementById('packageMessage').scrollTop = document.getElementById('packageMessage').scrollHeight;
                swal ( "Oops" ,  "No comments found!" ,  "error" ); 
                
            }
        }
        // debug message
        // console.log("Comment "+ i +" start rendering");

        

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
    function appendComment(data,commentNum){
        var result = "";
        var i = 0; // number of data

        // debug message
        //console.log(data);

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
                loadComment(commentNum);
            }else if(commentNum <= 0 && pageToken != null){
                $("#loadMessage").text((id-1) +" comments have been loaded.");
            }else if(pageToken == null){
                $("#loadMessage").html((id-1) +" comments have been loaded.<br>All top-level comments loaded.<br>Reply is temporarily not supported");
                $(".loadMoreComment").attr("disabled",true);
            }
        }
    }


    // load comments connect to google api
    function loadComment(commentNum){
            
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
                appendComment(data,commentNum);
            }).fail(function(){
                swal ( "Oops" ,  "Something went wrong!" ,  "error" );
            });

    }

    function videoInfo(video){
        var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&part=statistics&id=" + video + "&key=" + key;
        $.get(url,function(data){
            // debug message
            console.log(data);
            if(data.items.length != 0){
                var title = data.items[0].snippet.title;
                videoTitle = title;
                if(title.length > 41){
                    title = title.substring(0,39) + "...";
                }
                var publishedTime = data.items[0].snippet.publishedAt;
                publishedTime = timeChange(publishedTime);
                var channel = data.items[0].snippet.channelTitle;
                var commentCount = data.items[0].statistics.commentCount;
                if(commentCount > 1e6){
                    commentCount = Math.floor(commentCount/1e5)/10 + "m";
                }else if(commentCount > 1e3){
                    commentCount = Math.floor(commentCount/1e2)/10 + "k";
                }
                var viewCount = data.items[0].statistics.viewCount;
                if(viewCount > 1e6){
                    viewCount = Math.floor(viewCount/1e5)/10 + "m";
                }else if(viewCount > 1e3){
                    viewCount = Math.floor(viewCount/1e2)/10 + "k";
                }

                var info = `
                <label>Video Info</label>
                <div class="row videoInfo">
                        <img src="https://i.ytimg.com/vi/${video}/mqdefault.jpg">
                    <div class="video-detail">
                        <div class="video-info">
                            <h3>${title}</h3>
                            <div class="video-info-detail">
                                <div class="channel">
                                    <span>${channel}</span>
                                </div>
                                <div class="views">
                                    <span>${commentCount} comments • ${viewCount} views • ${publishedTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                `;
                $("#videoInfo").html(info);
                
                $("#videoId").removeClass("is-invalid");
                $("#videoId").addClass("is-valid");  
                $("#videoIdFeedback").removeClass("invalid-feedback");
                $("#videoIdFeedback").addClass("valid-feedback");
                $("#videoIdFeedback").text("video id is valid.");
                $("#loadSubmit").attr("disabled",false);
            }
            else{
                $("#videoIdFeedback").text("The video id you entered does not exist.");
                $("#loadSubmit").attr("disabled",true);
                
            }   
        })

    }

    // up
    $(window).scroll(function() {
        var scrollY = $(document).scrollTop();
 
        if (scrollY > 550){ //如果滚动距离大于550px则隐藏，否则删除隐藏类
            $('#up').fadeIn("slow");
        } 
        else {
            $('#up').fadeOut("slow");
        }
    })

    $("#up").click(function(){
        $("html,body").animate({scrollTop:0},1000);
    })

    // Step 1: check & load comments 
    $("#load").on('input propertychange', () => {
        var videoIdTemp = $("#videoId").val();
        var apiCheck = $("#apiCheck").is(":checked");
        var commentNum = $("#commentNum").val();


        if(videoIdTemp.length != 11){
            $("#videoId").removeClass("is-valid");
            $("#videoId").addClass("is-invalid");
            $("#videoIdFeedback").removeClass("valid-feedback");
            $("#videoIdFeedback").addClass("invalid-feedback");
            $("#videoIdFeedback").text("The length of video id should be 11. You entered "+ videoIdTemp.length);
            $("#loadSubmit").attr("disabled",true);
            var helper =`
                <label id="howTo">How to use?</label>
                <div class="videoPlayer" style="padding-top: 0.4rem;">
                    <iframe id="ytplayer" type="text/html" width="320" height="180"
                    src="https://www.youtube.com/embed/M7lc1UVf-VE?controls=0&fs=0"
                    frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="idHelper">
                    <label>Where is the video id?</label>
                    <img src="idhelp.gif">
                    
                </div>
            `
            if(!document.getElementById("howTo")){
                $("#videoInfo").html(helper);
            }
        }else{
            videoInfo(videoIdTemp);    
        }

        $("#commentNumLabel").text("Load " + commentNum*10 + " comments");
       
        if(!apiCheck){
            $("#api").show();
            $(".custom-switch").removeClass("mt-4");
        }else{
            $("#api").hide();
            $(".custom-switch").addClass("mt-4");
        }
    
    })

    $("#load").submit(function(event){
        
        event.preventDefault();

        videoId = $("#videoId").val();
        var commentNum = $("#commentNum").val()*10;
        order = $("#order").val();
        var apiKey = $("#apiKey").val();

        // api key input
        if(apiKey){
            key = apiKey;
            // debug message
            //console.log(key);
        }
        
        // load comment
        loadComment(commentNum);
        $("#result").addClass("pt-4");
        
        $("#step1").removeClass("show active");
        $("#step2").addClass("show active");
        $("#step1Control").removeClass("active");
        $("#step2Control").addClass("active");
        
        setTimeout(function(){   
            $("html,body").animate({scrollTop:$("#result").offset().top},1000);
        },1000);
        
        
    })

    // Step2: comment style
    $("#loadMoreComment10").click(function(){
        var commentNum = 10;
        loadComment(commentNum);
        

    })

    $("#loadMoreComment20").click(function(){
        var commentNum = 20;
        loadComment(commentNum);
       
    })
    $("#loadMoreComment50").click(function(){
        var commentNum = 50;
        loadComment(commentNum);
        
    })

    $("#commentSize").on('input propertychange', () => {
        var value = $("#radiusValue").val();
        $(".comment").css("border-radius",value+"px");
        $("#borderRadius").text("Border Radius: "+value+"px");

    });
    $("#step2next").click(function(){
        $("#step2").removeClass("show active");
        $("#step3").addClass("show active");
        $("#step2Control").removeClass("active");
        $("#step3Control").addClass("active");
    })

    // Step 3: package and download
    $("#previous").click(function(){
        $("#step3").removeClass("show active");
        $("#step2").addClass("show active");
        $("#step3Control").removeClass("active");
        $("#step2Control").addClass("active");
    })

    $("#zipCheck").on('input propertychange', () => {
        zipCheck = $("#zipCheck").is(":checked");
        if(zipCheck){
            // package message
            $("#packageMessage").append("Comments will be packaged for downloading.<br>");
            document.getElementById('packageMessage').scrollTop = document.getElementById('packageMessage').scrollHeight;
        }else{
            // package message
            $("#packageMessage").append("Comments will be downloaded one by one.<br>");
            document.getElementById('packageMessage').scrollTop = document.getElementById('packageMessage').scrollHeight;
        }

    })

    $("#downloadBtn").click(function(event){
        
        event.preventDefault();

        // debug message
        console.log("Download as zip: " + zipCheck);
        
        var i = 1;
        
        next(i);

        
    
    })



})