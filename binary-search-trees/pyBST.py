##----------------------- IMPORT -----------------------##
import numpy as np;


##-------------------- CONSTRUCTORS --------------------##
# NODES
class Node:
	def __init__(self, key, val):
		self.key = key;
		self.val = val;
		self.left = None;
		self.right = None;
		self.isRed = True;

# BST
class bst:
	##-------------------- CONSTRUCTOR ---------------------##
	def __init__(self):
		self.root = None;
	##----------------- R-B IMPLEMENTATION -----------------##
	# CHECK IF NODE IS RED
	def isRed(self, node):
		# EMPTY NODES AARE B.
		if (node == None): return False;
		return node.isRed;
	# ROTATIONS
	def rotateLeft(self, node):
		# ROTATE
		s = node.right;
		node.right = s.left;
		s.left = node;
		# RELABEL REDNESS
		s.isRed = node.isRed;
		node.isRed = True;
		return s;
	def rotateRight(self, node):
		# ROTATE
		s = node.left;
		node.left = s.right;
		s.right = node;
		# RELABEL REDNESS
		s.isRed = node.isRed;
		node.isRed = True;
		return s;
	def flipColors(self, node):
		node.left.isRed = False;
		node.right.isRed = False;
		node.isRed = True;
	##---------------------- ADD KEY -----------------------##
	def addKey(self, key, val):
		self.root = self.addKeyPriv(self.root, key, val);
	def addKeyPriv(self, node, key, val):
		# CREATE NEW NODE
		if (node == None): return Node(key, val);

		# LEFT / RIGHT TREE
		if (key < node.key): 
			node.left = self.addKeyPriv(node.left, key, val);
		elif (key > node.key): 
			node.right = self.addKeyPriv(node.right, key, val);
		else:
			node.val = val; 

		# TREE BALANCING USING R-B LABLES
		# WRONG DIRECTION
		if (self.isRed(node.right)):
			if (not self.isRed(node.left)):
				node = self.rotateLeft(node);
		# DOUBLE RED
		if (self.isRed(node.left)):
			if (self.isRed(node.left.left)):
				node = self.rotateRight(node);
		# RAISE
		if (self.isRed(node.left)):
			if (self.isRed(node.right)):
				self.flipColors(node);

		return node;
	##--------------------- ITERATION ----------------------##
	# LEFT > ROOT > RIGHT
	def inOrder(self):
		output = [];
		output = self.inOrderPriv(self.root, output);
		return output;
	def inOrderPriv(self, node, output):
		if (node.left != None):
			output = self.inOrderPriv(node.left, output);
		output.append(Node(node.key, node.val));
		if (node.right != None):
			output = self.inOrderPriv(node.right, output);
		return output;
	# ROOT > LEFT > RIGHT
	def preOrder(self):
		output = [];
		output = self.preOrderPriv(self.root, output);
		return output;
	def preOrderPriv(self, node, output):
		output.append(Node(node.key, node.val));
		if (node.left != None):
			output = self.preOrderPriv(node.left, output);
		if (node.right != None):
			output = self.preOrderPriv(node.right, output);
		return output;
	# LEFT > RIGHT > ROOT
	def postOrder(self):
		output = [];
		output = self.postOrderPriv(self.root, output);
		return output;
	def postOrderPriv(self, node, output):
		if (node.left != None):
			output = self.postOrderPriv(node.left, output);
		if (node.right != None):
			output = self.postOrderPriv(node.right, output);
		output.append(Node(node.key, node.val));
		return output;


##-------------------- INIT & TEST ---------------------##
# INIT
bstSystem = bst();
items = [
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

## INSERT
for i in range(0, len(items)):
	bstSystem.addKey(items[i][0], items[i][1])

## LIST
print("\nIN ORDER:");
array = bstSystem.inOrder()
for i in range(0, len(array)):
	print("%0.2f, %s"%(array[i].key, array[i].val));
print("\nPre ORDER:");
array = bstSystem.preOrder()
for i in range(0, len(array)):
	print("%0.2f, %s"%(array[i].key, array[i].val));
print("\nPost ORDER:");
array = bstSystem.postOrder()
for i in range(0, len(array)):
	print("%0.2f, %s"%(array[i].key, array[i].val));
