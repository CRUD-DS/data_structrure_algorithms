##----------------------- IMPORT -----------------------##
import numpy as np;

##------------------ UNION FIND CLASS ------------------##
class uf:
	# CONSTRUCTOR
	def __init__(self, nItems):
		# ARRAY OF OBJECTS TO TRACK WHICH PARENT NODE THEY POINT TO.
		self.obj = np.array(range(0,nItems));

		# ARRAY OF CLUSTER SIZES FOR WEIGHING.
		self.sz = np.ones(nItems, dtype = int);

	# GET ROOT OF OBJECT
	def getRoot(self, i):
		while(i != self.obj[i]):
			self.obj[i] = self.obj[self.obj[i]];	# PATH COMPRESSION
			i = self.obj[i];	# GO UP THE TREE

	# CHECK CONNECTIVITY
	def isConnected(self, i, j):
		return self.getRoot(i) == self.getRoot(j);

	# UNION
	def union(self, i, j):
		# SAME OBJECT
		if (i == j): 
			return;
		
		# GET ROOTS
		rootI = self.getRoot(i);
		rootJ = self.getRoot(j);

		# MERGE SMALLER CLUSTER TO LARGER CLUSTER
		if (self.sz[rootI] < self.sz[rootJ]):
			self.obj[rootI] = rootJ;
			self.sz[rootJ] += self.sz[rootI];
		else:
			self.obj[rootJ] = rootI;
			self.sz[rootI] += self.sz[rootJ];



##-------------------- INIT AND TEST -------------------##
## INIT
nItems = 100;
ufSystem = uf(nItems);

## UNION: 0, 2
printf("Is 0 and 2 connected? %d"%(ufSystem.isConnected(0, 2)));

printf("Unionizing 0 and 2.");
ufSystem.union(0, 2);

printf("Is 0 and 2 now connected? %d"%(ufSystem.isConnected(0, 2)));

printf("Complex unions.");
ufSystem.union(2, 4);
ufSystem.union(9, 4);
ufSystem.union(3, 6);
printf("Is 0 and 9 now connected? %d"%(ufSystem.isConnected(0, 9)));
printf("Is 9 and 3 now connected? %d"%(ufSystem.isConnected(9, 3)));


## EXERCISE: VISUALIZE HOW IS 0 CONNECTED TO 9?