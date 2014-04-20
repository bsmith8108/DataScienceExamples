/* A very simple testing example that is run by testing.html.  You'll want
 * to put your more interesting tests here.
 */
test( "Point.equals", function() {
  var point1 = new Point([0,1,2]);
  var point2 = new Point([0,1,0]);
  var point3 = new Point([0,1,0]);
  ok(point1.equals(point2) == false, "Passed!");
  ok(point2.equals(point3), "Passed!");
  ok(point1.equals(null) == false, "Passed!");
});

test("centerEquals", function() {
  var point1 = new Point([0,1,2]);
  var point2 = new Point([0,1,0]);
  var point3 = new Point([0,1,0]);
  var centers = [point1, point2];
  var centers2 = [point1, point3];
  var centers3 = [point2, point3];
  ok(centerEquals(centers, centers2), "Passed!");
  ok(!centerEquals(centers2, centers3), "Passed!");
});

test("kmeans", function() {
  var point1 = new Point([0,1,2]);
  var point2 = new Point([0,1,0]);
  var points = [point1, point2];
  console.log(kmeans(points, 2));
  ok(kmeans(points, 2).k == 2, "Passed.");
});

