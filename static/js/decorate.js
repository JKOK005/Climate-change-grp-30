
$(function() {
    $(document).ready(function(){
        $.ajax({
          url: '/1',
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
          sz = Math.min(375/height, 900.0/width);

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

    var getGrowthLevel = function(lvl_growth){
      if (lvl_growth > 0.875)
        return 8;
      else if (lvl_growth > 0.75)
        return 7;
      else if (lvl_growth > 0.625)
        return 6;
      else if (lvl_growth > 0.5)
        return 5;
      else if (lvl_growth > 0.375)
        return 4;
      else if (lvl_growth > 0.25)
        return 3;
      else if (lvl_growth > 0.125)
        return 2;
      else if (lvl_growth > 0.0)
        return 1;
    }

    var imageName = function(lvl){
      var full_grown = ['cedar.png', 'maple.png', 'tree-10.png', 'wisteria.png', 'baobab.png'];
      if (lvl > 6){
        return 'tree/' + full_grown[Math.floor(Math.random() * 5)];
      } else if (lvl > 4) {
        return 'flower-plant.png';
      } else if (lvl > 3) {
        return 'longplant.png';
      } else {
        return 'flower-pot2.png';
      }
    }

    var decorateCell = function(x_axis, y_axis, lvl_growth){
         growthLevel = getGrowthLevel(lvl_growth);
         decoratedcell = '.cell[x='+x_axis+'][y='+y_axis+']';
         lvl = getGrowthLevel(lvl_growth);
         myplant='<img src="../static/img/' + imageName(lvl) + '">'
         
        $(myplant).attr('id','myFlower').addClass("plant").appendTo(decoratedcell);

        myMove();
    }
    var generateGarden = function(mywidth, myheight, celldim){
          console.log(mywidth);
          console.log(myheight);
          console.log(celldim);
        var garden_width = celldim * (mywidth) + (mywidth) * 2 + 2;
        $('.garden').width(garden_width);
        console.log('calc(50% - ' + garden_width/2.0 + ')');
        $('.garden').css('margin-left', 'calc(50% - ' + garden_width/2.0 + 'px)');
        for( i = 0; i < myheight; i++){
            for( j=0; j< mywidth; j++){
                $('<div></div>').attr('id', i * 8 + j).attr('class', 'cell').attr('y', i).attr('x', j).appendTo(".garden");
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



        