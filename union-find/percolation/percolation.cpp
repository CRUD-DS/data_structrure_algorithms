#include <stdio.h>
#include <stdlib.h>			// srand, rand
#include <unordered_map>

//======================================================//
//                                                      //
//                      UNION-FIND                      //
//                                                      //
//======================================================//
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
			i = obj[i];	// GO UP THE TREE
		}
		return i;
	}
	// ALTER SIZE OF CLUSTER
	void addSize(int i, int dsz){
		while (i != obj[i]){
			i = obj[i];		// GO UP THE TREE
			sz[i] += dsz;	// ADD SIZE
		}
	}
	// CHECK CONNECTIVITY
	bool isConnected(int i, int j){
		return getRoot(i) == getRoot(j);
	}
	// CONNECT
	int connect(int i, int j){
		// SAME OBJECT
		if (i == j) return 0;

		// GET ROOTS
		int rootI = getRoot(i);
		int rootJ = getRoot(j);

		// MERGE SMALLER CLUSTER TO LARGER CLUSTER
		if (sz[rootI] < sz[rootJ]){
			obj[i] = j;
			addSize(i, sz[i]);
		}else{
			obj[j] = i;
			addSize(j, sz[j]);
		}
		return 0;
	}
	// DISCONNECT
	int disconnect(int i, int j){
		// SAME OBJECT
		if (i == j) return 0;
		// i CONNECTED TO j
		if (obj[i] == j){
			addSize(i, -sz[i]);
			obj[i] = i;
		}else if (obj[j] == i){
			addSize(j, -sz[j]);
			obj[j] = j;
		}
		return 0;
	}
};

