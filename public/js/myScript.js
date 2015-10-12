/**
 * Created by ricardomendes on 14/05/15.
 */
$(document).ready(function() {
  var snake = [{x: 4, y: 4}, {x: 3, y: 4}, {x: 2, y: 4}];
  var food = [{x: 1, y: 2}];
  var direction = {x: 1, y: 0};
  var nextMoves = [];

  var interval_id = setInterval(tick, 100)

  //setTimeout(function() {for(i = 0; i<10000; ++i) clearInterval(i)}, 3000000)


  gridsize = 40

  var scale = d3.scale.ordinal()
      .domain(d3.range(gridsize))
      .rangeRoundBands([0, $('svg').height()], 0.0)
  //console.log(scale(0));
  //console.log($('svg').height());
  //console.log(scale(gridsize-1));

  function update_snake() {
    var svg = d3.select('svg');
    var cells = svg.selectAll('rect.snake')
        .data(snake, function(d) {return JSON.stringify(d) });

    cells.enter()
      .append('rect')
        .attr('class', 'snake')
        .attr('width', scale.rangeBand())
        .attr('height', scale.rangeBand())
        .attr('x', function(d) {return scale(d.x)})
        .attr('y', function(d) {return scale(d.y)});

     cells.exit().remove();
     // console.log('updated!')
  }

  function points_are_equal(p1, p2) {
    return (p1.x === p2.x) && (p1.y === p2.y);
  }

  Array.prototype.contains_point = function(obj) {
      var i = this.length;
      while (i--) {
          if (points_are_equal(this[i], obj)) {
              return true;
          }
      }
      return false;
  }

  Array.prototype.remove_point = function(obj) {
      var i = this.length;
      while (i--) {
          if (points_are_equal(this[i], obj)) {
              return this.splice(i, 1);
          }
      }
      return false;
  }

  function add_pairs(p1, p2) {
    return {x: p1.x + p2.x, y: p1.y + p2.y}
  }

  function outside_boundaries(point) {
    return point.x < 0
        || point.y < 0
        || point.x >= gridsize
        || point.y >= gridsize;
  }

  function tick() {
    if (nextMoves.length > 0) {
      direction = nextMoves.shift();
    }
    new_beginning = add_pairs(snake[0], direction);
    if (snake.contains_point(new_beginning)
      || outside_boundaries(new_beginning) ) {
      clearInterval(interval_id);
      alert('GAME OVER');
      return;
    }
    if (food.remove_point(new_beginning)) {
      snake.unshift(new_beginning);
      make_new_food()
      update_food();
      update_snake();
    } else {
      snake.pop();
      snake.unshift(new_beginning);
      update_snake();
    }
  }

  function check_collision(point) {
    return snake.contains_point(point);
    return false;
  }

  var directionMap = {
    39: {x: 1, y: 0}, // right
    37: {x: -1, y: 0}, // left
    38: {x: 0, y: -1}, // up
    40: {x: 0, y: 1} // down
  }

  function is_opposite(dir1, dir2) {
    return dir1.x === -dir2.x && dir1.y === -dir2.y;
  }

  function update_food() {
    var cells = d3.select('svg').selectAll('rect.food')
      .data(food, function(d) {return JSON.stringify(d) });

    cells.enter()
      .append('rect')
      .attr('class', 'food')
      .attr('width', scale.rangeBand())
      .attr('height', scale.rangeBand())
      .attr('x', function(d) {return scale(d.x)})
      .attr('y', function(d) {return scale(d.y)});

    cells.exit().remove();
  }

  function make_new_food() {
    while(true) {
      new_food = {
        x: Math.floor(Math.random() * gridsize),
        y: Math.floor(Math.random() * gridsize)
      }
      if(!snake.contains_point(new_food)) {
        food.push(new_food);
        update_food()
        return;
      }
    }
  }

  update_food()

  d3.select(window)
    .on("keydown", function(event) {
      //console.log(d3.event);      
      var candidateDirection =  directionMap[d3.event.keyCode];
      if(!candidateDirection || is_opposite(candidateDirection, direction)) {
        return;
      }
      d3.event.preventDefault();
      nextMoves.push(candidateDirection);
    });
})
