import sys
import os.path
from os import path
import time

def editDistDP(str1, str2, m, n): 
    # Create a table to store results of subproblems 
    dp = [[0 for x in range(n+1)] for x in range(m+1)] 
  
    # Fill d[][] in bottom up manner 
    for i in range(m+1): 
        for j in range(n+1): 
  
            # If first string is empty, only option is to 
            # insert all characters of second string 
            if i == 0: 
                dp[i][j] = j    # Min. operations = j 
  
            # If second string is empty, only option is to 
            # remove all characters of second string 
            elif j == 0: 
                dp[i][j] = i    # Min. operations = i 
  
            # If last characters are same, ignore last char 
            # and recur for remaining string 
            elif str1[i-1].lower() == str2[j-1].lower(): 
                dp[i][j] = dp[i-1][j-1] 
  
            # If last character are different, consider all 
            # possibilities and find minimum 
            else: 
                dp[i][j] = 1 + min(dp[i][j-1],        # Insert 
                                   dp[i-1][j],        # Remove 
                                   dp[i-1][j-1])    # Replace 
  
    return dp[m][n] 

def main():
	start_time = time.time()
	inWord = sys.argv[1]
	inDelta = sys.argv[2];
	inNumber = sys.argv[3];
	delta = int(inDelta)
	number = int(inNumber)
	wordsFile = "words.txt"
	#print(path.exists(wordsFile))

	if not os.path.isfile(wordsFile):
		print("Please first load a dictonary. ")
		sys.exit()

	pyParseRes = open("pyParseRes.txt", "w")
	with open(wordsFile) as fp:
		cnt = 0
		for line in fp:
			if cnt == number:
				break
			line = line.strip('\n')
			lineLen = len(line)
			inWordLen = len(inWord)
			if abs(lineLen - inWordLen) <= delta:
				if editDistDP(inWord, line, inWordLen, lineLen) == delta:
					print("\"" + line + "\"")
					pyParseRes.write(line+'\n')
					cnt += 1

	pyParseRes.close()

	print(time.time() - start_time)

if __name__== "__main__":
   main()