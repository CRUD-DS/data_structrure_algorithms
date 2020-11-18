//------------------- CONSTRUCTORS ---------------------//
// VERTEX
class vertex{
	constructor(){
		this.values = new Array(0);
	}
	add(w){
		this.values.push(w);
	}
}
// GRAPH
class graph{
	//-------------------- CONSTRUCTOR ---------------------//
	constructor(n){
		this.vertices = new Array(n).fill(1).map((r,rIndex)=> new vertex());
		this.nVertices = n;
		this.nEdges = 0;
	}
	//------------------ EDGE MANAGEMENT -------------------//
	// EDGE
	addEdge(v, w){
		this.nEdges++;
		this.vertices[v].add(w);
		this.vertices[w].add(v);
	}
	// GET ADJACENT POINTS
	adj(v){
		return this.vertices[v].values.map(r=> r);
	}
}
// PATH SEARCH OF EACH POINT TO POINT S.
class graphPathDFS{
	constructor(graph, s){
		let nVertices = graph.nVertices;
		// MARKING IF VERTEX IS VISITED
		this.marked = new Array(nVertices).fill(false);
		// WHICH POINT LED TO THIS POINT
		this.edgeTo = new Array(nVertices).fill(null);
		this.s = s;

		// USE RECURSIVE DEPTH FIRST SEARCH TO MAP PATH
		this.dfs(graph, s);
	}
	// RECURSIVE DEPTH FIRST SEARCH TO MAP PATH
	dfs(graph, v){
		this.marked[v] = true;
		for (let vertex of graph.adj(v)){
			// VISIT POINT
			if (!this.marked[vertex]){
				// MARK AS CHECKED
				this.marked[vertex] = true;
				// SET THE EDGETO AS POINT S.
				this.edgeTo[vertex] = v;
				this.dfs(graph, vertex);
			}
		}
	}
	// CHECK IF PATH FROM s TO v EXISTS
	hasPathTo(v){
		return this.marked[v];
	}
	// GET PATH FROM s TO v, RETURNS NULL IF NON-EXISTENT
	pathTo(v){
		if (!this.hasPathTo(v)) return null;
		let path = [];

		while(v !== this.s){
			path.push(v);
			v = this.edgeTo[v];
		}
		path.push(this.s);
		return path;
	}
}


//---------------------- INIT ----------------------//
// CONSTRUCT GRAPH: INIT
let nItems = 13, index;
let graphSystem = new graph(nItems);

// CONSTRUCT GRAPH: EDGES
let edges = [
	[0,5],
	[4,3],
	[0,1],
	[9,12],
	[6,4],
	[5,4],
	[0,2],
	[11,12],
	[9,10],
	[0,6],
	[7,8],
	[9,11],
	[5,3]
]
edges.forEach(e=> graphSystem.addEdge(e[0], e[1]));


//------------------ PATH FINDING ------------------//
// GET PATHS TO POINT 0.
let point = 0;
let dfsPaths = new graphPathDFS(graphSystem, point);

for (index = 0; index < graphSystem.nVertices; index++){
	console.log(point + " to " + index + "\t: " + dfsPaths.hasPathTo(index) + "\t" + dfsPaths.pathTo(index));
}