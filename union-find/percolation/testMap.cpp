#include <stdio.h>
#include <stdlib.h>			// srand, rand

int main(){
	std::unordered_map<string, int> nice;
	nice["wow"] = 0;
	printf("%d\n", nice["wow"]);
	return 0;
}