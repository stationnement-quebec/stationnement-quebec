/** Module to calculate geometry to know where to display the lines on the street */

function sqr(x) { return x * x }

function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }

function findDistanceToSegment(p, v, w){
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return dist2(p, { x: v.x + t * (w.x - v.x),y: v.y + t * (w.y - v.y) });
}

function findClosestSegment(point, segmentArray){
  if (segmentArray.length == 2 && !(segmentArray[0][0] instanceof Array)){
    return segmentArray;
  }
  else{
    var closestSegment=segmentArray[0];
    var closestDist;
    for (var i=0; i< segmentArray.length;i++){
      var segment = segmentArray[i];
      var v = {x:segment[0][0],y:segment[0][1]};
      var w = {x:segment[1][0],y:segment[1][1]};
      var p = {x:point[0],y:point[1]};
      var dist = findDistanceToSegment(p,v,w);
      if (closestDist==undefined || dist<closestDist){
        closestDist = dist;
        closestSegment = segment;
      }
    }
    return closestSegment;
  }
}

function projectPointOnLine(point, line){
  var x=point[0]; y=point[1];
  var x0=line[0][0]; var y0=line[0][1];
  var x1=line[1][0]; var y1=line[1][1];

  if (x0 == null)
      x0 = line[0];

  if(!(x1 - x0))
      point[0]=line[0];
  else if(!(y1 - y0))
      point[1]=y0;
  else{
    var left, tg = -1 / ((y1 - y0) / (x1 - x0));
    var result ={x: left = (x1 * (x * tg - y + y0) + x0 * (x * - tg + y - y1)) / (tg * (x1 - x0) + y0 - y1), y: tg * left - tg * x + y};
    point[0]=result.x;
    point[1]=result.y;
  }
  return point;
}

module.exports.findClosestSegment = findClosestSegment;
module.exports.projectPointOnLine = projectPointOnLine;
