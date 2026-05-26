I made this artwork for a mathematical art competition.

An [**apeirogon**](https://en.wikipedia.org/wiki/Apeirogon) is a polygon with infinitely many sides. It does not exist in regular Euclidean space, but it can exist in hyperbolic space. 

An [**ideal triangle**](https://en.wikipedia.org/wiki/Ideal_triangle) is a triangle with infinitely long sides. It also can’t exist in Euclidean space, but it can in hyperbolic space. Each pair of sides do not touch, but they get asymptotically close together. In the limit, we can say that they touch at an “ideal vertex” which is located “at infinity”. The sides also become parallel in the limit, so the angle between them is 0.

Since the angle at each ideal vertex is 0, we can tile the hyperbolic plane with infinitely many ideal triangles around each vertex.

This image depicts a tiling of ideal triangles. Its [*dual tiling*](https://mathworld.wolfram.com/DualTessellation.html) (the tiling whose vertices are faces of the original tiling) is a tiling of regular apeirogons.

The hyperbolic plane is represented here by the [*Poincaré disc*](https://en.wikipedia.org/wiki/Poincar%C3%A9_disk_model), which is the circle in the middle of the image. Although the lines of the triangles look curved, they are actually straight in hyperbolic space. The Poincaré disc distorts straight lines and distances, but it preserves angles: if two lines or curves meet at some angle in the Poincaré disc, that is the true angle in hyperbolic space.

Straight lines in hyperbolic space look like circles that intersect the boundary of the Poincaré disc at right angles. We can extend these lines outside the disc, even though this is not really part of the disc. When we do this, we end up with a *second copy* of hyperbolic space, consisting of the exterior of the disc! This is the [*circular inversion*](https://en.wikipedia.org/wiki/Inversive_geometry) of the Poincaré disc. In this image, the tiling outside the disc is an exact copy of the tiling inside the disc.

This artwork was created in Julia. Because every triangle can be translated onto another by some hyperbolic translation or rotation, every point in the space is rendered as a point inside the big triangle in the centre (with some extra colour shifting). Julia’s easy support for high-precision arithmetic greatly helped with the render.