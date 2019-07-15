#include <stdlib.h>
#include <stdio.h>

int main(int argc, char** argv) {
    printf("USERPROFILE = %s\n", getenv("USERPROFILE"));
    printf("HOMEDRIVE   = %s\n", getenv("HOMEDRIVE"));
    printf("HOMEPATH    = %s\n", getenv("HOMEPATH"));
    return 0;
}