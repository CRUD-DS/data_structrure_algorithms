//------------------- CONSTRUCTORS ---------------------//
class Node{
	constructor(key, val){
		this.key = key;
		this.val = val;
		this.left = null;
		this.right = null;
		this.isRed = true;
	}
}
class bst{
	//-------------------- CONSTRUCTOR ---------------------//
	constructor(){
		this.root = null;
	}
	//----------------- R-B IMPLEMENTATION -----------------//
	// CHECK IF NODE IS RED
	isRed(node){
		// EMPTY NODES ARE B
		if (!node) return false;
		return node.isRed;
	}
	// ROTATIONS
	rotateLeft(node){
		// ROTATE
		let s = node.right;
		node.right = s.left;
		s.left = node;
		// RELABEL REDNESS
		s.isRed = node.isRed;
		node.isRed = true;
		return s;
	}
	rotateRight(node){
		// ROTATE
		let s = node.left;
		node.left = s.right;
		s.right = node;
		// RELABEL REDNESS
		s.isRed = node.isRed;
		node.isRed = true;
		return s;
	}
	flipColor(node){
		node.left.isRed = false;
		node.right.isRed = false;
		node.isRed = true;
	}

	//---------------------- ADD KEY -----------------------//
	addKey(key, val){
		this.root = this.addKeyPriv(this.root, key, val);
	}
	addKeyPriv(node, key, val){
		if (!node) return new Node(key, val);

		// LEFT / RIGHT TREE
		if (key < node.key) node.left = this.addKeyPriv(node.left, key, val);
		else if (key > node.key) node.right = this.addKeyPriv(node.right, key, val);
		else node.val = val;

		// BALANCING USING R-B LABELS
		// WRONG DIRECTION
		if (this.isRed(node.right)){
			if (!this.isRed(node.left)){
				node = this.rotateLeft(node);
			}
		}
		// DOUBLE RED
		if (this.isRed(node.left)){
			if (this.isRed(node.left.left)){
				node = this.rotateRight(node);
			}
		}
		// RAISE
		if (this.isRed(node.right)){
			if (this.isRed(node.left)){
				this.flipColor(node);
			}
		}

		// RETURN NODE
		return node;
	}
	//--------------------- ITERATION ----------------------//
	// LEFT > ROOT > RIGHT
	inOrder(){
		let stack = [this.root];
		let values = [];
		let currentNode;

		// LIFO STACK INSTEAD OF RECURSIVE DFS
		while (stack.length > 0){
			currentNode = stack.pop();
			if (currentNode){
				if (currentNode.right){
					stack.push(currentNode.right);
					stack.push(new Node(currentNode.key, currentNode.val));	// EMPTY NODE FOR VALUE ADDITION PURPOSE
					if (currentNode.left){
						stack.push(currentNode.left);
					}
				}
				else if (currentNode.left){
					stack.push(new Node(currentNode.key, currentNode.val));
					stack.push(currentNode.left);
				}
				else{
					values.push({key: currentNode.key, val: currentNode.val});
				}
			}
		}
		return values;
	}
	// ROOT > LEFT > RIGHT
	preOrder(){
		let stack = [this.root];
		let values = [];
		let currentNode;

		// LIFO STACK INSTEAD OF RECURSIVE DFS
		while (stack.length > 0){
			currentNode = stack.pop();
			if (currentNode){
				if (currentNode.right){
					stack.push(currentNode.right);
					if (currentNode.left){
						stack.push(currentNode.left);
					}
					stack.push(new Node(currentNode.key, currentNode.val));	// EMPTY NODE FOR VALUE ADDITION PURPOSE
				}
				else if (currentNode.left){
					stack.push(currentNode.left);
					stack.push(new Node(currentNode.key, currentNode.val));
				}
				else{
					values.push({key: currentNode.key, val: currentNode.val});
				}
			}
		}
		return values;
	}
	postOrder(){
		let stack = [this.root];
		let values = [];
		let currentNode;

		// LIFO STACK INSTEAD OF RECURSIVE DFS
		while (stack.length > 0){
			currentNode = stack.pop();
			if (currentNode){
				if (currentNode.right){
					stack.push(new Node(currentNode.key, currentNode.val));	// EMPTY NODE FOR VALUE ADDITION PURPOSE
					stack.push(currentNode.right);
					if (currentNode.left){
						stack.push(currentNode.left);
					}
				}
				else if (currentNode.left){
					stack.push(new Node(currentNode.key, currentNode.val));
					stack.push(currentNode.left);
				}
				else{
					values.push({key: currentNode.key, val: currentNode.val});
				}
			}
		}
		return values;
	}
}


//-------------------- INIT & TEST ---------------------//
// INIT
let bstSystem = new bst();
let items = [
	[0.1, "wow0"],
	[0.4, "wow1"],
	[0.3, "wow2"],
	[0.7, "wow3"],
	[-0.1, "wow4"],
	[12.4, "wow5"],
	[-2.4, "wow6"],
	[-3, "wow7"],
	[-104, "wow8"],
]

// INSERT
items.forEach(r=> bstSystem.addKey(r[0], r[1]));

// LIST
console.log("IN ORDER:");
bstSystem.inOrder().forEach(r=>{
	console.log(r.key, r.val);
})
console.log("PRE ORDER:");
bstSystem.preOrder().forEach(r=>{
	console.log(r.key, r.val);
})
console.log("POST ORDER:");
bstSystem.postOrder().forEach(r=>{
	console.log(r.key, r.val);
})

// TREE
console.log("BALANCED TREE:");
console.log(JSON.stringify(bstSystem.root, null, "\t"));