//======================================================//
//                                                      //
//                     PERCOLATION                      //
//                                                      //
//======================================================//
class percolation: public uf  {
private:
	bool *states;
	double *probabilities;
	int nItems, len;
	unordered_map<int, std::vector<int> > neighbors;
public:
	// CONSTRUCTOR
	percolation(int length): uf(length*length) {
		// FIXED SEED.
		srand(0);
		
		// INIT VALUES
		len = length;
		nItems = length*length;
		probabilities = new double[nItems];
		states = new bool[nItems];
		for (int index = 0; index < nItems; index++){
			probabilities[index] = (double) rand()/RAND_MAX;
			states[index] = false;
			initNeighbors(index);
		}
	}
	// NEIGHBOR HANDLING
	void initNeighbors(int i){
		int offset = i % len;
		// TOP ROW
		if (i < len){
			// TOP LEFT : BOTTOM, RIGHT, BOT-RIGHT
			if (offset == 0){
				neighbors[i][0] = i + len;
				neighbors[i][1] = i + 1;
				neighbors[i][2] = i + len + 1;
			}
			// TOP RIGHT: BOTTOM, LEFT, BOT-LEFT
			else if (offset == (len - 1)){
				neighbors[i][0] = i + len;
				neighbors[i][1] = i - 1;
				neighbors[i][2] = i + len - 1;
			}
			// TOP MID  : RIGHT, BOT-LEFT, BOTTOM, BOT-RIGHT
			else{
				neighbors[i][0] = i + 1;
				neighbors[i][1] = i + len - 1;
				neighbors[i][2] = i + len;
				neighbors[i][3] = i + len + 1;
			}
		}
		// MID ROW
		else if (i < len*(len-1)){
			// LEFT : TOP, TOP RIGHT, RIGHT, BOT, BOT-RIGHT
			if (offset == 0){
				neighbors[i][0] = i - len;
				neighbors[i][1] = i - len + 1;
				neighbors[i][2] = i + 1;
				neighbors[i][3] = i + len;
				neighbors[i][4] = i + len + 1;
			}
			// RIGHT:  TOP, TOP LEFT, LEFT, BOT, BOT-LEFT
			else if (offset == (len - 1)){
				neighbors[i][0] = i - len;
				neighbors[i][1] = i - len - 1;
				neighbors[i][2] = i - 1;
				neighbors[i][3] = i + len - 1;
				neighbors[i][4] = i + len;
			}
			// MID  : TOP LEFT, TOP, TOP RIGHT, LEFT, RIGHT, BOT LEFT, BOT, BOT-RIGHT
			else{
				neighbors[i][0] = i - len - 1;
				neighbors[i][1] = i - len;
				neighbors[i][2] = i - len + 1;
				neighbors[i][3] = i - 1;
				neighbors[i][4] = i + 1;
				neighbors[i][5] = i + len - 1;
				neighbors[i][6] = i + len;
				neighbors[i][7] = i + len + 1;
			}
		}
		// BOT ROW
		else{
			// BOT LEFT : TOP, TOP RIGHT, RIGHT
			if (offset == 0){
				neighbors[i] = new int[3];
				neighbors[i][0] = i - len;
				neighbors[i][1] = i - len - 1;
				neighbors[i][2] = i + 1;
			}
			// BOT RIGHT: TOP LEFT, TOP, LEFT
			else if (offset == (len - 1)){
				neighbors[i] = new int[3];
				neighbors[i][0] = i - len - 1;
				neighbors[i][1] = i - len;
				neighbors[i][2] = i - 1;
			}
			// BOT MID  : TOP LEFT, TOP, TOP RIGHT, LEFT, RIGHT
			else{
				neighbors[i] = new int[5];
				neighbors[i][0] = i - len - 1;
				neighbors[i][1] = i - len;
				neighbors[i][2] = i - len + 1;
				neighbors[i][3] = i - 1;
				neighbors[i][4] = i + 1;
			}
		}
	}
	// CHECK IF SYSTEM IS PERCOLATING
	bool isPercolating(){
		// VAR DECLARATION
		int botOffset = len * (len - 1);
		int index, index2;
		int top, left, bottom, right;

		for (index = 0; index < len; index++){
			top = index;
			left = index*len;
			for (index2 = 0; index2 < len; index++){
				bottom = botOffset + index2;
				right = (index2 + 1)*len - 1;
				if (isConnected(left, right)) return true;
				if (isConnected(top, bottom)) return true;
			}
		}
		return false;
	}
	// Get PERCOLATION THRESHOLD USING MID POINT BISECTOR METHOD
	double getThreshold(){
		// INIT RANGE
		int low = 0;
		int up = nItems - 1;
		int mid = (low + up) / 2;

		// VAR DECLARATION
		bool percolating = false;
		int index;

		while(low < up - 1){
			printf("NANI-1\n");
			mid = (low + up) / 2;
			printf("NANI0\n");
			// SWITCH OFF POINTS IF PERCOLATING, SWITCH ON IF NOT.
			if (percolating){
				for (index = up; index >= mid; index--){
					printf("NANI OFF%d\n",index);
					switchOff(index);
				}
			}
			else{
				for (index = low; index <= mid; index++){
					printf("NANI ON%d\n",index);
					switchOn(index);
				}
			}
			printf("NANI1\n");

			// CHECK IF IT IS PERCOLATING.
			printf("NANI2\n");
			percolating = isPercolating();
			printf("NANI3\n");

			// RAISE BOUNDARY IF NOT, LOWER BOUNDARY IF IT IS.
			if (percolating){
				up = mid;
			}
			else{
				low = mid;
			}
			printf("NANI4\n");
		}
		return probabilities[mid];
	}
	// SWITCH ON OR OFF POINTS
	int switchOn(int i){
		// ALREADY ON
		if (states[i]) return 0;
		// GET NEIGHBORS
		int neigh[] = neighbors[i];
		int neighborsLen = sizeof(neigh)/sizeof(int);
		int neighborIndex, index;
		// CHECK NEIGHBORS
		printf("%d, %d\n", i, neighbors[i][0]);
		for (index = 0; index < neighborsLen; index++){
			neighborIndex = neigh[index];

			// CONNECT IF BOTH ARE ON.
			if (states[neighborIndex]){
				connect(i, neighborIndex);
			}
		}
		return 0;
	}
	int switchOff(int i){
		// ALREADY OFF
		if (!states[i]) return 0;

		int neighborsLen = sizeof(*neighbors[i])/sizeof(neighbors[i][0]);
		int neighborIndex, index;
		// CHECK NEIGHBORS
		for (index = 0; index < neighborsLen; index++){
			neighborIndex = neighbors[i][index];

			// CHECK IF NEIGHBOR IS ON. DISCONNECT IF IT IS.
			if (states[neighborIndex]){
				disconnect(i, neighborIndex);
			}
		}
		return 0;
	}
};

//======================================================//
//                                                      //
//                         MAIN                         //
//                                                      //
//======================================================//
int main(){
	printf("INIT\n");
	int sysLen = 100;
	percolation percSystem = percolation(sysLen);
	printf("INITED\n");

	printf("START\n");
	printf("%.5f", percSystem.getThreshold());
	printf("END\n");
	return 0;
}