#include <sys/stat.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <cctype>
#include <limits.h>
#include <math.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <chrono>
using namespace std;

int distT(string X, int m, string Y, int n)
{
    int T[m+1][n+1] = { 0 };

    for (int i = 1; i <=m ; i++)
    {
        T[i][0] = i;
    }

    for (int j = 1; j <= n; j++)
    {
        T[0][j] = j;
    }

    int cost;

    for (int i = 1; i <= m; i++)
    {
        for (int j = 1; j <= n; j++)
        {
            if (tolower(X[i-1]) == tolower(Y[j-1]))
                cost = 0;
            else
                cost = 1;
        
            T[i][j] = min(min(T[i-1][j] + 1, T[i][j-1] + 1), T[i-1][j-1] + cost);
        }
    }

    return T[m][n];
}

inline bool exists_test3 (const std::string& name) {
  struct stat buffer;   
  return (stat (name.c_str(), &buffer) == 0); 
}

int main(int argc, char **argv)
{
    chrono::high_resolution_clock::time_point t1 = chrono::high_resolution_clock::now();
    if (argc != 4)
    {
        cout << "input message wrong." << endl;
    }
    else
    {
    
        string inWord = argv[1];
        string inDelta = argv[2];
        string inNumber = argv[3];

        int delta = stoi(inDelta);
        int number = stoi(inNumber);

/*
#ifdef __linux__
        string homeDir = getenv("HOME");
        string downloadDir = homeDir + "/Downloads";
        string wordsFile = downloadDir + "/words.txt";
#endif

#ifdef _WIN32
        string homeDir = getenv("USERPROFILE");
        string downloadDir = homeDir + "\\Downloads";
        string wordsFile = downloadDir + "\\words.txt";
#endif
*/
        ofstream outfile;
        outfile.open("parseResultEnc.txt");         
        int count = 0;
        string wordsFile = "words.txt";

        if (exists_test3(wordsFile))
        {
            ifstream infile (wordsFile);
            string line;
            //vector<string> wordVec;
            if (infile.is_open())
            {
                while (getline(infile,line))
                {
                    //wordVec.push_back(line);
                    if (count == number)
                    {
                        break;
                    }

                    int len = line.length();
                    int inWordLen = inWord.length();
                    if (abs(len - inWordLen) <= delta)
                    {
                        if (distT(inWord, inWordLen, line, len) == delta)
                        {
                            cout << "\"" << line << "\"" << endl;
                            outfile << line;
                            outfile << "\n";
                            count++;
                        }
                    }
                }
                infile.close();
            }
            //string test = "Acarina";
            //cout << distR(test, test.length(), inWord, inWord.length()) << endl;
            //cout << distT(test, test.length(), inWord, inWord.length()) << endl;
            outfile.close();
        }
        else
        {
            cout << "Please first download dictonary. " << endl;
        }
    }

    chrono::high_resolution_clock::time_point t2 = chrono::high_resolution_clock::now();

    auto duration = chrono::duration_cast<chrono::microseconds>( t2 - t1 ).count();

    cout << duration/1000 << " millisecond" << endl;

    return 0;
}
