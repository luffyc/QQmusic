$(function(){
	var audio = $('audio').get(0);
    var play_box = $('#divsonglist ul');
    var database = [];

    var render = function(){
        play_box.empty();
        $.each(database,function(k,v){
            $('<li><strong class="music-name">'+v.title+'</strong><strong class="singer-name">'+v.artist+'</strong><strong class="music-time">'+v.duration+'</strong><div class="music-button"><strong id="heart"></strong><strong id="jiantou"></strong><strong id="xing"></strong><strong id="delete"></strong></div></li>').appendTo(play_box);
        })
        $('.open-list span').text(database.length);
    }


    $.getJSON('/QQmusic/database.json')
    .done( function(data){
        database = data;
        render();
    });
    
    
    var currentsong = 0;
    var onsongchange = function(){
    	audio.play();
        $('#divsonglist li').removeClass('play_current');
        $('#divsonglist li').eq( currentsong ).addClass('play_current');
        $('#title-bottom').text( database[ currentsong ].title );
        $('#artist').text( database[ currentsong ].artist );
        $('#duration').text( database[ currentsong ].duration );
    }



    //播放暂停
    $('#play').on('click',function(){
    	if(audio.paused){
    		audio.play();
    	}else{
            audio.pause();
    	}
    	$('#divsonglist li').removeClass('play_current');
        $('#divsonglist li').eq( currentsong ).addClass('play_current');
    })

    $(audio).on('play',function(){
    	$('#play').removeClass('play_bt').addClass('pause_bt');
    })
    $(audio).on('pause',function(){
    	$('#play').removeClass('pause_bt').addClass('play_bt');
    })
    

    //点击切换
    $('#divsonglist').on('click','li',function(){
    	currentsong = $(this).index();
    	audio.src = database[ currentsong ].filename;
    	onsongchange();
    })

    $('#next').on('click',function(){
    	currentsong += 1;
    	if( currentsong === database.length ){
    		currentsong = 0;
    	}
    	audio.src = database[ currentsong ].filename;
    	onsongchange();
    })

    $('#pre').on('click',function(){
    	currentsong -= 1;
    	if( currentsong === -1 ){
    		currentsong = database.length-1;
    	}
    	audio.src = database[ currentsong ].filename;
    	onsongchange();
    })
    

    //音量
    $('#heng').on('click',function(e){
        audio.volume = e.offsetX / $(this).width();
    })

    $('#voice').on('click',function(){
    	if( audio.volume === 0 ){
    		audio.volume = yuanlai;
    	}else{
    		yuanlai = audio.volume;
    		audio.volume = 0;
    	}
    })


    $(audio).on('volumechange',function(){
    	if( audio.volume === 0 ){
    		$('#voice').removeClass('volume_icon').addClass('volume_mute');
    		$('#have-heng').width(0);
    		$('#dian').css('left',0);
    	}else{
    		$('#voice').removeClass('volume_mute').addClass('volume_icon');
    		var width = audio.volume.toFixed(2)*100 + '%';
    		$('#have-heng').width(width);
    		$('#dian').css('left',width);
    	}
    })

    
    //歌曲播放时长
    audio.ontimeupdate = function(){
        var time = audio.currentTime / audio.duration;
        var width = time.toFixed(2) * 100 + '%';
        $('#zhong').width(width);
        $('#shang').css('left',width);
    }
    
    $('#xia').on('click',function(e){
        audio.currentTime = audio.duration * ( e.offsetX / $(this).width() );
    })


    //点击列表操作
    $('.span').on('click',function(){
    	$('.play-top').css('height',0);
    })
    $('.open-list').on('click',function(){
    	$('.play-top').css('height',508);
    })

    //点击收回
    $('.shou').on('click',function(){
        if( $('.play-top').height() === 0 ){
            $('.play-box').toggleClass('play-box-shou-two');
        }else{
            $('.play-box').toggleClass('play-box-shou');
        }
    	$('#shou').toggleClass('shou-shang');
    	$('#shou').toggleClass('shou-xia');
    })

    //列表播放方式
    $('#play_bn').on('click',function(){
        $('.play-bar').css('display','block');
    })

    $('.play-bar').on('click','span',function(){
        var index = $(this).index();
        // if( index === 0 ){
        //     $('#play_bn').removeClass('cycle-inin').addClass('ordered');
        // }
        // if( index === 1 ){
        //     $('#play_bn').removeClass('cycle-inin').addClass('unordered');
        // }
        // if( index === 2 ){
        //     $('#play_bn').removeClass('cycle-inin').addClass('cycle-single');
        // }
        // if( index === 3 ){
        //     $('#play_bn').removeClass('cycle-inin').addClass('cycle-in');
        // }
        $('.play-bar').css('display','none');
    })

    //经过列表变化
    $('#divsonglist').on('mouseenter mouseleave','li',function(){
        var index = $(this).index();
        $('#divsonglist li').eq( index ).toggleClass('li_hover');
    })

    //点击删除
    $('#divsonglist').on('click','#delete',function(){
        var num = $(this).closest('li').index();
        database = $.grep(database,function(v,k){
            return k !== num;
        })
        $(this).closest('li').remove();
        $('.open-list span').text(database.length);
        return false;
    })
})