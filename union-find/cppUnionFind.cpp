//------------------------ IMPORT ----------------------//
#include <stdio.h>


//------------------ UNION FIND CLASS ------------------//
class uf{
	private:
		// ARRAY OF OBJECTS TO TRACK WHICH PARENT NODE THEY POINT TO.
		int* obj;
		// ARRAY OF CLUSTER SIZES FOR WEIGHING.
		int* sz;
	public:
		// CONSTRUCTOR
		uf(int nItems){
			obj = new int[nItems];
			sz = new int[nItems];

			// INIT VALUES
			for (int index = 0; index < nItems; index++){
				obj[index] = index;
				sz[index] = 1;
			}
		}
		// GET ROOT OF OBJECT
		int getRoot(int i){
			while (i != obj[i]){
				obj[i] = obj[obj[i]];	// PATH COMPRESSION
				i = obj[i];	// GO UP THE TREE
			}
			return i;
		}
		// CHECK CONNECTIVITY
		bool isConnected(int i, int j){
			return getRoot(i) == getRoot(j);
		}
		// UNION
		int connect(int i, int j){
			// SAME OBJECT
			if (i == j) return 0;
			
			// GET ROOTS
			int rootI = getRoot(i);
			int rootJ = getRoot(j);

			// MERGE SMALLER CLUSTER TO LARGER CLUSTER
			if (sz[rootI] < sz[rootJ]){
				obj[rootI] = rootJ;
				sz[rootJ] += sz[rootI];
			}else{
				obj[rootJ] = rootI;
				sz[rootI] += sz[rootJ];
			}
			return 0;
		}
};

int main(){
	int nItems = 100;
	uf ufSystem = uf(nItems);

	// UNION: 0, 2
	printf("Is 0 and 2 connected? %d\n", ufSystem.isConnected(0, 2));

	printf("Unionizing 0 and 2.\n");
	ufSystem.connect(0, 2);

	printf("Is 0 and 2 now connected? %d\n", ufSystem.isConnected(0, 2));

	printf("Complex unions.\n");
	ufSystem.connect(2, 4);
	ufSystem.connect(9, 4);
	ufSystem.connect(3, 6);
	printf("Is 0 and 9 now connected? %d\n", ufSystem.isConnected(0, 9));
	printf("Is 9 and 3 now connected? %d\n", ufSystem.isConnected(9, 3));


	// EXERCISE: VISUALIZE HOW IS 0 CONNECTED TO 9?
	return 0;
}