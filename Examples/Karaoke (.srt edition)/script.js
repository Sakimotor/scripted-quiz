function quiz($quiz, $player, $scope, $room, $chat, $me, $timeout){


//Karaoke Script by black_alba


    $quiz.on('trigger-load-srt',p=>{
    // load-srt $file:file
    // load-srt $mode:string
    let debut = new Date();
    srt_to_chat(p, debut);
    });
    
	$quiz.on('trigger-end-dialog',()=>{
	    $('.chat-dialog').remove();
	    $('.chat-translate').remove();
	});
	
	

    
function chat_dialog(m,t,d)
    {
        let p = [];
        //p.text = t.split("\\n").join("\n");
        p.text = t;
        p.delay = d;
        console.log(p);
        
        p.mount = e=>{
            p.e=e;
            $('chat').append(e);
            animate(e.find('div'),p.text,p.delay||1);
            $timeout(t=>$chat.scrollToBottom());
        };
        console.log(p);
        if($scope[m]) p.mount($scope[m].e);
        $scope[m] = p;
    }
    
    
    function animate(e,t,d){
        var str = '<span>';
        var L = t.length;
        t.split(' ').forEach(w=>{
            str+='<b class="q-word">';
            for(var i=0;i<w.length;i++){
                var C = w.charAt(i);
                if(C=='"') C = '&quot;';
                if(C=='-') str+='<b class="q-c q-dash">_</b>';
                else if(C=='\n') str+='<br class="q-c">';
                else str+='<b class="q-c">'+C+'</b>';
            }
            str+='</b><b> </b>';
        });
        str+='</span>';
        e.html(str);
        e = e.find('span');
        var ja = e.find('.q-c');
        var k=0;
        ja.each((i,b)=>{
            if(b.tagName=='BR') k+=d*5/1000;
            b.style.opacity=0;
            TweenMax.to(b,0.3,{alpha:1,delay:k});
            k+=d*1/1000;
        });
    }
//End of alba's Script

    //Script to display captions from an SRT file, fetch part taken from random stackoverflow post
    function srt_to_chat(p, debut){
         let f = $quiz.getFileURL(p.file);
        fetch(f).then(function(response) {
    response.text().then(function(text) {
      let storedText = text;
      let subs = parse_srt(storedText);
      let curtime = 0;
      
      //let fin = new Date();
      //let delai = fin.getTime() - debut.getTime();
      
      
      for (let sub in subs){
          
          let s = subs[sub];
          console.log(s);
          let t = s.text;
        //Et là ça coince
        
        //console.log("Times:"+s.end+","+s.start+","+t.length);
        let d = Math.round((s.end - s.start) / t.length);
        
        let cur = new Date();
        curtime = cur - debut;
        console.log("temps exéc: " + curtime);
        let startwait = 0;
        if (curtime < s.start) startwait = s.start-curtime;
        console.log("startwait: ", startwait);
        
        $timeout( () => {chat_dialog(p.mode,t,d)}, startwait);
            
      }
      
    });
  });
        
    }
    


//SRT parsing code, found at https://github.com/menismu/popcorn-js/blob/master/parsers/parserSRT/popcorn.parserSRT.js

// Simple function to convert HH:MM:SS,MMM or HH:MM:SS.MMM to MM
  // Assume valid, returns 0 on error
  function toMS( t_in ) {
    let t = t_in.split( ':' );

    try {
      let s = t[2].split( ',' );

      // Just in case a . is decimal seperator
      if ( s.length === 1 ) {
        s = t[2].split( '.' );
      }
      return (parseFloat( t[0], 10 ) * 3600 + parseFloat( t[1], 10 ) * 60 + parseFloat( s[0], 10 ) + parseFloat( s[1], 10 ) / 1000) * 1000;
    } catch ( e ) {
      return 0;
    }
  }

  function nextNonEmptyLine( linesArray, position ) {
    let idx = position;
    while ( !linesArray[idx] ) {
      idx++;
    }
    return idx;
  }


function lastNonEmptyLine( linesArray ) {
    let idx = linesArray.length - 1;

    while ( idx >= 0 && !linesArray[idx] ) {
      idx--;
    }
    
    return idx;
  }

    function parse_srt(srt){

        let subs = [],
        i = 0,
        idx = 0,
        lines,
        time,
        text,
        endIdx,
        sub;

    // Here is where the magic happens
    // Split on line breaks
    lines = srt.split( /(?:\r\n|\r|\n)/gm );
    endIdx = lastNonEmptyLine( lines ) + 1;

    for( i=0; i < endIdx; i++ ) {
      sub = {};
      text = [];

      i = nextNonEmptyLine( lines, i );
      sub.id = parseInt( lines[i++], 10 );

      // Split on '-->' delimiter, trimming spaces as well
      time = lines[i++].split( /[\t ]*-->[\t ]*/ );

      sub.start = toMS( time[0] );

      // So as to trim positioning information from end
      idx = time[1].indexOf( " " );
      if ( idx !== -1) {
        time[1] = time[1].substr( 0, idx );
      }
      sub.end = toMS( time[1] );

      // Build single line of text from multi-line subtitle in file
      while ( i < endIdx && lines[i] ) {
        text.push( lines[i++] );
      }

      // Join into 1 line, SSA-style linebreaks
      // Strip out other SSA-style tags
      sub.text = text.join( "\\N" ).replace( /\{(\\[\w]+\(?([\w\d]+,?)+\)?)+\}/gi, "" );

      // Escape HTML entities
      sub.text = sub.text.replace( /</g, "&lt;" ).replace( />/g, "&gt;" );

      // Unescape great than and less than when it makes a valid html tag of a supported style (font, b, u, s, i)
      // Modified version of regex from Phil Haack's blog: http://haacked.com/archive/2004/10/25/usingregularexpressionstomatchhtml.aspx
      // Later modified by kev: http://kevin.deldycke.com/2007/03/ultimate-regular-expression-for-html-tag-parsing-with-php/
      sub.text = sub.text.replace( /&lt;(\/?(font|b|u|i|s))((\s+(\w|\w[\w\-]*\w)(\s*=\s*(?:\".*?\"|'.*?'|[^'\">\s]+))?)+\s*|\s*)(\/?)&gt;/gi, "<$1$3$7>" );
      sub.text = sub.text.replace( /\\N/gi, "\n" );
      subs.push(sub);
    }
    return subs;
        

    }
    
    
    $quiz.on('destroy', p=>{
	    $('.chat-dialog').remove();
	    $('.chat-translate').remove();
	});

}