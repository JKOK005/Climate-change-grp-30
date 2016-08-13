
$(function() {
    $(document).ready(function(){
        $.ajax({
          url: 'http://127.0.0.1:5000/1',
          dataType: 'json'
        }).done(function(response){
          var width = 0;
          var height = 0;
          response.trees.forEach(function(tree){
            // response is (growth_level, x, y)
            if (tree[1] > width)
              width = tree[1];
            if (tree[2] > height)
              height = tree[2];
          });
          sz = Math.min(375/height, 1252.0/width);

          console.log(width);
          console.log(height);
          generateGarden(width,height, sz);

          response.trees.forEach(function(tree){
            decorateCell(tree[1]-1, tree[2]-1, tree[0]);
          });
        });
        
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
    var decorateCell = function(x_axis, y_axis, lvl_growth){
         decoratedcell = '.cell[x='+x_axis+'][y='+y_axis+']';
         myplant='<img src="../static/img/redflower.png">'
         
        $(myplant).attr('id','myFlower').addClass("plant").appendTo(decoratedcell);

        myMove();
    }
    var generateGarden = function(mylength, mywidth, celldim){
        var garden_width = celldim * (mywidth + 1) + (mywidth) * 2 + 2;
        $('.garden').width(garden_width);
        console.log('calc(50% - ' + garden_width/2.0 + ')');
        $('.garden').css('margin-left', 'calc(50% - ' + garden_width/2.0 + 'px)');
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



        