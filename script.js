$(document).ready(function(){
    var id = 1; //image id
    var zip = new JSZip(); // zip

    // cancas image load
    function loadimage(id,i) {
        var width = id.offsetWidth; //dom宽
        var height = id.offsetHeight; //dom高
        // 解决图片模糊
        var scale = window.devicePixelRatio * 2;//放大倍数
        var canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';


        //设置context位置，值为相对于视窗的偏移量负值，让图片复位(解决偏移的重点)
        var rect = id.getBoundingClientRect();//获取元素相对于视察的偏移量

        canvas.getContext("2d").scale(scale, scale);
        canvas.getContext("2d").translate(-rect.left, -rect.top);

        var opts = {
            canvas: canvas,
            useCORS: true, // 【重要】开启跨域配置
            scrollY: 0, // 纵向偏移量 写死0 可以避免滚动造成偶尔偏移的现象
        };
        html2canvas(id, opts).then(function(canvas) {
            // append image to body
            //document.body.appendChild(canvas);

            // download
            var name = $("#C"+i).text();
            //saveAs(canvas.toDataURL(), name);

            // zip package
            package(canvas.toDataURL(), name,i);

            console.log("canvas "+i+"/"+id);


        },1000);
    }

    // save as download
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

        zip.file(filename+".png", url.split(';base64,')[1], {base64: true});
        console.log("zip "+i+"/"+id);


        if(i == (id-1)){
            zip.generateAsync({type:"blob"}).then(function(content) {
                saveAs(content, "example.zip");
            });
            console.log("zip download");
        }

        if(i != (id-1)){
            i++;
            idi(i);
        }

    }

    // Step 1: connect to Youtube API
    $("#load").submit(function(event){

        event.preventDefault();

        var videoId = $("#videoId").val();
        var commentNum = $("#commentNum").val();
        var order = $("#order").val();
        var result = "";
        var key = "AIzaSyBg4vDgPr6uFZqwg2L6BvVovASTQGm7Nh4";
        var pageToken ="";


        while(commentNum > 0){
            var number = 0;
            if(commentNum > 100){
                number = 100;
            }else{
                number = commentNum;
            }
            if(pageToken.length == 0){
                var url = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=" + videoId + "&maxResults=" + number + "&order=" + order + "&key=" + key;
            }else{
                var url = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=" + videoId + "&maxResults=" + number + "&order=" + order + "&pageToken=" + pageToken + "&key=" + key;

            }
            $.get(url,function(data){
                console.log(data);

                for(var i = 0; i < data.items.length; i++){
                    result = `

                        <div class="comment" id="${id}">    
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
                pageToken =data.nextPageToken;
                alert(pageToken);
            })
            commentNum = commentNum - 100;
        }
        $("#loadSubmit").hide();

    })


    function process(i){
        var process = i / (id - 1) * 100;
        var width = process.toFixed(2) + "%";
        $("#loadProcess").css("width",width);
        $("#loadProcess").html(width);
    }


    function idi(i){
        loadimage(document.getElementById(i),i);

        console.log(i+" idi");
        process(i);

    }

    $("#download").submit(function(event){

        event.preventDefault();

        var i = 1;

        idi(i);

        // for(var i = 1; i <= id; i++){
        //     loadimage(document.getElementById(i),i);


        // }

        //zipDownload(zip);
        //alert("y");
    })


})