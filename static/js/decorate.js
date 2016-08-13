
$(function() {
    $(document).ready(function(){
        
        generateGarden(10,10,80);
        decorateCell(0,0);
        decorateCell(4,6);
        decorateCell(0,3);
        decorateCell(4,2);
    });
    
    var myMove = function() {
      var pos = 0;
      var counter=0;
      var a=0;
      var id = setInterval(frame, 500);
      function frame() {
        if (pos == 350) {
          clearInterval(id);
        } else {
          //pos++;
           // console.log("Hihi");
          a=(counter%2)*5;
          counter++;
          $(".plant").css("marginTop", (pos +a)+'px');

        }
      }
    }
    var decorateCell = function(x_axis, y_axis){
         decoratedcell = '.cell[x='+x_axis+'][y='+y_axis+']';
         myplant='<img src="../img/redflower.png">'
         
        $(myplant).attr('id','myFlower').addClass("plant").appendTo(decoratedcell);

        myMove();
    }
    var generateGarden = function(mylength, mywidth, celldim){
        $('.garden').width(mywidth*(celldim+2));
        for( i = 0; i < mylength; i++){
            for( j=0; j<mywidth; j++){
                $('<div></div>').attr('id', i * 8 + j).attr('class', 'cell').attr('x', i).attr('y', j).appendTo(".garden");
            }
        }
        $('.cell').height(celldim).width(celldim);
    }
    
    var generatePlane = function(mywidth, myheight, mydepth){
        var shortFaces = '.front, .back, .left, .right';
        var longFaces = '.top, .bottom';
        var front = '.front';
        var back = '.back';
        var top = '.top';
        var bottom = '.bottom';
        var left = '.left';
        var right = '.right';
        
        $(shortFaces).height(myheight).width(mywidth);
        $(longFaces).height(mydepth).width(mywidth);
        
        $(front).css('webkitTransform', "rotateX(0deg) translate3d(0, 0, "+myheight/-2+"px)" );
        $(back).css('webkitTransform', "rotateX(-180deg) translate3d(0, 0, "+myheight/-2+"px)" );
        $(top).css('webkitTransform', "rotateX(-90deg) translate3d(0, 0, "+mydepth/-2+"px)" );
        $(bottom).css('webkitTransform', "rotateX(90deg) translate3d(0, 0, "+mydepth/-2+"px)" );
        $(left).css('webkitTransform', "rotateY(90deg) translate3d(0, 0, "+mywidth/-2+"px)" );
        $(right).css('webkitTransform', "rotateY(-90deg) translate3d(0, 0, "+mywidth/-2+"px)" );
    }
});

$(function() {
    
    
    
});



        