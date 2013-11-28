-- daily139.hs
-- Ian Feeley

{- Challenge #139 [Easy] Pangrams
"Wikipedia has a great definition for Pangrams: "A pangram or holoalphabetic sentence for a given 
alphabet is a sentence using every letter of the alphabet at least once." A good example is the 
English-language sentence: "The quick brown fox jumps over the lazy dog";note how all 26 
English-language letters are used in the sentence.

Your goal is to implement a program that takes a series of strings (one per line) and prints either 
True (the given string is a pangram), or False (it is not)."

source: http://www.reddit.com/r/dailyprogrammer/comments/1pwl73/11413_challenge_139_easy_pangrams/
-}

import Data.Char

main = do
	let example1 = "The quick brown fox jumps over the lazy dog."
	let example2 = "Pack my box with five dozen liquor jugs"
	let example3 = "THis wont work!"

	let output1 = isPangram example1
	let output2 = isPangram example2
	let output3 = isPangram example3


	putStrLn output1 -- expected True
	putStrLn output2 -- expected True
	putStrLn output3 -- expected False

isPangram :: String -> String
{-Tests if input string is a pangram, returns the string True is the input is a pangram,
or False if the input is not a pangram.-}
isPangram str = if all( `elem` (map toLower str)) ['a'..'z'] == True then "True" else "False"
	-- all takes a boolean and a list and returns true if all items in the list fulfill the condition
		--elem takes a value of type a and a list[a] and returns a boolean, true if that value is in the list